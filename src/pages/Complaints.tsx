import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  MessageSquareWarning,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Complaint {
  _id: string;
  tenantId?: { _id: string; name: string };
  roomId?: { _id: string; roomNumber: string };
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: { _id: string; name: string };
  resolution: string;
  createdAt: string;
  updatedAt: string;
}

interface Tenant {
  _id: string;
  name: string;
  roomId?: { _id: string; roomNumber: string };
}

const Complaints = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    tenantId: '',
    category: 'other',
    title: '',
    description: '',
    priority: 'medium'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: complaints, isLoading } = useQuery<Complaint[]>({ queryKey: ['/api/complaints'] });
  const { data: tenants } = useQuery<Tenant[]>({ queryKey: ['/api/tenants'] });

  const addComplaintMutation = useMutation({
    mutationFn: (data: typeof newComplaint) => api.post('/complaints', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      setIsAddDialogOpen(false);
      setNewComplaint({ tenantId: '', category: 'other', title: '', description: '', priority: 'medium' });
      toast({ title: 'Complaint registered successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error registering complaint', description: error.message, variant: 'destructive' });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/complaints/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/complaints'] });
      toast({ title: 'Status updated!' });
    }
  });

  const filteredComplaints = (complaints || []).filter((complaint) => {
    const matchesSearch = 
      complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.tenantId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const openComplaints = (complaints || []).filter(c => c.status === 'open').length;
  const inProgressComplaints = (complaints || []).filter(c => c.status === 'in_progress').length;
  const resolvedComplaints = (complaints || []).filter(c => c.status === 'resolved').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><AlertCircle className="w-3 h-3 mr-1" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning/10 text-warning border-warning/20"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-success/10 text-success border-success/20"><CheckCircle2 className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return <Badge variant="destructive">{priority}</Badge>;
      case 'medium':
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    addComplaintMutation.mutate(newComplaint);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Complaints Management</h1>
          <p className="text-muted-foreground mt-1">Track and resolve tenant complaints</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-complaint">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New Complaint</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddComplaint} className="space-y-4 py-4">
              <div>
                <Label>Tenant</Label>
                <Select value={newComplaint.tenantId} onValueChange={(v) => setNewComplaint({ ...newComplaint, tenantId: v })}>
                  <SelectTrigger data-testid="select-tenant">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {(tenants || []).map(tenant => (
                      <SelectItem key={tenant._id} value={tenant._id}>
                        {tenant.name} {tenant.roomId ? `- Room ${tenant.roomId.roomNumber}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newComplaint.category} onValueChange={(v) => setNewComplaint({ ...newComplaint, category: v })}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleanliness">Cleanliness</SelectItem>
                      <SelectItem value="noise">Noise</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newComplaint.priority} onValueChange={(v) => setNewComplaint({ ...newComplaint, priority: v })}>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input 
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  placeholder="Brief subject of complaint"
                  required
                  data-testid="input-title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  rows={4}
                  data-testid="input-description"
                />
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={addComplaintMutation.isPending} data-testid="button-submit-complaint">
                {addComplaintMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Submit Complaint
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
                <MessageSquareWarning className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-complaints">{complaints?.length || 0}</p>
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
                <p className="text-xl font-bold text-destructive" data-testid="text-open-complaints">{openComplaints}</p>
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
                <p className="text-xl font-bold text-warning" data-testid="text-inprogress-complaints">{inProgressComplaints}</p>
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
                <p className="text-xl font-bold text-success" data-testid="text-resolved-complaints">{resolvedComplaints}</p>
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
                placeholder="Search by subject or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-complaints"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
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
                <SelectTrigger className="w-[140px]" data-testid="select-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cleanliness">Cleanliness</SelectItem>
                  <SelectItem value="noise">Noise</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint, index) => (
            <Card 
              key={complaint._id} 
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`card-complaint-${complaint._id}`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <MessageSquareWarning className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">{complaint._id.slice(-6).toUpperCase()}</span>
                        {getPriorityBadge(complaint.priority)}
                      </div>
                      <h3 className="font-semibold text-foreground">{complaint.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{complaint.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{complaint.tenantId?.name || 'Unknown Tenant'}</span>
                        <span>Room {complaint.roomId?.roomNumber || 'N/A'}</span>
                        <span className="capitalize">{complaint.category}</span>
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
                        <Button variant="outline" size="sm" data-testid={`button-actions-${complaint._id}`}>
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`menu-view-${complaint._id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {complaint.status === 'open' && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'in_progress' })}>
                            <Clock className="w-4 h-4 mr-2" />
                            Mark In Progress
                          </DropdownMenuItem>
                        )}
                        {complaint.status === 'in_progress' && (
                          <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: complaint._id, status: 'resolved' })}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredComplaints.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No complaints found. Everything is running smoothly!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Complaints;
