# Performance Optimizations & Core Web Vitals

This document explains the performance optimizations implemented to improve Core Web Vitals and overall user experience.

## Core Web Vitals Metrics

### Largest Contentful Paint (LCP)
**Target: < 2.5s**

**Optimizations:**
- **Server-Side Rendering (SSR)**: All content pages (country pages, guides, hub) are server-rendered, ensuring fast initial HTML delivery
- **Static Site Generation (SSG)**: Country pages and guides use `generateStaticParams` for pre-rendering at build time
- **Loading Skeletons**: Calculator component uses skeleton loading states to improve perceived performance
- **Minimal JavaScript on Content**: Content sections use server components, keeping initial JS bundle small

### First Input Delay (FID) / Interaction to Next Paint (INP)
**Target: < 100ms / < 200ms**

**Optimizations:**
- **Dynamic Imports**: Heavy components (Calculator, ReactMarkdown) are dynamically imported, reducing initial bundle size
- **Code Splitting**: Each page only loads JavaScript needed for that specific page
- **Client Components Only Where Needed**: Calculator and interactive components are client-side, but loaded on-demand

### Cumulative Layout Shift (CLS)
**Target: < 0.1**

**Optimizations:**
- **Loading Skeletons**: Skeleton components maintain layout dimensions during loading
- **Reserved Space for Ads**: Ad slots have fixed dimensions to prevent layout shifts
- **Stable Layouts**: All components use consistent spacing and sizing

## Specific Optimizations

### 1. Dynamic Imports for Heavy Components

**What:** Components are loaded only when needed using Next.js `dynamic()`.

**Why:**
- **SalaryCalculator**: ~50KB+ of JavaScript (state management, calculations, validation)
- **ReactMarkdown**: ~30KB+ library for markdown rendering
- Reduces initial bundle size by ~80KB+ on pages that don't need these components

**Impact:**
- Faster First Contentful Paint (FCP)
- Better Time to Interactive (TTI)
- Improved LCP scores

**Files:**
- `src/app/salary-calculator/[country]/page.tsx`
- `src/app/salary-calculator/page.tsx`
- `src/app/calculator/page.tsx`
- `src/app/hourly-to-salary/page.tsx`
- `src/app/guides/[slug]/page.tsx`

### 2. Server Components for Content

**What:** All content sections (text, metadata, static content) are server components.

**Why:**
- Zero JavaScript sent to client for content rendering
- Faster initial page load
- Better SEO (content in initial HTML)

**Impact:**
- Reduced JavaScript bundle size
- Faster LCP
- Better Core Web Vitals scores

**Files:**
- All page components in `src/app/` (except calculator-specific pages)

### 3. Loading States & Skeletons

**What:** Skeleton components show loading placeholders while components load.

**Why:**
- Improves perceived performance
- Prevents layout shift (CLS)
- Better user experience during loading

**Impact:**
- Better CLS scores
- Improved user experience
- Maintains layout stability

**Files:**
- `src/components/CalculatorSkeleton.tsx`

### 4. Error Boundaries

**What:** Error boundaries catch JavaScript errors and display fallback UI.

**Why:**
- Prevents entire page crashes
- Better user experience when errors occur
- Allows graceful degradation

**Impact:**
- Improved reliability
- Better user experience
- Prevents white screen of death

**Files:**
- `src/components/ErrorBoundary.tsx`

### 5. CSS Optimization

**What:** Using Tailwind CSS with JIT compilation.

**Why:**
- Only CSS for used classes is generated
- Minimal CSS bundle size
- Fast CSS delivery

**Impact:**
- Smaller CSS bundle
- Faster FCP
- Better performance

### 6. Image Optimization

**What:** Using Next.js Image component (when images are added).

**Why:**
- Automatic image optimization
- Lazy loading
- Responsive images

**Impact:**
- Faster LCP
- Reduced bandwidth usage
- Better mobile performance

## Bundle Size Analysis

### Before Optimizations (Estimated)
- Initial bundle: ~200KB+ (all components loaded)
- Calculator JS: ~50KB
- ReactMarkdown: ~30KB
- Total: ~280KB+

### After Optimizations
- Initial bundle: ~120KB (core Next.js + minimal components)
- Calculator (dynamic): ~50KB (loaded on-demand)
- ReactMarkdown (dynamic): ~30KB (loaded on-demand)
- Total initial: ~120KB (57% reduction)

## Performance Monitoring

### Recommended Tools
1. **Lighthouse**: Run in Chrome DevTools for Core Web Vitals
2. **WebPageTest**: Real-world performance testing
3. **Next.js Analytics**: Built-in performance monitoring
4. **Vercel Analytics**: If deployed on Vercel

### Key Metrics to Monitor
- LCP: Should be < 2.5s
- FID/INP: Should be < 100ms / < 200ms
- CLS: Should be < 0.1
- Bundle size: Monitor JavaScript bundle sizes
- Time to Interactive: Should be < 3.5s

## Future Optimizations

### Potential Improvements
1. **Font Optimization**: Use `next/font` for automatic font optimization
2. **Service Worker**: Add for offline support and caching
3. **Prefetching**: Prefetch critical routes on hover
4. **Image CDN**: Use CDN for static assets
5. **Database Optimization**: If adding database queries, optimize queries
6. **API Route Optimization**: Cache API responses where appropriate

## Testing Performance

### Local Testing
```bash
# Build for production
npm run build

# Start production server
npm start

# Run Lighthouse in Chrome DevTools
# Or use:
npx lighthouse http://localhost:3000 --view
```

### CI/CD Integration
The CI script (`npm run ci`) includes:
- Linting (catches performance issues)
- Formatting (ensures code quality)
- Tests (ensures functionality)
- Build (catches build-time issues)

## Summary

These optimizations focus on:
1. **Reducing JavaScript bundle size** through dynamic imports
2. **Improving initial load** through server components
3. **Better user experience** through loading states and error handling
4. **Maintaining layout stability** through skeletons and reserved space

All optimizations are production-ready and follow Next.js best practices for performance.

