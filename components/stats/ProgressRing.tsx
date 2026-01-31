import { useEffect, useState } from "react";

interface ProgressRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
}

const ProgressRing = ({ percentage, size = 200, strokeWidth = 12, label = "Accuracy" }: ProgressRingProps) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (animatedPercentage / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 1500;
            const steps = 60;
            const stepValue = percentage / steps;
            let current = 0;

            const interval = setInterval(() => {
                current += stepValue;
                if (current >= percentage) {
                    setAnimatedPercentage(percentage);
                    clearInterval(interval);
                } else {
                    setAnimatedPercentage(current);
                }
            }, duration / steps);

            return () => clearInterval(interval);
        }, 300);

        return () => clearTimeout(timer);
    }, [percentage]);

    if(percentage == 0){
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-textColor">
                    0%
                </span>
                <span className="text-sm text-textColor mt-1">{label}</span>
            </div>
        )
    }
    return (
        <div className={`relative glass backdrop-blur-xl
        rounded-3xl p-4 md:p-6
        shadow-lg dark:shadow-2xl
        transition-all duration-300 ease-out
        overflow-hidden`}>
            {/* Background glow */}
            <div
                className="absolute rounded-full bg-primary/20 blur-3xl animate-pulse-glow"
                style={{ width: size * 0.8, height: size * 0.8 }}
            />

            <svg width={size} height={size} className="progress-ring transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={strokeWidth}
                    className="opacity-50"
                />

                {/* Animated progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-100 ease-out"
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                        <stop offset="100%" stopColor="hsl(275, 100%, 52%)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-textColor">
                    {Math.round(animatedPercentage)}%
                </span>
                <span className="text-sm text-textColor mt-1">{label}</span>
            </div>
        </div>
    );
};

export default ProgressRing;