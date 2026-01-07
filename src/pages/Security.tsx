import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Shield,
  UserCheck,
  Clock,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  LogIn,
  LogOut,
  Moon,
  FileText
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const visitorLogs = [
  {
    id: 1,
    visitorName: 'Rajesh Kumar',
    relation: 'Father',
    visitingTenant: 'Priya Sharma',
    room: '201',
    purpose: 'Family Visit',
    phone: '+91 98765 00001',
    entryTime: '2024-02-05T10:30:00',
    exitTime: '2024-02-05T14:00:00',
    idType: 'Aadhar Card',
    status: 'exited',
  },
  {
    id: 2,
    visitorName: 'Sunita Devi',
    relation: 'Mother',
    visitingTenant: 'Anita Verma',
    room: '105',
    purpose: 'Family Visit',
    phone: '+91 98765 00002',
    entryTime: '2024-02-05T11:00:00',
    exitTime: null,
    idType: 'Voter ID',
    status: 'inside',
  },
  {
    id: 3,
    visitorName: 'Delivery Boy',
    relation: 'N/A',
    visitingTenant: 'Meera Singh',
    room: '203',
    purpose: 'Parcel Delivery',
    phone: '+91 98765 00003',
    entryTime: '2024-02-05T12:15:00',
    exitTime: '2024-02-05T12:20:00',
    idType: 'Company ID',
    status: 'exited',
  },
  {
    id: 4,
    visitorName: 'Dr. Sharma',
    relation: 'N/A',
    visitingTenant: 'Ritu Gupta',
    room: '305',
    purpose: 'Medical Checkup',
    phone: '+91 98765 00004',
    entryTime: '2024-02-05T09:00:00',
    exitTime: '2024-02-05T09:45:00',
    idType: 'Medical License',
    status: 'exited',
  },
];

const nightEntryLogs = [
  {
    id: 1,
    tenant: 'Priya Sharma',
    room: '201',
    entryTime: '2024-02-04T22:30:00',
    reason: 'Late from office',
    approvedBy: 'Warden',
  },
  {
    id: 2,
    tenant: 'Meera Singh',
    room: '203',
    entryTime: '2024-02-04T23:15:00',
    reason: 'Movie with friends',
    approvedBy: 'Warden',
  },
  {
    id: 3,
    tenant: 'Pooja Reddy',
    room: '402',
    entryTime: '2024-02-03T21:45:00',
    reason: 'Family dinner',
    approvedBy: 'Warden',
  },
];

const gatePassRequests = [
  {
    id: 1,
    tenant: 'Anita Verma',
    room: '105',
    type: 'Weekend',
    fromDate: '2024-02-10',
    toDate: '2024-02-11',
    destination: 'Delhi',
    status: 'approved',
  },
  {
    id: 2,
    tenant: 'Shalini Das',
    room: '108',
    type: 'Emergency',
    fromDate: '2024-02-06',
    toDate: '2024-02-08',
    destination: 'Kolkata',
    status: 'pending',
  },
  {
    id: 3,
    tenant: 'Ritu Gupta',
    room: '305',
    type: 'Holiday',
    fromDate: '2024-02-15',
    toDate: '2024-02-20',
    destination: 'Lucknow',
    status: 'approved',
  },
];

const Security = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);

  const visitorsInside = visitorLogs.filter(v => v.status === 'inside').length;
  const todayVisitors = visitorLogs.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Security & Visitors</h1>
          <p className="text-muted-foreground mt-1">Manage visitor entries and security logs</p>
        </div>
        <Dialog open={isAddVisitorOpen} onOpenChange={setIsAddVisitorOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Visitor Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register Visitor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Visitor Name</Label>
                <Input placeholder="Enter visitor name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Relation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ID Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aadhar">Aadhar Card</SelectItem>
                      <SelectItem value="voter">Voter ID</SelectItem>
                      <SelectItem value="dl">Driving License</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Visiting Tenant</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="priya">Priya Sharma - Room 201</SelectItem>
                    <SelectItem value="anita">Anita Verma - Room 105</SelectItem>
                    <SelectItem value="meera">Meera Singh - Room 203</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="space-y-2">
                <Label>Purpose of Visit</Label>
                <Input placeholder="e.g., Family Visit, Delivery" />
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddVisitorOpen(false)}>
                Register Entry
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
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Visitors</p>
                <p className="text-xl font-bold text-foreground">{todayVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currently Inside</p>
                <p className="text-xl font-bold text-success">{visitorsInside}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Moon className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Night Entries</p>
                <p className="text-xl font-bold text-foreground">{nightEntryLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gate Passes</p>
                <p className="text-xl font-bold text-foreground">{gatePassRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitor Logs</TabsTrigger>
          <TabsTrigger value="night">Night Entries</TabsTrigger>
          <TabsTrigger value="gatepass">Gate Pass</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg font-semibold">Visitor Log</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search visitors..." className="pl-10" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Visitor</TableHead>
                      <TableHead>Visiting</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Entry</TableHead>
                      <TableHead>Exit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitorLogs.map((visitor) => (
                      <TableRow key={visitor.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <p className="font-medium">{visitor.visitorName}</p>
                            <p className="text-sm text-muted-foreground">{visitor.relation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{visitor.visitingTenant}</p>
                            <p className="text-sm text-muted-foreground">Room {visitor.room}</p>
                          </div>
                        </TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>
                          {new Date(visitor.entryTime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>
                          {visitor.exitTime
                            ? new Date(visitor.exitTime).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {visitor.status === 'inside' ? (
                            <Badge className="bg-success/10 text-success border-success/20">Inside</Badge>
                          ) : (
                            <Badge variant="secondary">Exited</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            {visitor.status === 'inside' ? (
                              <>
                                <LogOut className="w-4 h-4 mr-1" />
                                Mark Exit
                              </>
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
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

        <TabsContent value="night">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Night Entry Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Tenant</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Entry Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Approved By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nightEntryLogs.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{entry.tenant}</TableCell>
                        <TableCell>{entry.room}</TableCell>
                        <TableCell>
                          {new Date(entry.entryTime).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{entry.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.approvedBy}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gatepass">
          <Card className="stat-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Gate Pass Requests</CardTitle>
                <Button variant="outline" size="sm">
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
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gatePassRequests.map((pass) => (
                      <TableRow key={pass.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div>
                            <p className="font-medium">{pass.tenant}</p>
                            <p className="text-sm text-muted-foreground">Room {pass.room}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{pass.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(pass.fromDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(pass.toDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </TableCell>
                        <TableCell>{pass.destination}</TableCell>
                        <TableCell>
                          {pass.status === 'approved' ? (
                            <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>
                          ) : (
                            <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {pass.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-success">
                                Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-destructive">
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;
