import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { 
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Wrench,
  Plus,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  _id: string;
  type: 'food' | 'laundry' | 'housekeeping' | 'maintenance';
  name: string;
  description: string;
  tenantId?: { _id: string; name: string };
  roomId?: { _id: string; roomNumber: string };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  scheduledDate?: string;
  completedDate?: string;
  cost: number;
  notes: string;
  createdAt: string;
}

interface Tenant {
  _id: string;
  name: string;
  roomId?: { _id: string; roomNumber: string };
}

const Services = () => {
  const location = useLocation();
  const pathType = location.pathname.split('/').pop() || 'food';
  const [activeTab, setActiveTab] = useState(pathType);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    type: activeTab,
    name: '',
    description: '',
    tenantId: '',
    priority: 'medium',
    scheduledDate: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery<ServiceRequest[]>({ 
    queryKey: ['/api/services'] 
  });

  const { data: tenants } = useQuery<Tenant[]>({ queryKey: ['/api/tenants'] });

  const addServiceMutation = useMutation({
    mutationFn: (data: typeof newService) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      setIsAddDialogOpen(false);
      setNewService({ type: activeTab, name: '', description: '', tenantId: '', priority: 'medium', scheduledDate: '' });
      toast({ title: 'Service request created successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error creating service request', description: error.message, variant: 'destructive' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/services/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: 'Status updated!' });
    }
  });

  const getFilteredServices = (type: string) => {
    return (services || []).filter(s => s.type === type);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-accent/10 text-accent border-accent/20">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    addServiceMutation.mutate({ ...newService, type: activeTab });
  };

  const foodServices = getFilteredServices('food');
  const laundryServices = getFilteredServices('laundry');
  const housekeepingServices = getFilteredServices('housekeeping');
  const maintenanceServices = getFilteredServices('maintenance');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Services & Facilities</h1>
          <p className="text-muted-foreground mt-1">Manage food, laundry, housekeeping & maintenance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-service">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Service Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddService} className="space-y-4 py-4">
              <div>
                <Label>Request Name</Label>
                <Input
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., AC Repair, Room Cleaning"
                  required
                  data-testid="input-service-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tenant (Optional)</Label>
                  <Select value={newService.tenantId} onValueChange={(v) => setNewService({ ...newService, tenantId: v })}>
                    <SelectTrigger data-testid="select-tenant">
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {(tenants || []).map(tenant => (
                        <SelectItem key={tenant._id} value={tenant._id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newService.priority} onValueChange={(v) => setNewService({ ...newService, priority: v })}>
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
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe the service request..."
                  data-testid="input-description"
                />
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={addServiceMutation.isPending} data-testid="button-submit-service">
                {addServiceMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'food' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('food')}
          data-testid="card-food"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Food/Mess</p>
                <p className="text-lg font-bold text-foreground">{foodServices.length} Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'laundry' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('laundry')}
          data-testid="card-laundry"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laundry</p>
                <p className="text-lg font-bold text-foreground">{laundryServices.filter(s => s.status === 'pending').length} Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'housekeeping' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('housekeeping')}
          data-testid="card-housekeeping"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Housekeeping</p>
                <p className="text-lg font-bold text-foreground">{housekeepingServices.length} Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'maintenance' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('maintenance')}
          data-testid="card-maintenance"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-lg font-bold text-destructive">{maintenanceServices.filter(s => s.status !== 'completed').length} Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="hidden">
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="laundry">Laundry</TabsTrigger>
          <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {['food', 'laundry', 'housekeeping', 'maintenance'].map((type) => (
          <TabsContent key={type} value={type}>
            <Card className="stat-card">
              <CardHeader>
                <CardTitle className="text-lg font-semibold capitalize">{type} Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : getFilteredServices(type).length === 0 ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                    <p className="text-muted-foreground">No {type} requests. Create a new request to get started!</p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Request</TableHead>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredServices(type).map((service) => (
                          <TableRow key={service._id} data-testid={`row-service-${service._id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-xs text-muted-foreground">{service.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>{service.tenantId?.name || '-'}</TableCell>
                            <TableCell>{service.roomId?.roomNumber || '-'}</TableCell>
                            <TableCell>
                              {new Date(service.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </TableCell>
                            <TableCell>{getStatusBadge(service.status)}</TableCell>
                            <TableCell>
                              {service.status === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ id: service._id, status: 'in_progress' })}
                                  data-testid={`button-start-${service._id}`}
                                >
                                  Start
                                </Button>
                              )}
                              {service.status === 'in_progress' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateStatusMutation.mutate({ id: service._id, status: 'completed' })}
                                  data-testid={`button-complete-${service._id}`}
                                >
                                  Complete
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Services;
