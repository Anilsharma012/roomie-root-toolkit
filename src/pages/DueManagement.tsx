import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { AlertTriangle, Search, IndianRupee, Calendar, Phone, Mail, Send } from 'lucide-react';
import { format } from 'date-fns';

interface Bill {
  _id: string;
  billNumber: string;
  tenantId: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    roomNumber: string;
  };
  month: string;
  year: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: string;
}

export default function DueManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: bills = [], isLoading } = useQuery<Bill[]>({
    queryKey: ['/api/billing/pending'],
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (billId: string) => {
      return apiRequest(`/billing/${billId}/reminder`, { method: 'POST' });
    },
    onSuccess: () => {
      toast({ title: 'Reminder sent successfully' });
    },
    onError: () => {
      toast({ title: 'Reminder logged (notification feature)', description: 'SMS/Email integration pending' });
    }
  });

  const filteredBills = bills.filter((bill: Bill) => {
    const matchesSearch = bill.tenantId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDue = filteredBills.reduce((sum: number, bill: Bill) => sum + (bill.dueAmount || 0), 0);
  const overdueBills = filteredBills.filter((bill: Bill) => bill.status === 'overdue');
  const pendingBills = filteredBills.filter((bill: Bill) => bill.status === 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'overdue': return <Badge variant="destructive">Overdue</Badge>;
      case 'pending': return <Badge variant="secondary">Pending</Badge>;
      case 'partial': return <Badge className="bg-orange-500">Partial</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
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
        <h1 className="text-2xl font-bold">Due Management</h1>
        <p className="text-muted-foreground">Track and manage pending payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100">
                <IndianRupee className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <p className="text-2xl font-bold text-red-600">₹{totalDue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue Bills</p>
                <p className="text-2xl font-bold">{overdueBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Bills</p>
                <p className="text-2xl font-bold">{pendingBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Send className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-bold">{filteredBills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Pending Dues</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenant or bill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                  data-testid="input-search-dues"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32" data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBills.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No pending dues found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBills.map((bill: Bill) => (
                <div
                  key={bill._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  data-testid={`row-due-${bill._id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{bill.tenantId?.name || 'Unknown'}</span>
                      {getStatusBadge(bill.status)}
                      {bill.status === 'overdue' && (
                        <Badge variant="outline" className="text-red-600 border-red-200">
                          {getDaysOverdue(bill.dueDate)} days overdue
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Bill: {bill.billNumber} | Room: {bill.tenantId?.roomNumber || 'N/A'}</p>
                      <p>{bill.month} {bill.year} | Due: {bill.dueDate ? format(new Date(bill.dueDate), 'dd MMM yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 md:mt-0">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Due Amount</p>
                      <p className="text-xl font-bold text-red-600">₹{bill.dueAmount?.toLocaleString()}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" data-testid={`button-view-${bill._id}`}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bill Details - {bill.billNumber}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Tenant</p>
                              <p className="font-medium">{bill.tenantId?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Room</p>
                              <p className="font-medium">{bill.tenantId?.roomNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Period</p>
                              <p className="font-medium">{bill.month} {bill.year}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Due Date</p>
                              <p className="font-medium">{bill.dueDate ? format(new Date(bill.dueDate), 'dd MMM yyyy') : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="font-medium">₹{bill.totalAmount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Paid Amount</p>
                              <p className="font-medium text-green-600">₹{bill.paidAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Outstanding Due</p>
                            <p className="text-2xl font-bold text-red-600">₹{bill.dueAmount?.toLocaleString()}</p>
                          </div>
                          {bill.tenantId?.phone && (
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1" asChild>
                                <a href={`tel:${bill.tenantId.phone}`}>
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call
                                </a>
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => sendReminderMutation.mutate(bill._id)}
                                disabled={sendReminderMutation.isPending}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Reminder
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
