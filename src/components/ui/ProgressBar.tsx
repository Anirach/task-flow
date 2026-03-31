import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = '#1A73E8', height = 'h-2' }) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%`, backgroundColor: color }}
      />
    </div>
  );
};
