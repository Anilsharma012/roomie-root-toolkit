import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Filter,
  Receipt
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
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const expenseCategories = [
  { id: 1, name: 'Electricity', icon: '⚡', total: 35000 },
  { id: 2, name: 'Water', icon: '💧', total: 8000 },
  { id: 3, name: 'Maintenance', icon: '🔧', total: 15000 },
  { id: 4, name: 'Staff Salary', icon: '👥', total: 95000 },
  { id: 5, name: 'Food/Groceries', icon: '🍽️', total: 45000 },
  { id: 6, name: 'Miscellaneous', icon: '📦', total: 12000 },
];

const expenses = [
  {
    id: 1,
    date: '2024-02-05',
    category: 'Electricity',
    description: 'February electricity bill',
    amount: 35000,
    vendor: 'UPPCL',
    paymentMode: 'Bank Transfer',
    status: 'paid',
    receipt: true,
  },
  {
    id: 2,
    date: '2024-02-04',
    category: 'Food/Groceries',
    description: 'Weekly grocery purchase',
    amount: 12500,
    vendor: 'Metro Cash & Carry',
    paymentMode: 'Cash',
    status: 'paid',
    receipt: true,
  },
  {
    id: 3,
    date: '2024-02-03',
    category: 'Maintenance',
    description: 'AC servicing for all rooms',
    amount: 8000,
    vendor: 'Cool Care Services',
    paymentMode: 'UPI',
    status: 'paid',
    receipt: true,
  },
  {
    id: 4,
    date: '2024-02-02',
    category: 'Staff Salary',
    description: 'January staff salaries',
    amount: 95000,
    vendor: 'Staff Payroll',
    paymentMode: 'Bank Transfer',
    status: 'paid',
    receipt: false,
  },
  {
    id: 5,
    date: '2024-02-01',
    category: 'Water',
    description: 'Water tanker charges',
    amount: 4000,
    vendor: 'Jal Board',
    paymentMode: 'Cash',
    status: 'paid',
    receipt: true,
  },
  {
    id: 6,
    date: '2024-02-01',
    category: 'Miscellaneous',
    description: 'Office supplies and stationery',
    amount: 2500,
    vendor: 'Stationery Mart',
    paymentMode: 'Cash',
    status: 'pending',
    receipt: false,
  },
];

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidExpenses = expenses.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Expenses Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all PG expenses</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="staff">Staff Salary</SelectItem>
                      <SelectItem value="food">Food/Groceries</SelectItem>
                      <SelectItem value="misc">Miscellaneous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Brief description of expense" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Mode</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Vendor/Payee</Label>
                <Input placeholder="Vendor or payee name" />
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea placeholder="Additional notes..." rows={2} />
              </div>
              <Button className="w-full btn-gradient" onClick={() => setIsAddDialogOpen(false)}>
                Add Expense
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
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-xl font-bold text-foreground">₹{(totalExpenses / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-xl font-bold text-success">₹{(paidExpenses / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-warning">₹{(pendingExpenses / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">vs Last Month</p>
                <p className="text-xl font-bold text-destructive">+8.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {expenseCategories.map((category) => (
          <Card 
            key={category.id} 
            className={`stat-card cursor-pointer transition-all hover:border-primary ${
              categoryFilter === category.name ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCategoryFilter(categoryFilter === category.name ? 'all' : category.name)}
          >
            <CardContent className="p-3 text-center">
              <span className="text-2xl">{category.icon}</span>
              <p className="text-xs font-medium text-foreground mt-1">{category.name}</p>
              <p className="text-xs text-muted-foreground">₹{(category.total / 1000).toFixed(0)}K</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expenses Table */}
      <Card className="stat-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Recent Expenses</CardTitle>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/30">
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-muted-foreground">{expense.vendor}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{expense.paymentMode}</span>
                    </TableCell>
                    <TableCell>
                      {expense.status === 'paid' ? (
                        <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Receipt className="w-4 h-4 mr-2" />
                            {expense.receipt ? 'View Receipt' : 'Add Receipt'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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
    </div>
  );
};

export default Expenses;
