from app.services.ai.llm_client import LLMClient
from app.schemas.ai import (
    LeadScoreResult,
    CompanyAnalysis,
    LeadIntelligence
)


class AILeadScoringEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def score_lead(
        self,
        lead_name: str,
        job_title: str,
        company_name: str,
        industry: str,
        rule_based_score: int,
        company_analysis: CompanyAnalysis,
        lead_intelligence: LeadIntelligence
    ) -> LeadScoreResult:

        prompt = f"""
You are a B2B sales lead scoring engine.

Evaluate the lead using BOTH:
1. Existing rule-based score
2. AI-based sales intelligence

LEAD

Name:
{lead_name}

Job Title:
{job_title}

Company:
{company_name}

Industry:
{industry}

Existing Rule-Based Score:
{rule_based_score}


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

Qualification Reasoning:
{lead_intelligence.qualification_reasoning}

Decision Maker Probability:
{lead_intelligence.decision_maker_probability}

Buying Signals:
{lead_intelligence.buying_signals}

Recommended Approach:
{lead_intelligence.recommended_approach}


SCORING REQUIREMENTS

Generate:

1. lead_score:
   Integer from 0 to 100.

2. conversion_probability:
   Number between 0.0 and 1.0.

3. priority_level:
   One of:
   HOT
   WARM
   COLD

4. reasoning:
   Explain the major factors affecting the score.

Do not invent information.

Return ONLY structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=LeadScoreResult
        )