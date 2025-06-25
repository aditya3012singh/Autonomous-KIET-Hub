import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { Overview } from './components/Dashboard/Overview';
import { UsersList } from './components/Users/UsersList';
import { SubjectsList } from './components/Subjects/SubjectsList';
import { NotesList } from './components/Notes/NotesList';

function AdminPanel() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sectionTitles = {
    dashboard: 'Dashboard Overview',
    users: 'Users Management',
    subjects: 'Subjects Management',
    notes: 'Notes Management',
    tips: 'Tips Management',
    files: 'Files Management',
    announcements: 'Announcements',
    events: 'Events Management',
    feedback: 'Feedback Management'
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Overview />;
      case 'users':
        return <UsersList />;
      case 'subjects':
        return <SubjectsList />;
      case 'notes':
        return <NotesList />;
      case 'tips':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tips Management</h3>
            <p className="text-gray-500">Tips management interface coming soon...</p>
          </div>
        );
      case 'files':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Files Management</h3>
            <p className="text-gray-500">File management interface coming soon...</p>
          </div>
        );
      case 'announcements':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📢</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Announcements</h3>
            <p className="text-gray-500">Announcements management interface coming soon...</p>
          </div>
        );
      case 'events':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Events Management</h3>
            <p className="text-gray-500">Events management interface coming soon...</p>
          </div>
        );
      case 'feedback':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Feedback Management</h3>
            <p className="text-gray-500">Feedback management interface coming soon...</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <Layout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      title={sectionTitles[activeSection as keyof typeof sectionTitles]}
    >
      {renderContent()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;