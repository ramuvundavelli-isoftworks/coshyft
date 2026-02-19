import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
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
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Plus, TrendingDown, DollarSign, Calendar, User, AlertCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { mockInitiatives } from '../data/mockData';
import { Initiative } from '../types';
import { toast } from 'sonner';

export default function InitiativeTracker() {
  const [initiatives, setInitiatives] = useState<Initiative[]>(mockInitiatives);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    budget: '',
    expectedReduction: '',
    actualReduction: '',
    startDate: '',
    endDate: '',
    status: 'draft' as Initiative['status'],
  });

  const activeInitiatives = initiatives.filter(i => i.status === 'active');
  const totalBudget = initiatives.reduce((sum, i) => sum + i.budget, 0);
  const totalExpectedReduction = initiatives.reduce((sum, i) => sum + i.expectedReduction, 0);
  const totalActualReduction = initiatives.reduce((sum, i) => sum + i.actualReduction, 0);

  const statusColors = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved: 'bg-blue-50 text-blue-700 border-blue-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const handleCreateInitiative = () => {
    const newInitiative: Initiative = {
      id: `initiative-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      owner: formData.owner,
      budget: parseFloat(formData.budget),
      expectedReduction: parseFloat(formData.expectedReduction),
      actualReduction: parseFloat(formData.actualReduction),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };
    setInitiatives([...initiatives, newInitiative]);
    setIsCreateDialogOpen(false);
    toast.success('Initiative created successfully!');
  };

  const handleEditInitiative = () => {
    if (selectedInitiative) {
      const updatedInitiatives = initiatives.map(i =>
        i.id === selectedInitiative.id ? {
          ...i,
          name: formData.name,
          description: formData.description,
          owner: formData.owner,
          budget: parseFloat(formData.budget),
          expectedReduction: parseFloat(formData.expectedReduction),
          actualReduction: parseFloat(formData.actualReduction),
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
        } : i
      );
      setInitiatives(updatedInitiatives);
      setIsEditDialogOpen(false);
      toast.success('Initiative updated successfully!');
    }
  };

  const handleDeleteInitiative = () => {
    if (selectedInitiative) {
      const updatedInitiatives = initiatives.filter(i => i.id !== selectedInitiative.id);
      setInitiatives(updatedInitiatives);
      setIsDeleteDialogOpen(false);
      toast.success('Initiative deleted successfully!');
    }
  };

  const handleCloseInitiative = () => {
    if (selectedInitiative) {
      const updatedInitiatives = initiatives.map(i =>
        i.id === selectedInitiative.id ? {
          ...i,
          status: 'completed',
        } : i
      );
      setInitiatives(updatedInitiatives);
      setIsCloseDialogOpen(false);
      toast.success('Initiative closed successfully!');
    }
  };

  const handleSelectInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setFormData({
      name: initiative.name,
      description: initiative.description,
      owner: initiative.owner,
      budget: initiative.budget.toString(),
      expectedReduction: initiative.expectedReduction.toString(),
      actualReduction: initiative.actualReduction.toString(),
      startDate: initiative.startDate,
      endDate: initiative.endDate,
      status: initiative.status,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Initiative Tracker</h1>
          <p className="text-gray-600 mt-1">
            Track reduction initiatives with budget and approval workflow
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Initiative
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Initiative</DialogTitle>
              <DialogDescription>
                Define a new reduction initiative for approval
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Initiative Name *</Label>
                  <Input id="name" placeholder="e.g., EV Charging Infrastructure" />
                </div>
                <div>
                  <Label htmlFor="owner">Owner *</Label>
                  <Select>
                    <SelectTrigger id="owner">
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the initiative objectives and approach"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($) *</Label>
                  <Input id="budget" type="number" placeholder="500000" />
                </div>
                <div>
                  <Label htmlFor="reduction">Expected Reduction (tCO₂e) *</Label>
                  <Input id="reduction" type="number" placeholder="85" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Start Date *</Label>
                  <Input id="start" type="date" />
                </div>
                <div>
                  <Label htmlFor="end">End Date *</Label>
                  <Input id="end" type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInitiative}>
                Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Initiatives</p>
              <p className="text-2xl font-bold text-gray-900">{activeInitiatives.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${(totalBudget / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expected Reduction</p>
              <p className="text-2xl font-bold text-gray-900">{totalExpectedReduction} tCO₂e</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Actual vs Expected</p>
              <p className="text-2xl font-bold text-gray-900">
                {((totalActualReduction / totalExpectedReduction) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Initiatives Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Initiatives</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Initiative Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Expected (tCO₂e)</TableHead>
              <TableHead className="text-right">Actual (tCO₂e)</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initiatives.map((initiative) => {
              const progressPercent = initiative.expectedReduction > 0 
                ? (initiative.actualReduction / initiative.expectedReduction) * 100 
                : 0;
              const isOnTrack = progressPercent >= 80;
              const gap = initiative.expectedReduction - initiative.actualReduction;

              return (
                <TableRow key={initiative.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{initiative.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{initiative.owner}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${(initiative.budget / 1000).toFixed(0)}K
                  </TableCell>
                  <TableCell className="text-right">{initiative.expectedReduction}</TableCell>
                  <TableCell className="text-right font-medium text-green-600">
                    {initiative.actualReduction}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm font-medium">{progressPercent.toFixed(0)}%</span>
                        <Badge
                          variant={isOnTrack ? 'outline' : 'secondary'}
                          className={isOnTrack ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                        >
                          {isOnTrack ? 'On Track' : `Gap: ${gap}`}
                        </Badge>
                      </div>
                      <Progress value={progressPercent} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[initiative.status]}>
                      {initiative.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleSelectInitiative(initiative);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInitiative(initiative);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {initiative.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInitiative(initiative);
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

      {/* At-Risk Initiatives */}
      {initiatives.filter(i => i.actualReduction / i.expectedReduction < 0.8 && i.status === 'active').length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">At-Risk Initiatives Require Attention</h3>
              <div className="space-y-2">
                {initiatives
                  .filter(i => i.actualReduction / i.expectedReduction < 0.8 && i.status === 'active')
                  .map(initiative => (
                    <div key={initiative.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{initiative.name}</p>
                        <p className="text-sm text-gray-600">
                          {initiative.actualReduction} / {initiative.expectedReduction} tCO₂e achieved
                        </p>
                      </div>
                      <Button size="sm">Review</Button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Initiative
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Initiative</DialogTitle>
            <DialogDescription>
              Update the details of the initiative
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Initiative Name *</Label>
                <Input id="name" placeholder="e.g., EV Charging Infrastructure" />
              </div>
              <div>
                <Label htmlFor="owner">Owner *</Label>
                <Select>
                  <SelectTrigger id="owner">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facilities">Facilities</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the initiative objectives and approach"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget ($) *</Label>
                <Input id="budget" type="number" placeholder="500000" />
              </div>
              <div>
                <Label htmlFor="reduction">Expected Reduction (tCO₂e) *</Label>
                <Input id="reduction" type="number" placeholder="85" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start Date *</Label>
                <Input id="start" type="date" />
              </div>
              <div>
                <Label htmlFor="end">End Date *</Label>
                <Input id="end" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditInitiative}>
              Update Initiative
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Initiative
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Delete Initiative</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this initiative?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteInitiative}>
              Delete Initiative
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Dialog */}
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Close Initiative
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Close Initiative</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this initiative?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseInitiative}>
              Close Initiative
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}