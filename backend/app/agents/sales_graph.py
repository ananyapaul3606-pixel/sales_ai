from typing import TypedDict

from app.schemas.ai import (
    CompanyAnalysis,
    LeadIntelligence,
    LeadScoreResult,
    OutreachResult,
    ResearchResult
)
from app.agents.research_agent import ResearchAgent
from app.services.ai.company_analysis import CompanyAnalysisEngine
from app.services.ai.lead_intelligence import LeadIntelligenceEngine
from app.services.ai.lead_scoring import AILeadScoringEngine
from app.services.ai.outreach import OutreachEngine
from langgraph.graph import StateGraph, START, END
from app.schemas.ai import (
    ResearchResult,
    CompanyAnalysis,
    LeadIntelligence,
    LeadScoreResult,
    OutreachResult,
    FollowUpRecommendation,
    CRMUpdateResult
)
from app.services.ai.follow_up import FollowUpEngine
from app.services.ai.crm_update import CRMUpdateEngine


class SalesState(TypedDict, total=False):

    lead_name: str
    job_title: str
    company_name: str
    industry: str
    company_size: str
    funding: str
    technology_stack: str
    description: str

    rule_based_score: int

    research: ResearchResult
    company_analysis: CompanyAnalysis
    lead_intelligence: LeadIntelligence
    lead_score: LeadScoreResult
    outreach: OutreachResult

    engagement_history: str
    current_status: str
    follow_up: FollowUpRecommendation

    crm_update: CRMUpdateResult

research_agent = ResearchAgent()
company_analysis_engine = CompanyAnalysisEngine()
lead_intelligence_engine = LeadIntelligenceEngine()
lead_scoring_engine = AILeadScoringEngine()
outreach_engine = OutreachEngine()
follow_up_engine = FollowUpEngine()
crm_update_engine = CRMUpdateEngine()

def research_node(state: SalesState):

    result = research_agent.research_company({
        "company_name": state["company_name"],
        "industry": state["industry"],
        "company_size": state["company_size"],
        "description": state["description"],
        "research": {}
    })

    state["research"] = ResearchResult.model_validate(
        result["research"]
    )

    return state

def company_analysis_node(state: SalesState):

    result = company_analysis_engine.analyze_company(
        company_name=state["company_name"],
        industry=state["industry"],
        company_size=state["company_size"],
        funding=state["funding"],
        technology_stack=state["technology_stack"],
        description=state["description"]
    )

    state["company_analysis"] = result

    return state

def lead_intelligence_node(state: SalesState):

    result = lead_intelligence_engine.analyze_lead(
        lead_name=state["lead_name"],
        job_title=state["job_title"],
        company_name=state["company_name"],
        industry=state["industry"],
        company_analysis=state["company_analysis"]
    )

    state["lead_intelligence"] = result

    return state


def lead_scoring_node(state: SalesState):

    result = lead_scoring_engine.score_lead(
        lead_name=state["lead_name"],
        job_title=state["job_title"],
        company_name=state["company_name"],
        industry=state["industry"],
        rule_based_score=state["rule_based_score"],
        company_analysis=state["company_analysis"],
        lead_intelligence=state["lead_intelligence"]
    )

    state["lead_score"] = result

    return state


def outreach_node(state: SalesState):

    result = outreach_engine.generate_outreach(
        lead_name=state["lead_name"],
        job_title=state["job_title"],
        company_name=state["company_name"],
        industry=state["industry"],
        company_analysis=state["company_analysis"],
        lead_intelligence=state["lead_intelligence"],
        lead_score=state["lead_score"]
    )

    state["outreach"] = result

    return state
def follow_up_node(state: SalesState):
    result = follow_up_engine.recommend_follow_up(
        lead_name=state["lead_name"],
        job_title=state["job_title"],
        company_name=state["company_name"],
        engagement_history=state["engagement_history"],
        current_status=state["current_status"]
    )

    state["follow_up"] = result

    return state


def crm_update_node(state: SalesState):
    result = crm_update_engine.generate_crm_update(
        lead_name=state["lead_name"],
        company_name=state["company_name"],
        current_status=state["current_status"],
        lead_score=state["lead_score"].lead_score,
        conversation_summary=state["description"],
        follow_up_recommendation=state["follow_up"].content_strategy
    )

    state["crm_update"] = result

    return state

def build_sales_graph():

    graph = StateGraph(SalesState)

    # =========================
    # REGISTER NODES
    # =========================

    graph.add_node(
        "research",
        research_node
    )

    graph.add_node(
        "company_analysis",
        company_analysis_node
    )

    graph.add_node(
        "lead_intelligence",
        lead_intelligence_node
    )

    graph.add_node(
        "lead_scoring",
        lead_scoring_node
    )

    graph.add_node(
        "outreach",
        outreach_node
    )

    graph.add_node(
        "follow_up",
        follow_up_node
    )

    graph.add_node(
        "crm_update",
        crm_update_node
    )

    # =========================
    # CONNECT NODES
    # =========================

    graph.add_edge(
        START,
        "research"
    )

    graph.add_edge(
        "research",
        "company_analysis"
    )

    graph.add_edge(
        "company_analysis",
        "lead_intelligence"
    )

    graph.add_edge(
        "lead_intelligence",
        "lead_scoring"
    )

    graph.add_edge(
        "lead_scoring",
        "outreach"
    )

    graph.add_edge(
        "outreach",
        "follow_up"
    )

    graph.add_edge(
        "follow_up",
        "crm_update"
    )

    graph.add_edge(
        "crm_update",
        END
    )

    return graph.compile()