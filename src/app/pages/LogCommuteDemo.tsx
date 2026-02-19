import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';
import { Plus, Calendar, Car, TrendingDown } from 'lucide-react';

export default function LogCommuteDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commuteEntries, setCommuteEntries] = useState<CommuteEntry[]>([]);

  const handleSubmit = (entry: CommuteEntry) => {
    setCommuteEntries(prev => [...prev, entry]);
    console.log('New commute entry:', entry);
    // Here you would save to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Log Commute - Feature Demo
          </h1>
          <p className="text-gray-600">
            Click the button below to open the Log Commute modal and test all features
          </p>
        </div>

        {/* CTA Card */}
        <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to log your commute?</h2>
              <p className="text-green-50 mb-4">
                Track your daily commute and contribute to Scope 3 Category 7 reporting
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-green-600 hover:bg-green-50"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Log Commute
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Logged Entries</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{commuteEntries.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Car className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Total Distance</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {commuteEntries.reduce((sum, e) => sum + e.distance, 0).toFixed(1)} km
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Total Emissions</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {commuteEntries.reduce((sum, e) => sum + e.emissions, 0).toFixed(2)} kg
            </p>
          </Card>
        </div>

        {/* Entries List */}
        {commuteEntries.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
            <div className="space-y-3">
              {commuteEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{entry.mode}</p>
                      <p className="text-sm text-gray-600">
                        {entry.date} • {entry.distance} km • {entry.officeLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {entry.emissions.toFixed(2)} kg CO₂
                      </p>
                      {entry.savedEmissions && (
                        <p className="text-sm text-green-600">
                          Saved {entry.savedEmissions.toFixed(2)} kg
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Feature List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ✅ Implemented Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Multi-step wizard</p>
                <p className="text-xs text-gray-600">5 steps with smart progression</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">13 Transport modes</p>
                <p className="text-xs text-gray-600">Zero, Low, Medium emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Smart distance input</p>
                <p className="text-xs text-gray-600">Manual OR auto-calculate via map</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Carpool optimization</p>
                <p className="text-xs text-gray-600">Calculate saved emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Data transparency</p>
                <p className="text-xs text-gray-600">Show factor source & calculation</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Validation rules</p>
                <p className="text-xs text-gray-600">Duplicate detection, date checks</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Scope 3 messaging</p>
                <p className="text-xs text-gray-600">CSRD/ESRS E1 compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <div>
                <p className="font-medium text-sm text-gray-900">Edge case handling</p>
                <p className="text-xs text-gray-600">Warnings for unusual data</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <LogCommuteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        existingEntries={commuteEntries}
      />
    </div>
  );
}
