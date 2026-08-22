from typing import TypedDict

from langgraph.graph import StateGraph, START, END

from app.services.ai.llm_client import LLMClient
from app.schemas.ai import ResearchResult


class ResearchState(TypedDict):
    company_name: str
    industry: str
    company_size: str
    description: str
    research: dict


class ResearchAgent:

    def __init__(self):
        self.llm = LLMClient(provider="gemini")

    def research_company(
        self,
        state: ResearchState
    ) -> ResearchState:

        prompt = f"""
You are the research agent for a B2B sales intelligence platform.

Analyze the following company information.

Company:
{state["company_name"]}

Industry:
{state["industry"]}

Company Size:
{state["company_size"]}

Description:
{state["description"]}

Identify:

1. A concise company summary.
2. The company's likely industry.
3. Potential business needs.
4. Potential sales opportunities.
5. Important research notes.

IMPORTANT:

Only use the information provided.

Do not invent specific facts.

Return ONLY structured JSON.
"""

        result = self.llm.generate_structured(
            prompt=prompt,
            response_model=ResearchResult
        )

        state["research"] = result.model_dump()

        return state


def build_research_graph():

    agent = ResearchAgent()

    graph = StateGraph(ResearchState)

    graph.add_node(
        "research",
        agent.research_company
    )

    graph.add_edge(
        START,
        "research"
    )

    graph.add_edge(
        "research",
        END
    )

    return graph.compile()