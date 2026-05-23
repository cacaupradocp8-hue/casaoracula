import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  Globe, 
  ListChecks, 
  Layers, 
  HelpCircle, 
  FileText,
  ShieldCheck,
  Info
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
  { id: 1, title: 'Queixa Central', icon: <Search className="w-4 h-4" /> },
  { id: 2, title: 'Contexto', icon: <Globe className="w-4 h-4" /> },
  { id: 3, title: 'Sinais', icon: <ListChecks className="w-4 h-4" /> },
  { id: 4, title: 'Camadas', icon: <Layers className="w-4 h-4" /> },
  { id: 5, title: 'Perguntas', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 6, title: 'Síntese', icon: <FileText className="w-4 h-4" /> },
];

const observableSignals = [
  'Ansiedade', 'Vergonha', 'Evitamento', 'Hipercontrolo', 
  'Exaustão', 'Repetição relacional', 'Dificuldade de limites', 
  'Confusão emocional', 'Isolamento', 'Oscilação de humor', 
  'Culpa', 'Medo de abandono'
];

export default function EntenderCasoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Entender o Caso"
      subtitle="Fluxo guiado de organização inicial de informações clínicas e simbólicas."
    >
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        
        {/* Navegação de Topo */}
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

        {/* Aviso Ético (Fixado ou Relevante no topo) */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4 flex gap-3 items-start">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900/70 leading-relaxed italic">
              Este fluxo é uma ferramenta de apoio ao raciocínio clínico. 
              <strong> Nada inserido aqui será salvo no banco de dados.</strong> 
              O Atlas não gera diagnósticos nem substitui a avaliação profissional.
            </p>
          </CardContent>
        </Card>

        {/* Conteúdo Dinâmico por Passo */}
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
                title="1. Queixa ou Tema Central" 
                description="Identifique o motivo inicial de atenção para este caso."
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">O que trouxe este caso para atenção?</label>
                    <Textarea placeholder="Descreva brevemente a queixa ou fenômeno observado..." className="min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Qual é o tema central aparente?</label>
                    <Input placeholder="Ex: Dificuldade de limites, Crise de transição, etc." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Há quanto tempo este padrão aparece?</label>
                    <Input placeholder="Ex: Recentemente, Desde a infância, Após evento X..." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Contexto" 
                description="Observe as circunstâncias que envolvem o fenômeno."
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Em que contexto isto aparece?</label>
                    <Textarea placeholder="Relacional, profissional, familiar, momentos de solidão..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">O que parece intensificar?</label>
                      <Input placeholder="Gatilhos, situações específicas..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">O que parece aliviar?</label>
                      <Input placeholder="Recursos, ambientes, pessoas..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Que áreas da vida são mais afetadas?</label>
                    <Input placeholder="Ex: Carreira, Saúde, Relacionamento Íntimo..." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Sinais Observáveis" 
                description="Marque os sinais que chamam a atenção nesta fase inicial."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {observableSignals.map(signal => (
                    <div key={signal} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40">
                      <Checkbox id={signal} />
                      <label htmlFor={signal} className="text-sm leading-none cursor-pointer">{signal}</label>
                    </div>
                  ))}
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Camadas Possíveis do Atlas" 
                description="Quais ferramentas da Casa poderiam oferecer clareza sobre este caso?"
              >
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground italic mb-4">Selecione as camadas que fazem sentido investigar:</p>
                  <div className="grid grid-cols-1 gap-3">
                    <LayerOption title="Big Five" desc="Observar traços de personalidade e temperamento de base." />
                    <LayerOption title="R.O.T.A.I" desc="Investigar crenças nucleares de valor, pertença e segurança." />
                    <LayerOption title="Labirinto" desc="Observar ciclos repetitivos e bloqueios de travessia." />
                    <LayerOption title="Torre Viva" desc="Observar estratégias de defesa e sobrevivência emocional." />
                    <LayerOption title="7 Vozes" desc="Observar conflitos e partes internas da psique." />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Perguntas de Formulação" 
                description="Questões para refinar o raciocínio clínico antes da hipótese."
              >
                <div className="space-y-4">
                  <FormulationQuestion q="Isto parece mais traço, estado, defesa, trauma, crença ou contexto?" />
                  <FormulationQuestion q="O que ainda não sabemos e precisamos investigar?" />
                  <FormulationQuestion q="Que hipótese seria perigoso assumir cedo demais?" />
                  <FormulationQuestion q="Há algum sinal que peça supervisão, pausa ou encaminhamento?" />
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Síntese Provisória" 
                description="Uma visão organizada do que foi observado até agora."
              >
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Info className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Sugestão de Síntese</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "Este caso ainda está em fase de compreensão. Os sinais iniciais apontam para padrões que precisam ser observados com cautela. Antes de escolher uma intervenção, recomenda-se investigar contexto, crenças, defesas e riscos identificados."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Suas notas finais (mock):</label>
                    <Textarea placeholder="Escreva sua própria síntese temporária aqui..." className="min-h-[150px]" />
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/20">
                    <p className="text-xs text-muted-foreground">
                      Fim da simulação. Os dados inseridos serão perdidos ao sair desta página.
                    </p>
                  </div>
                </div>
              </StepContainer>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controles de Navegação */}
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
              Concluir Raciocínio
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

function LayerOption({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-border/40 bg-card/40 hover:border-primary/20 transition-all cursor-pointer">
      <Checkbox className="mt-1" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function FormulationQuestion({ q }: { q: string }) {
  return (
    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/10">
      <p className="text-sm font-medium italic text-foreground/80">"{q}"</p>
      <Input placeholder="Sua reflexão provisória..." className="bg-background/40" />
    </div>
  );
}
