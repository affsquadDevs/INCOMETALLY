'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
  label?: string;
  id?: string;
  className?: string;
  buttonClassName?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  id,
  className = '',
  buttonClassName = '',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value) || options[0];

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-black mb-2"
        >
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border border-black border-opacity-20 rounded-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent flex items-center justify-between transition-all hover:border-opacity-30 ${buttonClassName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-left">{selectedOption.label}</span>
        <svg
          className={`w-4 h-4 text-black transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black border-opacity-20 rounded-sm shadow-lg">
          <ul
            role="listbox"
            className="py-1 max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={`px-4 py-2.5 cursor-pointer transition-colors text-black ${
                  option.value === value
                    ? 'bg-[#0066FF] bg-opacity-10 font-medium'
                    : 'hover:bg-black hover:bg-opacity-5'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

