'use client'

import { Card, CardContent } from '@/components/ui/card'
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
  const metricItems: KPIItem[] = [
    {
      icon: <UsersIcon className='size-4' />,
      label: 'Total visitors',
      value: fmt(kpis.totalVisitors),
      delta: kpis.visitorDelta,
      deltaDirection: kpis.visitorDelta?.pct != null ? (kpis.visitorDelta.pct >= 0 ? 'up' : 'down') : undefined,
    },
    {
      icon: <DollarSignIcon className='size-4' />,
      label: 'Estimated spend',
      value: fmtUsd(kpis.totalSpend),
    },
    {
      icon: <StarIcon className='size-4' />,
      label: 'Service quality',
      value: fmt1(kpis.avgServiceQuality),
      unit: '/100',
    },
    {
      icon: <GlobeIcon className='size-4' />,
      label: 'Digital booking',
      value: fmt1(kpis.avgDigitalBooking),
      unit: '%',
    },
  ]

  const complaintItem = {
    icon: <AlertTriangleIcon className='size-4' />,
    label: 'Top complaint',
    value: kpis.topComplaint.value || '—',
  }

  return (
    <div
      className='grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      role='region'
      aria-label='National summary KPIs'
    >
      {metricItems.map((item, i) => (
        <Card key={i} className='ring-foreground/10 shadow-none ring-1'>
          <CardContent className='flex items-center gap-3 px-4 py-3'>
            <div className='bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md'>
              {item.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <span className='text-muted-foreground text-xs font-medium'>
                {item.label}
              </span>
              <div className='flex items-baseline gap-1'>
                <span className='text-xl sm:text-2xl font-semibold tabular-nums'>{item.value}</span>
                {item.unit && (
                  <span className='text-muted-foreground text-sm'>{item.unit}</span>
                )}
              </div>
              {item.delta && (
                <div className='flex items-center gap-1 mt-0.5'>
                  {item.deltaDirection === 'up' ? (
                    <TrendingUpIcon className='size-3 text-emerald-500' />
                  ) : (
                    <TrendingDownIcon className='size-3 text-red-500' />
                  )}
                  <span className={`text-xs ${item.deltaDirection === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {item.deltaDirection === 'up' ? '+' : ''}{item.delta.pct.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {/* Complaint card — distinct layout: stacked, wider */}
      <Card className='ring-foreground/10 shadow-none ring-1 bg-destructive/5 sm:col-span-2 lg:col-span-1'>
        <CardContent className='flex flex-col gap-1.5 px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='bg-destructive/10 text-destructive flex size-8 shrink-0 items-center justify-center rounded-md'>
              {complaintItem.icon}
            </div>
            <span className='text-muted-foreground text-xs font-medium'>
              {complaintItem.label}
            </span>
          </div>
          <p className='text-sm font-medium leading-snug pl-10'>{complaintItem.value}</p>
        </CardContent>
      </Card>
    </div>
  )
}
