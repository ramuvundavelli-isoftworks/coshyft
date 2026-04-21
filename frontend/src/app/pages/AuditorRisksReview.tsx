import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Shield, AlertTriangle, Download, Eye, MessageCircle, Plus } from 'lucide-react';
import { toast } from 'sonner';

const risks = [
  { id: 'r1', title: 'Data Collection Gaps', severity: 'high', likelihood: 'medium', impact: 'high', status: 'open', mitigation: 'Automated data collection' },
  { id: 'r2', title: 'Emission Factor Changes', severity: 'medium', likelihood: 'low', impact: 'medium', status: 'mitigated', mitigation: 'Annual factor review' },
  { id: 'r3', title: 'Low Employee Participation', severity: 'high', likelihood: 'medium', impact: 'high', status: 'in-progress', mitigation: 'Incentive program' },
  { id: 'r4', title: 'Calculation Errors', severity: 'medium', likelihood: 'low', impact: 'high', status: 'mitigated', mitigation: 'Automated validation' },
];

export default function AuditorRisksReview() {
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isAddFindingDialogOpen, setIsAddFindingDialogOpen] = useState(false);
  const [isRequestPlanDialogOpen, setIsRequestPlanDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<any>(null);

  const handleAddFinding = () => {
    toast.success('Audit finding added');
    setIsAddFindingDialogOpen(false);
  };

  const handleRequestPlan = () => {
    toast.success('Mitigation plan request sent');
    setIsRequestPlanDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting risk assessment...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Risks Review</h1>
          <p className="text-muted-foreground mt-1">Risk assessment and mitigation evaluation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddFindingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Finding
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Assessment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Shield className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Risks</p>
              <p className="text-2xl font-bold text-foreground">{risks.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive-subtle rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">High Severity</p>
              <p className="text-2xl font-bold text-destructive">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <Shield className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mitigated</p>
              <p className="text-2xl font-bold text-success">2</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open</p>
              <p className="text-2xl font-bold text-warning">1</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Risks Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Risk Register</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Risk</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Likelihood</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mitigation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.title}</TableCell>
                <TableCell>
                  <Badge className={
                    risk.severity === 'high' ? 'bg-destructive-subtle text-destructive' :
                    risk.severity === 'medium' ? 'bg-warning-subtle text-warning' :
                    'bg-muted text-foreground'
                  }>
                    {risk.severity}
                  </Badge>
                </TableCell>
                <TableCell>{risk.likelihood}</TableCell>
                <TableCell>{risk.impact}</TableCell>
                <TableCell>
                  <Badge className={
                    risk.status === 'mitigated' ? 'bg-success-subtle text-success' :
                    risk.status === 'in-progress' ? 'bg-info-subtle text-info' :
                    'bg-warning-subtle text-warning'
                  }>
                    {risk.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{risk.mitigation}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRisk(risk);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialogs */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Risk Details</DialogTitle>
            <DialogDescription>{selectedRisk?.title}</DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Severity</Label>
                  <p className="font-medium text-foreground mt-1">{selectedRisk.severity}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium text-foreground mt-1">{selectedRisk.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Likelihood</Label>
                  <p className="font-medium text-foreground mt-1">{selectedRisk.likelihood}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Impact</Label>
                  <p className="font-medium text-foreground mt-1">{selectedRisk.impact}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Mitigation Strategy</Label>
                <p className="font-medium text-foreground mt-1">{selectedRisk.mitigation}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsRequestPlanDialogOpen(true);
              setIsViewDetailsDialogOpen(false);
            }}>
              Request Mitigation Plan
            </Button>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFindingDialogOpen} onOpenChange={setIsAddFindingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Audit Finding</DialogTitle>
            <DialogDescription>Document risk-related audit observation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="finding">Finding Description *</Label>
            <Textarea
              id="finding"
              placeholder="Describe audit finding..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFindingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFinding}>
              Add Finding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRequestPlanDialogOpen} onOpenChange={setIsRequestPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mitigation Plan</DialogTitle>
            <DialogDescription>
              Request enhanced mitigation plan for {selectedRisk?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="request">Plan Request *</Label>
            <Textarea
              id="request"
              placeholder="Specify what's needed in the mitigation plan..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestPlanDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestPlan}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Risk Assessment</DialogTitle>
            <DialogDescription>Download risk review documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Risk register</li>
                <li>Mitigation strategies</li>
                <li>Control effectiveness</li>
                <li>Audit findings</li>
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
