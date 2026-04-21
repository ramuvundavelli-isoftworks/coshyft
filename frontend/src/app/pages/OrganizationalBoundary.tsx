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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Building2, Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BoundaryEntity {
  id: string;
  name: string;
  type: 'subsidiary' | 'facility' | 'office';
  included: boolean;
  control: 'operational' | 'financial' | 'equity';
  ownership: number;
  employees: number;
  location: string;
}

const mockBoundaryData: BoundaryEntity[] = [
  { id: 'e1', name: 'Acme HQ', type: 'office', included: true, control: 'operational', ownership: 100, employees: 1240, location: 'San Francisco, CA' },
  { id: 'e2', name: 'Downtown Office', type: 'office', included: true, control: 'operational', ownership: 100, employees: 680, location: 'San Francisco, CA' },
  { id: 'e3', name: 'East Campus', type: 'facility', included: true, control: 'operational', ownership: 100, employees: 520, location: 'Oakland, CA' },
  { id: 'e4', name: 'London Office', type: 'office', included: true, control: 'operational', ownership: 100, employees: 380, location: 'London, UK' },
  { id: 'e5', name: 'Warehouse Site', type: 'facility', included: false, control: 'financial', ownership: 60, employees: 150, location: 'Newark, NJ' },
];

export default function OrganizationalBoundary() {
  const [entities, setEntities] = useState<BoundaryEntity[]>(mockBoundaryData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<BoundaryEntity | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'office', control: 'operational', ownership: '100', employees: '', location: '' });

  const handleAddEntity = () => {
    const newEntity: BoundaryEntity = {
      id: `e-${Date.now()}`,
      name: formData.name,
      type: formData.type as any,
      included: true,
      control: formData.control as any,
      ownership: parseInt(formData.ownership),
      employees: parseInt(formData.employees),
      location: formData.location,
    };
    setEntities([...entities, newEntity]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', type: 'office', control: 'operational', ownership: '100', employees: '', location: '' });
    toast.success('Entity added successfully');
  };

  const handleDeleteEntity = () => {
    if (selectedEntity) {
      setEntities(entities.filter(e => e.id !== selectedEntity.id));
      setIsDeleteDialogOpen(false);
      toast.success('Entity removed');
    }
  };

  const handleExport = () => {
    toast.success('Exporting organizational boundary...');
    setIsExportDialogOpen(false);
  };

  const includedEntities = entities.filter(e => e.included);
  const totalEmployees = includedEntities.reduce((sum, e) => sum + e.employees, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizational Boundary</h1>
          <p className="text-muted-foreground mt-1">
            Define scope and consolidation approach
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entity
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Building2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Entities</p>
              <p className="text-2xl font-bold text-foreground">{entities.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <Building2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Included</p>
              <p className="text-2xl font-bold text-success">{includedEntities.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Building2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-foreground">{totalEmployees.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Building2 className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Control Approach</p>
              <p className="text-lg font-bold text-foreground">Operational</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Consolidation Approach */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Consolidation Approach</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-info rounded-lg bg-info-subtle">
            <h4 className="font-medium text-info mb-2">Operational Control (Primary)</h4>
            <p className="text-sm text-info">
              100% of emissions from operations over which the organization has operational control
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Financial Control</h4>
            <p className="text-sm text-muted-foreground">
              100% of emissions from operations over which the organization has financial control
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Equity Share</h4>
            <p className="text-sm text-muted-foreground">
              Emissions proportional to equity share in the operation
            </p>
          </div>
        </div>
      </Card>

      {/* Entities Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Organizational Entities</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Control</TableHead>
              <TableHead>Ownership</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell className="font-medium">{entity.name}</TableCell>
                <TableCell>
                  <Badge className="bg-muted text-foreground">{entity.type}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{entity.location}</TableCell>
                <TableCell>{entity.control}</TableCell>
                <TableCell>{entity.ownership}%</TableCell>
                <TableCell>{entity.employees}</TableCell>
                <TableCell>
                  {entity.included ? (
                    <Badge className="bg-success-subtle text-success">Included</Badge>
                  ) : (
                    <Badge className="bg-muted text-foreground">Excluded</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntity(entity);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntity(entity);
                        setFormData({
                          name: entity.name,
                          type: entity.type,
                          control: entity.control,
                          ownership: entity.ownership.toString(),
                          employees: entity.employees.toString(),
                          location: entity.location,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEntity(entity);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Entity Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Entity</DialogTitle>
            <DialogDescription>Add a new organizational entity</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Entity Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Regional Office"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="facility">Facility</SelectItem>
                    <SelectItem value="subsidiary">Subsidiary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="control">Control *</Label>
                <Select value={formData.control} onValueChange={(val) => setFormData({ ...formData, control: val })}>
                  <SelectTrigger id="control">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ownership">Ownership % *</Label>
                <Input
                  id="ownership"
                  type="number"
                  value={formData.ownership}
                  onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="employees">Employees *</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEntity} disabled={!formData.name || !formData.employees || !formData.location}>
              Add Entity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entity</DialogTitle>
            <DialogDescription>Update entity details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Entity Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-ownership">Ownership % *</Label>
                <Input
                  id="edit-ownership"
                  type="number"
                  value={formData.ownership}
                  onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-employees">Employees *</Label>
                <Input
                  id="edit-employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Entity updated');
              setIsEditDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entity Details</DialogTitle>
            <DialogDescription>{selectedEntity?.name}</DialogDescription>
          </DialogHeader>
          {selectedEntity && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEntity.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Control</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEntity.control}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Ownership</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEntity.ownership}%</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Employees</Label>
                  <p className="font-medium text-foreground mt-1">{selectedEntity.employees}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Location</Label>
                <p className="font-medium text-foreground mt-1">{selectedEntity.location}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-foreground mt-1">
                  {selectedEntity.included ? 'Included in boundary' : 'Excluded from boundary'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Entity</DialogTitle>
            <DialogDescription>Remove {selectedEntity?.name} from organizational boundary</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This will remove the entity from your organizational boundary. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEntity}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Entity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Organizational Boundary</DialogTitle>
            <DialogDescription>Download boundary documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>All organizational entities</li>
                <li>Consolidation approach</li>
                <li>Control methods</li>
                <li>Inclusion/exclusion rationale</li>
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
