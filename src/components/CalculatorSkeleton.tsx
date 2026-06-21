/**
 * Loading skeleton for calculator component
 * Provides visual feedback while calculator loads
 * Improves perceived performance and Core Web Vitals (LCP)
 */

export default function CalculatorSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Mode Toggle Skeleton */}
      <div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-3"></div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 w-64">
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Inputs Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-full bg-gray-200 rounded-sm"></div>
          </div>
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-wrap gap-3">
        <div className="h-10 w-32 bg-gray-200 rounded-sm"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-sm"></div>
      </div>

      {/* Results Section Skeleton */}
      <div className="bg-gray-200 rounded-lg p-6 lg:p-8">
        <div className="h-8 w-48 bg-gray-300 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
              <div className="h-10 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
