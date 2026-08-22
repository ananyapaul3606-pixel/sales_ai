from app.db.database import SessionLocal

from app.models.company_analysis import CompanyAnalysis
from app.models.lead_score import LeadScore
from app.models.outreach import Outreach
from app.models.follow_up import FollowUp


db = SessionLocal()

LEAD_ID = 9


print("\n========== COMPANY ANALYSIS ==========")

company = (
    db.query(CompanyAnalysis)
    .filter(CompanyAnalysis.lead_id == LEAD_ID)
    .first()
)

if company:
    print("Lead ID:", company.lead_id)
    print("Company Overview:", company.company_overview)
    print("Business Needs:", company.business_needs)
    print("Pain Points:", company.pain_points)
    print("Opportunities:", company.opportunities)
    print("Recommended Approach:", company.recommended_approach)
else:
    print("NOT FOUND")


print("\n========== LEAD SCORES ==========")

score = (
    db.query(LeadScore)
    .filter(LeadScore.lead_id == LEAD_ID)
    .order_by(LeadScore.id.desc())
    .first()
)

if score:
    print("Lead ID:", score.lead_id)
    print("Score:", score.score)
    print("Conversion Probability:", score.conversion_probability)
    print("Tier:", score.tier)
    print("Reasoning:", score.reasoning)
else:
    print("NOT FOUND")


print("\n========== OUTREACH ==========")

outreach = (
    db.query(Outreach)
    .filter(Outreach.lead_id == LEAD_ID)
    .order_by(Outreach.id.desc())
    .first()
)

if outreach:
    print("Lead ID:", outreach.lead_id)
    print("Channel:", outreach.channel)
    print("Subject:", outreach.subject)
    print("Message:", outreach.message)
    print("Status:", outreach.status)
else:
    print("NOT FOUND")


print("\n========== FOLLOW UPS ==========")

follow_up = (
    db.query(FollowUp)
    .filter(FollowUp.lead_id == LEAD_ID)
    .order_by(FollowUp.id.desc())
    .first()
)

if follow_up:
    print("Lead ID:", follow_up.lead_id)
    print("Recommended Action:", follow_up.recommended_action)
    print("Reason:", follow_up.reason)
    print("Status:", follow_up.status)
else:
    print("NOT FOUND")


db.close()