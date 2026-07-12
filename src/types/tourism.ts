export interface TourismRecord {
  month: string
  destination: string
  province: string
  district: string
  latitude: number
  longitude: number
  destination_type: string
  visitor_count: number
  domestic_visitor_share_pct: number
  accommodation_occupancy_pct: number
  avg_spend_usd_per_visitor: number
  transport_access_score_0_100: number
  service_quality_score_0_100: number
  digital_booking_share_pct: number
  top_complaint_theme: string
  estimated_total_spend_usd: number
}

export interface FilterState {
  month: string
  types: Set<string>
  provinces: Set<string>
}

export interface KPIData {
  totalVisitors: number
  totalSpend: number
  avgServiceQuality: number
  avgDigitalBooking: number
  topComplaint: { value: string; count: number }
  visitorDelta: { pct: number; label: string } | null
}

export interface DestinationAgg {
  destination: string
  province: string
  district: string
  latitude: number
  longitude: number
  destinationType: string
  totalVisitors: number
  totalSpend: number
  avgServiceQuality: number
  avgDigitalBooking: number
  avgOccupancy: number
  avgSpendPerVisitor: number
  avgDomesticShare: number
  complaints: string[]
  topComplaint: string
}

export interface TrendPoint {
  month: string
  label: string
  visitors: number
  spend: number
}

export interface ComplaintFrequency {
  theme: string
  count: number
  destinations: string[]
}

export interface InsightData {
  topSpendDestination: DestinationAgg | null
  spendSharePct: number
  digitalGapDestination: DestinationAgg | null
  weakServiceDestination: DestinationAgg | null
  nationalTrend: { direction: 'up' | 'down'; pct: number } | null
  topComplaint: { theme: string; destCount: number; totalDests: number }
}

export interface RevenuePoint {
  destination: string
  totalSpend: number
}

export interface DemographicsPoint {
  destination: string
  domestic: number
  international: number
  total: number
}

export const MONTH_LABELS: Record<string, string> = {
  '2026-01': 'Jan 2026',
  '2026-02': 'Feb 2026',
  '2026-03': 'Mar 2026',
  '2026-04': 'Apr 2026',
  '2026-05': 'May 2026',
  '2026-06': 'Jun 2026',
}

export const MONTH_SHORT: Record<string, string> = {
  '2026-01': 'Jan',
  '2026-02': 'Feb',
  '2026-03': 'Mar',
  '2026-04': 'Apr',
  '2026-05': 'May',
  '2026-06': 'Jun',
}
