import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Flame, Zap, Play, ChevronRight, 
  BookOpen, Search, AlertCircle, History,
  Star, Clock, CheckCircle2, ArrowRight, Sparkles,
  ArrowLeft, FlaskConical, GraduationCap, Lock,
  Target, BarChart3, Users, Wrench, Compass
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCamaraCases } from '@/components/treinamento/simulador/useCamaraCases';
import { SimuladorPremium } from '@/components/treinamento/simulador/SimuladorPremium';
import { SimuladorClube } from '@/components/treinamento/simulador/SimuladorClube';
import { SimuladorConducao } from '@/components/treinamento/simulador/SimuladorConducao';
import { TrainingDashboard } from '@/components/treinamento/simulador/TrainingDashboard';
import { AutoMapeamento } from '@/components/treinamento/AutoMapeamento';
import { BibliotecaFerramentas } from '@/components/treinamento/BibliotecaFerramentas';
import { ConversaoCTA } from '@/components/treinamento/simulador/ConversaoCTA';
import { TrainingCase } from '@/components/treinamento/simulador/types';
import { useCidadelaEstado } from '@/hooks/useCidadelaEstado';
import { useStudentTracking } from '@/hooks/useStudentTracking';
import { cn } from '@/lib/utils';

export default function SalaDeTreinamentoPage() {
  const { user } = useAuth();
  const { track } = useStudentTracking();
  const [activeCase, setActiveCase] = useState<TrainingCase | null>(null);
  const [activeTab, setActiveTab] = useState('simulador');
  const { data: allCases = [] } = useCamaraCases();
  const formacaoCases = useMemo(() => allCases.filter(c => c.nivel_produto === 'formacao'), [allCases]);

  const handleStartCase = (c: TrainingCase) => {
    setActiveCase(c);
    track('treinamento', 'opened_case', 'caso_treinamento', c.id);
  };
  
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
        <motion.div 
          key="simulation"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          className="h-screen w-full"
        >
          <SimuladorPremium 
            caso={activeCase} 
            onExit={handleBack} 
            onNextCaso={() => {
              const nextIdx = formacaoCases.findIndex(c => c.id === activeCase.id) + 1;
              if (nextIdx < formacaoCases.length) {
                setActiveCase(formacaoCases[nextIdx]);
              } else {
                setActiveCase(null);
              }
            }}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EAEAEA] font-sans selection:bg-primary/30 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent -ml-1 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <h1 className="text-3xl font-light tracking-tight text-white/90">
              Sala de <span className="font-semibold text-white">Treinamento (Formação)</span>
            </h1>
            <p className="text-muted-foreground/60 text-sm tracking-wide uppercase font-medium">
              Laboratório de maestria clínica para alunas da formação.
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/[0.03] border border-white/[0.05] rounded-2xl px-6 py-4 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-bold tracking-widest">FORMAÇÃO</span>
              </div>
              <Progress value={75} className="w-24 h-1 bg-white/10" />
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span className="text-lg font-bold">5</span>
              </div>
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground/60 font-bold">Streak</span>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 md:grid-cols-4 gap-4 bg-transparent h-auto p-0">
            <TabsTrigger 
              value="simulador" 
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/5 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary transition-all bg-white/[0.02]"
            >
              <Compass className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wider">Simulador</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progresso" 
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/5 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary transition-all bg-white/[0.02]"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wider">Progresso</span>
            </TabsTrigger>
            <TabsTrigger 
              value="automapa" 
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/5 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary transition-all bg-white/[0.02]"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wider">Auto-Mapa</span>
            </TabsTrigger>
            <TabsTrigger 
              value="ferramentas" 
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-white/5 data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary transition-all bg-white/[0.02]"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-xs font-medium uppercase tracking-wider">Biblioteca</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="simulador" className="space-y-10 animate-in fade-in duration-500">
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Laboratório de Prática</h2>
                <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60">Foco Profissional</Badge>
              </div>
              <TreinoPrincipalCard cases={formacaoCases} onStart={handleStartCase} />
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniCard icon={Zap} title="Treino Rápido" description="3 min" onClick={() => {}} />
              <MiniCard icon={BookOpen} title="Caso Clínico" description="Complexo" onClick={() => {}} />
              <MiniCard icon={Search} title="Leitura de Campo" description="Simbólico" onClick={() => {}} />
              <MiniCard icon={AlertCircle} title="Erro Oculto" description="Ache a falha" onClick={() => {}} />
            </section>
            
            <SimuladorConducao />

            <div className="pt-6">
              <ConversaoCTA type="casa_maquinas" />
            </div>
          </TabsContent>

          <TabsContent value="progresso" className="animate-in fade-in duration-500">
            <TrainingDashboard />
          </TabsContent>

          <TabsContent value="automapa" className="animate-in fade-in duration-500">
            <AutoMapeamento />
          </TabsContent>

          <TabsContent value="ferramentas" className="animate-in fade-in duration-500">
            <BibliotecaFerramentas />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TreinoPrincipalCard({ cases, onStart }: { cases: TrainingCase[], onStart: (c: TrainingCase) => void }) {
  const { estado } = useCidadelaEstado();
  
  const targetCase = useMemo(() => {
    if (!cases || cases.length === 0) return null;
    return cases.find(c => c.distrito_esperado?.toLowerCase() === (estado?.distrito_atual || '').toLowerCase()) || cases[0];
  }, [cases, estado]);

  if (!targetCase) return (
    <div className="h-64 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
      <div className="text-center space-y-2">
        <FlaskConical className="w-8 h-8 mx-auto text-white/10" />
        <p className="text-sm text-white/20">Aguardando novos desafios técnicos...</p>
      </div>
    </div>
  );

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-card transition-all duration-500 hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] -z-0" />
      
      <div className="relative z-20 p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/20 text-primary border-none text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
              Laboratório de Treino
            </Badge>
            <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
              {targetCase.distrito_esperado || 'Nível Profissional'}
            </Badge>
            <span className="text-white/30 text-xs flex items-center gap-1.5 ml-auto">
              <Clock className="w-3 h-3" /> 8 min
            </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            {targetCase.title}
          </h3>
          
          <p className="text-lg text-white/50 leading-relaxed font-light line-clamp-2">
            {targetCase.tema || 'Pratique a contenção e o manejo de campo em uma situação de alta tensão simbólica.'}
          </p>
          
          <Button 
            size="lg" 
            onClick={() => onStart(targetCase)}
            className="rounded-full px-10 py-7 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-3 shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" /> Iniciar Prática
          </Button>
        </div>

        <div className="hidden md:flex flex-col items-center gap-4">
           <div className="w-64 h-80 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.1] flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-primary/20 animate-ping absolute inset-0" />
                <div className="w-24 h-24 rounded-full border border-primary/40 flex items-center justify-center bg-[#0A0A0B] relative z-10">
                  <GraduationCap className="w-10 h-10 text-primary" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ icon: Icon, title, description, isLocked, onClick }: { icon: any, title: string, description: string, isLocked?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={() => !isLocked && onClick()}
      className={cn(
        "group bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 space-y-4 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer relative",
        isLocked && "opacity-60 grayscale-[0.5]"
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
        {isLocked ? <Lock className="w-5 h-5 text-white/20" /> : <Icon className="w-5 h-5" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-white/80 tracking-wide">{title}</h4>
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{description}</p>
      </div>
    </div>
  );
}