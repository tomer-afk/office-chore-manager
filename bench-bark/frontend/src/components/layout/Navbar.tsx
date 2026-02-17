import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaDog, FaBars, FaTimes, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/constants';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin } = useAuthStore();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navLinks = [
    { to: ROUTES.DASHBOARD, label: 'Dashboard' },
    { to: ROUTES.DOGS, label: 'My Dogs' },
    { to: ROUTES.LESSONS, label: 'Training' },
  ];

  const adminLinks = [
    { to: ROUTES.ADMIN_LESSONS, label: 'Manage Lessons' },
    { to: ROUTES.ADMIN_CATEGORIES, label: 'Manage Categories' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <FaDog className="text-2xl text-bark-500" />
            <span className="text-xl font-bold text-gray-900">Bench Bark</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-bark-50 text-bark-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                  <FaCog className="text-xs" /> Admin
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {adminLinks.map((link) => (
                    <Link key={link.to} to={link.to} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={() => logout()} className="text-gray-400 hover:text-gray-600">
              <FaSignOutAlt />
            </button>
          </div>

          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.to) ? 'bg-bark-50 text-bark-700' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { logout(); setMobileOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
