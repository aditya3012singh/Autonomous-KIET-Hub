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
  Bell,
  Search,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

// Custom Logo Component matching home page
const NoteNexusLogo = ({ className = "h-8 w-8", textSize = "text-xl" }) => (
  <div className="flex items-center space-x-3">
    <div className="relative">
      <div className={`bg-gradient-to-br from-blue-600 via-purple-600 to-amber-500 p-2 rounded-xl ${className} flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}>
        <BookOpen className="h-5 w-5 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
    </div>
    <span className={`${textSize} font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent`}>
      NoteNexus
    </span>
  </div>
);

const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: LayoutDashboard, color: 'from-blue-500 to-blue-600' },
    { name: 'Study Notes', href: '/user/notes', icon: FileText, color: 'from-purple-500 to-purple-600' },
    { name: 'Study Tips', href: '/user/tips', icon: Lightbulb, color: 'from-amber-500 to-amber-600' },
    { name: 'Events', href: '/user/events', icon: Calendar, color: 'from-green-500 to-green-600' },
    { name: 'Announcements', href: '/user/announcements', icon: MessageSquare, color: 'from-red-500 to-red-600' },
    { name: 'Profile', href: '/user/profile', icon: User, color: 'from-slate-500 to-slate-600' },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (href: string) => {
    if (href === '/user') {
      return location.pathname === '/user';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Mobile Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Mobile Logo */}
            <Link to="/user" className="flex items-center px-4 mb-8 transform hover:scale-105 transition-transform duration-200">
              <NoteNexusLogo />
            </Link>

            {/* Mobile Navigation */}
            <nav className="px-3 space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      active
                        ? 'bg-white/70 backdrop-blur-sm shadow-lg text-slate-800 border border-white/20'
                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r ${item.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Mobile User Info */}
          <div className="flex-shrink-0 border-t border-white/20 p-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Student Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-md shadow-xl border-r border-white/20">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            {/* Desktop Logo */}
            <Link to="/user" className="flex items-center px-6 mb-8 transform hover:scale-105 transition-transform duration-200">
              <NoteNexusLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${
                      active
                        ? 'bg-white/70 backdrop-blur-sm shadow-lg text-slate-800 border border-white/20'
                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-gradient-to-r ${item.color} shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop User Info */}
          <div className="flex-shrink-0 border-t border-white/20 p-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2 shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500">Student Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72 flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 md:hidden bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:bg-white/50 transition-all duration-200 transform hover:scale-110"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg text-slate-600 hover:bg-white/50 transition-all duration-200 transform hover:scale-110">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-600 hover:bg-white/50 transition-all duration-200 transform hover:scale-110 relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block sticky top-0 z-20 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-slate-600 mt-1">Ready to continue your learning journey?</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pl-10 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
              
              <button className="p-2 rounded-lg text-slate-600 hover:bg-white/50 transition-all duration-200 transform hover:scale-110 relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 relative">
          {/* Background Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-amber-200 rounded-full opacity-30 animate-pulse delay-2000"></div>
          
          <div className="relative z-10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;