import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { trackLearningEvent } from '@/services/studentTrackingService';

export const PathSelector: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goRota = () => {
    const dest = '/clube/rotas/rota-dos-lobos';
    trackLearningEvent({ contextArea: 'clube', actionType: 'opened', objectType: 'estacao', metadata: { from: 'primeira-leitura', destino: 'rota-dos-lobos' } });
    if (user) navigate(dest);
    else navigate(`/auth?redirect=${encodeURIComponent(dest)}`);
  };
  const goFundadora = () => {
    const dest = '/clube/rotas/rota-dos-lobos';
    if (user) navigate(dest);
    else navigate(`/auth?redirect=${encodeURIComponent(dest)}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-10 py-12 px-6 max-w-4xl mx-auto w-full"
    >
      {/* Orientação narrativa — não-componente */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
        Atravessando a Casa
      </p>

      <div className="text-center space-y-5 max-w-xl">
        <h3 className="text-2xl md:text-3xl font-display text-primary leading-tight">
          A primeira leitura foi feita.
        </h3>
        <p className="text-foreground/80 text-sm md:text-base leading-relaxed font-serif italic">
          Agora que você atravessou a primeira leitura da Casa, existe uma travessia preparada para continuar essa experiência.
        </p>
        <p className="text-muted-foreground/70 text-xs md:text-sm leading-relaxed">
          A próxima porta é a <span className="text-primary/80">Rota dos Lobos</span> — a primeira travessia simbólica da Casa Orácula.
        </p>
      </div>

      {/* CTA principal — Rota dos Lobos */}
      <div className="w-full max-w-xl bg-card/40 border border-primary/15 rounded-[32px] p-8 flex flex-col items-center text-center space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60">Próxima travessia</span>
          <h4 className="text-xl font-display text-primary">Rota dos Lobos</h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
            Onde a escuta encontra território, mito e corpo. Você dará apenas o primeiro passo: a Clareira do Chamado.
          </p>
        </div>
        <Button
          onClick={goRota}
          variant="gold"
          className="w-full h-auto min-h-14 px-6 py-4 rounded-2xl text-sm font-semibold whitespace-normal leading-snug"
        >
          <span>Entrar na Rota dos Lobos</span>
          <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
        </Button>
      </div>

      {/* Caminho Fundadoras — discreto */}
      <div className="w-full max-w-xl border border-gold/20 rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold/70">Acesso Fundadoras</span>
        <p className="text-xs text-white/60 leading-relaxed max-w-md">
          Já tem o código de fundadora? Entre direto na rota com sua palavra-passe.
        </p>
        <Button
          onClick={goFundadora}
          variant="outline"
          className="w-full h-auto min-h-12 px-6 py-3 rounded-2xl text-xs sm:text-sm border-gold/40 text-gold hover:bg-gold/10 whitespace-normal leading-snug"
        >
          <span>Sou Fundadora — Entrar agora</span>
          <ArrowRight className="ml-2 w-4 h-4 shrink-0" />
        </Button>
      </div>

      <button 
        onClick={() => navigate('/sala-da-visitante')}
        className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-primary/60 transition-colors"
      >
        Voltar à Sala da Visitante
      </button>
    </motion.div>
  );
};