import { motion } from 'framer-motion';
import { Lock, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';

interface LockedForVisitorProps {
  featureName?: string;
}

/**
 * LockedForVisitor - Explanatory gating page for users without access.
 * Shows what this space is, who it's for, and CTAs to upgrade.
 */
export function LockedForVisitor({ featureName }: LockedForVisitorProps) {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[80vh] flex flex-col items-center justify-center p-6"
      >
        {/* Content */}
        <div className="text-center max-w-lg mx-auto space-y-8">
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-primary/60" />
          </div>

          {/* Message */}
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
              Para acessar este conteúdo, você precisa fazer parte do ecossistema da Casa Orácula
              — seja pelo Clube do Livro ou pela Formação.
            </p>
          </div>

          {/* CTAs */}
          <div className="grid gap-3 max-w-sm mx-auto">
            <Button
              variant="gold"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/planos')}
            >
              <BookOpen className="w-4 h-4" />
              Assinar o Clube do Livro
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="gap-2 w-full"
              onClick={() => navigate('/oracula')}
            >
              <GraduationCap className="w-4 h-4" />
              Conhecer a Formação Orácula
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Explore */}
          <p className="text-sm text-muted-foreground/60">
            Ou{' '}
            <button
              type="button"
              onClick={() => navigate('/vitrine')}
              className="text-primary/70 hover:text-primary underline underline-offset-2 transition-colors"
            >
              explore a Vitrine
            </button>{' '}
            para conhecer tudo que a Casa oferece.
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
}
