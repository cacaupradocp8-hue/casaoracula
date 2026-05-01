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
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background text-foreground pb-24 pattern-geometric overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-0 h-auto text-primary hover:text-primary-foreground hover:bg-primary/10 transition-colors -ml-1 mb-1 sm:mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide text-foreground leading-tight">
                Sala de <span className="text-primary italic">Treinamento</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm tracking-widest uppercase font-medium">
                Laboratório de maestria clínica para alunas da formação.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 bg-card border border-border rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-soft self-start md:self-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Trophy className="w-4 h-4" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">FORMAÇÃO</span>
              </div>
              <Progress value={75} className="w-20 sm:w-24 h-1.5 bg-muted" />
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-orange-500">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span className="text-lg font-bold">5</span>
              </div>
              <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">Streak</span>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 bg-transparent h-auto p-0">
            {[
              { value: 'simulador', label: 'Simulador', icon: Compass },
              { value: 'progresso', label: 'Progresso', icon: BarChart3 },
              { value: 'automapa', label: 'Auto-Mapa', icon: Users },
              { value: 'ferramentas', label: 'Biblioteca', icon: Wrench },
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className="flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-5 px-2 rounded-2xl border border-border bg-card/40 backdrop-blur-sm data-[state=active]:bg-primary/10 data-[state=active]:border-primary/40 data-[state=active]:text-primary transition-all duration-300"
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-center leading-tight">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="simulador" className="space-y-10 m-0">
                <section className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/10 pb-4">
                    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-primary/40">Laboratório de Prática</h2>
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary/60 font-body uppercase tracking-widest">Foco Profissional</Badge>
                  </div>
                  <TreinoPrincipalCard cases={formacaoCases} onStart={handleStartCase} />
                </section>

                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MiniCard icon={Zap} title="Treino Rápido" description="3 min" onClick={() => {}} />
                  <MiniCard icon={BookOpen} title="Caso Clínico" description="Complexo" onClick={() => {}} />
                  <MiniCard icon={Search} title="Leitura de Campo" description="Simbólico" onClick={() => {}} />
                  <MiniCard icon={AlertCircle} title="Erro Oculto" description="Ache a falha" onClick={() => {}} />
                </section>
                
                <div className="rounded-[2.5rem] overflow-hidden border border-border bg-card/30">
                  <SimuladorConducao />
                </div>

                <div className="pt-6">
                  <ConversaoCTA type="casa_maquinas" />
                </div>
              </TabsContent>

              <TabsContent value="progresso" className="m-0">
                <TrainingDashboard mode="casa_maquinas" />
              </TabsContent>

              <TabsContent value="automapa" className="m-0">
                <AutoMapeamento />
              </TabsContent>

              <TabsContent value="ferramentas" className="m-0">
                <BibliotecaFerramentas />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
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
    <div className="h-64 rounded-[2.5rem] bg-card/20 border border-dashed border-border flex items-center justify-center">
      <div className="text-center space-y-4">
        <FlaskConical className="w-10 h-10 mx-auto text-muted-foreground/20" />
        <p className="text-sm text-muted-foreground italic font-body">Aguardando novos desafios técnicos...</p>
      </div>
    </div>
  );

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-sm transition-all duration-700 hover:border-primary/40 hover:shadow-glow">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-0 group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative z-20 p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8 font-body">
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] px-3 py-1 font-bold uppercase tracking-widest">
              Laboratório de Treino
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground text-[9px] px-3 py-1 font-bold uppercase tracking-widest">
              {targetCase.distrito_esperado || 'Nível Profissional'}
            </Badge>
            <span className="text-muted-foreground text-xs flex items-center gap-1.5 ml-auto">
              <Clock className="w-3.5 h-3.5" /> 8 min
            </span>
          </div>
          
          <h3 className="text-4xl md:text-5xl font-display text-foreground leading-tight group-hover:text-primary transition-colors duration-500">
            {targetCase.title}
          </h3>
          
          <p className="text-lg text-muted-foreground leading-relaxed font-light line-clamp-2 max-w-lg">
            {targetCase.tema || 'Pratique a contenção e o manejo de campo em uma situação de alta tensão simbólica.'}
          </p>
          
          <Button 
            size="lg" 
            onClick={() => onStart(targetCase)}
            className="rounded-full px-12 py-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-3 shadow-gold transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" /> Iniciar Prática
          </Button>
        </div>

        <div className="hidden md:flex flex-col items-center gap-4">
           <div className="w-72 h-80 rounded-3xl bg-gradient-to-b from-card to-transparent border border-border/50 flex items-center justify-center relative overflow-hidden group-hover:border-primary/20 transition-all">
              <div className="absolute inset-0 bg-hero-radial opacity-30" />
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-2 border-primary/10 animate-ritual-halo absolute inset-0" />
                <div className="w-28 h-28 rounded-full border border-primary/20 flex items-center justify-center bg-background/50 backdrop-blur-md relative z-10 animate-ritual-breathe">
                  <GraduationCap className="w-12 h-12 text-primary/80" />
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
        "group bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-6 space-y-4 hover:bg-card/60 hover:border-primary/30 hover:shadow-glow transition-all cursor-pointer relative",
        isLocked && "opacity-50 grayscale"
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {isLocked ? <Lock className="w-5 h-5 text-muted-foreground/30" /> : <Icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-foreground tracking-wide font-body">{title}</h4>
        <p className="text-[10px] text-primary/40 uppercase tracking-widest font-bold font-body">{description}</p>
      </div>
    </div>
  );
}