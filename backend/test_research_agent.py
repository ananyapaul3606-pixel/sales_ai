from app.agents.research_agent import build_research_graph


graph = build_research_graph()


result = graph.invoke({
    "company_name": "TechNova Solutions",
    "industry": "SaaS",
    "company_size": "200 employees",
    "description": (
        "A growing SaaS company building workflow "
        "automation software for businesses."
    ),
    "research": {}
})


print("\n=== RESEARCH RESULT ===")

print(result["research"])