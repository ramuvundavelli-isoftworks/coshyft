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
import { KPICard } from '../components/KPICard';
import { 
  TrendingDown, 
  Award, 
  MapPin, 
  Calendar,
  Info,
  Download,
  Filter,
  TrendingUp,
  DollarSign,
  TreeDeciduous,
  Car,
  Home,
  Fuel,
  Share2,
  Mail,
  Link,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

const monthlyTrend = [
  { month: 'Sep', emissions: 45.2, saved: 8.5, baseline: 53.7 },
  { month: 'Oct', emissions: 42.1, saved: 11.6, baseline: 53.7 },
  { month: 'Nov', emissions: 39.8, saved: 13.9, baseline: 53.7 },
  { month: 'Dec', emissions: 38.2, saved: 15.5, baseline: 53.7 },
  { month: 'Jan', emissions: 35.7, saved: 18.0, baseline: 53.7 },
  { month: 'Feb', emissions: 32.4, saved: 21.3, baseline: 53.7 },
];

const modeDistribution = [
  { mode: 'Carpool', count: 48, co2: 125.6, percentage: 66.7, color: '#3b82f6' },
  { mode: 'SOV', count: 12, co2: 48.3, percentage: 16.7, color: '#ef4444' },
  { mode: 'Public Transit', count: 8, co2: 12.1, percentage: 11.1, color: '#10b981' },
  { mode: 'Bike/Walk', count: 4, co2: 0, percentage: 5.5, color: '#22c55e' },
];

const weeklyPattern = [
  { day: 'Mon', trips: 4, co2: 5.2, distance: 48 },
  { day: 'Tue', trips: 4, co2: 5.2, distance: 48 },
  { day: 'Wed', trips: 3, co2: 3.8, distance: 36 },
  { day: 'Thu', trips: 4, co2: 5.2, distance: 48 },
  { day: 'Fri', trips: 3, co2: 2.9, distance: 36 },
];

const peerComparison = [
  { category: 'Your Emissions', value: 32.4, color: '#3b82f6' },
  { category: 'Dept Average', value: 45.6, color: '#94a3b8' },
  { category: 'Company Average', value: 52.3, color: '#cbd5e1' },
];

export default function MyImpact() {
  const [dateRange, setDateRange] = useState('6m');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  const achievements = [
    { id: 1, title: 'Carbon Reducer', description: 'Saved 100kg CO₂', icon: TrendingDown, color: 'green', unlocked: true, date: '2026-01-15' },
    { id: 2, title: 'Carpooler Pro', description: '50 carpool trips', icon: Car, color: 'blue', unlocked: true, date: '2026-02-01' },
    { id: 3, title: 'Public Transit Champion', description: '25 transit trips', icon: MapPin, color: 'purple', unlocked: true, date: '2026-01-22' },
    { id: 4, title: 'Eco Warrior', description: 'Save 500kg CO₂', icon: TreeDeciduous, color: 'green', unlocked: false, date: null },
    { id: 5, title: 'Consistency Star', description: '30 day streak', icon: Award, color: 'yellow', unlocked: false, date: null },
  ];

  const handleShare = (platform: string) => {
    toast.success(`Sharing to ${platform}...`);
    setIsShareDialogOpen(false);
  };

  const handleExport = () => {
    toast.success(`Exporting impact report as ${exportFormat.toUpperCase()}`);
    setIsExportDialogOpen(false);
  };

  const handleDownloadCertificate = () => {
    toast.success('Downloading achievement certificate...');
    setIsCertificateDialogOpen(false);
  };

  const totalCO2Saved = 89.7;
  const totalDistance = 1248;
  const totalCostSaved = 548.20;
  const treesEquivalent = Math.round(totalCO2Saved / 22);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Impact</h1>
          <p className="text-gray-600 mt-1">
            Track your environmental contribution and achievements
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsShareDialogOpen(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Impact
          </Button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-800">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-900">{totalCO2Saved} kg</p>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-2">
            ↓ 28% vs last period
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-2xl font-bold text-gray-900">{totalDistance} km</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-600 rounded-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-800">Cost Saved</p>
              <p className="text-2xl font-bold text-yellow-900">${totalCostSaved}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <TreeDeciduous className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-800">Trees Equivalent</p>
              <p className="text-2xl font-bold text-emerald-900">{treesEquivalent} trees</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Emissions Trend */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emissions Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyTrend}>
            <defs>
              <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="baseline" stroke="#ef4444" fill="url(#colorBaseline)" name="Baseline" />
            <Area type="monotone" dataKey="emissions" stroke="#3b82f6" fill="url(#colorEmissions)" name="Actual Emissions" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Mode Distribution & Weekly Pattern */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Transport Mode Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={modeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mode, percentage }) => `${mode} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {modeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Weekly Pattern</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyPattern}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="co2" fill="#3b82f6" name="CO₂ (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Peer Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Peer Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={peerComparison} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" />
            <Tooltip />
            <Bar dataKey="value" name="kg CO₂/month">
              {peerComparison.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            🎉 You're performing <strong>29% better</strong> than the department average!
          </p>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 border rounded-lg text-center cursor-pointer hover:shadow-lg transition-all ${
                achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              onClick={() => {
                if (achievement.unlocked) {
                  setSelectedAchievement(achievement);
                  setIsCertificateDialogOpen(true);
                }
              }}
            >
              <div className={`mx-auto mb-2 w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.unlocked ? `bg-${achievement.color}-100` : 'bg-gray-200'
              }`}>
                <achievement.icon className={`h-6 w-6 ${
                  achievement.unlocked ? `text-${achievement.color}-600` : 'text-gray-400'
                }`} />
              </div>
              <p className="font-medium text-sm text-gray-900 mb-1">{achievement.title}</p>
              <p className="text-xs text-gray-600">{achievement.description}</p>
              {achievement.unlocked && (
                <Badge className="mt-2 bg-green-100 text-green-700 text-xs">Unlocked</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Share Impact Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Impact</DialogTitle>
            <DialogDescription>
              Let others know about your environmental contribution
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <TrendingDown className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">{totalCO2Saved} kg CO₂</p>
              <p className="text-sm text-green-700">saved this period</p>
            </div>

            <div>
              <Label htmlFor="share-message">Custom Message (optional)</Label>
              <Textarea
                id="share-message"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                placeholder="Add a personal message to your impact share..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Share to:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleShare('Twitter')}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" onClick={() => handleShare('LinkedIn')}>
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" onClick={() => handleShare('Facebook')}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => handleShare('Email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            <div>
              <Label>Copy Link</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input value="https://commute.company.com/impact/share/abc123" readOnly />
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success('Link copied to clipboard!');
                  }}
                >
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Report Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Impact Report</DialogTitle>
            <DialogDescription>
              Download your environmental impact summary
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Report Format *</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Report includes:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Total CO₂ emissions saved</li>
                <li>Distance traveled by mode</li>
                <li>Cost savings breakdown</li>
                <li>Monthly trends and patterns</li>
                <li>Peer comparison data</li>
                <li>Achievement summary</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Achievement Certificate Dialog */}
      <Dialog open={isCertificateDialogOpen} onOpenChange={setIsCertificateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Achievement Unlocked!</DialogTitle>
            <DialogDescription>
              Congratulations on earning this achievement
            </DialogDescription>
          </DialogHeader>
          {selectedAchievement && (
            <div className="py-4">
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg text-center">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center">
                  <selectedAchievement.icon className="h-12 w-12 text-yellow-700" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-900 mb-2">{selectedAchievement.title}</h3>
                <p className="text-yellow-700 mb-4">{selectedAchievement.description}</p>
                <Badge className="bg-green-100 text-green-700">
                  Unlocked on {selectedAchievement.date && new Date(selectedAchievement.date).toLocaleDateString()}
                </Badge>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full" onClick={handleDownloadCertificate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsCertificateDialogOpen(false);
                    setIsShareDialogOpen(true);
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCertificateDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
