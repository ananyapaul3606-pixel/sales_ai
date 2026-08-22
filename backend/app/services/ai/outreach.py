from app.services.ai.llm_client import LLMClient
from app.schemas.ai import (
    OutreachResult,
    CompanyAnalysis,
    LeadIntelligence,
    LeadScoreResult
)


class OutreachEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def generate_outreach(
        self,
        lead_name: str,
        job_title: str,
        company_name: str,
        industry: str,
        company_analysis: CompanyAnalysis,
        lead_intelligence: LeadIntelligence,
        lead_score: LeadScoreResult
    ) -> OutreachResult:

        prompt = f"""
You are a B2B sales outreach specialist.

Create a personalized cold email for this lead.

LEAD

Name:
{lead_name}

Job Title:
{job_title}

Company:
{company_name}

Industry:
{industry}


COMPANY ANALYSIS

Business Needs:
{company_analysis.business_needs}

Expansion Signals:
{company_analysis.expansion_signals}

Opportunities:
{company_analysis.opportunities}

Pain Points:
{company_analysis.pain_points}


LEAD INTELLIGENCE

Qualification:
{lead_intelligence.qualification_reasoning}

Buying Signals:
{lead_intelligence.buying_signals}

Recommended Approach:
{lead_intelligence.recommended_approach}


LEAD SCORE

Score:
{lead_score.lead_score}

Priority:
{lead_score.priority_level}

Conversion Probability:
{lead_score.conversion_probability}


EMAIL REQUIREMENTS

Create a concise professional B2B cold email.

The email should:
- Be personalized to the lead and company.
- Focus on relevant business problems.
- Avoid making unsupported claims.
- Avoid sounding like spam.
- Clearly explain the potential value.
- End with a simple call to action.
- Do not mention that AI was used.
- Do not fabricate company facts.

Return ONLY the required structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=OutreachResult
        )