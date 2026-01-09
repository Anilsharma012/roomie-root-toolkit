import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Minus, Search } from 'lucide-react';

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
}

export default function StockManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQty, setAdjustmentQty] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  const adjustMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest(`/inventory/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify({ quantity }) 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Stock updated successfully' });
      setSelectedItem(null);
      setAdjustmentQty(1);
      setAdjustmentReason('');
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update stock', description: error.message, variant: 'destructive' });
    }
  });

  const handleAdjust = () => {
    if (!selectedItem) return;
    
    let newQty = selectedItem.quantity;
    if (adjustmentType === 'add') {
      newQty += adjustmentQty;
    } else {
      newQty = Math.max(0, newQty - adjustmentQty);
    }
    
    adjustMutation.mutate({ id: selectedItem._id, quantity: newQty });
  };

  const filteredItems = items.filter((item: InventoryItem) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter((item: InventoryItem) => item.quantity <= 5);
  const totalItems = items.reduce((sum: number, item: InventoryItem) => sum + (item.quantity || 0), 0);

  const getStockBadge = (quantity: number) => {
    if (quantity <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (quantity <= 5) return <Badge className="bg-orange-500">Low Stock</Badge>;
    if (quantity <= 20) return <Badge variant="secondary">Normal</Badge>;
    return <Badge className="bg-green-500">In Stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <p className="text-muted-foreground">Track and adjust inventory stock levels</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold">{totalItems}</p>
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
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold">{items.filter((i: InventoryItem) => i.quantity <= 0).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Stock Levels</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-stock"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32" data-testid="select-filter-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="bedding">Bedding</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No items found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Item</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Current Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item: InventoryItem) => (
                    <tr key={item._id} className="border-b hover:bg-muted/50" data-testid={`row-stock-${item._id}`}>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 capitalize">{item.category}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold">{item.quantity}</span>
                        <span className="text-muted-foreground ml-1">{item.unit}</span>
                      </td>
                      <td className="py-3 px-4">{getStockBadge(item.quantity)}</td>
                      <td className="py-3 px-4">{item.location || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedItem(item)}
                              data-testid={`button-adjust-${item._id}`}
                            >
                              Adjust Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adjust Stock - {item.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-muted rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">Current Stock</p>
                                <p className="text-3xl font-bold">{item.quantity} {item.unit}</p>
                              </div>
                              <div>
                                <Label>Adjustment Type</Label>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant={adjustmentType === 'add' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setAdjustmentType('add')}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Stock
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={adjustmentType === 'remove' ? 'default' : 'outline'}
                                    className="flex-1"
                                    onClick={() => setAdjustmentType('remove')}
                                  >
                                    <Minus className="w-4 h-4 mr-2" />
                                    Remove Stock
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={adjustmentQty}
                                  onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 1)}
                                  data-testid="input-adjustment-qty"
                                />
                              </div>
                              <div>
                                <Label>Reason (Optional)</Label>
                                <Input
                                  value={adjustmentReason}
                                  onChange={(e) => setAdjustmentReason(e.target.value)}
                                  placeholder="e.g., New purchase, Damaged, Used"
                                  data-testid="input-adjustment-reason"
                                />
                              </div>
                              <div className="p-4 bg-blue-50 rounded-lg text-center">
                                <p className="text-sm text-muted-foreground">New Stock Level</p>
                                <p className="text-2xl font-bold text-blue-600">
                                  {adjustmentType === 'add' 
                                    ? item.quantity + adjustmentQty 
                                    : Math.max(0, item.quantity - adjustmentQty)
                                  } {item.unit}
                                </p>
                              </div>
                              <Button 
                                onClick={handleAdjust} 
                                className="w-full" 
                                disabled={adjustMutation.isPending}
                                data-testid="button-confirm-adjust"
                              >
                                {adjustMutation.isPending ? 'Updating...' : 'Confirm Adjustment'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
