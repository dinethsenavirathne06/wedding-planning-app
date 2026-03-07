// Utility functions for exporting/importing data (simulating file operations)

export function exportDataToFile(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportAllData() {
  const allData = {
    users: localStorage.getItem('wedding_users'),
    vendors: localStorage.getItem('wedding_vendors'),
    bookings: localStorage.getItem('wedding_bookings'),
    guests: localStorage.getItem('wedding_guests'),
    budget: localStorage.getItem('wedding_budget'),
    tasks: localStorage.getItem('wedding_tasks'),
    exportedAt: new Date().toISOString(),
  };

  exportDataToFile(allData, `wedding-data-backup-${Date.now()}.json`);
}

export function importDataFromFile(file: File, callback: (success: boolean) => void) {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);
      
      // Restore data to localStorage
      if (data.users) localStorage.setItem('wedding_users', data.users);
      if (data.vendors) localStorage.setItem('wedding_vendors', data.vendors);
      if (data.bookings) localStorage.setItem('wedding_bookings', data.bookings);
      if (data.guests) localStorage.setItem('wedding_guests', data.guests);
      if (data.budget) localStorage.setItem('wedding_budget', data.budget);
      if (data.tasks) localStorage.setItem('wedding_tasks', data.tasks);
      
      callback(true);
    } catch (error) {
      console.error('Error importing data:', error);
      callback(false);
    }
  };
  
  reader.onerror = () => {
    callback(false);
  };
  
  reader.readAsText(file);
}

export function clearAllData() {
  const keys = [
    'wedding_users',
    'wedding_vendors',
    'wedding_bookings',
    'wedding_guests',
    'wedding_budget',
    'wedding_tasks',
    'wedding_current_user',
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
}
