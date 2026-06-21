'use client';

import { useId, useState, useEffect, useRef } from 'react';

interface MetricCardProps {
  value: string | number;
  change: number; // percentage change (e.g., 8.2 for +8.2%)
  subtitle?: string;
  chartData?: number[]; // array of values for the chart
  startAnimation?: boolean; // trigger for count-up animation
}

export default function MetricCard({
  //   label,
  value,
  change,
  subtitle = 'Compared to previous period',
  chartData,
  startAnimation = false,
}: MetricCardProps) {
  const gradientId = useId();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const animationStartedRef = useRef(false);

  // Parse value - handle both string with commas and numbers
  const numericValue =
    typeof value === 'number' ? value : parseFloat(value.toString().replace(/,/g, '').trim()) || 0;

  const isNumeric = numericValue > 0 && !isNaN(numericValue);

  // Generate default chart data if not provided
  const defaultChartData = chartData || [
    45, 52, 48, 61, 55, 58, 65, 62, 68, 72, 75, 80, 78, 82, 85, 88, 90, 92, 95, 100,
  ];

  // Normalize data for chart (0-100 scale)
  const maxValue = Math.max(...defaultChartData);
  const minValue = Math.min(...defaultChartData);
  const range = maxValue - minValue || 1;
  const normalizedData = defaultChartData.map((val) => ((val - minValue) / range) * 100);

  // Generate SVG path for line chart
  const width = 280;
  const height = 60;
  const padding = 8;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = normalizedData.map((value, index) => {
    const x = padding + (index / (normalizedData.length - 1)) * chartWidth;
    const y = padding + chartHeight - (value / 100) * chartHeight;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;

  // Area path (closed path for fill)
  const areaPath = `${linePath} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  // Count-up animation effect - trigger when component is visible
  useEffect(() => {
    if (animationStartedRef.current) return;
    if (!isNumeric || numericValue <= 0) return;

    let timer: NodeJS.Timeout | null = null;
    let slowGrowthTimer: NodeJS.Timeout | null = null;
    let initDelay: NodeJS.Timeout | null = null;

    // Use Intersection Observer to detect when card is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (startAnimation || entry.isIntersecting)) {
          // Start animation when card becomes visible
          if (animationStartedRef.current) return;
          animationStartedRef.current = true;

          // Small delay to ensure card is visible before animation starts
          initDelay = setTimeout(() => {
            setHasStarted(true);
            const duration = 2000; // 2 seconds for initial animation
            const steps = 60;
            const increment = numericValue / steps;
            let step = 0;

            timer = setInterval(() => {
              step++;
              const current = Math.min(increment * step, numericValue);
              setAnimatedValue(current);

              if (step >= steps) {
                if (timer) {
                  clearInterval(timer);
                  timer = null;
                }
                // Start infinite slow growth
                slowGrowthTimer = setInterval(() => {
                  setAnimatedValue((prev) => {
                    // Very slow growth - about 0.01% per second
                    const growthRate = numericValue * 0.00001;
                    return prev + growthRate;
                  });
                }, 100);
              }
            }, duration / steps);
          }, 300); // Small delay after card appears

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
      if (initDelay) clearTimeout(initDelay);
      if (timer) clearInterval(timer);
      if (slowGrowthTimer) clearInterval(slowGrowthTimer);
    };
  }, [startAnimation, numericValue, isNumeric]);

  const isPositive = change >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444'; // green for positive, red for negative

  // Format displayed value
  const displayValue =
    isNumeric && hasStarted
      ? Math.floor(animatedValue).toLocaleString()
      : isNumeric && !hasStarted
        ? '0'
        : value;

  return (
    <div
      ref={cardRef}
      className="bg-transparent   rounded-xl px-2 pt-2  lg:p-4 transition-all duration-300 hover:bg-[#e0e0de]  group"
    >
      {/* Label */}
      {/* Value and Change */}
      <div className="flex items-baseline gap-3 mb-2 lg:mb-3">
        <div className="text-3xl lg:text-4xl xl:text-5xl font-normal text-black tracking-[-0.02em]  transition-colors">
          {displayValue}
        </div>
        <div
          className="text-sm lg:text-base font-normal flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ color: changeColor }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isPositive ? '' : 'rotate-180'}
          >
            <path d="M6 2L10 6H7V10H5V6H2L6 2Z" fill="currentColor" />
          </svg>
          {isPositive ? '+' : ''}
          {change.toFixed(1)}%
        </div>
      </div>

      {/* Subtitle */}
      <div className="text-xs lg:text-sm text-black opacity-60 mb-3 lg:mb-4 group-hover:opacity-80 transition-opacity">
        {subtitle}
      </div>

      {/* Chart */}
      <div className="mt-0">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            {/* Blue gradient (default) */}
            <linearGradient id={`${gradientId}-blue`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0066FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
            </linearGradient>
            {/* Green gradient (hover) */}
            <linearGradient id={`${gradientId}-green`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
            {/* Filter for drop shadow - blue */}
            <filter id={`shadow-${gradientId}-blue`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#0066FF"
                floodOpacity="0.5"
              />
            </filter>
            {/* Filter for drop shadow - green */}
            <filter id={`shadow-${gradientId}-green`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#10B981"
                floodOpacity="0.5"
              />
            </filter>
          </defs>
          {/* Area fill - blue */}
          <path
            d={areaPath}
            fill={`url(#${gradientId}-blue)`}
            className="opacity-100 group-hover:opacity-0 transition-opacity duration-300"
          />
          {/* Area fill - green */}
          <path
            d={areaPath}
            fill={`url(#${gradientId}-green)`}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          {/* Line - blue */}
          <path
            d={linePath}
            fill="none"
            stroke="#0066FF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-100 group-hover:opacity-0 transition-opacity duration-300"
            style={{ filter: `url(#shadow-${gradientId}-blue)` }}
          />
          {/* Line - green */}
          <path
            d={linePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ filter: `url(#shadow-${gradientId}-green)` }}
          />
        </svg>
      </div>
    </div>
  );
}
