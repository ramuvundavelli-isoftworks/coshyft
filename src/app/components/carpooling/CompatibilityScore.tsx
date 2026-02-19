import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  Clock,
  Heart,
  Star,
  TrendingUp,
} from 'lucide-react';
import { getMatchQuality } from '../../utils/carpoolMatching';

interface CompatibilityScoreProps {
  overallScore: number;
  routeScore?: number;
  timeScore?: number;
  preferencesScore?: number;
  ratingScore?: number;
  detailed?: boolean;
  compact?: boolean;
}

export default function CompatibilityScore({
  overallScore,
  routeScore,
  timeScore,
  preferencesScore,
  ratingScore,
  detailed = false,
  compact = false,
}: CompatibilityScoreProps) {
  const matchQuality = getMatchQuality(overallScore);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getBadgeVariant = (color: string) => {
    switch (color) {
      case 'green':
        return 'default';
      case 'blue':
        return 'secondary';
      case 'yellow':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4" />;
    if (score >= 60) return <Info className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  if (compact) {
    return (
      <Badge
        variant={getBadgeVariant(matchQuality.color)}
        className={`${
          matchQuality.color === 'green'
            ? 'bg-green-50 text-green-700 border-green-200'
            : matchQuality.color === 'blue'
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : matchQuality.color === 'yellow'
            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}
      >
        {overallScore}% Match
      </Badge>
    );
  }

  if (!detailed) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`${getScoreColor(overallScore)} font-bold text-2xl`}>
            {overallScore}%
          </div>
          <div className="text-sm text-gray-600">
            <div className="font-medium text-gray-900">{matchQuality.label}</div>
            <div className="text-xs">{matchQuality.description}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`${getScoreColor(overallScore)} font-bold text-4xl`}>
              {overallScore}%
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">{matchQuality.label}</div>
              <div className="text-sm text-gray-600">{matchQuality.description}</div>
            </div>
          </div>
        </div>
        <Badge
          className={`${
            matchQuality.color === 'green'
              ? 'bg-green-100 text-green-700'
              : matchQuality.color === 'blue'
              ? 'bg-blue-100 text-blue-700'
              : matchQuality.color === 'yellow'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          Compatible
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Overall Score Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Compatibility</span>
            <span className={`text-sm font-semibold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className={`h-3 ${getBgColor(overallScore)}`} />
        </div>

        {/* Detailed Scores */}
        {(routeScore !== undefined || timeScore !== undefined || preferencesScore !== undefined || ratingScore !== undefined) && (
          <div className="pt-4 border-t space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-3">Score Breakdown</div>

            {routeScore !== undefined && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Route Compatibility</span>
                    <span className="text-sm font-medium">{Math.round(routeScore)}%</span>
                  </div>
                  <Progress value={routeScore} className="h-2" />
                </div>
              </div>
            )}

            {timeScore !== undefined && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Schedule Match</span>
                    <span className="text-sm font-medium">{Math.round(timeScore)}%</span>
                  </div>
                  <Progress value={timeScore} className="h-2" />
                </div>
              </div>
            )}

            {preferencesScore !== undefined && (
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Preferences Alignment</span>
                    <span className="text-sm font-medium">{Math.round(preferencesScore)}%</span>
                  </div>
                  <Progress value={preferencesScore} className="h-2" />
                </div>
              </div>
            )}

            {ratingScore !== undefined && (
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Driver Rating</span>
                    <span className="text-sm font-medium">{Math.round(ratingScore)}%</span>
                  </div>
                  <Progress value={ratingScore} className="h-2" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommendation */}
        <div className={`p-4 rounded-lg border-2 ${
          overallScore >= 80
            ? 'bg-green-50 border-green-200'
            : overallScore >= 60
            ? 'bg-blue-50 border-blue-200'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-2">
            {getIcon(overallScore)}
            <div className="text-sm">
              {overallScore >= 80 ? (
                <p className="text-green-800">
                  <strong>Highly Recommended!</strong> This ride is an excellent match for your commute preferences and schedule.
                </p>
              ) : overallScore >= 60 ? (
                <p className="text-blue-800">
                  <strong>Good Option.</strong> This ride meets most of your criteria with minor differences in preferences.
                </p>
              ) : (
                <p className="text-yellow-800">
                  <strong>Consider Carefully.</strong> This ride has some compatibility concerns. Review the details before booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
