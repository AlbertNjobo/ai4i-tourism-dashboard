'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InsightData } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

export default function InsightNarrative({ insights }: { insights: InsightData }) {
  const bullets: string[] = []

  if (insights.topSpendDestination) {
    bullets.push(
      `${insights.topSpendDestination.destination} drives the largest share of tourism spend, accounting for ${insights.spendSharePct.toFixed(0)}% of estimated total spend.`
    )
  }

  if (insights.nationalTrend) {
    bullets.push(
      `National visitation is ${insights.nationalTrend.direction} ${insights.nationalTrend.pct.toFixed(0)}% from January to June across the current selection.`
    )
  }

  if (insights.topComplaint.theme) {
    bullets.push(
      `${insights.topComplaint.theme} is the most reported complaint theme, flagged as the top issue at ${insights.topComplaint.destCount} of ${insights.topComplaint.totalDests} destination${insights.topComplaint.totalDests !== 1 ? 's' : ''}.`
    )
  }

  if (insights.digitalGapDestination) {
    bullets.push(
      `${insights.digitalGapDestination.destination} shows the clearest digital booking gap: ${fmt(insights.digitalGapDestination.totalVisitors)} visitors but only ${fmt1(insights.digitalGapDestination.avgDigitalBooking)}% of bookings made digitally.`
    )
  }

  if (insights.weakServiceDestination && insights.weakServiceDestination !== insights.digitalGapDestination) {
    bullets.push(
      `${insights.weakServiceDestination.destination} sits among the higher-visitor destinations but scores lowest on service quality (${fmt1(insights.weakServiceDestination.avgServiceQuality)}/100) within that group.`
    )
  }

  return (
    <Card className='ring-foreground/10 shadow-none ring-1'>
      <CardHeader>
        <CardTitle className='text-base font-semibold' style={{ textWrap: 'balance' }}>Insight narrative</CardTitle>
      </CardHeader>
      <CardContent>
        {bullets.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No insights available for the current filters.</p>
        ) : (
          <ul className='space-y-3'>
            {bullets.map((bullet, i) => (
              <li key={i} className='text-sm leading-relaxed pl-4 relative before:content-["—"] before:absolute before:left-0 before:text-primary before:font-bold'>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
