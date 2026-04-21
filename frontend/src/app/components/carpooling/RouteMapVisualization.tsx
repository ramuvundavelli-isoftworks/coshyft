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
    <Card className="p-6 bg-gradient-to-br from-info-subtle to-info-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-info" />
          <h3 className="font-semibold text-foreground">Route Overview</h3>
        </div>
        <Badge variant="outline" className="bg-card">
          {distance.toFixed(1)} km
        </Badge>
      </div>

      {/* Map Placeholder */}
      <div className="relative bg-card rounded-lg border-2 border-border p-8 mb-4">
        {/* Simplified route visualization */}
        <div className="flex items-center justify-between">
          {/* Origin */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              routeColor === 'green'
                ? 'bg-success-subtle border-4 border-success'
                : routeColor === 'yellow'
                ? 'bg-warning-subtle border-4 border-warning'
                : 'bg-info-subtle border-4 border-info'
            }`}>
              <Home className={`h-8 w-8 ${
                routeColor === 'green'
                  ? 'text-success'
                  : routeColor === 'yellow'
                  ? 'text-warning'
                  : 'text-info'
              }`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">Origin</p>
              <p className="text-xs text-muted-foreground">{origin.address}</p>
            </div>
          </div>

          {/* Route Line */}
          <div className="flex-1 mx-4">
            <div className="relative h-2 bg-gradient-to-r from-info/30 via-info to-info rounded-full">
              {/* Animated pulse effect */}
              <div className={`absolute inset-0 rounded-full ${
                routeColor === 'green'
                  ? 'bg-success'
                  : routeColor === 'yellow'
                  ? 'bg-warning'
                  : 'bg-info'
              } opacity-75`}></div>
              
              {/* Distance marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-card px-2 py-1 rounded-full border-2 border-info shadow-sm">
                  <p className="text-xs font-semibold text-info">{distance.toFixed(1)} km</p>
                </div>
              </div>
            </div>

            {/* Direction indicator */}
            <div className="flex items-center justify-center mt-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Destination */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              routeColor === 'green'
                ? 'bg-success-subtle border-4 border-success'
                : routeColor === 'yellow'
                ? 'bg-warning-subtle border-4 border-warning'
                : 'bg-info-subtle border-4 border-info'
            }`}>
              <Building2 className={`h-8 w-8 ${
                routeColor === 'green'
                  ? 'text-success'
                  : routeColor === 'yellow'
                  ? 'text-warning'
                  : 'text-info'
              }`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">Destination</p>
              <p className="text-xs text-muted-foreground">{destination.address}</p>
            </div>
          </div>
        </div>

        {/* User's route overlay (if provided) */}
        {userOrigin && userDestination && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Circle className="h-4 w-4 text-info" />
              <p className="text-xs font-medium text-foreground">Your Route Comparison</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-info-subtle rounded-lg">
                <p className="text-foreground font-medium mb-1">Your Origin</p>
                <p className="text-info">{userOrigin.address}</p>
              </div>
              <div className="p-3 bg-info-subtle rounded-lg">
                <p className="text-foreground font-medium mb-1">Your Destination</p>
                <p className="text-info">{userDestination.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-card rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Distance</p>
          <p className="text-sm font-semibold text-foreground">{distance.toFixed(1)} km</p>
        </div>
        <div className="text-center p-3 bg-card rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Est. Time</p>
          <p className="text-sm font-semibold text-foreground">{Math.round(distance * 2)} min</p>
        </div>
        <div className="text-center p-3 bg-card rounded-lg border">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flag className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">CO₂ Saved</p>
          <p className="text-sm font-semibold text-success">
            {(distance * 0.15).toFixed(1)} kg
          </p>
        </div>
      </div>

      {/* Compatibility Note */}
      {showCompatibility && compatibilityScore !== undefined && (
        <div className={`mt-4 p-3 rounded-lg ${
          compatibilityScore >= 80
            ? 'bg-success-subtle border border-success/25'
            : compatibilityScore >= 60
            ? 'bg-warning-subtle border border-warning/25'
            : 'bg-destructive-subtle border border-destructive/25'
        }`}>
          <p className={`text-xs font-medium ${
            compatibilityScore >= 80
              ? 'text-success'
              : compatibilityScore >= 60
              ? 'text-warning'
              : 'text-destructive'
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
      <div className="mt-4 p-3 bg-background-subtle border border-border rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          🗺️ Interactive map with live route visualization (Production: Google Maps integration)
        </p>
      </div>
    </Card>
  );
}
