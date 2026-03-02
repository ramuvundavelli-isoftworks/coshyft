import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  MapPin,
  Users,
  Car,
  Clock,
  Navigation,
  Star,
  MessageCircle,
  CheckCircle,
  Filter,
  Settings,
  X,
  Map,
  List,
  Shield,
  TrendingUp,
  Zap,
  Repeat,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExtendedRide, CommutePreferences, AdvancedFilters } from '../types';
import { mockExtendedRides, defaultUserPreferences, mockUserRoute } from '../data/mockCarpoolData';
import {
  calculateCompatibilityScore,
  calculateRouteScore,
  calculateTimeScore,
  calculatePreferencesScore,
  applyAdvancedFilters,
  geocodeAddress,
} from '../utils/carpoolMatching';
import AdvancedSearchModal from '../components/carpooling/AdvancedSearchModal';
import PreferenceProfileModal from '../components/carpooling/PreferenceProfileModal';
import CompatibilityScore from '../components/carpooling/CompatibilityScore';
import RouteMapVisualization from '../components/carpooling/RouteMapVisualization';
import { useApi, useApiMutation } from '../api';
import { carpoolingApi } from '../api';
import { messagingApi } from '../api';
import { authApi } from '../api';

export default function FindRide() {
  const [rides, setRides] = useState<ExtendedRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<ExtendedRide[]>([]);
  const [origin, setOrigin] = useState('Oakland');
  const [destination, setDestination] = useState('San Francisco HQ');
  const [date, setDate] = useState('2026-02-20');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [selectedRide, setSelectedRide] = useState<ExtendedRide | null>(null);
  
  // Modal states
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  // User preferences and filters
  const [userPreferences, setUserPreferences] = useState<CommutePreferences>(defaultUserPreferences);
  const [activeFilters, setActiveFilters] = useState<AdvancedFilters>({});
  const [sortBy, setSortBy] = useState<'match' | 'time' | 'distance' | 'co2'>('match');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Booking data
  const [bookingData, setBookingData] = useState({
    seats: '1',
    pickupLocation: '',
    notes: '',
  });
  
  const [offerData, setOfferData] = useState({
    origin: '',
    destination: 'San Francisco HQ',
    departureTime: '',
    seatsAvailable: '3',
    vehicleType: '',
    vehicleMake: '',
    preferences: '',
  });
  
  const [message, setMessage] = useState('');

  // API mutations
  const requestRideMutation = useApiMutation((data: { rideId: string; payload: any }) =>
    carpoolingApi.requestRide(data.rideId, data.payload)
  );
  const offerRideMutation = useApiMutation((data: any) => carpoolingApi.offerRide(data));
  const sendMessageMutation = useApiMutation((data: { threadId: string; content: string }) =>
    messagingApi.sendMessage(data.threadId, { content: data.content })
  );
  const savePreferencesMutation = useApiMutation((data: any) => authApi.updateProfile(data));

  // Initialize rides with calculated compatibility scores
  useEffect(() => {
    const ridesWithScores = mockExtendedRides.map((ride) => {
      const userRoute = {
        origin: geocodeAddress(origin),
        destination: geocodeAddress(destination),
        departureTime: departureTime,
        distance: 0,
      };

      const rideRoute = {
        origin: ride.originLocation,
        destination: ride.destinationLocation,
        departureTime: ride.departureTime,
        distance: ride.distance,
      };

      const compatibilityScore = calculateCompatibilityScore(
        userRoute,
        rideRoute,
        userPreferences,
        ride.preferences || defaultUserPreferences,
        ride.driverRating
      );

      return {
        ...ride,
        matchScore: compatibilityScore,
      };
    });

    setRides(ridesWithScores);
  }, [origin, destination, departureTime, userPreferences]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...rides];

    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      filtered = applyAdvancedFilters(filtered, activeFilters);
    }

    // Sort rides
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'time':
          return a.departureTime.localeCompare(b.departureTime);
        case 'distance':
          return a.distance - b.distance;
        case 'co2':
          return b.co2Saved - a.co2Saved;
        default:
          return 0;
      }
    });

    setFilteredRides(filtered);
  }, [rides, activeFilters, sortBy]);

  const handleApplyFilters = (filters: AdvancedFilters, preferences: Partial<CommutePreferences>) => {
    setActiveFilters(filters);
    if (Object.keys(preferences).length > 0) {
      setUserPreferences({ ...userPreferences, ...preferences });
    }
  };

  const handleSavePreferences = async (preferences: CommutePreferences) => {
    setUserPreferences(preferences);

    const result = await savePreferencesMutation.execute({
      commute_preferences: {
        maxDetourMinutes: preferences.maxDetourMinutes,
        preferredDepartureTime: preferences.preferredDepartureTime,
        musicPreference: preferences.musicPreference,
        smokingAllowed: preferences.smokingAllowed,
        petsAllowed: preferences.petsAllowed,
        conversationLevel: preferences.conversationLevel,
        genderPreference: preferences.genderPreference,
      },
    });

    if (result.success) {
      toast.success('Your commute preferences have been saved!');
    } else {
      toast.error(result.error?.message || 'Failed to save preferences');
    }
  };

  const handleViewDetails = (ride: ExtendedRide) => {
    setSelectedRide(ride);
    setIsDetailsDialogOpen(true);
  };

  const handleBookRide = async () => {
    if (selectedRide) {
      setIsBookDialogOpen(false);
      setIsConfirmationDialogOpen(true);

      const result = await requestRideMutation.execute({
        rideId: selectedRide.id,
        payload: {
          seats_requested: parseInt(bookingData.seats),
          pickup_location: bookingData.pickupLocation,
          notes: bookingData.notes,
        },
      });

      if (result.success) {
        toast.success(`Ride booked with ${selectedRide.driver}!`);
      } else {
        toast.error(result.error?.message || 'Failed to book ride');
      }
    }
  };

  const handleOfferRide = async () => {
    const newRide: ExtendedRide = {
      id: `r-${Date.now()}`,
      driver: 'You',
      driverId: 'current-user',
      origin: offerData.origin,
      originLocation: geocodeAddress(offerData.origin),
      destination: offerData.destination,
      destinationLocation: geocodeAddress(offerData.destination),
      departureTime: offerData.departureTime,
      distance: 10,
      seatsAvailable: parseInt(offerData.seatsAvailable),
      co2Saved: 2.5,
      matchScore: 100,
      vehicleType: offerData.vehicleType.toLowerCase() as any,
      vehicleMake: offerData.vehicleMake,
      preferences: userPreferences,
      preferencesTags: offerData.preferences.split(',').map((p) => p.trim()),
      recurring: false,
      verifiedDriver: true,
      trustScore: 100,
    };
    setRides([newRide, ...rides]);
    setIsOfferDialogOpen(false);
    resetOfferForm();

    const result = await offerRideMutation.execute({
      origin_address: offerData.origin,
      destination_address: offerData.destination,
      departure_time: offerData.departureTime,
      seats_available: parseInt(offerData.seatsAvailable),
      vehicle_type: offerData.vehicleType,
      vehicle_make: offerData.vehicleMake,
      preferences: offerData.preferences,
    });

    if (result.success) {
      toast.success('Your ride has been posted!');
    } else {
      toast.error(result.error?.message || 'Failed to post ride');
    }
  };

  const handleSendMessage = async () => {
    if (selectedRide && message.trim()) {
      const result = await sendMessageMutation.execute({
        threadId: selectedRide.id, // In real app, would be the thread ID
        content: message,
      });

      if (result.success) {
        toast.success(`Message sent to ${selectedRide.driver}`);
      } else {
        toast.error(result.error?.message || 'Failed to send message');
      }
      setIsMessageDialogOpen(false);
      setMessage('');
    }
  };

  const resetOfferForm = () => {
    setOfferData({
      origin: '',
      destination: 'San Francisco HQ',
      departureTime: '',
      seatsAvailable: '3',
      vehicleType: '',
      vehicleMake: '',
      preferences: '',
    });
  };

  const clearFilter = (filterKey: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterKey as keyof AdvancedFilters];
    setActiveFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).filter(
      (key) => activeFilters[key as keyof AdvancedFilters] !== undefined
    ).length;
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'electric':
        return '⚡';
      case 'hybrid':
        return '🔋';
      case 'suv':
        return '🚙';
      default:
        return '🚗';
    }
  };

  // Calculate detailed scores for selected ride
  const getDetailedScores = (ride: ExtendedRide) => {
    const userRoute = {
      origin: geocodeAddress(origin),
      destination: geocodeAddress(destination),
      departureTime: departureTime,
      distance: 0,
    };

    const rideRoute = {
      origin: ride.originLocation,
      destination: ride.destinationLocation,
      departureTime: ride.departureTime,
      distance: ride.distance,
    };

    return {
      routeScore: calculateRouteScore(userRoute, rideRoute, userPreferences.flexibleRadius),
      timeScore: calculateTimeScore(
        userRoute.departureTime,
        rideRoute.departureTime,
        userPreferences.flexibleTiming ? 30 : 15
      ),
      preferencesScore: calculatePreferencesScore(
        userPreferences,
        ride.preferences || defaultUserPreferences
      ),
      ratingScore: ride.driverRating ? (ride.driverRating / 5) * 100 : 80,
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find a Ride</h1>
          <p className="text-gray-600 mt-1">
            Join a carpool and reduce your commute emissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreferencesOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            My Preferences
          </Button>
          <Button onClick={() => setIsOfferDialogOpen(true)}>
            <Car className="h-4 w-4 mr-2" />
            Offer a Ride
          </Button>
        </div>
      </div>

      {/* Search Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search for Available Rides</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter your location"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Time</label>
            <Input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={() => setIsAdvancedSearchOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-2 bg-blue-600">{getActiveFilterCount()}</Badge>
            )}
          </Button>

          {/* Active filter chips */}
          {activeFilters.maxDistance && (
            <Badge variant="secondary" className="gap-1">
              Max {activeFilters.maxDistance} km
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter('maxDistance')}
              />
            </Badge>
          )}
          {activeFilters.minRating && (
            <Badge variant="secondary" className="gap-1">
              {activeFilters.minRating}+ stars
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('minRating')} />
            </Badge>
          )}
          {activeFilters.vehicleTypes && activeFilters.vehicleTypes.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {activeFilters.vehicleTypes.length} vehicle type(s)
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter('vehicleTypes')}
              />
            </Badge>
          )}
        </div>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Rides ({filteredRides.length})
          </h2>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Best Match
              </div>
            </SelectItem>
            <SelectItem value="time">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Earliest Time
              </div>
            </SelectItem>
            <SelectItem value="distance">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shortest Distance
              </div>
            </SelectItem>
            <SelectItem value="co2">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Most CO₂ Saved
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Available Rides */}
      <div className="space-y-4">
        {filteredRides.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Car className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No rides found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
              <Button variant="outline" onClick={() => setActiveFilters({})}>
                Clear All Filters
              </Button>
            </div>
          </Card>
        ) : (
          filteredRides.map((ride) => {
            const detailedScores = getDetailedScores(ride);
            
            return (
              <Card key={ride.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-lg font-semibold">
                        {ride.driver.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      {/* Driver Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{ride.driver}</h3>
                        {ride.verifiedDriver && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {ride.recurring && (
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Repeat className="h-3 w-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                        {ride.driverRating && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{ride.driverRating}</span>
                            <span className="text-xs text-gray-500">({ride.totalTrips} trips)</span>
                          </div>
                        )}
                      </div>

                      {/* Compatibility Score */}
                      <div className="mb-4">
                        <CompatibilityScore overallScore={ride.matchScore} compact={false} />
                      </div>

                      {/* Route Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{ride.origin}</p>
                            <p className="text-xs text-gray-600">→ {ride.destination}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{ride.departureTime}</p>
                            <p className="text-xs text-gray-600">{ride.distance.toFixed(1)} km</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{ride.seatsAvailable} seats</p>
                            <p className="text-xs text-gray-600">available</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Navigation className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-700">{ride.co2Saved.toFixed(1)} kg CO₂</p>
                            <p className="text-xs text-gray-600">saved</p>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle & Preferences */}
                      <div className="flex flex-wrap items-center gap-2">
                        {ride.vehicleMake && (
                          <Badge variant="outline" className="bg-gray-50">
                            <span className="mr-1">{getVehicleIcon(ride.vehicleType || '')}</span>
                            {ride.vehicleMake}
                          </Badge>
                        )}
                        {ride.vehicleType === 'electric' && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Zero Emissions
                          </Badge>
                        )}
                        {ride.preferencesTags?.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                            {tag}
                          </Badge>
                        ))}
                        {ride.preferencesTags && ride.preferencesTags.length > 3 && (
                          <Badge variant="outline">+{ride.preferencesTags.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => handleViewDetails(ride)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedRide(ride);
                        setIsMessageDialogOpen(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={activeFilters}
        currentPreferences={userPreferences}
      />

      {/* Preferences Modal */}
      <PreferenceProfileModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSave={handleSavePreferences}
        currentPreferences={userPreferences}
        isDriverMode={false}
      />

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
            <DialogDescription>
              Comprehensive compatibility analysis and ride information
            </DialogDescription>
          </DialogHeader>
          {selectedRide && (
            <div className="space-y-6 py-4">
              {/* Driver Profile */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl font-semibold">
                    {selectedRide.driver.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{selectedRide.driver}</h3>
                    {selectedRide.verifiedDriver && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified Driver
                      </Badge>
                    )}
                  </div>
                  {selectedRide.driverRating && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-medium text-lg">{selectedRide.driverRating}</span>
                      </div>
                      <span className="text-gray-600">
                        {selectedRide.totalTrips} completed trips
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">
                        Trust Score: {selectedRide.trustScore}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Compatibility Score */}
              <CompatibilityScore
                overallScore={selectedRide.matchScore}
                {...getDetailedScores(selectedRide)}
                detailed={true}
              />

              {/* Route Map Visualization */}
              <RouteMapVisualization
                origin={selectedRide.originLocation}
                destination={selectedRide.destinationLocation}
                userOrigin={geocodeAddress(origin)}
                userDestination={geocodeAddress(destination)}
                distance={selectedRide.distance}
                showCompatibility={true}
                compatibilityScore={selectedRide.matchScore}
              />

              {/* Trip Details */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Departure Time</Label>
                  <p className="font-medium text-gray-900 mt-1 text-lg">
                    {selectedRide.departureTime}
                  </p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Seats Available</Label>
                  <p className="font-medium text-gray-900 mt-1 text-lg">
                    {selectedRide.seatsAvailable}
                  </p>
                </Card>
              </div>

              {/* Vehicle Info */}
              {selectedRide.vehicleMake && (
                <Card className="p-4">
                  <Label className="text-sm text-gray-600 mb-2 block">Vehicle</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getVehicleIcon(selectedRide.vehicleType || '')}</span>
                    <p className="font-medium text-gray-900 text-lg">{selectedRide.vehicleMake}</p>
                    {selectedRide.vehicleType === 'electric' && (
                      <Badge className="bg-green-600">
                        <Zap className="h-3 w-3 mr-1" />
                        Zero Emissions
                      </Badge>
                    )}
                  </div>
                </Card>
              )}

              {/* Ride Preferences */}
              {selectedRide.preferencesTags && selectedRide.preferencesTags.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600 mb-3 block">
                    Ride Preferences & Atmosphere
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRide.preferencesTags.map((pref, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Recurring Schedule */}
              {selectedRide.recurring && selectedRide.daysOfWeek && (
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="h-5 w-5 text-purple-600" />
                    <Label className="text-sm font-medium text-purple-900">
                      Recurring Schedule
                    </Label>
                  </div>
                  <p className="text-sm text-purple-700">
                    This ride repeats every{' '}
                    {selectedRide.daysOfWeek
                      .map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
                      .join(', ')}
                  </p>
                </Card>
              )}

              {/* Environmental Impact */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Environmental Impact</span>
                </div>
                <p className="text-sm text-green-700">
                  By joining this ride, you'll save{' '}
                  <strong>{selectedRide.co2Saved.toFixed(1)} kg CO₂</strong> compared to driving
                  alone. That's equivalent to planting{' '}
                  <strong>{Math.round(selectedRide.co2Saved * 0.5)}</strong> trees!
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsDetailsDialogOpen(false);
                setIsBookDialogOpen(true);
              }}
            >
              Book This Ride
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book Ride Dialog */}
      <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Ride</DialogTitle>
            <DialogDescription>
              Confirm your booking with {selectedRide?.driver}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-900">
                  <strong>{selectedRide?.driver}</strong> • {selectedRide?.departureTime}
                </span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {selectedRide?.co2Saved.toFixed(1)} kg CO₂ saved
                </Badge>
              </div>
            </div>

            <div>
              <Label htmlFor="seats">Number of Seats *</Label>
              <Select
                value={bookingData.seats}
                onValueChange={(value) => setBookingData({ ...bookingData, seats: value })}
              >
                <SelectTrigger id="seats">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: selectedRide?.seatsAvailable || 1 },
                    (_, i) => i + 1
                  ).map((n) => (
                    <SelectItem key={n} value={n.toString()}>
                      {n} seat{n > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pickup">Pickup Location *</Label>
              <Input
                id="pickup"
                value={bookingData.pickupLocation}
                onChange={(e) =>
                  setBookingData({ ...bookingData, pickupLocation: e.target.value })
                }
                placeholder="Enter your pickup address"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes for Driver (optional)</Label>
              <Textarea
                id="notes"
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                placeholder="Any special requests or information..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBookRide}
              disabled={!bookingData.pickupLocation.trim() || requestRideMutation.loading}
            >
              {requestRideMutation.loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offer Ride Dialog */}
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer a Ride</DialogTitle>
            <DialogDescription>
              Share your commute and help others reduce emissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="offer-origin">From *</Label>
                <Input
                  id="offer-origin"
                  value={offerData.origin}
                  onChange={(e) => setOfferData({ ...offerData, origin: e.target.value })}
                  placeholder="Enter starting location"
                />
              </div>
              <div>
                <Label htmlFor="offer-destination">To *</Label>
                <Input
                  id="offer-destination"
                  value={offerData.destination}
                  onChange={(e) => setOfferData({ ...offerData, destination: e.target.value })}
                  placeholder="Enter destination"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure-time">Departure Time *</Label>
                <Input
                  id="departure-time"
                  type="time"
                  value={offerData.departureTime}
                  onChange={(e) =>
                    setOfferData({ ...offerData, departureTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="seats">Seats Available *</Label>
                <Select
                  value={offerData.seatsAvailable}
                  onValueChange={(value) => setOfferData({ ...offerData, seatsAvailable: value })}
                >
                  <SelectTrigger id="seats">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 seat</SelectItem>
                    <SelectItem value="2">2 seats</SelectItem>
                    <SelectItem value="3">3 seats</SelectItem>
                    <SelectItem value="4">4 seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle-type">Vehicle Type *</Label>
                <Select
                  value={offerData.vehicleType}
                  onValueChange={(value) => setOfferData({ ...offerData, vehicleType: value })}
                >
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electric">⚡ Electric</SelectItem>
                    <SelectItem value="Hybrid">🔋 Hybrid</SelectItem>
                    <SelectItem value="Sedan">🚗 Sedan</SelectItem>
                    <SelectItem value="SUV">🚙 SUV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vehicle-make">Vehicle Make & Model *</Label>
                <Input
                  id="vehicle-make"
                  value={offerData.vehicleMake}
                  onChange={(e) => setOfferData({ ...offerData, vehicleMake: e.target.value })}
                  placeholder="e.g., Tesla Model 3"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="preferences">Ride Preferences (optional)</Label>
              <Input
                id="preferences"
                value={offerData.preferences}
                onChange={(e) => setOfferData({ ...offerData, preferences: e.target.value })}
                placeholder="e.g., No smoking, Music OK, Quiet ride"
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate multiple preferences with commas
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">
                  Your default commute preferences will be applied
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOfferDialogOpen(false);
                  setIsPreferencesOpen(true);
                }}
              >
                Edit Preferences
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleOfferRide}
              disabled={
                !offerData.origin ||
                !offerData.destination ||
                !offerData.departureTime ||
                !offerData.vehicleType ||
                !offerData.vehicleMake ||
                offerRideMutation.loading
              }
            >
              {offerRideMutation.loading ? 'Posting...' : 'Post Ride'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Driver Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message {selectedRide?.driver}</DialogTitle>
            <DialogDescription>Send a message before booking</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about the ride, pickup location, or any preferences..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!message.trim() || sendMessageMutation.loading}>
              {sendMessageMutation.loading ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your ride with {selectedRide?.driver} has been confirmed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Driver:</span>
                <span className="font-medium">{selectedRide?.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Departure:</span>
                <span className="font-medium">{selectedRide?.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup:</span>
                <span className="font-medium">{bookingData.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-medium">{bookingData.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Match Score:</span>
                <span className="font-medium text-green-600">{selectedRide?.matchScore}%</span>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-sm text-green-700">
                🌱 You'll save <strong>{selectedRide?.co2Saved.toFixed(1)} kg CO₂</strong> on this
                trip!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsConfirmationDialogOpen(false)} className="w-full">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}