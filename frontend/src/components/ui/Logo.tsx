import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Stylized House with Flowing Wave */}
      <svg 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        aria-label="StayFlow Logo"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--sf-primary)" />
            <stop offset="100%" stopColor="var(--sf-primary-600)" />
          </linearGradient>
        </defs>
        
        {/* House Roof */}
        <path 
          d="M16 2L2 14H6V26C6 27.1 6.9 28 8 28H24C25.1 28 26 27.1 26 26V14H30L16 2Z" 
          fill="url(#logoGradient)" 
          className="opacity-20"
        />
        
        {/* The 'Flow' S-shape inside/overlaying the house */}
        <path 
          d="M16 6L26 15V26C26 27.1046 25.1046 28 24 28H8C6.89543 28 6 27.1046 6 26V15L16 6Z" 
          stroke="var(--sf-primary)" 
          strokeWidth="2" 
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Dynamic Wave Element */}
        <path 
          d="M9 22C9 22 11.5 19 16 19C20.5 19 23 22 23 22" 
          stroke="var(--sf-primary)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        <circle cx="16" cy="14" r="2" fill="var(--sf-primary)" />
      </svg>
      
      {/* Text Logo */}
      {showText && (
        <span className="font-bold text-xl tracking-tight text-[var(--sf-primary)]">
          Stay<span className="text-[var(--sf-text)]">Flow</span>
        </span>
      )}
    </div>
  );
};
