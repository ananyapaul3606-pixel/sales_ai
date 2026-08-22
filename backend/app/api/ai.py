from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.lead import Lead
from app.models.user import User

from app.schemas.lead import LeadResponse

from app.schemas.ai import (
    CompanyAnalysisRequest,
    CompanyAnalysis,
    OutreachRequest,
    OutreachResult
)

from app.core.dependencies import get_current_user

from app.services.ai.company_analysis import CompanyAnalysisEngine
from app.services.ai.outreach import OutreachEngine
from app.services.ai.crm_update import CRMUpdateEngine
from app.services.crm_service import apply_crm_update
from app.agents.sales_graph import build_sales_graph
from app.models.company_analysis import CompanyAnalysis as CompanyAnalysisModel
from app.models.lead_score import LeadScore
from app.models.outreach import Outreach
from app.models.follow_up import FollowUp


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


# =========================================
# COMPANY ANALYSIS
# POST /ai/company-analysis
# =========================================

@router.post(
    "/company-analysis",
    response_model=CompanyAnalysis
)
def analyze_company(
    data: CompanyAnalysisRequest
):
    engine = CompanyAnalysisEngine()

    result = engine.analyze_company(
        company_name=data.company_name,
        industry=data.industry,
        company_size=data.company_size,
        funding=data.funding,
        technology_stack=data.technology_stack,
        description=data.description
    )

    return result


# =========================================
# OUTREACH GENERATION
# POST /ai/outreach
# =========================================

@router.post(
    "/outreach",
    response_model=OutreachResult
)
def generate_outreach(
    data: OutreachRequest
):
    engine = OutreachEngine()

    result = engine.generate_outreach(
        lead_name=data.lead_name,
        job_title=data.job_title,
        company_name=data.company_name,
        industry=data.industry,
        company_analysis=data.company_analysis,
        lead_intelligence=data.lead_intelligence,
        lead_score=data.lead_score
    )

    return result


# =========================================
# AI CRM UPDATE
# POST /ai/leads/{lead_id}/crm-update
# =========================================

