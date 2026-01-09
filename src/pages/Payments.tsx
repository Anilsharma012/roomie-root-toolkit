import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search,
  Plus,
  IndianRupee,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Receipt
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

interface Payment {
  _id: string;
  tenantId: { _id: string; name: string };
  billingId?: { billNumber: string };
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId: string;
  receiptNumber: string;
  type: string;
}

interface Tenant {
  _id: string;
  name: string;
}

interface Bill {
  _id: string;
  billNumber: string;
  tenantId: { _id: string; name: string };
  dueAmount: number;
}

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: '',
    billingId: '',
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery<Payment[]>({ queryKey: ['/api/payments'] });
  const { data: tenants = [] } = useQuery<Tenant[]>({ queryKey: ['/api/tenants'] });
  const { data: pendingBills = [] } = useQuery<Bill[]>({ queryKey: ['/api/billing/pending'] });

  const addPaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/payments', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/pending'] });
      setIsAddDialogOpen(false);
      setFormData({ tenantId: '', billingId: '', amount: '', paymentMethod: 'cash', transactionId: '', notes: '' });
      toast({ title: 'Payment recorded successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const handleAddPayment = () => {
    if (!formData.tenantId || !formData.amount) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    addPaymentMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.tenantId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const todayPayments = payments.filter(p => {
    const today = new Date().toDateString();
    return new Date(p.paymentDate).toDateString() === today;
  });
  const todayTotal = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      cash: 'bg-success/10 text-success border-success/20',
      upi: 'bg-primary/10 text-primary border-primary/20',
      bank_transfer: 'bg-accent/10 text-accent border-accent/20',
      card: 'bg-warning/10 text-warning border-warning/20'
    };
    return <Badge className={colors[method] || 'bg-muted'}>{method.replace('_', ' ').toUpperCase()}</Badge>;
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and record tenant payments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient" data-testid="button-add-payment">
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tenant *</Label>
                <Select value={formData.tenantId} onValueChange={(v) => setFormData({ ...formData, tenantId: v })}>
                  <SelectTrigger data-testid="select-tenant">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map(t => (
                      <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bill (Optional)</Label>
                <Select value={formData.billingId} onValueChange={(v) => setFormData({ ...formData, billingId: v })}>
                  <SelectTrigger data-testid="select-bill">
                    <SelectValue placeholder="Select bill" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingBills.map(b => (
                      <SelectItem key={b._id} value={b._id}>
                        {b.billNumber} - {b.tenantId?.name} (₹{b.dueAmount})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input 
                  type="number" 
                  placeholder="Enter amount" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  data-testid="input-amount"
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                  <SelectTrigger data-testid="select-method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction ID</Label>
                <Input 
                  placeholder="Enter transaction ID (optional)" 
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                  data-testid="input-transaction-id"
                />
              </div>
              <Button 
                className="w-full btn-gradient" 
                onClick={handleAddPayment}
                disabled={addPaymentMutation.isPending}
                data-testid="button-confirm-payment"
              >
                {addPaymentMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Recording...</>
                ) : (
                  'Record Payment'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-xl font-bold text-success" data-testid="text-total-collected">₹{(totalCollected / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-today-collection">₹{todayTotal.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today Count</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-today-count">{todayPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-payments">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="stat-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
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
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-32" data-testid="select-filter">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments found. Click "Record Payment" to add a payment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment._id} data-testid={`row-payment-${payment._id}`}>
                      <TableCell>{format(new Date(payment.paymentDate), 'd MMM yyyy')}</TableCell>
                      <TableCell className="font-medium">{payment.tenantId?.name || 'Unknown'}</TableCell>
                      <TableCell className="font-bold text-success">₹{payment.amount?.toLocaleString()}</TableCell>
                      <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                      <TableCell className="text-muted-foreground">{payment.transactionId || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.type || 'rent'}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
