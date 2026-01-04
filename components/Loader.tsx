import React from 'react';

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderColor = 'blue' | 'gray' | 'green' | 'red' | 'yellow' | 'purple' | 'white';
export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'ring';

interface LoaderProps {
  size?: LoaderSize;
  color?: LoaderColor;
  variant?: LoaderVariant;
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'blue',
  variant = 'spinner',
  className = '',
  fullScreen = false,
  text,
}) => {
  // Size mappings
  const sizeClasses: Record<LoaderSize, string> = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Color mappings
  const colorClasses: Record<LoaderColor, string> = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    white: 'text-white',
  };

  // Variant renderers
  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-b-4 ${colorClasses[color]} ${sizeClasses[size]}`} />
  );

  const renderDots = () => (
    <div className="flex items-center space-x-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`animate-bounce rounded-full ${colorClasses[color]} ${
            size === 'xs' ? 'h-1 w-1' :
            size === 'sm' ? 'h-1.5 w-1.5' :
            size === 'md' ? 'h-2 w-2' :
            size === 'lg' ? 'h-2.5 w-2.5' :
            'h-3 w-3'
          }`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`animate-pulse rounded-full bg-current ${colorClasses[color]} ${sizeClasses[size]}`} />
  );

  const renderRing = () => (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 rounded-full border-2 border-current ${colorClasses[color]} opacity-25`} />
      <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin ${colorClasses[color]}`} />
    </div>
  );

  const variants = {
    spinner: renderSpinner(),
    dots: renderDots(),
    pulse: renderPulse(),
    ring: renderRing(),
  };

  const loaderContent = (
    <div className={`h-full flex-1 flex flex-col items-center justify-center ${className}`}>
      {variants[variant]}
      {text && (
        <p className={`mt-2 text-sm font-medium ${colorClasses[color]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          {variants[variant]}
          {text && (
            <p className={`text-lg font-medium ${colorClasses[color]}`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return loaderContent;
};

export default Loader;