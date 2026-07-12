import fs from 'fs'
import path from 'path'
import type { TourismRecord } from '@/types/tourism'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

export function loadTourismData(): TourismRecord[] {
  const csvPath = path.join(process.cwd(), 'public', 'data', '04_tourism_destination_insights.csv')
  const raw = fs.readFileSync(csvPath, 'utf-8')
  const lines = raw.trim().split('\n')
  const headers = parseCSVLine(lines[0])

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = values[i] || ''
    })

    return {
      month: row.month,
      destination: row.destination,
      province: row.province,
      district: row.district,
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0,
      destination_type: row.destination_type,
      visitor_count: parseFloat(row.visitor_count) || 0,
      domestic_visitor_share_pct: parseFloat(row.domestic_visitor_share_pct) || 0,
      accommodation_occupancy_pct: parseFloat(row.accommodation_occupancy_pct) || 0,
      avg_spend_usd_per_visitor: parseFloat(row.avg_spend_usd_per_visitor) || 0,
      transport_access_score_0_100: parseFloat(row.transport_access_score_0_100) || 0,
      service_quality_score_0_100: parseFloat(row.service_quality_score_0_100) || 0,
      digital_booking_share_pct: parseFloat(row.digital_booking_share_pct) || 0,
      top_complaint_theme: row.top_complaint_theme,
      estimated_total_spend_usd: parseFloat(row.estimated_total_spend_usd) || 0,
    }
  })
}

export function getUniqueMonths(data: TourismRecord[]): string[] {
  return [...new Set(data.map(r => r.month))].sort()
}

export function getUniqueTypes(data: TourismRecord[]): string[] {
  return [...new Set(data.map(r => r.destination_type))].sort()
}

export function getUniqueProvinces(data: TourismRecord[]): string[] {
  return [...new Set(data.map(r => r.province))].sort()
}
