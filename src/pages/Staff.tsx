import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  UserCog,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  _id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  shift: string;
  isActive: boolean;
  createdAt: string;
}

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'cleaner',
    phone: '',
    email: '',
    address: '',
    salary: 0,
    shift: 'day'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: staffMembers, isLoading } = useQuery<Staff[]>({ queryKey: ['/api/staff'] });

  const addStaffMutation = useMutation({
    mutationFn: (data: typeof newStaff) => api.post('/staff', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      setIsAddDialogOpen(false);
      setNewStaff({ name: '', role: 'cleaner', phone: '', email: '', address: '', salary: 0, shift: 'day' });
      toast({ title: 'Staff member added successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding staff', description: error.message, variant: 'destructive' });
    }
  });

  const deleteStaffMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/staff'] });
      toast({ title: 'Staff member removed!' });
    }
  });

  const filteredStaff = (staffMembers || []).filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffMutation.mutate(newStaff);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-muted text-muted-foreground">Inactive</Badge>;
      case 'on_leave':
        return <Badge className="bg-warning/10 text-warning border-warning/20">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const roles = ['warden', 'security', 'cook', 'cleaner', 'maintenance', 'manager', 'other'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage all PG staff members</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-staff">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  required
                  data-testid="input-staff-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Role</Label>
                  <Select value={newStaff.role} onValueChange={(v) => setNewStaff({ ...newStaff, role: v })}>
                    <SelectTrigger data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Shift</Label>
                  <Select value={newStaff.shift} onValueChange={(v) => setNewStaff({ ...newStaff, shift: v })}>
                    <SelectTrigger data-testid="select-shift">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  required
                  data-testid="input-staff-phone"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  data-testid="input-staff-email"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  data-testid="input-staff-address"
                />
              </div>
              <div>
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newStaff.salary}
                  onChange={(e) => setNewStaff({ ...newStaff, salary: Number(e.target.value) })}
                  data-testid="input-staff-salary"
                />
              </div>
              <Button type="submit" className="w-full" disabled={addStaffMutation.isPending} data-testid="button-submit-staff">
                {addStaffMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Staff Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-staff">{staffMembers?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-success">{(staffMembers || []).filter(s => s.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <UserCog className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-xl font-bold text-warning">{(staffMembers || []).filter(s => s.status === 'on_leave').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-lg font-bold text-accent">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payroll</p>
                <p className="text-xl font-bold text-foreground">
                  ₹{((staffMembers || []).reduce((sum, s) => sum + (s.salary || 0), 0) / 1000).toFixed(0)}K
                </p>
              </div>
            </div>
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
                data-testid="input-search-staff"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-role-filter">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStaff.map((staff, index) => (
            <Card 
              key={staff._id} 
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`card-staff-${staff._id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${staff._id}`}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`menu-edit-${staff._id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteStaffMutation.mutate(staff._id)}
                        data-testid={`menu-delete-${staff._id}`}
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
                    <span>{staff.phone}</span>
                  </div>
                  {staff.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{staff.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(staff.joinDate || staff.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-lg font-bold text-foreground">₹{staff.salary?.toLocaleString() || 0}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{staff.shift || 'Day'}</Badge>
                    {getStatusBadge(staff.status || 'active')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredStaff.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No staff members found. Add your first staff member to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Staff;
