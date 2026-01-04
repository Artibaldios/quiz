import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  delay?: number;
  gradient?: boolean;
}

const StatCard = ({ title, value, suffix = "", icon: Icon, delay = 0, gradient = false }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 100);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    
    const interval = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [value, isVisible]);

  return (
    <div 
      className={`         
        relative bg-gray-100 dark:bg-zinc-900/80 backdrop-blur-xl
        border border-white/20 dark:border-zinc-700/50
        rounded-3xl p-4 md:p-6
        shadow-lg dark:shadow-2xl
        transition-all duration-300 ease-out
        overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        </div>
        
        <h3 className="text-sm font-medium text-textColor mb-2">{title}</h3>
        
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-bold font-display tracking-tight text-textColor`}>
            {displayValue}
          </span>
          {suffix && (
            <span className="text-xl font-medium text-textColor">{suffix}</span>
          )}
        </div>
      </div>
      
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
    </div>
  );
};

export default StatCard;
