'use client'

import { useCallback } from 'react'
import type { TourismRecord } from '@/types/tourism'
import { useTourismData } from '@/hooks/use-tourism-data'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import KPIStrip from './kpi-strip'
import FilterBar from './filter-bar'
import VisitorTrendChart from './visitor-trend-chart'
import DestinationMap from './destination-map'
import ScorecardTable from './scorecard-table'
import InsightNarrative from './insight-narrative'
import ActionPanel from './action-panel'
import ComplaintAnalysis from './complaint-analysis'
import KeyboardShortcutHelp from './keyboard-shortcuts'

interface Props {
  initialData: TourismRecord[]
  months: string[]
  types: string[]
  provinces: string[]
}

export default function DashboardView({ initialData, months, types, provinces }: Props) {
  const {
    filters,
    setMonth,
    toggleType,
    toggleProvince,
    resetFilters,
    kpis,
    trendData,
    destinations,
    complaintFrequencies,
    revenueByDestination,
    demographicsByDestination,
    insights,
    resultCount,
  } = useTourismData(initialData, months)

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const toggleTheme = useCallback(() => {
    const html = document.documentElement
    const isDark = html.classList.contains('dark')
    html.classList.toggle('dark', !isDark)
    html.classList.toggle('light', isDark)
  }, [])

  const focusMonthFilter = useCallback(() => {
    const select = document.querySelector('[aria-label="Filter by month"]') as HTMLElement
    if (select) select.focus()
  }, [])

  const { showHelp, setShowHelp } = useKeyboardShortcuts([
    { key: 'm', label: 'Focus month filter', action: focusMonthFilter },
    { key: 'r', label: 'Reset filters', action: resetFilters },
    { key: 'd', label: 'Toggle dark mode', action: toggleTheme },
    { key: '1', label: 'Jump to KPIs', action: () => scrollToSection('kpi-strip') },
    { key: '2', label: 'Jump to trend', action: () => scrollToSection('trend-heading') },
    { key: '3', label: 'Jump to destinations', action: () => scrollToSection('focus-heading') },
    { key: '4', label: 'Jump to deep dive', action: () => scrollToSection('action-heading') },
  ])

  return (
    <div className='flex flex-col gap-4'>
      {/* Keyboard shortcut help overlay */}
      {showHelp && <KeyboardShortcutHelp onClose={() => setShowHelp(false)} />}

      {/* KPI Strip */}
      <div id='kpi-strip'>
        <KPIStrip kpis={kpis} />
      </div>

      {/* Filter Bar */}
      <FilterBar
        months={months}
        types={types}
        provinces={provinces}
        filters={filters}
        onMonthChange={setMonth}
        onTypeToggle={toggleType}
        onProvinceToggle={toggleProvince}
        onReset={resetFilters}
      />

      {/* Result count */}
      <p className='text-muted-foreground text-sm'>
        Showing {resultCount.destinations} destination{resultCount.destinations !== 1 ? 's' : ''}{' '}
        &middot; {resultCount.records} monthly record{resultCount.records !== 1 ? 's' : ''}
        <span className='ml-2 text-xs text-muted-foreground/60'>
          Press <kbd className='inline-flex h-4 min-w-[16px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px]'>?</kbd> for shortcuts
        </span>
      </p>

      {/* Section 1: Trend + Insight narrative (side by side) */}
      <section aria-labelledby='trend-heading' className='pt-2'>
        <h2 id='trend-heading' className='text-lg font-semibold mb-3' style={{ textWrap: 'balance' }}>
          What&apos;s changing over time
        </h2>
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-5'>
          <div className='lg:col-span-3'>
            <VisitorTrendChart data={trendData} />
          </div>
          <div className='lg:col-span-2'>
            <InsightNarrative insights={insights} />
          </div>
        </div>
      </section>

      {/* Section 2: Destination map + Scorecard table */}
      <section aria-labelledby='focus-heading' className='pt-4'>
        <h2 id='focus-heading' className='text-lg font-semibold mb-3' style={{ textWrap: 'balance' }}>
          Where to focus, by destination
        </h2>
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
          <DestinationMap destinations={destinations} />
          <ScorecardTable destinations={destinations} />
        </div>
      </section>

      {/* Section 3: Analytics + Action panel */}
      <section aria-labelledby='action-heading' className='pt-4'>
        <h2 id='action-heading' className='text-lg font-semibold mb-3' style={{ textWrap: 'balance' }}>
          Deep dive &amp; recommended actions
        </h2>
        <div className='grid gap-6 grid-cols-1 lg:grid-cols-5'>
          <div className='lg:col-span-3'>
            <ComplaintAnalysis
              data={complaintFrequencies}
              revenueData={revenueByDestination}
              demographicsData={demographicsByDestination}
              totalDestinations={destinations.length}
            />
          </div>
          <div className='lg:col-span-2'>
            <ActionPanel insights={insights} />
          </div>
        </div>
      </section>
    </div>
  )
}
