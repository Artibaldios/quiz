"use client";

import { useTranslations } from "next-intl";

interface ErrorUIProps {
  message: string;
  className?: string;
}

const ErrorUI = ({ message, className = "" }: ErrorUIProps) => {
  const t = useTranslations("common");

  return (
    <div className={`glass glass-border p-8 rounded-2xl text-center max-w-md mx-auto ${className}`}>
      {/* Icon */}
      <div className="w-20 h-20 mx-auto mb-6 p-5 bg-red-500/10 rounded-2xl border-2 border-red-400/30">
        <svg 
          className="w-12 h-12 mx-auto text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      {/* Message */}
      <h2 className="text-2xl font-bold text-textColor mb-4">
        {message}
      </h2>
      
      {/* Retry CTA */}
      <button 
        onClick={() => window.location.reload()} 
        className="px-6 py-2.5 bg-red-500/90 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {t("retry") ?? "Try Again"}
      </button>
    </div>
  );
};

export default ErrorUI;