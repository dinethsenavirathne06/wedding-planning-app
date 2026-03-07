import { User, Vendor, Booking, Guest, BudgetItem, Task } from '../types';

const STORAGE_KEYS = {
  USERS: 'wedding_users',
  VENDORS: 'wedding_vendors',
  BOOKINGS: 'wedding_bookings',
  GUESTS: 'wedding_guests',
  BUDGET: 'wedding_budget',
  TASKS: 'wedding_tasks',
  CURRENT_USER: 'wedding_current_user',
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// User Management
export const userStorage = {
  getAll: (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS),
  
  getById: (id: string): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.id === id);
  },
  
  getByEmail: (email: string): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  
  create: (user: User): User => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    users.push(user);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  },
  
  update: (id: string, updates: Partial<User>): User | undefined => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveToStorage(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const users = getFromStorage<User>(STORAGE_KEYS.USERS);
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length !== users.length) {
      saveToStorage(STORAGE_KEYS.USERS, filtered);
      return true;
    }
    return false;
  },
};

// Vendor Management
export const vendorStorage = {
  getAll: (): Vendor[] => getFromStorage<Vendor>(STORAGE_KEYS.VENDORS),
  
  getById: (id: string): Vendor | undefined => {
    const vendors = getFromStorage<Vendor>(STORAGE_KEYS.VENDORS);
    return vendors.find(v => v.id === id);
  },
  
  getByCategory: (category: string): Vendor[] => {
    const vendors = getFromStorage<Vendor>(STORAGE_KEYS.VENDORS);
    return vendors.filter(v => v.category === category);
  },
  
  create: (vendor: Vendor): Vendor => {
    const vendors = getFromStorage<Vendor>(STORAGE_KEYS.VENDORS);
    vendors.push(vendor);
    saveToStorage(STORAGE_KEYS.VENDORS, vendors);
    return vendor;
  },
  
  update: (id: string, updates: Partial<Vendor>): Vendor | undefined => {
    const vendors = getFromStorage<Vendor>(STORAGE_KEYS.VENDORS);
    const index = vendors.findIndex(v => v.id === id);
    if (index !== -1) {
      vendors[index] = { ...vendors[index], ...updates };
      saveToStorage(STORAGE_KEYS.VENDORS, vendors);
      return vendors[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const vendors = getFromStorage<Vendor>(STORAGE_KEYS.VENDORS);
    const filtered = vendors.filter(v => v.id !== id);
    if (filtered.length !== vendors.length) {
      saveToStorage(STORAGE_KEYS.VENDORS, filtered);
      return true;
    }
    return false;
  },
};

// Booking Management
export const bookingStorage = {
  getAll: (): Booking[] => getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS),
  
  getByUserId: (userId: string): Booking[] => {
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    return bookings.filter(b => b.userId === userId);
  },
  
  getById: (id: string): Booking | undefined => {
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    return bookings.find(b => b.id === id);
  },
  
  create: (booking: Booking): Booking => {
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    bookings.push(booking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    return booking;
  },
  
  update: (id: string, updates: Partial<Booking>): Booking | undefined => {
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates };
      saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
      return bookings[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const bookings = getFromStorage<Booking>(STORAGE_KEYS.BOOKINGS);
    const filtered = bookings.filter(b => b.id !== id);
    if (filtered.length !== bookings.length) {
      saveToStorage(STORAGE_KEYS.BOOKINGS, filtered);
      return true;
    }
    return false;
  },
};

// Guest Management
export const guestStorage = {
  getByUserId: (userId: string): Guest[] => {
    const guests = getFromStorage<Guest>(STORAGE_KEYS.GUESTS);
    return guests.filter(g => g.userId === userId);
  },
  
  create: (guest: Guest): Guest => {
    const guests = getFromStorage<Guest>(STORAGE_KEYS.GUESTS);
    guests.push(guest);
    saveToStorage(STORAGE_KEYS.GUESTS, guests);
    return guest;
  },
  
  update: (id: string, updates: Partial<Guest>): Guest | undefined => {
    const guests = getFromStorage<Guest>(STORAGE_KEYS.GUESTS);
    const index = guests.findIndex(g => g.id === id);
    if (index !== -1) {
      guests[index] = { ...guests[index], ...updates };
      saveToStorage(STORAGE_KEYS.GUESTS, guests);
      return guests[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const guests = getFromStorage<Guest>(STORAGE_KEYS.GUESTS);
    const filtered = guests.filter(g => g.id !== id);
    if (filtered.length !== guests.length) {
      saveToStorage(STORAGE_KEYS.GUESTS, filtered);
      return true;
    }
    return false;
  },
};

// Budget Management
export const budgetStorage = {
  getByUserId: (userId: string): BudgetItem[] => {
    const items = getFromStorage<BudgetItem>(STORAGE_KEYS.BUDGET);
    return items.filter(i => i.userId === userId);
  },
  
  create: (item: BudgetItem): BudgetItem => {
    const items = getFromStorage<BudgetItem>(STORAGE_KEYS.BUDGET);
    items.push(item);
    saveToStorage(STORAGE_KEYS.BUDGET, items);
    return item;
  },
  
  update: (id: string, updates: Partial<BudgetItem>): BudgetItem | undefined => {
    const items = getFromStorage<BudgetItem>(STORAGE_KEYS.BUDGET);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      saveToStorage(STORAGE_KEYS.BUDGET, items);
      return items[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const items = getFromStorage<BudgetItem>(STORAGE_KEYS.BUDGET);
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length !== items.length) {
      saveToStorage(STORAGE_KEYS.BUDGET, filtered);
      return true;
    }
    return false;
  },
};

// Task Management
export const taskStorage = {
  getByUserId: (userId: string): Task[] => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS);
    return tasks.filter(t => t.userId === userId);
  },
  
  create: (task: Task): Task => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS);
    tasks.push(task);
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
    return task;
  },
  
  update: (id: string, updates: Partial<Task>): Task | undefined => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS);
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      saveToStorage(STORAGE_KEYS.TASKS, tasks);
      return tasks[index];
    }
    return undefined;
  },
  
  delete: (id: string): boolean => {
    const tasks = getFromStorage<Task>(STORAGE_KEYS.TASKS);
    const filtered = tasks.filter(t => t.id !== id);
    if (filtered.length !== tasks.length) {
      saveToStorage(STORAGE_KEYS.TASKS, filtered);
      return true;
    }
    return false;
  },
};

