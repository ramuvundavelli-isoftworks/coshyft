import React, { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Award, 
  Download, 
  Filter, 
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  Eye,
  TrendingDown,
  Edit,
  Trash2,
  X,
  AlertTriangle
} from 'lucide-react';
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';
import { toast } from 'sonner';

type SortField = 'date' | 'mode' | 'distance' | 'co2Saved';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

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
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [isLogCommuteOpen, setIsLogCommuteOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [commuteEntries, setCommuteEntries] = useState<CommuteEntry[]>([]);
  const [editData, setEditData] = useState({
    mode: '',
    distance: '',
    passengers: '',
    notes: '',
  });
  const [exportFormat, setExportFormat] = useState('csv');

  // Filter trips
  let filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.office.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = modeFilter === 'all' || trip.mode === modeFilter;
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const tripDate = new Date(trip.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - tripDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === '7d') matchesDate = daysDiff <= 7;
      else if (dateFilter === '30d') matchesDate = daysDiff <= 30;
      else if (dateFilter === '90d') matchesDate = daysDiff <= 90;
    }
    
    return matchesSearch && matchesMode && matchesStatus && matchesDate;
  });

  // Sort trips
  filteredTrips.sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortField === 'mode') {
      comparison = a.mode.localeCompare(b.mode);
    } else if (sortField === 'distance') {
      comparison = a.distance - b.distance;
    } else if (sortField === 'co2Saved') {
      comparison = a.co2Saved - b.co2Saved;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalTrips = trips.length;
  const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
  const totalCO2Saved = trips.reduce((sum, t) => sum + t.co2Saved, 0);
  const upcomingTrips = trips.filter(t => t.status === 'upcoming').length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleEditTrip = () => {
    if (selectedTrip) {
      const updated = trips.map(t =>
        t.id === selectedTrip.id
          ? {
              ...t,
              mode: editData.mode,
              distance: parseFloat(editData.distance),
              passengers: parseInt(editData.passengers),
            }
          : t
      );
      setTrips(updated);
      setIsEditDialogOpen(false);
      toast.success('Trip updated successfully');
    }
  };

  const handleDeleteTrip = () => {
    if (selectedTrip) {
      setTrips(trips.filter(t => t.id !== selectedTrip.id));
      setIsDeleteDialogOpen(false);
      toast.success('Trip deleted successfully');
    }
  };

  const handleCancelTrip = () => {
    if (selectedTrip) {
      const updated = trips.map(t =>
        t.id === selectedTrip.id
          ? { ...t, status: 'cancelled' as const }
          : t
      );
      setTrips(updated);
      setIsCancelDialogOpen(false);
      toast.success('Trip cancelled');
    }
  };

  const handleExport = () => {
    toast.success(`Exporting trips as ${exportFormat.toUpperCase()}`);
    setIsExportDialogOpen(false);
  };

  const selectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setEditData({
      mode: trip.mode,
      distance: trip.distance.toString(),
      passengers: trip.passengers.toString(),
      notes: '',
    });
  };

  const handleLogCommute = (entries: CommuteEntry[]) => {
    setCommuteEntries(entries);
    setIsLogCommuteOpen(false);
    toast.success(`${entries.length} commute(s) logged successfully`);
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Bike':
      case 'Walk':
        return 'bg-green-100 text-green-700';
      case 'Public Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Carpool':
        return 'bg-purple-100 text-purple-700';
      case 'SOV':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-1">
            View and manage your commute history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsLogCommuteOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Commute
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Distance</p>
              <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-600">{totalCO2Saved.toFixed(1)} kg</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingTrips}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="Carpool">Carpool</SelectItem>
              <SelectItem value="Public Transit">Public Transit</SelectItem>
              <SelectItem value="Bike">Bike</SelectItem>
              <SelectItem value="Walk">Walk</SelectItem>
              <SelectItem value="SOV">SOV</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>
      </Card>

      {/* Trips Display */}
      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h3>
                      <Badge className={getModeColor(trip.mode)}>{trip.mode}</Badge>
                      {getStatusBadge(trip.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Distance</p>
                        <p className="font-medium text-gray-900">{trip.distance} km</p>
                      </div>
                      <div>
                        <p className="text-gray-600">CO₂ Saved</p>
                        <p className="font-medium text-green-600">{trip.co2Saved} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Office</p>
                        <p className="font-medium text-gray-900">{trip.office}</p>
                      </div>
                      {trip.driver && (
                        <div>
                          <p className="text-gray-600">Driver</p>
                          <p className="font-medium text-gray-900">{trip.driver}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTrip(trip);
                      setIsViewDetailsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {trip.status === 'upcoming' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          selectTrip(trip);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTrip(trip);
                          setIsCancelDialogOpen(true);
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {trip.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTrip(trip);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-2">
                    Date
                    <SortIcon field="date" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('mode')}>
                  <div className="flex items-center gap-2">
                    Mode
                    <SortIcon field="mode" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('distance')}>
                  <div className="flex items-center gap-2">
                    Distance
                    <SortIcon field="distance" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('co2Saved')}>
                  <div className="flex items-center gap-2">
                    CO₂ Saved
                    <SortIcon field="co2Saved" />
                  </div>
                </TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {new Date(trip.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getModeColor(trip.mode)}>{trip.mode}</Badge>
                  </TableCell>
                  <TableCell>{trip.distance} km</TableCell>
                  <TableCell className="text-green-600 font-medium">{trip.co2Saved} kg</TableCell>
                  <TableCell className="text-sm text-gray-600">{trip.office}</TableCell>
                  <TableCell>{getStatusBadge(trip.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTrip(trip);
                          setIsViewDetailsDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {trip.status === 'upcoming' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            selectTrip(trip);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {trip.status === 'completed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTrip(trip);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Log Commute Modal */}
      <LogCommuteModal
        isOpen={isLogCommuteOpen}
        onClose={() => setIsLogCommuteOpen(false)}
        onSave={handleLogCommute}
      />

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              {selectedTrip && new Date(selectedTrip.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Transport Mode</Label>
                  <Badge className={`${getModeColor(selectedTrip.mode)} mt-1`}>
                    {selectedTrip.mode}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTrip.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Distance</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTrip.distance} km</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">CO₂ Saved</Label>
                  <p className="font-medium text-green-600 mt-1">{selectedTrip.co2Saved} kg</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Emissions</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTrip.emissions} kg CO₂e</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Office</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTrip.office}</p>
                </div>
              </div>
              {selectedTrip.driver && (
                <div>
                  <Label className="text-sm text-gray-600">Driver</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTrip.driver}</p>
                </div>
              )}
              {selectedTrip.passengers > 0 && (
                <div>
                  <Label className="text-sm text-gray-600">Passengers</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTrip.passengers} people</p>
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
              <Select
                value={editData.mode}
                onValueChange={(value) => setEditData({ ...editData, mode: value })}
              >
                <SelectTrigger id="edit-mode">
                  <SelectValue />
                </SelectTrigger>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTrip}>
              Save Changes
            </Button>
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
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    {selectedTrip && new Date(selectedTrip.date).toLocaleDateString()} - {selectedTrip?.mode}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    This will permanently remove this trip from your history.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              Delete Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Trip Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Trip</DialogTitle>
            <DialogDescription>
              Cancel your upcoming trip for {selectedTrip && new Date(selectedTrip.date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will cancel your {selectedTrip?.mode} trip. If you're carpooling, the driver will be notified.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Trip
            </Button>
            <Button variant="destructive" onClick={handleCancelTrip}>
              Cancel Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Trips</DialogTitle>
            <DialogDescription>
              Download your trip history in your preferred format
            </DialogDescription>
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
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
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
