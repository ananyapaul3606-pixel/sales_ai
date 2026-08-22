from app.services.ai.llm_client import LLMClient
from app.schemas.ai import CRMUpdateResult


class CRMUpdateEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def generate_crm_update(
        self,
        lead_name: str,
        company_name: str,
        current_status: str,
        lead_score: int,
        conversation_summary: str,
        follow_up_recommendation: str
    ) -> CRMUpdateResult:

        prompt = f"""
You are a CRM update assistant for a B2B sales platform.

Analyze the following lead information.

Lead:
{lead_name}

Company:
{company_name}

Current Status:
{current_status}

Current Lead Score:
{lead_score}

Conversation Summary:
{conversation_summary}

Follow-Up Recommendation:
{follow_up_recommendation}

Determine the appropriate CRM update.

Return:

1. The recommended lead status.
2. The SAME lead score provided above.
3. A label based on that score:
   - HOT
   - WARM
   - COLD
4. A concise CRM note.
5. The next recommended sales action.

IMPORTANT:

- Do not calculate or change the lead score.
- Use the exact Current Lead Score provided above.
- Do not invent information.
- HOT = 80-100
- WARM = 50-79
- COLD = 0-49
- Return ONLY structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=CRMUpdateResult
        )