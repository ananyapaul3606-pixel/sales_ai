from app.services.ai.follow_up import FollowUpEngine


engine = FollowUpEngine()


result = engine.recommend_follow_up(
    lead_name="Rahul Sharma",
    job_title="CTO",
    company_name="TechNova Solutions",
    current_status="CONTACTED",
    engagement_history="""
    Day 1:
    Cold email sent.

    Day 3:
    Email opened twice.

    Day 5:
    No response.

    Day 7:
    Follow-up email sent.
    """
)


print("\n=== FOLLOW-UP RECOMMENDATION ===")

print("\nTiming:")
print(result.recommended_timing)

print("\nChannel:")
print(result.recommended_channel)

print("\nContent Strategy:")
print(result.content_strategy)

print("\nReasoning:")
print(result.reasoning)
