import React, { useState } from 'react';
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
import { Car, MapPin, Clock, Users, Plus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function OfferRide() {
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    seats: '3',
    notes: '',
  });

  const myOffers = [
    { id: '1', from: 'Downtown', to: 'Tech Park HQ', date: '2026-02-19', time: '08:00 AM', seats: 3, requests: 2, status: 'active' },
    { id: '2', from: 'Downtown', to: 'Tech Park HQ', date: '2026-02-18', time: '08:00 AM', seats: 3, requests: 3, status: 'completed' },
  ];

  const handleOfferRide = () => {
    toast.success('Ride offer created successfully!');
    setIsOfferDialogOpen(false);
    setFormData({ from: '', to: '', date: '', time: '', seats: '3', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer a Ride</h1>
          <p className="text-gray-600 mt-1">
            Share your commute and help reduce emissions
          </p>
        </div>
        <Button onClick={() => setIsOfferDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ride Offer
        </Button>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full inline-block mb-3">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-900 mb-2">Reduce Emissions</h3>
            <p className="text-sm text-blue-700">Help lower your company's carbon footprint</p>
          </div>
        </Card>
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full inline-block mb-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Build Community</h3>
            <p className="text-sm text-green-700">Connect with colleagues on your route</p>
          </div>
        </Card>
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full inline-block mb-3">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-purple-900 mb-2">Earn Rewards</h3>
            <p className="text-sm text-purple-700">Get points for each successful carpool</p>
          </div>
        </Card>
      </div>

      {/* My Offers */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">My Ride Offers</h3>
        <div className="space-y-3">
          {myOffers.map((offer) => (
            <div key={offer.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={
                      offer.status === 'active' ? 'bg-green-100 text-green-700' :
                      offer.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }>
                      {offer.status}
                    </Badge>
                    <span className="text-sm text-gray-600">{offer.date} at {offer.time}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">From: </span>
                        <span className="font-medium text-gray-900">{offer.from}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">To: </span>
                        <span className="font-medium text-gray-900">{offer.to}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-600">Requests: </span>
                        <span className="font-medium text-gray-900">{offer.requests}/{offer.seats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Tips for Offering Rides</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Post in Advance</p>
              <p className="text-sm text-gray-600">Share your ride at least a day before to get more requests</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Be Punctual</p>
              <p className="text-sm text-gray-600">Arrive on time to build trust with your passengers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Communicate</p>
              <p className="text-sm text-gray-600">Keep passengers informed of any changes or delays</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Safety First</p>
              <p className="text-sm text-gray-600">Follow all traffic rules and maintain a clean vehicle</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Offer Ride Dialog */}
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
                <Input
                  id="from"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  placeholder="Start location"
                />
              </div>
              <div>
                <Label htmlFor="to">To *</Label>
                <Select value={formData.to} onValueChange={(val) => setFormData({ ...formData, to: val })}>
                  <SelectTrigger id="to">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech-park-hq">Tech Park HQ</SelectItem>
                    <SelectItem value="downtown-office">Downtown Office</SelectItem>
                    <SelectItem value="east-campus">East Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="seats">Available Seats *</Label>
              <Select value={formData.seats} onValueChange={(val) => setFormData({ ...formData, seats: val })}>
                <SelectTrigger id="seats">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Seat</SelectItem>
                  <SelectItem value="2">2 Seats</SelectItem>
                  <SelectItem value="3">3 Seats</SelectItem>
                  <SelectItem value="4">4 Seats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any special instructions or preferences..."
                rows={3}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> You'll receive notifications when colleagues request to join your ride.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleOfferRide}
              disabled={!formData.from || !formData.to || !formData.date || !formData.time}
            >
              <Plus className="h-4 w-4 mr-2" />
              Offer Ride
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
