import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  MapPin,
  Navigation,
  Circle,
  ArrowRight,
  Flag,
  Home,
  Building2,
} from 'lucide-react';
import { Location } from '../../types';

interface RouteMapVisualizationProps {
  origin: Location;
  destination: Location;
  userOrigin?: Location;
  userDestination?: Location;
  distance: number;
  showCompatibility?: boolean;
  compatibilityScore?: number;
}

export default function RouteMapVisualization({
  origin,
  destination,
  userOrigin,
  userDestination,
  distance,
  showCompatibility = false,
  compatibilityScore,
}: RouteMapVisualizationProps) {
  // Mock map visualization - in production, this would use Google Maps or Mapbox
  // For now, we'll create a styled visual representation

  const getRouteColor = () => {
    if (!compatibilityScore) return 'blue';
    if (compatibilityScore >= 80) return 'green';
    if (compatibilityScore >= 60) return 'yellow';
    return 'red';
  };

  const routeColor = getRouteColor();

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Route Overview</h3>
        </div>
        <Badge variant="outline" className="bg-white">
          {distance.toFixed(1)} km
        </Badge>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-white rounded-lg border-2 border-gray-200 p-8 mb-4">
        {/* Simplified route visualization */}
        <div className="flex items-center justify-between">
          {/* Origin */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              routeColor === 'green'
                ? 'bg-green-100 border-4 border-green-500'
                : routeColor === 'yellow'
                ? 'bg-yellow-100 border-4 border-yellow-500'
                : 'bg-blue-100 border-4 border-blue-500'
            }`}>
              <Home className={`h-8 w-8 ${
                routeColor === 'green'
                  ? 'text-green-600'
                  : routeColor === 'yellow'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">Origin</p>
              <p className="text-xs text-gray-600">{origin.address}</p>
            </div>
          </div>

          {/* Route Line */}
          <div className="flex-1 mx-4">
            <div className="relative h-2 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 rounded-full">
              {/* Animated pulse effect */}
              <div className={`absolute inset-0 rounded-full ${
                routeColor === 'green'
                  ? 'bg-green-500'
                  : routeColor === 'yellow'
                  ? 'bg-yellow-500'
                  : 'bg-blue-500'
              } opacity-75`}></div>
              
              {/* Distance marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-white px-2 py-1 rounded-full border-2 border-blue-500 shadow-sm">
                  <p className="text-xs font-semibold text-blue-600">{distance.toFixed(1)} km</p>
                </div>
              </div>
            </div>

            {/* Direction indicator */}
            <div className="flex items-center justify-center mt-2">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Destination */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              routeColor === 'green'
                ? 'bg-green-100 border-4 border-green-500'
                : routeColor === 'yellow'
                ? 'bg-yellow-100 border-4 border-yellow-500'
                : 'bg-blue-100 border-4 border-blue-500'
            }`}>
              <Building2 className={`h-8 w-8 ${
                routeColor === 'green'
                  ? 'text-green-600'
                  : routeColor === 'yellow'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">Destination</p>
              <p className="text-xs text-gray-600">{destination.address}</p>
            </div>
          </div>
        </div>

        {/* User's route overlay (if provided) */}
        {userOrigin && userDestination && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Circle className="h-4 w-4 text-purple-600" />
              <p className="text-xs font-medium text-gray-700">Your Route Comparison</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-900 font-medium mb-1">Your Origin</p>
                <p className="text-purple-700">{userOrigin.address}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-900 font-medium mb-1">Your Destination</p>
                <p className="text-purple-700">{userDestination.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600">Distance</p>
          <p className="text-sm font-semibold text-gray-900">{distance.toFixed(1)} km</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Navigation className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600">Est. Time</p>
          <p className="text-sm font-semibold text-gray-900">{Math.round(distance * 2)} min</p>
        </div>
        <div className="text-center p-3 bg-white rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flag className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600">CO₂ Saved</p>
          <p className="text-sm font-semibold text-green-700">
            {(distance * 0.15).toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Compatibility Note */}
      {showCompatibility && compatibilityScore !== undefined && (
        <div className={`mt-4 p-3 rounded-lg ${
          compatibilityScore >= 80
            ? 'bg-green-50 border border-green-200'
            : compatibilityScore >= 60
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-xs font-medium ${
            compatibilityScore >= 80
              ? 'text-green-800'
              : compatibilityScore >= 60
              ? 'text-yellow-800'
              : 'text-red-800'
          }`}>
            {compatibilityScore >= 80
              ? '✓ Route is highly compatible with your commute'
              : compatibilityScore >= 60
              ? '⚠ Route has some deviation from your preferred path'
              : '✗ Route differs significantly from your usual commute'}
          </p>
        </div>
      )}

      {/* Mock Map Notice */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          🗺️ Interactive map with live route visualization (Production: Google Maps integration)
        </p>
      </div>
    </Card>
  );
}
