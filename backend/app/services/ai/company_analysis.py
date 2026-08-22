from app.services.ai.llm_client import LLMClient
from app.schemas.ai import CompanyAnalysis


class CompanyAnalysisEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def analyze_company(
        self,
        company_name: str,
        industry: str,
        company_size: str,
        funding: str,
        technology_stack: str,
        description: str
    ) -> CompanyAnalysis:

        prompt = f"""
Analyze the following company for a B2B sales intelligence platform.

Company Name:
{company_name}

Industry:
{industry}

Company Size:
{company_size}

Funding:
{funding}

Technology Stack:
{technology_stack}

Company Description:
{description}

Identify:

1. Business needs
2. Expansion signals
3. Sales opportunities
4. Potential pain points

Base your analysis ONLY on the information provided.
Do not invent specific facts about the company.

Return the result according to the required structured schema.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=CompanyAnalysis
        )