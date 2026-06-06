import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowRight, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { CidadelaRotasView } from '@/components/cidadela/CidadelaRotasView';
import { useBussolaOracular } from '@/hooks/useBussolaOracular';
import { useAuth } from '@/contexts/AuthContext';

export default function CidadelaResultadoFounder() {
  const navigate = useNavigate();
  const bussola = useBussolaOracular();
  const { user } = useAuth();

  if (bussola.loading) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <Compass className="w-12 h-12 text-gold animate-spin opacity-20" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative bg-midnight text-white min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,165,74,0.05),transparent_70%)] pointer-events-none" />
        
        <ResponsiveContainer size="wide" className="py-12 md:py-20">
          <header className="text-center space-y-6 mb-16">
             <div className="flex items-center justify-center gap-2 text-gold/40">
                <span className="h-px w-8 bg-current" />
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Revelação</span>
                <span className="h-px w-8 bg-current" />
              </div>
              <h1 className="text-4xl md:text-6xl font-serif leading-tight italic text-gold">Sua CidadELA Interior</h1>
              <p className="text-lg text-white/60 italic max-w-xl mx-auto leading-relaxed">
                "O mapa não é o território, mas o modo como você escolhe habitá-lo agora."
              </p>
          </header>

          <CidadelaRotasView bussola={bussola} />

          <footer className="mt-20 text-center space-y-10">
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                <p className="text-white/80 font-serif italic text-xl">
                    Sua CidadELA revelou onde sua energia está habitando neste momento. Este é o seu ponto de partida para a travessia.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                    <Button 
                        variant="gold" 
                        size="xl"
                        className="rounded-full px-12 h-16 text-lg font-bold shadow-glow group hover:scale-105 transition-all"
                        onClick={() => navigate('/clube/rotas/rota-dos-lobos')}
                    >
                        Iniciar Rota dos Lobos
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="xl"
                        className="rounded-full px-12 h-16 text-lg border-white/10 hover:bg-white/5"
                        onClick={() => navigate('/dashboard-membro')}
                    >
                        Ver Dashboard
                    </Button>
                </div>
            </div>
          </footer>
        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
