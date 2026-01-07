import { useState } from 'react';
import { 
  Layers,
  Plus,
  BedDouble,
  Users,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight
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

const floors = [
  { id: 1, name: 'Ground Floor', rooms: 10, beds: 20, occupied: 18, amenities: ['Dining Hall', 'Common Area'] },
  { id: 2, name: 'First Floor', rooms: 10, beds: 30, occupied: 28, amenities: ['TV Room'] },
  { id: 3, name: 'Second Floor', rooms: 10, beds: 30, occupied: 25, amenities: ['Study Room'] },
  { id: 4, name: 'Third Floor', rooms: 8, beds: 25, occupied: 22, amenities: ['Terrace Access'] },
  { id: 5, name: 'Fourth Floor', rooms: 7, beds: 15, occupied: 9, amenities: ['Rooftop Garden'] },
];

const Floors = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();

  const totalRooms = floors.reduce((sum, f) => sum + f.rooms, 0);
  const totalBeds = floors.reduce((sum, f) => sum + f.beds, 0);
  const totalOccupied = floors.reduce((sum, f) => sum + f.occupied, 0);

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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Floor Name</Label>
                <Input placeholder="e.g., Fifth Floor" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Rooms</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label>Total Beds</Label>
                  <Input type="number" placeholder="30" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amenities (comma separated)</Label>
                <Input placeholder="TV Room, Study Area" />
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddDialogOpen(false)}>
                Add Floor
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
        {floors.map((floor, index) => (
          <Card 
            key={floor.id} 
            className="stat-card hover:shadow-md transition-shadow animate-slide-up cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => navigate('/property/rooms')}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{floor.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{floor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {floor.amenities.map((amenity) => (
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
                      <p className="text-lg font-bold text-foreground">{floor.rooms}</p>
                      <p className="text-xs text-muted-foreground">Rooms</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">{floor.beds}</p>
                      <p className="text-xs text-muted-foreground">Beds</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-success">{floor.occupied}</p>
                      <p className="text-xs text-muted-foreground">Occupied</p>
                    </div>
                  </div>

                  <div className="w-20">
                    <div className="text-center mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {Math.round((floor.occupied / floor.beds) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(floor.occupied / floor.beds) * 100}%` }}
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
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Floor
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
        ))}
      </div>
    </div>
  );
};

export default Floors;
