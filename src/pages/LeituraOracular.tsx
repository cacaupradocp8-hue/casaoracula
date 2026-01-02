import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

type RequestStatus = 'pending' | 'in_review' | 'approved' | 'not_indicated';

interface OracularRequest {
  id: string;
  status: RequestStatus;
  createdAt: Date;
  responses?: {
    professional: string;
    projection: string;
    narrative: string;
    readiness: string;
  };
  decision?: string;
}

const statusConfig: Record<RequestStatus, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'Aguardando', icon: <Clock className="w-4 h-4" />, color: 'bg-muted text-muted-foreground' },
  in_review: { label: 'Em Análise', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-gold/20 text-gold' },
  approved: { label: 'Liberada', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-sage/20 text-sage-light' },
  not_indicated: { label: 'Não Indicada', icon: <XCircle className="w-4 h-4" />, color: 'bg-destructive/20 text-destructive' },
};

export default function LeituraOracular() {
  const { toast } = useToast();
  const [hasRequest, setHasRequest] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    professional: '',
    projection: '',
    narrative: '',
    readiness: '',
  });

  const questions = [
    {
      key: 'professional',
      title: 'Eixo Profissional',
      question: 'Descreva sua trajetória como terapeuta. O que te trouxe até aqui? Quais são seus maiores desafios atuais na prática clínica?',
      placeholder: 'Conte sobre sua jornada profissional...',
    },
    {
      key: 'projection',
      title: 'Projeção e Sombra',
      question: 'Que tipo de cliente te desafia mais? O que em certas clientes te irrita, assusta ou mobiliza intensamente? O que isso pode dizer sobre você?',
      placeholder: 'Reflita sobre suas projeções...',
    },
    {
      key: 'narrative',
      title: 'Narrativa Simbólica',
      question: 'Se sua vida fosse um conto de fadas ou mito, qual seria? Que personagem você seria nessa história? O que ainda falta acontecer nessa narrativa?',
      placeholder: 'Explore sua narrativa simbólica...',
    },
    {
      key: 'readiness',
      title: 'Prontidão para o Portal',
      question: 'O que você está disposta a deixar morrer em você para que algo novo nasça? Qual é seu maior medo sobre essa formação? E sua maior esperança?',
      placeholder: 'Avalie sua prontidão...',
    },
  ];

  const handleSubmit = () => {
    if (Object.values(formData).some(v => !v.trim())) {
      toast({
        title: 'Responda todas as questões',
        description: 'Todas as reflexões são importantes para a Leitura Oracular.',
        variant: 'destructive',
      });
      return;
    }

    setHasRequest(true);
    toast({
      title: 'Solicitação enviada',
      description: 'Sua solicitação de Leitura Oracular foi enviada para análise da Guardiã.',
    });
  };

  if (hasRequest) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20">
          <SectionHeader
            title="Portal de Leitura Oracular"
            subtitle="Acompanhe o status da sua solicitação"
            icon={<Sparkles className="w-5 h-5" />}
            className="mb-8"
          />

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gold" />
              </div>
              <CardTitle className="font-display text-2xl">Solicitação Enviada</CardTitle>
              <CardDescription>
                Sua solicitação está sendo analisada pela Guardiã. Você receberá uma resposta em breve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className="bg-gold/20 text-gold">Em Análise</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  A Guardiã irá revisar suas respostas e seu histórico no app antes de tomar uma decisão.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Portal de Leitura Oracular"
          subtitle="Solicite uma leitura profunda para sua jornada"
          icon={<Sparkles className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Intro */}
        <Card className="bg-mystical border-gold/20 mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">
              A Leitura Oracular é um processo de avaliação profunda conduzido pela Guardiã. 
              Não é uma leitura de tarô ou oráculo divinatório — é uma análise simbólica da sua 
              prontidão para a formação ORÁCULA.
            </p>
            <p className="text-muted-foreground text-sm">
              Responda às questões abaixo com honestidade e profundidade. Suas respostas serão 
              analisadas juntamente com seu histórico de uso do app.
            </p>
          </CardContent>
        </Card>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {questions.map((q, idx) => (
            <button
              key={q.key}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                currentStep === idx 
                  ? 'bg-gold/20 text-gold' 
                  : formData[q.key as keyof typeof formData] 
                    ? 'bg-secondary text-foreground' 
                    : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{q.title}</span>
            </button>
          ))}
        </div>

        {/* Current Question */}
        <Card className="mb-6">
          <CardHeader>
            <Badge variant="secondary" className="w-fit mb-2">
              Bloco {currentStep + 1} de {questions.length}
            </Badge>
            <CardTitle className="font-display text-xl">
              {questions[currentStep].title}
            </CardTitle>
            <CardDescription className="text-base italic">
              {questions[currentStep].question}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={questions[currentStep].placeholder}
              className="min-h-[200px]"
              value={formData[questions[currentStep].key as keyof typeof formData]}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                [questions[currentStep].key]: e.target.value 
              }))}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
          >
            Anterior
          </Button>
          
          {currentStep < questions.length - 1 ? (
            <Button
              variant="gold"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Próximo
            </Button>
          ) : (
            <Button
              variant="gold"
              onClick={handleSubmit}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Solicitação
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