@router.post(
    "/leads/{lead_id}/crm-update",
    response_model=LeadResponse
)
def update_lead_with_ai(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find lead belonging to logged-in user
    lead = (
        db.query(Lead)
        .filter(
            Lead.id == lead_id,
            Lead.owner_id == current_user.id
        )
        .first()
    )

    # Lead doesn't exist
    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # Create AI engine
    engine = CRMUpdateEngine()

    # Ask AI what CRM changes should happen
    result = engine.generate_crm_update(
        lead_name=lead.name,
        company_name=lead.company or "",
        current_status=lead.status,
        lead_score=lead.score,
        conversation_summary=(
            lead.notes or
            "No conversation summary available."
        ),
        follow_up_recommendation=(
            "Review the lead and determine the next "
            "appropriate sales action."
        )
    )

    # Apply AI recommendation to database
    updated_lead = apply_crm_update(
        db=db,
        lead=lead,
        update=result
    )

    return updated_lead


# =========================================
# RUN COMPLETE AI SALES INTELLIGENCE
# POST /ai/leads/{lead_id}/run-intelligence
# =========================================

@router.post(
    "/leads/{lead_id}/run-intelligence"
)
def run_lead_intelligence(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # =========================================
    # FIND LEAD
    # =========================================

    lead = (
        db.query(Lead)
        .filter(
            Lead.id == lead_id,
            Lead.owner_id == current_user.id
        )
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # =========================================
    # BUILD LANGGRAPH
    # =========================================

    graph = build_sales_graph()

    # =========================================
    # RUN COMPLETE AI WORKFLOW
    # =========================================

    result = graph.invoke({

        "lead_name": lead.name,
        "job_title": lead.job_title or "",
        "company_name": lead.company or "",

        "industry": lead.industry or "",
        "company_size": lead.company_size or "",
        "funding": lead.funding or "",
        "technology_stack": lead.technology_stack or "",

        "description": lead.notes or "",

        "rule_based_score": lead.score or 0,

        "engagement_history": (
            lead.notes or
            "No engagement history available."
        ),

        "current_status": lead.status,
    })

    # =========================================
    # DEBUG
    # =========================================

    print("\n========== AI GRAPH RESULT ==========")
    print(result.keys())

    print("\nCompany Analysis:", result.get("company_analysis"))
    print("Lead Score:", result.get("lead_score"))
    print("Outreach:", result.get("outreach"))
    print("Follow Up:", result.get("follow_up"))
    print("CRM Update:", result.get("crm_update"))

    # =========================================
    # COMPANY ANALYSIS
    # UPDATE EXISTING OR CREATE NEW
    # =========================================

    if result.get("company_analysis"):

        analysis = result["company_analysis"]

        existing_analysis = (
            db.query(CompanyAnalysisModel)
            .filter(
                CompanyAnalysisModel.lead_id == lead.id
            )
            .first()
        )

        if existing_analysis:

            existing_analysis.business_needs = (
                "\n".join(analysis.business_needs)
            )

            existing_analysis.pain_points = (
                "\n".join(analysis.pain_points)
            )

            existing_analysis.opportunities = (
                "\n".join(analysis.opportunities)
            )

            if result.get("research"):
                existing_analysis.company_overview = (
                    result["research"].company_summary
                )

            if result.get("lead_intelligence"):
                existing_analysis.recommended_approach = (
                    result[
                        "lead_intelligence"
                    ].recommended_approach
                )

        else:

            company_analysis = CompanyAnalysisModel(

                lead_id=lead.id,

                company_overview=(
                    result["research"].company_summary
                    if result.get("research")
                    else None
                ),

                business_needs="\n".join(
                    analysis.business_needs
                ),

                pain_points="\n".join(
                    analysis.pain_points
                ),

                opportunities="\n".join(
                    analysis.opportunities
                ),

                recommended_approach=(
                    result[
                        "lead_intelligence"
                    ].recommended_approach
                    if result.get("lead_intelligence")
                    else None
                )
            )

            db.add(company_analysis)

    # =========================================
    # LEAD SCORE
    # UPDATE LATEST OR CREATE NEW
    # =========================================

    if result.get("lead_score"):

        ai_score = result["lead_score"]

        existing_score = (
            db.query(LeadScore)
            .filter(
                LeadScore.lead_id == lead.id
            )
            .order_by(
                LeadScore.id.desc()
            )
            .first()
        )

        if existing_score:

            existing_score.score = (
                ai_score.lead_score
            )

            existing_score.conversion_probability = (
                ai_score.conversion_probability
            )

            existing_score.tier = (
                ai_score.priority_level
            )

            existing_score.reasoning = (
                ai_score.reasoning
            )

        else:

            lead_score = LeadScore(

                lead_id=lead.id,

                score=ai_score.lead_score,

                conversion_probability=(
                    ai_score.conversion_probability
                ),

                tier=ai_score.priority_level,

                reasoning=ai_score.reasoning
            )

            db.add(lead_score)

    # =========================================
    # OUTREACH
    # UPDATE LATEST DRAFT OR CREATE NEW
    # =========================================

    if result.get("outreach"):

        outreach_result = result["outreach"]

        existing_outreach = (
            db.query(Outreach)
            .filter(
                Outreach.lead_id == lead.id,
                Outreach.status == "DRAFT"
            )
            .order_by(
                Outreach.id.desc()
            )
            .first()
        )

        if existing_outreach:

            existing_outreach.channel = "EMAIL"

            existing_outreach.subject = (
                outreach_result.subject
            )

            existing_outreach.message = (
                outreach_result.body
            )

        else:

            outreach = Outreach(

                lead_id=lead.id,

                channel="EMAIL",

                subject=outreach_result.subject,

                message=outreach_result.body,

                status="DRAFT"
            )

            db.add(outreach)

    # =========================================
    # FOLLOW-UP
    # UPDATE LATEST PENDING OR CREATE NEW
    # =========================================

    if result.get("follow_up"):

        follow_up_result = result["follow_up"]

        existing_follow_up = (
            db.query(FollowUp)
            .filter(
                FollowUp.lead_id == lead.id,
                FollowUp.status == "PENDING"
            )
            .order_by(
                FollowUp.id.desc()
            )
            .first()
        )

        if existing_follow_up:

            existing_follow_up.recommended_action = (
                follow_up_result.content_strategy
            )

            existing_follow_up.reason = (
                follow_up_result.reasoning
            )

        else:

            follow_up = FollowUp(

                lead_id=lead.id,

                recommended_action=(
                    follow_up_result.content_strategy
                ),

                reason=(
                    follow_up_result.reasoning
                ),

                status="PENDING"
            )

            db.add(follow_up)

    # =========================================
    # UPDATE MAIN LEAD
    # =========================================

    if result.get("lead_score"):

        lead.score = (
            result["lead_score"].lead_score
        )

        lead.score_label = (
            result["lead_score"].priority_level
        )

    if result.get("crm_update"):

        lead.status = (
            result["crm_update"].status
        )

    # =========================================
    # COMMIT
    # =========================================

    db.commit()

    db.refresh(lead)

    # =========================================
    # RETURN RESULTS
    # =========================================

    return {

        "lead_id": lead.id,

        "research": result.get(
            "research"
        ),

        "company_analysis": result.get(
            "company_analysis"
        ),

        "lead_intelligence": result.get(
            "lead_intelligence"
        ),

        "lead_score": result.get(
            "lead_score"
        ),

        "outreach": result.get(
            "outreach"
        ),

        "follow_up": result.get(
            "follow_up"
        ),

        "crm_update": result.get(
            "crm_update"
        )
    }