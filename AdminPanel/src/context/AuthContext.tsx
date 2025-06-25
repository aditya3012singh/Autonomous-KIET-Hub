import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      if (!data.jwt) {
        throw new Error('No token received from server');
      }

      // Decode token to get user info (simple decode, not secure verification)
      const tokenPayload = JSON.parse(atob(data.jwt.split('.')[1]));
      
      // Fetch user details
      const userResponse = await fetch('http://localhost:3000/api/v1/users/profile', {
        headers: {
          'Authorization': `Bearer ${data.jwt}`,
        },
      });

      let userData: User;
      if (userResponse.ok) {
        const userInfo = await userResponse.json();
        userData = userInfo.user;
      } else {
        // Fallback user data from token
        userData = {
          id: tokenPayload.id,
          name: 'Admin User',
          email: email,
          role: tokenPayload.role || 'ADMIN',
        };
      }

      // Only allow admin users
      if (userData.role !== 'ADMIN') {
        throw new Error('Access denied. Admin privileges required.');
      }

      setToken(data.jwt);
      setUser(userData);
      
      localStorage.setItem('auth_token', data.jwt);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}