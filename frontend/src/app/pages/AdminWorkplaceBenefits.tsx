import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../components/ui/table';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Gift, Bike, Bus, Zap, Home, Info, TrendingUp, Users, Euro, FileText, CheckCircle, RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/localization';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

const CATEGORY_ICONS: Record<string, any> = {
  'bike-to-work': Bike,
  'taxsaver':     Bus,
  'ev-incentive': Zap,
  'remote-work':  Home,
};

const CATEGORY_COLORS: Record<string, string> = {
  'bike-to-work': 'bg-success-subtle text-success border-success/25',
  'taxsaver':     'bg-info-subtle text-info border-info/25',
  'ev-incentive': 'bg-info-subtle text-info border-info/25',
  'remote-work':  'bg-warning-subtle text-warning border-warning/25',
};

function CategoryIcon({ category }: { category: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Gift;
  return <Icon className="h-4 w-4" />;
}

export default function AdminWorkplaceBenefits() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBenefit, setSelectedBenefit]   = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen]       = useState(false);
  const [isImpactOpen, setIsImpactOpen]         = useState(false);

  const { data, loading, refetch } = useApi(() => adminApi.getWorkplaceBenefits(), { deps: [] });
  const benefits: any[] = Array.isArray(data) ? data : [];

  const filtered = selectedCategory === 'all'
    ? benefits
    : benefits.filter(b => b.category === selectedCategory);

  const activeBenefits = benefits.filter(b => b.status === 'active').length;

  const enableMutation = useApiMutation(
    (d: { benefit_id: string; enabled: boolean }) => adminApi.enableBenefit(d)
  );

  const handleToggle = async (id: string, enabled: boolean) => {
    const r = await enableMutation.execute({ benefit_id: id, enabled });
    if (r.success) {
      toast.success(enabled ? 'Benefit enabled' : 'Benefit disabled');
      refetch();
      setIsDetailsOpen(false);
    } else {
      toast.error(r.error?.message ?? 'Failed to update benefit');
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Irish Workplace Benefits</h1>
          <p className="text-muted-foreground mt-1">Tax-efficient schemes to incentivise sustainable commuting</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          ['Active Benefits',    loading ? '—' : activeBenefits, 'from-success-subtle to-success-subtle', Gift,      'text-success'],
          ['Total Schemes',      loading ? '—' : benefits.length,'from-info-subtle to-info-subtle',     Users,     'text-info'],
          ['Tax Savings',        '—',                             'from-info-subtle to-primary-subtle',   Euro,      'text-info'],
          ['CO₂ Reduced',        '—',                             'from-success-subtle to-success-subtle', TrendingUp,'text-success'],
        ] as any[]).map(([label, val, grad, Icon, ic]) => (
          <Card key={label} className="p-6 bg-card/40 backdrop-blur-sm border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{val}</p>
              </div>
              <div className={`p-3 bg-gradient-to-br ${grad} rounded-lg`}>
                <Icon className={`h-6 w-6 ${ic}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Table with tabs */}
      <Card className="p-6 bg-card/40 backdrop-blur-sm border border-border/50">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Benefits</TabsTrigger>
              <TabsTrigger value="bike-to-work"><Bike className="h-4 w-4 mr-2" />Bike-to-Work</TabsTrigger>
              <TabsTrigger value="taxsaver"><Bus className="h-4 w-4 mr-2" />TaxSaver</TabsTrigger>
              <TabsTrigger value="ev-incentive"><Zap className="h-4 w-4 mr-2" />EV Incentives</TabsTrigger>
              <TabsTrigger value="remote-work"><Home className="h-4 w-4 mr-2" />Remote Work</TabsTrigger>
            </TabsList>
            <Badge variant="outline" className="bg-info-subtle text-info border-info/25">
              <Info className="h-3 w-3 mr-1" />Irish Revenue Approved
            </Badge>
          </div>

          <TabsContent value={selectedCategory} className="mt-0">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading benefits...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No benefits found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benefit Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tax Relief</TableHead>
                    <TableHead>Max Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${CATEGORY_COLORS[b.category] ?? 'bg-muted'}`}>
                            <CategoryIcon category={b.category} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{b.name}</p>
                            <p className="text-sm text-muted-foreground max-w-xs truncate">{b.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={CATEGORY_COLORS[b.category] ?? 'bg-muted'}>
                          {b.category?.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-success">
                          {b.tax_relief != null ? formatPercentage(b.tax_relief * 100, 'en-IE', 0) : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-foreground">
                          {b.max_amount != null ? formatCurrency(b.max_amount, 'EUR', 'en-IE') : 'Variable'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          b.status === 'active' ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground'
                        }>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => { setSelectedBenefit(b); setIsDetailsOpen(true); }}>
                            <FileText className="h-4 w-4 mr-1" />Details
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => { setSelectedBenefit(b); setIsImpactOpen(true); }}>
                            <TrendingUp className="h-4 w-4 mr-1" />Impact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedBenefit && (
                <div className={`p-2 rounded-lg ${CATEGORY_COLORS[selectedBenefit.category] ?? 'bg-muted'}`}>
                  <CategoryIcon category={selectedBenefit.category} />
                </div>
              )}
              {selectedBenefit?.name}
            </DialogTitle>
            <DialogDescription>Benefit details and compliance requirements</DialogDescription>
          </DialogHeader>
          {selectedBenefit && (
            <div className="space-y-5 py-2">
              <div>
                <Label className="text-sm font-semibold">Description</Label>
                <p className="text-foreground mt-1">{selectedBenefit.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Badge variant="outline" className={`mt-1 ${CATEGORY_COLORS[selectedBenefit.category] ?? ''}`}>
                    {selectedBenefit.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Region</Label>
                  <p className="font-medium mt-1">🇮🇪 {selectedBenefit.region ?? 'Ireland'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tax Relief</Label>
                  <p className="font-semibold text-success text-lg mt-1">
                    {selectedBenefit.tax_relief != null
                      ? formatPercentage(selectedBenefit.tax_relief * 100, 'en-IE', 0)
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Maximum Amount</Label>
                  <p className="font-semibold text-lg mt-1">
                    {selectedBenefit.max_amount != null
                      ? formatCurrency(selectedBenefit.max_amount, 'EUR', 'en-IE')
                      : 'Variable'}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Compliance Required</Label>
                <div className="flex items-center gap-2 mt-1">
                  {selectedBenefit.compliance_required
                    ? <CheckCircle className="h-4 w-4 text-success" />
                    : <Info className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm">
                    {selectedBenefit.compliance_required ? 'Documentation required' : 'No extra compliance required'}
                  </span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge className={`mt-1 ${selectedBenefit.status === 'active' ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground'}`}>
                  {selectedBenefit.status}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            {selectedBenefit?.status !== 'active' ? (
              <Button onClick={() => handleToggle(selectedBenefit?.id, true)} disabled={enableMutation.loading}>
                {enableMutation.loading ? 'Enabling...' : 'Enable Benefit'}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => handleToggle(selectedBenefit?.id, false)} disabled={enableMutation.loading}>
                {enableMutation.loading ? 'Disabling...' : 'Disable Benefit'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impact Dialog */}
      <Dialog open={isImpactOpen} onOpenChange={setIsImpactOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Benefit Impact</DialogTitle>
            <DialogDescription>{selectedBenefit?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">CSRD/ESRS E1 Contribution</h3>
              <p className="text-sm text-foreground">
                This benefit contributes to Scope 3 Category 7 (Employee Commuting) emissions reduction targets
                and supports your CSRD disclosure requirements under ESRS E1-6.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImpactOpen(false)}>Close</Button>
            <Button onClick={() => { toast.info('Impact export not yet implemented'); setIsImpactOpen(false); }}>
              <FileText className="h-4 w-4 mr-2" />Export Impact Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
