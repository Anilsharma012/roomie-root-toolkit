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
import { Plus, Search, Package, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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
}

export default function ItemsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'pcs',
    purchasePrice: 0,
    condition: 'new',
    location: '',
    notes: ''
  });
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      const response = await apiRequest('/inventory');
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('/inventory', { method: 'POST', body: JSON.stringify(data) });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Item added successfully' });
      setIsAddOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to add item', description: error.message, variant: 'destructive' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      return apiRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Item updated successfully' });
      setEditItem(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to update item', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/inventory/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      toast({ title: 'Item deleted successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to delete item', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      quantity: 1,
      unit: 'pcs',
      purchasePrice: 0,
      condition: 'new',
      location: '',
      notes: ''
    });
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      purchasePrice: item.purchasePrice,
      condition: item.condition,
      location: item.location,
      notes: item.notes
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Please enter item name', variant: 'destructive' });
      return;
    }
    if (editItem) {
      updateMutation.mutate({ id: editItem._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredItems = items.filter((item: InventoryItem) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'new': return <Badge className="bg-green-500">New</Badge>;
      case 'good': return <Badge className="bg-blue-500">Good</Badge>;
      case 'fair': return <Badge variant="secondary">Fair</Badge>;
      case 'poor': return <Badge className="bg-orange-500">Poor</Badge>;
      case 'damaged': return <Badge variant="destructive">Damaged</Badge>;
      default: return <Badge variant="outline">{condition}</Badge>;
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Items</h1>
          <p className="text-muted-foreground">Manage all inventory items</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-item">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Item Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                  data-testid="input-item-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="bedding">Bedding</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition</Label>
                  <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                    <SelectTrigger data-testid="select-condition">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                    data-testid="input-quantity"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="pcs, kg, etc"
                    data-testid="input-unit"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    data-testid="input-price"
                  />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Room 101, Storage"
                  data-testid="input-location"
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes"
                  data-testid="input-notes"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={createMutation.isPending} data-testid="button-save-item">
                {createMutation.isPending ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Items ({filteredItems.length})</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-items"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32" data-testid="select-filter-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="bedding">Bedding</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-32" data-testid="select-filter-condition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
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
                    <th className="text-left py-3 px-4 font-medium">Qty</th>
                    <th className="text-left py-3 px-4 font-medium">Condition</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item: InventoryItem) => (
                    <tr key={item._id} className="border-b hover:bg-muted/50" data-testid={`row-item-${item._id}`}>
                      <td className="py-3 px-4 font-medium">{item.name}</td>
                      <td className="py-3 px-4 capitalize">{item.category}</td>
                      <td className="py-3 px-4">{item.quantity} {item.unit}</td>
                      <td className="py-3 px-4">{getConditionBadge(item.condition)}</td>
                      <td className="py-3 px-4">{item.location || '-'}</td>
                      <td className="py-3 px-4">₹{item.purchasePrice?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={editItem?._id === item._id} onOpenChange={(open) => !open && setEditItem(null)}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} data-testid={`button-edit-${item._id}`}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Item</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Item Name</Label>
                                  <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Category</Label>
                                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="furniture">Furniture</SelectItem>
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="kitchen">Kitchen</SelectItem>
                                        <SelectItem value="cleaning">Cleaning</SelectItem>
                                        <SelectItem value="bedding">Bedding</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Condition</Label>
                                    <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="fair">Fair</SelectItem>
                                        <SelectItem value="poor">Poor</SelectItem>
                                        <SelectItem value="damaged">Damaged</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      value={formData.quantity}
                                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Unit</Label>
                                    <Input
                                      value={formData.unit}
                                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <Label>Price</Label>
                                    <Input
                                      type="number"
                                      value={formData.purchasePrice}
                                      onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label>Location</Label>
                                  <Input
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                  />
                                </div>
                                <Button onClick={handleSubmit} className="w-full" disabled={updateMutation.isPending}>
                                  {updateMutation.isPending ? 'Updating...' : 'Update Item'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(item._id)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${item._id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
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
