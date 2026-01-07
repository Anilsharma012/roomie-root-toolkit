import { useState } from 'react';
import { 
  Building2,
  Plus,
  MapPin,
  Phone,
  Users,
  BedDouble,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Settings
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
import { Textarea } from '@/components/ui/textarea';

const pgList = [
  {
    id: 1,
    name: 'Parameshwari Girls PG - Main',
    address: 'Sector 15, Noida, UP - 201301',
    phone: '+91 98765 43210',
    floors: 4,
    totalRooms: 40,
    totalBeds: 120,
    occupiedBeds: 102,
    status: 'active',
  },
  {
    id: 2,
    name: 'Parameshwari Girls PG - Branch 2',
    address: 'Sector 18, Noida, UP - 201301',
    phone: '+91 98765 43211',
    floors: 3,
    totalRooms: 25,
    totalBeds: 75,
    occupiedBeds: 68,
    status: 'active',
  },
];

const PGList = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">PG Properties</h1>
          <p className="text-muted-foreground mt-1">Manage all your PG properties</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add New PG
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New PG Property</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>PG Name</Label>
                <Input placeholder="Enter PG name" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea placeholder="Enter full address" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Total Floors</Label>
                  <Input type="number" placeholder="4" />
                </div>
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddDialogOpen(false)}>
                Add Property
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
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-xl font-bold text-foreground">{pgList.length}</p>
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
                <p className="text-sm text-muted-foreground">Total Beds</p>
                <p className="text-xl font-bold text-foreground">
                  {pgList.reduce((sum, pg) => sum + pg.totalBeds, 0)}
                </p>
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
                <p className="text-xl font-bold text-success">
                  {pgList.reduce((sum, pg) => sum + pg.occupiedBeds, 0)}
                </p>
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
                <p className="text-sm text-muted-foreground">Vacant</p>
                <p className="text-xl font-bold text-warning">
                  {pgList.reduce((sum, pg) => sum + (pg.totalBeds - pg.occupiedBeds), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PG Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pgList.map((pg, index) => (
          <Card 
            key={pg.id} 
            className="stat-card hover:shadow-md transition-shadow animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{pg.name}</h3>
                    <Badge className="bg-success/10 text-success border-success/20 mt-1">
                      {pg.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
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
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{pg.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{pg.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{pg.floors}</p>
                  <p className="text-xs text-muted-foreground">Floors</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{pg.totalRooms}</p>
                  <p className="text-xs text-muted-foreground">Rooms</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{pg.totalBeds}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-success">{pg.occupiedBeds}</p>
                  <p className="text-xs text-muted-foreground">Occupied</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-medium text-foreground">
                    {Math.round((pg.occupiedBeds / pg.totalBeds) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(pg.occupiedBeds / pg.totalBeds) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PGList;
