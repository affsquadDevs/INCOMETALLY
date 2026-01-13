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

## Repository Structure

```
template/
├── docs/                          # Documentation files
│   ├── ADDING_COUNTRY.md         # Guide for adding new countries
│   └── IMPROVEMENTS.md           # Improvement notes and ideas
│
├── public/                        # Static assets
│   ├── ads.txt                   # Ads.txt file for ad networks
│   ├── favicon.ico               # Site favicon
│   ├── images/
│   │   └── Logo.png              # Site logo
│   ├── robots.txt                # Robots.txt (generated)
│   └── sitemap.xml               # Sitemap (generated)
│
├── scripts/                       # Build and utility scripts
│   ├── addCountry.ts             # Country scaffold generator
│   ├── generate-favicon.js       # Favicon generator
│   ├── generate-robots.js       # Robots.txt generator
│   ├── generate-sitemap.js      # Sitemap generator
│   └── validate-tax-data.ts     # Tax data validation script
│
├── src/
│   ├── app/                       # Next.js App Router pages
│   │   ├── about-us/
│   │   │   └── page.tsx          # About us page
│   │   ├── actions/
│   │   │   └── calculate.ts      # Server actions for calculations
│   │   ├── api/                   # API routes
│   │   │   ├── calculate/
│   │   │   │   └── route.ts      # Calculation API endpoint
│   │   │   ├── germany-options/
│   │   │   │   └── route.ts      # Germany tax options API
│   │   │   ├── tax/
│   │   │   │   └── route.ts      # Tax calculation API
│   │   │   ├── uk-options/
│   │   │   │   └── route.ts      # UK tax options API
│   │   │   └── us-options/
│   │   │       └── route.ts      # US tax options API
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Dynamic blog post page
│   │   │   └── page.tsx          # Blog listing page
│   │   ├── calculator/
│   │   │   └── page.tsx          # Main calculator page
│   │   ├── contact/
│   │   │   └── page.tsx          # Contact page
│   │   ├── guides/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Dynamic guide page
│   │   │   └── page.tsx          # Guides listing page
│   │   ├── hourly-to-salary/
│   │   │   └── page.tsx          # Hourly to salary converter
│   │   ├── meeting-planner/
│   │   │   └── page.tsx          # Meeting planner page
│   │   ├── net-salary-calculator/
│   │   │   └── page.tsx          # Net salary calculator page
│   │   ├── privacy/
│   │   │   └── page.tsx          # Privacy policy page
│   │   ├── salary-calculator/
│   │   │   ├── [country]/
│   │   │   │   └── page.tsx      # Country-specific calculator
│   │   │   └── page.tsx          # Salary calculator hub
│   │   ├── terms/
│   │   │   └── page.tsx          # Terms of service page
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx            # Root layout component
│   │   ├── page.tsx              # Home page
│   │   ├── robots.ts             # Dynamic robots.txt generator
│   │   └── sitemap.ts            # Dynamic sitemap generator
│   │
│   ├── components/                # React components
│   │   ├── AdSlot.tsx            # Advertisement slot component
│   │   ├── AnimatedBlock.tsx     # Animated block component
│   │   ├── BlogCard.tsx          # Blog card component
│   │   ├── CalculatorForm.tsx    # Calculator form component
│   │   ├── CalculatorSkeleton.tsx # Loading skeleton for calculator
│   │   ├── CustomSelect.tsx      # Custom select dropdown
│   │   ├── ErrorBoundary.tsx     # Error boundary component
│   │   ├── ExampleCalculation.tsx # Example calculation display
│   │   ├── FAQAccordion.tsx      # FAQ accordion component
│   │   ├── Footer.tsx            # Footer component
│   │   ├── MetricCard.tsx        # Metric card component
│   │   ├── Navbar.tsx            # Navigation bar component
│   │   ├── SalaryCalculator.tsx  # Main salary calculator component
│   │   ├── TaxDisclaimer.tsx     # Tax disclaimer component
│   │   └── TypewriterText.tsx    # Typewriter effect component
│   │
│   ├── config/                    # Configuration files
│   │   ├── privacy.ts            # Privacy policy content
│   │   ├── site.ts               # Site configuration
│   │   └── terms.ts              # Terms of service content
│   │
│   ├── data/                      # Static data files
│   │   ├── blogs.ts              # Blog posts data
│   │   ├── guides.ts             # Guides data
│   │   ├── longtail-intents.ts   # SEO longtail intents
│   │   └── tax/                  # Tax data by country
│   │       ├── de/               # Germany tax data
│   │       │   ├── 2026.json     # 2026 tax brackets
│   │       │   └── germany-options.json
│   │       ├── uk/               # UK tax data
│   │       │   ├── 2026.json     # 2026 tax brackets
│   │       │   └── uk-options.json
│   │       └── us/               # US tax data
│   │           ├── 2026.json     # 2026 tax brackets
│   │           └── us-options.json
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── analytics.ts          # Analytics utilities
│   │   ├── calculator-state.ts   # Calculator state management
│   │   ├── countries.ts          # Country metadata and utilities
│   │   ├── tax.ts                # Tax calculation utilities
│   │   ├── urlState.ts           # URL state management
│   │   ├── seo/                  # SEO utilities
│   │   │   ├── breadcrumbs.ts   # Breadcrumb generation
│   │   │   ├── faq.ts           # FAQ schema generation
│   │   │   └── internal-links.ts # Internal linking utilities
│   │   └── tax/                  # Tax calculation logic
│   │       ├── __tests__/        # Tax calculation tests
│   │       │   ├── calc.test.ts
│   │       │   ├── germany.test.ts
│   │       │   └── us.test.ts
│   │       ├── calc.ts          # Core calculation logic
│   │       ├── germany.ts       # Germany tax calculations
│   │       ├── schema.ts        # Tax data schemas
│   │       ├── types.ts         # Tax types
│   │       ├── uk.ts            # UK tax calculations
│   │       ├── us-schema.ts     # US tax schema
│   │       └── us.ts            # US tax calculations
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── germany.ts           # Germany-specific types
│   │   ├── tax.ts               # General tax types
│   │   ├── uk.ts                # UK-specific types
│   │   └── us.ts                # US-specific types
│   │
│   └── middleware.ts             # Next.js middleware
│
├── .gitignore                    # Git ignore rules
├── next-env.d.ts                 # Next.js TypeScript declarations
├── next.config.js                # Next.js configuration
├── package.json                   # NPM dependencies and scripts
├── package-lock.json             # NPM lock file
├── PERFORMANCE.md                # Performance optimization notes
├── postcss.config.js             # PostCSS configuration
├── README.md                     # Project README
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.tsbuildinfo          # TypeScript build info
└── vitest.config.ts              # Vitest test configuration
```

### Key Directories

- **`src/app/`** - Next.js 14 App Router pages and routes
- **`src/components/`** - Reusable React components
- **`src/lib/tax/`** - Core tax calculation logic for different countries
- **`src/data/tax/`** - JSON files containing tax brackets and rules by country
- **`scripts/`** - Utility scripts for generating sitemaps, robots.txt, and adding countries
- **`docs/`** - Project documentation and guides

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
