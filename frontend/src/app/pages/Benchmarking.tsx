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
import { Plus, TrendingUp, TrendingDown, Building2, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface PeerCompany {
  id: string;
  name: string;
  industry: string;
  employees: number;
  emissionsPerEmployee: number;
  dataSource: string;
  lastUpdated: string;
}

const mockPeers: PeerCompany[] = [
  // Irish Companies
  {
    id: 'peer_ie_1',
    name: 'CRH plc',
    industry: 'Building Materials',
    employees: 3500,
    emissionsPerEmployee: 0.48,
    dataSource: 'CSRD Disclosure 2025',
    lastUpdated: '2026-01-15',
  },
  {
    id: 'peer_ie_2',
    name: 'Kerry Group',
    industry: 'Food & Beverages',
    employees: 2800,
    emissionsPerEmployee: 0.52,
    dataSource: 'CDP Ireland 2025',
    lastUpdated: '2026-01-20',
  },
  {
    id: 'peer_ie_3',
    name: 'Bank of Ireland',
    industry: 'Financial Services',
    employees: 4200,
    emissionsPerEmployee: 0.41,
    dataSource: 'CSRD Disclosure 2025',
    lastUpdated: '2026-02-01',
  },
  {
    id: 'peer_ie_4',
    name: 'AIB Group',
    industry: 'Financial Services',
    employees: 3850,
    emissionsPerEmployee: 0.39,
    dataSource: 'CSRD Disclosure 2025',
    lastUpdated: '2026-01-28',
  },
  {
    id: 'peer_ie_5',
    name: 'Accenture Ireland',
    industry: 'Technology & Consulting',
    employees: 5500,
    emissionsPerEmployee: 0.44,
    dataSource: 'CDP Ireland 2025',
    lastUpdated: '2026-02-05',
  },
  {
    id: 'peer_ie_6',
    name: 'KPMG Ireland',
    industry: 'Professional Services',
    employees: 2950,
    emissionsPerEmployee: 0.46,
    dataSource: 'Public Sustainability Report 2025',
    lastUpdated: '2026-02-10',
  },
  {
    id: 'peer_ie_7',
    name: 'ESB Group',
    industry: 'Energy & Utilities',
    employees: 3200,
    emissionsPerEmployee: 0.51,
    dataSource: 'EPA Ireland Reporting',
    lastUpdated: '2026-01-18',
  },
  {
    id: 'peer_ie_8',
    name: 'Dublin Airport Authority',
    industry: 'Transportation',
    employees: 1850,
    emissionsPerEmployee: 0.68,
    dataSource: 'Public Sustainability Report 2025',
    lastUpdated: '2026-02-08',
  },
];

export default function Benchmarking() {
  const [peers, setPeers] = useState<PeerCompany[]>(mockPeers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<PeerCompany | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Technology',
    employees: '',
    emissionsPerEmployee: '',
    dataSource: '',
  });

  const ourEmissionsPerEmployee = 0.57; // Example: 2847 tCO₂e / 5000 employees
  const avgPeerEmissions = peers.reduce((sum, p) => sum + p.emissionsPerEmployee, 0) / peers.length;
  const ourRanking = [...peers, { emissionsPerEmployee: ourEmissionsPerEmployee } as PeerCompany]
    .sort((a, b) => a.emissionsPerEmployee - b.emissionsPerEmployee)
    .findIndex(p => p.emissionsPerEmployee === ourEmissionsPerEmployee) + 1;

  const handleAddPeer = () => {
    const newPeer: PeerCompany = {
      id: `peer-${Date.now()}`,
      name: formData.name,
      industry: formData.industry,
      employees: parseInt(formData.employees),
      emissionsPerEmployee: parseFloat(formData.emissionsPerEmployee),
      dataSource: formData.dataSource,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setPeers([...peers, newPeer]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Peer company added successfully');
  };

  const handleEditPeer = () => {
    if (selectedPeer) {
      const updated = peers.map(p =>
        p.id === selectedPeer.id
          ? {
              ...p,
              name: formData.name,
              employees: parseInt(formData.employees),
              emissionsPerEmployee: parseFloat(formData.emissionsPerEmployee),
              dataSource: formData.dataSource,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : p
      );
      setPeers(updated);
      setIsEditDialogOpen(false);
      toast.success('Peer company updated successfully');
    }
  };

  const handleRemovePeer = () => {
    if (selectedPeer) {
      setPeers(peers.filter(p => p.id !== selectedPeer.id));
      setIsRemoveDialogOpen(false);
      toast.success('Peer company removed');
    }
  };

  const handleImport = () => {
    // Simulate import
    toast.success('Benchmark data imported successfully');
    setIsImportDialogOpen(false);
  };

  const selectPeer = (peer: PeerCompany) => {
    setSelectedPeer(peer);
    setFormData({
      name: peer.name,
      industry: peer.industry,
      employees: peer.employees.toString(),
      emissionsPerEmployee: peer.emissionsPerEmployee.toString(),
      dataSource: peer.dataSource,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: 'Technology',
      employees: '',
      emissionsPerEmployee: '',
      dataSource: '',
    });
  };

  const getPerformanceIndicator = (peerEmissions: number) => {
    const diff = ((peerEmissions - ourEmissionsPerEmployee) / ourEmissionsPerEmployee) * 100;
    if (Math.abs(diff) < 5) {
      return { icon: '=', color: 'text-gray-600', text: 'Similar' };
    } else if (diff > 0) {
      return { icon: <TrendingUp className="h-4 w-4" />, color: 'text-green-600', text: 'Better' };
    } else {
      return { icon: <TrendingDown className="h-4 w-4" />, color: 'text-red-600', text: 'Worse' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peer Benchmarking</h1>
          <p className="text-gray-600 mt-1">
            Compare performance against industry peers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Peer Company
          </Button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Our Performance</p>
              <p className="text-2xl font-bold text-gray-900">
                {ourEmissionsPerEmployee.toFixed(2)} <span className="text-sm font-normal">tCO₂e/emp</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Peer Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {avgPeerEmissions.toFixed(2)} <span className="text-sm font-normal">tCO₂e/emp</span>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">vs Peer Avg</p>
              <p className="text-2xl font-bold text-green-600">
                {(((avgPeerEmissions - ourEmissionsPerEmployee) / avgPeerEmissions) * 100).toFixed(1)}% better
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Building2 className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ranking</p>
              <p className="text-2xl font-bold text-gray-900">
                #{ourRanking} <span className="text-sm font-normal">of {peers.length + 1}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emissions per Employee Comparison</h3>
        <div className="space-y-3">
          {/* Our Company */}
          <div className="flex items-center gap-4">
            <div className="w-48 flex items-center gap-2">
              <Badge variant="default">Our Company</Badge>
            </div>
            <div className="flex-1 bg-blue-100 h-10 rounded-lg relative" style={{ width: `${(ourEmissionsPerEmployee / 1) * 100}%` }}>
              <div className="absolute right-2 top-2 text-sm font-medium text-blue-900">
                {ourEmissionsPerEmployee.toFixed(2)} tCO₂e/emp
              </div>
            </div>
          </div>

          {/* Peer Companies */}
          {peers.map((peer) => (
            <div key={peer.id} className="flex items-center gap-4">
              <div className="w-48 truncate text-sm text-gray-700">{peer.name}</div>
              <div className="flex-1 bg-gray-100 h-10 rounded-lg relative" style={{ width: `${(peer.emissionsPerEmployee / 1) * 100}%` }}>
                <div className="absolute right-2 top-2 text-sm font-medium text-gray-700">
                  {peer.emissionsPerEmployee.toFixed(2)} tCO₂e/emp
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Peer Companies Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Peer Companies</h3>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">Emissions/Employee</TableHead>
              <TableHead>vs Us</TableHead>
              <TableHead>Data Source</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {peers.map((peer) => {
              const indicator = getPerformanceIndicator(peer.emissionsPerEmployee);
              return (
                <TableRow key={peer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{peer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{peer.industry}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{peer.employees.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-medium">
                    {peer.emissionsPerEmployee.toFixed(2)} tCO₂e
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${indicator.color}`}>
                      {indicator.icon}
                      <span className="text-sm font-medium">{indicator.text}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{peer.dataSource}</TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(peer.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          selectPeer(peer);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPeer(peer);
                          setIsRemoveDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Add Peer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Peer Company</DialogTitle>
            <DialogDescription>
              Add a new company for benchmarking comparison
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Tech Corp Inc"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger id="industry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employees">Number of Employees *</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emissions">Emissions per Employee (tCO₂e) *</Label>
                <Input
                  id="emissions"
                  type="number"
                  step="0.01"
                  value={formData.emissionsPerEmployee}
                  onChange={(e) => setFormData({ ...formData, emissionsPerEmployee: e.target.value })}
                  placeholder="0.65"
                />
              </div>

              <div>
                <Label htmlFor="source">Data Source *</Label>
                <Select
                  value={formData.dataSource}
                  onValueChange={(value) => setFormData({ ...formData, dataSource: value })}
                >
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDP">CDP</SelectItem>
                    <SelectItem value="Public Report">Public Report</SelectItem>
                    <SelectItem value="Direct Contact">Direct Contact</SelectItem>
                    <SelectItem value="Industry Survey">Industry Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddPeer}
              disabled={!formData.name || !formData.employees || !formData.emissionsPerEmployee || !formData.dataSource}
            >
              Add Peer Company
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Peer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Peer Company</DialogTitle>
            <DialogDescription>
              Update benchmark data for {selectedPeer?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Company Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-employees">Number of Employees *</Label>
                <Input
                  id="edit-employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-emissions">Emissions per Employee (tCO₂e) *</Label>
                <Input
                  id="edit-emissions"
                  type="number"
                  step="0.01"
                  value={formData.emissionsPerEmployee}
                  onChange={(e) => setFormData({ ...formData, emissionsPerEmployee: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-source">Data Source *</Label>
              <Select
                value={formData.dataSource}
                onValueChange={(value) => setFormData({ ...formData, dataSource: value })}
              >
                <SelectTrigger id="edit-source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDP">CDP</SelectItem>
                  <SelectItem value="Public Report">Public Report</SelectItem>
                  <SelectItem value="Direct Contact">Direct Contact</SelectItem>
                  <SelectItem value="Industry Survey">Industry Survey</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPeer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Peer Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Peer Company</DialogTitle>
            <DialogDescription>
              Remove "{selectedPeer?.name}" from benchmark comparison?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemovePeer}>
              Remove Peer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Data Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Benchmark Data</DialogTitle>
            <DialogDescription>
              Upload CSV or Excel file with peer company data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: CSV, Excel (.xlsx)
              </p>
              <Button className="mt-4" variant="outline">
                Choose File
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}