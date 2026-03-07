import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Bookings from './pages/Bookings';
import GuestList from './pages/GuestList';
import Budget from './pages/Budget';
import Tasks from './pages/Tasks';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'vendors', element: <Vendors /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'guests', element: <GuestList /> },
      { path: 'budget', element: <Budget /> },
      { path: 'tasks', element: <Tasks /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