// Auth functions
export const authStorage = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },
  
  login: (email: string, password: string): User | null => {
    const user = userStorage.getByEmail(email);
    if (user && user.password === password) {
      authStorage.setCurrentUser(user);
      return user;
    }
    return null;
  },
  
  logout: (): void => {
    authStorage.setCurrentUser(null);
  },
  
  register: (userData: Omit<User, 'id' | 'createdAt'>): User | null => {
    const existingUser = userStorage.getByEmail(userData.email);
    if (existingUser) {
      return null; // User already exists
    }
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    userStorage.create(newUser);
    authStorage.setCurrentUser(newUser);
    return newUser;
  },
};

// Initialize with sample data
export function initializeSampleData() {
  const vendors = vendorStorage.getAll();
  if (vendors.length === 0) {
    const sampleVendors: Vendor[] = [
      {
        id: '1',
        name: 'Grand Palace Hotel',
        category: 'Venue',
        description: 'Luxurious wedding venue with stunning ballroom and outdoor gardens',
        price: 5000,
        contact: '+1-555-0101',
        email: 'info@grandpalace.com',
        location: 'Downtown, City Center',
        rating: 4.8,
        image: 'wedding-venue',
        available: true,
        createdBy: 'admin',
      },
      {
        id: '2',
        name: 'Elegant Catering Co.',
        category: 'Catering',
        description: 'Full-service catering with customizable menus for all tastes',
        price: 3500,
        contact: '+1-555-0102',
        email: 'contact@elegantcatering.com',
        location: 'West District',
        rating: 4.6,
        image: 'catering-food',
        available: true,
        createdBy: 'admin',
      },
      {
        id: '3',
        name: 'Perfect Moments Photography',
        category: 'Photography',
        description: 'Award-winning wedding photography capturing your special moments',
        price: 2000,
        contact: '+1-555-0103',
        email: 'hello@perfectmoments.com',
        location: 'East Side',
        rating: 4.9,
        image: 'wedding-photography',
        available: true,
        createdBy: 'admin',
      },
      {
        id: '4',
        name: 'Cinematic Dreams Video',
        category: 'Videography',
        description: 'Professional wedding videography with drone footage',
        price: 2500,
        contact: '+1-555-0104',
        email: 'info@cinematicdreams.com',
        location: 'North Quarter',
        rating: 4.7,
        image: 'wedding-videography',
        available: true,
        createdBy: 'admin',
      },
      {
        id: '5',
        name: 'Blooming Florals',
        category: 'Florist',
        description: 'Beautiful floral arrangements and wedding decorations',
        price: 1500,
        contact: '+1-555-0105',
        email: 'orders@bloomingflorals.com',
        location: 'Garden District',
        rating: 4.5,
        image: 'wedding-flowers',
        available: true,
        createdBy: 'admin',
      },
      {
        id: '6',
        name: 'DJ Soundwave',
        category: 'Music/DJ',
        description: 'Professional DJ services with extensive music library',
        price: 1200,
        contact: '+1-555-0106',
        email: 'booking@djsoundwave.com',
        location: 'Central Area',
        rating: 4.4,
        image: 'wedding-dj',
        available: true,
        createdBy: 'admin',
      },
    ];
    
    sampleVendors.forEach(vendor => vendorStorage.create(vendor));
  }
}
