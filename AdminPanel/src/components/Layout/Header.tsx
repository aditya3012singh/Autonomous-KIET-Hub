import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
}

interface User {
  name?: string;
  email?: string;
  role?: string;
}

export function Header({ title }: HeaderProps) {
  // Mock user data for demonstration
  const user: User = {
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Administrator'
  };
  
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    console.log('Logout clicked');
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20 fixed top-0 left-64 right-0 z-30 shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-80 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <button className="relative p-2 text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition-colors duration-200">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 pl-4 border-l border-gray-300 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-black">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-600">{user?.role || 'Administrator'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-black">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Account Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}