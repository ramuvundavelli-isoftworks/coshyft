import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  MapPin,
  Navigation,
  Home,
  Building2,
  Circle,
  Flag,
  User,
  Car,
  Clock,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { GPSCoordinate, TripWaypoint } from '../../utils/tripTracking';

interface LiveTripMapProps {
  currentLocation: GPSCoordinate;
  origin: GPSCoordinate & { address: string };
  destination: GPSCoordinate & { address: string };
  waypoints?: TripWaypoint[];
  route?: GPSCoordinate[];
  progress: number;
  showRoute?: boolean;
  onLocationUpdate?: (location: GPSCoordinate) => void;
}

export default function LiveTripMap({
  currentLocation,
  origin,
  destination,
  waypoints = [],
  route = [],
  progress,
  showRoute = true,
}: LiveTripMapProps) {
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite'>('standard');

  // Calculate visual position on map (simplified for demo)
  const getRelativePosition = (location: GPSCoordinate) => {
    const latRange = Math.abs(destination.lat - origin.lat);
    const lngRange = Math.abs(destination.lng - origin.lng);
    
    const latPercent = latRange > 0 
      ? ((location.lat - Math.min(origin.lat, destination.lat)) / latRange) * 100 
      : 50;
    const lngPercent = lngRange > 0
      ? ((location.lng - Math.min(origin.lng, destination.lng)) / lngRange) * 100
      : 50;
    
    return {
      top: `${Math.max(5, Math.min(95, 100 - latPercent))}%`,
      left: `${Math.max(5, Math.min(95, lngPercent))}%`,
    };
  };

  const vehiclePosition = getRelativePosition(currentLocation);
  const originPosition = getRelativePosition(origin);
  const destinationPosition = getRelativePosition(destination);

  return (
    <Card className="overflow-hidden">
      {/* Map Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Live Trip Tracking</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Circle className="h-3 w-3 mr-1 fill-green-600 animate-pulse" />
            Live
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapStyle(mapStyle === 'standard' ? 'satellite' : 'standard')}
          >
            {mapStyle === 'standard' ? '🛰️' : '🗺️'}
          </Button>
        </div>
      </div>

      {/* Map Visualization */}
      <div
        className={`relative h-96 ${
          mapStyle === 'satellite'
            ? 'bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}
      >
        {/* Grid overlay for more realistic map look */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Route Path */}
        {showRoute && route.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset={`${progress}%`} stopColor="#10b981" stopOpacity="0.6" />
                <stop offset={`${progress}%`} stopColor="#6b7280" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6b7280" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Draw simplified route line */}
            <line
              x1={originPosition.left}
              y1={originPosition.top}
              x2={destinationPosition.left}
              y2={destinationPosition.top}
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="8,4"
            />
          </svg>
        )}

        {/* Origin Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={originPosition}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium border">
                {origin.address}
              </div>
            </div>
          </div>
        </div>

        {/* Destination Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={destinationPosition}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium border">
                {destination.address}
              </div>
            </div>
          </div>
        </div>

        {/* Waypoint Markers */}
        {waypoints.map((waypoint, index) => {
          const waypointPos = getRelativePosition(waypoint.location);
          return (
            <div
              key={waypoint.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={waypointPos}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-xs font-semibold ${
                    waypoint.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : waypoint.status === 'arrived'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-purple-500 text-white'
                  }`}
                >
                  {waypoint.type === 'pickup' ? '📍' : '📍'}
                </div>
                {waypoint.passengerName && (
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white px-2 py-0.5 rounded shadow text-xs border">
                      {waypoint.passengerName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Current Vehicle Position */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000"
          style={vehiclePosition}
        >
          <div className="relative">
            {/* Pulsing ring effect */}
            <div className="absolute inset-0 w-16 h-16 -top-2 -left-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
            
            {/* Vehicle icon */}
            <div className="relative w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            
            {/* Speed indicator */}
            {currentLocation.speed && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg">
                  <Zap className="h-3 w-3 inline mr-1" />
                  {Math.round(currentLocation.speed)} km/h
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Trip Progress</span>
            <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Coordinates Display (for demo) */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow text-xs font-mono border">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>
              {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
            </span>
          </div>
          {currentLocation.heading !== undefined && (
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <Navigation className="h-3 w-3" />
              <span>Heading: {Math.round(currentLocation.heading)}°</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Legend */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Origin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Destination</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Car className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="text-gray-600">Your Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Waypoints</span>
          </div>
        </div>
      </div>

      {/* Production Note */}
      <div className="px-4 pb-4">
        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 text-center">
          🗺️ Production: Google Maps / Mapbox integration with real GPS tracking
        </div>
      </div>
    </Card>
  );
}
