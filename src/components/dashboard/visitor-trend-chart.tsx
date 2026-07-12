'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import type { TrendPoint } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'var(--chart-4)',
  },
  spend: {
    label: 'Estimated spend (USD)',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function VisitorTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <Card className='ring-foreground/10 shadow-none ring-1'>
      <CardHeader>
        <CardTitle className='text-base font-semibold'>
          Visitors &amp; estimated spend, Jan – Jun 2026
        </CardTitle>
        <div className='flex gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2.5 rounded-sm' style={{ background: 'var(--chart-4)' }} />
            Visitors
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2.5 rounded-sm' style={{ background: 'var(--chart-2)' }} />
            Estimated spend (USD)
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-72 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
              <XAxis
                dataKey='label'
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId='visitors'
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => fmt(v)}
              />
              <YAxis
                yAxisId='spend'
                orientation='right'
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => '$' + (v / 1000).toFixed(0) + 'k'}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'visitors') return [fmt(value as number), 'Visitors']
                      return [fmtUsd(value as number), 'Estimated spend']
                    }}
                  />
                }
              />
              <Line
                yAxisId='visitors'
                type='monotone'
                dataKey='visitors'
                stroke='var(--color-visitors)'
                strokeWidth={2.5}
                dot={{ r: 4, fill: 'var(--color-visitors)' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId='spend'
                type='monotone'
                dataKey='spend'
                stroke='var(--color-spend)'
                strokeWidth={2.5}
                strokeDasharray='6 3'
                dot={{ r: 4, fill: 'var(--color-spend)' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
