from app.services.ai.llm_client import LLMClient
from app.schemas.ai import FollowUpRecommendation


class FollowUpEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def recommend_follow_up(
        self,
        lead_name: str,
        job_title: str,
        company_name: str,
        engagement_history: str,
        current_status: str
    ) -> FollowUpRecommendation:

        prompt = f"""
You are a B2B sales follow-up strategist.

Analyze the lead's engagement history and recommend
the most appropriate next follow-up action.

LEAD

Name:
{lead_name}

Job Title:
{job_title}

Company:
{company_name}

Current Status:
{current_status}

ENGAGEMENT HISTORY:

{engagement_history}


Determine:

1. Recommended timing for the next follow-up.
2. Recommended communication channel.
3. Content strategy for the follow-up.
4. Reasoning behind the recommendation.

Do not invent engagement events.

Keep the recommendation practical and sales-focused.

Return ONLY structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=FollowUpRecommendation
        )