import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6', 
    large: 'w-8 h-8'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`}></div>
      {text && <p className="text-muted-foreground animate-pulse font-medium">{text}</p>}
    </div>
  );
};

interface LoadingCardProps {
  className?: string;
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-card/50 rounded-lg p-4 border border-border/50 ${className}`}>
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-muted rounded w-2/3"></div>
    </div>
  );
};

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

export const LoadingTable: React.FC<LoadingTableProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-3 bg-card/50 rounded-lg border border-border/50">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 h-4 bg-muted rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
