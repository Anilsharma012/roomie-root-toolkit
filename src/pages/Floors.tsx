import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Layers,
  Plus,
  BedDouble,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Floor {
  _id: string;
  floorNumber: number;
  name?: string;
  totalRooms?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  amenities?: string[];
}

const Floors = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFloor, setNewFloor] = useState({
    floorNumber: 0,
    name: '',
    amenities: ''
  });
  const [editingFloor, setEditingFloor] = useState<Floor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const editFloorMutation = useMutation({
    mutationFn: (data: { id: string; floorNumber: number; name: string; amenities: string[] }) => 
      api.put(`/floors/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/floors'] });
      setIsEditDialogOpen(false);
      setEditingFloor(null);
      toast({ title: 'Floor updated successfully!' });
    },
    onError: (err: any) => {
      toast({ title: 'Error updating floor', description: err.message, variant: 'destructive' });
    }
  });

  const handleEditFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFloor) return;
    const data = {
      id: editingFloor._id,
      floorNumber: editingFloor.floorNumber,
      name: editingFloor.name || `Floor ${editingFloor.floorNumber}`,
      amenities: Array.isArray(editingFloor.amenities) 
        ? editingFloor.amenities 
        : (editingFloor.amenities as any).split(',').map((a: string) => a.trim()).filter((a: string) => a)
    };
    editFloorMutation.mutate(data);
  };
  const queryClient = useQueryClient();

  const { data: floors = [], isLoading } = useQuery<Floor[]>({ 
    queryKey: ['/api/floors'] 
  });

  const addFloorMutation = useMutation({
    mutationFn: (data: any) => api.post('/floors', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/floors'] });
      setIsAddDialogOpen(false);
      setNewFloor({ floorNumber: 0, name: '', amenities: '' });
      toast({ title: 'Floor added successfully!' });
    },
    onError: (err: any) => {
      toast({ title: 'Error adding floor', description: err.message, variant: 'destructive' });
    }
  });

  const deleteFloorMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/floors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/floors'] });
      toast({ title: 'Floor deleted successfully' });
    }
  });

  const totalRooms = floors.reduce((sum, f) => sum + (f.totalRooms || 0), 0);
  const totalBeds = floors.reduce((sum, f) => sum + (f.totalBeds || 0), 0);
  const totalOccupied = floors.reduce((sum, f) => sum + (f.occupiedBeds || 0), 0);

  const handleAddFloor = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      floorNumber: newFloor.floorNumber,
      name: newFloor.name || `Floor ${newFloor.floorNumber}`,
      amenities: newFloor.amenities.split(',').map(a => a.trim()).filter(a => a)
    };
    addFloorMutation.mutate(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Floor Management</h1>
          <p className="text-muted-foreground mt-1">Manage floors and their configurations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Floor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Floor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddFloor} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="floorNumber">Floor Number</Label>
                <Input 
                  id="floorNumber"
                  type="number" 
                  value={newFloor.floorNumber}
                  onChange={(e) => setNewFloor({...newFloor, floorNumber: Number(e.target.value)})}
                  placeholder="e.g., 5" 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floorName">Floor Name (Optional)</Label>
                <Input 
                  id="floorName"
                  value={newFloor.name}
                  onChange={(e) => setNewFloor({...newFloor, name: e.target.value})}
                  placeholder="e.g., Fifth Floor" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input 
                  id="amenities"
                  value={newFloor.amenities}
                  onChange={(e) => setNewFloor({...newFloor, amenities: e.target.value})}
                  placeholder="TV Room, Study Area" 
                />
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={addFloorMutation.isPending}>
                {addFloorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Floor
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Floors</p>
                <p className="text-xl font-bold text-foreground">{floors.length}</p>
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
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-xl font-bold text-foreground">{totalRooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupied Beds</p>
                <p className="text-xl font-bold text-success">{totalOccupied}</p>
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
                <p className="text-sm text-muted-foreground">Vacant Beds</p>
                <p className="text-xl font-bold text-warning">{totalBeds - totalOccupied}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floor List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          floors.map((floor, index) => (
            <Card 
              key={floor._id} 
              className="stat-card hover:shadow-md transition-shadow animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate('/property/rooms')}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{floor.floorNumber}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{floor.name || `Floor ${floor.floorNumber}`}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {floor.amenities?.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="text-lg font-bold text-foreground">{floor.totalRooms || 0}</p>
                        <p className="text-xs text-muted-foreground">Rooms</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">{floor.totalBeds || 0}</p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-success">{floor.occupiedBeds || 0}</p>
                        <p className="text-xs text-muted-foreground">Occupied</p>
                      </div>
                    </div>

                    <div className="w-20">
                      <div className="text-center mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {floor.totalBeds ? Math.round(((floor.occupiedBeds || 0) / floor.totalBeds) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${floor.totalBeds ? ((floor.occupiedBeds || 0) / floor.totalBeds) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setEditingFloor(floor);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Floor
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFloorMutation.mutate(floor._id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Floor</DialogTitle>
          </DialogHeader>
          {editingFloor && (
            <form onSubmit={handleEditFloor} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-floorNumber">Floor Number</Label>
                <Input 
                  id="edit-floorNumber"
                  type="number" 
                  value={editingFloor.floorNumber}
                  onChange={(e) => setEditingFloor({...editingFloor, floorNumber: Number(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-floorName">Floor Name</Label>
                <Input 
                  id="edit-floorName"
                  value={editingFloor.name}
                  onChange={(e) => setEditingFloor({...editingFloor, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amenities">Amenities (comma separated)</Label>
                <Input 
                  id="edit-amenities"
                  value={Array.isArray(editingFloor.amenities) ? editingFloor.amenities.join(', ') : editingFloor.amenities}
                  onChange={(e) => setEditingFloor({...editingFloor, amenities: e.target.value as any})}
                />
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={editFloorMutation.isPending}>
                {editFloorMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Floors;
