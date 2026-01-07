import { useState } from 'react';
import { 
  Search, 
  Plus, 
  BedDouble,
  Users,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Filter
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

const rooms = [
  { id: 1, number: '101', floor: 1, type: 'Double', beds: 2, occupied: 2, rent: 7500, status: 'full', amenities: ['AC', 'Attached Bath'] },
  { id: 2, number: '102', floor: 1, type: 'Triple', beds: 3, occupied: 2, rent: 6500, status: 'partial', amenities: ['Fan', 'Common Bath'] },
  { id: 3, number: '103', floor: 1, type: 'Single', beds: 1, occupied: 0, rent: 9000, status: 'vacant', amenities: ['AC', 'Attached Bath', 'Balcony'] },
  { id: 4, number: '201', floor: 2, type: 'Double', beds: 2, occupied: 2, rent: 8000, status: 'full', amenities: ['AC', 'Attached Bath'] },
  { id: 5, number: '202', floor: 2, type: 'Double', beds: 2, occupied: 1, rent: 8000, status: 'partial', amenities: ['AC', 'Attached Bath'] },
  { id: 6, number: '203', floor: 2, type: 'Triple', beds: 3, occupied: 3, rent: 7000, status: 'full', amenities: ['AC', 'Common Bath'] },
  { id: 7, number: '301', floor: 3, type: 'Single', beds: 1, occupied: 1, rent: 9500, status: 'full', amenities: ['AC', 'Attached Bath', 'Balcony'] },
  { id: 8, number: '302', floor: 3, type: 'Double', beds: 2, occupied: 0, rent: 8500, status: 'vacant', amenities: ['AC', 'Attached Bath'] },
  { id: 9, number: '303', floor: 3, type: 'Triple', beds: 3, occupied: 1, rent: 7000, status: 'partial', amenities: ['Fan', 'Common Bath'] },
  { id: 10, number: '401', floor: 4, type: 'Single', beds: 1, occupied: 0, rent: 10000, status: 'vacant', amenities: ['AC', 'Attached Bath', 'Balcony', 'Study Table'] },
  { id: 11, number: '402', floor: 4, type: 'Double', beds: 2, occupied: 2, rent: 9000, status: 'full', amenities: ['AC', 'Attached Bath', 'Balcony'] },
  { id: 12, number: '403', floor: 4, type: 'Double', beds: 2, occupied: 1, rent: 8500, status: 'partial', amenities: ['AC', 'Attached Bath'] },
];

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.includes(searchQuery);
    const matchesFloor = floorFilter === 'all' || room.floor.toString() === floorFilter;
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    const matchesType = typeFilter === 'all' || room.type === typeFilter;
    return matchesSearch && matchesFloor && matchesStatus && matchesType;
  });

  const totalBeds = rooms.reduce((sum, r) => sum + r.beds, 0);
  const occupiedBeds = rooms.reduce((sum, r) => sum + r.occupied, 0);
  const vacantRooms = rooms.filter(r => r.status === 'vacant').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full':
        return 'bg-success text-success-foreground';
      case 'partial':
        return 'bg-warning text-warning-foreground';
      case 'vacant':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'full':
        return <Badge className="bg-success/10 text-success border-success/20">Fully Occupied</Badge>;
      case 'partial':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Partially Occupied</Badge>;
      case 'vacant':
        return <Badge className="bg-muted text-muted-foreground">Vacant</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage all rooms and bed allocations</p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
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
                  <SelectItem value="1">1st Floor</SelectItem>
                  <SelectItem value="2">2nd Floor</SelectItem>
                  <SelectItem value="3">3rd Floor</SelectItem>
                  <SelectItem value="4">4th Floor</SelectItem>
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
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="full">Fully Occupied</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="vacant">Vacant</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room, index) => (
          <Card 
            key={room.id} 
            className="stat-card hover:shadow-md transition-all animate-slide-up overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`h-1.5 ${getStatusColor(room.status)}`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Room {room.number}</h3>
                  <p className="text-sm text-muted-foreground">Floor {room.floor} • {room.type}</p>
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
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Bed Status */}
              <div className="flex gap-2 mb-3">
                {Array.from({ length: room.beds }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      i < room.occupied 
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
                    {room.occupied}/{room.beds} beds
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rent/bed</p>
                  <p className="text-sm font-semibold text-foreground">₹{room.rent.toLocaleString()}</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1 mb-3">
                {room.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="pt-3 border-t border-border">
                {getStatusBadge(room.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
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
