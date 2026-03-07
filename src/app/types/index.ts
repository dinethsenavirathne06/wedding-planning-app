export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  weddingDate?: string;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  price: number;
  contact: string;
  email: string;
  location: string;
  rating: number;
  image: string;
  available: boolean;
  createdBy: string;
}

export type VendorCategory = 
  | 'Venue'
  | 'Catering'
  | 'Photography'
  | 'Videography'
  | 'Florist'
  | 'Music/DJ'
  | 'Decoration'
  | 'Makeup Artist'
  | 'Transportation'
  | 'Other';

export interface Booking {
  id: string;
  vendorId: string;
  userId: string;
  vendorName: string;
  vendorCategory: VendorCategory;
  bookingDate: string;
  status: BookingStatus;
  notes: string;
  price: number;
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Guest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  rsvpStatus: RSVPStatus;
  dietaryRestrictions?: string;
  plusOne: boolean;
  group?: string;
}

export type RSVPStatus = 'Pending' | 'Attending' | 'Not Attending' | 'Maybe';

export interface BudgetItem {
  id: string;
  userId: string;
  category: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
}
