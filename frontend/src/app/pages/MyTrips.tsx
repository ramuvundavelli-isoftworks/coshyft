import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Calendar,
  TrendingDown,
  Download,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  MoreHorizontal,
  Car,
  Bike,
  Bus,
  PersonStanding,
  Route,
} from 'lucide-react';
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { carpoolingApi, commuteApi } from '../api';

type SortField = 'date' | 'mode' | 'distance' | 'co2Saved';
type SortDirection = 'asc' | 'desc';

interface Trip {
  id: string;
  date: string;
  mode: string;
  driver: string | null;
  distance: number;
  co2Saved: number;
  emissions: number;
  status: 'completed' | 'upcoming' | 'cancelled';
  office: string;
  passengers: number;
  userRole?: 'driver' | 'passenger' | 'passenger_pending';
  requestId?: string;
}

const mockTrips: Trip[] = [
  { id: 't1', date: '2026-02-18', mode: 'Carpool', driver: 'Alice Johnson', distance: 12.3, co2Saved: 2.1, emissions: 0.52, status: 'completed', office: 'HQ - Tech Park', passengers: 3 },
  { id: 't2', date: '2026-02-17', mode: 'Public Transit', driver: null, distance: 14.5, co2Saved: 2.8, emissions: 0.58, status: 'completed', office: 'HQ - Tech Park', passengers: 0 },
  { id: 't3', date: '2026-02-16', mode: 'Bike', driver: null, distance: 8.2, co2Saved: 1.6, emissions: 0, status: 'completed', office: 'Downtown', passengers: 0 },
  { id: 't4', date: '2026-02-15', mode: 'Carpool', driver: 'Mike Chen', distance: 12.3, co2Saved: 2.1, emissions: 0.52, status: 'completed', office: 'HQ - Tech Park', passengers: 2 },
  { id: 't5', date: '2026-02-14', mode: 'SOV', driver: null, distance: 12.3, co2Saved: 0, emissions: 2.09, status: 'completed', office: 'HQ - Tech Park', passengers: 0 },
  { id: 't19', date: '2026-02-19', mode: 'Carpool', driver: 'Mike Chen', distance: 12.3, co2Saved: 2.1, emissions: 0.52, status: 'upcoming', office: 'HQ - Tech Park', passengers: 2 },
  { id: 't20', date: '2026-02-20', mode: 'Public Transit', driver: null, distance: 14.5, co2Saved: 2.8, emissions: 0.58, status: 'upcoming', office: 'HQ - Tech Park', passengers: 0 },
];

