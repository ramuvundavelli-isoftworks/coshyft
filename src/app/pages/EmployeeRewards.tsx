import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Award, Trophy, Star, Gift, TrendingUp, Download } from 'lucide-react';
import { toast } from 'sonner';

const achievements = [
  { id: 'a1', title: 'First Carpool', description: 'Completed your first carpool', points: 50, unlocked: true, date: '2026-01-15' },
  { id: 'a2', title: 'Week Warrior', description: 'Carpooled every day for a week', points: 200, unlocked: true, date: '2026-02-01' },
  { id: 'a3', title: 'Month Master', description: 'Carpooled 20+ times in a month', points: 500, unlocked: false, progress: 15 },
  { id: 'a4', title: 'Carbon Saver', description: 'Saved 100 kg of CO₂', points: 300, unlocked: true, date: '2026-02-10' },
];

const rewards = [
  { id: 'r1', name: 'Coffee Shop Gift Card', points: 500, available: true },
  { id: 'r2', name: 'Extra PTO Day', points: 1000, available: true },
  { id: 'r3', name: 'Reserved Parking Spot', points: 750, available: true },
  { id: 'r4', name: 'Company Merchandise', points: 250, available: true },
];

const leaderboard = [
  { rank: 1, name: 'Sarah Johnson', points: 2450, trips: 45 },
  { rank: 2, name: 'Mike Chen', points: 2180, trips: 42 },
  { rank: 3, name: 'You', points: 1850, trips: 35 },
  { rank: 4, name: 'Emily Davis', points: 1720, trips: 33 },
  { rank: 5, name: 'David Wilson', points: 1580, trips: 30 },
];

export default function EmployeeRewards() {
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  const myPoints = 1850;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const handleRedeem = () => {
    toast.success(`Redeemed ${selectedReward?.name}!`);
    setIsRedeemDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting rewards history...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards & Achievements</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and redeem rewards
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Points</p>
              <p className="text-3xl font-bold">{myPoints}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Achievements</p>
              <p className="text-3xl font-bold">{unlockedAchievements}/{achievements.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Leaderboard Rank</p>
              <p className="text-3xl font-bold">#3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 border rounded-lg ${
                achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-yellow-200' : 'bg-gray-200'}`}>
                  <Award className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <Badge className={achievement.unlocked ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'}>
                      {achievement.points} pts
                    </Badge>
                  </div>
                  <p className={`text-sm ${achievement.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <p className="text-xs text-yellow-700 mt-2">Unlocked on {achievement.date}</p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(achievement.progress! / 20) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rewards Catalog */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Redeem Rewards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gift className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{reward.name}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <Badge className="bg-purple-100 text-purple-700">{reward.points} points</Badge>
                    <Button
                      size="sm"
                      disabled={myPoints < reward.points}
                      onClick={() => {
                        setSelectedReward(reward);
                        setIsRedeemDialogOpen(true);
                      }}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Leaderboard</h3>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-lg flex items-center justify-between ${
                entry.name === 'You' ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  entry.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                  entry.rank === 2 ? 'bg-gray-300 text-gray-700' :
                  entry.rank === 3 ? 'bg-orange-400 text-orange-900' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p className={`font-medium ${entry.name === 'You' ? 'text-blue-900' : 'text-gray-900'}`}>
                    {entry.name}
                  </p>
                  <p className="text-sm text-gray-600">{entry.trips} trips</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.points}</p>
                <p className="text-xs text-gray-600">points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Redeem Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>Confirm reward redemption</DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="py-4">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
                <p className="text-sm text-purple-900 mb-2">
                  <strong>Reward:</strong> {selectedReward.name}
                </p>
                <p className="text-sm text-purple-900">
                  <strong>Cost:</strong> {selectedReward.points} points
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Your Balance:</strong> {myPoints} points
                </p>
                <p className="text-sm text-blue-900">
                  <strong>After Redemption:</strong> {myPoints - selectedReward.points} points
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRedeem}>
              <Gift className="h-4 w-4 mr-2" />
              Redeem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Rewards History</DialogTitle>
            <DialogDescription>Download your points and redemption history</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Points earned history</li>
                <li>Unlocked achievements</li>
                <li>Redeemed rewards</li>
                <li>Leaderboard position</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
