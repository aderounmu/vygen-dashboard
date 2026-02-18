import React from 'react';
import { RiskLevel, ActionType } from '../types';

interface BadgeProps {
  level?: RiskLevel;
  action?: ActionType;
  text?: string;
  className?: string;
}

export const RiskBadge: React.FC<BadgeProps> = ({ level, action, text, className }) => {
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';

  if (level) {
    switch (level) {
      case RiskLevel.LOW:
        colorClass = 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        break;
      case RiskLevel.MEDIUM:
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
        break;
      case RiskLevel.HIGH:
        colorClass = 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
        break;
      case RiskLevel.CRITICAL:
        colorClass = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        break;
    }
  }

  if (action) {
    switch (action) {
      case ActionType.ALLOW:
        colorClass = 'bg-green-50 text-green-700 border-green-200';
        break;
      case ActionType.AUDIT:
        colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
        break;
      case ActionType.WARN:
        colorClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
        break;
      case ActionType.BLOCK:
        colorClass = 'bg-red-50 text-red-700 border-red-200';
        break;
    }
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} ${className || ''}`}>
      {text || level || action}
    </span>
  );
};