import { useQuery } from '@tanstack/react-query';
import { 
  BedDouble, 
  Users, 
  IndianRupee, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquareWarning,
  Package,
  ArrowUpRight,
  Calendar,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface DashboardStats {
  totalBeds: number;
  vacantBeds: number;
  occupiedBeds: number;
  activeTenants: number;
  todayCollection: number;
  todayPaymentsCount: number;
  pendingDues: number;
  pendingDuesCount: number;
  newTenantsThisMonth: number;
}

interface Activity {
  _id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  tenantId?: {
    name: string;
  };
}

interface UpcomingDue {
  _id: string;
  tenantId: {
    _id: string;
    name: string;
    roomId?: {
      roomNumber: string;
    };
  };
  dueAmount: number;
  dueDate: string;
}

const quickActions = [
  { title: 'Add Tenant', icon: Users, href: '/tenants/add' },
  { title: 'Generate Bill', icon: IndianRupee, href: '/billing/generate' },
  { title: 'Add Inventory', icon: Package, href: '/inventory/items' },
  { title: 'View Complaints', icon: MessageSquareWarning, href: '/complaints' },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/dashboard/recent-activities'],
  });

  const { data: upcomingDues, isLoading: duesLoading } = useQuery<UpcomingDue[]>({
    queryKey: ['/api/dashboard/upcoming-dues'],
  });
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)}L`;
    }
    return amount.toLocaleString('en-IN');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'payment': return 'bg-success';
      case 'check_in': return 'bg-accent';
      case 'check_out': return 'bg-muted-foreground';
      case 'complaint': return 'bg-warning';
      default: return 'bg-primary';
    }
  };

  const statsData = [
    {
      title: 'Total Beds',
      value: stats?.totalBeds?.toString() || '0',
      subtext: `${stats?.vacantBeds || 0} vacant`,
      icon: BedDouble,
      trend: 'up' as const,
      trendValue: stats?.totalBeds ? `${Math.round(((stats.totalBeds - stats.vacantBeds) / stats.totalBeds) * 100)}%` : '0%',
      trendLabel: 'occupancy',
      color: 'primary',
    },
    {
      title: 'Active Tenants',
      value: stats?.activeTenants?.toString() || '0',
      subtext: `+${stats?.newTenantsThisMonth || 0} this month`,
      icon: Users,
      trend: 'up' as const,
      trendValue: '+4.9%',
      trendLabel: 'vs last month',
      color: 'accent',
    },
    {
      title: "Today's Collection",
      value: `₹${formatCurrency(stats?.todayCollection || 0)}`,
      subtext: `${stats?.todayPaymentsCount || 0} payments`,
      icon: IndianRupee,
      trend: 'up' as const,
      trendValue: '+12.3%',
      trendLabel: 'vs yesterday',
      color: 'success',
    },
    {
      title: 'Pending Dues',
      value: `₹${formatCurrency(stats?.pendingDues || 0)}`,
      subtext: `${stats?.pendingDuesCount || 0} tenants`,
      icon: AlertTriangle,
      trend: 'down' as const,
      trendValue: '-8.2%',
      trendLabel: 'vs last week',
      color: 'warning',
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid="text-greeting">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening at Parameshwari Girls PG today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            data-testid={`card-stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                  stat.color === 'accent' ? 'bg-accent/10 text-accent' :
                  stat.color === 'success' ? 'bg-success/10 text-success' :
                  'bg-warning/10 text-warning'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{stat.trendValue}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground" data-testid={`text-stat-value-${index}`}>{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            data-testid={`button-quick-action-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{action.title}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="stat-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-all-activities">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  data-testid={`activity-item-${activity._id}`}
                >
                  <div className={`w-2 h-2 mt-2 rounded-full ${getActivityColor(activity.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
            )}
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg font-semibold">Upcoming Dues</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-all-dues">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {duesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : upcomingDues && upcomingDues.length > 0 ? (
                upcomingDues.map((due) => (
                  <div
                    key={due._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    data-testid={`due-item-${due._id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {due.tenantId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{due.tenantId?.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">
                          Room {due.tenantId?.roomId?.roomNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">₹{due.dueAmount?.toLocaleString() || 0}</p>
                      <p className="text-xs text-warning">
                        {due.dueDate ? formatDistanceToNow(new Date(due.dueDate), { addSuffix: true }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No upcoming dues</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="stat-card lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Occupancy Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground font-medium">Overall Occupancy</span>
                  <span className="text-muted-foreground">
                    {stats?.occupiedBeds || 0}/{stats?.totalBeds || 0} beds 
                    ({stats?.totalBeds ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${stats?.totalBeds ? (stats.occupiedBeds / stats.totalBeds) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 rounded-lg bg-success/10">
                  <p className="text-2xl font-bold text-success">{stats?.occupiedBeds || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Occupied</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-2xl font-bold text-accent">{stats?.vacantBeds || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Vacant</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <p className="text-2xl font-bold text-primary">{stats?.totalBeds || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.pendingDuesCount && stats.pendingDuesCount > 0 ? (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 text-destructive mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Payment Due</span>
                </div>
                <p className="text-sm text-foreground">{stats.pendingDuesCount} tenants have pending dues</p>
              </div>
            ) : null}
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning mb-1">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Inventory</span>
              </div>
              <p className="text-sm text-foreground">Check inventory levels regularly</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <MessageSquareWarning className="w-4 h-4" />
                <span className="text-sm font-medium">System</span>
              </div>
              <p className="text-sm text-foreground">All systems operational</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
