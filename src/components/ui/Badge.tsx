import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'todo' | 'progress' | 'review' | 'done' | 'high' | 'medium' | 'low' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className }) => {
  const variants = {
    todo: 'bg-[#ECEFF1] text-[#546E7A]',
    progress: 'bg-[#E8F0FE] text-[#1A73E8]',
    review: 'bg-[#F3E5F5] text-[#6A1B9A]',
    done: 'bg-[#E8F5E9] text-[#2E7D32]',
    high: 'bg-[#FFEBEE] text-[#C62828]',
    medium: 'bg-[#FFF3E0] text-[#E65100]',
    low: 'bg-[#E8F5E9] text-[#2E7D32]',
    neutral: 'bg-slate-100 text-slate-600',
  };

  return (
    <span className={cn('badge inline-block', variants[variant], className)}>
      {children}
    </span>
  );
};
