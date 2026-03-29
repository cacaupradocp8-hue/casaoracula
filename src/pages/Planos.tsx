import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useOfertas, Oferta } from '@/hooks/useOfertas';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { PlanosHero } from '@/components/planos/PlanosHero';
import { PlanosProblema } from '@/components/planos/PlanosProblema';
import { PlanosExplicacao } from '@/components/planos/PlanosExplicacao';
import { PlanosClubeCards } from '@/components/planos/PlanosClubeCards';
import { PlanosFormacao } from '@/components/planos/PlanosFormacao';
import { PlanosFooter } from '@/components/planos/PlanosFooter';

export default function Planos() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { ofertas, isLoading } = useOfertas();

  const handleSelectOferta = (oferta: Oferta) => {
    const link = oferta.link_botao;

    if (link.startsWith('http://') || link.startsWith('https://')) {
      if (!oferta.gratuito && !isAuthenticated) {
        navigate('/auth', { state: { from: '/planos', selectedPlan: oferta.id } });
        return;
      }
      window.open(link, '_blank');
      return;
    }

    if (oferta.gratuito) {
      if (!isAuthenticated && link !== '/planos') {
        navigate('/auth', { state: { from: link } });
      } else {
        navigate(link);
      }
      return;
    }

    if (!isAuthenticated) {
      navigate('/auth', { state: { from: link, selectedPlan: oferta.id } });
      return;
    }

    navigate(link);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* 1. Abertura sofisticada */}
        <PlanosHero />

        {/* 2. Problema refinado */}
        <PlanosProblema />

        {/* 3. Explicação psicológica */}
        <PlanosExplicacao />

        {/* 4-7. Clube — Planos + CTA principal */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : ofertas.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground/60">
                Nenhuma oferta disponível no momento.
              </div>
            ) : (
              <PlanosClubeCards ofertas={ofertas} onSelect={handleSelectOferta} />
            )}
          </div>
        </section>

        {/* 8. Formação — upgrade estratégico */}
        <PlanosFormacao />

        {/* Nota ética */}
        <PlanosFooter />
      </div>
    </AppLayout>
  );
}
