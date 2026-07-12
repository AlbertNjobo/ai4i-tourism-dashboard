'use client'

import type { TourismRecord } from '@/types/tourism'
import { useTourismData } from '@/hooks/use-tourism-data'
import KPIStrip from './kpi-strip'
import FilterBar from './filter-bar'
import VisitorTrendChart from './visitor-trend-chart'
import DestinationMap from './destination-map'
import ScorecardTable from './scorecard-table'
import InsightNarrative from './insight-narrative'
import ActionPanel from './action-panel'
import ComplaintAnalysis from './complaint-analysis'

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

  return (
    <div className='flex flex-col gap-6'>
      {/* KPI Strip */}
      <KPIStrip kpis={kpis} />

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
      </p>

      {/* Section 1: Trend + Insight narrative (side by side) */}
      <section aria-labelledby='trend-heading'>
        <h2 id='trend-heading' className='text-xl font-semibold mb-4'>
          What&apos;s changing over time
        </h2>
        <div className='grid gap-6 lg:grid-cols-5'>
          <div className='lg:col-span-3'>
            <VisitorTrendChart data={trendData} />
          </div>
          <div className='lg:col-span-2'>
            <InsightNarrative insights={insights} />
          </div>
        </div>
      </section>

      {/* Section 2: Destination map + Scorecard table */}
      <section aria-labelledby='focus-heading'>
        <h2 id='focus-heading' className='text-xl font-semibold mb-4'>
          Where to focus, by destination
        </h2>
        <div className='grid gap-6 lg:grid-cols-2'>
          <DestinationMap destinations={destinations} />
          <ScorecardTable destinations={destinations} />
        </div>
      </section>

      {/* Section 3: Analytics + Action panel */}
      <section aria-labelledby='action-heading'>
        <h2 id='action-heading' className='text-xl font-semibold mb-4'>
          Deep dive &amp; recommended actions
        </h2>
        <div className='grid gap-6 lg:grid-cols-5'>
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
