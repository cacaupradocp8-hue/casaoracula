import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { 
  Activity, 
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Emoções para entrada
const EMOCOES = [
  { id: 'medo', label: 'Medo', grupo: 'contracao' },
  { id: 'raiva', label: 'Raiva', grupo: 'defesa' },
  { id: 'tristeza', label: 'Tristeza', grupo: 'contracao' },
  { id: 'vergonha', label: 'Vergonha', grupo: 'contracao' },
  { id: 'culpa', label: 'Culpa', grupo: 'contracao' },
  { id: 'apatia', label: 'Apatia', grupo: 'contracao' },
  { id: 'ansiedade', label: 'Ansiedade', grupo: 'defesa' },
  { id: 'orgulho', label: 'Orgulho', grupo: 'defesa' },
  { id: 'coragem', label: 'Coragem', grupo: 'expansao' },
  { id: 'aceitacao', label: 'Aceitação', grupo: 'expansao' },
  { id: 'alegria', label: 'Alegria', grupo: 'expansao' },
  { id: 'paz', label: 'Paz', grupo: 'expansao' },
  { id: 'amor', label: 'Amor', grupo: 'expansao' },
  { id: 'gratidao', label: 'Gratidão', grupo: 'expansao' },
];

interface CampoVibracional {
  nome: string;
  descricao: string;
  tendencia: 'expansao' | 'contracao' | 'defesa';
  cor: string;
  movimentoSugerido: string;
}

const CAMPOS_VIBRACIONAIS: Record<string, CampoVibracional> = {
  contracao: {
    nome: 'Campo de Contração',
    descricao: 'O campo está em retração. Há movimento de recolhimento, proteção passiva, ou paralisia. Não é erro — é mecanismo de sobrevivência. Mas pode haver estagnação se prolongado.',
    tendencia: 'contracao',
    cor: 'from-blue-900/30 to-blue-950/50',
    movimentoSugerido: 'Movimento sugerido: Antes de expandir, reconhecer. O que precisa ser acolhido aqui? Práticas de contenção gentil, não de impulso.',
  },
  defesa: {
    nome: 'Campo de Defesa Ativa',
    descricao: 'O campo está mobilizado para proteção. Há energia disponível, mas direcionada para vigilância. Pode haver exaustão por hiper-alerta ou projeção em outros.',
    tendencia: 'defesa',
    cor: 'from-amber-900/30 to-amber-950/50',
    movimentoSugerido: 'Movimento sugerido: Descanso da vigilância. O que está sendo protegido? A ameaça é real ou projetada? Práticas de ancoragem e limite consciente.',
  },
  expansao: {
    nome: 'Campo de Expansão',
    descricao: 'O campo está em abertura. Há fluxo, conexão, disponibilidade para receber e doar. Atenção: expansão constante também cansa. Há pausas?',
    tendencia: 'expansao',
    cor: 'from-emerald-900/30 to-emerald-950/50',
    movimentoSugerido: 'Movimento sugerido: Celebrar sem dissipação. Como sustentar essa abertura com presença? Práticas de ancoragem na alegria.',
  },
};

type Step = 'emocao' | 'linguagem' | 'resultado';

export default function EscalaNarrativa() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('emocao');
  const [emocaoSelecionada, setEmocaoSelecionada] = useState('');
  const [linguagemInterna, setLinguagemInterna] = useState('');

  const handleNext = () => {
    if (step === 'emocao' && emocaoSelecionada) setStep('linguagem');
    else if (step === 'linguagem') setStep('resultado');
  };

  const handleBack = () => {
    if (step === 'linguagem') setStep('emocao');
    else if (step === 'resultado') setStep('linguagem');
    else navigate('/radiestesia');
  };

  const emocaoObj = EMOCOES.find(e => e.id === emocaoSelecionada);
  const campoResultante = emocaoObj ? CAMPOS_VIBRACIONAIS[emocaoObj.grupo] : null;

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'expansao': return <ArrowUp className="w-5 h-5 text-emerald-400" />;
      case 'contracao': return <ArrowDown className="w-5 h-5 text-blue-400" />;
      case 'defesa': return <Minus className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <AppLayout>
      <ContentPageLayout
        title="Escala Narrativa Vibracional"
        subtitle="Leitura simbólica do campo — não frequência numérica"
        badge="Autoral"
        badgeIcon={<Activity className="w-4 h-4 text-gold" />}
        onBack={handleBack}
        backLabel={step === 'emocao' ? 'Voltar ao Portal' : 'Voltar'}
        showNavigation={false}
        maxWidth="2xl"
      >
        {/* Introdução */}
        {step === 'emocao' && (
          <Card className="bg-gradient-to-br from-rose-900/20 to-background border-rose-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-foreground">
                    Inspirada em Hawkins, mas <strong>sem números rígidos</strong>. 
                    Esta escala lê tendências narrativas do campo, não frequências absolutas.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma emoção é "baixa" ou "alta". São estados — cada um com sua função.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Emoção */}
        {step === 'emocao' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual emoção predominante?</CardTitle>
              <CardDescription>
                Identifique o tom emocional principal do momento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {EMOCOES.map((emocao) => (
                  <Button
                    key={emocao.id}
                    variant={emocaoSelecionada === emocao.id ? "default" : "outline"}
                    className={cn(
                      "h-auto py-3",
                      emocaoSelecionada === emocao.id && "bg-gold hover:bg-gold/90 text-background"
                    )}
                    onClick={() => setEmocaoSelecionada(emocao.id)}
                  >
                    {emocao.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Linguagem */}
        {step === 'linguagem' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual a linguagem interna?</CardTitle>
              <CardDescription>
                Emoção: <Badge variant="outline">{emocaoObj?.label}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>O que você está dizendo para si mesma?</Label>
                <Textarea
                  value={linguagemInterna}
                  onChange={(e) => setLinguagemInterna(e.target.value)}
                  placeholder="Qual o diálogo interno predominante? Que frases se repetem?"
                  rows={4}
                  className="resize-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                A linguagem interna revela padrões narrativos. Escreva sem filtrar.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step: Resultado */}
        {step === 'resultado' && campoResultante && (
          <>
            {/* Resumo */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{emocaoObj?.label}</Badge>
            </div>

            {/* Campo Vibracional Visual */}
            <Card className={cn(
              "bg-gradient-to-br border-0 relative overflow-hidden",
              campoResultante.cor
            )}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  {getTendenciaIcon(campoResultante.tendencia)}
                  <CardTitle className="text-xl">{campoResultante.nome}</CardTitle>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "w-fit mt-2",
                    campoResultante.tendencia === 'expansao' && "border-emerald-500/50 text-emerald-400",
                    campoResultante.tendencia === 'contracao' && "border-blue-500/50 text-blue-400",
                    campoResultante.tendencia === 'defesa' && "border-amber-500/50 text-amber-400"
                  )}
                >
                  Tendência: {campoResultante.tendencia === 'expansao' ? 'Expansão' : 
                              campoResultante.tendencia === 'contracao' ? 'Contração' : 'Defesa'}
                </Badge>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <p className="text-muted-foreground">
                  {campoResultante.descricao}
                </p>
                
                <div className="p-4 rounded-lg bg-background/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-gold">Movimento Sugerido</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {campoResultante.movimentoSugerido}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Linguagem registrada */}
            {linguagemInterna && (
              <Card className="bg-muted/20 border-dashed">
                <CardContent className="py-4">
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Linguagem interna registrada:
                  </Label>
                  <p className="text-sm italic text-muted-foreground">
                    "{linguagemInterna}"
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
          
          {step !== 'resultado' && (
            <Button 
              onClick={handleNext}
              disabled={step === 'emocao' && !emocaoSelecionada}
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 'resultado' && (
            <Button 
              onClick={() => {
                setStep('emocao');
                setEmocaoSelecionada('');
                setLinguagemInterna('');
              }}
              variant="outline"
            >
              Nova Leitura
            </Button>
          )}
        </div>

        <EthicalNotice toolName="Escala Narrativa" />
      </ContentPageLayout>
    </AppLayout>
  );
}
