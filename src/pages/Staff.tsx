import { useState } from 'react';
import { 
  Search, 
  Plus, 
  UserCog,
  Phone,
  Mail,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  IndianRupee,
  CheckCircle2,
  XCircle
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

const staffMembers = [
  {
    id: 1,
    name: 'Sunita Devi',
    role: 'Warden',
    phone: '+91 98765 11111',
    email: 'sunita@pg.com',
    joinDate: '2022-01-15',
    salary: 25000,
    shift: 'Day',
    status: 'present',
    address: 'Sector 15, Noida',
  },
  {
    id: 2,
    name: 'Ramesh Kumar',
    role: 'Security Guard',
    phone: '+91 98765 22222',
    email: 'ramesh@pg.com',
    joinDate: '2022-06-01',
    salary: 15000,
    shift: 'Night',
    status: 'present',
    address: 'Sector 12, Noida',
  },
  {
    id: 3,
    name: 'Geeta Sharma',
    role: 'Cook',
    phone: '+91 98765 33333',
    email: 'geeta@pg.com',
    joinDate: '2023-02-10',
    salary: 18000,
    shift: 'Day',
    status: 'present',
    address: 'Sector 18, Noida',
  },
  {
    id: 4,
    name: 'Lakshmi Bai',
    role: 'Cleaner',
    phone: '+91 98765 44444',
    email: 'lakshmi@pg.com',
    joinDate: '2023-05-20',
    salary: 12000,
    shift: 'Day',
    status: 'absent',
    address: 'Sector 10, Noida',
  },
  {
    id: 5,
    name: 'Mohan Singh',
    role: 'Security Guard',
    phone: '+91 98765 55555',
    email: 'mohan@pg.com',
    joinDate: '2023-08-01',
    salary: 15000,
    shift: 'Day',
    status: 'present',
    address: 'Sector 20, Noida',
  },
  {
    id: 6,
    name: 'Kamla Devi',
    role: 'Helper',
    phone: '+91 98765 66666',
    email: 'kamla@pg.com',
    joinDate: '2024-01-05',
    salary: 10000,
    shift: 'Day',
    status: 'leave',
    address: 'Sector 22, Noida',
  },
];

const attendanceData = [
  { date: '2024-02-01', present: 5, absent: 1, leave: 0 },
  { date: '2024-02-02', present: 6, absent: 0, leave: 0 },
  { date: '2024-02-03', present: 4, absent: 1, leave: 1 },
  { date: '2024-02-04', present: 5, absent: 0, leave: 1 },
  { date: '2024-02-05', present: 5, absent: 1, leave: 0 },
];

const Staff = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalSalary = staffMembers.reduce((sum, s) => sum + s.salary, 0);
  const presentToday = staffMembers.filter(s => s.status === 'present').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success/10 text-success border-success/20">Present</Badge>;
      case 'absent':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Absent</Badge>;
      case 'leave':
        return <Badge className="bg-warning/10 text-warning border-warning/20">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Warden': 'bg-primary/10 text-primary border-primary/20',
      'Security Guard': 'bg-accent/10 text-accent border-accent/20',
      'Cook': 'bg-warning/10 text-warning border-warning/20',
      'Cleaner': 'bg-muted text-muted-foreground',
      'Helper': 'bg-secondary text-secondary-foreground',
    };
    return <Badge className={colors[role] || 'bg-secondary'}>{role}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage PG staff, attendance & salaries</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Enter full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warden">Warden</SelectItem>
                      <SelectItem value="security">Security Guard</SelectItem>
                      <SelectItem value="cook">Cook</SelectItem>
                      <SelectItem value="cleaner">Cleaner</SelectItem>
                      <SelectItem value="helper">Helper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Shift</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Shift</SelectItem>
                      <SelectItem value="night">Night Shift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Monthly Salary (₹)</Label>
                <Input type="number" placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="Enter address" />
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddDialogOpen(false)}>
                Add Staff Member
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
                <UserCog className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-xl font-bold text-foreground">{staffMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-xl font-bold text-success">{presentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absent</p>
                <p className="text-xl font-bold text-destructive">
                  {staffMembers.filter(s => s.status === 'absent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-xl font-bold text-foreground">₹{(totalSalary / 1000)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="stat-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Warden">Warden</SelectItem>
                <SelectItem value="Security Guard">Security Guard</SelectItem>
                <SelectItem value="Cook">Cook</SelectItem>
                <SelectItem value="Cleaner">Cleaner</SelectItem>
                <SelectItem value="Helper">Helper</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStaff.map((staff, index) => (
          <Card 
            key={staff.id} 
            className="stat-card hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{staff.name}</h3>
                    {getRoleBadge(staff.role)}
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
                    <DropdownMenuItem>
                      <Calendar className="w-4 h-4 mr-2" />
                      Attendance
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{staff.shift} Shift</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(staff.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Salary</p>
                  <p className="text-lg font-bold text-foreground">₹{staff.salary.toLocaleString()}</p>
                </div>
                {getStatusBadge(staff.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Summary */}
      <Card className="stat-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {attendanceData.map((day) => (
              <div key={day.date} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-sm font-medium">{day.present}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-sm font-medium">{day.absent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
