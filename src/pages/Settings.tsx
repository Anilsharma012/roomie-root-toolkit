import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon,
  Building2,
  IndianRupee,
  Shield,
  CreditCard,
  FileText,
  Database,
  Bell,
  User,
  Save,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface PG {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  totalFloors: number;
  totalBeds: number;
  registrationNumber?: string;
}

const Settings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    totalFloors: 0,
    totalBeds: 0
  });

  const { data: pgData, isLoading } = useQuery<PG[]>({
    queryKey: ['/api/pgs'],
    queryFn: async () => {
      return apiRequest<PG[]>('/pgs');
    }
  });

  const pg = pgData?.[0];

  useEffect(() => {
    if (pg) {
      setFormData({
        name: pg.name || '',
        address: pg.address || '',
        phone: pg.phone || '',
        email: pg.email || '',
        totalFloors: pg.totalFloors || 0,
        totalBeds: pg.totalBeds || 0
      });
    }
  }, [pg]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!pg?._id) throw new Error('PG not found');
      return apiRequest<PG>(`/pgs/${pg._id}`, {
        method: 'PUT',
        body: data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pgs'] });
      toast({ title: 'Settings saved successfully' });
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save settings', description: error.message, variant: 'destructive' });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your PG settings and preferences</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="w-4 h-4" />
            PG Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <IndianRupee className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="w-4 h-4" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* PG Profile */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="stat-card lg:col-span-2">
              <CardHeader>
                <CardTitle>PG Information</CardTitle>
                <CardDescription>Update your PG details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>PG Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input value="PG/UP/2022/12345" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Floors</Label>
                    <Input 
                      type="number" 
                      value={formData.totalFloors} 
                      onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Beds</Label>
                    <Input 
                      type="number" 
                      value={formData.totalBeds} 
                      onChange={(e) => setFormData({ ...formData, totalBeds: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <Button className="btn-gradient" onClick={handleSave} disabled={updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader>
                <CardTitle>PG Logo</CardTitle>
                <CardDescription>Upload your PG logo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-32 h-32 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary" />
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>Billing & Tax Settings</CardTitle>
              <CardDescription>Configure rent, taxes, and late fee settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bill Generation Date</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st of Month</SelectItem>
                      <SelectItem value="5">5th of Month</SelectItem>
                      <SelectItem value="10">10th of Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date (Days)</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Late Fee Type</Label>
                  <Select defaultValue="fixed">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Late Fee Amount (₹)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label>Grace Period (Days)</Label>
                  <Input type="number" defaultValue="3" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>GST Number (Optional)</Label>
                  <Input placeholder="Enter GST number if applicable" />
                </div>
                <div className="space-y-2">
                  <Label>GST Rate (%)</Label>
                  <Input type="number" defaultValue="0" />
                </div>
              </div>

              <Button className="btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions */}
        <TabsContent value="roles">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage user roles and access permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { role: 'Admin', description: 'Full access to all features', users: 1 },
                { role: 'Manager', description: 'Can manage tenants, billing, and inventory', users: 2 },
                { role: 'Warden', description: 'Can view tenants and manage check-ins', users: 1 },
                { role: 'Accountant', description: 'Can manage billing and expenses only', users: 1 },
              ].map((role) => (
                <div key={role.role} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{role.role}</h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{role.users} user(s)</span>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline">
                Add New Role
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Gateway */}
        <TabsContent value="payments">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
              <CardDescription>Configure online payment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Razorpay</h4>
                    <p className="text-sm text-muted-foreground">Accept UPI, Cards, Net Banking</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">PhonePe</h4>
                    <p className="text-sm text-muted-foreground">Accept UPI payments</p>
                  </div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                    🏦
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Bank Transfer</h4>
                    <p className="text-sm text-muted-foreground">Accept direct bank transfers</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Bank Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input defaultValue="Parameshwari Girls PG" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input defaultValue="1234567890123" />
                  </div>
                  <div className="space-y-2">
                    <Label>IFSC Code</Label>
                    <Input defaultValue="SBIN0001234" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input defaultValue="State Bank of India" />
                  </div>
                </div>
              </div>

              <Button className="btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure automatic notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Rent Due Reminder', description: 'Send reminder before rent due date', enabled: true },
                { title: 'Payment Confirmation', description: 'Send confirmation after payment received', enabled: true },
                { title: 'Overdue Alerts', description: 'Send alerts for overdue payments', enabled: true },
                { title: 'Check-in/Check-out', description: 'Send notification on tenant check-in/out', enabled: false },
                { title: 'Complaint Updates', description: 'Notify tenants about complaint status', enabled: true },
                { title: 'Maintenance Alerts', description: 'Notify about scheduled maintenance', enabled: true },
              ].map((setting) => (
                <div key={setting.title} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked={setting.enabled} />
                </div>
              ))}

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Reminder Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Reminder (Days before due)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Second Reminder (Days before due)</Label>
                    <Input type="number" defaultValue="1" />
                  </div>
                </div>
              </div>

              <Button className="btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore */}
        <TabsContent value="backup">
          <Card className="stat-card">
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage your data backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground">Automatic Backup</h4>
                    <p className="text-sm text-muted-foreground">Enable daily automatic backups</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="text-sm text-muted-foreground">
                  Last backup: Today at 2:00 AM
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Recent Backups</h4>
                {[
                  { date: '2024-02-05', size: '2.5 MB', status: 'success' },
                  { date: '2024-02-04', size: '2.4 MB', status: 'success' },
                  { date: '2024-02-03', size: '2.3 MB', status: 'success' },
                ].map((backup) => (
                  <div key={backup.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(backup.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">{backup.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Download</Button>
                      <Button variant="outline" size="sm">Restore</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button className="btn-gradient">
                  Create Backup Now
                </Button>
                <Button variant="outline">
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
