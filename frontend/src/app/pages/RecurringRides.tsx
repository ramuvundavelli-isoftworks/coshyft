import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Info,
  BarChart3,
  Download,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  RecurringRideTemplate,
  getScheduleDescription,
  detectScheduleConflicts,
  getUpcomingRides,
  cloneTemplate,
  exportTemplate,
  generateRidesFromTemplate,
} from '../utils/recurringRides';
import CreateRecurringRideModal from '../components/carpooling/CreateRecurringRideModal';
import ScheduleCalendarView from '../components/carpooling/ScheduleCalendarView';
import { useApi, useApiMutation } from '../api';
import { carpoolingApi } from '../api';

export default function RecurringRides() {
  const { data: apiTemplates } = useApi(() => carpoolingApi.getRecurringTemplates());
  const [templates, setTemplates] = useState<RecurringRideTemplate[]>([]);

  useEffect(() => {
    const items = Array.isArray(apiTemplates) ? apiTemplates : (apiTemplates as any)?.items;
    if (Array.isArray(items)) setTemplates(items);
  }, [apiTemplates]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all');
  const [patternFilter, setPatternFilter] = useState<'all' | 'daily' | 'weekly' | 'biweekly' | 'monthly'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RecurringRideTemplate | undefined>();

  // API mutations
  const createTemplateMutation = useApiMutation((data: any) =>
    carpoolingApi.createRecurringTemplate(data)
  );
  const updateTemplateMutation = useApiMutation((data: { id: string; payload: any }) =>
    carpoolingApi.updateRecurringTemplate(data.id, data.payload)
  );
  const deleteTemplateMutation = useApiMutation((id: string) =>
    carpoolingApi.deleteRecurringTemplate(id)
  );
  const pauseTemplateMutation = useApiMutation((id: string) =>
    carpoolingApi.pauseTemplate(id)
  );
  const resumeTemplateMutation = useApiMutation((id: string) =>
    carpoolingApi.resumeTemplate(id)
  );

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.origin.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.destination.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    const matchesPattern = patternFilter === 'all' || template.pattern === patternFilter;

    return matchesSearch && matchesStatus && matchesPattern;
  });

  // Detect conflicts
  const conflicts = detectScheduleConflicts(filteredTemplates.filter(t => t.status === 'active'));

  // Calculate totals
  const totalStats = filteredTemplates.reduce(
    (acc, template) => ({
      totalRides: acc.totalRides + template.statistics.totalRidesGenerated,
      completedRides: acc.completedRides + template.statistics.totalRidesCompleted,
      co2Saved: acc.co2Saved + template.statistics.totalCO2Saved,
      avgPassengers: acc.avgPassengers + template.statistics.averagePassengers,
    }),
    { totalRides: 0, completedRides: 0, co2Saved: 0, avgPassengers: 0 }
  );

  const handleCreateTemplate = async (template: RecurringRideTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === template.id ? template : t)));
      toast.success('Template updated successfully!');
      await updateTemplateMutation.execute({ id: template.id, payload: template });
    } else {
      setTemplates([template, ...templates]);
      toast.success('Recurring ride template created!');
      await createTemplateMutation.execute(template);
    }
    setEditingTemplate(undefined);
    setIsCreateModalOpen(false);
  };

  const handleEditTemplate = (template: RecurringRideTemplate) => {
    setEditingTemplate(template);
    setIsCreateModalOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    if (confirm(`Are you sure you want to delete "${template.name}"? This cannot be undone.`)) {
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast.success('Template deleted');
      await deleteTemplateMutation.execute(templateId);
    }
  };

  const handleToggleStatus = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newStatus = template.status === 'active' ? 'paused' : 'active';
    
    setTemplates(
      templates.map((t) => {
        if (t.id === templateId) {
          toast.success(
            `Template ${newStatus === 'active' ? 'activated' : 'paused'}`,
            {
              description: `"${t.name}" is now ${newStatus}`,
            }
          );
          return { ...t, status: newStatus };
        }
        return t;
      })
    );

    // Fire the appropriate API call
    if (newStatus === 'paused') {
      await pauseTemplateMutation.execute(templateId);
    } else {
      await resumeTemplateMutation.execute(templateId);
    }
  };

  const handleCloneTemplate = (template: RecurringRideTemplate) => {
    const cloned = cloneTemplate(template, new Date(), undefined);
    cloned.name = `${template.name} (Copy)`;
    setTemplates([cloned, ...templates]);
    toast.success('Template cloned!', {
      description: 'Edit the clone to customize it',
    });
  };

  const handleExportTemplate = (template: RecurringRideTemplate) => {
    const json = exportTemplate(template);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '-')}.json`;
    a.click();
    toast.success('Template exported!');
  };

  const handleViewUpcoming = (template: RecurringRideTemplate) => {
    const upcoming = getUpcomingRides(template, 30);
    toast.info(`Upcoming rides for "${template.name}"`, {
      description: `${upcoming.length} rides scheduled in the next 30 days`,
    });
  };

  const getStatusColor = (status: RecurringRideTemplate['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success-subtle text-success border-success/25';
      case 'paused':
        return 'bg-warning-subtle text-warning border-warning/25';
      case 'cancelled':
        return 'bg-destructive-subtle text-destructive border-destructive/25';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getPatternIcon = (pattern: RecurringRideTemplate['pattern']) => {
    switch (pattern) {
      case 'daily':
        return '📅';
      case 'weekly':
        return '📆';
      case 'biweekly':
        return '🗓️';
      case 'monthly':
        return '🗓️';
      case 'custom':
        return '✨';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recurring Rides</h1>
          <p className="text-muted-foreground mt-1">
            Manage your recurring ride schedules and templates
          </p>
        </div>

        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Recurring Ride
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Active Templates</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {templates.filter((t) => t.status === 'active').length}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Rides</span>
            <Calendar className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalStats.totalRides}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completed</span>
            <CheckCircle className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{totalStats.completedRides}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">CO₂ Saved</span>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{totalStats.co2Saved.toFixed(1)} kg</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Conflicts</span>
            <AlertCircle className={`h-4 w-4 ${conflicts.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <p className={`text-2xl font-bold ${conflicts.length > 0 ? 'text-destructive' : 'text-foreground'}`}>
            {conflicts.length}
          </p>
        </Card>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="p-4 bg-warning-subtle border-warning/25">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-warning mb-2">
                Schedule Conflicts Detected
              </h3>
              <div className="space-y-2">
                {conflicts.slice(0, 3).map((conflict) => (
                  <div key={conflict.id} className="text-sm text-warning">
                    <p className="font-medium">{conflict.description}</p>
                    <p className="text-xs mt-1">
                      Suggestions: {conflict.suggestions.join(' • ')}
                    </p>
                  </div>
                ))}
              </div>
              {conflicts.length > 3 && (
                <p className="text-xs text-warning mt-2">
                  +{conflicts.length - 3} more conflicts
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Filters and View Toggle */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name, location..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Pattern Filter */}
          <Select value={patternFilter} onValueChange={(value: any) => setPatternFilter(value)}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patterns</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-1 border rounded-lg p-1 bg-card">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendar
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {viewMode === 'calendar' ? (
        <ScheduleCalendarView
          templates={filteredTemplates.filter((t) => t.status === 'active')}
          onRideClick={(ride) => toast.info(`Ride: ${ride.departureTime}`, { description: ride.origin.address })}
          onDateClick={(date) => toast.info(`Selected: ${date.toLocaleDateString()}`)}
        />
      ) : (
        <div className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No templates found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || patternFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first recurring ride template to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && patternFilter === 'all' && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Recurring Ride
                </Button>
              )}
            </Card>
          ) : (
            filteredTemplates.map((template) => {
              const upcomingRides = getUpcomingRides(template, 7);
              const completionRate =
                template.statistics.totalRidesGenerated > 0
                  ? (template.statistics.totalRidesCompleted /
                      template.statistics.totalRidesGenerated) *
                    100
                  : 0;

              return (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="h-12 w-12 bg-info-subtle rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {getPatternIcon(template.pattern)}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {template.name}
                            </h3>
                            <Badge variant="outline" className={getStatusColor(template.status)}>
                              {template.status}
                            </Badge>
                            {template.isDriver && (
                              <Badge variant="outline" className="bg-info-subtle text-info">
                                Driver
                              </Badge>
                            )}
                            {template.autoAccept && (
                              <Badge variant="outline" className="bg-success-subtle text-success">
                                Auto-accept
                              </Badge>
                            )}
                          </div>
                          {template.description && (
                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(template.id)}
                          >
                            {template.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCloneTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Route Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-muted-foreground">From</p>
                            <p className="text-foreground font-medium">{template.origin.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-muted-foreground">To</p>
                            <p className="text-foreground font-medium">
                              {template.destination.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Info */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{template.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {getScheduleDescription(template)}
                          </span>
                        </div>
                        {template.isDriver && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{template.seats} seats</span>
                          </div>
                        )}
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-5 gap-4 p-3 bg-background-subtle rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Rides</p>
                          <p className="text-lg font-semibold text-foreground">
                            {template.statistics.totalRidesGenerated}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Completed</p>
                          <p className="text-lg font-semibold text-success">
                            {template.statistics.totalRidesCompleted}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Completion Rate</p>
                          <p className="text-lg font-semibold text-info">
                            {completionRate.toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">CO₂ Saved</p>
                          <p className="text-lg font-semibold text-success">
                            {template.statistics.totalCO2Saved.toFixed(1)} kg
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Avg Passengers</p>
                          <p className="text-lg font-semibold text-foreground">
                            {template.statistics.averagePassengers.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      {/* Upcoming Rides */}
                      {upcomingRides.length > 0 && template.status === 'active' && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-foreground">
                              Next 7 days: {upcomingRides.length} ride(s)
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewUpcoming(template)}
                            >
                              View All
                            </Button>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {upcomingRides.slice(0, 5).map((ride, index) => (
                              <Badge key={index} variant="outline">
                                {ride.date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </Badge>
                            ))}
                            {upcomingRides.length > 5 && (
                              <Badge variant="outline">+{upcomingRides.length - 5} more</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateRecurringRideModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleCreateTemplate}
        editTemplate={editingTemplate}
      />
    </div>
  );
}