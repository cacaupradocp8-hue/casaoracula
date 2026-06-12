import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { FounderInviteModal } from '@/components/visitor/FounderInviteModal';

interface LockedForVisitorProps {
  featureName?: string;
}

/**
 * LockedForVisitor — Página de gating para visitantes sem acesso.
 * Oferece duas portas: Convite Fundadora ou Conhecer Planos.
 * Nunca redireciona automaticamente para /planos.
 */
export function LockedForVisitor({ featureName }: LockedForVisitorProps) {
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[80vh] flex flex-col items-center justify-center p-6"
      >
        <div className="text-center max-w-lg mx-auto space-y-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-primary/60" />
          </div>

          <div className="space-y-3">
            {featureName && (
              <p className="text-xs uppercase tracking-[0.2em] text-primary/50">
                {featureName}
              </p>
            )}

            <h1 className="font-display text-2xl text-foreground">
              Este espaço pertence a outra etapa da jornada
            </h1>

            <p className="text-muted-foreground leading-relaxed">
              Você pode entrar de duas formas: com um <span className="text-primary/80">Convite Fundadora</span>{' '}
              ou conhecendo as Rotas da Casa.
            </p>
          </div>

          <div className="grid gap-3 max-w-sm mx-auto">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 w-full"
              onClick={() => setInviteModalOpen(true)}
            >
              <KeyRound className="w-4 h-4" />
              Tenho um Convite Fundadora
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/planos')}
            >
              <BookOpen className="w-4 h-4" />
              Conhecer Planos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground/60">
            Ou{' '}
            <button
              type="button"
              onClick={() => navigate('/sala-da-visitante')}
              className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
            >
              volte para a Sala da Visitante
            </button>
            .
          </p>
        </div>

        <FounderInviteModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          onSuccess={() => navigate('/clube/rotas/rota-dos-lobos')}
        />
      </motion.div>
    </AppLayout>
  );
}
