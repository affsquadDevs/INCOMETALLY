'use client';

import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  highlightWords?: string[];
  highlightColor?: string;
  speed?: number;
  className?: string;
  showImmediately?: boolean; // New prop to show text immediately for LCP
}

export default function TypewriterText({
  text,
  highlightWords = [],
  highlightColor = '#0066FF',
  speed = 60,
  className = '',
  showImmediately = false, // Default to false for backward compatibility
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState(showImmediately ? text : '');
  const [currentIndex, setCurrentIndex] = useState(showImmediately ? text.length : 0);
  const [showCursor, setShowCursor] = useState(true);
  const [isAnimating, setIsAnimating] = useState(!showImmediately);

  useEffect(() => {
    // If showImmediately is true, skip animation
    if (showImmediately) {
      setIsAnimating(false);
      return;
    }

    if (currentIndex < text.length) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsAnimating(false);
      // Hide cursor after typing is complete
      const timeout = setTimeout(() => setShowCursor(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, showImmediately]);

  const shouldHighlight = (word: string) => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    return highlightWords.some((hw) => cleanWord.includes(hw.toLowerCase()));
  };

  const renderText = () => {
    if (!displayedText) return null;

    const words = displayedText.split(' ');
    return words.map((word, index) => {
      const isHighlighted = shouldHighlight(word);
      const isLastWord = index === words.length - 1;

      return (
        <span key={index}>
          {isHighlighted ? (
            <span style={{ color: highlightColor }}>{word}</span>
          ) : (
            <span>{word}</span>
          )}
          {!isLastWord && ' '}
        </span>
      );
    });
  };

  return (
    <span className={className}>
      {renderText()}
      {showCursor && currentIndex <= text.length && isAnimating && (
        <span
          className="inline-block w-[2px] h-[0.9em] bg-black ml-1 align-middle animate-pulse"
          style={{ animation: 'blink 1s infinite', willChange: 'opacity' }}
        ></span>
      )}
    </span>
  );
}
