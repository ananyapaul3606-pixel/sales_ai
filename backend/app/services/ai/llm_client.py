import os

from dotenv import load_dotenv
from google import genai
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()


class LLMClient:

    def __init__(self, provider: str = "gemini"):
        self.provider = provider.lower()

        if self.provider == "gemini":

            api_key = os.getenv("GEMINI_API_KEY")

            if not api_key:
                raise ValueError(
                    "GEMINI_API_KEY is not configured"
                )

            self.client = genai.Client(
                api_key=api_key
            )

        elif self.provider == "openai":

            api_key = os.getenv("OPENAI_API_KEY")

            if not api_key:
                raise ValueError(
                    "OPENAI_API_KEY is not configured"
                )

            self.client = OpenAI(
                api_key=api_key
            )

        else:
            raise ValueError(
                f"Unsupported LLM provider: {provider}"
            )

    # ==========================================
    # NORMAL TEXT GENERATION
    # ==========================================

    def generate(
        self,
        prompt: str,
        model: str | None = None
    ) -> str:

        if self.provider == "gemini":

            response = self.client.models.generate_content(
                model=model or "gemini-3.1-flash-lite",
                contents=prompt
            )

            return response.text

        if self.provider == "openai":

            response = self.client.chat.completions.create(
                model=model or "gpt-4o-mini",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            return response.choices[0].message.content

        raise ValueError(
            f"Unsupported provider: {self.provider}"
        )

    # ==========================================
    # STRUCTURED JSON GENERATION
    # ==========================================

    def generate_structured(
        self,
        prompt: str,
        response_model: type[BaseModel],
        model: str | None = None
    ):

        schema = response_model.model_json_schema()

        structured_prompt = f"""
You are an AI component inside a sales intelligence application.

Return ONLY valid JSON.

The JSON MUST follow this schema:

{schema}

Do not add markdown.
Do not add explanations outside the JSON.

TASK:
{prompt}
"""

        raw_response = self.generate(
            prompt=structured_prompt,
            model=model
        )

        return response_model.model_validate_json(
            raw_response
        )