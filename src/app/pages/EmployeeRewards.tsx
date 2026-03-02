import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Award, Trophy, Star, Gift, TrendingUp, Download, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { gamificationApi } from '../api';

const achievements = [
  { id: 'a1', title: 'First Carpool', description: 'Completed your first carpool', points: 50, unlocked: true, date: '15/01/2026' },
  { id: 'a2', title: 'Week Warrior', description: 'Carpooled every day for a week', points: 200, unlocked: true, date: '01/02/2026' },
  { id: 'a3', title: 'Month Master', description: 'Carpooled 20+ times in a month', points: 500, unlocked: false, progress: 15 },
  { id: 'a4', title: 'Carbon Saver', description: 'Saved 100 kg of CO₂', points: 300, unlocked: true, date: '10/02/2026' },
  { id: 'a5', title: 'Green Champion', description: 'Saved 500 kg of CO₂', points: 1000, unlocked: false, progress: 245 },
  { id: 'a6', title: 'Public Transit Pro', description: 'Used public transport 50 times', points: 400, unlocked: false, progress: 32 },
];

const mockRewards = [
  { id: 'r1', name: 'Gift Card', points: 500, available: true, description: '€25 retailer voucher' },
  { id: 'r2', name: 'Extra PTO Day', points: 1000, available: true, description: '1 additional leave day' },
  { id: 'r3', name: 'Reserved Parking Spot', points: 750, available: true, description: '1 month priority parking' },
  { id: 'r4', name: 'Company Merchandise', points: 250, available: true, description: 'CoShift branded items' },
  { id: 'r5', name: 'Bike Maintenance Voucher', points: 600, available: true, description: '€50 bike service' },
  { id: 'r6', name: 'Charity Donation', points: 300, available: true, description: 'Donate to green cause' },
];

const leaderboard = [
  { rank: 1, name: 'Sarah Johnson', points: 2450, trips: 45, department: 'Engineering' },
  { rank: 2, name: 'Mike Chen', points: 2180, trips: 42, department: 'Product' },
  { rank: 3, name: 'You', points: 1850, trips: 35, department: 'Marketing' },
  { rank: 4, name: 'Emily Davis', points: 1720, trips: 33, department: 'Sales' },
  { rank: 5, name: 'David Wilson', points: 1580, trips: 30, department: 'Operations' },
];

