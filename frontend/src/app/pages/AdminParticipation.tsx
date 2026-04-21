import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Users, TrendingUp, AlertTriangle, Download, Search,
  Target, Building2, Mail, Eye, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

const DEFAULT_TARGET = 75;

export default function AdminParticipation() {
  const { data, loading, refetch } = useApi(() => adminApi.getParticipation());

  const [searchTerm, setSearchTerm]                       = useState('');
  const [selectedDept, setSelectedDept]                   = useState<any>(null);
  const [isViewOpen, setIsViewOpen]                       = useState(false);
  const [isTargetOpen, setIsTargetOpen]                   = useState(false);
  const [isReminderOpen, setIsReminderOpen]               = useState(false);
  const [isExportOpen, setIsExportOpen]                   = useState(false);
  const [targetValue, setTargetValue]                     = useState(String(DEFAULT_TARGET));
  const [reminderMessage, setReminderMessage]             = useState('');

  const setTargetMutation   = useApiMutation((d: any) => adminApi.setParticipationTarget(d.department, d.targetPercent));
  const sendReminderMutation = useApiMutation((d: any) => adminApi.sendParticipationReminder(d.department, d.message));

  const depts: any[] = (Array.isArray(data) ? data : []).filter((d: any) =>
    d.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees   = depts.reduce((s, d) => s + (d.total_employees ?? 0), 0);
  const totalActive      = depts.reduce((s, d) => s + (d.active_employees ?? 0), 0);
  const avgParticipation = depts.length
    ? Math.round(depts.reduce((s, d) => s + (d.participation_rate ?? 0), 0) / depts.length)
    : 0;
  const belowTarget      = depts.filter(d => d.participation_rate < DEFAULT_TARGET).length;

  const handleSetTarget = async () => {
    const r = await setTargetMutation.execute({
      department: selectedDept.department,
      targetPercent: parseInt(targetValue),
    });
    if (r.success) toast.success(`Target set to ${targetValue}% for ${selectedDept.department}`);
    else toast.error(r.error?.message ?? 'Failed to set target');
    setIsTargetOpen(false);
  };

  const handleSendReminder = async () => {
    const r = await sendReminderMutation.execute({
      department: selectedDept.department,
      message: reminderMessage,
    });
    if (r.success) toast.success(`Reminder queued for ${selectedDept.department}`);
    else toast.error(r.error?.message ?? 'Failed to send reminder');
    setIsReminderOpen(false);
    setReminderMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Participation Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor employee engagement by department</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Total Employees',   loading ? '—' : totalEmployees.toLocaleString(), 'bg-info-subtle',   Users,       'text-info'],
          ['Active This Month', loading ? '—' : totalActive.toLocaleString(),    'bg-success-subtle',  TrendingUp,  'text-success'],
          ['Avg Participation', loading ? '—' : `${avgParticipation}%`,          'bg-info-subtle', Target,      'text-info'],
          ['Below Target',      loading ? '—' : belowTarget,                     'bg-warning-subtle', AlertTriangle,'text-warning'],
        ] as any[]).map(([label, val, bg, Icon, ic]) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bg} rounded-lg`}><Icon className={`h-5 w-5 ${ic}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Department List */}
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading departments...</p>
      ) : depts.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No department data yet. Users need to have commutes logged.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {depts.map((dept: any) => {
            const rate       = dept.participation_rate ?? 0;
            const onTarget   = rate >= DEFAULT_TARGET;
            const pct        = Math.min(rate, 100);
            return (
              <Card key={dept.department} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-info-subtle rounded-lg shrink-0">
                      <Building2 className="h-6 w-6 text-info" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{dept.department}</h3>
                        {onTarget ? (
                          <Badge className="bg-success-subtle text-success">
                            <TrendingUp className="h-3 w-3 mr-1" />On Target
                          </Badge>
                        ) : (
                          <Badge className="bg-warning-subtle text-warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />Below Target
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-semibold text-foreground">{(dept.total_employees ?? 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Active</p>
                          <p className="font-semibold text-foreground">{(dept.active_employees ?? 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rate</p>
                          <p className={`font-semibold ${onTarget ? 'text-success' : 'text-warning'}`}>{rate}%</p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${onTarget ? 'bg-success' : 'bg-warning'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Target {DEFAULT_TARGET}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedDept(dept); setIsViewOpen(true); }}>
                      <Eye className="h-4 w-4 mr-1" />View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedDept(dept); setTargetValue(String(DEFAULT_TARGET)); setIsTargetOpen(true); }}>
                      <Target className="h-4 w-4 mr-1" />Set Target
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedDept(dept); setIsReminderOpen(true); }}>
                      <Mail className="h-4 w-4 mr-1" />Remind
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDept?.department} Department</DialogTitle>
            <DialogDescription>Participation breakdown</DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="grid grid-cols-2 gap-4 py-4">
              {([
                ['Total Employees', (selectedDept.total_employees ?? 0).toLocaleString(), 'text-foreground'],
                ['Active Users',    (selectedDept.active_employees ?? 0).toLocaleString(), 'text-success'],
                ['Participation',   `${selectedDept.participation_rate ?? 0}%`,             'text-info'],
                ['Target',          `${DEFAULT_TARGET}%`,                                   'text-info'],
              ] as [string, string, string][]).map(([label, val, col]) => (
                <Card key={label} className="p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-2xl font-bold mt-1 ${col}`}>{val}</p>
                </Card>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Target Dialog */}
      <Dialog open={isTargetOpen} onOpenChange={setIsTargetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Participation Target</DialogTitle>
            <DialogDescription>Update target for {selectedDept?.department}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg text-sm space-y-1">
              <p><strong>Current rate:</strong> {selectedDept?.participation_rate ?? 0}%</p>
              <p><strong>Platform default target:</strong> {DEFAULT_TARGET}%</p>
            </div>
            <div>
              <Label>New Target (%)</Label>
              <Input
                type="number" min="0" max="100"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTargetOpen(false)}>Cancel</Button>
            <Button onClick={handleSetTarget} disabled={setTargetMutation.loading}>
              {setTargetMutation.loading ? 'Setting...' : 'Set Target'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Participation Reminder</DialogTitle>
            <DialogDescription>Encourage {selectedDept?.department} employees to log commutes</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Message (optional)</Label>
            <Textarea
              value={reminderMessage}
              onChange={e => setReminderMessage(e.target.value)}
              placeholder="Custom message to include in the reminder email..."
              rows={4}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-2">
              A standard reminder will be sent if no message is provided.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReminderOpen(false)}>Cancel</Button>
            <Button onClick={handleSendReminder} disabled={sendReminderMutation.loading}>
              <Mail className="h-4 w-4 mr-2" />
              {sendReminderMutation.loading ? 'Sending...' : 'Send Reminder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Participation Report</DialogTitle>
            <DialogDescription>Download department participation data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg text-sm">
              <p className="font-medium text-foreground mb-2">Report includes:</p>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>Department participation rates</li>
                <li>Total and active employee counts</li>
                <li>Target achievement status</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Exporting participation data...'); setIsExportOpen(false); }}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
