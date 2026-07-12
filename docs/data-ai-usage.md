# Data & AI Usage Note

## Data Sources

| Dataset | Source | Status | Privacy |
|---------|--------|--------|---------|
| `04_tourism_destination_insights.csv` | POTRAZ AI4I challenge-provided | Synthetic aggregate sample | No personal data |

## Data Structure

- **48 records**: 8 destinations × 6 months (Jan–Jun 2026)
- **Fields**: month, destination, province, district, latitude, longitude, destination_type, visitor_count, domestic_visitor_share_pct, accommodation_occupancy_pct, avg_spend_usd_per_visitor, transport_access_score_0_100, service_quality_score_0_100, digital_booking_share_pct, top_complaint_theme, estimated_total_spend_usd

## Data Rights

- Data is provided by POTRAZ for challenge use only
- Not official tourism statistics
- Synthetic aggregate samples — no individual-level records
- No names, phone numbers, ID numbers, or personal information

## AI Usage

This prototype does not use AI/ML models. All insights are computed deterministically from the dataset using aggregation, mode detection, and threshold comparisons. If AI features are added in future phases:

- **Planned**: NLP-based complaint categorization, predictive visitor forecasting
- **Validation**: Test cases with known outcomes, expert review
- **Human oversight**: All AI-generated recommendations would require human approval before action

## Data Quality Limitations

- Synthetic data may not reflect real-world distributions
- Monthly granularity may miss seasonal patterns
- Complaint themes are pre-categorized (no raw text analysis)
- Coordinates are approximate centroids, not exact locations
