import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Brain, Wrench, Compass, ArrowLeft } from 'lucide-react';

const BENEFITS = [
  { icon: Compass, label: 'Sessões guiadas completas' },
  { icon: Brain, label: 'IA terapêutica integrada' },
  { icon: Wrench, label: 'Ferramentas avançadas' },
  { icon: BookOpen, label: 'Aplicações clínicas práticas' },
];

export default function DesbloqueiePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-10 text-center">
        {/* Header glow */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-card border border-primary/40 flex items-center justify-center shadow-gold">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Desbloqueie a Casa Orácula Completa
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Acesse todo o potencial da plataforma e transforme sua prática terapêutica.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid gap-4">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 bg-card/60 border border-border/50 rounded-xl p-4 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          variant="gold"
          size="xl"
          className="w-full"
          onClick={() => navigate('/planos')}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Entrar na versão completa
        </Button>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    </div>
  );
}
