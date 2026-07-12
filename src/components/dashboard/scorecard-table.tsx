'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DestinationAgg } from '@/types/tourism'

function fmt(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US')
}

function fmt1(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

function pillClass(v: number): string {
  if (v >= 65) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
  if (v >= 45) return 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
  return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
}

export default function ScorecardTable({ destinations }: { destinations: DestinationAgg[] }) {
  const sorted = [...destinations].sort((a, b) => b.totalSpend - a.totalSpend)

  return (
    <Card className='ring-foreground/10 shadow-none ring-1'>
      <CardHeader>
        <CardTitle className='text-base font-semibold' style={{ textWrap: 'balance' }}>Destination scorecard</CardTitle>
      </CardHeader>
      <CardContent className='overflow-x-auto'>
        {sorted.length === 0 ? (
          <p className='text-muted-foreground text-sm'>No destinations match the current filters.</p>
        ) : (
          <Table>
            <caption className='sr-only'>
              Destination scorecard: visitors, spend, service quality, digital booking share and top complaint
            </caption>
            <TableHeader>
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead className='text-right'>Visitors</TableHead>
                <TableHead className='text-right'>Est. spend</TableHead>
                <TableHead>Service quality</TableHead>
                <TableHead>Digital booking</TableHead>
                <TableHead>Top complaint</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(d => (
                <TableRow key={d.destination}>
                  <TableCell>
                    <div className='font-medium'>{d.destination}</div>
                    <div className='text-muted-foreground text-xs'>{d.province}</div>
                  </TableCell>
                  <TableCell className='text-right tabular-nums'>{fmt(d.totalVisitors)}</TableCell>
                  <TableCell className='text-right tabular-nums'>{fmtUsd(d.totalSpend)}</TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Badge variant='outline' className={pillClass(d.avgServiceQuality)}>
                        {fmt1(d.avgServiceQuality)}
                      </Badge>
                      <div className='bg-muted h-1.5 w-16 overflow-hidden rounded-full'>
                        <div
                          className='h-full rounded-full bg-emerald-500'
                          style={{ width: `${Math.min(d.avgServiceQuality, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className={pillClass(d.avgDigitalBooking)}>
                      {fmt1(d.avgDigitalBooking)}%
                    </Badge>
                  </TableCell>
                  <TableCell className='text-muted-foreground text-sm'>{d.topComplaint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
