# Architecture

## System Overview

```
┌─────────────────────────────────────────────────┐
│                    User (Browser)                │
│  Tourism authority / Destination manager         │
└──────────────────────┬──────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────┐
│              Next.js App Router                  │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ Server:     │  │ Client:                  │  │
│  │ CSV Loader  │→ │ DashboardView            │  │
│  │ (build time)│  │  ├─ KPIStrip             │  │
│  └─────────────┘  │  ├─ FilterBar            │  │
│                   │  ├─ VisitorTrendChart     │  │
│  ┌─────────────┐  │  ├─ DestinationMap       │  │
│  │ public/data/│  │  ├─ ScorecardTable       │  │
│  │ CSV file    │  │  ├─ InsightNarrative     │  │
│  └─────────────┘  │  ├─ ActionPanel          │  │
│                   │  └─ ComplaintAnalysis    │  │
│                   └──────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Components

| Component | Role | Data flow |
|-----------|------|-----------|
| `csv-loader.ts` | Server-side CSV parser | Reads `public/data/*.csv` → `TourismRecord[]` |
| `dashboard/page.tsx` | Server component | Calls `loadTourismData()`, passes to client |
| `dashboard-view.tsx` | Client orchestrator | Holds filter state, computes derived data |
| `use-tourism-data.ts` | Client hook | Filter logic, KPI aggregation, insight computation |
| `kpi-strip.tsx` | KPI cards | Receives computed KPI data |
| `filter-bar.tsx` | Filter controls | Month select, type/province chips |
| `visitor-trend-chart.tsx` | Line chart | Recharts dual-axis (visitors + spend) |
| `destination-map.tsx` | SVG bubble map | Destination positions + visitor volume |
| `scorecard-table.tsx` | Data table | Destination comparison with pills/bars |
| `insight-narrative.tsx` | Auto-generated text | Computed from filtered data |
| `action-panel.tsx` | Recommendation cards | Derived from insights |
| `complaint-analysis.tsx` | Bar chart | Complaint theme frequency |

## Data Flow

1. **Build time**: `csv-loader.ts` reads CSV, parses to `TourismRecord[]`
2. **Server render**: Page component passes data as props to `DashboardView`
3. **Client state**: `useTourismData` hook manages filter state (month, types, provinces)
4. **Derived data**: Hook computes KPIs, trend data, destination aggregations, insights
5. **Re-render**: Filter changes trigger recomputation → UI updates

## Key Decisions

- **CSV parsed at build time** (not runtime) for fast page loads and static export compatibility
- **Single client hook** (`useTourismData`) centralizes all filter logic and derived data
- **shadcn/ui components** for WCAG-compliant, accessible UI primitives
- **Recharts** for accessible chart rendering with built-in ARIA support
