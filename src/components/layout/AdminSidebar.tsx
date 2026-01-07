import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Package,
  UtensilsCrossed,
  MessageSquareWarning,
  UserCog,
  Shield,
  BarChart3,
  Wallet,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  {
    title: 'Property',
    icon: Building2,
    children: [
      { title: 'PG List', href: '/property/pg-list' },
      { title: 'Floors', href: '/property/floors' },
      { title: 'Rooms', href: '/property/rooms' },
      { title: 'Beds', href: '/property/beds' },
    ],
  },
  {
    title: 'Tenants',
    icon: Users,
    children: [
      { title: 'All Tenants', href: '/tenants' },
      { title: 'Add Tenant', href: '/tenants/add' },
      { title: 'Check-In/Out', href: '/tenants/check-in-out' },
      { title: 'KYC Documents', href: '/tenants/kyc' },
    ],
  },
  {
    title: 'Billing',
    icon: Receipt,
    children: [
      { title: 'Generate Bills', href: '/billing/generate' },
      { title: 'Payments', href: '/billing/payments' },
      { title: 'Due Management', href: '/billing/dues' },
      { title: 'Receipts', href: '/billing/receipts' },
    ],
  },
  {
    title: 'Inventory',
    icon: Package,
    children: [
      { title: 'Categories', href: '/inventory/categories' },
      { title: 'Items List', href: '/inventory/items' },
      { title: 'Stock Management', href: '/inventory/stock' },
      { title: 'Vendors', href: '/inventory/vendors' },
      { title: 'Alerts', href: '/inventory/alerts' },
    ],
  },
  {
    title: 'Services',
    icon: UtensilsCrossed,
    children: [
      { title: 'Food/Mess', href: '/services/food' },
      { title: 'Laundry', href: '/services/laundry' },
      { title: 'Housekeeping', href: '/services/housekeeping' },
      { title: 'Maintenance', href: '/services/maintenance' },
    ],
  },
  { title: 'Complaints', icon: MessageSquareWarning, href: '/complaints' },
  { title: 'Staff', icon: UserCog, href: '/staff' },
  { title: 'Security', icon: Shield, href: '/security' },
  { title: 'Reports', icon: BarChart3, href: '/reports' },
  { title: 'Expenses', icon: Wallet, href: '/expenses' },
  { title: 'Notifications', icon: Bell, href: '/notifications' },
  { title: 'Settings', icon: Settings, href: '/settings' },
];

const AdminSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Property', 'Tenants', 'Billing', 'Inventory']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname === child.href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar-gradient">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-bold text-sidebar-foreground">Parameshwari</h1>
            <p className="text-xs text-sidebar-muted">Girls PG</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <div key={item.title}>
            {item.href ? (
              <NavLink
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive(item.href)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </NavLink>
            ) : (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isParentActive(item.children)
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.title) && item.children && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-sidebar-border pl-4">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-all',
                          isActive(child.href)
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                        )}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <NavLink
          to="/help"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          <HelpCircle className="w-5 h-5" />
          <span>Help & Support</span>
        </NavLink>
        
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-muted capitalize">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-border"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-card shadow-md"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
