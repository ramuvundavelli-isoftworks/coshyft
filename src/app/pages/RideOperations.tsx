import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { Car, Users, MapPin, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '../api';
import { adminApi, carpoolingApi } from '../api';

interface RideOffer {
  id: string;
  driver: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  requests: number;
  status: 'active' | 'full' | 'completed' | 'cancelled';
}

const mockRides: RideOffer[] = [
  { id: 'r1', driver: 'John Smith', from: 'Downtown', to: 'Tech Park HQ', date: '2026-02-19', time: '08:00 AM', seats: 3, requests: 2, status: 'active' },
  { id: 'r2', driver: 'Sarah Johnson', from: 'North Side', to: 'East Campus', date: '2026-02-19', time: '08:30 AM', seats: 4, requests: 4, status: 'full' },
  { id: 'r3', driver: 'Mike Chen', from: 'West End', to: 'Tech Park HQ', date: '2026-02-19', time: '07:45 AM', seats: 2, requests: 1, status: 'active' },
  { id: 'r4', driver: 'Emily Davis', from: 'Suburbs', to: 'Downtown Office', date: '2026-02-18', time: '05:30 PM', seats: 3, requests: 3, status: 'completed' },
];

export default function RideOperations() {
  const [rides, setRides] = useState<RideOffer[]>(mockRides);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState<RideOffer | null>(null);

  const handleCancel = () => {
    if (selectedRide) {
      const updated = rides.map(r =>
        r.id === selectedRide.id ? { ...r, status: 'cancelled' as const } : r
      );
      setRides(updated);
      setIsCancelDialogOpen(false);
      toast.success('Ride cancelled');
    }
  };

  const filteredRides = rides.filter(ride => {
    const matchesSearch = ride.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ride.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ride.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeRides = rides.filter(r => r.status === 'active').length;
  const totalRequests = rides.reduce((sum, r) => sum + r.requests, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ride Operations</h1>
          <p className="text-gray-600 mt-1">
            Admin view of ride offers and carpooling activity
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{rides.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Rides</p>
              <p className="text-2xl font-bold text-green-600">{activeRides}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{rides.filter(r => r.status === 'completed').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search rides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Rides Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Ride Offers</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Driver</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRides.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell className="font-medium">{ride.driver}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {ride.from}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {ride.to}
                  </div>
                </TableCell>
                <TableCell>{ride.date}</TableCell>
                <TableCell>{ride.time}</TableCell>
                <TableCell>{ride.seats}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-700">{ride.requests}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    ride.status === 'active' ? 'bg-green-100 text-green-700' :
                    ride.status === 'full' ? 'bg-blue-100 text-blue-700' :
                    ride.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {ride.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRide(ride);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {(ride.status === 'active' || ride.status === 'full') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRide(ride);
                          setIsCancelDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ride Details</DialogTitle>
            <DialogDescription>Ride offer information</DialogDescription>
          </DialogHeader>
          {selectedRide && (
            <div className="py-4 space-y-3">
              <div>
                <Label className="text-sm text-gray-600">Driver</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedRide.driver}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">From</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.from}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">To</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.to}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.date}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Time</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.time}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Available Seats</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.seats}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Requests</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedRide.requests}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedRide.status}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Ride</DialogTitle>
            <DialogDescription>Cancel ride offer by {selectedRide?.driver}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will cancel the ride offer and notify all passengers who have requested this ride.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>Close</Button>
            <Button variant="destructive" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Ride
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}