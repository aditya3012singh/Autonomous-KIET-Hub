import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';


import { AuthContextType, User } from '../types';
import { apiService, setForceLogout } from '../services/api';
import { setGlobalNavigate } from '../utils/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  let tokenTimeout: NodeJS.Timeout;

  // Setup global navigate for API fallback
  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  // Force logout shared method
  const forceLogoutAndRedirect = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setRedirecting(true);
    toast.error('Session expired. Redirecting to login...');
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
  }, [navigate]);

  useEffect(() => {
    setForceLogout(forceLogoutAndRedirect);
  }, [forceLogoutAndRedirect]);

  // Load user and setup token expiry auto-logout
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        const decoded: { exp: number } = jwtDecode(storedToken);
        const expiryTime = decoded.exp * 1000; // convert to ms
        const currentTime = Date.now();

        if (currentTime >= expiryTime) {
          forceLogoutAndRedirect();
        } else {
          const timeLeft = expiryTime - currentTime;

          tokenTimeout = setTimeout(() => {
            forceLogoutAndRedirect();
          }, timeLeft);

          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Invalid token:", err);
        forceLogoutAndRedirect();
      }
    }

    setIsLoading(false);

    // Cleanup timer on unmount
    return () => clearTimeout(tokenTimeout);
  }, [forceLogoutAndRedirect]);

  // Manual login
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Manual logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, forceLogoutAndRedirect, isLoading, setUser }}>
      {!redirecting && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
