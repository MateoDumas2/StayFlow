import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative w-24 h-24 mb-6">
          {/* House Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full text-[#FF385C] drop-shadow-lg"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          
          {/* Musical Note "Flow" Animation */}
          <div className="absolute -top-4 -right-4 animate-bounce duration-1000">
             <svg 
               viewBox="0 0 24 24" 
               fill="currentColor" 
               className="w-10 h-10 text-[#008489]"
             >
               <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
               <circle cx="6" cy="18" r="3" />
               <circle cx="18" cy="16" r="3" />
             </svg>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-widest text-[#222222]">
            <span className="text-[#FF385C]">Stay</span>
            <span className="text-[#008489]">Flow</span>
          </h1>
          
          {/* Loading Indicator */}
          <div className="flex gap-2 mt-2">
            <div className="w-2.5 h-2.5 bg-[#FF385C] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2.5 h-2.5 bg-[#008489] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2.5 h-2.5 bg-[#FF385C] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
