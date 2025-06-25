import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Upload,
  Megaphone,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', name: 'Users', icon: Users },
  { id: 'subjects', name: 'Subjects', icon: BookOpen },
  { id: 'notes', name: 'Notes', icon: FileText },
  { id: 'tips', name: 'Tips', icon: Lightbulb },
  { id: 'files', name: 'Files', icon: Upload },
  { id: 'announcements', name: 'Announcements', icon: Megaphone },
  { id: 'events', name: 'Events', icon: Calendar },
  { id: 'feedback', name: 'Feedback', icon: MessageSquare },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 z-40 border-r border-gray-100">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">EduShare</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}