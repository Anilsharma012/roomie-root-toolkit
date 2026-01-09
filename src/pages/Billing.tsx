import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  IndianRupee,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Bill {
  _id: string;
  billNumber: string;
  tenantId: { _id: string; name: string } | null;
  month: string;
  year: number;
  rentAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
}

interface Payment {
  _id: string;
  tenantId: { name: string };
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

const Billing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('january');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bills = [], isLoading } = useQuery<Bill[]>({ queryKey: ['/api/billing'] });
  const { data: payments = [] } = useQuery<Payment[]>({ queryKey: ['/api/payments'] });

  const generateMutation = useMutation({
    mutationFn: async (data: { month: string; year: number }) => {
      return api.post('/billing/generate', data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      setIsGenerateDialogOpen(false);
      toast({ title: 'Bills Generated', description: data.message });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/billing/export', { credentials: 'include' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'billing-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export successful' });
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' });
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = 
      bill.tenantId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalCollected = bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const totalPending = bills.reduce((sum, b) => sum + (b.dueAmount || 0), 0);
  const overdueCount = bills.filter(b => b.status === 'overdue').length;

  const recentPayments = payments.slice(0, 4);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Billing & Payments</h1>
          <p className="text-muted-foreground mt-1">Manage rent bills and track payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient" data-testid="button-generate-bills">
                <Plus className="w-4 h-4 mr-2" />
                Generate Bills
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Monthly Bills</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger data-testid="select-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                        <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                    <SelectTrigger data-testid="select-year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full btn-gradient" 
                  onClick={() => generateMutation.mutate({ month: selectedMonth, year: selectedYear })}
                  disabled={generateMutation.isPending}
                  data-testid="button-confirm-generate"
                >
                  {generateMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    'Generate Bills for All Active Tenants'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Billed</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-billed">₹{(totalBilled / 1000).toFixed(1)}K</p>
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
                <p className="text-xl font-bold text-success" data-testid="text-collected">₹{(totalCollected / 1000).toFixed(1)}K</p>
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
                <p className="text-xl font-bold text-warning" data-testid="text-pending">₹{(totalPending / 1000).toFixed(1)}K</p>
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
                <p className="text-xl font-bold text-destructive" data-testid="text-overdue">{overdueCount} bills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
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
                    data-testid="input-search"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32" data-testid="select-status">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bills found. Click "Generate Bills" to create bills for active tenants.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBills.map((bill) => (
                      <TableRow key={bill._id} data-testid={`row-bill-${bill._id}`}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell>{bill.tenantId?.name || 'Unknown'}</TableCell>
                        <TableCell>₹{bill.totalAmount?.toLocaleString()}</TableCell>
                        <TableCell>
                          {bill.dueDate ? format(new Date(bill.dueDate), 'd MMM') : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(bill.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Record Payment</DropdownMenuItem>
                              <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPayments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent payments</p>
            ) : (
              recentPayments.map((payment) => (
                <div key={payment._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{payment.tenantId?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(payment.paymentDate), 'd MMM')} - {payment.paymentMethod}
                    </p>
                  </div>
                  <p className="font-semibold text-success">+₹{payment.amount?.toLocaleString()}</p>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full mt-4" data-testid="button-view-all-payments">
              View All Payments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
