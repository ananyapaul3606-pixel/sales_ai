from app.services.ai.llm_client import LLMClient
from app.schemas.ai import LeadIntelligence, CompanyAnalysis


class LeadIntelligenceEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def analyze_lead(
        self,
        lead_name: str,
        job_title: str,
        company_name: str,
        industry: str,
        company_analysis: CompanyAnalysis
    ) -> LeadIntelligence:

        prompt = f"""
Analyze the following sales lead using the company analysis.

LEAD INFORMATION

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


Determine:

1. Why this lead may be qualified.
2. How likely this person is to be a decision-maker.
3. What buying signals exist.
4. How a salesperson should approach this lead.

Do not invent facts that are not provided.

Return ONLY the required structured output.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=LeadIntelligence
        )