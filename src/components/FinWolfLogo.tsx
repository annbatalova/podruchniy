import React from 'react';

interface FinWolfLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  showText?: boolean;
  lightText?: boolean;
}

export default function FinWolfLogo({
  className = '',
  width = 140,
  height = 40,
  showText = true,
  lightText = false
}: FinWolfLogoProps) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Hand-crafted elegant assistant / analytics portfolio book with trend indicator */}
      <svg
        width={typeof width === 'number' ? width * 0.35 : '32'}
        height={typeof height === 'number' ? height : '32'}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Sleek rounded shield/book badge */}
        <rect x="23" y="20" width="74" height="80" rx="14" fill="#0ea5e9" fillOpacity="0.08" stroke="#0ea5e9" strokeWidth="4" />
        
        {/* Dynamic rising bar chart pages */}
        <rect x="38" y="60" width="10" height="24" rx="2" fill="#38bdf8" />
        <rect x="53" y="48" width="10" height="36" rx="2" fill="#0ea5e9" />
        <rect x="68" y="36" width="10" height="48" rx="2" fill="#0284c7" />

        {/* Upward soar/sparkle path */}
        <path
          d="M38 72 L82 32 M82 32 L68 32 M82 32 L82 46"
          stroke="#38bdf8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic decorative dot */}
        <circle cx="82" cy="32" r="5" fill="#0ea5e9" />
      </svg>

      {/* Corporate branding text */}
      {showText && (
        <div className="flex items-baseline font-sans text-xl leading-none tracking-tight">
          <span className={`font-black ${lightText ? 'text-white' : 'text-slate-900'} font-sans`}>
            Подручный
          </span>
          <span className="font-extrabold text-sky-500 font-sans ml-1 text-xs uppercase tracking-wider">
            аналитик
          </span>
        </div>
      )}
    </div>
  );
}
