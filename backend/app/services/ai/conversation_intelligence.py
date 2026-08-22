from app.services.ai.llm_client import LLMClient
from app.schemas.ai import ConversationIntelligence


class ConversationIntelligenceEngine:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def analyze_transcript(
        self,
        transcript: str
    ) -> ConversationIntelligence:

        prompt = f"""
You are a sales conversation intelligence system.

Analyze the following sales conversation transcript.

TRANSCRIPT:

{transcript}

Extract:

1. A concise summary of the conversation.
2. The key discussion points.
3. Explicit or strongly implied action items.

IMPORTANT RULES:

- Only use information contained in the transcript.
- Do not invent facts.
- Do not invent action items that are not supported by the conversation.
- Keep the summary concise.
- Keep discussion points specific.
- Keep action items actionable.

Return ONLY structured JSON.
"""

        return self.llm.generate_structured(
            prompt=prompt,
            response_model=ConversationIntelligence
        )