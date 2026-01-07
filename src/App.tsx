import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tenants from "./pages/Tenants";
import AddTenant from "./pages/AddTenant";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Rooms from "./pages/Rooms";
import PGList from "./pages/PGList";
import Floors from "./pages/Floors";
import Staff from "./pages/Staff";
import Complaints from "./pages/Complaints";
import Security from "./pages/Security";
import Reports from "./pages/Reports";
import Expenses from "./pages/Expenses";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Services from "./pages/Services";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
            
            {/* Property */}
            <Route path="/property/pg-list" element={<AdminLayout><PGList /></AdminLayout>} />
            <Route path="/property/floors" element={<AdminLayout><Floors /></AdminLayout>} />
            <Route path="/property/rooms" element={<AdminLayout><Rooms /></AdminLayout>} />
            <Route path="/property/beds" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Tenants */}
            <Route path="/tenants" element={<AdminLayout><Tenants /></AdminLayout>} />
            <Route path="/tenants/add" element={<AdminLayout><AddTenant /></AdminLayout>} />
            <Route path="/tenants/check-in-out" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/tenants/kyc" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Billing */}
            <Route path="/billing/generate" element={<AdminLayout><Billing /></AdminLayout>} />
            <Route path="/billing/payments" element={<AdminLayout><Billing /></AdminLayout>} />
            <Route path="/billing/dues" element={<AdminLayout><Billing /></AdminLayout>} />
            <Route path="/billing/receipts" element={<AdminLayout><Billing /></AdminLayout>} />
            
            {/* Inventory */}
            <Route path="/inventory/categories" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/inventory/items" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/inventory/stock" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/inventory/vendors" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/inventory/alerts" element={<AdminLayout><Inventory /></AdminLayout>} />
            
            {/* Services */}
            <Route path="/services/food" element={<AdminLayout><Services /></AdminLayout>} />
            <Route path="/services/laundry" element={<AdminLayout><Services /></AdminLayout>} />
            <Route path="/services/housekeeping" element={<AdminLayout><Services /></AdminLayout>} />
            <Route path="/services/maintenance" element={<AdminLayout><Services /></AdminLayout>} />
            
            {/* Other */}
            <Route path="/complaints" element={<AdminLayout><Complaints /></AdminLayout>} />
            <Route path="/staff" element={<AdminLayout><Staff /></AdminLayout>} />
            <Route path="/security" element={<AdminLayout><Security /></AdminLayout>} />
            <Route path="/reports" element={<AdminLayout><Reports /></AdminLayout>} />
            <Route path="/expenses" element={<AdminLayout><Expenses /></AdminLayout>} />
            <Route path="/notifications" element={<AdminLayout><Notifications /></AdminLayout>} />
            <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
            <Route path="/help" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
