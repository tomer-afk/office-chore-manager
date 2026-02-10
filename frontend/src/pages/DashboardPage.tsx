import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../config/constants';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              Office Chore Manager
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.CHORES}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Chores
              </Link>
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}!
              </span>
              <Button variant="outline" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Welcome to your chore management dashboard! The calendar view and chore management features will be built next.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Total Chores</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Info</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>User ID:</strong> {user?.id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
