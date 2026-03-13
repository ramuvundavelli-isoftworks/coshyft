// European KPI Card Component
// Phase 2: Europe & Ireland Alignment - Enhanced KPI Cards with EU/Irish Metrics

import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { formatCurrency, formatEmissions, formatPercentage, formatNumber } from '../utils/localization';
import type { SupportedLocale, SupportedCurrency } from '../types';

interface EuropeanKPICardProps {
  title: string;
  value: number;
  unit?: 'currency' | 'emissions' | 'percentage' | 'number';
  currency?: SupportedCurrency;
  locale?: SupportedLocale;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  target?: number;
  targetLabel?: string;
  euCompliant?: boolean;
  csrdAligned?: boolean;
  description?: string;
  additionalMetrics?: Array<{
    label: string;
    value: string;
  }>;
}

export default function EuropeanKPICard({
  title,
  value,
  unit = 'number',
  currency,
  locale = 'en-IE',
  trend,
  trendLabel,
  icon,
  iconBgColor = 'bg-gray-100',
  target,
  targetLabel,
  euCompliant,
  csrdAligned,
  description,
  additionalMetrics,
}: EuropeanKPICardProps) {
  const formatValue = () => {
    switch (unit) {
      case 'currency':
        return formatCurrency(value, currency, locale);
      case 'emissions':
        return formatEmissions(value, locale);
      case 'percentage':
        return formatPercentage(value, locale);
      case 'number':
      default:
        return formatNumber(value, locale, 0);
    }
  };

  const formatTargetValue = () => {
    if (!target) return null;
    switch (unit) {
      case 'currency':
        return formatCurrency(target, currency, locale);
      case 'emissions':
        return formatEmissions(target, locale);
      case 'percentage':
        return formatPercentage(target, locale);
      case 'number':
      default:
        return formatNumber(target, locale, 0);
    }
  };

  const targetPercentage = target ? (value / target) * 100 : null;
  const isOverTarget = targetPercentage ? targetPercentage > 100 : false;
  const isUnderTarget = targetPercentage ? targetPercentage < 100 : false;

  return (
    <Card className="p-4 border border-gray-200 hover:border-[#00bc7d] transition-colors">
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className={`p-2 ${iconBgColor} rounded-lg`}>
            {icon}
          </div>
        )}
        <div className="flex items-center gap-2">
          {euCompliant && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
              🇪🇺 EU
            </Badge>
          )}
          {csrdAligned && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
              CSRD
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-sm text-[#6a7282] mb-1">{title}</p>
        <p className="text-2xl font-semibold text-[#101828]">{formatValue()}</p>
      </div>

      {/* Trend Indicator */}
      {trend !== undefined && (
        <div className="flex items-center gap-1 mb-2">
          {trend > 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                +{formatPercentage(Math.abs(trend), locale)}
              </span>
            </>
          ) : trend < 0 ? (
            <>
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">
                {formatPercentage(trend, locale)}
              </span>
            </>
          ) : (
            <span className="text-xs text-[#6a7282] font-medium">No change</span>
          )}
          {trendLabel && <span className="text-xs text-[#6a7282] ml-1">{trendLabel}</span>}
        </div>
      )}

      {/* Target Progress */}
      {target && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#6a7282]">{targetLabel || 'Target'}</span>
            <span className="font-medium text-[#101828]">{formatTargetValue()}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOverTarget
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : isUnderTarget
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                  : 'bg-gradient-to-r from-[#00bc7d] to-[#009689]'
              }`}
              style={{ width: `${Math.min(targetPercentage || 0, 100)}%` }}
            />
          </div>
          <p className="text-xs text-[#6a7282] mt-1">
            {targetPercentage !== null &&
              `${formatPercentage(targetPercentage, locale)} of target`}
          </p>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mb-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-3 w-3 text-[#6a7282] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#6a7282]">{description}</p>
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      {additionalMetrics && additionalMetrics.length > 0 && (
        <div className="space-y-1 pt-2 border-t border-gray-200">
          {additionalMetrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs text-[#6a7282]">{metric.label}</span>
              <span className="text-xs font-medium text-[#101828]">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
