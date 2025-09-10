# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FEAIAgent is a Next.js frontend application for testing AI Agent APIs. The project uses:
- Next.js framework
- TailwindCSS for styling
- Google Material Design style guidelines
ทุกอย่างที่คุยและคอมเม้นเป็นภาษาไทยทั้งหมด

## Design System

### Final Color Scheme (Standard Tailwind):
- **Primary**: `blue-600` - Navbar background, main brand color
- **Cards**: Gradient combinations using `blue-300` to `blue-600` and `slate-500` to `slate-600`
- **Text**: `gray-800` for headers, `gray-600` for secondary text
- **Background**: Gradient from `blue-50` via `indigo-50` to `sky-50`
- **Hover States**: `blue-50` for subtle hover effects
- **Accents**: `green-500` for success, `yellow-500` for warnings

### Design Patterns:
- **Stats Cards**: Each uses different blue gradient (blue-500/600, blue-400/500, blue-300/400, slate-500/600)
- **Icons**: White icons in `bg-white/20 backdrop-blur-sm` containers
- **Navigation**: Active states use `bg-white text-blue-600`
- **Typography**: `font-black` for emphasis, `font-bold` for headers, `font-semibold` for content
- **Rounded Corners**: `rounded-2xl` for cards, `rounded-xl` for interactive elements
- **Shadows**: `shadow-lg` with `hover:shadow-xl` transitions

## API Configuration

The application connects to TMS AI Tools API server:
- Base URL: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### API Modules:
- **Customers** - Customer management (CRUD, search by phone, statistics)
- **Vehicles** - Vehicle management (CRUD, filter by type/status)  
- **Jobs** - Job/Order management (CRUD, status tracking, daily summary)
- **Transportation** - Transportation records (CRUD, cost analysis, date-based stats)

## Development Commands

Since this is a Next.js project, typical commands will be:
- `npm run dev` - Start development server (currently running successfully)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linting (to be run after code changes)
- `npm run typecheck` - Run TypeScript type checking (if available)

### Known Working Commands:
- `npm run dev` ✅ Working - Development server runs on http://localhost:3000
- Backend API should be running on http://localhost:8000 for full functionality

## Architecture Notes

### Frontend Structure Plan:
- **App Router** - Next.js 13+ with app directory structure
- **Modern Design** - Clean, minimal design inspired by modern dashboards
- **State Management** - React Query for API state + Zustand for global state
- **API Layer** - TypeScript interfaces with Axios client

### Main Application Modules:
1. **Dashboard** - Overview statistics and summaries
2. **Customers** - Customer management interface  
3. **Vehicles** - Vehicle tracking and status management
4. **Jobs** - Order processing and status tracking
5. **Transportation** - Transportation records and analytics

### Component Architecture:
```
components/
├── ui/ - Reusable modern UI components
├── forms/ - Entity forms (Customer, Vehicle, Job)
├── tables/ - Data tables with search/filter/pagination  
├── charts/ - Analytics visualization components
├── layout/ - Navigation and layout components (Navbar, Layout)
└── modals/ - Create/Edit modal dialogs
```

### Current Implementation Status:
✅ **Completed:**
- Next.js project setup with TypeScript (v15.5.2 with Turbopack)
- TailwindCSS configuration with blue color palette
- Layout components (Navbar, Layout)
- Dashboard page with stats cards and activity feeds
- API client structure and TypeScript types
- React Query provider setup
- All CRUD pages (Customers, Vehicles, Jobs, Transportation) with full functionality
- Data tables with search/filter/pagination capabilities
- Modal forms for creating/editing all entities (Customer, Vehicle, Job, Transportation)
- FloatingMenu component with comprehensive API access (25+ endpoints)
- Toast notification system for user feedback
- Form validation with proper error handling
- SSR/Hydration compatibility fixes (useId, crypto.randomUUID)

✅ **Bug Fixes Applied:**
- Fixed hydration mismatch errors in Select and Input components (replaced Math.random() with useId())
- Fixed Toast component ID generation using crypto.randomUUID()
- Fixed date calculation stability in modal components using useMemo()
- Fixed JSON parsing errors in FloatingMenu API calls with proper error handling
- Proper HTTP status checking and Content-Type validation

🚧 **Future Enhancements:**
- Charts and analytics components for deeper insights
- Real-time features with WebSocket integration
- Advanced filtering and search capabilities
- Export functionality for data reports

### Data Management:
- **React Query** - API calls, caching, synchronization
- **Optimistic Updates** - Immediate UI feedback
- **Real-time Features** - Job status updates
- **Pagination** - Handle large datasets efficiently