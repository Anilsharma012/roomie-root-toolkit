import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Receipt, Download, Printer, IndianRupee, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Payment {
  _id: string;
  receiptNumber: string;
  tenantId: {
    _id: string;
    name: string;
    phone: string;
    roomNumber: string;
  };
  billingId: {
    _id: string;
    billNumber: string;
    month: string;
    year: number;
  };
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId: string;
  notes: string;
}

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesSearch = payment.tenantId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.paymentDate);
      const today = new Date();
      if (dateFilter === 'today') {
        matchesDate = paymentDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        matchesDate = paymentDate >= weekAgo;
      } else if (dateFilter === 'month') {
        matchesDate = paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
      }
    }
    
    return matchesSearch && matchesMethod && matchesDate;
  });

  const totalCollected = filteredPayments.reduce((sum: number, p: Payment) => sum + (p.amount || 0), 0);

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'cash': return <Badge variant="secondary">Cash</Badge>;
      case 'upi': return <Badge className="bg-purple-500">UPI</Badge>;
      case 'bank_transfer': return <Badge className="bg-blue-500">Bank Transfer</Badge>;
      case 'card': return <Badge className="bg-green-500">Card</Badge>;
      default: return <Badge variant="outline">{method}</Badge>;
    }
  };

  const handlePrintReceipt = (payment: Payment) => {
    const printContent = `
      <html>
      <head>
        <title>Receipt - ${payment.receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 400px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #e11d48; }
          .receipt-no { font-size: 12px; color: #666; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { color: #666; }
          .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; color: #16a34a; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Parameshwari Girls PG</div>
          <p>Payment Receipt</p>
          <p class="receipt-no">${payment.receiptNumber}</p>
        </div>
        <div class="details">
          <div class="row"><span class="label">Tenant:</span><span>${payment.tenantId?.name || 'N/A'}</span></div>
          <div class="row"><span class="label">Room:</span><span>${payment.tenantId?.roomNumber || 'N/A'}</span></div>
          <div class="row"><span class="label">Bill:</span><span>${payment.billingId?.billNumber || 'N/A'}</span></div>
          <div class="row"><span class="label">Period:</span><span>${payment.billingId?.month || ''} ${payment.billingId?.year || ''}</span></div>
          <div class="row"><span class="label">Payment Method:</span><span>${payment.paymentMethod?.toUpperCase()}</span></div>
          <div class="row"><span class="label">Date:</span><span>${format(new Date(payment.paymentDate), 'dd MMM yyyy')}</span></div>
          ${payment.transactionId ? `<div class="row"><span class="label">Transaction ID:</span><span>${payment.transactionId}</span></div>` : ''}
        </div>
        <div class="amount">Amount Paid: Rs. ${payment.amount?.toLocaleString()}</div>
        <div class="footer">
          <p>Thank you for your payment!</p>
          <p>This is a computer-generated receipt.</p>
        </div>
      </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Receipts</h1>
        <p className="text-muted-foreground">View and print payment receipts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-total-collected">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-total-collected">₹{totalCollected.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-total-receipts">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Receipts</p>
                <p className="text-2xl font-bold" data-testid="text-receipt-count">{filteredPayments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-this-month">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold" data-testid="text-month-count">
                  {payments.filter((p: Payment) => {
                    const date = new Date(p.paymentDate);
                    const today = new Date();
                    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Receipts</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-receipts"
                />
              </div>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-32" data-testid="select-method-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32" data-testid="select-date-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No receipts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Receipt No.</th>
                    <th className="text-left py-3 px-4 font-medium">Tenant</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Method</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment: Payment) => (
                    <tr key={payment._id} className="border-b hover:bg-muted/50" data-testid={`row-receipt-${payment._id}`}>
                      <td className="py-3 px-4 font-mono text-sm">{payment.receiptNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{payment.tenantId?.name || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">Room: {payment.tenantId?.roomNumber || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600">₹{payment.amount?.toLocaleString()}</td>
                      <td className="py-3 px-4">{getMethodBadge(payment.paymentMethod)}</td>
                      <td className="py-3 px-4">{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid={`button-view-receipt-${payment._id}`}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Receipt Details</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="text-center p-4 bg-primary/5 rounded-lg">
                                  <p className="text-sm text-muted-foreground">Receipt Number</p>
                                  <p className="text-lg font-mono font-bold">{payment.receiptNumber}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Tenant</p>
                                    <p className="font-medium">{payment.tenantId?.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Room</p>
                                    <p className="font-medium">{payment.tenantId?.roomNumber || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Bill Number</p>
                                    <p className="font-medium">{payment.billingId?.billNumber || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Period</p>
                                    <p className="font-medium">{payment.billingId?.month} {payment.billingId?.year}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <p className="font-medium capitalize">{payment.paymentMethod?.replace('_', ' ')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Payment Date</p>
                                    <p className="font-medium">{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</p>
                                  </div>
                                </div>
                                {payment.transactionId && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                                    <p className="font-mono">{payment.transactionId}</p>
                                  </div>
                                )}
                                <div className="p-4 bg-green-50 rounded-lg text-center">
                                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                                  <p className="text-3xl font-bold text-green-600">₹{payment.amount?.toLocaleString()}</p>
                                </div>
                                <Button onClick={() => handlePrintReceipt(payment)} className="w-full" data-testid={`button-print-dialog-${payment._id}`}>
                                  <Printer className="w-4 h-4 mr-2" />
                                  Print Receipt
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintReceipt(payment)}
                            data-testid={`button-print-${payment._id}`}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
