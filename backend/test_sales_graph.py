from app.agents.sales_graph import build_sales_graph


graph = build_sales_graph()


result = graph.invoke({

    "lead_name": "Rahul Sharma",

    "job_title": "CTO",

    "company_name": "TechNova Solutions",

    "industry": "SaaS",

    "company_size": "200 employees",

    "funding": "Series B",

    "technology_stack": (
        "React, FastAPI, PostgreSQL, AWS"
    ),

    "description": (
        "A growing SaaS company building "
        "workflow automation software for businesses."
    ),

    "rule_based_score": 75
})


print("\n==============================")
print("SALES INTELLIGENCE PIPELINE")
print("==============================")

print("\n--- RESEARCH ---")
print(result["research"])

print("\n--- COMPANY ANALYSIS ---")
print(result["company_analysis"])

print("\n--- LEAD INTELLIGENCE ---")
print(result["lead_intelligence"])

print("\n--- AI LEAD SCORE ---")
print(result["lead_score"])

print("\n--- OUTREACH ---")
print(result["outreach"])