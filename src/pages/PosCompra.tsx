import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Clock, AlertCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SubscriptionState = 'loading' | 'active' | 'pending' | 'none' | 'error';

export default function PosCompra() {
  const navigate = useNavigate();
  const { user, refreshUserPortal } = useAuth();
  const [state, setState] = useState<SubscriptionState>('loading');
  const [message, setMessage] = useState('Verificando seu acesso…');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);
  const MAX_POLLS = 20; // ~2 minutes of polling

  const checkStatus = async () => {
    if (!user?.id) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return null;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/activate-pos-compra`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const poll = async () => {
      const result = await checkStatus();
      if (!result) {
        setState('error');
        setMessage('Não foi possível verificar seu acesso. Tente novamente.');
        return;
      }

      if (result.is_active) {
        setState('active');
        setMessage('Acesso confirmado! Redirecionando…');

        // Refresh portal context
        await refreshUserPortal?.();

        // Stop polling
        if (pollRef.current) clearInterval(pollRef.current);

        setTimeout(() => {
          navigate('/dashboard-membro?boas-vindas=true', { replace: true });
        }, 2000);
        return;
      }

      if (result.status === 'pending') {
        setState('pending');
        setMessage('Seu pagamento está sendo processado. Isso pode levar alguns minutos.');
      } else {
        setState('none');
        setMessage('Nenhuma assinatura encontrada para sua conta. Se você acabou de comprar, aguarde alguns minutos.');
      }

      pollCountRef.current += 1;
      if (pollCountRef.current >= MAX_POLLS && pollRef.current) {
        clearInterval(pollRef.current);
        setMessage('A confirmação está demorando. Você pode fechar esta página — seu acesso será liberado automaticamente quando o pagamento for confirmado.');
      }
    };

    // Initial check
    poll();

    // Poll every 6 seconds
    pollRef.current = setInterval(poll, 6000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user?.id]);

  // Not logged in
  if (!user) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md space-y-6"
          >
            <span className="text-gold/60 text-4xl mb-4 block">🜂</span>
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
            <h1 className="font-display text-2xl text-foreground">
              Faça login para continuar
            </h1>
            <p className="text-muted-foreground">
              Para ativar seu acesso, entre com o email usado na compra.
              Se ainda não tem conta, crie uma com o mesmo email.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/auth">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entrar ou Criar Conta
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground/50">
              🔒 Seu acesso será liberado automaticamente ao confirmar o pagamento.
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md space-y-4"
        >
          <span className="text-gold/60 text-4xl block">🜂</span>

          {state === 'active' && (
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          )}
          {state === 'pending' && (
            <Clock className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
          )}
          {state === 'loading' && (
            <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto" />
          )}
          {state === 'none' && (
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
          )}
          {state === 'error' && (
            <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          )}

          <h1 className="font-display text-2xl text-foreground">
            {state === 'active' ? 'Acesso Confirmado!' : 'Confirmação de Pagamento'}
          </h1>

          <p className="text-muted-foreground">{message}</p>

          {(state === 'pending' || state === 'none') && (
            <div className="pt-4 space-y-3">
              <p className="text-xs text-muted-foreground/60">
                Logada como: <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-muted-foreground/60">
                Certifique-se de que este é o mesmo email usado na compra.
              </p>
            </div>
          )}

          {state === 'error' && (
            <Button
              variant="outline"
              onClick={() => {
                setState('loading');
                setMessage('Verificando seu acesso…');
                pollCountRef.current = 0;
                checkStatus().then((result) => {
                  if (result?.is_active) {
                    setState('active');
                    setMessage('Acesso confirmado! Redirecionando…');
                    refreshUserPortal?.();
                    setTimeout(() => navigate('/dashboard-membro?boas-vindas=true', { replace: true }), 2000);
                  } else if (result?.status === 'pending') {
                    setState('pending');
                    setMessage('Seu pagamento está sendo processado.');
                  } else {
                    setState('none');
                    setMessage('Nenhuma assinatura encontrada.');
                  }
                });
              }}
            >
              Tentar novamente
            </Button>
          )}

          <p className="text-sm text-muted-foreground/50 pt-6">
            🔒 Sua compra está protegida. O acesso é liberado automaticamente após confirmação do pagamento.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
