# Atlas — Zimbabwe Tourism Destination Insights

## Problem
Tourism authorities and destination managers in Zimbabwe lack a unified, interactive view of visitor trends, spend patterns, service quality, and complaint themes across the country's eight national tourism destinations. Without this visibility, resource allocation and intervention decisions are made on intuition rather than evidence.

## Solution
An interactive dashboard that transforms the POTRAZ AI4I synthetic tourism dataset into actionable insights. The dashboard follows a four-step storytelling flow: Overview KPIs, Data Exploration via filters, Key Insights, and Recommended Actions. Users can filter by month, destination type, and province to drill into specific segments.

## Demo
- **Live link**: [deployed URL]
- **Local setup**: `pnpm install && pnpm dev` then open `http://localhost:3000/dashboard`
- **Video walkthrough**: [link to recording]

## Architecture
- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: shadcn/ui components + Tailwind CSS 4
- **Charts**: Recharts via shadcn ChartContainer
- **Data**: CSV parsed server-side at build time, passed as props to client components
- **Theme**: Light/dark mode via next-themes

## Data
- **Source**: `04_tourism_destination_insights.csv` — synthetic aggregate sample data provided by POTRAZ for the AI4I Design Track
- **Records**: 48 rows (8 destinations × 6 months)
- **Fields**: month, destination, province, district, coordinates, visitor_count, spend, service_quality, digital_booking, complaints
- **Rights**: Challenge-provided sample data. Not official tourism statistics.

## Setup
```bash
pnpm install
pnpm dev
# Open http://localhost:3000/dashboard
```

## Environment Variables
No environment variables required. The dashboard reads CSV data from `public/data/`.

## Tests
```bash
pnpm build  # TypeScript check + static generation
```

## Deployment
- Static export compatible (Vercel, Netlify, GitHub Pages)
- CSV data is bundled at build time
- No backend required

## Known Limitations
- Data is synthetic aggregate samples, not real tourism statistics
- Map positions are approximate centroids for prototyping only
- No user authentication (public dashboard)
- No real-time data refresh

## Team
Lawrence Njobo - Lead Innovator 
Mazvita Ziwira - UI/UX Designer 
Anisha Mudani - Data Analyst 
Tanatswa Mashumba - Technical Writer 
