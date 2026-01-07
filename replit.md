# Parameshwari Girls PG Management System

## Overview
A complete PG (Paying Guest) management solution for tracking tenants, inventory, billing, and more from one powerful dashboard.

## Project Architecture
- **Frontend**: React 18 with Vite, TypeScript, Tailwind CSS, Shadcn UI components
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with tailwindcss-animate

## Project Structure
```
src/
  components/
    layout/        - AdminLayout, AdminSidebar components
    ui/            - Shadcn UI components
  contexts/        - AuthContext for authentication
  hooks/           - Custom hooks (use-mobile, use-toast)
  lib/             - Utility functions
  pages/           - Page components (Dashboard, Tenants, Billing, etc.)
public/            - Static assets
```

## Key Features
- Dashboard with analytics
- Tenant management
- Room and floor management
- Billing and expenses tracking
- Inventory management
- Staff management
- Notifications
- Reports

## Running the Project
The application runs on port 5000 using Vite development server:
```bash
npm run dev
```

## Recent Changes
- January 2026: Migrated from Lovable to Replit environment
- Updated Vite config for Replit compatibility (port 5000, allowedHosts)
