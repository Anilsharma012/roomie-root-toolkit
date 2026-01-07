import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit,
  MessageSquare,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

const complaints = [
  {
    id: 'CMP-001',
    tenant: 'Priya Sharma',
    room: '201',
    category: 'Electrical',
    subject: 'AC not working properly',
    description: 'The AC in my room is making strange noise and not cooling properly.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-02-05T10:30:00',
    updatedAt: '2024-02-05T10:30:00',
  },
  {
    id: 'CMP-002',
    tenant: 'Anita Verma',
    room: '105',
    category: 'Plumbing',
    subject: 'Water leakage in bathroom',
    description: 'There is water leakage from the tap in the bathroom.',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-02-04T14:20:00',
    updatedAt: '2024-02-05T09:00:00',
  },
  {
    id: 'CMP-003',
    tenant: 'Meera Singh',
    room: '203',
    category: 'Housekeeping',
    subject: 'Room cleaning not done',
    description: 'My room was not cleaned for the last 2 days.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-02-03T08:15:00',
    updatedAt: '2024-02-04T16:00:00',
  },
  {
    id: 'CMP-004',
    tenant: 'Ritu Gupta',
    room: '305',
    category: 'Food',
    subject: 'Food quality issue',
    description: 'The food served yesterday was not fresh and caused stomach upset.',
    status: 'open',
    priority: 'high',
    createdAt: '2024-02-05T07:00:00',
    updatedAt: '2024-02-05T07:00:00',
  },
  {
    id: 'CMP-005',
    tenant: 'Shalini Das',
    room: '108',
    category: 'Security',
    subject: 'Main gate lock broken',
    description: 'The main gate lock is broken and needs immediate repair.',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2024-02-04T22:30:00',
    updatedAt: '2024-02-05T08:00:00',
  },
  {
    id: 'CMP-006',
    tenant: 'Pooja Reddy',
    room: '402',
    category: 'Electrical',
    subject: 'Fan making noise',
    description: 'The ceiling fan in my room is making clicking noise.',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-02-02T11:45:00',
    updatedAt: '2024-02-03T14:00:00',
  },
];

const Complaints = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openComplaints = complaints.filter(c => c.status === 'open').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Electrical': '⚡',
      'Plumbing': '🔧',
      'Housekeeping': '🧹',
      'Food': '🍽️',
      'Security': '🔒',
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Complaints Management</h1>
          <p className="text-muted-foreground mt-1">Track and resolve tenant complaints</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Complaint</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tenant</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priya">Priya Sharma - 201</SelectItem>
                      <SelectItem value="anita">Anita Verma - 105</SelectItem>
                      <SelectItem value="meera">Meera Singh - 203</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="housekeeping">Housekeeping</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input placeholder="Brief subject of complaint" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Detailed description of the issue..." rows={4} />
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddDialogOpen(false)}>
                Submit Complaint
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
                <MessageSquareWarning className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{complaints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-xl font-bold text-destructive">{openComplaints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold text-warning">{inProgressComplaints}</p>
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
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold text-success">{resolvedComplaints}</p>
              </div>
            </div>
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
                placeholder="Search by ID, tenant, or subject..."
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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Plumbing">Plumbing</SelectItem>
                  <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint, index) => (
          <Card 
            key={complaint.id} 
            className="stat-card hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    {getCategoryIcon(complaint.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">{complaint.id}</span>
                      {getPriorityBadge(complaint.priority)}
                    </div>
                    <h3 className="font-semibold text-foreground">{complaint.subject}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>👤 {complaint.tenant}</span>
                      <span>🚪 Room {complaint.room}</span>
                      <span>📁 {complaint.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(complaint.status)}
                  <p className="text-xs text-muted-foreground">
                    {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Comment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComplaints.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No complaints found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Complaints;
