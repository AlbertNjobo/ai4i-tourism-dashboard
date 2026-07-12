'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RocketIcon, AlertTriangleIcon, BuildingIcon } from 'lucide-react'
import type { InsightData } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

interface ActionCard {
  tag: string
  tagColor: string
  icon: React.ReactNode
  title: string
  description: string
  recommendation: string
}

export default function ActionPanel({ insights }: { insights: InsightData }) {
  const actions: ActionCard[] = []

  if (insights.digitalGapDestination) {
    const d = insights.digitalGapDestination
    actions.push({
      tag: 'Priority — revenue leakage',
      tagColor: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
      icon: <RocketIcon className='size-4' />,
      title: `Fast-track online booking at ${d.destination}`,
      description: `High visitor volume (${fmt(d.totalVisitors)}) is not converting to digital channels (${fmt1(d.avgDigitalBooking)}% share).`,
      recommendation: 'Closing this gap is the fastest lever to capture spend already on-site.',
    })
  }

  if (insights.weakServiceDestination) {
    const d = insights.weakServiceDestination
    actions.push({
      tag: 'Priority — service quality',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
      icon: <AlertTriangleIcon className='size-4' />,
      title: `Review service delivery at ${d.destination}`,
      description: `It sits among higher-visitor destinations but scores lowest on service quality (${fmt1(d.avgServiceQuality)}/100).`,
      recommendation: 'A targeted service audit protects repeat visitation.',
    })
  }

  if (insights.topComplaint.theme && insights.topComplaint.destCount > 1) {
    actions.push({
      tag: 'National-level fix',
      tagColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
      icon: <BuildingIcon className='size-4' />,
      title: `Address "${insights.topComplaint.theme.toLowerCase()}" as a cross-site issue`,
      description: `It is the leading complaint at ${insights.topComplaint.destCount} of ${insights.topComplaint.totalDests} destinations.`,
      recommendation: 'A shared root cause likely to justify a coordinated, national-level intervention.',
    })
  }

  return (
    <div className='space-y-4'>
      {actions.length === 0 ? (
        <Card className='ring-foreground/10 shadow-none ring-1'>
          <CardContent>
            <p className='text-muted-foreground text-sm'>No actions to recommend for the current filters.</p>
          </CardContent>
        </Card>
      ) : (
        actions.map((action, i) => (
          <Card
            key={i}
            className='ring-foreground/10 shadow-none ring-1 border-l-4'
            style={{ borderLeftColor: action.tagColor.includes('red') ? 'hsl(var(--destructive))' : action.tagColor.includes('amber') ? 'hsl(var(--chart-4))' : 'hsl(var(--chart-1))' }}
          >
            <CardContent className='space-y-2'>
              <div className='flex items-center gap-2'>
                {action.icon}
                <Badge variant='outline' className={action.tagColor}>
                  {action.tag}
                </Badge>
              </div>
              <p className='font-medium text-sm'>{action.title}</p>
              <p className='text-muted-foreground text-sm'>{action.description}</p>
              <p className='text-sm font-semibold'>{action.recommendation}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