export default function EmployeeRewards() {
  const [isRedeemDialogOpen, setIsRedeemDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [pointsBalance, setPointsBalance] = useState(1850);
  const [redeemedRewards, setRedeemedRewards] = useState<string[]>([]);

  // API hooks
  const redeemMutation = useApiMutation((data: { points: number; reward_type: string }) =>
    gamificationApi.redeemPoints(data)
  );

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const handleRedeem = async () => {
    if (!selectedReward) return;

    const previousBalance = pointsBalance;

    // Optimistic update
    setPointsBalance((prev) => prev - selectedReward.points);
    setRedeemedRewards((prev) => [...prev, selectedReward.id]);
    setIsRedeemDialogOpen(false);

    const result = await redeemMutation.execute({
      points: selectedReward.points,
      reward_type: selectedReward.id,
    });

    if (result.success) {
      toast.success(`Redeemed ${selectedReward.name}!`, {
        description: `${selectedReward.points} OxyPoints deducted. Remaining: ${previousBalance - selectedReward.points}`,
      });
    } else {
      // Rollback on failure
      setPointsBalance(previousBalance);
      setRedeemedRewards((prev) => prev.filter((id) => id !== selectedReward.id));
      toast.error(result.error?.message || 'Failed to redeem reward. Please try again.');
    }
  };

  const handleExport = () => {
    toast.success('Exporting rewards history...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#101828]">Rewards & Achievements</h1>
          <p className="text-[#4a5565] mt-1">
            Track your progress and redeem rewards
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export History
        </Button>
      </div>

      {/* Points Summary - Subtle Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#00bc7d] rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#6a7282]">Total OxyPoints</p>
              <p className="text-3xl font-bold text-[#101828]">{pointsBalance.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-700">Achievements</p>
              <p className="text-3xl font-bold text-green-900">{unlockedAchievements}/{achievements.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-700">Leaderboard Rank</p>
              <p className="text-3xl font-bold text-blue-900">#3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#101828]">Your Achievements</h3>
          <Badge variant="outline" className="bg-gray-50">
            {unlockedAchievements} of {achievements.length} unlocked
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 border-2 rounded-lg transition-all ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:shadow-md' 
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-green-600' : 'bg-gray-300'}`}>
                  {achievement.unlocked ? (
                    <Award className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-[#101828]' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <Badge variant="outline" className={achievement.unlocked ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600'}>
                      {achievement.points}
                    </Badge>
                  </div>
                  <p className={`text-xs ${achievement.unlocked ? 'text-[#4a5565]' : 'text-gray-500'}`}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <p className="text-xs text-green-700 mt-2 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Unlocked {achievement.date}
                    </p>
                  ) : (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}/{achievement.id === 'a3' ? 20 : achievement.id === 'a5' ? 500 : 50}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#00bc7d] h-2 rounded-full transition-all"
                          style={{ width: `${(achievement.progress! / (achievement.id === 'a3' ? 20 : achievement.id === 'a5' ? 500 : 50)) * 100}%` }}
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#101828]">Redeem Rewards</h3>
          <p className="text-sm text-[#6a7282]">
            You have <strong className="text-[#00bc7d]">{pointsBalance}</strong> OxyPoints to spend
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockRewards.map((reward) => {
            const canAfford = pointsBalance >= reward.points;
            return (
              <div 
                key={reward.id} 
                className={`p-4 border-2 rounded-lg transition-all ${
                  canAfford 
                    ? 'border-gray-200 hover:border-[#00bc7d] hover:shadow-md bg-white' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${canAfford ? 'bg-[#00bc7d]' : 'bg-gray-300'}`}>
                    <Gift className={`h-6 w-6 ${canAfford ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-[#101828] mb-1">{reward.name}</h4>
                    <p className="text-xs text-[#6a7282] mb-3">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={canAfford ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600'}>
                        {reward.points} OxyPoints
                      </Badge>
                      <Button
                        size="sm"
                        disabled={!canAfford}
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
            );
          })}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#101828]">Company Leaderboard</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Top 5
          </Badge>
        </div>
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`p-4 rounded-lg flex items-center justify-between transition-all ${
                entry.name === 'You' 
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900' :
                  entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                  entry.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {entry.rank}
                </div>
                <div>
                  <p className={`font-semibold ${entry.name === 'You' ? 'text-blue-900' : 'text-[#101828]'}`}>
                    {entry.name}
                  </p>
                  <p className="text-sm text-[#6a7282]">{entry.department} · {entry.trips} trips</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-[#101828]">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-[#6a7282]">OxyPoints</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Redeem Dialog */}
      <Dialog open={isRedeemDialogOpen} onOpenChange={setIsRedeemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Reward Redemption</DialogTitle>
            <DialogDescription>Review your reward details before redeeming</DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="py-4 space-y-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900 mb-1">
                  <strong>Reward:</strong> {selectedReward.name}
                </p>
                <p className="text-sm text-green-900 mb-1">
                  <strong>Description:</strong> {selectedReward.description}
                </p>
                <p className="text-sm text-green-900">
                  <strong>Cost:</strong> {selectedReward.points} points
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 mb-1">
                  <strong>Current Balance:</strong> {pointsBalance.toLocaleString()} points
                </p>
                <p className="text-sm text-blue-900">
                  <strong>After Redemption:</strong> {(pointsBalance - selectedReward.points).toLocaleString()} points
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRedeemDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRedeem} disabled={redeemMutation.loading}>
              <Gift className="h-4 w-4 mr-2" />
              {redeemMutation.loading ? 'Redeeming...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Rewards History</DialogTitle>
            <DialogDescription>Download your complete points and achievements history</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-[#101828] font-semibold mb-3">Export includes:</p>
              <ul className="text-sm text-[#4a5565] space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00bc7d] rounded-full"></div>
                  Points earned history with dates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00bc7d] rounded-full"></div>
                  All unlocked achievements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00bc7d] rounded-full"></div>
                  Redeemed rewards record
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#00bc7d] rounded-full"></div>
                  Leaderboard position tracking
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}