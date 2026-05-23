import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  MessageCircle, 
  HeartHandshake,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, title: 'Intensidade', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 2, title: 'Estabilidade', icon: <Users className="w-4 h-4" /> },
  { id: 3, title: 'Sinais de Cautela', icon: <ShieldAlert className="w-4 h-4" /> },
  { id: 4, title: 'Nível de Condução', icon: <HeartHandshake className="w-4 h-4" /> },
  { id: 5, title: 'Perguntas Éticas', icon: <MessageCircle className="w-4 h-4" /> },
  { id: 6, title: 'Plano de Prudência', icon: <ShieldCheck className="w-4 h-4" /> },
];

const cautionSignals = [
  'Sofrimento intenso', 'Desorganização emocional', 'Confusão persistente', 
  'Relato de violência', 'Ausência de rede de apoio', 'Instabilidade acentuada', 
  'Sensação de perda de controlo', 'Dificuldade de autocuidado', 'Isolamento significativo', 
  'Agravamento recente', 'Dúvida sobre condução', 'Necessidade de supervisão'
];

export default function ObservarCautelaPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Observar Sinais de Cautela"
      subtitle="Orientação ética para identificar necessidade de supervisão ou suporte especializado."
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
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4 flex gap-3 items-start">
            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive/80 leading-relaxed italic">
              O Atlas Orácula não avalia risco automaticamente nem substitui supervisão. 
              <strong> Priorize suporte adequado, rede profissional e encaminhamento responsável sempre que houver sinais de alerta.</strong>
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
                title="1. Intensidade do Caso" 
                description="Reflexão inicial sobre a urgência e clareza do fenômeno observado."
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">O que neste caso pede mais atenção?</label>
                    <Textarea placeholder="Descreva o que gerou necessidade de cautela..." className="min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">A intensidade parece leve, moderada ou alta?</label>
                    <Input placeholder="Sua percepção subjetiva de intensidade..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Há algo que você ainda não compreende bem?</label>
                    <Input placeholder="Pontos cegos ou dúvidas persistentes..." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Contexto e Estabilidade" 
                description="Avaliação da rede de suporte e segurança prática do caso."
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Possui rede de apoio?</label>
                      <Input placeholder="Família, amigos, instituições..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Acompanhamento paralelo?</label>
                      <Input placeholder="Psiquiatria, neurologia, grupos..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">O contexto atual aumenta ou reduz a estabilidade?</label>
                    <Textarea placeholder="Eventos de vida recentes, crises externas..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Existe alguma urgência prática a considerar?</label>
                    <Input placeholder="Risco financeiro, habitacional, integridade física..." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Sinais de Cautela Observáveis" 
                description="Identifique sinais que sugerem prudência extra ou supervisão."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cautionSignals.map(signal => (
                    <div key={signal} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40">
                      <Checkbox id={signal} />
                      <label htmlFor={signal} className="text-sm leading-tight cursor-pointer">{signal}</label>
                    </div>
                  ))}
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Nível de Condução" 
                description="Orientação visual para apoiar sua reflexão profissional."
              >
                <div className="space-y-4">
                  <ConductionLevel 
                    color="green" 
                    title="Pode seguir com cuidado" 
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    desc="Situação estável, há contexto suficiente e a profissional pode continuar observando com prudência."
                  />
                  <ConductionLevel 
                    color="yellow" 
                    title="Pedir mais contexto ou supervisão" 
                    icon={<AlertTriangle className="w-5 h-5" />}
                    desc="Há intensidade, ambiguidade, pouca informação ou dúvida sobre a melhor condução profissional."
                  />
                  <ConductionLevel 
                    color="red" 
                    title="Pausar exploração simbólica e encaminhar" 
                    icon={<XCircle className="w-5 h-5" />}
                    desc="A situação exige cuidado prioritário, suporte especializado ou rede de proteção externa."
                  />
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Perguntas Éticas" 
                description="Questões orientadoras para a responsabilidade profissional."
              >
                <div className="space-y-4">
                  <EthicalQuestion q="Tenho formação suficiente para conduzir esta situação?" />
                  <EthicalQuestion q="Preciso de supervisão antes de avançar com este tema?" />
                  <EthicalQuestion q="A exploração simbólica agora pode gerar desorganização?" />
                  <EthicalQuestion q="O foco atual deve ser estabilização, suporte ou encaminhamento?" />
                  <EthicalQuestion q="Que limite profissional precisa ser respeitado neste caso?" />
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Plano de Prudência" 
                description="Síntese de ações para garantir uma condução segura e ética."
              >
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Sugestão de Conduta</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "Antes de aprofundar a leitura simbólica, recomenda-se organizar melhor o contexto, considerar supervisão, observar sinais de instabilidade e definir limites claros de condução."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Seu rascunho de plano (mock):</label>
                    <Textarea placeholder="Próximas ações de cuidado, supervisão ou encaminhamento..." className="min-h-[150px]" />
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/20">
                    <p className="text-[11px] text-muted-foreground">
                      Simulação ética concluída. Dados não persistidos.
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
              Concluir Reflexão
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

function EthicalQuestion({ q }: { q: string }) {
  return (
    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/10">
      <p className="text-sm font-medium italic text-foreground/80">"{q}"</p>
      <Input placeholder="Reflexão profissional..." className="bg-background/40" />
    </div>
  );
}

function ConductionLevel({ color, title, icon, desc }: { color: 'green' | 'yellow' | 'red', title: string, icon: React.ReactNode, desc: string }) {
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
