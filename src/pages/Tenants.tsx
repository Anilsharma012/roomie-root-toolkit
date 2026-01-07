import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  aadharNumber: string;
  roomId?: {
    _id: string;
    roomNumber: string;
  };
  bedId?: {
    _id: string;
    bedNumber: string;
  };
  rentAmount: number;
  depositAmount: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'left';
  isActive: boolean;
  createdAt: string;
}

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    aadharNumber: '',
    rentAmount: 0,
    depositAmount: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants, isLoading } = useQuery<Tenant[]>({
    queryKey: ['/api/tenants'],
  });

  const addTenantMutation = useMutation({
    mutationFn: (data: typeof newTenant) => api.post('/tenants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      setIsAddDialogOpen(false);
      setNewTenant({ name: '', phone: '', email: '', address: '', aadharNumber: '', rentAmount: 0, depositAmount: 0 });
      toast({ title: 'Tenant added successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding tenant', description: error.message, variant: 'destructive' });
    }
  });

  const deleteTenantMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tenants/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      toast({ title: 'Tenant removed successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error removing tenant', description: error.message, variant: 'destructive' });
    }
  });

  const filteredTenants = (tenants || []).filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Inactive</Badge>;
      case 'left':
        return <Badge className="bg-muted text-muted-foreground">Left</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    addTenantMutation.mutate(newTenant);
  };

  const activeCount = (tenants || []).filter(t => t.status === 'active').length;
  const inactiveCount = (tenants || []).filter(t => t.status === 'inactive').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">Manage all your PG tenants in one place</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-tenant">
              <Plus className="w-4 h-4 mr-2" />
              Add New Tenant
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTenant} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  required
                  data-testid="input-tenant-name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newTenant.phone}
                  onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                  required
                  data-testid="input-tenant-phone"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                  data-testid="input-tenant-email"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newTenant.address}
                  onChange={(e) => setNewTenant({ ...newTenant, address: e.target.value })}
                  data-testid="input-tenant-address"
                />
              </div>
              <div>
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  value={newTenant.aadharNumber}
                  onChange={(e) => setNewTenant({ ...newTenant, aadharNumber: e.target.value })}
                  data-testid="input-tenant-aadhar"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rent">Monthly Rent</Label>
                  <Input
                    id="rent"
                    type="number"
                    value={newTenant.rentAmount}
                    onChange={(e) => setNewTenant({ ...newTenant, rentAmount: Number(e.target.value) })}
                    data-testid="input-tenant-rent"
                  />
                </div>
                <div>
                  <Label htmlFor="deposit">Deposit Amount</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={newTenant.depositAmount}
                    onChange={(e) => setNewTenant({ ...newTenant, depositAmount: Number(e.target.value) })}
                    data-testid="input-tenant-deposit"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={addTenantMutation.isPending} data-testid="button-submit-tenant">
                {addTenantMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Tenant
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tenants</p>
            <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-total-tenants">{tenants?.length || 0}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success mt-1" data-testid="text-active-tenants">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-destructive mt-1" data-testid="text-inactive-tenants">{inactiveCount}</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Left</p>
            <p className="text-2xl font-bold text-warning mt-1" data-testid="text-left-tenants">
              {(tenants || []).filter(t => t.status === 'left').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="stat-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-tenants"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" data-testid="button-download">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTenants.map((tenant, index) => (
            <Card 
              key={tenant._id} 
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`card-tenant-${tenant._id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {tenant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tenant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tenant.roomId ? `Room ${tenant.roomId.roomNumber}` : 'No room assigned'}
                        {tenant.bedId ? ` - Bed ${tenant.bedId.bedNumber}` : ''}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${tenant._id}`}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`menu-view-${tenant._id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`menu-edit-${tenant._id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteTenantMutation.mutate(tenant._id)}
                        data-testid={`menu-delete-${tenant._id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{tenant.phone}</span>
                  </div>
                  {tenant.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                  )}
                  {tenant.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{tenant.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(tenant.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                    <p className="text-lg font-bold text-foreground">₹{tenant.rentAmount?.toLocaleString() || 0}</p>
                  </div>
                  {getStatusBadge(tenant.status)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredTenants.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tenants found. Add your first tenant to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tenants;
