from app.services.ai.outreach import OutreachEngine
from app.schemas.ai import (
    CompanyAnalysis,
    LeadIntelligence,
    LeadScoreResult
)


# -----------------------------
# COMPANY ANALYSIS
# -----------------------------

company_analysis = CompanyAnalysis(
    business_needs=[
        "workflow automation",
        "scalability"
    ],
    expansion_signals=[
        "rapid growth",
        "Series B funding"
    ],
    opportunities=[
        "sales automation",
        "CRM integration"
    ],
    pain_points=[
        "manual workflows",
        "scaling operations"
    ]
)


# -----------------------------
# LEAD INTELLIGENCE
# -----------------------------

lead_intelligence = LeadIntelligence(
    qualification_reasoning=(
        "The CTO is likely involved in "
        "technology purchasing decisions."
    ),
    decision_maker_probability=0.9,
    buying_signals=[
        "rapid growth",
        "scalability needs",
        "technology expansion"
    ],
    recommended_approach=(
        "Focus on automation and scalability."
    )
)


# -----------------------------
# AI LEAD SCORE
# -----------------------------

lead_score = LeadScoreResult(
    lead_score=86,
    conversion_probability=0.78,
    priority_level="HOT",
    reasoning=(
        "Strong decision-maker probability "
        "and relevant business needs."
    )
)


# -----------------------------
# GENERATE OUTREACH
# -----------------------------

engine = OutreachEngine()


result = engine.generate_outreach(
    lead_name="Rahul Sharma",
    job_title="CTO",
    company_name="TechNova Solutions",
    industry="SaaS",
    company_analysis=company_analysis,
    lead_intelligence=lead_intelligence,
    lead_score=lead_score
)


# -----------------------------
# DISPLAY RESULT
# -----------------------------

print("\n=== OUTREACH ===")

print("\nSubject:")
print(result.subject)

print("\nBody:")
print(result.body)

print("\nPersonalization Points:")
print(result.personalization_points)

print("\nTone:")
print(result.recommended_tone)

print("\nCTA:")
print(result.call_to_action)