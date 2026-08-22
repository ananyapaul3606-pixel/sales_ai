from app.services.ai.conversation_intelligence import (
    ConversationIntelligenceEngine
)


engine = ConversationIntelligenceEngine()


transcript = """
Salesperson: Thanks for joining the call, Rahul.

Rahul: Our biggest problem right now is manual sales
reporting. It takes our team several hours every week.

Salesperson: We can help automate reporting and integrate
with your existing CRM.

Rahul: CRM integration is important for us. We are
currently evaluating solutions this month.

Salesperson: I can prepare a demonstration focused on
automated reporting and CRM integration.

Rahul: That would be useful. Please send me the details
after the call.
"""


result = engine.analyze_transcript(
    transcript=transcript
)


print("\n=== CONVERSATION INTELLIGENCE ===")

print("\nSummary:")
print(result.summary)

print("\nKey Discussion Points:")

for point in result.key_discussion_points:
    print("-", point)

print("\nAction Items:")

for item in result.action_items:
    print("-", item)