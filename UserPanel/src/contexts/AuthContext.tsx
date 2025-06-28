import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from '../types';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.signin(email, password);
      const token = response.jwt;
      const userData: User = response.user;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);

      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(userData.role === 'ADMIN' ? '/admin' : '/user');
      }, 1500);
    } catch (error: any) {
      const message = error?.message?.toLowerCase?.() || '';

      if (message.includes('not found')) {
        toast.error('User not found. Redirecting to signup in 3s...');
        setTimeout(() => navigate('/signup'), 3000);
      } else if (message.includes('incorrect password')) {
        toast.error('Incorrect password. Please try again.');
      } else {
        toast.error(error?.message || 'Login failed');
      }

      throw error; // allows component to handle edge cases if needed
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
