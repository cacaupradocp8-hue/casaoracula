// ============================================
// CLUBE DO LIVRO ORACULAR - Ritual de Abertura
// ============================================

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useClubeCicloDetalhe, useRitualAceite } from '@/hooks/useClubeLivro';
import { BookOpen, ChevronRight, Home, Sparkles } from 'lucide-react';

const RITUAL_TEXT = `Este não é um clube de leitura.
É um campo de escuta simbólica.

Não lemos para entender histórias.
Lemos para sustentar imagens sem invadir.

Se você costuma explicar demais, apressar sentidos ou salvar personagens,
este ciclo vai te desacelerar.`;

export default function ClubeLivroRitual() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, isLoading: loadingCiclo } = useClubeCicloDetalhe(id);
  const { hasAccepted, isLoading: loadingAceite, acceptRitual } = useRitualAceite(id);
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already accepted, redirect to cycle
  useEffect(() => {
    if (!loadingAceite && hasAccepted) {
      navigate(`/clube-livro/${id}`, { replace: true });
    }
  }, [hasAccepted, loadingAceite, id, navigate]);

  const handleEnter = async () => {
    if (!checked || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await acceptRitual.mutateAsync();
      navigate(`/clube-livro/${id}`);
    } catch (error) {
      console.error('Error accepting ritual:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCiclo || loadingAceite) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Preparando o ritual...</div>
        </div>
      </AppLayout>
    );
  }

  if (!ciclo) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-2xl text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Ciclo não encontrado</h2>
          <Button variant="outline" onClick={() => navigate('/clube-livro')}>
            Voltar ao Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Dark ritual container */}
        <div className="container mx-auto px-4 py-12 max-w-2xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
            <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              Casa
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/clube-livro" className="hover:text-foreground transition-colors">
              Círculos de Leitura Simbólica
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Ritual de Abertura</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/30 mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display text-foreground mb-2">
              Ritual de Abertura
            </h1>
            <p className="text-muted-foreground">
              {ciclo.titulo}
            </p>
          </div>

          {/* Manifesto Text */}
          <div className="bg-card/30 border border-border/50 rounded-2xl p-8 md:p-12 mb-8">
            <div className="prose prose-invert prose-lg max-w-none text-center">
              {RITUAL_TEXT.split('\n\n').map((paragraph, i) => (
                <p 
                  key={i} 
                  className="text-foreground/90 leading-relaxed mb-6 last:mb-0 font-display text-lg md:text-xl"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border/50 mb-8">
            <Checkbox
              id="ritual-aceite"
              checked={checked}
              onCheckedChange={(c) => setChecked(c === true)}
              className="mt-0.5"
            />
            <label 
              htmlFor="ritual-aceite" 
              className="text-sm text-foreground cursor-pointer leading-relaxed"
            >
              <span className="font-medium">Aceito ler sem interpretar para o outro.</span>
            </label>
          </div>

          {/* Enter Button */}
          <div className="text-center">
            <Button
              size="lg"
              disabled={!checked || isSubmitting}
              onClick={handleEnter}
              className="bg-gold hover:bg-gold/90 text-primary-foreground font-display text-lg px-12 py-6 disabled:opacity-40"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar no Ciclo'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
