import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function PosCompra() {
  const navigate = useNavigate();
  const { user, refreshUserPortal } = useAuth();
  const [message, setMessage] = useState('Preparando seu acesso…');
  const activatedRef = useRef(false);

  useEffect(() => {
    if (!user?.id || activatedRef.current) return;
    activatedRef.current = true;

    const activate = async () => {
      try {
        // Call edge function to activate access server-side
        const { data: { session } } = await supabase.auth.getSession();
        
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/activate-pos-compra`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        const result = await res.json();

        if (result.status === 'activated' || result.status === 'already_active') {
          setMessage('Acesso liberado! Redirecionando…');
          
          // Refresh portal in context
          await refreshUserPortal?.();
          
          // Small delay for visual feedback, then redirect
          setTimeout(() => {
            navigate('/dashboard-membro?boas-vindas=true', { replace: true });
          }, 1500);
        } else {
          // Fallback: redirect anyway
          setMessage('Processando… Redirecionando…');
          setTimeout(() => {
            navigate('/dashboard-membro', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('Pos-compra activation error:', error);
        setMessage('Redirecionando…');
        setTimeout(() => {
          navigate('/dashboard-membro', { replace: true });
        }, 2000);
      }
    };

    activate();
  }, [user?.id]);

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <span className="text-gold/60 text-4xl mb-6 block">🜂</span>
          
          {message.includes('liberado') ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          ) : (
            <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto mb-4" />
          )}
          
          <h1 className="font-display text-2xl text-foreground mb-3">
            Ritual de Recepção
          </h1>
          <p className="text-muted-foreground">{message}</p>
          
          <p className="text-sm text-muted-foreground/50 mt-8">
            🔒 Sua compra está protegida.
          </p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
