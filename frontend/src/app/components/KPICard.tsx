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
  icon?: LucideIcon | React.ReactNode;
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
  icon,
  trend,
  status,
  className,
}: KPICardProps) {
  const trendColors = {
    up: change && change > 0 ? 'text-destructive' : 'text-success',
    down: change && change < 0 ? 'text-success' : 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  // Determine how to render the icon - support both component references and JSX elements
  const renderIcon = () => {
    if (!icon) return null;
    // If icon is a valid React element (JSX), render it directly
    if (React.isValidElement(icon)) {
      return icon;
    }
    // If icon is a component (function/class), render it as a component
    const IconComponent = icon as LucideIcon;
    return <IconComponent className="h-6 w-6 text-foreground" />;
  };

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {(change !== undefined || changeLabel) && (
            <div className={cn('mt-2 text-sm font-medium', trend && trendColors[trend])}>
              {change !== undefined && (
                <span>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
              )}
              {changeLabel && <span className="ml-1 text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-card/50 rounded-lg">
            {renderIcon()}
          </div>
        )}
      </div>
    </Card>
  );
}