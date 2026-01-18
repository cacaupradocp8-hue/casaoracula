import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Map, Flower2, Compass, ArrowRight, CheckCircle2, 
  Circle, Loader2, Sparkles, FileText, Save, Book
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProtocoloOracula, ProtocoloStatus } from '@/hooks/useProtocoloOracula';
import { toast } from 'sonner';

interface ProtocoloOraculaTabProps {
  sessionCaseId: string;
  clienteId: string;
  clienteNome: string;
}

const PROTOCOL_STEPS = [
  {
    key: 'mapa' as const,
    title: 'Mapa dos Cinco Territórios',
    subtitle: 'Localização Psíquica',
    description: 'Identifica onde a energia psíquica está concentrada',
    icon: Map,
    route: '/ferramenta/big5-simbolico',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    key: 'oraculo' as const,
    title: 'Oráculo dos Nove Arquétipos',
    subtitle: 'Interpretação Simbólica',
    description: 'Traduz padrões em dinâmicas arquetípicas',
    icon: Flower2,
    route: '/ferramenta/eneagrama-feminino',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
  },
  {
    key: 'caminho' as const,
    title: 'Caminho da Mulher',
    subtitle: 'Integração e Individuação',
    description: 'Mapeia a fase atual da jornada de transformação',
    icon: Compass,
    route: '/ferramenta/jornada-heroina',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
];

export function ProtocoloOraculaTab({ sessionCaseId, clienteId, clienteNome }: ProtocoloOraculaTabProps) {
  const navigate = useNavigate();
  const { 
    protocolo, 
    loading, 
    status, 
    createProtocolo, 
    completeProtocolo 
  } = useProtocoloOracula(sessionCaseId);

  const [objetivoTerapeutico, setObjetivoTerapeutico] = useState('');
  const [sintese, setSintese] = useState('');
  const [proximosPassos, setProximosPassos] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (protocolo) {
      setObjetivoTerapeutico(protocolo.objetivo_terapeutico || '');
      setSintese(protocolo.sintese_narrativa || '');
      setProximosPassos(protocolo.proximos_passos || '');
    }
  }, [protocolo]);

  const handleStartProtocol = async () => {
    if (!objetivoTerapeutico.trim()) {
      toast.error('Defina o objetivo terapêutico antes de iniciar');
      return;
    }
    await createProtocolo(clienteId, objetivoTerapeutico);
  };

  const handleNavigateToTool = (step: typeof PROTOCOL_STEPS[0]) => {
    // Pass session_case parameter to link the result
    navigate(`${step.route}?session_case=${sessionCaseId}&cliente=${clienteId}`);
  };

  const handleCompleteProtocol = async () => {
    if (!sintese.trim()) {
      toast.error('Adicione a síntese narrativa antes de concluir');
      return;
    }
    setSaving(true);
    await completeProtocolo(sintese, proximosPassos);
    setSaving(false);
    toast.success('Protocolo concluído com sucesso');
  };

  const getStepStatus = (key: keyof ProtocoloStatus): 'pending' | 'active' | 'complete' => {
    if (status[key] === 'concluido') return 'complete';
    if (status[key] === 'em_andamento') return 'active';
    return 'pending';
  };

  const isProtocolComplete = status.mapa === 'concluido' && 
                              status.oraculo === 'concluido' && 
                              status.caminho === 'concluido';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Initial state - no protocol yet
  if (!protocolo) {
    return (
      <div className="space-y-6">
        <Card className="glass">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-xl font-display">Protocolo Oracular</CardTitle>
            <CardDescription>
              Sistema clínico de 3 camadas para condução terapêutica simbólica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-sm text-muted-foreground text-center mb-4">
                <strong>Cliente:</strong> {clienteNome}
              </p>
              
              {/* Protocol Flow Preview */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {PROTOCOL_STEPS.map((step, idx) => (
                  <div key={step.key} className="flex items-center gap-2">
                    <div className={cn("p-2 rounded-full", step.bgColor)}>
                      <step.icon className={cn("w-4 h-4", step.color)} />
                    </div>
                    {idx < PROTOCOL_STEPS.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-muted-foreground">
                MAPA localiza → ORÁCULO interpreta → CAMINHO integra
              </p>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4 text-gold"
                onClick={() => navigate('/session-room/manuais')}
              >
                <Book className="w-4 h-4 mr-2" />
                Consultar Manuais Clínicos
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Objetivo Terapêutico para este Protocolo</Label>
              <Textarea
                value={objetivoTerapeutico}
                onChange={(e) => setObjetivoTerapeutico(e.target.value)}
                placeholder="Ex: Explorar padrões de autossabotagem nos relacionamentos..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Este objetivo guiará a leitura simbólica em cada ferramenta.
              </p>
            </div>

            <Button 
              onClick={handleStartProtocol} 
              className="w-full"
              disabled={!objetivoTerapeutico.trim()}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Iniciar Protocolo Oracular
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Protocol in progress
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Protocolo para</p>
              <p className="font-medium">{clienteNome}</p>
            </div>
            <Badge 
              variant={protocolo.status === 'concluido' ? 'default' : 'secondary'}
              className={protocolo.status === 'concluido' ? 'bg-emerald-500' : ''}
            >
              {protocolo.status === 'iniciado' && 'Iniciado'}
              {protocolo.status === 'em_andamento' && 'Em Andamento'}
              {protocolo.status === 'concluido' && 'Concluído'}
              {protocolo.status === 'pausado' && 'Pausado'}
            </Badge>
          </div>
          {objetivoTerapeutico && (
            <div className="mt-3 p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Objetivo:</p>
              <p className="text-sm">{objetivoTerapeutico}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protocol Steps */}
      <div className="space-y-4">
        {PROTOCOL_STEPS.map((step, idx) => {
          const stepStatus = getStepStatus(step.key);
          const isLocked = idx > 0 && getStepStatus(PROTOCOL_STEPS[idx - 1].key) !== 'complete';
          
          return (
            <Card 
              key={step.key}
              className={cn(
                "transition-all",
                stepStatus === 'complete' && step.borderColor,
                isLocked && "opacity-50"
              )}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Status Indicator */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    stepStatus === 'complete' ? 'bg-emerald-500/20' : step.bgColor
                  )}>
                    {stepStatus === 'complete' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <step.icon className={cn("w-5 h-5", step.color)} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {step.subtitle}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Action */}
                  <Button
                    variant={stepStatus === 'complete' ? 'outline' : 'default'}
                    size="sm"
                    disabled={isLocked}
                    onClick={() => handleNavigateToTool(step)}
                  >
                    {stepStatus === 'complete' ? (
                      <>
                        <FileText className="w-4 h-4 mr-1" />
                        Ver
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 mr-1" />
                        {stepStatus === 'active' ? 'Continuar' : 'Iniciar'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Synthesis Section - Only show when all tools complete */}
      {isProtocolComplete && protocolo.status !== 'concluido' && (
        <Card className="glass border-gold/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Síntese do Protocolo
            </CardTitle>
            <CardDescription>
              Compile os insights das 3 ferramentas em uma síntese narrativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Síntese Narrativa</Label>
              <Textarea
                value={sintese}
                onChange={(e) => setSintese(e.target.value)}
                placeholder="A cliente apresenta energia concentrada no território X, com dinâmica arquetípica Y, encontrando-se na fase Z de sua jornada..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Próximos Passos Terapêuticos</Label>
              <Textarea
                value={proximosPassos}
                onChange={(e) => setProximosPassos(e.target.value)}
                placeholder="Sugestões para as próximas sessões baseadas no protocolo..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCompleteProtocol}
              className="w-full"
              disabled={saving || !sintese.trim()}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Concluir Protocolo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Protocol View */}
      {protocolo.status === 'concluido' && (
        <Card className="glass border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              Protocolo Concluído
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {protocolo.sintese_narrativa && (
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Síntese</p>
                <p className="text-sm">{protocolo.sintese_narrativa}</p>
              </div>
            )}
            {protocolo.proximos_passos && (
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-1">Próximos Passos</p>
                <p className="text-sm">{protocolo.proximos_passos}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
