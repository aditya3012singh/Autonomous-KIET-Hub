// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import GlobalNavigate from './utils/GlobalNavigate';

import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import UserLayout from './components/Layout/UserLayout';

import UserDashboard from './pages/user/UserDashboard';
import UserNotes from './pages/user/UserNotes';
import UserTips from './pages/user/UserTips';
import UserEvents from './pages/user/UserEvents';
import UserAnnouncements from './pages/user/UserAnnouncements';
import UserProfile from './pages/user/UserProfile';
import TipDetail from './pages/user/TipDetail';
import NoteDetail from './pages/user/NoteDetail';
import ChatInterface from './components/chat/ChatInterface';
import UserFiles from './pages/user/UserFiles';
import FileDetail from './pages/user/FileDetail';
import Home from './pages/user/Home';


// Component that handles conditional routing based on auth
const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading NoteNexus...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/user" replace /> : <Home />} />
      <Route path="/login" element={user ? <Navigate to="/user" replace /> : <LoginForm />} />
      <Route path="/signup" element={user ? <Navigate to="/user" replace /> : <SignupForm />} />

      {/* Protected user routes (conditionally rendered only if user exists) */}
      {user && (
        <Route path="/user/*" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="notes" element={<UserNotes />} />
          <Route path="notes/:id" element={<NoteDetail />} />
          <Route path="tips" element={<UserTips />} />
          <Route path="tips/:id" element={<TipDetail />} />
          <Route path="events" element={<UserEvents />} />
          <Route path="announcements" element={<UserAnnouncements />} />
          <Route path="chat" element={<ChatInterface />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="files" element={<UserFiles />} />
          <Route path="files/:id" element={<FileDetail />} />
        </Route>
      )}

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
          <GlobalNavigate />
          <AppContent />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
