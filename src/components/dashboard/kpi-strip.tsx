'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  UsersIcon,
  DollarSignIcon,
  StarIcon,
  GlobeIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react'
import type { KPIData } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

interface KPIItem {
  icon: React.ReactNode
  label: string
  value: string
  unit?: string
  delta?: { pct: number; label: string } | null
  deltaDirection?: 'up' | 'down'
}

export default function KPIStrip({ kpis }: { kpis: KPIData }) {
  const items: KPIItem[] = [
    {
      icon: <UsersIcon className='size-5' />,
      label: 'Total visitors',
      value: fmt(kpis.totalVisitors),
      delta: kpis.visitorDelta,
      deltaDirection: kpis.visitorDelta?.pct != null ? (kpis.visitorDelta.pct >= 0 ? 'up' : 'down') : undefined,
    },
    {
      icon: <DollarSignIcon className='size-5' />,
      label: 'Estimated spend',
      value: fmtUsd(kpis.totalSpend),
    },
    {
      icon: <StarIcon className='size-5' />,
      label: 'Avg service quality',
      value: fmt1(kpis.avgServiceQuality),
      unit: '/100',
    },
    {
      icon: <GlobeIcon className='size-5' />,
      label: 'Avg digital booking',
      value: fmt1(kpis.avgDigitalBooking),
      unit: '%',
    },
    {
      icon: <AlertTriangleIcon className='size-5' />,
      label: 'Top complaint',
      value: kpis.topComplaint.value || '—',
    },
  ]

  return (
    <div
      className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      role='region'
      aria-label='National summary KPIs'
    >
      {items.map((item, i) => (
        <Card key={i} className='ring-foreground/10 shadow-none ring-1'>
          <CardContent className='flex flex-col gap-2 px-4 py-3'>
            <div className='flex items-center gap-2'>
              <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm'>
                {item.icon}
              </div>
              <span className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
                {item.label}
              </span>
            </div>
            <div className='flex items-baseline gap-1'>
              <span className='text-xl sm:text-2xl font-semibold tabular-nums'>{item.value}</span>
              {item.unit && (
                <span className='text-muted-foreground text-sm'>{item.unit}</span>
              )}
            </div>
            {item.delta && (
              <div className='flex items-center gap-1'>
                {item.deltaDirection === 'up' ? (
                  <TrendingUpIcon className='size-3.5 text-emerald-500' />
                ) : (
                  <TrendingDownIcon className='size-3.5 text-red-500' />
                )}
                <Badge
                  variant='outline'
                  className={
                    item.deltaDirection === 'up'
                      ? 'border-emerald-500/30 text-emerald-500'
                      : 'border-red-500/30 text-red-500'
                  }
                >
                  {item.deltaDirection === 'up' ? '+' : ''}
                  {item.delta.pct.toFixed(1)}% vs {item.delta.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
