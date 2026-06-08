import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Headphones, Flower2, DoorOpen, Layers, 
  Sparkles, Check, Sword, Eye, Radar, ChevronRight, 
  TreePine, ArrowRight, Play, Pause, Lock, PawPrint 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { EscutaPremium } from '@/components/clube/EscutaPremium';
import { FerramentaOracularPlayer } from '@/components/clube/FerramentaOracularPlayer';
import { JardimInput } from '@/components/clube/JardimInput';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import rotaLobosBg from '@/assets/rota-dos-lobos-bg.png';

export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading, concluirPonto } = useRotaOracular(slug);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'hero', title: 'Clareira do Chamado' },
    { id: 'escuta', title: 'Escuta Ritual' },
    { id: 'caso', title: 'Caso Simbólico' },
    { id: 'revelacao', title: 'Revelação' },
    { id: 'ferramenta', title: 'Ferramenta' },
    { id: 'jardim_psique', title: 'Jardim da Psique' },
    { id: 'jardim_oficio', title: 'Jardim do Ofício' },
    { id: 'missao', title: 'Missão de Campo' },
    { id: 'fechamento', title: 'Fechamento' },
    { id: 'conclusao', title: 'Cartografia da Loba' }
  ];

  if (isLoading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-gold">Carregando travessia...</div>;

  const currentPonto = pontos.find(p => p.slug === slug) || pontos[0];
  if (!currentPonto) return <div>Estação não encontrada.</div>;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      concluirPonto.mutate(currentPonto.id);
      navigate('/clube/rota-dos-lobos');
    }
  };

  return (
    <AppLayout>
      <div className="bg-[#020617] min-h-screen text-white p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-[10px] text-gold/60 uppercase tracking-[0.2em] mb-4 text-center">
            Etapa {currentStep + 1} de {steps.length}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#0A0A0B] border border-white/10 rounded-[2rem] p-8 shadow-2xl"
            >
              {currentStep === 0 && (
                <div className="space-y-6 text-center">
                  <h1 className="text-4xl font-serif text-white">Clareira do Chamado</h1>
                  <p className="text-white/60">Uma jornada de travessia e ritual simbólico.</p>
                  <Button className="rounded-full bg-gold text-black w-full" onClick={handleNext}>Entrar na Clareira</Button>
                </div>
              )}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif">Escuta Ritual</h2>
                  <p className="text-white/60">Oiça a voz da floresta.</p>
                  <Button className="w-full" onClick={handleNext}>Continuar</Button>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif">O que sua escuta percebe?</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['Porta', 'Torre', 'Labirinto', 'Campo'].map(opt => <Button variant="outline" key={opt}>{opt}</Button>)}
                  </div>
                  <Button className="w-full mt-4" onClick={handleNext}>Registrar Escuta</Button>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif">Revelação</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[1,2,3,4].map(n => <div key={n} className="bg-white/5 h-24 rounded-xl flex items-center justify-center">Carta {n}</div>)}
                  </div>
                  <Button className="w-full" onClick={handleNext}>Prosseguir</Button>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-serif">Mapa do Instinto</h2>
                  <Button className="w-full" onClick={handleNext}>Abrir Ferramenta</Button>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif">Jardim da Psique</h2>
                  <JardimInput type="psique" pergunta="Reflexão pessoal..." pontoId={currentPonto.id} />
                  <Button className="w-full" onClick={handleNext}>Salvar e Seguir</Button>
                </div>
              )}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif">Jardim do Ofício</h2>
                  <JardimInput type="oficio" pergunta="Reflexão profissional..." pontoId={currentPonto.id} />
                  <Button className="w-full" onClick={handleNext}>Salvar e Seguir</Button>
                </div>
              )}
              {currentStep === 7 && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-serif">Missão de Campo</h2>
                  <Button className="w-full bg-gold text-black" onClick={handleNext}>Aceitar Missão</Button>
                </div>
              )}
              {currentStep === 8 && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-serif">Conclusão da Estação</h2>
                  <Button className="w-full" onClick={handleNext}>Concluir Travessia</Button>
                </div>
              )}
              {currentStep === 9 && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-serif">Cartografia Registrada</h2>
                  <Button className="w-full" onClick={handleNext}>Próxima Estação</Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}