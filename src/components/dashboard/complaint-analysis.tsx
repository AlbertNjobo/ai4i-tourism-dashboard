'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import type { ComplaintFrequency, RevenuePoint, DemographicsPoint } from '@/types/tourism'

type ChartView = 'complaints' | 'revenue' | 'demographics'

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function ComplaintChart({ data }: { data: ComplaintFrequency[] }) {
  const config = { count: { label: 'Reports' } } satisfies ChartConfig

  return (
    <ChartContainer config={config} className='h-56 sm:h-72 w-full' role='img' aria-label='Horizontal bar chart showing complaint theme frequency across destinations'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout='vertical' margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' horizontal={false} />
          <XAxis type='number' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis type='category' dataKey='theme' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={130} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, _name, item) => {
                  const d = item.payload as ComplaintFrequency
                  return [
                    `${value} report${(value as number) !== 1 ? 's' : ''} across ${d.destinations.length} destination${d.destinations.length !== 1 ? 's' : ''}`,
                    'Frequency',
                  ]
                }}
              />
            }
          />
          <Bar dataKey='count' radius={[0, 4, 4, 0]} barSize={20} fill='var(--chart-1)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const config = { totalSpend: { label: 'Revenue (USD)' } } satisfies ChartConfig

  return (
    <ChartContainer config={config} className='h-56 sm:h-72 w-full' role='img' aria-label='Horizontal bar chart showing estimated total spend by destination in USD'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout='vertical' margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' horizontal={false} />
          <XAxis type='number' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => '$' + (v / 1000000).toFixed(1) + 'M'} />
          <YAxis type='category' dataKey='destination' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={140} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [fmtUsd(value as number), 'Revenue']}
              />
            }
          />
          <Bar dataKey='totalSpend' radius={[0, 4, 4, 0]} barSize={20} fill='var(--chart-1)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function DemographicsChart({ data }: { data: DemographicsPoint[] }) {
  const config = {
    domestic: { label: 'Domestic', color: 'var(--chart-1)' },
    international: { label: 'International', color: 'var(--chart-3)' },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className='h-56 sm:h-72 w-full' role='img' aria-label='Stacked bar chart showing domestic vs international visitor split by destination'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={data} layout='vertical' margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' horizontal={false} />
          <XAxis type='number' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v)} />
          <YAxis type='category' dataKey='destination' tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={140} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [fmt(value as number), name === 'domestic' ? 'Domestic' : 'International']}
              />
            }
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            formatter={(value) => value === 'domestic' ? 'Domestic' : 'International'}
          />
          <Bar dataKey='domestic' stackId='visitors' radius={[0, 0, 0, 0]} barSize={20} fill='var(--color-domestic)' />
          <Bar dataKey='international' stackId='visitors' radius={[0, 4, 4, 0]} barSize={20} fill='var(--color-international)' />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default function ComplaintAnalysis({
  data,
  revenueData,
  demographicsData,
  totalDestinations,
}: {
  data: ComplaintFrequency[]
  revenueData: RevenuePoint[]
  demographicsData: DemographicsPoint[]
  totalDestinations: number
}) {
  const [view, setView] = useState<ChartView>('complaints')

  const titles: Record<ChartView, string> = {
    complaints: 'Complaint theme analysis',
    revenue: 'Top destinations by revenue',
    demographics: 'Visitor demographics (domestic vs international)',
  }

  const subtitles: Record<ChartView, string> = {
    complaints: 'Frequency of top complaint themes across destinations',
    revenue: 'Estimated total spend by destination, sorted highest to lowest',
    demographics: 'Domestic vs international visitor split by destination',
  }

  const isEmpty =
    (view === 'complaints' && data.length === 0) ||
    (view === 'revenue' && revenueData.length === 0) ||
    (view === 'demographics' && demographicsData.length === 0)

  return (
    <Card className='ring-foreground/10 shadow-none ring-1'>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4'>
          <div>
            <CardTitle className='text-base font-semibold' style={{ textWrap: 'balance' }}>{titles[view]}</CardTitle>
            <p className='text-muted-foreground text-xs'>
              {subtitles[view]}
              <span className='ml-1 text-muted-foreground/50'>· Switch views with the dropdown</span>
            </p>
          </div>
          <Select value={view} onValueChange={(v) => v && setView(v as ChartView)}>
            <SelectTrigger className='w-full sm:w-48 h-11' aria-label='Select chart view'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='complaints'>Complaint themes</SelectItem>
              <SelectItem value='revenue'>Revenue by destination</SelectItem>
              <SelectItem value='demographics'>Visitor demographics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <p className='text-muted-foreground text-sm'>No data available for the current filters.</p>
        ) : view === 'complaints' ? (
          <ComplaintChart data={data} />
        ) : view === 'revenue' ? (
          <RevenueChart data={revenueData} />
        ) : (
          <DemographicsChart data={demographicsData} />
        )}
      </CardContent>
    </Card>
  )
}
