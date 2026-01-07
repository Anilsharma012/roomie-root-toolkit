import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  FileText,
  Users,
  IndianRupee,
  BedDouble,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const monthlyData = [
  { month: 'Sep', collection: 245000, expenses: 85000, occupancy: 82 },
  { month: 'Oct', collection: 268000, expenses: 92000, occupancy: 85 },
  { month: 'Nov', collection: 285000, expenses: 88000, occupancy: 88 },
  { month: 'Dec', collection: 290000, expenses: 95000, occupancy: 90 },
  { month: 'Jan', collection: 305000, expenses: 98000, occupancy: 92 },
  { month: 'Feb', collection: 295000, expenses: 90000, occupancy: 85 },
];

const reportTypes = [
  { id: 'occupancy', name: 'Occupancy Report', icon: BedDouble, description: 'Room and bed occupancy statistics' },
  { id: 'collection', name: 'Collection Report', icon: IndianRupee, description: 'Rent collection summary' },
  { id: 'dues', name: 'Dues Report', icon: FileText, description: 'Pending payments and overdue' },
  { id: 'expense', name: 'Expense Report', icon: TrendingDown, description: 'Monthly expense breakdown' },
  { id: 'inventory', name: 'Inventory Report', icon: Package, description: 'Stock and inventory status' },
  { id: 'tenant', name: 'Tenant Report', icon: Users, description: 'Tenant details and history' },
];

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last6months');

  const totalCollection = monthlyData.reduce((sum, d) => sum + d.collection, 0);
  const totalExpenses = monthlyData.reduce((sum, d) => sum + d.expenses, 0);
  const avgOccupancy = Math.round(monthlyData.reduce((sum, d) => sum + d.occupancy, 0) / monthlyData.length);
  const profit = totalCollection - totalExpenses;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View detailed reports and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thismonth">This Month</SelectItem>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collection</p>
                <p className="text-2xl font-bold text-foreground">₹{(totalCollection / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 text-success text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">₹{(totalExpenses / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 text-destructive text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-bold text-primary">₹{(profit / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 text-success text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+18.3%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                <p className="text-2xl font-bold text-foreground">{avgOccupancy}%</p>
                <div className="flex items-center gap-1 text-success text-sm mt-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>+3.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BedDouble className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="stat-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end gap-4">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 h-48">
                  <div 
                    className="flex-1 bg-success/80 rounded-t-lg transition-all hover:bg-success"
                    style={{ height: `${(data.collection / 350000) * 100}%` }}
                    title={`Collection: ₹${data.collection.toLocaleString()}`}
                  />
                  <div 
                    className="flex-1 bg-destructive/80 rounded-t-lg transition-all hover:bg-destructive"
                    style={{ height: `${(data.expenses / 350000) * 100}%` }}
                    title={`Expenses: ₹${data.expenses.toLocaleString()}`}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success" />
              <span className="text-sm text-muted-foreground">Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report, index) => (
            <Card 
              key={report.id} 
              className="stat-card hover:shadow-md transition-all cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <report.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Occupancy Trend */}
      <Card className="stat-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Occupancy Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data) => (
              <div key={data.month}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">{data.month} 2024</span>
                  <span className="text-muted-foreground">{data.occupancy}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      data.occupancy >= 90 ? 'bg-success' : 
                      data.occupancy >= 80 ? 'bg-accent' : 
                      data.occupancy >= 70 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${data.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
