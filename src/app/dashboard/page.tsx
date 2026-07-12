import { loadTourismData, getUniqueMonths, getUniqueTypes, getUniqueProvinces } from '@/lib/csv-loader'
import DashboardClient from '@/components/dashboard/dashboard-client'

export const runtime = 'nodejs'

export default function DashboardPage() {
  const data = loadTourismData()
  const months = getUniqueMonths(data)
  const types = getUniqueTypes(data)
  const provinces = getUniqueProvinces(data)

  return (
    <DashboardClient
      initialData={data}
      months={months}
      types={types}
      provinces={provinces}
    />
  )
}
