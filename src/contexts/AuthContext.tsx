import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PortalType, canAccessFeature, getCaseLimit } from '@/types/portal';

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
  isAuthReady: boolean;
  isAuthenticated: boolean;
  authError: string | null;
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
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string): Promise<boolean> => {
    try {
      const [
        { data: profile, error: profileError },
        { data: role },
        { data: matricula },
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single(),
        supabase
          .from('user_roles')
          .select('portal')
          .eq('user_id', userId)
          .single(),
        supabase
          .from('matriculas')
          .select('id')
          .eq('user_id', userId)
          .eq('curso_id', 'formacao_oracula')
          .eq('ativa', true)
          .maybeSingle(),
      ]);

      if (profileError || !profile) {
        throw profileError;
      }

      setUser({
        id: userId,
        email: profile.email || '',
        name: profile.nome || '',
        portal: (role?.portal as PortalType) || 'visitante',
        createdAt: new Date(profile.created_at),
        avatarUrl: profile.avatar_url || undefined,
        isMatriculada: !!matricula,
      });
      setAuthError(null);
      return true;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
      setAuthError('Não foi possível carregar seu perfil agora. Tente recarregar.');
      return false;
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
    let isMounted = true;

    const syncSession = (nextSession: Session | null, isInitialSync = false) => {
      if (!isMounted) return;

      setSession(nextSession);

      if (!nextSession?.user) {
        setUser(null);
        setAuthError(null);
        setIsLoading(false);
        if (isInitialSync) setIsAuthReady(true);
        return;
      }

      setIsLoading(true);
      setAuthError(null);
      setTimeout(() => {
        void fetchUserProfile(nextSession.user.id).finally(() => {
          if (!isMounted) return;
          setIsLoading(false);
          if (isInitialSync) setIsAuthReady(true);
        });
      }, 0);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'INITIAL_SESSION') return;
      syncSession(nextSession, false);
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        syncSession(initialSession, true);
      })
      .catch((error) => {
        console.error('Error restoring auth session:', error);
        if (!isMounted) return;
        setSession(null);
        setUser(null);
        setAuthError('Não conseguimos restaurar sua sessão. Recarregue para tentar novamente.');
        setIsLoading(false);
        setIsAuthReady(true);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
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

      setAuthError(null);
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
    setAuthError(null);
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
      isAuthReady,
      isAuthenticated: !!user && !!session,
      authError,
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
