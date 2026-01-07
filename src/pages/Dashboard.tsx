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
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const stats = [
  {
    title: 'Total Beds',
    value: '120',
    subtext: '18 vacant',
    icon: BedDouble,
    trend: 'up',
    trendValue: '85%',
    trendLabel: 'occupancy',
    color: 'primary',
  },
  {
    title: 'Active Tenants',
    value: '102',
    subtext: '+5 this month',
    icon: Users,
    trend: 'up',
    trendValue: '+4.9%',
    trendLabel: 'vs last month',
    color: 'accent',
  },
  {
    title: "Today's Collection",
    value: '₹45,200',
    subtext: '12 payments',
    icon: IndianRupee,
    trend: 'up',
    trendValue: '+12.3%',
    trendLabel: 'vs yesterday',
    color: 'success',
  },
  {
    title: 'Pending Dues',
    value: '₹1,25,000',
    subtext: '23 tenants',
    icon: AlertTriangle,
    trend: 'down',
    trendValue: '-8.2%',
    trendLabel: 'vs last week',
    color: 'warning',
  },
];

const recentActivities = [
  { id: 1, type: 'payment', text: 'Priya Sharma paid ₹8,500 for Room 201', time: '10 min ago' },
  { id: 2, type: 'checkin', text: 'New tenant Anita Verma checked into Room 105', time: '1 hour ago' },
  { id: 3, type: 'complaint', text: 'AC repair request from Room 304', time: '2 hours ago' },
  { id: 4, type: 'inventory', text: 'Low stock alert: Bedsheets (5 remaining)', time: '3 hours ago' },
  { id: 5, type: 'checkout', text: 'Kavita Patel checked out from Room 102', time: '5 hours ago' },
];

const upcomingDues = [
  { id: 1, tenant: 'Meera Singh', room: '203', amount: 8500, dueDate: 'Tomorrow' },
  { id: 2, tenant: 'Ritu Gupta', room: '305', amount: 9000, dueDate: 'In 2 days' },
  { id: 3, tenant: 'Shalini Das', room: '108', amount: 7500, dueDate: 'In 3 days' },
  { id: 4, tenant: 'Pooja Reddy', room: '402', amount: 10000, dueDate: 'In 4 days' },
];

const quickActions = [
  { title: 'Add Tenant', icon: Users, href: '/tenants/add' },
  { title: 'Generate Bill', icon: IndianRupee, href: '/billing/generate' },
  { title: 'Add Inventory', icon: Package, href: '/inventory/items' },
  { title: 'View Complaints', icon: MessageSquareWarning, href: '/complaints' },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="stat-card animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
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
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <action.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{action.title}</span>
          </Button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="stat-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === 'payment' ? 'bg-success' :
                  activity.type === 'checkin' ? 'bg-accent' :
                  activity.type === 'checkout' ? 'bg-muted-foreground' :
                  activity.type === 'complaint' ? 'bg-warning' :
                  'bg-destructive'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Dues */}
        <Card className="stat-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Upcoming Dues</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDues.map((due) => (
                <div
                  key={due.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {due.tenant.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{due.tenant}</p>
                      <p className="text-xs text-muted-foreground">Room {due.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">₹{due.amount.toLocaleString()}</p>
                    <p className="text-xs text-warning">{due.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy by Floor */}
        <Card className="stat-card lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Occupancy by Floor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { floor: 'Ground Floor', occupied: 18, total: 20 },
                { floor: 'First Floor', occupied: 28, total: 30 },
                { floor: 'Second Floor', occupied: 25, total: 30 },
                { floor: 'Third Floor', occupied: 22, total: 25 },
                { floor: 'Fourth Floor', occupied: 9, total: 15 },
              ].map((floor) => (
                <div key={floor.floor}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{floor.floor}</span>
                    <span className="text-muted-foreground">
                      {floor.occupied}/{floor.total} beds ({Math.round((floor.occupied / floor.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(floor.occupied / floor.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="stat-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Critical</span>
              </div>
              <p className="text-sm text-foreground">5 tenants overdue by 15+ days</p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 text-warning mb-1">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Low Stock</span>
              </div>
              <p className="text-sm text-foreground">Bedsheets, Pillows need reorder</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2 text-accent mb-1">
                <MessageSquareWarning className="w-4 h-4" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <p className="text-sm text-foreground">8 complaints awaiting action</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
