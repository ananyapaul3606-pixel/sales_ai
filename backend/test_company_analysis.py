from app.services.ai.company_analysis import CompanyAnalysisEngine


engine = CompanyAnalysisEngine()

result = engine.analyze_company(
    company_name="TechNova Solutions",
    industry="SaaS",
    company_size="200 employees",
    funding="Series B",
    technology_stack="React, FastAPI, PostgreSQL, AWS",
    description=(
        "A growing SaaS company building workflow "
        "automation software for businesses."
    )
)

print("\n=== COMPANY ANALYSIS ===")

print("Business Needs:")
print(result.business_needs)

print("\nExpansion Signals:")
print(result.expansion_signals)

print("\nOpportunities:")
print(result.opportunities)

print("\nPain Points:")
print(result.pain_points)