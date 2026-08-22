from app.services.ai.llm_client import LLMClient
from app.schemas.ai import CompanyAnalysis


llm = LLMClient(provider="gemini")


result = llm.generate_structured(
    """
    Analyze a fictional SaaS company that has
    200 employees and is growing rapidly.
    Identify possible business needs,
    expansion signals, opportunities,
    and pain points.
    """,
    CompanyAnalysis
)


print(result)
print(type(result))