from app.services.ai.crm_update import CRMUpdateEngine


engine = CRMUpdateEngine()


result = engine.generate_crm_update(
    lead_name="Rahul Sharma",
    company_name="TechNova Solutions",
    current_status="CONTACTED",
    lead_score=86,
    conversation_summary=(
        "Rahul is interested in automating "
        "manual sales reporting and requires "
        "CRM integration."
    ),
    follow_up_recommendation=(
        "Follow up in 2-3 business days "
        "with a demonstration."
    )
)


print("\n=== CRM UPDATE ===")

print("\nStatus:")
print(result.status)

print("\nScore:")
print(result.score)

print("\nScore Label:")
print(result.score_label)

print("\nNotes:")
print(result.notes)

print("\nNext Action:")
print(result.next_action)