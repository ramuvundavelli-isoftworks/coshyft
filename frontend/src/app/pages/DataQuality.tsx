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
import { Plus, AlertTriangle, CheckCircle, Shield, Play, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, sustainabilityApi } from '../api';

interface ValidationRule {
  id: string;
  name: string;
  field: string;
  condition: string;
  threshold: number;
  severity: 'warning' | 'error';
  active: boolean;
  violations: number;
}

const mockRules: ValidationRule[] = [
  {
    id: 'rule1',
    name: 'Distance Reasonableness Check',
    field: 'distance',
    condition: 'max',
    threshold: 200,
    severity: 'error',
    active: true,
    violations: 3,
  },
  {
    id: 'rule2',
    name: 'Minimum Distance Check',
    field: 'distance',
    condition: 'min',
    threshold: 0.5,
    severity: 'warning',
    active: true,
    violations: 12,
  },
  {
    id: 'rule3',
    name: 'Data Completeness Check',
    field: 'mode',
    condition: 'not_null',
    threshold: 0,
    severity: 'error',
    active: true,
    violations: 0,
  },
];

export default function DataQuality() {
  const { data: dqResponse } = useApi(() => sustainabilityApi.getDataQuality());
  const dqData = (dqResponse as any)?.data;
  const [rules, setRules] = useState<ValidationRule[]>(mockRules);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ValidationRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    field: 'distance',
    condition: 'max',
    threshold: '',
    severity: 'warning' as 'warning' | 'error',
    description: '',
  });

  const totalViolations = rules.reduce((sum, r) => sum + r.violations, 0);
  const activeRules = rules.filter(r => r.active).length;
  const errorViolations = rules.filter(r => r.severity === 'error').reduce((sum, r) => sum + r.violations, 0);

  const handleCreateRule = () => {
    const newRule: ValidationRule = {
      id: `rule-${Date.now()}`,
      name: formData.name,
      field: formData.field,
      condition: formData.condition,
      threshold: parseFloat(formData.threshold),
      severity: formData.severity,
      active: true,
      violations: 0,
    };
    setRules([...rules, newRule]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Validation rule created');
  };

  const handleEditRule = () => {
    if (selectedRule) {
      const updated = rules.map(r =>
        r.id === selectedRule.id
          ? {
              ...r,
              name: formData.name,
              threshold: parseFloat(formData.threshold),
              severity: formData.severity,
            }
          : r
      );
      setRules(updated);
      setIsEditDialogOpen(false);
      toast.success('Rule updated successfully');
    }
  };

  const handleDeleteRule = () => {
    if (selectedRule) {
      setRules(rules.filter(r => r.id !== selectedRule.id));
      setIsDeleteDialogOpen(false);
      toast.success('Rule deleted successfully');
    }
  };

  const handleRunValidation = () => {
    // Simulate running validation
    toast.success('Validation completed - 15 violations found');
    setIsRunDialogOpen(false);
    setIsResultsDialogOpen(true);
  };

  const handleToggleRule = (ruleId: string) => {
    const updated = rules.map(r =>
      r.id === ruleId ? { ...r, active: !r.active } : r
    );
    setRules(updated);
    toast.success('Rule status updated');
  };

  const selectRule = (rule: ValidationRule) => {
    setSelectedRule(rule);
    setFormData({
      name: rule.name,
      field: rule.field,
      condition: rule.condition,
      threshold: rule.threshold.toString(),
      severity: rule.severity,
      description: '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      field: 'distance',
      condition: 'max',
      threshold: '',
      severity: 'warning',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Data Quality Management</h1>
          <p className="text-muted-foreground mt-1">
            Define validation rules and ensure data integrity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsRunDialogOpen(true)}>
            <Play className="h-4 w-4 mr-2" />
            Run Validation
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Shield className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Rules</p>
              <p className="text-2xl font-bold text-foreground">{rules.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Rules</p>
              <p className="text-2xl font-bold text-foreground">{activeRules}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Violations</p>
              <p className="text-2xl font-bold text-warning">{totalViolations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive-subtle rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical Errors</p>
              <p className="text-2xl font-bold text-destructive">{errorViolations}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Validation Rules Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground">Validation Rules</h3>
          <Button variant="outline" size="sm">Export Rules</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule Name</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Threshold</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead className="text-right">Violations</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} className="hover:bg-background-subtle">
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {rule.field}
                  </Badge>
                </TableCell>
                <TableCell>{rule.condition.replace('_', ' ')}</TableCell>
                <TableCell className="text-right font-medium">{rule.threshold}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      rule.severity === 'error'
                        ? 'bg-destructive-subtle text-destructive border-destructive/25'
                        : 'bg-warning-subtle text-warning border-warning/25'
                    }
                  >
                    {rule.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className={rule.violations > 0 ? 'font-bold text-destructive' : 'text-muted-foreground'}>
                    {rule.violations}
                  </span>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className="focus:outline-none"
                  >
                    <Badge
                      variant="outline"
                      className={
                        rule.active
                          ? 'bg-success-subtle text-success border-success/25 cursor-pointer'
                          : 'bg-background-subtle text-foreground border-border cursor-pointer'
                      }
                    >
                      {rule.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectRule(rule);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRule(rule);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Create Rule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Validation Rule</DialogTitle>
            <DialogDescription>
              Define a new data quality validation rule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Distance Reasonableness Check"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field">Field to Validate *</Label>
                <Select
                  value={formData.field}
                  onValueChange={(value) => setFormData({ ...formData, field: value })}
                >
                  <SelectTrigger id="field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="mode">Transport Mode</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="emissions">Emissions</SelectItem>
                    <SelectItem value="participants">Participants</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max">Maximum Value</SelectItem>
                    <SelectItem value="min">Minimum Value</SelectItem>
                    <SelectItem value="not_null">Not Null</SelectItem>
                    <SelectItem value="range">Within Range</SelectItem>
                    <SelectItem value="format">Format Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="threshold">Threshold Value *</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                  placeholder="e.g., 200"
                />
              </div>

              <div>
                <Label htmlFor="severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: 'warning' | 'error') => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this rule validates..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateRule}
              disabled={!formData.name || !formData.threshold}
            >
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Validation Rule</DialogTitle>
            <DialogDescription>
              Update rule parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Rule Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-threshold">Threshold Value *</Label>
                <Input
                  id="edit-threshold"
                  type="number"
                  value={formData.threshold}
                  onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-severity">Severity *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value: 'warning' | 'error') => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger id="edit-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRule}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Rule Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Validation Rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedRule?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRule}>
              Delete Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Validation Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Data Validation</DialogTitle>
            <DialogDescription>
              Execute all active validation rules on current data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
              <p className="text-sm text-info">
                This will run {activeRules} active rules against all commute data. Results will be available after completion.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunValidation}>
              <Play className="h-4 w-4 mr-2" />
              Run Validation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Validation Results</DialogTitle>
            <DialogDescription>
              Summary of data quality violations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">1,250</p>
                <p className="text-sm text-muted-foreground">Records Checked</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">12</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">3</p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </Card>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Top Violations:</p>
              {rules.filter(r => r.violations > 0).map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">{rule.name}</span>
                  <Badge
                    variant="outline"
                    className={
                      rule.severity === 'error'
                        ? 'bg-destructive-subtle text-destructive border-destructive/25'
                        : 'bg-warning-subtle text-warning border-warning/25'
                    }
                  >
                    {rule.violations} violations
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsResultsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
