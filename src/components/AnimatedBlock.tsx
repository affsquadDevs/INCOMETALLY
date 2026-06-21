'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedBlockProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animationType?: 'fade' | 'slide' | 'fade-slide';
  showImmediately?: boolean; // New prop to show content immediately for LCP
}

export default function AnimatedBlock({
  children,
  delay = 0,
  className = '',
  animationType = 'fade-slide',
  showImmediately = false, // Default to false for backward compatibility
}: AnimatedBlockProps) {
  // Show immediately if showImmediately is true (for LCP-critical content)
  const [isVisible, setIsVisible] = useState(showImmediately);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If showImmediately is true, skip observer
    if (showImmediately) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // Start animation slightly before element is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, showImmediately]);

  const animationClasses = {
    fade: isVisible ? 'opacity-100' : 'opacity-0',
    slide: isVisible ? 'translate-y-0' : 'translate-y-8',
    'fade-slide': isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animationClasses[animationType]} ${className}`}
      style={{
        willChange: isVisible ? 'auto' : 'transform, opacity',
        // Use transform for better performance
        transform:
          animationType === 'slide' || animationType === 'fade-slide'
            ? isVisible
              ? 'translateY(0)'
              : 'translateY(2rem)'
            : undefined,
      }}
    >
      {children}
    </div>
  );
}
