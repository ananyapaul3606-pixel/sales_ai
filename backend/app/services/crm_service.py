from sqlalchemy.orm import Session

from app.models.lead import Lead
from app.schemas.ai import CRMUpdateResult


def apply_crm_update(
    db: Session,
    lead: Lead,
    update: CRMUpdateResult
):

    lead.status = update.status
    lead.score = update.score
    lead.score_label = update.score_label

    if lead.notes:
        lead.notes += f"\n\nAI CRM Update: {update.notes}"
    else:
        lead.notes = f"AI CRM Update: {update.notes}"

    db.commit()
    db.refresh(lead)

    return lead