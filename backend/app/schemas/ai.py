from pydantic import BaseModel, Field


class CompanyAnalysis(BaseModel):
    business_needs: list[str] = Field(default_factory=list)
    expansion_signals: list[str] = Field(default_factory=list)
    opportunities: list[str] = Field(default_factory=list)
    pain_points: list[str] = Field(default_factory=list)


class LeadIntelligence(BaseModel):
    qualification_reasoning: str
    decision_maker_probability: float = Field(
        ge=0.0,
        le=1.0
    )
    buying_signals: list[str] = Field(default_factory=list)
    recommended_approach: str


class LeadScoreResult(BaseModel):
    lead_score: int = Field(ge=0, le=100)
    conversion_probability: float = Field(
        ge=0.0,
        le=1.0
    )
    priority_level: str
    reasoning: str


class CompanyAnalysisRequest(BaseModel):
    company_name: str
    industry: str
    company_size: str
    funding: str
    technology_stack: str
    description: str


class OutreachResult(BaseModel):
    subject: str
    body: str
    personalization_points: list[str] = Field(
        default_factory=list
    )
    recommended_tone: str
    call_to_action: str

class OutreachRequest(BaseModel):
    lead_name: str
    job_title: str
    company_name: str
    industry: str

    company_analysis: CompanyAnalysis
    lead_intelligence: LeadIntelligence
    lead_score: LeadScoreResult


class ResearchResult(BaseModel):
    company_summary: str
    industry: str
    likely_business_needs: list[str] = Field(
        default_factory=list
    )
    potential_opportunities: list[str] = Field(
        default_factory=list
    )
    research_notes: list[str] = Field(
        default_factory=list
    )


class FollowUpRecommendation(BaseModel):
    recommended_timing: str
    recommended_channel: str
    content_strategy: str
    reasoning: str


class ConversationIntelligence(BaseModel):
    summary: str
    key_discussion_points: list[str] = Field(
        default_factory=list
    )
    action_items: list[str] = Field(
        default_factory=list
    )



class SalesInsights(BaseModel):
    overall_summary: str
    key_insights: list[str] = Field(
        default_factory=list
    )
    risks: list[str] = Field(
        default_factory=list
    )
    recommendations: list[str] = Field(
        default_factory=list
    )


class CRMUpdateResult(BaseModel):
    status: str
    score: int
    score_label: str
    notes: str
    next_action: str