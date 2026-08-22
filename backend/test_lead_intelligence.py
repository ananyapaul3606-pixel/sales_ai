from app.services.ai.lead_intelligence import LeadIntelligenceEngine
from app.schemas.ai import CompanyAnalysis


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


engine = LeadIntelligenceEngine()

result = engine.analyze_lead(
    lead_name="Rahul Sharma",
    job_title="CTO",
    company_name="TechNova Solutions",
    industry="SaaS",
    company_analysis=company_analysis
)


print("\n=== LEAD INTELLIGENCE ===")

print("\nQualification:")
print(result.qualification_reasoning)

print("\nDecision Maker Probability:")
print(result.decision_maker_probability)

print("\nBuying Signals:")
print(result.buying_signals)

print("\nRecommended Approach:")
print(result.recommended_approach)