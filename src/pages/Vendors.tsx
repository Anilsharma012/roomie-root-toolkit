import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, Store, Phone, Mail, MapPin, Edit2, Trash2 } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  rating: number;
}

const initialVendors: Vendor[] = [
  { id: '1', name: 'ABC Electronics', category: 'electronics', phone: '9876543210', email: 'abc@electronics.com', address: '123 Main St', status: 'active', rating: 4.5 },
  { id: '2', name: 'Home Furnishings', category: 'furniture', phone: '9876543211', email: 'contact@homefurn.com', address: '456 Market Rd', status: 'active', rating: 4.2 },
  { id: '3', name: 'Clean Supplies Co', category: 'cleaning', phone: '9876543212', email: 'orders@cleansupplies.com', address: '789 Industrial Area', status: 'active', rating: 4.0 },
  { id: '4', name: 'Kitchen Essentials', category: 'kitchen', phone: '9876543213', email: 'sales@kitchenessentials.com', address: '321 Commercial St', status: 'inactive', rating: 3.8 },
];

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editVendor, setEditVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    phone: '',
    email: '',
    address: '',
    status: 'active',
    rating: 4.0
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'other',
      phone: '',
      email: '',
      address: '',
      status: 'active',
      rating: 4.0
    });
  };

  const handleEdit = (vendor: Vendor) => {
    setEditVendor(vendor);
    setFormData({
      name: vendor.name,
      category: vendor.category,
      phone: vendor.phone,
      email: vendor.email,
      address: vendor.address,
      status: vendor.status,
      rating: vendor.rating
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Please enter vendor name', variant: 'destructive' });
      return;
    }
    
    if (editVendor) {
      setVendors(vendors.map(v => v.id === editVendor.id ? { ...v, ...formData } : v));
      toast({ title: 'Vendor updated successfully' });
      setEditVendor(null);
    } else {
      const newVendor: Vendor = {
        id: Date.now().toString(),
        ...formData
      };
      setVendors([...vendors, newVendor]);
      toast({ title: 'Vendor added successfully' });
      setIsAddOpen(false);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
    toast({ title: 'Vendor deleted successfully' });
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      electronics: 'bg-blue-500',
      furniture: 'bg-amber-500',
      kitchen: 'bg-orange-500',
      cleaning: 'bg-green-500',
      bedding: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return <Badge className={colors[category] || colors.other}>{category}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-muted-foreground">Manage your suppliers and vendors</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-vendor">
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Vendor Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter vendor name"
                  data-testid="input-vendor-name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger data-testid="select-vendor-category">
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
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger data-testid="select-vendor-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  data-testid="input-vendor-phone"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  data-testid="input-vendor-email"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                  data-testid="input-vendor-address"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" data-testid="button-save-vendor">
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold">{vendors.filter(v => v.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive Vendors</p>
                <p className="text-2xl font-bold">{vendors.filter(v => v.status === 'inactive').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Store className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{new Set(vendors.map(v => v.category)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Vendors</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-vendors"
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No vendors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-md transition-shadow" data-testid={`card-vendor-${vendor.id}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{vendor.name}</h3>
                        {getCategoryBadge(vendor.category)}
                      </div>
                      <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{vendor.address}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Dialog open={editVendor?.id === vendor.id} onOpenChange={(open) => !open && setEditVendor(null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(vendor)}>
                            <Edit2 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Vendor</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Vendor Name</Label>
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
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Address</Label>
                              <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              />
                            </div>
                            <Button onClick={handleSubmit} className="w-full">
                              Update Vendor
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(vendor.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
