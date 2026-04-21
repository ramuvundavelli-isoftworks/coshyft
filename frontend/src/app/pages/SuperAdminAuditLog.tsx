import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Shield, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useApi } from '../api';
import { superadminApi } from '../api';

const PAGE_SIZE = 20;

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-success-subtle text-success',
  UPDATE: 'bg-info-subtle text-info',
  DELETE: 'bg-destructive-subtle text-destructive',
  VIEW:   'bg-muted text-foreground',
  LOGIN:  'bg-info-subtle text-info',
  LOGOUT: 'bg-warning-subtle text-warning',
  SUSPEND: 'bg-warning-subtle text-warning',
  ACTIVATE: 'bg-success-subtle text-success',
  EXPORT: 'bg-info-subtle text-info',
};

export default function SuperAdminAuditLog() {
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, loading, refetch } = useApi(() =>
    superadminApi.getAuditLog({
      skip: page * PAGE_SIZE,
      limit: PAGE_SIZE,
      action: actionFilter !== 'all' ? actionFilter : undefined,
      entity_type: entityFilter !== 'all' ? entityFilter : undefined,
      user_id: search || undefined,
    }),
    { deps: [page, actionFilter, entityFilter, search] }
  );

  const logs: any[] = Array.isArray(data) ? data : ((data as any)?.items ?? (data as any)?.logs ?? []);
  const total: number = (data as any)?.meta?.total ?? (data as any)?.total ?? logs.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(0);
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success('Audit log refreshed');
  };

  const handleFilterChange = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setPage(0);
  };

  const formatTimestamp = (ts: string) => {
    try {
      return new Date(ts).toLocaleString('en-IE', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Log</h1>
          <p className="text-muted-foreground mt-1">Platform-wide activity and security events</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search by user ID */}
          <div className="flex gap-2 flex-1 min-w-[220px]">
            <Input
              placeholder="Search by user ID..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button variant="outline" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Action filter */}
          <Select value={actionFilter} onValueChange={handleFilterChange(setActionFilter)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="VIEW">View</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
              <SelectItem value="LOGOUT">Logout</SelectItem>
              <SelectItem value="SUSPEND">Suspend</SelectItem>
              <SelectItem value="ACTIVATE">Activate</SelectItem>
              <SelectItem value="EXPORT">Export</SelectItem>
            </SelectContent>
          </Select>

          {/* Entity type filter */}
          <Select value={entityFilter} onValueChange={handleFilterChange(setEntityFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="USER_PROFILE">User Profile</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
              <SelectItem value="COMMUTE_ENTRY">Commute Entry</SelectItem>
              <SelectItem value="BASELINE">Baseline</SelectItem>
              <SelectItem value="REPORT">Report</SelectItem>
              <SelectItem value="EMISSION_FACTOR">Emission Factor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Log Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-background-subtle">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">Timestamp</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Entity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">Loading...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Shield className="h-8 w-8 text-muted-foreground" />
                      <span>No audit log entries found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="border-b hover:bg-background-subtle transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap font-mono text-xs">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground font-mono text-xs">{log.user_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-muted text-foreground capitalize">{log.user_role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={ACTION_COLORS[log.action] ?? 'bg-muted text-foreground'}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      <div>{log.entity_type}</div>
                      {log.entity_id && (
                        <div className="font-mono text-muted-foreground">{log.entity_id}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-[280px]">
                      <span className="line-clamp-2">{log.description ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {log.ip_address ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-background-subtle">
            <p className="text-sm text-muted-foreground">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
