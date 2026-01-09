import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { Plus, Search, Wrench, Clock, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Service {
  _id: string;
  type: string;
  name: string;
  description: string;
  tenantId: { _id: string; name: string; roomNumber: string };
  roomId: { _id: string; roomNumber: string };
  status: string;
  priority: string;
  scheduledDate: string;
  completedDate: string;
  assignedTo: { _id: string; name: string };
  cost: number;
  notes: string;
  createdAt: string;
}

interface Tenant {
  _id: string;
  name: string;
  roomNumber: string;
}

interface Staff {
  _id: string;
  name: string;
  role: string;
}

export default function Maintenance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tenantId: '',
    priority: 'medium',
    scheduledDate: '',
    assignedTo: '',
    cost: 0,
    notes: ''
  });
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['/api/services', 'maintenance'],
    queryFn: async () => {
      return apiRequest('/services?type=maintenance');
    }
  });

  const { data: tenants = [] } = useQuery<Tenant[]>({
    queryKey: ['/api/tenants'],
  });

  const { data: staff = [] } = useQuery<Staff[]>({
    queryKey: ['/api/staff'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify({ ...data, type: 'maintenance' })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: 'Maintenance request created successfully' });
      setIsAddOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create request', description: error.message, variant: 'destructive' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: 'Status updated successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update status', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tenantId: '',
      priority: 'medium',
      scheduledDate: '',
      assignedTo: '',
      cost: 0,
      notes: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Please enter issue name', variant: 'destructive' });
      return;
    }
    createMutation.mutate(formData);
  };

  const filteredServices = services.filter((service: Service) => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tenantId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || service.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = services.filter((s: Service) => s.status === 'pending').length;
  const inProgressCount = services.filter((s: Service) => s.status === 'in_progress').length;
  const completedCount = services.filter((s: Service) => s.status === 'completed').length;
  const highPriorityCount = services.filter((s: Service) => s.priority === 'high' && s.status !== 'completed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed': return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Services</h1>
          <p className="text-muted-foreground">Manage repair and maintenance requests</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-maintenance">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Maintenance Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Issue Title</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Broken AC, Plumbing Issue"
                  data-testid="input-issue-name"
                />
              </div>
              <div>
                <Label>Reported By (Tenant)</Label>
                <Select value={formData.tenantId} onValueChange={(v) => setFormData({ ...formData, tenantId: v })}>
                  <SelectTrigger data-testid="select-tenant">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant: Tenant) => (
                      <SelectItem key={tenant._id} value={tenant._id}>
                        {tenant.name} - Room {tenant.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v })}>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Assign To</Label>
                  <Select value={formData.assignedTo} onValueChange={(v) => setFormData({ ...formData, assignedTo: v })}>
                    <SelectTrigger data-testid="select-assigned-to">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s: Staff) => (
                        <SelectItem key={s._id} value={s._id}>
                          {s.name} - {s.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue in detail"
                  data-testid="input-description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Scheduled Date</Label>
                  <Input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    data-testid="input-scheduled-date"
                  />
                </div>
                <div>
                  <Label>Estimated Cost (Rs.)</Label>
                  <Input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    data-testid="input-cost"
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={createMutation.isPending} data-testid="button-submit-maintenance">
                {createMutation.isPending ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <Wrench className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Loader2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{inProgressCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Maintenance Requests</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-maintenance"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32" data-testid="select-priority-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No maintenance requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Issue</th>
                    <th className="text-left py-3 px-4 font-medium">Reported By</th>
                    <th className="text-left py-3 px-4 font-medium">Priority</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium">Cost</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service: Service) => (
                    <tr key={service._id} className="border-b hover:bg-muted/50" data-testid={`row-maintenance-${service._id}`}>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {service.tenantId?.name || 'N/A'}
                        <br />
                        <span className="text-sm text-muted-foreground">Room: {service.tenantId?.roomNumber || 'N/A'}</span>
                      </td>
                      <td className="py-3 px-4">{getPriorityBadge(service.priority)}</td>
                      <td className="py-3 px-4">{getStatusBadge(service.status)}</td>
                      <td className="py-3 px-4">{service.assignedTo?.name || 'Unassigned'}</td>
                      <td className="py-3 px-4">₹{service.cost?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <Select
                          value={service.status}
                          onValueChange={(v) => updateStatusMutation.mutate({ id: service._id, status: v })}
                        >
                          <SelectTrigger className="w-32" data-testid={`select-update-status-${service._id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
