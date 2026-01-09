import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  BedDouble,
  Users,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Filter,
  Loader2
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
  DropdownMenuTrigger as DropdownTrigger,
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
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Room {
  _id: string;
  roomNumber: string;
  floorId: { _id: string; floorNumber: number };
  type: string;
  capacity: number;
  occupiedBeds: number;
  baseRent: number;
  status: string;
  amenities: string[];
}

interface Floor {
  _id: string;
  floorNumber: number;
}

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    floorId: '',
    type: 'Double',
    capacity: 2,
    baseRent: 0,
    amenities: [] as string[]
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery<Room[]>({ queryKey: ['/api/rooms'] });
  const { data: floors = [] } = useQuery<Floor[]>({ queryKey: ['/api/floors'] });

  const addRoomMutation = useMutation({
    mutationFn: (data: typeof newRoom) => api.post('/rooms', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      setIsAddDialogOpen(false);
      setNewRoom({
        roomNumber: '',
        floorId: '',
        type: 'Double',
        capacity: 2,
        baseRent: 0,
        amenities: []
      });
      toast({ title: 'Room added successfully!' });
    },
    onError: (err: any) => {
      toast({ title: 'Error adding room', description: err.message, variant: 'destructive' });
    }
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/rooms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rooms'] });
      toast({ title: 'Room deleted successfully' });
    }
  });

  const filteredRooms = (rooms || []).filter((room) => {
    const matchesSearch = room.roomNumber.includes(searchQuery);
    const matchesFloor = floorFilter === 'all' || room.floorId?._id === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesFloor && matchesStatus && matchesType;
  });

  const totalBeds = (rooms || []).reduce((sum, r) => sum + r.capacity, 0);
  const occupiedBeds = (rooms || []).reduce((sum, r) => sum + (r.occupiedBeds || 0), 0);
  const vacantRooms = (rooms || []).filter(r => r.status === 'available' || r.occupiedBeds === 0).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-success text-success-foreground';
      case 'available':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (room: Room) => {
    if (room.occupiedBeds >= room.capacity) {
      return <Badge className="bg-success/10 text-success border-success/20">Fully Occupied</Badge>;
    }
    if (room.occupiedBeds > 0) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Partially Occupied</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Vacant</Badge>;
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.floorId) {
      toast({ title: 'Please select a floor', variant: 'destructive' });
      return;
    }
    addRoomMutation.mutate(newRoom);
  };

  const toggleAmenity = (amenity: string) => {
    setNewRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage all rooms and bed allocations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddRoom} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input 
                    id="roomNumber" 
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                    placeholder="e.g. 101" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Select value={newRoom.floorId} onValueChange={(v) => setNewRoom({...newRoom, floorId: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>
                    <SelectContent>
                      {floors.map(floor => (
                        <SelectItem key={floor._id} value={floor._id}>Floor {floor.floorNumber}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Room Type</Label>
                  <Select value={newRoom.type} onValueChange={(v) => setNewRoom({...newRoom, type: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Triple">Triple</SelectItem>
                      <SelectItem value="Four">Four Bed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Beds)</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({...newRoom, capacity: Number(e.target.value)})}
                    min="1" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent">Base Rent</Label>
                <Input 
                  id="rent" 
                  type="number"
                  value={newRoom.baseRent}
                  onChange={(e) => setNewRoom({...newRoom, baseRent: Number(e.target.value)})}
                  placeholder="₹ Monthly rent" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['AC', 'Attached Bath', 'Balcony', 'Study Table', 'Fan', 'Common Bath'].map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity} 
                        checked={newRoom.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm font-normal">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full btn-gradient" disabled={addRoomMutation.isPending}>
                {addRoomMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Add Room
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
                <BedDouble className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-xl font-bold text-foreground">{rooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-xl font-bold text-foreground">{totalBeds}</p>
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
                <p className="text-sm text-muted-foreground">Occupied</p>
                <p className="text-xl font-bold text-success">{occupiedBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vacant Rooms</p>
                <p className="text-xl font-bold text-foreground">{vacantRooms}</p>
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
                placeholder="Search room number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={floorFilter} onValueChange={setFloorFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {floors.map(f => (
                    <SelectItem key={f._id} value={f._id}>Floor {f.floorNumber}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                  <SelectItem value="Triple">Triple</SelectItem>
                  <SelectItem value="Four">Four Bed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="occupied">Fully Occupied</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room, index) => (
            <Card 
              key={room._id} 
              className="stat-card hover:shadow-md transition-all animate-slide-up overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`h-1.5 ${getStatusColor(room.status)}`} />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Room {room.roomNumber}</h3>
                    <p className="text-sm text-muted-foreground">Floor {room.floorId?.floorNumber} • {room.type}</p>
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
                        Edit Room
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteRoomMutation.mutate(room._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Bed Status */}
                <div className="flex gap-2 mb-3">
                  {Array.from({ length: room.capacity }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        i < room.occupiedBeds 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      Bed {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
                    <p className="text-sm font-semibold text-foreground">
                      {room.occupiedBeds}/{room.capacity} beds
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rent/bed</p>
                    <p className="text-sm font-semibold text-foreground">₹{room.baseRent?.toLocaleString()}</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {room.amenities?.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <div className="pt-3 border-t border-border">
                  {getStatusBadge(room)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredRooms.length === 0 && (
        <Card className="stat-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No rooms found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Rooms;
