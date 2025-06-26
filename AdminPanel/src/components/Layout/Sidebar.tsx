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
    <div className="w-64 bg-white h-screen fixed left-0 top-0 z-40 border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">EduShare</h1>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>
      
      <nav className="px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-500 group-hover:text-black'
              }`} />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}