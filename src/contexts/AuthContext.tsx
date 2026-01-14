import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PortalType, canAccessFeature, getCaseLimit } from '@/types/portal';
import { useAdminPreviewOptional } from './AdminPreviewContext';

interface User {
  id: string;
  email: string;
  name: string;
  portal: PortalType;
  createdAt: Date;
  avatarUrl?: string;
  isMatriculada?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  canAccess: (requiredPortal: PortalType) => boolean;
  canCreateCase: (currentCaseCount: number) => boolean;
  refreshUserPortal: () => Promise<void>;
  refreshMatricula: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Fetch role
      const { data: role } = await supabase
        .from('user_roles')
        .select('portal')
        .eq('user_id', userId)
        .single();

      // Check matricula
      const { data: matricula } = await supabase
        .from('matriculas')
        .select('id')
        .eq('user_id', userId)
        .eq('curso_id', 'formacao_oracula')
        .eq('ativa', true)
        .maybeSingle();

      if (profile) {
        setUser({
          id: userId,
          email: profile.email || '',
          name: profile.nome || '',
          portal: (role?.portal as PortalType) || 'visitante',
          createdAt: new Date(profile.created_at),
          avatarUrl: profile.avatar_url || undefined,
          isMatriculada: !!matricula,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Refresh user portal from database
  const refreshUserPortal = async () => {
    if (!user) return;
    
    const { data: role } = await supabase
      .from('user_roles')
      .select('portal')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (role && role.portal !== user.portal) {
      setUser(prev => prev ? { ...prev, portal: role.portal as PortalType } : null);
    }
  };

  // Refresh matricula status from database
  const refreshMatricula = async () => {
    if (!user) return;
    
    const { data: matricula } = await supabase
      .from('matriculas')
      .select('id')
      .eq('user_id', user.id)
      .eq('curso_id', 'formacao_oracula')
      .eq('ativa', true)
      .maybeSingle();
    
    const isMatriculada = !!matricula;
    if (user.isMatriculada !== isMatriculada) {
      setUser(prev => prev ? { ...prev, isMatriculada } : null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Real-time subscription to user_roles changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-role-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_roles',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newPortal = payload.new.portal as PortalType;
          if (newPortal && newPortal !== user.portal) {
            setUser(prev => prev ? { ...prev, portal: newPortal } : null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, user?.portal]);

  // Real-time subscription to matriculas changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-matricula-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matriculas',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refresh matricula status when any change happens
          setTimeout(() => {
            refreshMatricula();
          }, 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === 'Invalid login credentials') {
          return { success: false, error: 'Email ou senha incorretos.' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: name,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'Este email já está cadastrado.' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao criar conta. Tente novamente.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const canAccess = (requiredPortal: PortalType): boolean => {
    if (!user) return false;
    // For preview mode, we need to check against the effective portal
    // This will be handled at the component level via useAdminPreview hook
    return canAccessFeature(user.portal, requiredPortal);
  };
  
  // Get the effective portal (considering preview mode)
  const getEffectivePortal = (): PortalType => {
    if (!user) return 'visitante';
    return user.portal;
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
      isAuthenticated: !!user && !!session,
      login,
      signup,
      logout,
      canAccess,
      canCreateCase,
      refreshUserPortal,
      refreshMatricula,
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
