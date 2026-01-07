import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Download
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

const tenants = [
  {
    id: 1,
    name: 'Priya Sharma',
    room: '201',
    bed: 'A',
    phone: '+91 98765 43210',
    email: 'priya.sharma@email.com',
    joinDate: '2024-01-15',
    rent: 8500,
    status: 'active',
    photo: null,
    city: 'Jaipur',
    kycStatus: 'verified',
  },
  {
    id: 2,
    name: 'Anita Verma',
    room: '105',
    bed: 'B',
    phone: '+91 87654 32109',
    email: 'anita.v@email.com',
    joinDate: '2024-02-01',
    rent: 7500,
    status: 'active',
    photo: null,
    city: 'Delhi',
    kycStatus: 'verified',
  },
  {
    id: 3,
    name: 'Meera Singh',
    room: '203',
    bed: 'A',
    phone: '+91 76543 21098',
    email: 'meera.s@email.com',
    joinDate: '2023-11-20',
    rent: 8500,
    status: 'due',
    photo: null,
    city: 'Mumbai',
    kycStatus: 'pending',
  },
  {
    id: 4,
    name: 'Ritu Gupta',
    room: '305',
    bed: 'C',
    phone: '+91 65432 10987',
    email: 'ritu.g@email.com',
    joinDate: '2024-01-01',
    rent: 9000,
    status: 'active',
    photo: null,
    city: 'Lucknow',
    kycStatus: 'verified',
  },
  {
    id: 5,
    name: 'Shalini Das',
    room: '108',
    bed: 'A',
    phone: '+91 54321 09876',
    email: 'shalini.d@email.com',
    joinDate: '2023-12-10',
    rent: 7500,
    status: 'notice',
    photo: null,
    city: 'Kolkata',
    kycStatus: 'verified',
  },
  {
    id: 6,
    name: 'Pooja Reddy',
    room: '402',
    bed: 'B',
    phone: '+91 43210 98765',
    email: 'pooja.r@email.com',
    joinDate: '2024-02-15',
    rent: 10000,
    status: 'active',
    photo: null,
    city: 'Hyderabad',
    kycStatus: 'verified',
  },
];

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.room.includes(searchQuery) ||
      tenant.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesFloor = floorFilter === 'all' || tenant.room.charAt(0) === floorFilter;
    return matchesSearch && matchesStatus && matchesFloor;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'due':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Due</Badge>;
      case 'notice':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Notice Period</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">Manage all your PG tenants in one place</p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add New Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tenants</p>
            <p className="text-2xl font-bold text-foreground mt-1">102</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success mt-1">85</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">With Dues</p>
            <p className="text-2xl font-bold text-destructive mt-1">12</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On Notice</p>
            <p className="text-2xl font-bold text-warning mt-1">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="stat-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, room, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="due">With Dues</SelectItem>
                  <SelectItem value="notice">On Notice</SelectItem>
                </SelectContent>
              </Select>
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  <SelectItem value="1">1st Floor</SelectItem>
                  <SelectItem value="2">2nd Floor</SelectItem>
                  <SelectItem value="3">3rd Floor</SelectItem>
                  <SelectItem value="4">4th Floor</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTenants.map((tenant, index) => (
          <Card 
            key={tenant.id} 
            className="stat-card hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
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
                      Room {tenant.room} • Bed {tenant.bed}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{tenant.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(tenant.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="text-lg font-bold text-foreground">₹{tenant.rent.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {tenant.kycStatus === 'verified' ? (
                    <Badge variant="outline" className="text-xs">KYC ✓</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-warning border-warning">KYC Pending</Badge>
                  )}
                  {getStatusBadge(tenant.status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tenants found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tenants;
