import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import { History, Download, Eye, Filter, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '../api';
import { auditorApi } from '../api';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  changes: string;
  ipAddress: string;
  category: 'data' | 'config' | 'user' | 'approval' | 'system';
}

const mockAuditLogs: AuditLog[] = [
  { id: 'l1', timestamp: '2026-02-18 14:32:15', user: 'John Smith', action: 'Updated', entity: 'Baseline', changes: 'Modified 2026 baseline value', ipAddress: '192.168.1.100', category: 'data' },
  { id: 'l2', timestamp: '2026-02-18 14:15:42', user: 'Sarah Johnson', action: 'Created', entity: 'Target', changes: 'Added 2030 reduction target', ipAddress: '192.168.1.105', category: 'data' },
  { id: 'l3', timestamp: '2026-02-18 13:58:21', user: 'Mike Chen', action: 'Approved', entity: 'Factor', changes: 'Approved DEFRA 2024 factors', ipAddress: '192.168.1.110', category: 'approval' },
  { id: 'l4', timestamp: '2026-02-18 13:45:10', user: 'Emily Davis', action: 'Deleted', entity: 'User', changes: 'Removed inactive user account', ipAddress: '192.168.1.115', category: 'user' },
  { id: 'l5', timestamp: '2026-02-18 13:30:05', user: 'David Wilson', action: 'Modified', entity: 'Settings', changes: 'Updated notification preferences', ipAddress: '192.168.1.120', category: 'config' },
  { id: 'l6', timestamp: '2026-02-18 13:15:30', user: 'Admin', action: 'Backup', entity: 'System', changes: 'Automated database backup', ipAddress: '10.0.0.1', category: 'system' },
  { id: 'l7', timestamp: '2026-02-18 12:45:18', user: 'John Smith', action: 'Exported', entity: 'Report', changes: 'Downloaded Q4 compliance report', ipAddress: '192.168.1.100', category: 'data' },
  { id: 'l8', timestamp: '2026-02-18 12:20:55', user: 'Sarah Johnson', action: 'Locked', entity: 'Factor', changes: 'Locked emission factors for audit', ipAddress: '192.168.1.105', category: 'data' },
];

export default function AuditTrail() {
  const [logs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const handleExport = () => {
    toast.success('Exporting audit trail...');
    setIsExportDialogOpen(false);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesAction = filterAction === 'all' || log.action.toLowerCase() === filterAction.toLowerCase();
    return matchesSearch && matchesCategory && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive activity log and change tracking
          </p>
        </div>
        <Button onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Activity</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <History className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Retention</p>
              <p className="text-2xl font-bold text-gray-900">7 Years</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="config">Configuration</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="approval">Approval</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger>
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="exported">Exported</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-sm">{log.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {log.user}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={
                    log.action === 'Created' || log.action === 'Approved' ? 'bg-green-100 text-green-700' :
                    log.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                    log.action === 'Updated' || log.action === 'Modified' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 text-gray-700">{log.category}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{log.ipAddress}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLog(log);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Retention Policy */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Audit Trail Policy</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium text-gray-900">Retention Period</span>
            <Badge className="bg-blue-100 text-blue-700">7 Years</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium text-gray-900">Log Storage</span>
            <Badge className="bg-green-100 text-green-700">Encrypted</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium text-gray-900">Tamper Protection</span>
            <Badge className="bg-green-100 text-green-700">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="font-medium text-gray-900">Backup Frequency</span>
            <Badge className="bg-blue-100 text-blue-700">Daily</Badge>
          </div>
        </div>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Activity log entry details</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Timestamp</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">User</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.user}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Action</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Entity</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.entity}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Changes</Label>
                <p className="text-gray-900 mt-1">{selectedLog.changes}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Category</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">IP Address</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedLog.ipAddress}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Audit Trail</DialogTitle>
            <DialogDescription>Download activity logs</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="date-range">Date Range *</Label>
              <Select defaultValue="30days">
                <SelectTrigger id="date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format">Export Format *</Label>
              <Select defaultValue="csv">
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
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