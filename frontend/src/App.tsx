import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import Tips from './pages/Tips';
import Events from './pages/Events';
import Announcements from './pages/Announcements';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <LoginForm />} 
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tips" element={<Tips />} />
          <Route path="events" element={<Events />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="upload" element={<div className="p-8 text-center text-gray-500">Upload page coming soon...</div>} />
          <Route path="admin/*" element={
            <ProtectedRoute adminOnly>
              <div className="p-8 text-center text-gray-500">Admin panel coming soon...</div>
            </ProtectedRoute>
          } />
        </Route>
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