import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Package,
  AlertTriangle,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  ArrowDownUp,
  Filter,
  Download
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

const categories = [
  { id: 1, name: 'Bedding', count: 45, icon: '🛏️' },
  { id: 2, name: 'Furniture', count: 120, icon: '🪑' },
  { id: 3, name: 'Electronics', count: 85, icon: '📱' },
  { id: 4, name: 'Kitchen', count: 60, icon: '🍳' },
  { id: 5, name: 'Cleaning', count: 30, icon: '🧹' },
  { id: 6, name: 'Others', count: 25, icon: '📦' },
];

const inventoryItems = [
  {
    id: 1,
    name: 'Single Bed Mattress',
    category: 'Bedding',
    sku: 'BED-MAT-001',
    inStock: 5,
    allocated: 95,
    minStock: 10,
    unitPrice: 3500,
    vendor: 'Sleepwell India',
    lastUpdated: '2024-01-20',
  },
  {
    id: 2,
    name: 'Ceiling Fan',
    category: 'Electronics',
    sku: 'ELE-FAN-001',
    inStock: 8,
    allocated: 112,
    minStock: 5,
    unitPrice: 1800,
    vendor: 'Havells',
    lastUpdated: '2024-01-18',
  },
  {
    id: 3,
    name: 'Bedsheet Set',
    category: 'Bedding',
    sku: 'BED-SHT-001',
    inStock: 3,
    allocated: 200,
    minStock: 20,
    unitPrice: 450,
    vendor: 'Bombay Dyeing',
    lastUpdated: '2024-01-22',
  },
  {
    id: 4,
    name: 'Study Table',
    category: 'Furniture',
    sku: 'FUR-TBL-001',
    inStock: 12,
    allocated: 88,
    minStock: 10,
    unitPrice: 2500,
    vendor: 'Urban Ladder',
    lastUpdated: '2024-01-15',
  },
  {
    id: 5,
    name: 'Pillow',
    category: 'Bedding',
    sku: 'BED-PIL-001',
    inStock: 8,
    allocated: 180,
    minStock: 25,
    unitPrice: 350,
    vendor: 'Recron',
    lastUpdated: '2024-01-21',
  },
  {
    id: 6,
    name: 'LED Tube Light',
    category: 'Electronics',
    sku: 'ELE-LED-001',
    inStock: 25,
    allocated: 150,
    minStock: 20,
    unitPrice: 280,
    vendor: 'Philips',
    lastUpdated: '2024-01-19',
  },
  {
    id: 7,
    name: 'Wardrobe (Single)',
    category: 'Furniture',
    sku: 'FUR-WRD-001',
    inStock: 4,
    allocated: 96,
    minStock: 5,
    unitPrice: 8500,
    vendor: 'Godrej',
    lastUpdated: '2024-01-10',
  },
  {
    id: 8,
    name: 'Water Purifier',
    category: 'Electronics',
    sku: 'ELE-WTR-001',
    inStock: 2,
    allocated: 8,
    minStock: 3,
    unitPrice: 12000,
    vendor: 'Kent',
    lastUpdated: '2024-01-05',
  },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && item.inStock < item.minStock) ||
      (stockFilter === 'ok' && item.inStock >= item.minStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockItems = inventoryItems.filter(item => item.inStock < item.minStock);
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.inStock * item.unitPrice), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all PG inventory items</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Stock In/Out
          </Button>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-xl font-bold text-foreground">{inventoryItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-lg">📦</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-xl font-bold text-foreground">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-xl font-bold text-destructive">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <span className="text-lg">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-xl font-bold text-foreground">₹{(totalValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className={`stat-card cursor-pointer transition-all hover:border-primary ${
              categoryFilter === category.name ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCategoryFilter(categoryFilter === category.name ? 'all' : category.name)}
          >
            <CardContent className="p-3 text-center">
              <span className="text-2xl">{category.icon}</span>
              <p className="text-sm font-medium text-foreground mt-1">{category.name}</p>
              <p className="text-xs text-muted-foreground">{category.count} items</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Low Stock Alert</p>
                <p className="text-sm text-muted-foreground">
                  {lowStockItems.map(item => item.name).join(', ')} need reordering
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                View All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters & Table */}
      <Card className="stat-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="ok">In Stock</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>Item Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">In Stock</TableHead>
                  <TableHead className="text-center">Allocated</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={item.inStock < item.minStock ? 'text-destructive font-semibold' : ''}>
                        {item.inStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{item.allocated}</TableCell>
                    <TableCell className="text-right">₹{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.vendor}</TableCell>
                    <TableCell className="text-center">
                      {item.inStock < item.minStock ? (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge className="bg-success/10 text-success border-success/20">
                          In Stock
                        </Badge>
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
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowDownUp className="w-4 h-4 mr-2" />
                            Stock In/Out
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

          {filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No items found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
