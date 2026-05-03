# Power Trading ETRM

An Energy Trading and Risk Management (ETRM) platform built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Features

- **Dashboard**: Overview of trading activities and key metrics
- **Blotter**: Trade capture and management with filtering, sorting, and search capabilities
- **Market Data**: Real-time market data visualization
- **Positions**: Track and manage trading positions
- **Validation**: Trade validation workflow
- **Confirmations**: Trade confirmation management
- **Settlement**: Settlement processing and tracking
- **Insights**: Analytics and reporting
- **Master Data**: Counterparty and product master data management

## Tech Stack

- **Framework**: Next.js 16.2.4
- **Language**: TypeScript 5.7.3
- **Styling**: Tailwind CSS v4.2.0
- **UI Components**: Radix UI primitives with custom components
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode support
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

```bash
# Create a production build
pnpm build

# Start the production server
pnpm start
```

### Linting

```bash
pnpm lint
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── blotter/           # Trade blotter page
│   ├── confirmations/     # Trade confirmations
│   ├── insights/          # Analytics and insights
│   ├── market-data/       # Market data views
│   ├── master-data/       # Master data management
│   ├── positions/         # Positions management
│   ├── settlement/        # Settlement processing
│   ├── validation/        # Trade validation
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (Dashboard)
├── components/            # React components
│   ├── modals/           # Modal dialogs
│   ├── pages/            # Page-level components
│   ├── shell/            # App shell components
│   ├── ui/               # Reusable UI components
│   └── theme-provider.tsx # Theme context provider
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and data
├── public/                # Static assets
└── styles/                # Additional stylesheets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## UI Components

This project uses shadcn/ui components built on Radix UI primitives:

- Accordion, Alert Dialog, Aspect Ratio
- Avatar, Checkbox, Collapsible
- Context Menu, Dialog, Dropdown Menu
- Hover Card, Label, Menubar
- Navigation Menu, Popover, Progress
- Radio Group, Scroll Area, Select
- Separator, Slider, Switch
- Tabs, Toast, Toggle, Toggle Group, Tooltip
- Calendar, Date Picker, Charts
- Command Palette, Carousel, Resizable Panels

## Configuration

- `next.config.mjs` - Next.js configuration
- `tailwind.config.mjs` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS configuration
- `components.json` - shadcn/ui configuration

## License

Private - All rights reserved