export default function MyTrips() {
  const { data: historyData, refetch: refetchHistory } = useApi(
    () => commuteApi.getHistory({ page: 1, page_size: 100 }),
    { deps: [] }
  );

  const { data: rideHistoryData } = useApi(() => carpoolingApi.getMyRides(), { deps: [] });

  const rideItems: any[] = Array.isArray(rideHistoryData)
    ? (rideHistoryData as any)
    : Array.isArray((rideHistoryData as any)?.items)
    ? (rideHistoryData as any).items
    : [];

  const rideTrips: Trip[] = rideItems.map((ride: any) => {
    const depTime = ride.departure_time ? new Date(ride.departure_time) : null;
    const isPast = depTime !== null && depTime < new Date();
    const status: Trip['status'] =
      ride.status === 'completed'
        ? 'completed'
        : ride.status === 'cancelled'
        ? 'cancelled'
        : ride.status === 'active'
        ? 'upcoming'
        : isPast
        ? 'completed'
        : 'upcoming';
    return ({
    id: ride.id,
    date: ride.departure_time?.substring(0, 10) ?? '',
    mode: 'Carpool',
    driver: ride.driver_name ?? 'Driver',
    distance: ride.distance_km ?? 0,
    co2Saved: Math.max(0, ride.co2_saved ?? 0),
    emissions: 0,
    status,
    office: `${ride.origin ?? ''} → ${ride.destination ?? ''}`,
    passengers: Math.max(0, (ride.seats_total ?? 1) - (ride.seats_available ?? 1)),
    userRole: ride.user_role,
    requestId: ride.request_id,
  });
  });

  const apiTrips: Trip[] = ((historyData as any)?.items ?? []).map((e: any) => ({
    id: e.id,
    date: e.date,
    mode: e.transport_mode_label,
    driver: null,
    distance: e.distance_km,
    co2Saved: Math.max(0, e.distance_km * 0.178 - e.emissions_kg_co2),
    emissions: e.emissions_kg_co2,
    status: 'completed' as const,
    office: e.destination_address ?? 'Office',
    passengers: e.carpool_passengers ?? 0,
  }));

  const [trips, setTrips] = useState<Trip[]>(mockTrips);

  useEffect(() => {
    const combined = [...apiTrips, ...rideTrips];
    if (historyData || rideHistoryData) {
      setTrips(combined);
    }
  }, [historyData, rideHistoryData]);

  const deleteMutation = useApiMutation((id: string) => commuteApi.deleteCommute(id));
  const editMutation = useApiMutation((d: { id: string; data: any }) =>
    commuteApi.updateCommute(d.id, d.data)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isLogCommuteOpen, setIsLogCommuteOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editData, setEditData] = useState({ mode: '', distance: '', passengers: '', notes: '' });
  const [exportFormat, setExportFormat] = useState('csv');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');
  const [isCancellingApi, setIsCancellingApi] = useState(false);

  // Base filter (no status)
  const baseFiltered = trips.filter(trip => {
    const matchesSearch =
      trip.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.office.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === 'all' || trip.mode === modeFilter;
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const tripDate = new Date(trip.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - tripDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dateFilter === '7d') matchesDate = daysDiff <= 7;
      else if (dateFilter === '30d') matchesDate = daysDiff <= 30;
      else if (dateFilter === '90d') matchesDate = daysDiff <= 90;
    }
    return matchesSearch && matchesMode && matchesDate;
  });

  const filteredTrips = activeStatus === 'all'
    ? baseFiltered
    : baseFiltered.filter(t => t.status === activeStatus);

  filteredTrips.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    else if (sortField === 'distance') comparison = a.distance - b.distance;
    else if (sortField === 'co2Saved') comparison = a.co2Saved - b.co2Saved;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalTrips = trips.length;
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalCO2Saved = trips.reduce((sum, t) => sum + t.co2Saved, 0);
  const upcomingCount = baseFiltered.filter(t => t.status === 'upcoming').length;
  const completedCount = baseFiltered.filter(t => t.status === 'completed').length;
  const cancelledCount = baseFiltered.filter(t => t.status === 'cancelled').length;

  const handleEditTrip = async () => {
    if (selectedTrip) {
      const result = await editMutation.execute({
        id: selectedTrip.id,
        data: {
          distance_km: parseFloat(editData.distance),
          carpool_passengers: parseInt(editData.passengers) || undefined,
          notes: editData.notes || undefined,
        },
      });
      if (result.success) {
        setTrips(prev => prev.map(t =>
          t.id === selectedTrip.id
            ? { ...t, mode: editData.mode, distance: parseFloat(editData.distance), passengers: parseInt(editData.passengers) }
            : t
        ));
        toast.success('Trip updated successfully');
        refetchHistory();
      } else {
        toast.error(result.error?.message ?? 'Failed to update trip');
      }
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (selectedTrip) {
      const result = await deleteMutation.execute(selectedTrip.id);
      if (result.success) {
        setTrips(prev => prev.filter(t => t.id !== selectedTrip.id));
        toast.success('Trip deleted successfully');
        refetchHistory();
      } else {
        toast.error(result.error?.message ?? 'Failed to delete trip');
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!selectedTrip) return;
    if (!cancelReason) { toast.error('Please select a reason'); return; }
    if (cancelReason === 'Others' && !cancelNote.trim()) {
      toast.error('Please describe the reason in the note');
      return;
    }
    setIsCancellingApi(true);
    try {
      const payload = { reason: cancelReason, note: cancelNote || undefined };
      let result: any;
      if (selectedTrip.mode === 'Carpool') {
        if (selectedTrip.userRole === 'driver') {
          result = await carpoolingApi.cancelRide(selectedTrip.id, payload);
        } else if (selectedTrip.requestId) {
          result = await carpoolingApi.cancelRequest(selectedTrip.id, selectedTrip.requestId, payload);
        }
      }
      if (!result || result.success) {
        setTrips(prev => prev.map(t => t.id === selectedTrip.id ? { ...t, status: 'cancelled' as const } : t));
        setIsCancelDialogOpen(false);
        toast.success('Trip cancelled');
        if (result?.success) refetchHistory();
      } else {
        toast.error(result.error?.message ?? 'Failed to cancel trip');
      }
    } finally {
      setIsCancellingApi(false);
    }
  };

  const handleExport = () => {
    toast.success(`Exporting trips as ${exportFormat.toUpperCase()}`);
    setIsExportDialogOpen(false);
  };

  const selectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setEditData({ mode: trip.mode, distance: trip.distance.toString(), passengers: trip.passengers.toString(), notes: '' });
  };

  const handleLogCommute = (_entry: CommuteEntry) => {
    setIsLogCommuteOpen(false);
    toast.success('Commute logged successfully');
    refetchHistory();
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Bike': return <Bike className="h-3.5 w-3.5" />;
      case 'Walk': return <PersonStanding className="h-3.5 w-3.5" />;
      case 'Public Transit': return <Bus className="h-3.5 w-3.5" />;
      case 'Carpool': return <Car className="h-3.5 w-3.5" />;
      default: return <Car className="h-3.5 w-3.5" />;
    }
  };

  const getModeStyle = (mode: string) => {
    switch (mode) {
      case 'Bike': case 'Walk': return 'bg-success/15 text-success';
      case 'Public Transit': return 'bg-info/15 text-info';
      case 'Carpool': return 'bg-primary/15 text-primary';
      case 'SOV': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-success/15 text-success border-0 text-xs">Completed</Badge>;
      case 'upcoming': return <Badge className="bg-info/15 text-info border-0 text-xs">Upcoming</Badge>;
      case 'cancelled': return <Badge className="bg-destructive/15 text-destructive border-0 text-xs">Cancelled</Badge>;
      default: return <Badge className="text-xs">{status}</Badge>;
    }
  };

  const renderTripRow = (trip: Trip) => (
    <div
      key={trip.id}
      className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 rounded-lg group transition-colors"
    >
      {/* Mode icon */}
      <div className={`h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 ${getModeStyle(trip.mode)}`}>
        {getModeIcon(trip.mode)}
      </div>

      {/* Date */}
      <div className="w-[72px] flex-shrink-0">
        <p className="text-sm font-medium leading-tight">
          {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short' })}
        </p>
      </div>

      {/* Route / office */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{trip.office}</p>
        {trip.driver && (
          <p className="text-xs text-muted-foreground truncate">with {trip.driver}</p>
        )}
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0">
        <span className="flex items-center gap-1">
          <Route className="h-3 w-3" />
          {trip.distance} km
        </span>
        {trip.co2Saved > 0 && (
          <span className="flex items-center gap-1 text-success font-medium">
            <TrendingDown className="h-3 w-3" />
            {trip.co2Saved.toFixed(1)} kg
          </span>
        )}
      </div>

      {/* Status */}
      <div className="hidden md:block flex-shrink-0">
        {getStatusBadge(trip.status)}
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => { setSelectedTrip(trip); setIsViewDetailsDialogOpen(true); }}
          >
            <Eye className="h-3.5 w-3.5 mr-2" />View Details
          </DropdownMenuItem>
          {trip.status === 'upcoming' && (
            <>
              <DropdownMenuItem
                onClick={() => { selectTrip(trip); setIsEditDialogOpen(true); }}
              >
                <Edit className="h-3.5 w-3.5 mr-2" />Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  setSelectedTrip(trip);
                  setCancelReason('');
                  setCancelNote('');
                  setIsCancelDialogOpen(true);
                }}
              >
                <X className="h-3.5 w-3.5 mr-2" />Cancel Trip
              </DropdownMenuItem>
            </>
          )}
          {trip.status === 'completed' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => { setSelectedTrip(trip); setIsDeleteDialogOpen(true); }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const statusTabs: { value: typeof activeStatus; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: baseFiltered.length },
    { value: 'upcoming', label: 'Upcoming', count: upcomingCount },
    { value: 'completed', label: 'Completed', count: completedCount },
    { value: 'cancelled', label: 'Cancelled', count: cancelledCount },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Trips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Commute history and upcoming rides</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => setIsLogCommuteOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Log Commute
          </Button>
        </div>
      </div>

      {/* Compact stats bar */}
      <div className="flex items-center gap-5 px-5 py-4 bg-card border rounded-xl">
        <div>
          <p className="text-xl font-bold leading-tight">{totalTrips}</p>
          <p className="text-xs text-muted-foreground">Total Trips</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xl font-bold leading-tight">
            {totalDistance.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground ml-1">km</span>
          </p>
          <p className="text-xs text-muted-foreground">Distance</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xl font-bold text-success leading-tight">
            {totalCO2Saved.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">kg CO₂</span>
          </p>
          <p className="text-xs text-muted-foreground">Saved</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xl font-bold text-info leading-tight">{upcomingCount}</p>
          <p className="text-xs text-muted-foreground">Upcoming</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={modeFilter} onValueChange={setModeFilter}>
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            <SelectItem value="Carpool">Carpool</SelectItem>
            <SelectItem value="Public Transit">Transit</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
            <SelectItem value="Walk">Walk</SelectItem>
            <SelectItem value="SOV">SOV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status tabs + trip list */}
      <div className="space-y-3">
        {/* Tab strip */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeStatus === tab.value
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 text-xs ${activeStatus === tab.value ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <Card className="p-2">
          {filteredTrips.length === 0 ? (
            <div className="py-10 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No trips found</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredTrips.map((trip) => (
                <div key={trip.id} className="first:pt-0 last:pb-0">
                  {renderTripRow(trip)}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Log Commute Modal */}
      <LogCommuteModal
        isOpen={isLogCommuteOpen}
        onClose={() => setIsLogCommuteOpen(false)}
        onSubmit={handleLogCommute}
      />

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              {selectedTrip && new Date(selectedTrip.date).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Transport Mode</Label>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium mt-1 ${getModeStyle(selectedTrip.mode)}`}>
                    {getModeIcon(selectedTrip.mode)}
                    {selectedTrip.mode}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTrip.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Distance</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTrip.distance} km</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">CO₂ Saved</Label>
                  <p className="font-medium text-success mt-1">{selectedTrip.co2Saved} kg</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Emissions</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTrip.emissions} kg CO₂e</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Office</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTrip.office}</p>
                </div>
              </div>
              {selectedTrip.driver && (
                <div>
                  <Label className="text-sm text-muted-foreground">Driver</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTrip.driver}</p>
                </div>
              )}
              {selectedTrip.passengers > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground">Passengers</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTrip.passengers} people</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Trip Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Update trip details for {selectedTrip && new Date(selectedTrip.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-mode">Transport Mode *</Label>
              <Select value={editData.mode} onValueChange={(value) => setEditData({ ...editData, mode: value })}>
                <SelectTrigger id="edit-mode"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Carpool">Carpool</SelectItem>
                  <SelectItem value="Public Transit">Public Transit</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="Walk">Walk</SelectItem>
                  <SelectItem value="SOV">SOV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-distance">Distance (km) *</Label>
              <Input
                id="edit-distance"
                type="number"
                step="0.1"
                value={editData.distance}
                onChange={(e) => setEditData({ ...editData, distance: e.target.value })}
              />
            </div>
            {editData.mode === 'Carpool' && (
              <div>
                <Label htmlFor="edit-passengers">Number of Passengers</Label>
                <Input
                  id="edit-passengers"
                  type="number"
                  value={editData.passengers}
                  onChange={(e) => setEditData({ ...editData, passengers: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label htmlFor="edit-notes">Notes (optional)</Label>
              <Textarea
                id="edit-notes"
                value={editData.notes}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTrip}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Trip Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trip</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning/10 border border-warning/25 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning">
                    {selectedTrip && new Date(selectedTrip.date).toLocaleDateString()} - {selectedTrip?.mode}
                  </p>
                  <p className="text-sm text-warning mt-1">
                    This will permanently remove this trip from your history.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>Delete Trip</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Trip Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Trip</DialogTitle>
            <DialogDescription>
              {selectedTrip?.mode} trip on {selectedTrip && new Date(selectedTrip.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedTrip?.mode === 'Carpool' && (
              <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/25 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                <p className="text-sm text-warning">
                  {selectedTrip.userRole === 'driver'
                    ? 'All confirmed passengers will be notified of this cancellation.'
                    : 'The driver will be notified that you are no longer joining.'}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="trip-cancel-reason">Reason for cancellation *</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger id="trip-cancel-reason" className="mt-1">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedTrip?.mode === 'Carpool' && selectedTrip?.userRole === 'driver'
                    ? ['Schedule change', 'Vehicle issue or breakdown', 'Personal emergency', 'Weather conditions', 'No passengers requested', 'Others']
                    : ['Schedule change', 'Found alternative transport', 'Personal emergency', 'No longer commuting that day', 'Plans changed', 'Others']
                  ).map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trip-cancel-note">
                {cancelReason === 'Others' ? 'Note (required)' : 'Note (optional)'}
              </Label>
              <Textarea
                id="trip-cancel-note"
                className="mt-1"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder={cancelReason === 'Others' ? 'Please explain…' : 'Any additional context…'}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Keep Trip</Button>
            <Button variant="destructive" onClick={handleCancelTrip} disabled={!cancelReason || isCancellingApi}>
              {isCancellingApi ? 'Cancelling…' : 'Cancel Trip'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Trips</DialogTitle>
            <DialogDescription>Download your trip history in your preferred format</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Trips
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
