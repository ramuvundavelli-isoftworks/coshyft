import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Gift,
  Bike,
  Bus,
  Zap,
  Home,
  Info,
  TrendingUp,
  Users,
  Euro,
  FileText,
  CheckCircle,
  Plus,
  Filter,
} from 'lucide-react';
import { irishWorkplaceBenefits } from '../data/mockData';
import { IrishWorkplaceBenefit } from '../types';
import { formatCurrency, formatPercentage } from '../utils/localization';
import { toast } from 'sonner';

const categoryIcons = {
  'bike-to-work': Bike,
  'taxsaver': Bus,
  'ev-incentive': Zap,
  'remote-work': Home,
};

const categoryColors = {
  'bike-to-work': 'bg-green-100 text-green-700 border-green-200',
  'taxsaver': 'bg-blue-100 text-blue-700 border-blue-200',
  'ev-incentive': 'bg-purple-100 text-purple-700 border-purple-200',
  'remote-work': 'bg-orange-100 text-orange-700 border-orange-200',
};

export default function AdminWorkplaceBenefits() {
  const [benefits, setBenefits] = useState<IrishWorkplaceBenefit[]>(irishWorkplaceBenefits);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBenefit, setSelectedBenefit] = useState<IrishWorkplaceBenefit | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImpactDialogOpen, setIsImpactDialogOpen] = useState(false);

  const filteredBenefits = selectedCategory === 'all'
    ? benefits
    : benefits.filter(b => b.category === selectedCategory);

  const handleViewDetails = (benefit: IrishWorkplaceBenefit) => {
    setSelectedBenefit(benefit);
    setIsDetailsDialogOpen(true);
  };

  const handleViewImpact = (benefit: IrishWorkplaceBenefit) => {
    setSelectedBenefit(benefit);
    setIsImpactDialogOpen(true);
  };

  // Mock statistics
  const stats = {
    totalBenefits: benefits.length,
    activeParticipants: 347,
    totalSavings: 89420, // EUR
    co2Reduced: 42.5, // tonnes
  };

  const categoryStats = [
    { category: 'bike-to-work', participants: 127, savings: 34200, co2Saved: 18.2 },
    { category: 'taxsaver', participants: 182, savings: 41300, co2Saved: 22.8 },
    { category: 'ev-incentive', participants: 24, savings: 12400, co2Saved: 1.5 },
    { category: 'remote-work', participants: 14, savings: 1520, co2Saved: 0 },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Irish Workplace Benefits</h1>
          <p className="text-gray-600 mt-1">
            Tax-efficient schemes to incentivize sustainable commuting
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Benefit
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Benefits</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBenefits}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeParticipants}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tax Savings (Annual)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalSavings, 'EUR', 'en-IE')}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <Euro className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">CO₂ Reduced</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.co2Reduced} <span className="text-lg">tonnes</span>
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Content */}
      <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Benefits</TabsTrigger>
              <TabsTrigger value="bike-to-work">
                <Bike className="h-4 w-4 mr-2" />
                Bike-to-Work
              </TabsTrigger>
              <TabsTrigger value="taxsaver">
                <Bus className="h-4 w-4 mr-2" />
                TaxSaver
              </TabsTrigger>
              <TabsTrigger value="ev-incentive">
                <Zap className="h-4 w-4 mr-2" />
                EV Incentives
              </TabsTrigger>
              <TabsTrigger value="remote-work">
                <Home className="h-4 w-4 mr-2" />
                Remote Work
              </TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Info className="h-3 w-3 mr-1" />
              Irish Revenue Approved
            </Badge>
          </div>

          <TabsContent value={selectedCategory} className="mt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benefit Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tax Relief</TableHead>
                  <TableHead>Max Amount</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBenefits.map((benefit, idx) => {
                  const Icon = categoryIcons[benefit.category];
                  const stats = categoryStats.find(s => s.category === benefit.category);
                  
                  return (
                    <TableRow key={benefit.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${categoryColors[benefit.category]}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{benefit.name}</p>
                            <p className="text-sm text-gray-600 max-w-md truncate">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={categoryColors[benefit.category]}>
                          {benefit.category.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {benefit.taxRelief ? formatPercentage(benefit.taxRelief * 100, 'en-IE', 0) : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">
                          {benefit.maxAmount
                            ? benefit.category === 'remote-work'
                              ? `${formatCurrency(benefit.maxAmount, 'EUR', 'en-IE')}/day`
                              : formatCurrency(benefit.maxAmount, 'EUR', 'en-IE')
                            : 'Variable'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900">{stats?.participants || 0}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={benefit.status === 'active' ? 'default' : 'secondary'}
                          className={
                            benefit.status === 'active'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : ''
                          }
                        >
                          {benefit.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(benefit)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewImpact(benefit)}
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Impact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Category Performance */}
      <Card className="p-6 bg-white/40 backdrop-blur-sm border border-gray-200/50">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Benefit Category Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryStats.map((stat) => {
            const category = stat.category as keyof typeof categoryIcons;
            const Icon = categoryIcons[category];
            return (
              <Card key={stat.category} className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${categoryColors[category]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-medium text-gray-900 capitalize">
                    {stat.category.replace('-', ' ')}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Participants:</span>
                    <span className="font-semibold text-gray-900">{stat.participants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tax Savings:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(stat.savings, 'EUR', 'en-IE')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CO₂ Saved:</span>
                    <span className="font-semibold text-blue-600">{stat.co2Saved}t</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedBenefit && (
                <>
                  <div className={`p-2 rounded-lg ${categoryColors[selectedBenefit.category]}`}>
                    {React.createElement(categoryIcons[selectedBenefit.category], {
                      className: 'h-5 w-5',
                    })}
                  </div>
                  {selectedBenefit.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>Comprehensive benefit details and compliance requirements</DialogDescription>
          </DialogHeader>

          {selectedBenefit && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-gray-900">Description</Label>
                <p className="text-gray-700 mt-2">{selectedBenefit.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Category</Label>
                  <Badge variant="outline" className={`mt-2 ${categoryColors[selectedBenefit.category]}`}>
                    {selectedBenefit.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Region</Label>
                  <p className="font-medium text-gray-900 mt-2">🇮🇪 Ireland</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Tax Relief</Label>
                  <p className="font-semibold text-green-600 mt-2 text-lg">
                    {selectedBenefit.taxRelief ? formatPercentage(selectedBenefit.taxRelief * 100, 'en-IE', 0) : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Maximum Amount</Label>
                  <p className="font-semibold text-gray-900 mt-2 text-lg">
                    {selectedBenefit.maxAmount
                      ? formatCurrency(selectedBenefit.maxAmount, 'EUR', 'en-IE')
                      : 'Variable'}
                  </p>
                </div>
              </div>

              {selectedBenefit.eligibleModes && (
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-2 block">Eligible Transport Modes</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBenefit.eligibleModes.map((mode) => (
                      <Badge key={mode} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-semibold text-gray-900">Compliance & Documentation</Label>
                <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    {selectedBenefit.complianceRequired ? (
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    ) : (
                      <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    )}
                    <p className="text-sm text-amber-900">{selectedBenefit.documentation}</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-900">Status</Label>
                <Badge
                  className={`mt-2 ${
                    selectedBenefit.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {selectedBenefit.status}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => toast.success('Benefit enabled for employees')}>
              Enable for All Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impact Dialog */}
      <Dialog open={isImpactDialogOpen} onOpenChange={setIsImpactDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Benefit Impact Analysis</DialogTitle>
            <DialogDescription>
              Environmental and financial impact of {selectedBenefit?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedBenefit && (
            <div className="space-y-6">
              {/* Impact metrics would go here */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-gray-600">CO₂ Reduced</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">
                    {categoryStats.find(s => s.category === selectedBenefit.category)?.co2Saved || 0}t
                  </p>
                </Card>
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-gray-600">Tax Savings</p>
                  <p className="text-2xl font-bold text-blue-700 mt-2">
                    {formatCurrency(
                      categoryStats.find(s => s.category === selectedBenefit.category)?.savings || 0,
                      'EUR',
                      'en-IE'
                    )}
                  </p>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="text-2xl font-bold text-purple-700 mt-2">
                    {categoryStats.find(s => s.category === selectedBenefit.category)?.participants || 0}
                  </p>
                </Card>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">CSRD/ESRS E1 Contribution</h3>
                <p className="text-sm text-gray-700">
                  This benefit contributes to Scope 3 Category 7 (Employee Commuting) emissions reduction
                  targets and supports your CSRD disclosure requirements under ESRS E1-6.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImpactDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Impact Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
