import { useState, useEffect } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
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
  Shield,
  TrendingUp,
  Zap,
  Repeat,
  BarChart3,
  Loader2,
  LocateFixed,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { ExtendedRide, CommutePreferences, AdvancedFilters } from '../types';
import {
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
import { useApiMutation } from '../api';
import { carpoolingApi } from '../api';
import { messagingApi } from '../api';
import { authApi } from '../api';

export default function FindRide() {
  const [rides, setRides] = useState<ExtendedRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<ExtendedRide[]>([]);
  const [origin, setOrigin] = useState('Griffith Avenue');
  const [destination, setDestination] = useState('Acme Dublin HQ');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('08:15');
  const [selectedRide, setSelectedRide] = useState<ExtendedRide | null>(null);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const [userPreferences, setUserPreferences] = useState<CommutePreferences>({} as CommutePreferences);
  const [activeFilters, setActiveFilters] = useState<AdvancedFilters>({});
  const [sortBy, setSortBy] = useState<'match' | 'time' | 'distance' | 'co2'>('match');

  const [bookingData, setBookingData] = useState({ seats: '1', pickupLocation: '', notes: '' });
  const [offerData, setOfferData] = useState({
    origin: '',
    destination: 'Acme Dublin HQ',
    departureTime: '',
    seatsAvailable: '3',
    vehicleType: '',
    vehicleMake: '',
    preferences: '',
  });
  const [message, setMessage] = useState('');

  const requestRideMutation = useApiMutation((data: { rideId: string; payload: any }) =>
    carpoolingApi.requestRide(data.rideId, data.payload)
  );
  const offerRideMutation = useApiMutation((data: any) => carpoolingApi.offerRide(data));
  const sendMessageMutation = useApiMutation((data: { threadId: string; content: string }) =>
    messagingApi.sendMessage(data.threadId, { content: data.content })
  );
  const savePreferencesMutation = useApiMutation((data: any) => authApi.updateProfile(data));

  const [isSearching, setIsSearching] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapApiRide = (item: any): ExtendedRide => {
    const ride = item.ride ?? item;
    const originCoords = { lat: ride.origin_lat ?? 53.3498, lng: ride.origin_lng ?? -6.2603 };
    const destCoords = { lat: ride.destination_lat ?? 53.3340, lng: ride.destination_lng ?? -6.2535 };
    const depTime = ride.departure_time
      ? (typeof ride.departure_time === 'string'
          ? ride.departure_time.substring(11, 16)
          : String(ride.departure_time))
      : '08:00';
    return {
      id: ride.id,
      driver: ride.driver_name ?? 'Driver',
      driverId: ride.driver_id ?? '',
      origin: ride.origin ?? '',
      originLocation: { ...originCoords, address: ride.origin ?? '' },
      destination: ride.destination ?? '',
      destinationLocation: { ...destCoords, address: ride.destination ?? '' },
      departureTime: depTime,
      distance: ride.distance_km ?? ride.distance ?? 0,
      seatsAvailable: ride.seats_available ?? ride.seatsAvailable ?? 1,
      co2Saved: ride.co2_saved ?? ride.co2Saved ?? 0,
      matchScore: Math.round((item.match_score ?? item.matchScore ?? 70) * 100),
      vehicleType: (ride.vehicle_type ?? '').toLowerCase() || undefined,
      vehicleMake: ride.vehicle_make ?? ride.vehicleMake ?? undefined,
      verifiedDriver: true,
      trustScore: 85,
      recurring: ride.is_recurring ?? false,
    };
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setOrigin(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setIsLocating(false);
        toast.success('Location detected! Click Search to find nearby rides.');
      },
      () => {
        setIsLocating(false);
        toast.error('Could not get your location. Please enter your address manually.');
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  };

  const handleSearch = async () => {
    setIsSearching(true);
    const originCoords = userCoords ?? geocodeAddress(origin);
    const destCoords = geocodeAddress(destination);
    try {
      const result = await carpoolingApi.findRides({
        origin_lat: originCoords.lat,
        origin_lng: originCoords.lng,
        destination_lat: destCoords.lat,
        destination_lng: destCoords.lng,
        departure_time: departureTime,
      });
      if (result.success && result.data) {
        const list: any[] = Array.isArray(result.data) ? result.data : [];
        setRides(list.map(mapApiRide));
      } else {
        setRides([]);
      }
    } catch {
      setRides([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = [...rides];
    if (Object.keys(activeFilters).length > 0) {
      filtered = applyAdvancedFilters(filtered, activeFilters);
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match': return b.matchScore - a.matchScore;
        case 'time': return a.departureTime.localeCompare(b.departureTime);
        case 'distance': return a.distance - b.distance;
        case 'co2': return b.co2Saved - a.co2Saved;
        default: return 0;
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
      const result = await requestRideMutation.execute({
        rideId: selectedRide.id,
        payload: {
          pickup_address: bookingData.pickupLocation,
          message: bookingData.notes || undefined,
        },
      });
      if (result.success) {
        setIsBookDialogOpen(false);
        setIsConfirmationDialogOpen(true);
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
        threadId: selectedRide.id,
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
      destination: 'Acme Dublin HQ',
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

  const getActiveFilterCount = () =>
    Object.keys(activeFilters).filter(
      (key) => activeFilters[key as keyof AdvancedFilters] !== undefined
    ).length;

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'electric': return '⚡';
      case 'hybrid': return '🔋';
      case 'suv': return '🚙';
      default: return '🚗';
    }
  };

  const getMatchStyle = (score: number) => {
    if (score >= 80) return 'bg-success/15 text-success';
    if (score >= 60) return 'bg-info/15 text-info';
    return 'bg-muted text-muted-foreground';
  };

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
        ride.preferences ?? {} as CommutePreferences
      ),
      ratingScore: ride.driverRating ? (ride.driverRating / 5) * 100 : 80,
    };
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Find a Ride</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Join a carpool and reduce your commute emissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPreferencesOpen(true)}>
            <Settings className="h-4 w-4 mr-1.5" />
            Preferences
          </Button>
          <Button size="sm" onClick={() => setIsOfferDialogOpen(true)}>
            <Car className="h-4 w-4 mr-1.5" />
            Offer a Ride
          </Button>
        </div>
      </div>

      {/* Search Card */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">From</label>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Your location"
                  value={origin}
                  onChange={(e) => { setOrigin(e.target.value); setUserCoords(null); }}
                  className="pl-8 h-8 text-sm"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleUseLocation}
                disabled={isLocating}
                title="Use my GPS location"
              >
                {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {userCoords && <p className="text-xs text-success mt-1">GPS detected</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">To</label>
            <div className="relative">
              <Navigation className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 text-sm" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Time</label>
            <Input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="h-8 text-sm"
            />
          </div>

          <div className="flex items-end">
            <Button className="w-full h-8 text-sm" onClick={handleSearch} disabled={isSearching}>
              {isSearching ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Search className="h-3.5 w-3.5 mr-1.5" />}
              Search
            </Button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t flex-wrap">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsAdvancedSearchOpen(true)}>
            <Filter className="h-3 w-3 mr-1.5" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center bg-info text-white text-[10px]">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
          {activeFilters.maxDistance && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              Max {activeFilters.maxDistance} km
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('maxDistance')} />
            </Badge>
          )}
          {activeFilters.minRating && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              {activeFilters.minRating}+ stars
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('minRating')} />
            </Badge>
          )}
          {activeFilters.vehicleTypes && activeFilters.vehicleTypes.length > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              {activeFilters.vehicleTypes.length} vehicle type(s)
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter('vehicleTypes')} />
            </Badge>
          )}
        </div>
      </Card>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {filteredRides.length} available ride{filteredRides.length !== 1 ? 's' : ''}
        </p>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-3.5 w-3.5" />Best Match
              </div>
            </SelectItem>
            <SelectItem value="time">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5" />Earliest Time
              </div>
            </SelectItem>
            <SelectItem value="distance">
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5" />Shortest Distance
              </div>
            </SelectItem>
            <SelectItem value="co2">
              <div className="flex items-center gap-2 text-xs">
                <Navigation className="h-3.5 w-3.5" />Most CO₂ Saved
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ride list */}
      <div className="space-y-2">
        {filteredRides.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                <Car className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">No rides found</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your filters or search criteria</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveFilters({})}>
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          filteredRides.map((ride) => (
            <Card key={ride.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {ride.driver.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: driver + badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold">{ride.driver}</span>
                    {ride.verifiedDriver && (
                      <Shield className="h-3.5 w-3.5 text-info flex-shrink-0" />
                    )}
                    {ride.recurring && (
                      <Repeat className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    )}
                    {ride.driverRating && (
                      <span className="flex items-center gap-0.5 text-xs text-warning">
                        <Star className="h-3 w-3 fill-current" />
                        {ride.driverRating}
                      </span>
                    )}
                  </div>

                  {/* Row 2: route + stats */}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="font-medium text-foreground">{ride.origin}</span>
                      <span className="mx-0.5">→</span>
                      <span className="font-medium text-foreground">{ride.destination}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {ride.departureTime}
                    </span>
                    <span>{ride.distance.toFixed(1)} km</span>
                    <span className="flex items-center gap-1 text-success">
                      <Navigation className="h-3 w-3" />
                      {ride.co2Saved.toFixed(1)} kg CO₂
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {ride.seatsAvailable} seats
                    </span>
                  </div>

                  {/* Row 3: tags */}
                  {(ride.vehicleMake || (ride.preferencesTags && ride.preferencesTags.length > 0)) && (
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {ride.vehicleMake && (
                        <Badge variant="outline" className="text-xs h-5 py-0 px-1.5">
                          {getVehicleIcon(ride.vehicleType || '')} {ride.vehicleMake}
                        </Badge>
                      )}
                      {ride.vehicleType === 'electric' && (
                        <Badge variant="outline" className="text-xs h-5 py-0 px-1.5 bg-success/10 text-success border-success/20">
                          <Zap className="h-2.5 w-2.5 mr-0.5" />Zero Emissions
                        </Badge>
                      )}
                      {ride.preferencesTags?.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs h-5 py-0 px-1.5 bg-info/10 text-info border-info/20">
                          {tag}
                        </Badge>
                      ))}
                      {(ride.preferencesTags?.length ?? 0) > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{(ride.preferencesTags?.length ?? 0) - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Match + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${getMatchStyle(ride.matchScore)}`}>
                    {ride.matchScore}%
                  </span>
                  <Button
                    size="sm"
                    className="h-8 text-xs px-3"
                    onClick={() => { setSelectedRide(ride); setIsBookDialogOpen(true); }}
                  >
                    Request
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => handleViewDetails(ride)}>
                        <BarChart3 className="h-3.5 w-3.5 mr-2" />View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSelectedRide(ride); setIsMessageDialogOpen(true); }}>
                        <MessageCircle className="h-3.5 w-3.5 mr-2" />Message Driver
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))
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
            <DialogDescription>Comprehensive compatibility analysis and ride information</DialogDescription>
          </DialogHeader>
          {selectedRide && (
            <div className="space-y-6 py-4">
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
                      <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                        <Shield className="h-3 w-3 mr-1" />Verified Driver
                      </Badge>
                    )}
                  </div>
                  {selectedRide.driverRating && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="h-5 w-5 fill-current" />
                        <span className="font-medium text-lg">{selectedRide.driverRating}</span>
                      </div>
                      <span className="text-muted-foreground">{selectedRide.totalTrips} completed trips</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Trust Score: {selectedRide.trustScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              <CompatibilityScore
                overallScore={selectedRide.matchScore}
                {...getDetailedScores(selectedRide)}
                detailed={true}
              />

              <RouteMapVisualization
                origin={selectedRide.originLocation}
                destination={selectedRide.destinationLocation}
                userOrigin={geocodeAddress(origin)}
                userDestination={geocodeAddress(destination)}
                distance={selectedRide.distance}
                showCompatibility={true}
                compatibilityScore={selectedRide.matchScore}
              />

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Departure Time</Label>
                  <p className="font-medium text-foreground mt-1 text-lg">{selectedRide.departureTime}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Seats Available</Label>
                  <p className="font-medium text-foreground mt-1 text-lg">{selectedRide.seatsAvailable}</p>
                </Card>
              </div>

              {selectedRide.vehicleMake && (
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground mb-2 block">Vehicle</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getVehicleIcon(selectedRide.vehicleType || '')}</span>
                    <p className="font-medium text-foreground text-lg">{selectedRide.vehicleMake}</p>
                    {selectedRide.vehicleType === 'electric' && (
                      <Badge className="bg-success text-white">
                        <Zap className="h-3 w-3 mr-1" />Zero Emissions
                      </Badge>
                    )}
                  </div>
                </Card>
              )}

              {selectedRide.preferencesTags && selectedRide.preferencesTags.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">Ride Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRide.preferencesTags.map((pref, idx) => (
                      <Badge key={idx} variant="outline" className="bg-info/10 text-info border-info/20">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedRide.recurring && selectedRide.daysOfWeek && (
                <Card className="p-4 bg-info/10 border-info/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Repeat className="h-5 w-5 text-info" />
                    <Label className="text-sm font-medium text-foreground">Recurring Schedule</Label>
                  </div>
                  <p className="text-sm text-info">
                    Repeats every{' '}
                    {selectedRide.daysOfWeek.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
                  </p>
                </Card>
              )}

              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5 text-success" />
                  <span className="font-semibold text-success">Environmental Impact</span>
                </div>
                <p className="text-sm text-success">
                  By joining this ride, you'll save <strong>{selectedRide.co2Saved.toFixed(1)} kg CO₂</strong> compared
                  to driving alone — equivalent to planting <strong>{Math.round(selectedRide.co2Saved * 0.5)}</strong> trees!
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsDetailsDialogOpen(false); setIsBookDialogOpen(true); }}>
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
            <DialogDescription>Confirm your booking with {selectedRide?.driver}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-info">
                  <strong>{selectedRide?.driver}</strong> · {selectedRide?.departureTime}
                </span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                  {selectedRide?.co2Saved.toFixed(1)} kg CO₂ saved
                </Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="seats">Number of Seats *</Label>
              <Select value={bookingData.seats} onValueChange={(value) => setBookingData({ ...bookingData, seats: value })}>
                <SelectTrigger id="seats"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedRide?.seatsAvailable || 1 }, (_, i) => i + 1).map((n) => (
                    <SelectItem key={n} value={n.toString()}>{n} seat{n > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pickup">Pickup Location *</Label>
              <Input
                id="pickup"
                value={bookingData.pickupLocation}
                onChange={(e) => setBookingData({ ...bookingData, pickupLocation: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsBookDialogOpen(false)}>Cancel</Button>
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
            <DialogDescription>Share your commute and help others reduce emissions</DialogDescription>
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
                  onChange={(e) => setOfferData({ ...offerData, departureTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="seats">Seats Available *</Label>
                <Select value={offerData.seatsAvailable} onValueChange={(value) => setOfferData({ ...offerData, seatsAvailable: value })}>
                  <SelectTrigger id="seats"><SelectValue /></SelectTrigger>
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
                <Select value={offerData.vehicleType} onValueChange={(value) => setOfferData({ ...offerData, vehicleType: value })}>
                  <SelectTrigger id="vehicle-type"><SelectValue placeholder="Select type" /></SelectTrigger>
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
              <p className="text-xs text-muted-foreground mt-1">Separate with commas</p>
            </div>
            <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-info" />
                <p className="text-sm font-medium text-info">Your default commute preferences will be applied</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setIsOfferDialogOpen(false); setIsPreferencesOpen(true); }}>
                Edit Preferences
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>Cancel</Button>
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
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
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
              <div className="h-14 w-14 bg-success/15 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your ride with {selectedRide?.driver} has been confirmed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Driver:</span>
                <span className="font-medium">{selectedRide?.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Departure:</span>
                <span className="font-medium">{selectedRide?.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pickup:</span>
                <span className="font-medium">{bookingData.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats:</span>
                <span className="font-medium">{bookingData.seats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Match Score:</span>
                <span className="font-medium text-success">{selectedRide?.matchScore}%</span>
              </div>
            </div>
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
              <p className="text-sm text-success">
                🌱 You'll save <strong>{selectedRide?.co2Saved.toFixed(1)} kg CO₂</strong> on this trip!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsConfirmationDialogOpen(false)} className="w-full">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
