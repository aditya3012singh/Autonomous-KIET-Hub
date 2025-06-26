import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Lightbulb,
  Calendar,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
    { name: 'Study Notes', href: '/user/notes', icon: FileText },
    { name: 'Study Tips', href: '/user/tips', icon: Lightbulb },
    { name: 'Events', href: '/user/events', icon: Calendar },
    { name: 'Announcements', href: '/user/announcements', icon: MessageSquare },
    { name: 'Profile', href: '/user/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-black transform transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center px-4">
              <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-black" />
              </div>
              <span className="ml-2 text-xl font-bold text-white">EduShare</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-white text-black'
                        : 'text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className={`mr-4 h-6 w-6 ${isActive ? 'text-black' : 'text-white'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-black">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center px-4">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-black" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">EduShare</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-white text-black'
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-black' : 'text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info */}
        <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2">
              <GraduationCap className="h-5 w-5 text-black" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">Student</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-2 text-white hover:text-red-500 hover:bg-gray-800 rounded-md"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="h-12 w-12 inline-flex items-center justify-center text-black hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
