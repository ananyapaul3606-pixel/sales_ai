from app.services.ai.sales_insights import SalesInsightsEngine


engine = SalesInsightsEngine()


result = engine.generate_insights(
    total_leads=50,
    hot_leads=8,
    warm_leads=17,
    cold_leads=25,
    average_score=54.6
)


print("\n=== SALES INSIGHTS ===")

print("\nOverall Summary:")
print(result.overall_summary)

print("\nKey Insights:")
for insight in result.key_insights:
    print("-", insight)

print("\nRisks:")
for risk in result.risks:
    print("-", risk)

print("\nRecommendations:")
for recommendation in result.recommendations:
    print("-", recommendation)