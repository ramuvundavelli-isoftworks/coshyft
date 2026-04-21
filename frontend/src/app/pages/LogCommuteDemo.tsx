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
    <div className="min-h-screen bg-background-subtle p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Log Commute - Feature Demo
          </h1>
          <p className="text-muted-foreground">
            Click the button below to open the Log Commute modal and test all features
          </p>
        </div>

        {/* CTA Card */}
        <Card className="p-8 bg-gradient-to-r from-success to-success text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to log your commute?</h2>
              <p className="text-primary-foreground mb-4">
                Track your daily commute and contribute to Scope 3 Category 7 reporting
              </p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-card text-success hover:bg-success-subtle"
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
              <div className="p-2 bg-info-subtle rounded-lg">
                <Calendar className="h-5 w-5 text-info" />
              </div>
              <span className="text-sm text-muted-foreground">Logged Entries</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{commuteEntries.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning-subtle rounded-lg">
                <Car className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Total Distance</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {commuteEntries.reduce((sum, e) => sum + e.distance, 0).toFixed(1)} km
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success-subtle rounded-lg">
                <TrendingDown className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Total Emissions</span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {commuteEntries.reduce((sum, e) => sum + e.emissions, 0).toFixed(2)} kg
            </p>
          </Card>
        </div>

        {/* Entries List */}
        {commuteEntries.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Entries</h3>
            <div className="space-y-3">
              {commuteEntries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-4 bg-background-subtle rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{entry.mode}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.date} • {entry.distance} km • {entry.officeLocation}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {entry.emissions.toFixed(2)} kg CO₂
                      </p>
                      {entry.savedEmissions && (
                        <p className="text-sm text-success">
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
          <h3 className="text-lg font-semibold text-foreground mb-4">
            ✅ Implemented Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Multi-step wizard</p>
                <p className="text-xs text-muted-foreground">5 steps with smart progression</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">13 Transport modes</p>
                <p className="text-xs text-muted-foreground">Zero, Low, Medium emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Smart distance input</p>
                <p className="text-xs text-muted-foreground">Manual OR auto-calculate via map</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Carpool optimization</p>
                <p className="text-xs text-muted-foreground">Calculate saved emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Data transparency</p>
                <p className="text-xs text-muted-foreground">Show factor source & calculation</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Validation rules</p>
                <p className="text-xs text-muted-foreground">Duplicate detection, date checks</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Scope 3 messaging</p>
                <p className="text-xs text-muted-foreground">CSRD/ESRS E1 compliance</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-success">✓</span>
              <div>
                <p className="font-medium text-sm text-foreground">Edge case handling</p>
                <p className="text-xs text-muted-foreground">Warnings for unusual data</p>
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
