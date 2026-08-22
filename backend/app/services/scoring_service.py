def calculate_lead_score(lead):
    score = 0

    # Basic contact information
    if lead.email:
        score += 20

    if lead.company:
        score += 15

    if lead.job_title:
        score += 15

    # High-value job titles
    if lead.job_title:
        title = lead.job_title.lower()

        high_value_titles = [
            "ceo",
            "cto",
            "founder",
            "director"
        ]

        if any(role in title for role in high_value_titles):
            score += 25

    # Additional information
    if lead.notes:
        score += 5

    # Never allow score above 100
    score = min(score, 100)

    # Classification
    if score >= 80:
        label = "HOT"
    elif score >= 50:
        label = "WARM"
    else:
        label = "COLD"

    return score, label