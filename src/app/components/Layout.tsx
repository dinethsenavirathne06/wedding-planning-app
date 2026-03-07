import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { authStorage, initializeSampleData } from '../utils/storage';
import Navbar from '../components/Navbar';

export default function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();

    // Check authentication
    const currentUser = authStorage.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
