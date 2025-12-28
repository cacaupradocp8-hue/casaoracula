import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PortalLevel } from '@/types/portal';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePortalLevel: (userId: string, level: PortalLevel) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for MVP (will be replaced with Supabase)
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@casaoracula.com',
    name: 'Guardiã Principal',
    portalLevel: 4,
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'iniciada@casaoracula.com',
    name: 'Maria Iniciada',
    portalLevel: 3,
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'pre@casaoracula.com',
    name: 'Ana Pré-Iniciada',
    portalLevel: 2,
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('casaoracula_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        parsed.createdAt = new Date(parsed.createdAt);
        setUser(parsed);
      } catch {
        localStorage.removeItem('casaoracula_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('casaoracula_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return { success: true };
    }
    
    // For MVP: create new user as Portal 1
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      portalLevel: 1,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('casaoracula_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setIsLoading(false);
      return { success: false, error: 'Este email já está cadastrado.' };
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      portalLevel: 1,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('casaoracula_user', JSON.stringify(newUser));
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('casaoracula_user');
  };

  const updatePortalLevel = (userId: string, level: PortalLevel) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, portalLevel: level };
      setUser(updatedUser);
      localStorage.setItem('casaoracula_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updatePortalLevel,
    }}>
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
