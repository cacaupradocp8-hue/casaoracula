import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  History, 
  Target, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  FileText,
  Eye,
  LogOut,
  Info,
  LineChart,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  Search,
  Lightbulb,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';

const steps = [
  { id: 1, title: 'Estado Anterior', icon: <History className="w-4 h-4" /> },
  { id: 2, title: 'Resposta Observada', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 3, title: 'Sinais de Evolução', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 4, title: 'Leitura da Resposta', icon: <Target className="w-4 h-4" /> },
  { id: 5, title: 'Reflexão', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 6, title: 'Síntese & Próximo Passo', icon: <ArrowRight className="w-4 h-4" /> },
];

const evolutionSignals = [
  'Mais clareza', 'Maior estabilidade', 'Melhor reconhecimento emocional', 
  'Mais capacidade de nomear padrões', 'Fortalecimento de limites', 
  'Redução de evitamento', 'Maior autonomia', 'Repetição do mesmo ciclo', 
  'Aumento de confusão', 'Resistência ou bloqueio', 'Necessidade de supervisão', 
  'Necessidade de rever direção'
];

export default function AcompanharEvolucaoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Acompanhar Evolução"
      subtitle="Observação ética de mudanças, integração e respostas às intervenções."
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/casa-das-maquinas/atlas')}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Atlas
          </Button>
          
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span>Passo {currentStep} de {steps.length}</span>
            <Progress value={progress} className="w-32 h-1.5" />
          </div>
        </div>

        {/* Ethical Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              O Atlas Orácula não mede evolução automaticamente nem gera relatório clínico oficial. 
              <strong> Este fluxo serve para apoiar a observação, revisão de direção e escolha responsável de próximos passos.</strong>
            </p>
          </CardContent>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <StepContainer 
                title="1. Estado Anterior" 
                description="Retome o ponto de partida para comparar com a observação atual."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Qual era a direção provisória anterior?</label>
                    <Input placeholder="Ex: Investigação de padrões" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Qual intervenção foi escolhida?</label>
                    <Input placeholder="Ex: Escrita reflexiva sobre limites" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground/80">O que se esperava observar?</label>
                    <Textarea placeholder="Resultados ou integrações esperadas..." className="min-h-[80px]" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground/80">Que cautelas estavam presentes?</label>
                    <Textarea placeholder="Riscos ou limites identificados anteriormente..." className="min-h-[80px]" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Resposta Observada" 
                description="Registre o que se manifestou desde o último encontro."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-green-500/5">
                      <label className="text-sm font-medium text-foreground/80">O que mudou?</label>
                      <Textarea placeholder="Novas percepções ou comportamentos..." className="min-h-[80px] bg-background/40" />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/5">
                      <label className="text-sm font-medium text-foreground/80">O que permaneceu igual?</label>
                      <Textarea placeholder="Persistências ou resistências..." className="min-h-[80px] bg-background/40" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-accent/5">
                      <label className="text-sm font-medium text-foreground/80">O que intensificou?</label>
                      <Textarea placeholder="Sintomas ou padrões mais fortes..." className="min-h-[80px] bg-background/40" />
                    </div>
                    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-primary/5">
                      <label className="text-sm font-medium text-foreground/80">O que suavizou?</label>
                      <Textarea placeholder="Alívios ou integrações..." className="min-h-[80px] bg-background/40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">A cliente trouxe alguma nova informação relevante?</label>
                    <Textarea placeholder="Fatos, sonhos ou percepções inéditas..." className="min-h-[80px]" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Sinais de Evolução" 
                description="Assinale os sinais observados na integração do processo."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {evolutionSignals.map(signal => (
                    <div key={signal} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-primary/5 transition-colors cursor-pointer">
                      <Checkbox id={signal} />
                      <label htmlFor={signal} className="text-[12px] font-medium leading-tight cursor-pointer">{signal}</label>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 rounded-xl bg-muted/20 border border-dashed border-border/60">
                  <p className="text-[11px] text-muted-foreground text-center">
                    Estes sinais servem para orientação profissional, não para gerar scores automáticos.
                  </p>
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Leitura da Resposta" 
                description="Como você interpreta o momento atual do caso?"
              >
                <div className="grid grid-cols-1 gap-4">
                  <InterpretationCard 
                    title="Continuar" 
                    desc="Quando a direção parece útil e a cliente mostra sinais de integração gradual."
                    color="green"
                  />
                  <InterpretationCard 
                    title="Ajustar" 
                    desc="Quando a direção parece parcialmente útil, mas precisa de mais contexto, ritmo ou adaptação."
                    color="amber"
                  />
                  <InterpretationCard 
                    title="Recuar" 
                    desc="Quando a intervenção parece ter sido cedo demais ou o caso pede estabilização antes de aprofundar."
                    color="orange"
                  />
                  <InterpretationCard 
                    title="Supervisão" 
                    desc="Quando há dúvida profissional, intensidade, ambiguidade ou necessidade de suporte externo."
                    color="purple"
                  />
                  <InterpretationCard 
                    title="Encaminhamento" 
                    desc="Quando o caso pede cuidado especializado, suporte em rede ou suporte profissional adequado."
                    color="red"
                  />
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Perguntas de Acompanhamento" 
                description="Questões orientadoras para aprofundar sua percepção."
              >
                <div className="space-y-5">
                  <CriteriaQuestion q="A direção escolhida ainda faz sentido diante do que foi observado?" />
                  <CriteriaQuestion q="A intervenção respeitou o ritmo e a capacidade de integração da cliente?" />
                  <CriteriaQuestion q="Há algum padrão que se repetiu de forma mais nítida agora?" />
                  <CriteriaQuestion q="Há algum sinal novo de cautela que não estava presente antes?" />
                  <div className="space-y-2 p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <p className="text-sm font-semibold text-primary">O que precisa ser observado no próximo encontro?</p>
                    <Textarea placeholder="Focos de atenção para a próxima sessão..." className="bg-background/40" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Síntese & Próximo Passo" 
                description="Resumo do acompanhamento e definição da conduta."
              >
                <div className="space-y-8">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <LineChart className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Síntese de Evolução Provisória</span>
                    </div>
                    <Textarea 
                      defaultValue="A evolução ainda deve ser observada com prudência e formulação aberta. Alguns sinais sugerem continuidade da direção escolhida, enquanto outros pedem ajuste de ritmo, mais contexto e possível supervisão ou suporte especializado."
                      className="min-h-[100px] bg-background/40 italic text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground/80">Qual o próximo passo responsável?</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <NextStepButton icon={<Search className="w-4 h-4" />} title="Rever Entender Caso" onClick={() => navigate('/casa-das-maquinas/atlas/entender-caso')} />
                      <NextStepButton icon={<Lightbulb className="w-4 h-4" />} title="Rever Hipóteses" onClick={() => navigate('/casa-das-maquinas/atlas/levantar-hipoteses')} />
                      <NextStepButton icon={<AlertTriangle className="w-4 h-4" />} title="Rever Cautelas" onClick={() => navigate('/casa-das-maquinas/atlas/observar-cautela')} />
                      <NextStepButton icon={<Compass className="w-4 h-4" />} title="Ajustar Direção" onClick={() => navigate('/casa-das-maquinas/atlas/definir-direcao')} />
                      <NextStepButton icon={<Zap className="w-4 h-4" />} title="Nova Intervenção" onClick={() => navigate('/casa-das-maquinas/atlas/escolher-intervencao')} />
                      <NextStepButton icon={<Eye className="w-4 h-4" />} title="Levar para Supervisão" status="Recomendado" />
                    </div>
                  </div>
                </div>
              </StepContainer>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="border-primary/20 hover:bg-primary/5"
          >
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="gap-2">
              Próximo Passo <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={() => navigate('/casa-das-maquinas/atlas')} variant="gold">
              Concluir Acompanhamento
            </Button>
          )}
        </div>

      </div>
    </CasaMaquinasLayout>
  );
}

function StepContainer({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-border/10 bg-muted/20">
        <CardTitle className="text-lg font-display">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        {children}
      </CardContent>
    </Card>
  );
}

function InterpretationCard({ title, desc, color }: { title: string, desc: string, color: 'green' | 'amber' | 'orange' | 'purple' | 'red' }) {
  const colorMap = {
    green: 'border-green-500/20 bg-green-500/5 text-green-600',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-600',
    orange: 'border-orange-500/20 bg-orange-500/5 text-orange-600',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-600',
    red: 'border-red-500/20 bg-red-500/5 text-red-600',
  };

  return (
    <div className={`flex items-start space-x-3 p-4 rounded-xl border ${colorMap[color]} transition-all cursor-pointer hover:bg-opacity-10 group`}>
      <div className="pt-0.5">
        <Checkbox className="rounded-full" />
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

function CriteriaQuestion({ q }: { q: string }) {
  return (
    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/5">
      <p className="text-sm font-medium italic text-foreground/80">"{q}"</p>
      <Input placeholder="Sua percepção..." className="bg-background/40" />
    </div>
  );
}

function NextStepButton({ icon, title, onClick, status }: { icon: React.ReactNode, title: string, onClick?: () => void, status?: string }) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      className="h-auto py-4 flex flex-col items-center gap-2 border-border/40 bg-card/40 hover:border-primary/20 w-full"
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[11px] font-semibold leading-tight">{title}</p>
        {status && <p className="text-[9px] uppercase tracking-widest text-primary/70 mt-1">{status}</p>}
      </div>
    </Button>
  );
}
