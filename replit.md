# Parameshwari Girls PG Management System

## Overview
A complete PG (Paying Guest) management solution with MongoDB Atlas integration. The system stores all admin, inventory, tenant, billing, and staff data in MongoDB with real-time synchronization.

## Project Architecture
- **Frontend**: React 18 with Vite, TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Express.js with Mongoose ODM
- **Database**: MongoDB Atlas (anilvasisht027_db)
- **Routing**: React Router DOM v6
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT-based with bcrypt password hashing

## Project Structure
```
├── server/
│   ├── config/         - Database configuration
│   ├── models/         - Mongoose models (Admin, Tenant, Room, Floor, etc.)
│   ├── routes/         - API routes (auth, tenants, inventory, etc.)
│   ├── middleware/     - JWT auth middleware
│   └── index.js        - Express server entry point
├── src/
│   ├── components/
│   │   ├── layout/     - AdminLayout, AdminSidebar components
│   │   └── ui/         - Shadcn UI components
│   ├── contexts/       - AuthContext for authentication
│   ├── hooks/          - Custom hooks (use-mobile, use-toast)
│   ├── lib/            - Utility functions, API client
│   └── pages/          - Page components (Dashboard, Tenants, etc.)
```

## Database Models
- **Admin** - System administrators with JWT authentication
- **Tenant** - PG residents with room/bed assignments
- **Room** - Individual rooms with floor references
- **Floor** - Floor information
- **Bed** - Beds within rooms
- **Billing** - Monthly billing records
- **Payment** - Payment transactions
- **Expense** - Expense tracking
- **Inventory** - Inventory items management
- **Staff** - Staff members
- **Complaint** - Tenant complaints
- **Notification** - System notifications
- **Activity** - Activity logs
- **PG** - PG property information

## Key Features
- Dashboard with real-time analytics from MongoDB
- Tenant management with CRUD operations
- Room and floor management
- Billing and expenses tracking
- Inventory management
- Staff management
- JWT-based authentication
- Real-time data synchronization

## Running the Project
The application uses concurrently to run both servers:
- Frontend: Vite on port 5000
- Backend: Express on port 3001 (proxied via Vite)

```bash
npm run dev
```

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## Environment Variables
- `MONGODB_URI` - MongoDB Atlas connection string
- `DB_NAME` - Database name (anilvasisht027_db)
- `JWT_SECRET` - JWT signing secret

## API Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/init` - Initialize default admin
- `GET/POST /api/tenants` - Tenant CRUD
- `GET/POST /api/inventory` - Inventory CRUD
- `GET/POST /api/rooms` - Room management
- `GET/POST /api/staff` - Staff management
- `GET /api/dashboard/stats` - Dashboard statistics

## Recent Changes
- January 2026: Added MongoDB Atlas integration with Mongoose
- January 2026: Implemented 14 database models
- January 2026: Added JWT authentication with bcrypt
- January 2026: Updated Tenants and Inventory pages to use real API
- January 2026: Migrated from Lovable to Replit environment
