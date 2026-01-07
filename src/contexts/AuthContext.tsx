import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, initializeApp } from '@/lib/api';

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin' | 'staff';
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initializeApp();
        
        const savedUser = localStorage.getItem('pg_admin_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const me = await api.get<User>('/auth/me');
          setUser({ ...me, token: parsedUser.token });
        }
      } catch (error) {
        localStorage.removeItem('pg_admin_user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<User>('/auth/login', { username, password });
      setUser(response);
      localStorage.setItem('pg_admin_user', JSON.stringify(response));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('pg_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
