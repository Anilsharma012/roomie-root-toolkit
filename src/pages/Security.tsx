import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Shield,
  UserCheck,
  Clock,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  LogIn,
  LogOut,
  Moon,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Visitor {
  _id: string;
  visitorName: string;
  relation: string;
  tenantId: {
    _id: string;
    name: string;
    roomId: {
      roomNumber: string;
    };
  };
  purpose: string;
  phone: string;
  idType: string;
  entryTime: string;
  exitTime?: string;
  status: 'inside' | 'exited';
}

const Security = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    relation: '',
    idType: '',
    tenantId: '',
    phone: '',
    purpose: ''
  });

  const [isAddGatePassOpen, setIsAddGatePassOpen] = useState(false);
  const [gatePassFormData, setGatePassFormData] = useState({
    tenantId: '',
    reason: '',
    departureTime: '',
    expectedReturn: '',
  });

  const queryClient = useQueryClient();

  const { data: gatePasses = [] } = useQuery<any[]>({
    queryKey: ['/api/gatepasses'],
    enabled: true,
  });

  const gatePassMutation = useMutation({
    mutationFn: async (data: typeof gatePassFormData) => {
      return apiRequest('/gatepasses', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gatepasses'] });
      toast({ title: 'Gate pass requested successfully' });
      setIsAddGatePassOpen(false);
      setGatePassFormData({
        tenantId: '',
        reason: '',
        departureTime: '',
        expectedReturn: '',
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to request gate pass', description: error.message, variant: 'destructive' });
    }
  });

  const handleGatePassSubmit = () => {
    if (!gatePassFormData.tenantId || !gatePassFormData.reason || !gatePassFormData.departureTime) {
      toast({ title: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    gatePassMutation.mutate(gatePassFormData);
  };

  const { data: visitorLogs = [], isLoading } = useQuery<Visitor[]>({
    queryKey: ['/api/visitors'],
  });

  const { data: tenants = [] } = useQuery<any[]>({
    queryKey: ['/api/tenants'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest('/visitors', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitors'] });
      toast({ title: 'Visitor registered successfully' });
      setIsAddVisitorOpen(false);
      setFormData({
        visitorName: '',
        relation: '',
        idType: '',
        tenantId: '',
        phone: '',
        purpose: ''
      });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to register visitor', description: error.message, variant: 'destructive' });
    }
  });

  const exitMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/visitors/${id}/exit`, { method: 'PATCH' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/visitors'] });
      toast({ title: 'Visitor marked as exited' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to mark exit', description: error.message, variant: 'destructive' });
    }
  });

  const handleSubmit = () => {
    if (!formData.visitorName || !formData.tenantId || !formData.phone || !formData.purpose) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    createMutation.mutate(formData);
  };

  const visitorsInside = visitorLogs.filter(v => v.status === 'inside').length;
  const todayVisitors = visitorLogs.length;

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Security & Visitors</h1>
          <p className="text-muted-foreground mt-1">Manage visitor entries and security logs</p>
        </div>
        <Dialog open={isAddVisitorOpen} onOpenChange={setIsAddVisitorOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Visitor Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register Visitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Visitor Name</Label>
                <Input 
                  placeholder="Enter visitor name" 
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select value={formData.relation} onValueChange={(v) => setFormData({ ...formData, relation: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select value={formData.idType} onValueChange={(v) => setFormData({ ...formData, idType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="voter">Voter ID</SelectItem>
                      <SelectItem value="dl">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visiting Tenant</Label>
                <Select value={formData.tenantId} onValueChange={(v) => setFormData({ ...formData, tenantId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant._id} value={tenant._id}>
                        {tenant.name} - Room {tenant.roomId?.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  placeholder="+91 XXXXX XXXXX" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Purpose of Visit</Label>
                <Input 
                  placeholder="e.g., Family Visit, Delivery" 
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                />
              </div>
              <Button className="w-full btn-gradient" onClick={handleSubmit} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Registering...' : 'Register Entry'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Visitors</p>
                <p className="text-xl font-bold text-foreground">{todayVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently Inside</p>
                <p className="text-xl font-bold text-success">{visitorsInside}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Night Entries</p>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gate Passes</p>
                <p className="text-xl font-bold text-foreground">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitor Logs</TabsTrigger>
          <TabsTrigger value="night">Night Entries</TabsTrigger>
          <TabsTrigger value="gatepass">Gate Pass</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold">Visitor Log</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search visitors..." 
                    className="pl-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Visitor</TableHead>
                      <TableHead>Visiting</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitorLogs.filter(v => 
                      v.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((visitor) => (
                      <TableRow key={visitor._id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <p className="font-medium">{visitor.visitorName}</p>
                            <p className="text-sm text-muted-foreground">{visitor.relation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{visitor.tenantId?.name}</p>
                            <p className="text-sm text-muted-foreground">Room {visitor.tenantId?.roomId?.roomNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>
                          {new Date(visitor.entryTime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          {visitor.exitTime
                            ? new Date(visitor.exitTime).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {visitor.status === 'inside' ? (
                            <Badge className="bg-success/10 text-success border-success/20">Inside</Badge>
                          ) : (
                            <Badge variant="secondary">Exited</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {visitor.status === 'inside' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => exitMutation.mutate(visitor._id)}
                              disabled={exitMutation.isPending}
                            >
                              <LogOut className="w-4 h-4 mr-1" />
                              Mark Exit
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="night">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Night Entry Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">No night entry logs found</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gatepass">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Gate Pass Requests</CardTitle>
                <Dialog open={isAddGatePassOpen} onOpenChange={setIsAddGatePassOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Gate Pass</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Tenant</Label>
                        <Select 
                          value={gatePassFormData.tenantId} 
                          onValueChange={(v) => setGatePassFormData({ ...gatePassFormData, tenantId: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent>
                            {tenants.map((tenant: any) => (
                              <SelectItem key={tenant._id} value={tenant._id}>
                                {tenant.name} - Room {tenant.roomId?.roomNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Input 
                          placeholder="Reason for going out" 
                          value={gatePassFormData.reason}
                          onChange={(e) => setGatePassFormData({ ...gatePassFormData, reason: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Departure Time</Label>
                          <Input 
                            type="datetime-local"
                            value={gatePassFormData.departureTime}
                            onChange={(e) => setGatePassFormData({ ...gatePassFormData, departureTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expected Return</Label>
                          <Input 
                            type="datetime-local"
                            value={gatePassFormData.expectedReturn}
                            onChange={(e) => setGatePassFormData({ ...gatePassFormData, expectedReturn: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button className="w-full btn-gradient" onClick={handleGatePassSubmit} disabled={gatePassMutation.isPending}>
                        {gatePassMutation.isPending ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {gatePasses.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No gate pass requests found</div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Tenant</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Return</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gatePasses.map((pass: any) => (
                        <TableRow key={pass._id}>
                          <TableCell className="font-medium">{pass.tenantId?.name}</TableCell>
                          <TableCell>{pass.reason}</TableCell>
                          <TableCell>{new Date(pass.departureTime).toLocaleString()}</TableCell>
                          <TableCell>{pass.expectedReturn ? new Date(pass.expectedReturn).toLocaleString() : '-'}</TableCell>
                          <TableCell>
                            <Badge variant={pass.status === 'approved' ? 'default' : 'secondary'}>
                              {pass.status}
                            </Badge>
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
      </Tabs>
    </div>
  );
};

export default Security;
