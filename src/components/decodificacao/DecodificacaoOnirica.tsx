import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Moon, Eye, Flame, Pause, MessageSquare, 
  ChevronRight, ChevronLeft, Check, Sparkles, AlertTriangle, Copy
} from 'lucide-react';
import { useCreateDecodificacao, DecodificacaoInput } from '@/hooks/useDecodificacaoOnirica';
import { toast } from 'sonner';

interface DecodificacaoOniricaProps {
  clienteId?: string;
  sessionCaseId?: string;
  onComplete?: (id: string) => void;
  onCancel?: () => void;
}

const STEPS = [
  {
    key: 'sonho',
    title: 'Registro do Sonho',
    subtitle: 'Descreva o sonho como foi narrado',
    icon: Moon,
    placeholder: 'Transcreva o sonho da cliente aqui, mantendo a linguagem original...',
    field: 'sonho_bruto' as const,
    isTextarea: true,
  },
  {
    key: 'imagem',
    title: 'Imagem Central',
    subtitle: 'Qual imagem se destaca?',
    helper: '"O que ficou mais vivo?"',
    icon: Eye,
    placeholder: 'A imagem que permanece...',
    field: 'imagem_central' as const,
    isTextarea: false,
  },
  {
    key: 'forca',
    title: 'Força Psíquica',
    subtitle: 'Que força aparece nesta imagem?',
    helper: '"O que está ativo neste símbolo?"',
    icon: Flame,
    placeholder: 'A força que se manifesta...',
    field: 'forca_psiquica' as const,
    isTextarea: false,
  },
  {
    key: 'movimento',
    title: 'Movimento Interrompido',
    subtitle: 'O que não conseguiu acontecer?',
    helper: '"Que gesto ficou suspenso?"',
    icon: Pause,
    placeholder: 'O que ficou incompleto...',
    field: 'movimento_interrompido' as const,
    isTextarea: false,
  },
  {
    key: 'mensagem',
    title: 'Mensagem Viva',
    subtitle: 'Se esse sonho pudesse falar, o que diria?',
    helper: 'Não é interpretação. É escuta da imagem viva.',
    icon: MessageSquare,
    placeholder: 'O sonho diz...',
    field: 'mensagem_viva' as const,
    isTextarea: true,
  },
];

export function DecodificacaoOnirica({ clienteId, sessionCaseId, onComplete, onCancel }: DecodificacaoOniricaProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<DecodificacaoInput>({
    sonho_bruto: '',
    imagem_central: '',
    forca_psiquica: '',
    movimento_interrompido: '',
    mensagem_viva: '',
    cliente_id: clienteId,
    session_case_id: sessionCaseId,
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const createMutation = useCreateDecodificacao();
  
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSubmit = async () => {
    try {
      const result = await createMutation.mutateAsync(formData);
      setIsComplete(true);
      onComplete?.(result.id);
    } catch (error) {
      // Error handled by mutation
    }
  };
  
  const handleCopyToClipboard = () => {
    const text = `
DECODIFICAÇÃO ONÍRICA

SONHO:
${formData.sonho_bruto}

IMAGEM CENTRAL:
${formData.imagem_central}

FORÇA PSÍQUICA:
${formData.forca_psiquica}

MOVIMENTO INTERROMPIDO:
${formData.movimento_interrompido}

MENSAGEM VIVA:
"${formData.mensagem_viva}"
    `.trim();
    
    navigator.clipboard.writeText(text);
    toast.success('Decodificação copiada');
  };
  
  const canProceed = step.field === 'sonho_bruto' 
    ? formData.sonho_bruto.length > 10 
    : true; // Campos opcionais
  
  if (isComplete) {
    return (
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <Badge variant="outline" className="mb-2 mx-auto text-gold border-gold/30">
            Decodificação Registrada
          </Badge>
          <CardTitle>Síntese do Sonho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Imagem Central</p>
            <p className="text-sm">{formData.imagem_central || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Força Psíquica</p>
            <p className="text-sm">{formData.forca_psiquica || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Movimento Interrompido</p>
            <p className="text-sm">{formData.movimento_interrompido || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mensagem Viva</p>
            <p className="text-sm italic">"{formData.mensagem_viva || '—'}"</p>
          </div>
          
          <Separator />
          
          <Alert className="bg-purple-500/5 border-purple-500/20">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <AlertDescription className="text-xs text-purple-200/80">
              Esta decodificação não é interpretação. É uma pista para refinar o olhar clínico.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopyToClipboard}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            <Button className="flex-1 bg-gold hover:bg-gold/90" onClick={() => {
              setIsComplete(false);
              setCurrentStep(0);
              setFormData({
                sonho_bruto: '',
                imagem_central: '',
                forca_psiquica: '',
                movimento_interrompido: '',
                mensagem_viva: '',
                cliente_id: clienteId,
                session_case_id: sessionCaseId,
              });
            }}>
              Nova Decodificação
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Passo {currentStep + 1} de {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
      
      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-purple-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <step.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.subtitle}</CardDescription>
                </div>
              </div>
              {step.helper && (
                <p className="text-xs text-muted-foreground/70 italic mt-2">
                  {step.helper}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {step.isTextarea ? (
                <Textarea
                  value={formData[step.field] || ''}
                  onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value })}
                  placeholder={step.placeholder}
                  rows={5}
                  className="resize-none"
                />
              ) : (
                <Input
                  value={formData[step.field] || ''}
                  onChange={(e) => setFormData({ ...formData, [step.field]: e.target.value })}
                  placeholder={step.placeholder}
                />
              )}
              
              {step.key === 'mensagem' && (
                <Alert className="mt-4 bg-amber-500/5 border-amber-500/20">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <AlertDescription className="text-xs text-amber-200/80">
                    Não é interpretação. É escuta da imagem viva.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation */}
      <div className="flex gap-2">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
        ) : onCancel ? (
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        ) : null}
        
        <Button 
          onClick={handleNext} 
          disabled={!canProceed || createMutation.isPending}
          className="flex-1 bg-gold hover:bg-gold/90"
        >
          {currentStep === STEPS.length - 1 ? (
            createMutation.isPending ? 'Salvando...' : 'Concluir'
          ) : (
            <>
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
