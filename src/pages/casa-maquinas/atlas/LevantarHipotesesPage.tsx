import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Lightbulb, 
  CheckSquare, 
  HelpCircle, 
  Layers, 
  ShieldAlert, 
  FileText,
  ShieldCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle
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
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Sinal Principal', icon: <Info className="w-4 h-4" /> },
  { id: 2, title: 'Possibilidades', icon: <CheckSquare className="w-4 h-4" /> },
  { id: 3, title: 'Diferenciais', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 4, title: 'Camadas', icon: <Layers className="w-4 h-4" /> },
  { id: 5, title: 'Matriz de Cautela', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 6, title: 'Hipóteses Provisórias', icon: <FileText className="w-4 h-4" /> },
];

const hypothesisOptions = [
  'Padrão de temperamento', 'Estado emocional reativo', 'Camada de proteção psíquica', 
  'Pilar de crença nuclear', 'Dinâmica relacional', 'Impacto do contexto de vida', 
  'Sinal de sobrecarga', 'Padrão simbólico recorrente', 'Material onírico ou imagético', 
  'Conflito entre partes internas', 'Necessidade de supervisão', 'Necessidade de encaminhamento responsável'
];

export default function LevantarHipotesesPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Levantar Hipóteses"
      subtitle="Organização ética de possibilidades de leitura e formulação provisória."
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
              O Atlas Orácula não confirma diagnósticos, não detecta transtornos nem identifica patologias automaticamente. 
              <strong> Este fluxo serve apenas para organizar hipóteses e apoiar a formulação provisória e a supervisão do caso.</strong>
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
                title="1. Sinal Principal Observado" 
                description="O que mais chama a atenção no funcionamento atual?"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Qual é o sinal ou padrão que mais chama atenção?</label>
                    <Textarea placeholder="Descreva o fenômeno, comportamento ou relato central..." className="min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Como este sinal aparece na vida da cliente?</label>
                    <Textarea placeholder="Impactos práticos, frequência, intensidade..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">O que ainda não está claro sobre este sinal?</label>
                    <Input placeholder="Dúvidas, ambiguidades ou faltas de informação..." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Hipóteses Possíveis" 
                description="Considere diferentes camadas de leitura para o fenômeno (não persistido)."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hypothesisOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-primary/5 transition-colors cursor-pointer">
                      <Checkbox id={option} />
                      <label htmlFor={option} className="text-sm leading-tight cursor-pointer">{option}</label>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-6 italic">
                  * Lembre-se: uma hipótese é uma possibilidade a ser investigada, não uma afirmação definitiva.
                </p>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Perguntas Diferenciais" 
                description="Refine o raciocínio clínico testando a consistência das hipóteses."
              >
                <div className="space-y-5">
                  <QuestionBox q="O que aponta para esta hipótese?" />
                  <QuestionBox q="O que aponta contra esta hipótese?" />
                  <QuestionBox q="Que informação falta para sustentar esta leitura?" />
                  <QuestionBox q="Existe alguma explicação mais simples ou puramente contextual?" />
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Camadas do Atlas Relacionadas" 
                description="Conecte as hipóteses aos módulos de investigação da Casa."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <LayerBadge name="Big Five" function="Investigar traços de personalidade." />
                  <LayerBadge name="R.O.T.A.I" function="Investigar pilares de crenças." />
                  <LayerBadge name="Torre Viva" function="Observar mecanismos de defesa." />
                  <LayerBadge name="Labirinto" function="Observar padrões de repetição." />
                  <LayerBadge name="7 Vozes" function="Observar partes internas em conflito." />
                  <LayerBadge name="Sonhos" function="Processar material simbólico." />
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Matriz de Cautela" 
                description="Avalie o nível de segurança para prosseguir com a exploração simbólica."
              >
                <div className="space-y-4">
                  <CautionLevel 
                    color="green" 
                    title="Pode explorar com cuidado" 
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    desc="Hipótese leve, provisória e sem risco evidente de desorganização atual."
                  />
                  <CautionLevel 
                    color="yellow" 
                    title="Pedir mais contexto ou supervisão" 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    desc="Há ambiguidade, intensidade emocional elevada ou dúvida sobre a melhor condução."
                  />
                  <CautionLevel 
                    color="red" 
                    title="Pausar formulação simbólica e encaminhar" 
                    icon={<XCircle className="w-5 h-5" />}
                    desc="Sinais de risco grave, desorganização intensa ou necessidade de avaliação especializada."
                  />
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Hipóteses Provisórias" 
                description="Síntese organizada para apoiar sua condução ou supervisão."
              >
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Lightbulb className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Lembrete de Formulação</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "As hipóteses levantadas ainda são provisórias. O próximo passo é recolher mais contexto, observar padrões ao longo do tempo e evitar conclusões precipitadas. A formulação deve permanecer aberta, supervisionável e ética."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Suas hipóteses provisórias (mock):</label>
                    <Textarea placeholder="Descreva aqui o que você está considerando investigar a seguir..." className="min-h-[150px]" />
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/20">
                    <p className="text-[11px] text-muted-foreground">
                      Fim da simulação de hipóteses. Dados não persistidos.
                    </p>
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
              Concluir Formulação
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

function QuestionBox({ q }: { q: string }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground/80 italic">"{q}"</p>
      <Input placeholder="Reflexão inicial..." className="bg-background/40" />
    </div>
  );
}

function LayerBadge({ name, function: func }: { name: string, function: string }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/40 bg-card/40 hover:border-primary/20 transition-all cursor-pointer">
      <Checkbox className="mt-1" />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-[10px] text-muted-foreground leading-tight">{func}</p>
      </div>
    </div>
  );
}

function CautionLevel({ color, title, icon, desc }: { color: 'green' | 'yellow' | 'red', title: string, icon: React.ReactNode, desc: string }) {
  const colorClasses = {
    green: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500',
    yellow: 'border-amber-500/20 bg-amber-500/5 text-amber-500',
    red: 'border-destructive/20 bg-destructive/5 text-destructive',
  };

  return (
    <div className={cn("p-4 rounded-xl border flex gap-4 items-start transition-all hover:scale-[1.01] cursor-pointer", colorClasses[color])}>
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs opacity-70 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
