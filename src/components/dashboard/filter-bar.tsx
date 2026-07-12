'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MONTH_LABELS } from '@/types/tourism'
import type { FilterState } from '@/types/tourism'

interface Props {
  months: string[]
  types: string[]
  provinces: string[]
  filters: FilterState
  onMonthChange: (month: string) => void
  onTypeToggle: (type: string) => void
  onProvinceToggle: (province: string) => void
  onReset: () => void
}

export default function FilterBar({
  months,
  types,
  provinces,
  filters,
  onMonthChange,
  onTypeToggle,
  onProvinceToggle,
  onReset,
}: Props) {
  const hasActiveFilters =
    filters.month !== 'all' || filters.types.size > 0 || filters.provinces.size > 0

  return (
    <Card className='ring-foreground/10 shadow-none ring-1' aria-label='Dashboard filters'>
      <CardContent className='space-y-4'>
        {/* Row 1: Month + Reset */}
        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-muted-foreground text-xs font-medium uppercase tracking-wider'>
            Month
          </span>
          <Select value={filters.month} onValueChange={(v) => v && onMonthChange(v)}>
            <SelectTrigger className='w-44 h-11' aria-label='Filter by month'>
              <SelectValue placeholder='All months' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All months</SelectItem>
              {months.map(m => (
                <SelectItem key={m} value={m}>
                  {MONTH_LABELS[m] || m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant='ghost'
              size='default'
              className='text-muted-foreground ml-auto underline h-11 px-4 text-xs'
              onClick={onReset}
            >
              Reset filters
            </Button>
          )}
        </div>

        {/* Row 2: Destination type */}
        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-muted-foreground text-xs font-medium uppercase tracking-wider shrink-0'>
            Type
          </span>
          <div className='flex flex-wrap gap-1.5' role='group' aria-label='Filter by destination type'>
            {types.map(t => (
              <Button
                key={t}
                variant={filters.types.has(t) ? 'default' : 'outline'}
                size='default'
                className='h-11 rounded-full px-4 text-xs'
                onClick={() => onTypeToggle(t)}
                aria-pressed={filters.types.has(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Row 3: Province */}
        <div className='flex flex-wrap items-center gap-3'>
          <span className='text-muted-foreground text-xs font-medium uppercase tracking-wider shrink-0'>
            Province
          </span>
          <div className='flex flex-wrap gap-1.5' role='group' aria-label='Filter by province'>
            {provinces.map(p => (
              <Button
                key={p}
                variant={filters.provinces.has(p) ? 'default' : 'outline'}
                size='default'
                className='h-11 rounded-full px-4 text-xs'
                onClick={() => onProvinceToggle(p)}
                aria-pressed={filters.provinces.has(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
