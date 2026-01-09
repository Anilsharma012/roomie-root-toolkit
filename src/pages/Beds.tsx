import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  BedDouble, 
  Search,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Bed {
  _id: string;
  bedNumber: string;
  roomId?: { _id: string; roomNumber: string };
  tenantId?: { _id: string; name: string };
  status: 'vacant' | 'occupied' | 'maintenance';
  monthlyRent: number;
  isActive: boolean;
}

interface Room {
  _id: string;
  roomNumber: string;
}

const Beds = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBed, setNewBed] = useState({ bedNumber: '', roomId: '', monthlyRent: 0 });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: beds, isLoading } = useQuery<Bed[]>({ queryKey: ['/api/beds'] });
  const { data: rooms } = useQuery<Room[]>({ queryKey: ['/api/rooms'] });

  const addBedMutation = useMutation({
    mutationFn: (data: typeof newBed) => api.post('/beds', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/beds'] });
      setIsAddDialogOpen(false);
      setNewBed({ bedNumber: '', roomId: '', monthlyRent: 0 });
      toast({ title: 'Bed added successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding bed', description: error.message, variant: 'destructive' });
    }
  });

  const deleteBedMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/beds/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/beds'] });
      toast({ title: 'Bed deleted successfully!' });
    }
  });

  const filteredBeds = (beds || []).filter((bed) => {
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.roomId?.roomNumber?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const vacantCount = (beds || []).filter(b => b.status === 'vacant').length;
  const occupiedCount = (beds || []).filter(b => b.status === 'occupied').length;

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    addBedMutation.mutate(newBed);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vacant':
        return <Badge className="bg-success/10 text-success border-success/20">Vacant</Badge>;
      case 'occupied':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Beds Management</h1>
          <p className="text-muted-foreground mt-1">Manage all beds across rooms</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-bed">
              <Plus className="w-4 h-4 mr-2" />
              Add Bed
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bed</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBed} className="space-y-4">
              <div>
                <Label htmlFor="bedNumber">Bed Number</Label>
                <Input
                  id="bedNumber"
                  value={newBed.bedNumber}
                  onChange={(e) => setNewBed({ ...newBed, bedNumber: e.target.value })}
                  placeholder="e.g., A, B, C"
                  required
                  data-testid="input-bed-number"
                />
              </div>
              <div>
                <Label htmlFor="room">Room</Label>
                <Select value={newBed.roomId} onValueChange={(v) => setNewBed({ ...newBed, roomId: v })}>
                  <SelectTrigger data-testid="select-room">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rooms || []).map(room => (
                      <SelectItem key={room._id} value={room._id}>Room {room.roomNumber}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rent">Monthly Rent</Label>
                <Input
                  id="rent"
                  type="number"
                  value={newBed.monthlyRent}
                  onChange={(e) => setNewBed({ ...newBed, monthlyRent: Number(e.target.value) })}
                  data-testid="input-rent"
                />
              </div>
              <Button type="submit" className="w-full" disabled={addBedMutation.isPending} data-testid="button-submit-bed">
                {addBedMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Add Bed
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
                <BedDouble className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-beds">{beds?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vacant</p>
                <p className="text-xl font-bold text-success" data-testid="text-vacant-beds">{vacantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-occupied-beds">{occupiedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-xl font-bold text-warning">{(beds || []).filter(b => b.status === 'maintenance').length}</p>
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
                placeholder="Search beds or rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-beds"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
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
          {filteredBeds.map((bed, index) => (
            <Card 
              key={bed._id} 
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`card-bed-${bed._id}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      bed.status === 'vacant' ? 'bg-success/10' : 
                      bed.status === 'occupied' ? 'bg-primary/10' : 'bg-warning/10'
                    }`}>
                      <BedDouble className={`w-6 h-6 ${
                        bed.status === 'vacant' ? 'text-success' : 
                        bed.status === 'occupied' ? 'text-primary' : 'text-warning'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Bed {bed.bedNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        Room {bed.roomId?.roomNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${bed._id}`}>
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`menu-edit-${bed._id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteBedMutation.mutate(bed._id)}
                        data-testid={`menu-delete-${bed._id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    {bed.tenantId ? (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{bed.tenantId.name}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tenant assigned</p>
                    )}
                  </div>
                  {getStatusBadge(bed.status)}
                </div>

                {bed.monthlyRent > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                    <p className="font-bold text-foreground">₹{bed.monthlyRent?.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredBeds.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No beds found. Add your first bed to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Beds;
