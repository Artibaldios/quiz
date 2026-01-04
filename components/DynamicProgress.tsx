import React, { useState, useEffect } from 'react';

interface DynamicProgressProps {
  targetValue: number;
  duration?: number;
}

export const DynamicProgress: React.FC<DynamicProgressProps> = ({ 
  targetValue, 
  duration = 2000 
}) => {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('0%');

  useEffect(() => {
    let current = 0;
    const increment = targetValue / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(timer);
      }
      setProgress(current);
      setDisplayText(`${Math.round(current)}%`);
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return (
    <div className="w-full bg-white dark:bg-gray-100  rounded-full h-6 relative overflow-hidden shadow-md mt-2 mb-4">
      <div 
        className="bg-primary h-full transition-all duration-100 ease-linear rounded-full flex items-center justify-center border-4 border-primary font-bold text-white text-sm shadow-lg"
        style={{ width: `${progress}%` }}
      >
        {displayText}
      </div>
    </div>
  );
};
