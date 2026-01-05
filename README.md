# Salary Tax Calculator

A comprehensive salary tax calculator supporting multiple countries with detailed tax breakdowns, guides, and FAQs.

## Features

- **Multi-Country Support**: Calculate net income for US, Germany, UK, and more
- **Multiple Income Modes**: Hourly, monthly, and yearly calculations
- **Detailed Breakdowns**: See income tax, social contributions, and net income
- **Country-Specific Pages**: Dedicated pages with tax explanations and FAQs
- **Guides Section**: Educational articles on salary calculations and taxes
- **SEO Optimized**: Complete metadata, sitemaps, and structured data
- **Performance Optimized**: Dynamic imports, server components, and Core Web Vitals optimizations

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
npm start
```

## Adding a New Country

Use the automated scaffold generator:

```bash
npm run add:country <code> <name> <currency> [flag]
```

**Example:**
```bash
npm run add:country FR France EUR 🇫🇷
```

Or use tsx directly:
```bash
npx tsx scripts/addCountry.ts FR France EUR 🇫🇷
```

See [docs/ADDING_COUNTRY.md](./docs/ADDING_COUNTRY.md) for detailed instructions.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run ci` - Run CI checks (lint + format + test)
- `npm run add:country` - Add a new country (see docs)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── salary-calculator/  # Calculator pages
│   ├── guides/             # Guide articles
│   └── ...
├── components/             # React components
├── lib/                    # Utilities and helpers
│   ├── tax/               # Tax calculation logic
│   ├── countries.ts       # Country metadata
│   └── seo/               # SEO helpers
├── data/                   # Static data
│   ├── tax/               # Tax data JSON files
│   └── guides.ts          # Guide articles
└── types/                  # TypeScript types

scripts/
└── addCountry.ts          # Country scaffold generator

docs/
└── ADDING_COUNTRY.md      # Guide for adding countries
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vitest** - Testing
- **ESLint + Prettier** - Code quality

## Performance

The project is optimized for Core Web Vitals:
- Dynamic imports for heavy components
- Server components for content
- Loading skeletons
- Error boundaries
- Minimal JavaScript bundles

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed optimization information.

## License

[Your License Here]
