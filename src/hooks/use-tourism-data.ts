'use client'

import { useState, useMemo, useCallback } from 'react'
import type {
  TourismRecord,
  FilterState,
  KPIData,
  DestinationAgg,
  TrendPoint,
  ComplaintFrequency,
  InsightData,
  RevenuePoint,
  DemographicsPoint,
} from '@/types/tourism'
import { MONTH_SHORT } from '@/types/tourism'

function mode(arr: string[]): { value: string; count: number } {
  const counts: Record<string, number> = {}
  let best = ''
  let bestN = 0
  arr.forEach(v => {
    counts[v] = (counts[v] || 0) + 1
    if (counts[v] > bestN) {
      bestN = counts[v]
      best = v
    }
  })
  return { value: best, count: bestN }
}

export function useTourismData(allData: TourismRecord[], months: string[]) {
  const [filters, setFilters] = useState<FilterState>({
    month: 'all',
    types: new Set<string>(),
    provinces: new Set<string>(),
  })

  const setMonth = useCallback((month: string) => {
    setFilters(prev => ({ ...prev, month }))
  }, [])

  const toggleType = useCallback((type: string) => {
    setFilters(prev => {
      const next = new Set(prev.types)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return { ...prev, types: next }
    })
  }, [])

  const toggleProvince = useCallback((province: string) => {
    setFilters(prev => {
      const next = new Set(prev.provinces)
      if (next.has(province)) next.delete(province)
      else next.add(province)
      return { ...prev, provinces: next }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ month: 'all', types: new Set(), provinces: new Set() })
  }, [])

  const filteredRows = useMemo(() => {
    return allData.filter(r => {
      if (filters.month !== 'all' && r.month !== filters.month) return false
      if (filters.types.size > 0 && !filters.types.has(r.destination_type)) return false
      if (filters.provinces.size > 0 && !filters.provinces.has(r.province)) return false
      return true
    })
  }, [allData, filters])

  const kpis = useMemo<KPIData>(() => {
    const rows = filteredRows
    const totalVisitors = rows.reduce((s, r) => s + r.visitor_count, 0)
    const totalSpend = rows.reduce((s, r) => s + r.estimated_total_spend_usd, 0)
    const avgService = rows.length
      ? rows.reduce((s, r) => s + r.service_quality_score_0_100, 0) / rows.length
      : 0
    const avgDigital = rows.length
      ? rows.reduce((s, r) => s + r.digital_booking_share_pct, 0) / rows.length
      : 0
    const complaintMode = mode(rows.map(r => r.top_complaint_theme))

    let visitorDelta: KPIData['visitorDelta'] = null
    if (filters.month !== 'all') {
      const idx = months.indexOf(filters.month)
      if (idx > 0) {
        const prevMonth = months[idx - 1]
        const prevRows = allData.filter(
          r =>
            r.month === prevMonth &&
            (filters.types.size === 0 || filters.types.has(r.destination_type)) &&
            (filters.provinces.size === 0 || filters.provinces.has(r.province))
        )
        const prevVisitors = prevRows.reduce((s, r) => s + r.visitor_count, 0)
        if (prevVisitors > 0) {
          const pct = ((totalVisitors - prevVisitors) / prevVisitors) * 100
          visitorDelta = { pct, label: `${MONTH_SHORT[prevMonth]}` }
        }
      }
    }

    return {
      totalVisitors,
      totalSpend,
      avgServiceQuality: avgService,
      avgDigitalBooking: avgDigital,
      topComplaint: complaintMode,
      visitorDelta,
    }
  }, [filteredRows, filters.month, months, allData])

  const trendData = useMemo<TrendPoint[]>(() => {
    const rows = filteredRows
    return months.map(m => {
      const mrows = rows.filter(r => r.month === m)
      return {
        month: m,
        label: MONTH_SHORT[m] || m,
        visitors: mrows.reduce((s, r) => s + r.visitor_count, 0),
        spend: mrows.reduce((s, r) => s + r.estimated_total_spend_usd, 0),
      }
    })
  }, [filteredRows, months])

  const destinations = useMemo<DestinationAgg[]>(() => {
    const byDest: Record<string, DestinationAgg> = {}
    filteredRows.forEach(r => {
      if (!byDest[r.destination]) {
        byDest[r.destination] = {
          destination: r.destination,
          province: r.province,
          district: r.district,
          latitude: r.latitude,
          longitude: r.longitude,
          destinationType: r.destination_type,
          totalVisitors: 0,
          totalSpend: 0,
          avgServiceQuality: 0,
          avgDigitalBooking: 0,
          avgOccupancy: 0,
          avgSpendPerVisitor: 0,
          avgDomesticShare: 0,
          complaints: [],
          topComplaint: '',
        }
      }
      const d = byDest[r.destination]
      d.totalVisitors += r.visitor_count
      d.totalSpend += r.estimated_total_spend_usd
      d.avgServiceQuality += r.service_quality_score_0_100
      d.avgDigitalBooking += r.digital_booking_share_pct
      d.avgOccupancy += r.accommodation_occupancy_pct
      d.avgSpendPerVisitor += r.avg_spend_usd_per_visitor
      d.avgDomesticShare += r.domestic_visitor_share_pct
      d.complaints.push(r.top_complaint_theme)
    })

    return Object.values(byDest).map(d => {
      const n = d.complaints.length || 1
      return {
        ...d,
        avgServiceQuality: d.avgServiceQuality / n,
        avgDigitalBooking: d.avgDigitalBooking / n,
        avgOccupancy: d.avgOccupancy / n,
        avgSpendPerVisitor: d.avgSpendPerVisitor / n,
        avgDomesticShare: d.avgDomesticShare / n,
        topComplaint: mode(d.complaints).value,
      }
    })
  }, [filteredRows])

  const complaintFrequencies = useMemo<ComplaintFrequency[]>(() => {
    const byTheme: Record<string, { count: number; destinations: Set<string> }> = {}
    filteredRows.forEach(r => {
      if (!byTheme[r.top_complaint_theme]) {
        byTheme[r.top_complaint_theme] = { count: 0, destinations: new Set() }
      }
      byTheme[r.top_complaint_theme].count++
      byTheme[r.top_complaint_theme].destinations.add(r.destination)
    })
    return Object.entries(byTheme)
      .map(([theme, data]) => ({
        theme,
        count: data.count,
        destinations: [...data.destinations],
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredRows])

  const insights = useMemo<InsightData>(() => {
    const sortedBySpend = [...destinations].sort((a, b) => b.totalSpend - a.totalSpend)
    const topSpend = sortedBySpend[0] || null
    const totalSpend = destinations.reduce((s, d) => s + d.totalSpend, 0)
    const spendShare = totalSpend && topSpend ? (topSpend.totalSpend / totalSpend) * 100 : 0

    const sortedByVisitors = [...destinations].sort((a, b) => b.totalVisitors - a.totalVisitors)
    const highVisitorSet = sortedByVisitors.slice(0, Math.max(1, Math.ceil(sortedByVisitors.length / 2)))
    const digitalGap = [...highVisitorSet].sort((a, b) => a.avgDigitalBooking - b.avgDigitalBooking)[0]
    const weakService = [...highVisitorSet].sort((a, b) => a.avgServiceQuality - b.avgServiceQuality)[0]

    const topCompTheme = mode(filteredRows.map(r => r.top_complaint_theme))
    const compDestCount = new Set(
      filteredRows.filter(r => r.top_complaint_theme === topCompTheme.value).map(r => r.destination)
    ).size

    let nationalTrend: InsightData['nationalTrend'] = null
    if (months.length >= 2) {
      const firstMonthRows = allData.filter(
        r =>
          r.month === months[0] &&
          (filters.types.size === 0 || filters.types.has(r.destination_type)) &&
          (filters.provinces.size === 0 || filters.provinces.has(r.province))
      )
      const lastMonthRows = allData.filter(
        r =>
          r.month === months[months.length - 1] &&
          (filters.types.size === 0 || filters.types.has(r.destination_type)) &&
          (filters.provinces.size === 0 || filters.provinces.has(r.province))
      )
      const firstVisitors = firstMonthRows.reduce((s, r) => s + r.visitor_count, 0)
      const lastVisitors = lastMonthRows.reduce((s, r) => s + r.visitor_count, 0)
      if (firstVisitors > 0) {
        const change = ((lastVisitors - firstVisitors) / firstVisitors) * 100
        nationalTrend = { direction: change >= 0 ? 'up' : 'down', pct: Math.abs(change) }
      }
    }

    return {
      topSpendDestination: topSpend || null,
      spendSharePct: spendShare,
      digitalGapDestination: digitalGap || null,
      weakServiceDestination: weakService || null,
      nationalTrend,
      topComplaint: { theme: topCompTheme.value, destCount: compDestCount, totalDests: destinations.length },
    }
  }, [destinations, filteredRows, months, allData, filters])

  const resultCount = useMemo(() => {
    const destCount = new Set(filteredRows.map(r => r.destination)).size
    return { destinations: destCount, records: filteredRows.length }
  }, [filteredRows])

  const revenueByDestination = useMemo<RevenuePoint[]>(() => {
    return destinations
      .map(d => ({ destination: d.destination, totalSpend: d.totalSpend }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
  }, [destinations])

  const demographicsByDestination = useMemo<DemographicsPoint[]>(() => {
    return destinations
      .map(d => {
        const domestic = Math.round(d.totalVisitors * (d.avgDomesticShare / 100))
        return {
          destination: d.destination,
          domestic,
          international: d.totalVisitors - domestic,
          total: d.totalVisitors,
        }
      })
      .sort((a, b) => b.total - a.total)
  }, [destinations])

  return {
    filters,
    setMonth,
    toggleType,
    toggleProvince,
    resetFilters,
    filteredRows,
    kpis,
    trendData,
    destinations,
    complaintFrequencies,
    revenueByDestination,
    demographicsByDestination,
    insights,
    resultCount,
  }
}
