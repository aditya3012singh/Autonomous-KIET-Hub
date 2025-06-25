import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/Layout/AdminLayout';
import UserLayout from './components/Layout/UserLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNotes from './pages/admin/AdminNotes';
import AdminTips from './pages/admin/AdminTips';
import AdminEvents from './pages/admin/AdminEvents';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSubjects from './pages/admin/AdminSubjects';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import UserNotes from './pages/user/UserNotes';
import UserTips from './pages/user/UserTips';
import UserEvents from './pages/user/UserEvents';
import UserAnnouncements from './pages/user/UserAnnouncements';
import UserProfile from './pages/user/UserProfile';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EduShare...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace /> : <LoginForm />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace /> : <SignupForm />} 
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="notes" element={<AdminNotes />} />
          <Route path="tips" element={<AdminTips />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subjects" element={<AdminSubjects />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="notes" element={<UserNotes />} />
          <Route path="tips" element={<UserTips />} />
          <Route path="events" element={<UserEvents />} />
          <Route path="announcements" element={<UserAnnouncements />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* Root redirect based on user role */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to={user.role === 'ADMIN' ? '/admin' : '/user'} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;