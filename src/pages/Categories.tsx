import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { Plus, Package, Sofa, Tv, ChefHat, Sparkles, BedDouble, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  quantity: number;
}

const categoryIcons: Record<string, React.ElementType> = {
  furniture: Sofa,
  electronics: Tv,
  kitchen: ChefHat,
  cleaning: Sparkles,
  bedding: BedDouble,
  other: Package,
};

const categoryColors: Record<string, string> = {
  furniture: 'bg-amber-100 text-amber-600',
  electronics: 'bg-blue-100 text-blue-600',
  kitchen: 'bg-orange-100 text-orange-600',
  cleaning: 'bg-green-100 text-green-600',
  bedding: 'bg-purple-100 text-purple-600',
  other: 'bg-gray-100 text-gray-600',
};

export default function Categories() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  const categoryStats = items.reduce((acc: Record<string, { count: number; totalQty: number }>, item: InventoryItem) => {
    const cat = item.category || 'other';
    if (!acc[cat]) {
      acc[cat] = { count: 0, totalQty: 0 };
    }
    acc[cat].count++;
    acc[cat].totalQty += item.quantity || 0;
    return acc;
  }, {});

  const allCategories = ['furniture', 'electronics', 'kitchen', 'cleaning', 'bedding', 'other'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Inventory Categories</h1>
          <p className="text-muted-foreground">Organize your inventory by categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCategories.map((category) => {
          const Icon = categoryIcons[category] || Package;
          const stats = categoryStats[category] || { count: 0, totalQty: 0 };
          const colorClass = categoryColors[category] || categoryColors.other;

          return (
            <Card key={category} className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-category-${category}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold capitalize text-lg">{category}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{stats.count} items</span>
                    <span>Qty: {stats.totalQty}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`/inventory/items?category=${category}`}>View Items</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Total Items</th>
                  <th className="text-left py-3 px-4 font-medium">Total Quantity</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((category) => {
                  const stats = categoryStats[category] || { count: 0, totalQty: 0 };
                  const Icon = categoryIcons[category] || Package;
                  
                  return (
                    <tr key={category} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize font-medium">{category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{stats.count}</td>
                      <td className="py-3 px-4">{stats.totalQty}</td>
                      <td className="py-3 px-4">
                        {stats.count > 0 ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-muted-foreground">Empty</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
