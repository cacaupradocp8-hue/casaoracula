import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Target, 
  ListChecks, 
  ShieldCheck, 
  HelpCircle, 
  FileText,
  Map,
  Eye,
  LogOut,
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
  { id: 1, title: 'Estado Atual', icon: <Info className="w-4 h-4" /> },
  { id: 2, title: 'Necessidade', icon: <Target className="w-4 h-4" /> },
  { id: 3, title: 'Direções', icon: <Map className="w-4 h-4" /> },
  { id: 4, title: 'Critérios', icon: <ListChecks className="w-4 h-4" /> },
  { id: 5, title: 'Direção Provisória', icon: <FileText className="w-4 h-4" /> },
  { id: 6, title: 'Próximo Passo', icon: <ArrowRight className="w-4 h-4" /> },
];

const needs = [
  'Estabilizar', 'Regular', 'Compreender', 'Investigar crenças', 
  'Observar defesas', 'Trabalhar limites', 'Fortalecer recursos', 
  'Acompanhar repetição', 'Explorar símbolo', 'Pedir supervisão', 
  'Encaminhar', 'Aguardar mais contexto'
];

export default function DefinirDirecaoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <CasaMaquinasLayout 
      title="Atlas Orácula: Definir Direção"
      subtitle="Transformação da compreensão inicial em eixos de trabalho clínico-simbólico."
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
              O Atlas Orácula não decide a direção do caso. 
              <strong> Este fluxo serve para apoiar o raciocínio, a prudência e a escolha consciente de próximos passos profissionais.</strong>
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
                title="1. Estado Atual da Formulação" 
                description="Consolidação do que já foi observado antes de projetar o trabalho."
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">O que já está suficientemente claro neste caso?</label>
                    <Textarea placeholder="Padrões confirmados, queixa central estabilizada..." className="min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/80">O que ainda precisa ser investigado?</label>
                    <Textarea placeholder="Pontos cegos, áreas de ambiguidade..." className="min-h-[80px]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">Qual hipótese parece mais útil?</label>
                      <Input placeholder="A leitura mais coerente até agora..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/80">O que ainda exige cautela?</label>
                      <Input placeholder="Riscos de interpretação precoce..." />
                    </div>
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 2 && (
              <StepContainer 
                title="2. Necessidade Dominante" 
                description="Identifique a prioridade imediata para o movimento do caso."
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {needs.map(need => (
                    <div key={need} className="flex items-center space-x-2 p-3 rounded-lg border border-border/40 bg-card/40 hover:bg-primary/5 transition-colors cursor-pointer">
                      <Checkbox id={need} />
                      <label htmlFor={need} className="text-[12px] font-medium leading-none cursor-pointer">{need}</label>
                    </div>
                  ))}
                </div>
              </StepContainer>
            )}

            {currentStep === 3 && (
              <StepContainer 
                title="3. Direções Possíveis" 
                description="Considere os eixos de condução (seleção mock para reflexão)."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DirectionCard title="Estabilização" desc="Quando o caso pede segurança, presença e organização antes de qualquer movimento." />
                  <DirectionCard title="Regulação" desc="Foco em reconhecer estados internos, recuperar chão e modular respostas adaptativas." />
                  <DirectionCard title="Crenças Nucleares" desc="Quando aparecem padrões de valor, pertença, merecimento ou segurança." />
                  <DirectionCard title="Padrões Relacionais" desc="Observação de dinâmicas em vínculos, escolhas, conflitos ou ciclos conhecidos." />
                  <DirectionCard title="Proteção e Camadas" desc="Observação de mecanismos de evitamento, retraimento ou estratégias de cuidado." />
                  <DirectionCard title="Trabalho Simbólico" desc="Imagens, sonhos e contos que ajudam a abrir a compreensão da alma." />
                  <DirectionCard title="Limites e Ação" desc="Direção para escolhas conscientes, fronteiras, rotina e decisões práticas." />
                  <DirectionCard title="Supervisão/Encaminhamento" desc="Necessidade de rede, outro olhar ou suporte especializado responsável." />
                </div>
              </StepContainer>
            )}

            {currentStep === 4 && (
              <StepContainer 
                title="4. Critérios de Escolha" 
                description="Valide a segurança e o ritmo da direção imaginada."
              >
                <div className="space-y-5">
                  <CriteriaQuestion q="Esta direção respeita o ritmo atual da cliente?" />
                  <CriteriaQuestion q="Há contexto e estabilidade suficientes para este caminho?" />
                  <CriteriaQuestion q="Estou tentando avançar para o simbólico rápido demais?" />
                  <CriteriaQuestion q="Qual seria o menor próximo passo responsável aqui?" />
                </div>
              </StepContainer>
            )}

            {currentStep === 5 && (
              <StepContainer 
                title="5. Direção Provisória" 
                description="Síntese da rota de trabalho proposta."
              >
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Compass className="w-4 h-4" />
                      <span className="text-xs font-semibold uppercase tracking-wider">Lembrete de Rota</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      "Neste momento, a direção mais prudente parece ser organizar melhor o contexto, fortalecer recursos e observar padrões antes de escolher uma intervenção mais profunda."
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sua proposta de direção (mock):</label>
                    <Textarea placeholder="Descreva os eixos de trabalho para as próximas sessões..." className="min-h-[120px]" />
                  </div>
                </div>
              </StepContainer>
            )}

            {currentStep === 6 && (
              <StepContainer 
                title="6. Próximo Passo Sugerido" 
                description="Defina para onde o Atlas deve te orientar agora."
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NextStepButton icon={<Info className="w-4 h-4" />} title="Rever Entendimento" onClick={() => setCurrentStep(1)} />
                  <NextStepButton icon={<Target className="w-4 h-4" />} title="Rever Hipóteses" onClick={() => navigate('/casa-das-maquinas/atlas/levantar-hipoteses')} />
                  <NextStepButton icon={<ShieldCheck className="w-4 h-4" />} title="Checar Cautela" onClick={() => navigate('/casa-das-maquinas/atlas/observar-cautela')} />
                  <NextStepButton icon={<ListChecks className="w-4 h-4" />} title="Escolher Intervenção" status="Em breve" />
                  <NextStepButton icon={<Eye className="w-4 h-4" />} title="Levar para Supervisão" status="Em breve" />
                  <NextStepButton icon={<LogOut className="w-4 h-4" />} title="Aguardar Contexto" onClick={() => navigate('/casa-das-maquinas/atlas')} />
                </div>
                <div className="bg-muted/30 p-4 mt-8 rounded-lg flex items-center justify-center border border-dashed border-muted-foreground/20">
                  <p className="text-[11px] text-muted-foreground text-center">
                    Fim do fluxo de direção. Os dados inseridos não são persistidos.
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
              Concluir Plano
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

function DirectionCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-3 p-4 rounded-xl border border-border/40 bg-card/40 hover:border-primary/20 transition-all cursor-pointer group">
      <Checkbox className="mt-1" />
      <div>
        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

function CriteriaQuestion({ q }: { q: string }) {
  return (
    <div className="space-y-2 p-4 rounded-xl border border-border/30 bg-muted/5">
      <p className="text-sm font-medium italic text-foreground/80">"{q}"</p>
      <Input placeholder="Reflexão de segurança..." className="bg-background/40" />
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
