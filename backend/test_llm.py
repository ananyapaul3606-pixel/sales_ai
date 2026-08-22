from app.services.ai.llm_client import LLMClient


llm = LLMClient(provider="gemini")

response = llm.generate(
    "Reply with exactly: SalesGenie AI connection successful"
)

print(response)