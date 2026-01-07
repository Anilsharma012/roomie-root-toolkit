import { useState } from 'react';
import { 
  Search, 
  Plus, 
  IndianRupee,
  Calendar,
  Download,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  FileText,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const bills = [
  {
    id: 'INV-2024-001',
    tenant: 'Priya Sharma',
    room: '201',
    amount: 8500,
    dueDate: '2024-02-05',
    status: 'paid',
    paidDate: '2024-02-03',
    paymentMethod: 'UPI',
  },
  {
    id: 'INV-2024-002',
    tenant: 'Anita Verma',
    room: '105',
    amount: 7500,
    dueDate: '2024-02-05',
    status: 'paid',
    paidDate: '2024-02-05',
    paymentMethod: 'Cash',
  },
  {
    id: 'INV-2024-003',
    tenant: 'Meera Singh',
    room: '203',
    amount: 8500,
    dueDate: '2024-02-05',
    status: 'overdue',
    paidDate: null,
    paymentMethod: null,
  },
  {
    id: 'INV-2024-004',
    tenant: 'Ritu Gupta',
    room: '305',
    amount: 9000,
    dueDate: '2024-02-10',
    status: 'pending',
    paidDate: null,
    paymentMethod: null,
  },
  {
    id: 'INV-2024-005',
    tenant: 'Shalini Das',
    room: '108',
    amount: 7500,
    dueDate: '2024-02-05',
    status: 'partial',
    paidDate: '2024-02-04',
    paidAmount: 5000,
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'INV-2024-006',
    tenant: 'Pooja Reddy',
    room: '402',
    amount: 10000,
    dueDate: '2024-02-15',
    status: 'pending',
    paidDate: null,
    paymentMethod: null,
  },
];

const recentPayments = [
  { id: 1, tenant: 'Priya Sharma', amount: 8500, date: '2024-02-03', method: 'UPI' },
  { id: 2, tenant: 'Anita Verma', amount: 7500, date: '2024-02-05', method: 'Cash' },
  { id: 3, tenant: 'Shalini Das', amount: 5000, date: '2024-02-04', method: 'Bank Transfer' },
  { id: 4, tenant: 'Kavita Patel', amount: 8000, date: '2024-02-02', method: 'UPI' },
];

const Billing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('feb-2024');

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = 
      bill.tenant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.room.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalCollected = bills
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0) +
    bills
      .filter(b => b.status === 'partial')
      .reduce((sum, b) => sum + ((b as any).paidAmount || 0), 0);
  const totalPending = totalBilled - totalCollected;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-accent/10 text-accent border-accent/20">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Billing & Payments</h1>
          <p className="text-muted-foreground mt-1">Manage rent bills and track payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Generate Bills
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-xl font-bold text-foreground">₹{(totalBilled / 1000).toFixed(1)}K</p>
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
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-xl font-bold text-success">₹{(totalCollected / 1000).toFixed(1)}K</p>
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-warning">₹{(totalPending / 1000).toFixed(1)}K</p>
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
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-xl font-bold text-destructive">
                  {bills.filter(b => b.status === 'overdue').length} bills
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bills Table */}
        <Card className="stat-card lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Monthly Bills</CardTitle>
              <div className="flex gap-3">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-sm">{bill.id}</TableCell>
                      <TableCell>{bill.tenant}</TableCell>
                      <TableCell>{bill.room}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{bill.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(bill.dueDate).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Bill
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <IndianRupee className="w-4 h-4 mr-2" />
                              Record Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="stat-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{payment.tenant}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                      })} • {payment.method}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-success">+₹{payment.amount.toLocaleString()}</p>
              </div>
            ))}
            
            <Button variant="outline" className="w-full mt-2">
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="stat-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <FileText className="w-5 h-5" />
              <span className="text-sm">Generate All Bills</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Send className="w-5 h-5" />
              <span className="text-sm">Send Reminders</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <IndianRupee className="w-5 h-5" />
              <span className="text-sm">Record Payment</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
