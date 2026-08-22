from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.lead import Lead
from app.schemas.lead import (
    LeadCreate,
    LeadUpdate,
    LeadResponse,
    LeadSummary
)
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.scoring_service import calculate_lead_score
from app.models.company_analysis import CompanyAnalysis as CompanyAnalysisModel
from app.models.lead_score import LeadScore
from app.models.outreach import Outreach
from app.models.follow_up import FollowUp
from app.agents.sales_graph import build_sales_graph



router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)


# =========================
# CREATE LEAD
# POST /leads
# =========================

@router.post(
    "",
    response_model=LeadResponse,
    status_code=status.HTTP_201_CREATED
)
def create_lead(
    data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_lead = Lead(
        name=data.name,
        email=data.email,
        company=data.company,
        job_title=data.job_title,
        notes=data.notes,
        owner_id=current_user.id
    )

    # Automatically calculate lead score
    score, label = calculate_lead_score(new_lead)

    new_lead.score = score
    new_lead.score_label = label

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return new_lead


# =========================
# GET ALL MY LEADS
# GET /leads
# =========================

@router.get(
    "",
    response_model=list[LeadResponse]
)
def get_leads(
    search: str | None = Query(default=None),
    status: str | None = Query(default=None),
    score_label: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = (
        db.query(Lead)
        .filter(Lead.owner_id == current_user.id)
    )

    # Search
    if search:
        search_term = f"%{search}%"

        query = query.filter(
            (Lead.name.ilike(search_term)) |
            (Lead.email.ilike(search_term)) |
            (Lead.company.ilike(search_term))
        )

    # Status filter
    if status:
        query = query.filter(
            Lead.status == status
        )

    # Score filter
    if score_label:
        query = query.filter(
            Lead.score_label == score_label
        )

    # Pagination
    offset = (page - 1) * limit

    leads = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return leads


# =========================
# LEAD SUMMARY
# GET /leads/summary
# =========================

@router.get(
    "/summary",
    response_model=LeadSummary
)
def get_lead_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    leads = (
        db.query(Lead)
        .filter(Lead.owner_id == current_user.id)
        .all()
    )

    total_leads = len(leads)

    hot_leads = sum(
        1 for lead in leads
        if lead.score_label == "HOT"
    )

    warm_leads = sum(
        1 for lead in leads
        if lead.score_label == "WARM"
    )

    cold_leads = sum(
        1 for lead in leads
        if lead.score_label == "COLD"
    )

    if total_leads > 0:
        average_score = sum(
            lead.score for lead in leads
        ) / total_leads
    else:
        average_score = 0.0

    return {
        "total_leads": total_leads,
        "hot_leads": hot_leads,
        "warm_leads": warm_leads,
        "cold_leads": cold_leads,
        "average_score": average_score
    }



# =========================
# GET ONE LEAD
# GET /leads/{lead_id}
# =========================

@router.get(
    "/{lead_id}",
    response_model=LeadResponse
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    return lead


# =========================
# UPDATE LEAD
# PUT /leads/{lead_id}
# =========================

@router.put(
    "/{lead_id}",
    response_model=LeadResponse
)
def update_lead(
    lead_id: int,
    data: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    if data.name is not None:
        lead.name = data.name

    if data.email is not None:
        lead.email = data.email

    if data.company is not None:
        lead.company = data.company

    if data.job_title is not None:
        lead.job_title = data.job_title

    if data.phone is not None:
        lead.phone = data.phone

    if data.notes is not None:
        lead.notes = data.notes

    if data.status is not None:
        lead.status = data.status

# Recalculate score after updating the lead
    score, label = calculate_lead_score(lead)

    lead.score = score
    lead.score_label = label

    db.commit()
    db.refresh(lead)

    return lead


# =========================
# DELETE LEAD
# DELETE /leads/{lead_id}
# =========================

@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    db.delete(lead)
    db.commit()

    return None


# =========================
# SCORE LEAD
# POST /leads/{lead_id}/score
# =========================

@router.post(
    "/{lead_id}/score",
    response_model=LeadResponse
)
def score_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    score, label = calculate_lead_score(lead)

    lead.score = score
    lead.score_label = label

    db.commit()
    db.refresh(lead)

    return lead


# =========================================
# RUN COMPLETE AI SALES INTELLIGENCE
# POST /leads/{lead_id}/run-intelligence
# =========================================

@router.post(
    "/{lead_id}/run-intelligence"
)
def run_lead_intelligence(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Find the lead
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

    # Build LangGraph
    graph = build_sales_graph()

    # Run complete AI workflow
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
    # SAVE AI RESULTS TO DATABASE
    # =========================================

    # -------------------------
    # 1. Update Lead
    # -------------------------

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

    # -------------------------
    # 2. Save Company Analysis
    # -------------------------

    if result.get("company_analysis"):

        company_analysis = (
            result["company_analysis"]
        )

        research = result.get("research")

        lead_intelligence = (
            result.get("lead_intelligence")
        )

        company_record = (
            db.query(CompanyAnalysisModel)
            .filter(
                CompanyAnalysisModel.lead_id == lead.id
            )
            .first()
        )

        if not company_record:

            company_record = CompanyAnalysisModel(
                lead_id=lead.id
            )

            db.add(company_record)

        if research:

            company_record.company_overview = (
                research.company_summary
            )

        company_record.business_needs = (
            "\n".join(
                company_analysis.business_needs
            )
        )

        company_record.pain_points = (
            "\n".join(
                company_analysis.pain_points
            )
        )

        company_record.opportunities = (
            "\n".join(
                company_analysis.opportunities
            )
        )

        if lead_intelligence:

            company_record.recommended_approach = (
                lead_intelligence.recommended_approach
            )

    # -------------------------
    # 3. Save Lead Score
    # -------------------------

    if result.get("lead_score"):

        ai_score = result["lead_score"]

        score_record = LeadScore(
            lead_id=lead.id,
            score=ai_score.lead_score,
            conversion_probability=(
                ai_score.conversion_probability
            ),
            tier=ai_score.priority_level,
            reasoning=ai_score.reasoning
        )

        db.add(score_record)

    # -------------------------
    # 4. Save Outreach
    # -------------------------

    if result.get("outreach"):

        outreach_result = (
            result["outreach"]
        )

        outreach_record = Outreach(
            lead_id=lead.id,
            channel="EMAIL",
            subject=outreach_result.subject,
            message=outreach_result.body,
            status="DRAFT"
        )

        db.add(outreach_record)

    # -------------------------
    # 5. Save Follow-Up
    # -------------------------

    if result.get("follow_up"):

        follow_up_result = (
            result["follow_up"]
        )

        follow_up_record = FollowUp(
            lead_id=lead.id,
            recommended_action=(
                follow_up_result.content_strategy
            ),
            reason=(
                follow_up_result.reasoning
            ),
            status="PENDING"
        )

        db.add(follow_up_record)

    # -------------------------
    # 6. Commit
    # -------------------------

    db.commit()
    db.refresh(lead)

    # =========================================
    # RETURN AI RESULTS
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