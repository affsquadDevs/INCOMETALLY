'use client';

import { useState, ReactNode } from 'react';

export interface FAQ {
  question: string;
  answer: string | ReactNode;
}

interface FAQAccordionProps {
  faqs: FAQ[];
  className?: string;
}

export default function FAQAccordion({ faqs, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-black border-opacity-10 overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-black hover:bg-opacity-5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:ring-inset"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-lg font-medium text-black pr-4">
              {faq.question}
            </span>
            <svg
              className={`w-5 h-5 text-black flex-shrink-0 transition-transform ${
                openIndex === index ? 'transform rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            id={`faq-answer-${index}`}
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={openIndex !== index}
          >
            <div className="px-6 py-4 border-t border-black border-opacity-10">
              {typeof faq.answer === 'string' ? (
                <p className="text-base text-black opacity-70 leading-relaxed">
                  {faq.answer}
                </p>
              ) : (
                <div className="text-base text-black opacity-70 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

