import { useState } from 'react';
import { 
  UtensilsCrossed,
  Shirt,
  Sparkles,
  Wrench,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mealPlans = [
  { id: 1, name: 'Full Board', meals: 'Breakfast + Lunch + Dinner', price: 4500, subscribers: 65 },
  { id: 2, name: 'Half Board', meals: 'Breakfast + Dinner', price: 3000, subscribers: 25 },
  { id: 3, name: 'Breakfast Only', meals: 'Breakfast', price: 1500, subscribers: 10 },
];

const todayMenu = {
  breakfast: ['Poha', 'Tea/Coffee', 'Fruits'],
  lunch: ['Dal', 'Rice', 'Roti', 'Sabzi', 'Salad'],
  dinner: ['Paneer Curry', 'Rice', 'Roti', 'Raita'],
};

const laundryRequests = [
  { id: 1, tenant: 'Priya Sharma', room: '201', items: 8, status: 'collected', date: '2024-02-05' },
  { id: 2, tenant: 'Anita Verma', room: '105', items: 5, status: 'in_progress', date: '2024-02-05' },
  { id: 3, tenant: 'Meera Singh', room: '203', items: 10, status: 'ready', date: '2024-02-04' },
  { id: 4, tenant: 'Ritu Gupta', room: '305', items: 6, status: 'delivered', date: '2024-02-04' },
];

const housekeepingSchedule = [
  { room: '101', floor: 1, lastCleaned: '2024-02-05', nextScheduled: '2024-02-06', status: 'completed' },
  { room: '102', floor: 1, lastCleaned: '2024-02-05', nextScheduled: '2024-02-06', status: 'completed' },
  { room: '103', floor: 1, lastCleaned: '2024-02-04', nextScheduled: '2024-02-05', status: 'pending' },
  { room: '201', floor: 2, lastCleaned: '2024-02-05', nextScheduled: '2024-02-06', status: 'completed' },
  { room: '202', floor: 2, lastCleaned: '2024-02-04', nextScheduled: '2024-02-05', status: 'in_progress' },
];

const maintenanceRequests = [
  { id: 1, type: 'Electrical', description: 'Fan not working', room: '203', priority: 'high', status: 'pending', date: '2024-02-05' },
  { id: 2, type: 'Plumbing', description: 'Tap leakage', room: '105', priority: 'medium', status: 'in_progress', date: '2024-02-04' },
  { id: 3, type: 'Carpentry', description: 'Door lock broken', room: '301', priority: 'high', status: 'completed', date: '2024-02-03' },
  { id: 4, type: 'AC', description: 'AC servicing required', room: '402', priority: 'low', status: 'scheduled', date: '2024-02-06' },
];

const Services = () => {
  const [activeTab, setActiveTab] = useState('food');

  const getLaundryStatus = (status: string) => {
    switch (status) {
      case 'collected':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Collected</Badge>;
      case 'in_progress':
        return <Badge className="bg-accent/10 text-accent border-accent/20">In Progress</Badge>;
      case 'ready':
        return <Badge className="bg-success/10 text-success border-success/20">Ready</Badge>;
      case 'delivered':
        return <Badge variant="secondary">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Services & Facilities</h1>
          <p className="text-muted-foreground mt-1">Manage food, laundry, housekeeping & maintenance</p>
        </div>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'food' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Food/Mess</p>
                <p className="text-lg font-bold text-foreground">100 Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'laundry' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('laundry')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Shirt className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laundry</p>
                <p className="text-lg font-bold text-foreground">12 Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'housekeeping' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('housekeeping')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Housekeeping</p>
                <p className="text-lg font-bold text-foreground">8 Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card 
          className={`stat-card cursor-pointer transition-all ${activeTab === 'maintenance' ? 'border-primary' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maintenance</p>
                <p className="text-lg font-bold text-destructive">4 Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="hidden">
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="laundry">Laundry</TabsTrigger>
          <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Food/Mess */}
        <TabsContent value="food" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="stat-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Today's Menu</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Menu
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <h4 className="font-medium text-foreground mb-2">🌅 Breakfast</h4>
                  <p className="text-sm text-muted-foreground">{todayMenu.breakfast.join(', ')}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <h4 className="font-medium text-foreground mb-2">☀️ Lunch</h4>
                  <p className="text-sm text-muted-foreground">{todayMenu.lunch.join(', ')}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <h4 className="font-medium text-foreground mb-2">🌙 Dinner</h4>
                  <p className="text-sm text-muted-foreground">{todayMenu.dinner.join(', ')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Meal Plans</CardTitle>
                  <Button size="sm" className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {mealPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <h4 className="font-medium text-foreground">{plan.name}</h4>
                      <p className="text-sm text-muted-foreground">{plan.meals}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{plan.price}/mo</p>
                      <p className="text-xs text-muted-foreground">{plan.subscribers} subscribers</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Laundry */}
        <TabsContent value="laundry">
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Laundry Requests</CardTitle>
                <Button size="sm" className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Tenant</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laundryRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{request.tenant}</TableCell>
                        <TableCell>{request.room}</TableCell>
                        <TableCell>{request.items} items</TableCell>
                        <TableCell>
                          {new Date(request.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                        <TableCell>{getLaundryStatus(request.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Update</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Housekeeping */}
        <TabsContent value="housekeeping">
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Housekeeping Schedule</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter Floor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="1">Floor 1</SelectItem>
                    <SelectItem value="2">Floor 2</SelectItem>
                    <SelectItem value="3">Floor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Room</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Last Cleaned</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {housekeepingSchedule.map((schedule) => (
                      <TableRow key={schedule.room} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{schedule.room}</TableCell>
                        <TableCell>Floor {schedule.floor}</TableCell>
                        <TableCell>
                          {new Date(schedule.lastCleaned).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(schedule.nextScheduled).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                        <TableCell>
                          {schedule.status === 'completed' ? (
                            <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                          ) : schedule.status === 'in_progress' ? (
                            <Badge className="bg-accent/10 text-accent border-accent/20">In Progress</Badge>
                          ) : (
                            <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance">
          <Card className="stat-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Maintenance Requests</CardTitle>
                <Button size="sm" className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceRequests.map((request, index) => (
                  <div 
                    key={request.id} 
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      request.priority === 'high' ? 'bg-destructive/10' :
                      request.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'
                    }`}>
                      <Wrench className={`w-5 h-5 ${
                        request.priority === 'high' ? 'text-destructive' :
                        request.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{request.type}</Badge>
                        <Badge className={
                          request.priority === 'high' ? 'bg-destructive text-destructive-foreground' :
                          request.priority === 'medium' ? 'bg-warning text-warning-foreground' :
                          'bg-muted text-muted-foreground'
                        }>{request.priority}</Badge>
                      </div>
                      <p className="font-medium text-foreground">{request.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">Room {request.room}</p>
                    </div>
                    <div className="text-right">
                      {request.status === 'completed' ? (
                        <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>
                      ) : request.status === 'in_progress' ? (
                        <Badge className="bg-accent/10 text-accent border-accent/20">In Progress</Badge>
                      ) : request.status === 'scheduled' ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">Scheduled</Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(request.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
