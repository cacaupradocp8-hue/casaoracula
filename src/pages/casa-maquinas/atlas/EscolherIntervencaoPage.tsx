import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Target, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle, 
  FileText,
  Eye,
  LogOut,
  Info,
  Wrench,
  PenTool,
  MessageSquare
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
  { id: 1, title: 'Direção', icon: <Target className="w-4 h-4" /> },
  { id: 2, title: 'Tipo', icon: <Wrench className="w-4 h-4" /> },
  { id: 3, title: 'Biblioteca', icon: <BookOpen className="w-4 h-4" /> },
  { id: 4, title: 'Adequação', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 5, title: 'Intervenção Provisória', icon: <FileText className="w-4 h-4" /> },
  { id: 6, title: 'Próximo Passo', icon: <ArrowRight className="w-4 h-4" /> },
];

const interventionTypes = [
  'Estabilização', 'Regulação', 'Investigação de crenças', 'Escrita reflexiva', 
  'Pergunta terapêutica', 'Prática simbólica', 'Trabalho com limites', 
  'Organização de narrativa', 'Observação de padrões', 'Recurso de autocuidado', 
  'Supervisão', 'Encaminhamento responsável'
];

export default function EscolherIntervencaoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Escolher Intervenção"
      subtitle="Conexão ética entre a direção do caso e as práticas de intervenção."
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
              O Atlas Orácula não prescreve intervenções, não define tratamentos nem substitui a autonomia profissional. 
              <strong> Este fluxo apoia a escolha consciente, ética e contextualizada da direção clínica.</strong>
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
                title="1. Direção Escolhida" 
                description="Retome o eixo de trabalho definido para orientar a intervenção."
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">Qual direção provisória foi escolhida?</label>
                    <Input placeholder="Ex: Estabilização emocional, Investigação de padrões..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">O que esta direção pretende cuidar primeiro?</label>
                    <Textarea placeholder="Objetivo imediato do trabalho..." className="min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">O que ainda não deve ser aprofundado?</label>
                    <Textarea placeholder="Limites, riscos ou áreas de cautela..." className="min-h-[80px]" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Tipo de Intervenção" 
                description="Selecione o formato de ação que melhor atende à necessidade atual."
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {interventionTypes.map(type => (
                    <div key={type} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-primary/5 transition-colors cursor-pointer">
                      <Checkbox id={type} />
                      <label htmlFor={type} className="text-[12px] font-medium leading-none cursor-pointer">{type}</label>
                    </div>
                  ))}
                </div>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Biblioteca de Possibilidades" 
                description="Sugestões conceituais para apoiar sua prática (mock de reflexão)."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LibraryCard 
                    icon={<MessageSquare className="w-4 h-4" />}
                    title="Pergunta de Abertura" 
                    desc="Para casos em que ainda falta contexto e precisamos ampliar a escuta." 
                  />
                  <LibraryCard 
                    icon={<PenTool className="w-4 h-4" />}
                    title="Escrita de Crença" 
                    desc="Para investigar frases internas recorrentes sem fechar conclusões precipitadas." 
                  />
                  <LibraryCard 
                    icon={<Target className="w-4 h-4" />}
                    title="Mapa de Padrões" 
                    desc="Observação de repetições relacionais antes de intervir profundamente." 
                  />
                  <LibraryCard 
                    icon={<ShieldCheck className="w-4 h-4" />}
                    title="Prática de Limite" 
                    desc="Para casos que pedem fronteiras claras, clareza ou proteção prática." 
                  />
                  <LibraryCard 
                    icon={<Zap className="w-4 h-4" />}
                    title="Recurso de Estabilização" 
                    desc="Quando é necessário fortalecer a base emocional antes de qualquer aprofundamento." 
                  />
                  <LibraryCard 
                    icon={<BookOpen className="w-4 h-4" />}
                    title="Caso-Espelho Literário" 
                    desc="Uso de narrativas simbólicas para reflexão indireta e segura." 
                  />
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Critérios de Adequação" 
                description="Valide a segurança e a pertinência da intervenção imaginada."
              >
                <div className="space-y-5">
                  <CriteriaQuestion q="Esta intervenção respeita o momento e o ritmo da cliente?" />
                  <CriteriaQuestion q="Esta intervenção é simples o suficiente para ser o próximo passo?" />
                  <CriteriaQuestion q="A cliente possui recursos internos para sustentar esta prática?" />
                  <CriteriaQuestion q="Qual seria a intervenção mínima responsável para este encontro?" />
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Intervenção Provisória" 
                description="Síntese da ação profissional proposta."
              >
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Ação Profissional</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "A intervenção escolhida deve permanecer provisória e ajustável. Neste momento, o mais prudente é escolher uma prática simples, observar a resposta da cliente e rever a direção antes de aprofundar."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sua proposta de intervenção (mock):</label>
                    <Textarea placeholder="Descreva a prática, pergunta ou recurso que pretende utilizar..." className="min-h-[120px]" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Próximo Passo" 
                description="Defina como seguir após a escolha da intervenção."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NextStepButton icon={<Target className="w-4 h-4" />} title="Rever Direção" onClick={() => navigate('/casa-das-maquinas/atlas/definir-direcao')} />
                  <NextStepButton icon={<ShieldCheck className="w-4 h-4" />} title="Rever Sinais Cautela" onClick={() => navigate('/casa-das-maquinas/atlas/observar-cautela')} />
                  <NextStepButton icon={<Eye className="w-4 h-4" />} title="Levar para Supervisão" status="Em breve" />
                  <NextStepButton icon={<History className="w-4 h-4" />} title="Acompanhar Evolução" onClick={() => navigate('/casa-das-maquinas/atlas/acompanhar-evolucao')} />
                  <NextStepButton icon={<LogOut className="w-4 h-4" />} title="Aguardar Contexto" onClick={() => navigate('/casa-das-maquinas/atlas')} />
                </div>
                <div className="bg-muted/30 p-4 mt-8 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/20">
                  <p className="text-[11px] text-muted-foreground text-center">
                    Fim do fluxo de intervenção. Os dados inseridos não são persistidos.
                  </p>
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
              Concluir Escolha
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

function LibraryCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/40 bg-card/40 hover:border-primary/20 transition-all cursor-pointer group">
      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

function CriteriaQuestion({ q }: { q: string }) {
  return (
    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/5">
      <p className="text-sm font-medium italic text-foreground/80">"{q}"</p>
      <Input placeholder="Reflexão ética..." className="bg-background/40" />
    </div>
  );
}

function NextStepButton({ icon, title, onClick, status }: { icon: React.ReactNode, title: string, onClick?: () => void, status?: string }) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      disabled={!!status}
      className="h-auto py-4 flex flex-col items-center gap-2 border-border/40 bg-card/40 hover:border-primary/20"
    >
      <div className="p-2 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold">{title}</p>
        {status && <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{status}</p>}
      </div>
    </Button>
  );
}

const History = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
