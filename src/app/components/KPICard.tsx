import React from 'react';
import { Card } from './ui/card';
import { cn } from './ui/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'critical';
  className?: string;
}

export function KPICard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon: Icon,
  trend,
  status,
  className,
}: KPICardProps) {
  const trendColors = {
    up: change && change > 0 ? 'text-red-600' : 'text-green-600',
    down: change && change < 0 ? 'text-green-600' : 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-lg text-gray-500">{unit}</span>}
          </div>
          {(change !== undefined || changeLabel) && (
            <div className={cn('mt-2 text-sm font-medium', trend && trendColors[trend])}>
              {change !== undefined && (
                <span>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
              )}
              {changeLabel && <span className="ml-1 text-gray-500">{changeLabel}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-white/50 rounded-lg">
            <Icon className="h-6 w-6 text-gray-700" />
          </div>
        )}
      </div>
    </Card>
  );
}