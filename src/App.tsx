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
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import Rooms from "./pages/Rooms";
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
            <Route path="/property/pg-list" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/property/floors" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/property/rooms" element={<AdminLayout><Rooms /></AdminLayout>} />
            <Route path="/property/beds" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Tenants */}
            <Route path="/tenants" element={<AdminLayout><Tenants /></AdminLayout>} />
            <Route path="/tenants/add" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/tenants/check-in-out" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/tenants/kyc" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Billing */}
            <Route path="/billing/generate" element={<AdminLayout><Billing /></AdminLayout>} />
            <Route path="/billing/payments" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/billing/dues" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/billing/receipts" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Inventory */}
            <Route path="/inventory/categories" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/inventory/items" element={<AdminLayout><Inventory /></AdminLayout>} />
            <Route path="/inventory/stock" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/inventory/vendors" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/inventory/alerts" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Services */}
            <Route path="/services/food" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/services/laundry" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/services/housekeeping" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/services/maintenance" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            {/* Other */}
            <Route path="/complaints" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/staff" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/security" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/reports" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/expenses" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/notifications" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/settings" element={<AdminLayout><Placeholder /></AdminLayout>} />
            <Route path="/help" element={<AdminLayout><Placeholder /></AdminLayout>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
