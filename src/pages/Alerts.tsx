import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Bell, Package, CheckCircle, Search, TrendingDown } from 'lucide-react';

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  condition: string;
  location: string;
}

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertType, setAlertType] = useState('all');

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  const outOfStockItems = items.filter((item: InventoryItem) => item.quantity <= 0);
  const lowStockItems = items.filter((item: InventoryItem) => item.quantity > 0 && item.quantity <= 5);
  const damagedItems = items.filter((item: InventoryItem) => item.condition === 'damaged' || item.condition === 'poor');

  const allAlerts = [
    ...outOfStockItems.map((item: InventoryItem) => ({
      ...item,
      alertType: 'out_of_stock',
      severity: 'critical',
      message: `${item.name} is out of stock`
    })),
    ...lowStockItems.map((item: InventoryItem) => ({
      ...item,
      alertType: 'low_stock',
      severity: 'warning',
      message: `${item.name} has only ${item.quantity} ${item.unit} left`
    })),
    ...damagedItems.map((item: InventoryItem) => ({
      ...item,
      alertType: 'damaged',
      severity: 'info',
      message: `${item.name} is in ${item.condition} condition`
    }))
  ];

  const filteredAlerts = allAlerts.filter((alert) => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = alertType === 'all' || alert.alertType === alertType;
    return matchesSearch && matchesType;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'warning': return <Badge className="bg-orange-500">Warning</Badge>;
      case 'info': return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'out_of_stock': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'low_stock': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'damaged': return <Package className="w-5 h-5 text-gray-500" />;
      default: return <Bell className="w-5 h-5" />;
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
      <div>
        <h1 className="text-2xl font-bold">Inventory Alerts</h1>
        <p className="text-muted-foreground">Monitor stock levels and item conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-100">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gray-100">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Damaged Items</p>
                <p className="text-2xl font-bold">{damagedItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{allAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Active Alerts</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-48"
                  data-testid="input-search-alerts"
                />
              </div>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger className="w-40" data-testid="select-alert-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-green-600">No Alerts</p>
              <p className="text-muted-foreground">All inventory items are in good condition</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => (
                <div
                  key={`${alert._id}-${index}`}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'warning' ? 'border-orange-200 bg-orange-50' :
                    'border-gray-200 bg-gray-50'
                  }`}
                  data-testid={`alert-${alert._id}`}
                >
                  <div className="flex items-center gap-4">
                    {getAlertIcon(alert.alertType)}
                    <div>
                      <p className="font-medium">{alert.name}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Category: {alert.category} | Location: {alert.location || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(alert.severity)}
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/inventory/stock`}>Take Action</a>
                    </Button>
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
