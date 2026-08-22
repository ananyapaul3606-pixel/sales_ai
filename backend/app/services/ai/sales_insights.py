from app.services.ai.llm_client import LLMClient
from app.schemas.ai import SalesInsights


class SalesInsightsEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def generate_insights(
        self,
        total_leads: int,
        hot_leads: int,
        warm_leads: int,
        cold_leads: int,
        average_score: float
    ) -> SalesInsights:

        prompt = f"""
You are a sales intelligence analyst.

Analyze the following CRM pipeline data.

Total Leads:
{total_leads}

Hot Leads:
{hot_leads}

Warm Leads:
{warm_leads}

Cold Leads:
{cold_leads}

Average Lead Score:
{average_score}

Generate:

1. Overall pipeline summary.
2. Key insights.
3. Potential risks.
4. Recommended actions.

IMPORTANT:

- Only use the provided metrics.
- Do not invent company information.
- Do not claim trends that cannot be inferred from the data.
- Recommendations should be practical.

Return ONLY structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=SalesInsights
        )