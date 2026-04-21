import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Car, Users, MapPin, Eye, XCircle, Clock, CheckCircle, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

const PAGE_SIZE = 20;

const STATUS_COLORS: Record<string, string> = {
  scheduled: 'bg-info-subtle text-info',
  active:    'bg-success-subtle text-success',
  completed: 'bg-muted text-foreground',
  cancelled: 'bg-destructive-subtle text-destructive',
  full:      'bg-info-subtle text-info',
};

function fmt(dt: string) {
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString('en-IE', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function RideOperations() {
  const [page, setPage]               = useState(1);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [isViewOpen, setIsViewOpen]   = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const params: any = { page, page_size: PAGE_SIZE };
  if (filterStatus !== 'all') params.status = filterStatus;
  if (searchTerm) params.search = searchTerm;

  const { data, loading, refetch } = useApi(
    () => adminApi.getRideOperations(params),
    { deps: [page, filterStatus, searchTerm] },
  );

  const cancelMutation = useApiMutation((id: string) => adminApi.cancelRide(id));

  const rides: any[]  = data?.items ?? [];
  const total: number = data?.total ?? 0;
  const totalPages    = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const activeCount    = rides.filter(r => r.status === 'active' || r.status === 'scheduled').length;
  const completedCount = rides.filter(r => r.status === 'completed').length;
  const totalSeats     = rides.reduce((s, r) => s + (r.seats_total ?? 0), 0);

  const handleCancel = async () => {
    if (!selectedRide) return;
    const r = await cancelMutation.execute(selectedRide.id);
    if (r.success) {
      toast.success('Ride cancelled');
      refetch();
    } else {
      toast.error(r.error?.message ?? 'Failed to cancel ride');
    }
    setIsCancelOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ride Operations</h1>
          <p className="text-muted-foreground mt-1">Admin view of ride offers and carpooling activity</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Total Offers',   loading ? '—' : total,          'bg-info-subtle',   Car,          'text-info'],
          ['Active / Scheduled', loading ? '—' : activeCount,'bg-success-subtle',  CheckCircle,  'text-success'],
          ['Completed',      loading ? '—' : completedCount,  'bg-muted',   Clock,        'text-muted-foreground'],
          ['Total Seats',    loading ? '—' : totalSeats,      'bg-info-subtle', Users,        'text-info'],
        ] as any[]).map(([label, val, bg, Icon, ic]) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bg} rounded-lg`}><Icon className={`h-5 w-5 ${ic}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search origin or destination..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            className="flex-1"
          />
          <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Rides Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Ride Offers {!loading && <span className="text-muted-foreground font-normal text-sm">({total} total)</span>}
        </h3>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading rides...</p>
        ) : rides.length === 0 ? (
          <div className="text-center py-12">
            <Car className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No rides found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>CO₂ Saved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.map((ride: any) => {
                const { date, time } = fmt(ride.departure_time);
                const canCancel = ride.status === 'scheduled' || ride.status === 'active';
                return (
                  <TableRow key={ride.id}>
                    <TableCell className="font-medium">{ride.driver_name ?? ride.driver_id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[140px]">{ride.origin}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[140px]">{ride.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{date}</p>
                        <p className="text-muted-foreground">{time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ride.seats_available}/{ride.seats_total}
                    </TableCell>
                    <TableCell className="text-success font-medium">
                      {ride.co2_saved?.toFixed(1)} kg
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[ride.status] ?? 'bg-muted text-foreground'}>
                        {ride.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRide(ride); setIsViewOpen(true); }}>
                          <Eye className="h-4 w-4 mr-1" />View
                        </Button>
                        {canCancel && (
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedRide(ride); setIsCancelOpen(true); }}>
                            <XCircle className="h-4 w-4 mr-1" />Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} · {total} rides
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
            <DialogDescription>Full ride offer information</DialogDescription>
          </DialogHeader>
          {selectedRide && (() => {
            const { date, time } = fmt(selectedRide.departure_time);
            return (
              <div className="py-4 space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Driver</Label>
                  <p className="font-medium">{selectedRide.driver_name ?? selectedRide.driver_id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <p className="font-medium">{selectedRide.origin}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <p className="font-medium">{selectedRide.destination}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Date</Label>
                    <p className="font-medium">{date}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Time</Label>
                    <p className="font-medium">{time}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Seats Available</Label>
                    <p className="font-medium">{selectedRide.seats_available} / {selectedRide.seats_total}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Distance</Label>
                    <p className="font-medium">{selectedRide.distance_km} km</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">CO₂ Saved</Label>
                    <p className="font-medium text-success">{selectedRide.co2_saved?.toFixed(1)} kg</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Vehicle</Label>
                    <p className="font-medium">{selectedRide.vehicle_make ? `${selectedRide.vehicle_make} (${selectedRide.vehicle_type})` : selectedRide.vehicle_type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge className={`mt-1 ${STATUS_COLORS[selectedRide.status] ?? ''}`}>{selectedRide.status}</Badge>
                  </div>
                </div>
                {selectedRide.share_code && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Share Code</Label>
                    <p className="font-mono font-bold text-lg">{selectedRide.share_code}</p>
                  </div>
                )}
              </div>
            );
          })()}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Ride</DialogTitle>
            <DialogDescription>
              Cancel ride by {selectedRide?.driver_name ?? 'this driver'} from {selectedRide?.origin} to {selectedRide?.destination}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will cancel the ride and all associated requests. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>Close</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={cancelMutation.loading}>
              <XCircle className="h-4 w-4 mr-2" />
              {cancelMutation.loading ? 'Cancelling...' : 'Cancel Ride'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
