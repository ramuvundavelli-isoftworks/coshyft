import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
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
  Car,
  MapPin,
  Clock,
  Users,
  Plus,
  CheckCircle,
  XCircle,
  LocateFixed,
  Loader2,
  ArrowRight,
  Leaf,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApiMutation } from '../api';
import { carpoolingApi } from '../api';

const DRIVER_CANCEL_REASONS = [
  'Schedule change',
  'Vehicle issue or breakdown',
  'Personal emergency',
  'Weather conditions',
  'No passengers requested',
  'Found alternative arrangement',
  'Others',
];

const DECLINE_REASONS = [
  'Pickup location too far out of route',
  'Scheduling conflict',
  'Reached passenger limit',
  'Different destination',
  'Policy concern',
  'Others',
];

function statusBadge(status: string) {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-warning-subtle text-warning">Scheduled</Badge>;
    case 'active':
      return <Badge className="bg-success-subtle text-success">Active</Badge>;
    case 'completed':
      return <Badge className="bg-muted text-foreground">Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-destructive-subtle text-destructive">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

function requestStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge className="bg-warning-subtle text-warning">Pending</Badge>;
    case 'accepted':
      return <Badge className="bg-success-subtle text-success">Accepted</Badge>;
    case 'rejected':
      return <Badge className="bg-destructive-subtle text-destructive">Declined</Badge>;
    case 'cancelled':
      return <Badge className="bg-muted text-muted-foreground">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function OfferRide() {
  // ─── Offer form ───────────────────────────────────────────────────────
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    seats: '3',
    notes: '',
  });
  const [isLocating, setIsLocating] = useState(false);

  // ─── My offers list ───────────────────────────────────────────────────
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);

  // ─── Requests dialog ──────────────────────────────────────────────────
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [rideRequests, setRideRequests] = useState<any[]>([]);
  const [requestsDialogOpen, setRequestsDialogOpen] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // ─── Decline-with-reason dialog ───────────────────────────────────────
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [decliningRequest, setDecliningRequest] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [declineNote, setDeclineNote] = useState('');

  // ─── Cancel-ride dialog ───────────────────────────────────────────────
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellingOffer, setCancellingOffer] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');

  const offerMutation = useApiMutation((data: any) => carpoolingApi.offerRide(data));
  const acceptMutation = useApiMutation((d: { rideId: string; requestId: string }) =>
    carpoolingApi.acceptRequest(d.rideId, d.requestId)
  );
  const rejectMutation = useApiMutation(
    (d: { rideId: string; requestId: string; reason: string; note: string }) =>
      carpoolingApi.rejectRequest(d.rideId, d.requestId, { reason: d.reason, note: d.note || undefined })
  );
  const cancelRideMutation = useApiMutation(
    (d: { rideId: string; reason: string; note: string }) =>
      carpoolingApi.cancelRide(d.rideId, { reason: d.reason, note: d.note || undefined })
  );

  const refreshOffers = () =>
    carpoolingApi.getMyRides().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setMyOffers((res.data as any[]).filter((r) => r.user_role === 'driver'));
      }
      setLoadingOffers(false);
    });

  useEffect(() => { refreshOffers(); }, []);

  // ─── GPS location ─────────────────────────────────────────────────────
  const handleUseLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          from: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        }));
        setIsLocating(false);
        toast.success('Location detected');
      },
      () => { setIsLocating(false); toast.error('Could not get location'); },
      { timeout: 10000, enableHighAccuracy: false },
    );
  };

  // ─── Offer ride ───────────────────────────────────────────────────────
  const handleOfferRide = async () => {
    if (!formData.from || !formData.to || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }
    const result = await offerMutation.execute({
      origin: formData.from,
      destination: formData.to,
      departure_time: `${formData.date}T${formData.time}:00`,
      seats_total: parseInt(formData.seats) + 1,
    });
    if (result.success) {
      toast.success('Ride offer created!');
      setIsOfferDialogOpen(false);
      setFormData({ from: '', to: '', date: new Date().toISOString().split('T')[0], time: '08:00', seats: '3', notes: '' });
      refreshOffers();
    } else {
      toast.error(result.error?.message || 'Failed to create ride offer');
    }
  };

  // ─── View requests ────────────────────────────────────────────────────
  const handleViewRequests = async (ride: any) => {
    setSelectedRide(ride);
    setRequestsDialogOpen(true);
    setLoadingRequests(true);
    const result = await carpoolingApi.getRideRequests(ride.id);
    setRideRequests(result.success && Array.isArray(result.data) ? result.data : []);
    setLoadingRequests(false);
  };

  // ─── Accept request ───────────────────────────────────────────────────
  const handleAccept = async (req: any) => {
    if (!selectedRide) return;
    const result = await acceptMutation.execute({ rideId: selectedRide.id, requestId: req.id });
    if (result.success) {
      toast.success(`${req.passenger_name || 'Passenger'} accepted`);
      setRideRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'accepted' } : r));
    } else {
      toast.error(result.error?.message || 'Failed to accept request');
    }
  };

  // ─── Open decline dialog ──────────────────────────────────────────────
  const openDeclineDialog = (req: any) => {
    setDecliningRequest(req);
    setDeclineReason('');
    setDeclineNote('');
    setDeclineDialogOpen(true);
  };

  // ─── Confirm decline ──────────────────────────────────────────────────
  const handleConfirmDecline = async () => {
    if (!selectedRide || !decliningRequest) return;
    if (!declineReason) { toast.error('Please select a reason'); return; }
    if (declineReason === 'Others' && !declineNote.trim()) {
      toast.error('Please describe the reason in the note');
      return;
    }
    const result = await rejectMutation.execute({
      rideId: selectedRide.id,
      requestId: decliningRequest.id,
      reason: declineReason,
      note: declineNote,
    });
    if (result.success) {
      toast.success('Request declined');
      setRideRequests(prev => prev.map(r => r.id === decliningRequest.id ? { ...r, status: 'rejected' } : r));
      setDeclineDialogOpen(false);
    } else {
      toast.error(result.error?.message || 'Failed to decline request');
    }
  };

  // ─── Open cancel ride dialog ──────────────────────────────────────────
  const openCancelDialog = (offer: any) => {
    setCancellingOffer(offer);
    setCancelReason('');
    setCancelNote('');
    setCancelDialogOpen(true);
  };

  // ─── Confirm cancel ride ──────────────────────────────────────────────
  const handleConfirmCancelRide = async () => {
    if (!cancellingOffer) return;
    if (!cancelReason) { toast.error('Please select a reason'); return; }
    if (cancelReason === 'Others' && !cancelNote.trim()) {
      toast.error('Please describe the reason in the note');
      return;
    }
    const result = await cancelRideMutation.execute({
      rideId: cancellingOffer.id,
      reason: cancelReason,
      note: cancelNote,
    });
    if (result.success) {
      toast.success('Ride cancelled');
      setCancelDialogOpen(false);
      refreshOffers();
    } else {
      toast.error(result.error?.message || 'Failed to cancel ride');
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offer a Ride</h1>
          <p className="text-muted-foreground mt-1">
            Share your commute with colleagues and reduce your company's carbon footprint
          </p>
        </div>
        <Button onClick={() => setIsOfferDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ride Offer
        </Button>
      </div>

      {/* Quick benefits bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Leaf, color: 'success', label: 'Reduce Emissions', desc: 'Lower your company\'s Scope 3 footprint' },
          { icon: Users, color: 'info', label: 'Build Community', desc: 'Connect with colleagues on your route' },
          { icon: CheckCircle, color: 'info', label: 'Earn Rewards', desc: 'OxyPoints for every successful carpool' },
        ].map(({ icon: Icon, color, label, desc }) => (
          <Card key={label} className={`p-4 bg-${color}-subtle border-${color}/25`}>
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 text-${color}`} />
              <div>
                <p className={`font-semibold text-sm text-${color}`}>{label}</p>
                <p className={`text-xs text-${color}/80`}>{desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* My Ride Offers */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">My Ride Offers</h3>

        {loadingOffers ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading your offers…</span>
          </div>
        ) : myOffers.length === 0 ? (
          <div className="text-center py-10">
            <Car className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No ride offers yet.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsOfferDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create your first offer
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myOffers.map((offer) => {
              const depTime = offer.departure_time
                ? new Date(offer.departure_time).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })
                : '—';
              const isScheduled = offer.status === 'scheduled';
              const passengersBoarded = (offer.seats_total - 1) - offer.seats_available;

              return (
                <div
                  key={offer.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: ride info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {statusBadge(offer.status)}
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {depTime}
                        </span>
                      </div>

                      {/* Route */}
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">{offer.origin}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground truncate">{offer.destination}</span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {offer.seats_available}/{offer.seats_total - 1} seats available
                          {passengersBoarded > 0 && (
                            <span className="ml-1 text-success">({passengersBoarded} confirmed)</span>
                          )}
                        </span>
                        {offer.co2_saved > 0 && (
                          <span className="flex items-center gap-1 text-success">
                            <Leaf className="h-3.5 w-3.5" />
                            {Number(offer.co2_saved).toFixed(1)} kg CO₂ saved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" onClick={() => handleViewRequests(offer)}>
                        View Requests
                      </Button>
                      {isScheduled && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/50 hover:bg-destructive-subtle"
                          onClick={() => openCancelDialog(offer)}
                        >
                          Cancel Ride
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* ─── Offer Ride Dialog ─────────────────────────────────────────── */}
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Offer a Ride</DialogTitle>
            <DialogDescription>Share your commute with colleagues</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from">From *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Your starting address"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleUseLocation} disabled={isLocating} title="Use GPS location">
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  className="mt-1"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="Destination (e.g. Dublin HQ)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" className="mt-1" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="time">Departure Time *</Label>
                <Input id="time" type="time" className="mt-1" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
              </div>
            </div>

            <div>
              <Label htmlFor="seats">Available Seats for Passengers *</Label>
              <Select value={formData.seats} onValueChange={(val) => setFormData({ ...formData, seats: val })}>
                <SelectTrigger id="seats" className="mt-1">
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

            <div>
              <Label htmlFor="notes">Notes for passengers (optional)</Label>
              <Textarea
                id="notes"
                className="mt-1"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Pickup preferences, car description, etc."
                rows={3}
              />
            </div>

            <div className="p-3 bg-info-subtle border border-info/25 rounded-lg text-sm text-info">
              Colleagues in your company will see this offer and can request to join.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleOfferRide}
              disabled={!formData.from || !formData.to || !formData.date || !formData.time || offerMutation.loading}
            >
              {offerMutation.loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating…</>
                : <><Plus className="h-4 w-4 mr-2" />Offer Ride</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Ride Requests Dialog ──────────────────────────────────────── */}
      <Dialog open={requestsDialogOpen} onOpenChange={setRequestsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ride Requests</DialogTitle>
            {selectedRide && (
              <DialogDescription>
                {selectedRide.origin} → {selectedRide.destination} ·{' '}
                {new Date(selectedRide.departure_time).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-3 py-2">
            {loadingRequests ? (
              <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Loading requests…</span>
              </div>
            ) : rideRequests.length === 0 ? (
              <div className="text-center py-10">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No requests yet. Share your ride offer with colleagues!</p>
              </div>
            ) : (
              rideRequests.map((req) => {
                const isPending = req.status === 'pending';
                const initials = (req.passenger_name || 'P')
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div key={req.id} className="border rounded-lg p-4 space-y-3">
                    {/* Header row */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-info-subtle flex items-center justify-center text-info font-semibold text-sm shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{req.passenger_name || 'Passenger'}</p>
                          <p className="text-xs text-muted-foreground">
                            Requested {new Date(req.requested_at).toLocaleString('en-IE', { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      {requestStatusBadge(req.status)}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 text-sm">
                      {req.pickup_address && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <span><span className="font-medium text-foreground">Pickup:</span> {req.pickup_address}</span>
                        </div>
                      )}
                      {req.message && (
                        <div className="pl-1 border-l-2 border-border ml-1">
                          <p className="text-xs italic text-muted-foreground">"{req.message}"</p>
                        </div>
                      )}
                    </div>

                    {/* Actions for pending requests */}
                    {isPending && (
                      <div className="flex gap-2 pt-1">
                        <Button
                          size="sm"
                          className="bg-success hover:bg-success/90 text-white"
                          onClick={() => handleAccept(req)}
                          disabled={acceptMutation.loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1.5" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/50 hover:bg-destructive-subtle"
                          onClick={() => openDeclineDialog(req)}
                        >
                          <XCircle className="h-4 w-4 mr-1.5" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Decline with Reason Dialog ────────────────────────────────── */}
      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Decline Request</DialogTitle>
            <DialogDescription>
              Let {decliningRequest?.passenger_name || 'the passenger'} know why you're declining.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="decline-reason">Reason *</Label>
              <Select value={declineReason} onValueChange={setDeclineReason}>
                <SelectTrigger id="decline-reason" className="mt-1">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {DECLINE_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="decline-note">
                {declineReason === 'Others' ? 'Note (required)' : 'Note (optional)'}
              </Label>
              <Textarea
                id="decline-note"
                className="mt-1"
                value={declineNote}
                onChange={(e) => setDeclineNote(e.target.value)}
                placeholder={declineReason === 'Others' ? 'Please explain…' : 'Any additional context…'}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>Back</Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDecline}
              disabled={!declineReason || rejectMutation.loading}
            >
              {rejectMutation.loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Cancel Ride Dialog ────────────────────────────────────────── */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Ride</DialogTitle>
            <DialogDescription>
              {cancellingOffer && (
                <>
                  {cancellingOffer.origin} → {cancellingOffer.destination} ·{' '}
                  {new Date(cancellingOffer.departure_time).toLocaleString('en-IE', { dateStyle: 'medium', timeStyle: 'short' })}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-2 p-3 bg-warning-subtle border border-warning/25 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-warning">All accepted passengers will be notified of this cancellation.</p>
            </div>
            <div>
              <Label htmlFor="cancel-reason">Reason for cancellation *</Label>
              <Select value={cancelReason} onValueChange={setCancelReason}>
                <SelectTrigger id="cancel-reason" className="mt-1">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {DRIVER_CANCEL_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cancel-note">
                {cancelReason === 'Others' ? 'Note (required)' : 'Note (optional)'}
              </Label>
              <Textarea
                id="cancel-note"
                className="mt-1"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder={cancelReason === 'Others' ? 'Please explain…' : 'Any additional context for your passengers…'}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>Keep Ride</Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancelRide}
              disabled={!cancelReason || cancelRideMutation.loading}
            >
              {cancelRideMutation.loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Cancel Ride
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
