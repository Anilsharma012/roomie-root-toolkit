import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LogIn, 
  LogOut, 
  Search,
  Calendar,
  User,
  BedDouble,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  email: string;
  roomId?: { _id: string; roomNumber: string };
  bedId?: { _id: string; bedNumber: string };
  status: 'active' | 'inactive' | 'left';
  joinDate: string;
  rentAmount: number;
}

interface Bed {
  _id: string;
  bedNumber: string;
  roomId?: { _id: string; roomNumber: string };
  status: 'vacant' | 'occupied' | 'maintenance';
}

const CheckInOut = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('checkin');
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedBed, setSelectedBed] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants, isLoading: tenantsLoading } = useQuery<Tenant[]>({ queryKey: ['/api/tenants'] });
  const { data: vacantBeds } = useQuery<Bed[]>({ queryKey: ['/api/beds/vacant'] });

  const checkInMutation = useMutation({
    mutationFn: async ({ tenantId, bedId, roomId }: { tenantId: string; bedId: string; roomId: string }) => {
      await api.put(`/tenants/${tenantId}`, { bedId, roomId, status: 'active' });
      await api.put(`/beds/${bedId}`, { tenantId, status: 'occupied' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds/vacant'] });
      setIsCheckInDialogOpen(false);
      setSelectedTenant('');
      setSelectedBed('');
      toast({ title: 'Check-in successful!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Check-in failed', description: error.message, variant: 'destructive' });
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: async (tenant: Tenant) => {
      if (tenant.bedId) {
        await api.put(`/beds/${tenant.bedId._id}`, { tenantId: null, status: 'vacant' });
      }
      await api.put(`/tenants/${tenant._id}`, { bedId: null, roomId: null, status: 'left' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds'] });
      queryClient.invalidateQueries({ queryKey: ['/api/beds/vacant'] });
      toast({ title: 'Check-out successful!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Check-out failed', description: error.message, variant: 'destructive' });
    }
  });

  const inactiveTenants = (tenants || []).filter(t => t.status === 'inactive' && !t.bedId);
  const activeTenants = (tenants || []).filter(t => t.status === 'active' && t.bedId);

  const filteredActiveTenants = activeTenants.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery)
  );

  const handleCheckIn = () => {
    if (selectedTenant && selectedBed) {
      const bed = vacantBeds?.find(b => b._id === selectedBed);
      const roomId = bed?.roomId?._id || '';
      checkInMutation.mutate({ tenantId: selectedTenant, bedId: selectedBed, roomId });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Check-In / Check-Out</h1>
          <p className="text-muted-foreground mt-1">Manage tenant check-ins and check-outs</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Check-in</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-pending-checkin">{inactiveTenants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Tenants</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-active-tenants">{activeTenants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vacant Beds</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-vacant-beds">{vacantBeds?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="checkin" data-testid="tab-checkin">
            <LogIn className="w-4 h-4 mr-2" />
            Check-In
          </TabsTrigger>
          <TabsTrigger value="checkout" data-testid="tab-checkout">
            <LogOut className="w-4 h-4 mr-2" />
            Check-Out
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-6">
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pending Check-ins</CardTitle>
                <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-gradient" data-testid="button-new-checkin">
                      <LogIn className="w-4 h-4 mr-2" />
                      New Check-In
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Process Check-In</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Select Tenant</Label>
                        <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                          <SelectTrigger data-testid="select-tenant">
                            <SelectValue placeholder="Choose tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            {inactiveTenants.map(tenant => (
                              <SelectItem key={tenant._id} value={tenant._id}>
                                {tenant.name} - {tenant.phone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Assign Bed</Label>
                        <Select value={selectedBed} onValueChange={setSelectedBed}>
                          <SelectTrigger data-testid="select-bed">
                            <SelectValue placeholder="Choose bed" />
                          </SelectTrigger>
                          <SelectContent>
                            {(vacantBeds || []).map(bed => (
                              <SelectItem key={bed._id} value={bed._id}>
                                Room {bed.roomId?.roomNumber} - Bed {bed.bedNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleCheckIn} 
                        className="w-full btn-gradient" 
                        disabled={!selectedTenant || !selectedBed || checkInMutation.isPending}
                        data-testid="button-confirm-checkin"
                      >
                        {checkInMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Confirm Check-In
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {tenantsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : inactiveTenants.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                  <p className="text-muted-foreground">All tenants are checked in!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inactiveTenants.map((tenant, index) => (
                    <div 
                      key={tenant._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`card-pending-${tenant._id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{tenant.name}</h3>
                          <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedTenant(tenant._id);
                          setIsCheckInDialogOpen(true);
                        }}
                        data-testid={`button-checkin-${tenant._id}`}
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Check-In
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkout" className="mt-6">
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Tenants</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-checkout"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {tenantsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredActiveTenants.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No active tenants found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActiveTenants.map((tenant, index) => (
                    <div 
                      key={tenant._id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                      data-testid={`card-active-${tenant._id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success font-semibold">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{tenant.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Room {tenant.roomId?.roomNumber || 'N/A'}</span>
                            <span>-</span>
                            <span>Bed {tenant.bedId?.bedNumber || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">₹{tenant.rentAmount?.toLocaleString() || 0}/mo</p>
                          <p className="text-xs text-muted-foreground">
                            Since {new Date(tenant.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          size="sm" 
                          onClick={() => checkOutMutation.mutate(tenant)}
                          disabled={checkOutMutation.isPending}
                          data-testid={`button-checkout-${tenant._id}`}
                        >
                          {checkOutMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
                          Check-Out
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckInOut;
