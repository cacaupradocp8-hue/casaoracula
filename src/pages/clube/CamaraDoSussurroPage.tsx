import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Play, Clock, Trophy, Flame, 
  Sparkles, Compass, MessageCircle, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCamaraCases } from '@/components/treinamento/simulador/useCamaraCases';
import { SimuladorClube } from '@/components/treinamento/simulador/SimuladorClube';
import { TrainingCase } from '@/components/treinamento/simulador/types';
import { cn } from '@/lib/utils';
import { ConversaoCTA } from '@/components/treinamento/simulador/ConversaoCTA';
import { useNavigate } from 'react-router-dom';

export default function CamaraDoSussurroPage() {
  const [activeCase, setActiveCase] = useState<TrainingCase | null>(null);
  const { data: allCases = [] } = useCamaraCases();

  const handleBack = () => {
    if (activeCase) {
      setActiveCase(null);
    } else {
      window.history.back();
    }
  };

  if (activeCase) {
    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <SimuladorClube 
          caso={activeCase} 
          onExit={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EAEAEA] pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent -ml-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Clube
            </Button>
            <h1 className="text-3xl font-light tracking-tight text-white/90">
              Câmara do <span className="font-semibold text-white">Sussurro</span>
            </h1>
            <p className="text-muted-foreground/60 text-sm tracking-wide uppercase font-medium">
              Pratique a escuta imersiva com as obras do Clube do Livro.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-bold tracking-widest">CLUBE</span>
              </div>
              <Progress value={20} className="w-24 h-1 bg-white/10" />
            </div>
          </div>
        </header>

        <section className="space-y-8">
          <div className="grid gap-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Obras em Estudo</h2>
            
            {allCases.length === 0 ? (
              <div className="h-64 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
                <p className="text-sm text-white/20">Aguardando novos sussurros das obras...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {allCases.filter(c => c.nivel_produto === 'clube').map((caso) => (
                   <div 
                    key={caso.id}
                    className="group relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-card/40 transition-all duration-500 hover:border-primary/30 p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                   >
                     <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-3">
                         <Badge className="bg-primary/20 text-primary border-none text-[10px]">OBRA DO CLUBE</Badge>
                         <span className="text-white/30 text-xs flex items-center gap-1.5">
                           <Clock className="w-3 h-3" /> 5-10 min
                         </span>
                       </div>
                       <h3 className="text-2xl font-semibold text-white group-hover:text-primary transition-colors">
                         {caso.title}
                       </h3>
                       <p className="text-white/50 text-sm line-clamp-2">
                         {caso.tema || 'Prática de escuta ativa baseada nos conceitos da obra atual.'}
                       </p>
                     </div>
                     <Button 
                       onClick={() => setActiveCase(caso)}
                       className="rounded-full px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2"
                     >
                       <Play className="w-4 h-4 fill-current" /> Iniciar Escuta
                     </Button>
                   </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-white/80">Reflexões do Círculo</h4>
              <p className="text-xs text-white/40">Discussões recentes sobre os sussurros das obras.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-white/80">Biblioteca de Apoio</h4>
              <p className="text-xs text-white/40">Materiais complementares para aprofundar a escuta.</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-medium text-white/80">Maestria da Escuta</h4>
              <p className="text-xs text-white/40">Seu progresso no desenvolvimento da escuta clínica.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
