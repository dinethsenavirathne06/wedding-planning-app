# Wedding Planning System - Project Documentation

## Project Summary

This is a complete **Wedding Planning and Vendor Booking System** built with modern web technologies. The application implements all required academic project objectives including CRUD operations, user management, file-based storage simulation, and object-oriented programming concepts.

## Key Features Implemented

### 1. User Management System
✅ **CREATE** - User Registration with validation
✅ **READ** - User Authentication & Session Management  
✅ **UPDATE** - Profile Information Updates
✅ **DELETE** - Account Deletion Support

### 2. Vendor Management (Full CRUD)
✅ **CREATE** - Add new vendors with complete details
✅ **READ** - Browse, search, and filter vendors by category
✅ **UPDATE** - Edit vendor information
✅ **DELETE** - Remove vendors from system

### 3. Booking Management
✅ **CREATE** - Book vendors for wedding services
✅ **READ** - View all bookings with filters
✅ **UPDATE** - Change booking status (Pending/Confirmed/Cancelled/Completed)
✅ **DELETE** - Remove bookings

### 4. Guest List Management  
✅ **CREATE** - Add guests with RSVP tracking
✅ **READ** - View and search guest list
✅ **UPDATE** - Modify guest details and RSVP status
✅ **DELETE** - Remove guests

### 5. Budget Tracker
✅ **CREATE** - Add budget items and expenses
✅ **READ** - View budget overview and breakdown
✅ **UPDATE** - Modify costs and payment status
✅ **DELETE** - Remove budget items

### 6. Task Management
✅ **CREATE** - Create tasks with priorities and due dates
✅ **READ** - View tasks organized by category
✅ **UPDATE** - Mark tasks complete, change priority
✅ **DELETE** - Remove completed tasks

## Technology Stack

- **React 18.3** with TypeScript for type safety
- **React Router v7** for navigation (Data mode pattern)
- **Tailwind CSS v4** for responsive styling
- **localStorage** for data persistence (simulating file read/write)
- **Radix UI** components for accessible UI
- **Lucide React** for icons
- **Sonner** for toast notifications

## File Structure

```
src/app/
├── App.tsx                 # Main application entry point
├── routes.ts               # React Router configuration
├── types/
│   └── index.ts           # TypeScript interfaces and types
├── utils/
│   ├── storage.ts         # Data management (CRUD operations)
│   └── fileOperations.ts  # Export/Import utilities
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Navbar.tsx         # Navigation component
│   └── ui/                # Reusable UI components
├── pages/
    ├── Login.tsx          # User login
    ├── Register.tsx       # User registration
    ├── Dashboard.tsx      # Overview & statistics
    ├── Vendors.tsx        # Vendor management
    ├── Bookings.tsx       # Booking management
    ├── GuestList.tsx      # Guest management
    ├── Budget.tsx         # Budget tracking
    └── Tasks.tsx          # Task checklist
```

## OOP Concepts Demonstrated

### 1. Encapsulation
- Data management logic encapsulated in `storage.ts`
- Type definitions separated in `types/index.ts`
- Component-level state management

### 2. Abstraction
- Generic storage functions: `getFromStorage<T>()`, `saveToStorage<T>()`
- Reusable component architecture
- Abstract data layer separating storage from UI

### 3. Type Safety (TypeScript)
- Strong typing for all data models
- Interface definitions for User, Vendor, Booking, Guest, etc.
- Compile-time error checking

## Data Storage (File Simulation)

The application uses **localStorage** to simulate file-based storage as required by the project specifications:

**Storage Keys (simulating text files):**
- `wedding_users` - User accounts data
- `wedding_vendors` - Vendor directory
- `wedding_bookings` - Booking records
- `wedding_guests` - Guest list data
- `wedding_budget` - Budget items
- `wedding_tasks` - Task checklist
- `wedding_current_user` - Active session

**File Operations:**
- **Read**: `localStorage.getItem()` simulates reading from file
- **Write**: `localStorage.setItem()` simulates writing to file
- **Export**: Download JSON backup file
- **Import**: Upload and restore data from JSON file

## Sample Data

The system includes 6 pre-loaded vendors:
1. Grand Palace Hotel (Venue) - $5,000
2. Elegant Catering Co. (Catering) - $3,500
3. Perfect Moments Photography - $2,000
4. Cinematic Dreams Video (Videography) - $2,500
5. Blooming Florals (Florist) - $1,500
6. DJ Soundwave (Music/DJ) - $1,200

## User Interface Screens

1. **Login Page** - User authentication
2. **Registration Page** - New account creation
3. **Dashboard** - Statistics and overview
4. **Vendors Page** - Browse and manage vendors
5. **Bookings Page** - Manage vendor bookings
6. **Guests Page** - Guest list and RSVP management
7. **Budget Page** - Financial tracking
8. **Tasks Page** - Wedding planning checklist

## How to Use

### First Time Setup:
1. Open the application
2. Click "Register here" to create a new account
3. Fill in your details including optional wedding date
4. Submit registration

### After Login:
1. **Dashboard** - View overview of your wedding planning progress
2. **Vendors** - Browse sample vendors or add your own
3. **Book Vendors** - Click "Book" on any vendor card
4. **Manage Guests** - Add guests and track RSVPs
5. **Track Budget** - Add expenses and monitor spending
6. **Create Tasks** - Build your wedding planning checklist
7. **Export Data** - Download backup of all your data

## Project Requirements Checklist

✅ **CRUD Operations**: All 6 modules implement full Create, Read, Update, Delete
✅ **User Management**: Complete registration, authentication, and profile management
✅ **File Storage**: localStorage simulates text file read/write operations
✅ **Multiple UIs**: 8 distinct pages with responsive design
✅ **OOP Concepts**: Encapsulation, abstraction, and type safety
✅ **Modern Technologies**: React, TypeScript, Tailwind CSS
✅ **User-Friendly Interface**: Clean design with toast notifications
✅ **Data Export**: File export feature for demonstration

## Features Beyond Requirements

🎉 **Bonus Features:**
- Real-time statistics and progress tracking
- Advanced filtering and search capabilities
- Responsive mobile-friendly design
- Toast notifications for user feedback
- Data export/backup functionality
- Drag-and-drop future enhancement ready
- Over-budget warnings
- Overdue task tracking
- RSVP status management
- Plus-one guest tracking
- Dietary restrictions tracking
- Payment status tracking

## Demo Credentials

Since this is a new instance, you can:
1. Register a new account with any email/password
2. All data persists in browser localStorage
3. Use the Export button to back up your data

## Future Enhancements

- MySQL/PostgreSQL database integration
- Email notifications for RSVPs
- Document upload (contracts, invoices)
- Calendar view for timeline
- Multi-user collaboration
- Vendor review system
- Payment gateway integration
- Mobile app version

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**
