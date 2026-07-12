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
  bgTint: string
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
      bgTint: 'bg-red-500/5',
      icon: <RocketIcon className='size-4 text-red-500' />,
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
      bgTint: 'bg-amber-500/5',
      icon: <AlertTriangleIcon className='size-4 text-amber-500' />,
      title: `Review service delivery at ${d.destination}`,
      description: `It sits among higher-visitor destinations but scores lowest on service quality (${fmt1(d.avgServiceQuality)}/100).`,
      recommendation: 'A targeted service audit protects repeat visitation.',
    })
  }

  if (insights.topComplaint.theme && insights.topComplaint.destCount > 1) {
    actions.push({
      tag: 'National-level fix',
      tagColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
      bgTint: 'bg-blue-500/5',
      icon: <BuildingIcon className='size-4 text-blue-500' />,
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
            className={`ring-foreground/10 shadow-none ring-1 ${action.bgTint}`}
          >
            <CardContent className='space-y-2'>
              <div className='flex items-start gap-3'>
                <div className='bg-background mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ring-1 ring-foreground/10'>
                  {action.icon}
                </div>
                <div className='flex-1 space-y-2'>
                  <Badge variant='outline' className={action.tagColor}>
                    {action.tag}
                  </Badge>
                  <p className='font-medium text-sm'>{action.title}</p>
                  <p className='text-muted-foreground text-sm'>{action.description}</p>
                  <p className='text-sm font-semibold'>{action.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
