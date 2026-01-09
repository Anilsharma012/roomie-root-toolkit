import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Download,
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

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  purchasePrice: number;
  condition: string;
  location: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
}

const categories = [
  { id: 'furniture', name: 'Furniture', icon: 'W' },
  { id: 'electronics', name: 'Electronics', icon: 'E' },
  { id: 'kitchen', name: 'Kitchen', icon: 'K' },
  { id: 'cleaning', name: 'Cleaning', icon: 'C' },
  { id: 'bedding', name: 'Bedding', icon: 'B' },
  { id: 'other', name: 'Other', icon: 'O' },
];

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'pcs',
    purchasePrice: 0,
    condition: 'new',
    location: '',
    notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventoryItems, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  const addItemMutation = useMutation({
    mutationFn: (data: typeof newItem) => api.post<InventoryItem>('/inventory', {
      name: data.name,
      category: data.category,
      quantity: Number(data.quantity),
      unit: data.unit,
      purchasePrice: Number(data.purchasePrice),
      condition: data.condition,
      location: data.location,
      notes: data.notes
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      setIsAddDialogOpen(false);
      setNewItem({ name: '', category: 'other', quantity: 1, unit: 'pcs', purchasePrice: 0, condition: 'new', location: '', notes: '' });
      toast({ title: 'Item added successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error adding item', description: error.message, variant: 'destructive' });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Item deleted successfully!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error deleting item', description: error.message, variant: 'destructive' });
    }
  });

  const filteredItems = (inventoryItems || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = (inventoryItems || []).reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
  const totalItems = (inventoryItems || []).reduce((sum, item) => sum + item.quantity, 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    addItemMutation.mutate(newItem);
  };

  const getCategoryCount = (categoryId: string) => {
    return (inventoryItems || []).filter(item => item.category === categoryId).length;
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new':
        return <Badge className="bg-success/10 text-success border-success/20">New</Badge>;
      case 'good':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Good</Badge>;
      case 'fair':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Poor</Badge>;
      default:
        return <Badge variant="secondary">{condition}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-page-title">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage all PG inventory items</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient" data-testid="button-add-item">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                    data-testid="input-item-name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={newItem.condition} onValueChange={(v) => setNewItem({ ...newItem, condition: v })}>
                      <SelectTrigger data-testid="select-condition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                      min={1}
                      data-testid="input-quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      data-testid="input-unit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Purchase Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItem.purchasePrice}
                      onChange={(e) => setNewItem({ ...newItem, purchasePrice: Number(e.target.value) })}
                      data-testid="input-price"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    placeholder="e.g., Room 201, Storage Room"
                    data-testid="input-location"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    data-testid="input-notes"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addItemMutation.isPending} data-testid="button-submit-item">
                  {addItemMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Add Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-items">{inventoryItems?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ArrowDownUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-total-quantity">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <span className="text-lg font-bold text-success">₹</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-xl font-bold text-foreground" data-testid="text-stock-value">
                  ₹{totalValue >= 1000 ? `${(totalValue / 1000).toFixed(0)}K` : totalValue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-xl font-bold text-foreground">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className={`stat-card cursor-pointer transition-all ${
              categoryFilter === category.id ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => setCategoryFilter(categoryFilter === category.id ? 'all' : category.id)}
            data-testid={`card-category-${category.id}`}
          >
            <CardContent className="p-3 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-muted flex items-center justify-center text-lg font-bold">
                {category.icon}
              </div>
              <p className="text-sm font-medium text-foreground mt-2">{category.name}</p>
              <p className="text-xs text-muted-foreground">{getCategoryCount(category.id)} items</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="stat-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-inventory"
                />
              </div>
              <Button variant="outline" size="icon" data-testid="button-download">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-center">Condition</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item._id} data-testid={`row-item-${item._id}`}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{item.quantity} {item.unit}</TableCell>
                      <TableCell className="text-right">₹{item.purchasePrice?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.location || '-'}</TableCell>
                      <TableCell className="text-center">{getConditionBadge(item.condition)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${item._id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem data-testid={`menu-edit-${item._id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteItemMutation.mutate(item._id)}
                              data-testid={`menu-delete-${item._id}`}
                            >
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
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No items found. Add your first inventory item to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
