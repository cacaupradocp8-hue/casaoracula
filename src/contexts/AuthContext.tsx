import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PortalType, canAccessFeature, getCaseLimit } from '@/types/portal';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePortal: (userId: string, portal: PortalType) => void;
  canAccess: (requiredPortal: PortalType) => boolean;
  canCreateCase: (currentCaseCount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for MVP (will be replaced with backend)
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@casaoracula.com',
    password: 'admin123',
    name: 'Guardiã Principal',
    portal: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'iniciada@casaoracula.com',
    password: 'iniciada123',
    name: 'Maria Iniciada',
    portal: 'iniciada',
    createdAt: new Date(),
  },
  {
    id: '3',
    email: 'pre@casaoracula.com',
    password: 'pre123',
    name: 'Ana Pré-Iniciada',
    portal: 'pre_iniciada',
    createdAt: new Date(),
  },
  {
    id: '4',
    email: 'visitante@casaoracula.com',
    password: 'visitante123',
    name: 'Clara Visitante',
    portal: 'visitante',
    createdAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('casaoracula_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Email ou senha incorretos.' };
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
      portal: 'visitante',
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

  const updatePortal = (userId: string, portal: PortalType) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, portal };
      setUser(updatedUser);
      localStorage.setItem('casaoracula_user', JSON.stringify(updatedUser));
    }
  };

  const canAccess = (requiredPortal: PortalType): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, requiredPortal);
  };

  const canCreateCase = (currentCaseCount: number): boolean => {
    if (!user) return false;
    if (user.portal === 'visitante') return false;
    const limit = getCaseLimit(user.portal);
    if (limit === 'unlimited') return true;
    return currentCaseCount < limit;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updatePortal,
      canAccess,
      canCreateCase,
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
