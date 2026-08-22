from app.services.ai.lead_scoring import AILeadScoringEngine
from app.schemas.ai import (
    CompanyAnalysis,
    LeadIntelligence
)


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


lead_intelligence = LeadIntelligence(
    qualification_reasoning=(
        "The CTO is likely involved in technology "
        "purchasing decisions."
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


engine = AILeadScoringEngine()

result = engine.score_lead(
    lead_name="Rahul Sharma",
    job_title="CTO",
    company_name="TechNova Solutions",
    industry="SaaS",
    rule_based_score=75,
    company_analysis=company_analysis,
    lead_intelligence=lead_intelligence
)


print("\n=== AI LEAD SCORE ===")

print("Lead Score:")
print(result.lead_score)

print("\nConversion Probability:")
print(result.conversion_probability)

print("\nPriority:")
print(result.priority_level)

print("\nReasoning:")
print(result.reasoning)