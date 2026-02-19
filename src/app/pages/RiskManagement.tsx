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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { AlertTriangle, Plus, TrendingUp, DollarSign, Edit, CheckCircle, Shield, X } from 'lucide-react';
import { mockRisks } from '../data/mockData';
import { Risk } from '../types';
import { toast } from 'sonner';

export default function RiskManagement() {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [isMitigationDialogOpen, setIsMitigationDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [view, setView] = useState<'table' | 'heatmap'>('table');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    likelihood: 'medium',
    impact: 'medium',
    financialExposure: '',
    owner: '',
    category: '',
  });
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const openRisks = risks.filter(r => r.status === 'open').length;
  const highImpactRisks = risks.filter(r => r.impact === 'high').length;
  const totalExposure = risks.filter(r => r.status !== 'closed').reduce((sum, r) => sum + r.financialExposure, 0);

  const riskColors = {
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  };

  const getRiskLevel = (likelihood: string, impact: string) => {
    if ((likelihood === 'high' && impact === 'high') || 
        (likelihood === 'high' && impact === 'medium') ||
        (likelihood === 'medium' && impact === 'high')) {
      return 'high';
    }
    if (likelihood === 'low' || impact === 'low') {
      return 'low';
    }
    return 'medium';
  };

  const handleCreateRisk = () => {
    const newRisk: Risk = {
      id: `risk-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      likelihood: formData.likelihood as 'low' | 'medium' | 'high',
      impact: formData.impact as 'low' | 'medium' | 'high',
      financialExposure: parseFloat(formData.financialExposure),
      owner: formData.owner,
      status: 'open',
      category: formData.category || 'operational',
      identifiedDate: new Date().toISOString(),
    };
    setRisks([...risks, newRisk]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Risk created successfully');
  };

  const handleEditRisk = () => {
    if (selectedRisk) {
      const updated = risks.map(r =>
        r.id === selectedRisk.id
          ? {
              ...r,
              title: formData.title,
              description: formData.description,
              likelihood: formData.likelihood as 'low' | 'medium' | 'high',
              impact: formData.impact as 'low' | 'medium' | 'high',
              financialExposure: parseFloat(formData.financialExposure),
              owner: formData.owner,
            }
          : r
      );
      setRisks(updated);
      setIsEditDialogOpen(false);
      toast.success('Risk updated successfully');
    }
  };

  const handleCloseRisk = () => {
    if (selectedRisk) {
      const updated = risks.map(r =>
        r.id === selectedRisk.id
          ? { ...r, status: 'closed' as const }
          : r
      );
      setRisks(updated);
      setIsCloseDialogOpen(false);
      setResolutionNotes('');
      toast.success('Risk closed successfully');
    }
  };

  const handleAddMitigation = () => {
    if (selectedRisk) {
      const updated = risks.map(r =>
        r.id === selectedRisk.id
          ? { ...r, status: 'mitigating' as const }
          : r
      );
      setRisks(updated);
      setIsMitigationDialogOpen(false);
      setMitigationPlan('');
      toast.success('Mitigation plan added');
    }
  };

  const handleUpdateAssessment = () => {
    if (selectedRisk) {
      const updated = risks.map(r =>
        r.id === selectedRisk.id
          ? {
              ...r,
              likelihood: formData.likelihood as 'low' | 'medium' | 'high',
              impact: formData.impact as 'low' | 'medium' | 'high',
              financialExposure: parseFloat(formData.financialExposure),
            }
          : r
      );
      setRisks(updated);
      setIsUpdateDialogOpen(false);
      toast.success('Risk assessment updated');
    }
  };

  const selectRisk = (risk: Risk) => {
    setSelectedRisk(risk);
    setFormData({
      title: risk.title,
      description: risk.description || '',
      likelihood: risk.likelihood,
      impact: risk.impact,
      financialExposure: risk.financialExposure.toString(),
      owner: risk.owner,
      category: risk.category || '',
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      likelihood: 'medium',
      impact: 'medium',
      financialExposure: '',
      owner: '',
      category: '',
    });
    setSelectedRisk(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Management</h1>
          <p className="text-gray-600 mt-1">
            Identify, assess, and mitigate compliance risks
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
            >
              Table
            </Button>
            <Button
              variant={view === 'heatmap' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('heatmap')}
            >
              Heatmap
            </Button>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Open Risks</p>
              <p className="text-2xl font-bold text-gray-900">{openRisks}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">High Impact</p>
              <p className="text-2xl font-bold text-gray-900">{highImpactRisks}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Financial Exposure</p>
              <p className="text-2xl font-bold text-gray-900">${(totalExposure / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Mitigated</p>
              <p className="text-2xl font-bold text-gray-900">
                {risks.filter(r => r.status === 'closed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table View */}
      {view === 'table' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Risk Register</h2>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="mitigating">Mitigating</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Title</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Financial Exposure</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {risks.map((risk) => {
                const riskLevel = getRiskLevel(risk.likelihood, risk.impact);
                const colors = riskColors[riskLevel];
                
                return (
                  <TableRow key={risk.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium max-w-xs">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>{risk.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskColors[risk.likelihood].bg}>
                        {risk.likelihood}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={riskColors[risk.impact].bg}>
                        {risk.impact}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${risk.financialExposure.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{risk.owner}</TableCell>
                    <TableCell>
                      <Badge
                        variant={risk.status === 'closed' ? 'outline' : 'default'}
                        className={risk.status === 'closed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      >
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            selectRisk(risk);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {risk.status === 'open' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedRisk(risk);
                              setIsMitigationDialogOpen(true);
                            }}
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        )}
                        {risk.status !== 'closed' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedRisk(risk);
                              setIsCloseDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Heatmap View */}
      {view === 'heatmap' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Risk Heatmap</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium text-gray-700">
              <div></div>
              <div>Low Impact</div>
              <div>Medium Impact</div>
              <div>High Impact</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center justify-end pr-4 text-sm font-medium text-gray-700">
                High Likelihood
              </div>
              <div className="aspect-square border-2 border-yellow-300 bg-yellow-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">0</span>
              </div>
              <div className="aspect-square border-2 border-red-300 bg-red-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-700">1</span>
              </div>
              <div className="aspect-square border-2 border-red-400 bg-red-200 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-800">1</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center justify-end pr-4 text-sm font-medium text-gray-700">
                Medium Likelihood
              </div>
              <div className="aspect-square border-2 border-green-300 bg-green-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-700">0</span>
              </div>
              <div className="aspect-square border-2 border-yellow-300 bg-yellow-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">0</span>
              </div>
              <div className="aspect-square border-2 border-red-300 bg-red-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-700">0</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center justify-end pr-4 text-sm font-medium text-gray-700">
                Low Likelihood
              </div>
              <div className="aspect-square border-2 border-green-300 bg-green-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-700">0</span>
              </div>
              <div className="aspect-square border-2 border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <div className="aspect-square border-2 border-yellow-300 bg-yellow-100 rounded-lg p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-700">0</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Risk level = Likelihood × Impact. High-risk items require immediate mitigation planning.
            </p>
          </div>
        </Card>
      )}

      {/* Mitigation Actions */}
      {risks.filter(r => r.status === 'open' && getRiskLevel(r.likelihood, r.impact) === 'high').length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-4">Recommended Mitigation Actions</h3>
          <div className="space-y-3">
            {risks.filter(r => r.status === 'open' && getRiskLevel(r.likelihood, r.impact) === 'high').map((risk) => (
              <div key={risk.id} className="p-4 bg-white rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{risk.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Owner: {risk.owner} • Exposure: ${risk.financialExposure.toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setSelectedRisk(risk);
                      setIsMitigationDialogOpen(true);
                    }}
                  >
                    Create Initiative
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Risk Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Risk</DialogTitle>
            <DialogDescription>
              Document a new compliance or operational risk
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Risk Title *</Label>
              <Input 
                id="title" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Data Quality Below Threshold" 
                className="mt-2" 
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the risk and potential impact"
                rows={3}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="reputational">Reputational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="owner">Risk Owner *</Label>
                <Input 
                  id="owner" 
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="e.g., Data Governance Team" 
                  className="mt-2" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likelihood">Likelihood *</Label>
                <Select 
                  value={formData.likelihood}
                  onValueChange={(value) => setFormData({ ...formData, likelihood: value })}
                >
                  <SelectTrigger id="likelihood" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="impact">Impact *</Label>
                <Select 
                  value={formData.impact}
                  onValueChange={(value) => setFormData({ ...formData, impact: value })}
                >
                  <SelectTrigger id="impact" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="exposure">Financial Exposure ($) *</Label>
              <Input 
                id="exposure" 
                type="number" 
                value={formData.financialExposure}
                onChange={(e) => setFormData({ ...formData, financialExposure: e.target.value })}
                placeholder="250000" 
                className="mt-2" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRisk}
              disabled={!formData.title || !formData.owner || !formData.financialExposure}
            >
              Create Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Risk Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Update risk details and assessment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-title">Risk Title *</Label>
              <Input 
                id="edit-title" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2" 
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-likelihood">Likelihood *</Label>
                <Select 
                  value={formData.likelihood}
                  onValueChange={(value) => setFormData({ ...formData, likelihood: value })}
                >
                  <SelectTrigger id="edit-likelihood" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-impact">Impact *</Label>
                <Select 
                  value={formData.impact}
                  onValueChange={(value) => setFormData({ ...formData, impact: value })}
                >
                  <SelectTrigger id="edit-impact" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-exposure">Financial Exposure ($) *</Label>
                <Input 
                  id="edit-exposure" 
                  type="number" 
                  value={formData.financialExposure}
                  onChange={(e) => setFormData({ ...formData, financialExposure: e.target.value })}
                  className="mt-2" 
                />
              </div>
              <div>
                <Label htmlFor="edit-owner">Risk Owner *</Label>
                <Input 
                  id="edit-owner" 
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="mt-2" 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRisk}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Risk Dialog */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Risk</DialogTitle>
            <DialogDescription>
              Mark this risk as closed and resolved
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="font-medium text-gray-900">{selectedRisk?.title}</p>
              <p className="text-sm text-gray-600 mt-1">
                Owner: {selectedRisk?.owner} • Exposure: ${selectedRisk?.financialExposure.toLocaleString()}
              </p>
            </div>
            <div>
              <Label htmlFor="resolution">Resolution Notes *</Label>
              <Textarea
                id="resolution"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe how this risk was resolved or mitigated..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCloseRisk}
              disabled={!resolutionNotes.trim()}
            >
              Close Risk
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Mitigation Dialog */}
      <Dialog open={isMitigationDialogOpen} onOpenChange={setIsMitigationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Mitigation Plan</DialogTitle>
            <DialogDescription>
              Define actions to mitigate this risk
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="font-medium text-blue-900">{selectedRisk?.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-blue-700">
                  Risk Level: <Badge variant="outline" className={riskColors[getRiskLevel(selectedRisk?.likelihood || 'medium', selectedRisk?.impact || 'medium')].bg}>
                    {getRiskLevel(selectedRisk?.likelihood || 'medium', selectedRisk?.impact || 'medium')}
                  </Badge>
                </span>
                <span className="text-blue-700">
                  Exposure: ${selectedRisk?.financialExposure.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="mitigation">Mitigation Plan *</Label>
              <Textarea
                id="mitigation"
                value={mitigationPlan}
                onChange={(e) => setMitigationPlan(e.target.value)}
                placeholder="Describe the mitigation actions, responsible parties, and timeline..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMitigationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMitigation}
              disabled={!mitigationPlan.trim()}
            >
              Add Mitigation Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Assessment Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Risk Assessment</DialogTitle>
            <DialogDescription>
              Reassess the likelihood, impact, and exposure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="update-likelihood">Likelihood *</Label>
                <Select 
                  value={formData.likelihood}
                  onValueChange={(value) => setFormData({ ...formData, likelihood: value })}
                >
                  <SelectTrigger id="update-likelihood">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="update-impact">Impact *</Label>
                <Select 
                  value={formData.impact}
                  onValueChange={(value) => setFormData({ ...formData, impact: value })}
                >
                  <SelectTrigger id="update-impact">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="update-exposure">Financial Exposure ($) *</Label>
              <Input 
                id="update-exposure" 
                type="number" 
                value={formData.financialExposure}
                onChange={(e) => setFormData({ ...formData, financialExposure: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAssessment}>
              Update Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
