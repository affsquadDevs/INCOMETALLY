'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '@/components/ErrorBoundary';
import CalculatorSkeleton from '@/components/CalculatorSkeleton';

// Dynamic import - calculator is heavy, load on demand
const SalaryCalculator = dynamic(
  () => import('@/components/SalaryCalculator'),
  {
    loading: () => <CalculatorSkeleton />,
    ssr: false,
  }
);

export default function CalculatorPage() {
  return (
    <div className="bg-[#F5F5F0] min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <h1 className="text-4xl md:text-5xl font-normal text-black mb-4 tracking-[-0.02em]">
          Tax Calculator
        </h1>
        <p className="text-lg text-black opacity-70 mb-8">
          Calculate your net income after taxes and social contributions
        </p>

        <ErrorBoundary>
          <SalaryCalculator />
        </ErrorBoundary>
      </div>
    </div>
  );
}

