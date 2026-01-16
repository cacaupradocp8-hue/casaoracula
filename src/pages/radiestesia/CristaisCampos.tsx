import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRadiestesiaConfig, Cristal } from '@/hooks/useRadiestesiaConfig';
import { 
  Gem, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  Zap,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Campos de sustentação
const CAMPOS = [
  { id: 'emocional', label: 'Campo Emocional', icon: Heart, descricao: 'Sustentação de processos emocionais' },
  { id: 'protecao', label: 'Campo de Proteção', icon: Shield, descricao: 'Ancoragem e limites energéticos' },
  { id: 'energia', label: 'Campo Vital', icon: Zap, descricao: 'Vitalidade e disposição' },
  { id: 'espiritual', label: 'Campo Espiritual', icon: Sparkles, descricao: 'Conexão e intuição' },
];

// Estados predominantes
const ESTADOS = [
  { id: 'emocao', label: 'Emoção Intensa', descricao: 'Sentimentos fortes pedindo contenção' },
  { id: 'acao', label: 'Necessidade de Ação', descricao: 'Impulso para movimento e decisão' },
  { id: 'integracao', label: 'Integração', descricao: 'Processos de síntese e compreensão' },
  { id: 'protecao', label: 'Proteção', descricao: 'Vulnerabilidade pedindo amparo' },
];

// Fallback crystals when DB is empty
const CRISTAIS_FALLBACK: Cristal[] = [
  {
    id: 'ametista',
    nome: 'Ametista',
    explicacao_simbolica: 'Pedra da transmutação serena. Transforma densidades sem violência, como a noite que transforma o dia sem pressa. Sustenta processos de limpeza emocional com suavidade.',
    quando_usar: 'Para processos de transmutação emocional suave e conexão espiritual.',
    quando_evitar: 'Em estados de desconexão excessiva ou quando evitando sentimentos.',
    alerta_excesso: 'Em excesso, pode criar distanciamento emocional. Se você está evitando sentir, a ametista pode amplificar esse escape.',
    campos: ['emocional', 'espiritual'],
    estados: ['emocao', 'integracao'],
    graficos_associados: [],
    link_externo: null,
    imagem_url: null,
    ordem: 0,
    ativo: true,
  },
  {
    id: 'quartzo-rosa',
    nome: 'Quartzo Rosa',
    explicacao_simbolica: 'Pedra do amor incondicional. Não romantiza — acolhe. Sustenta feridas de rejeição e abandono, oferecendo o colo que faltou.',
    quando_usar: 'Para acolher feridas emocionais e trabalhar questões de autoamor.',
    quando_evitar: 'Quando evitando confrontos necessários.',
    alerta_excesso: 'Pode criar passividade se usado como escape de confrontos necessários. Amor também é limite.',
    campos: ['emocional'],
    estados: ['emocao', 'protecao'],
    graficos_associados: [],
    link_externo: null,
    imagem_url: null,
    ordem: 1,
    ativo: true,
  },
  {
    id: 'turmalina-negra',
    nome: 'Turmalina Negra',
    explicacao_simbolica: 'Guardiã das fronteiras. Não ataca — protege. Ancora o corpo ao chão, impedindo dispersão energética.',
    quando_usar: 'Para proteção e ancoragem em situações de vulnerabilidade.',
    quando_evitar: 'Quando já isolada ou em defensiva excessiva.',
    alerta_excesso: 'Em excesso, pode criar isolamento defensivo. Proteção não é muralha — é discernimento.',
    campos: ['protecao', 'energia'],
    estados: ['protecao'],
    graficos_associados: [],
    link_externo: null,
    imagem_url: null,
    ordem: 2,
    ativo: true,
  },
  {
    id: 'citrino',
    nome: 'Citrino',
    explicacao_simbolica: 'Pedra do sol interno. Ativa vontade e clareza de propósito. Sustenta processos de ação consciente.',
    quando_usar: 'Para ativar energia de ação e clareza de propósito.',
    quando_evitar: 'Em estados de ansiedade ou agitação.',
    alerta_excesso: 'Pode amplificar ansiedade e urgência se o campo já está agitado. Nem toda ação é necessária agora.',
    campos: ['energia'],
    estados: ['acao'],
    graficos_associados: [],
    link_externo: null,
    imagem_url: null,
    ordem: 3,
    ativo: true,
  },
];

export default function CristaisCampos() {
  const navigate = useNavigate();
  const { cristais: cristaisDB, isLoading } = useRadiestesiaConfig();
  const [step, setStep] = useState<'campo' | 'estado' | 'resultado'>('campo');
  const [campoSelecionado, setCampoSelecionado] = useState('');
  const [estadoSelecionado, setEstadoSelecionado] = useState('');

  // Use DB data or fallback
  const cristais = cristaisDB.length > 0 
    ? cristaisDB.filter(c => c.ativo)
    : CRISTAIS_FALLBACK;

  const handleNext = () => {
    if (step === 'campo' && campoSelecionado) setStep('estado');
    else if (step === 'estado' && estadoSelecionado) setStep('resultado');
  };

  const handleBack = () => {
    if (step === 'estado') setStep('campo');
    else if (step === 'resultado') setStep('estado');
    else navigate('/radiestesia');
  };

  const cristaisSugeridos = cristais.filter(
    c => c.campos?.includes(campoSelecionado) && c.estados?.includes(estadoSelecionado)
  );

  // Se não houver match perfeito, mostrar cristais que batem pelo menos o campo
  const cristaisAlternativos = cristaisSugeridos.length === 0 
    ? cristais.filter(c => c.campos?.includes(campoSelecionado))
    : [];

  if (isLoading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Cristais & Campos"
          subtitle="Leitura simbólica de sustentação energética"
          badge="Sustentação"
          badgeIcon={<Gem className="w-4 h-4 text-gold" />}
          onBack={() => navigate('/radiestesia')}
          backLabel="Voltar ao Portal"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ContentPageLayout
        title="Cristais & Campos"
        subtitle="Leitura simbólica de sustentação energética"
        badge="Sustentação"
        badgeIcon={<Gem className="w-4 h-4 text-gold" />}
        onBack={handleBack}
        backLabel={step === 'campo' ? 'Voltar ao Portal' : 'Voltar'}
        showNavigation={false}
        maxWidth="2xl"
      >
        {/* Introdução */}
        {step === 'campo' && (
          <Card className="bg-gradient-to-br from-emerald-900/20 to-background border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-foreground">
                    Esta ferramenta oferece <strong>leitura simbólica de sustentação</strong>, 
                    não escolha aleatória de cristal.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Cristais amplificam — incluindo o que não queremos amplificar. 
                    Use com consciência.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step: Campo */}
        {step === 'campo' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual campo precisa de sustentação?</CardTitle>
              <CardDescription>
                Identifique o território que pede amparo energético.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={campoSelecionado} onValueChange={setCampoSelecionado}>
                <div className="grid gap-3 md:grid-cols-2">
                  {CAMPOS.map((campo) => (
                    <label
                      key={campo.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        campoSelecionado === campo.id 
                          ? "border-gold bg-gold/5" 
                          : "border-border hover:border-gold/30"
                      )}
                    >
                      <RadioGroupItem value={campo.id} className="mt-1" />
                      <div className="flex items-start gap-3">
                        <campo.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{campo.label}</p>
                          <p className="text-xs text-muted-foreground">{campo.descricao}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step: Estado */}
        {step === 'estado' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual estado predominante?</CardTitle>
              <CardDescription>
                Campo: <Badge variant="outline">{CAMPOS.find(c => c.id === campoSelecionado)?.label}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={estadoSelecionado} onValueChange={setEstadoSelecionado}>
                <div className="space-y-3">
                  {ESTADOS.map((estado) => (
                    <label
                      key={estado.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        estadoSelecionado === estado.id 
                          ? "border-gold bg-gold/5" 
                          : "border-border hover:border-gold/30"
                      )}
                    >
                      <RadioGroupItem value={estado.id} className="mt-1" />
                      <div>
                        <p className="font-medium">{estado.label}</p>
                        <p className="text-sm text-muted-foreground">{estado.descricao}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Step: Resultado */}
        {step === 'resultado' && (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{CAMPOS.find(c => c.id === campoSelecionado)?.label}</Badge>
              <Badge variant="outline">{ESTADOS.find(e => e.id === estadoSelecionado)?.label}</Badge>
            </div>

            {(cristaisSugeridos.length > 0 ? cristaisSugeridos : cristaisAlternativos).map((cristal) => (
              <Card key={cristal.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Gem className="w-6 h-6 text-emerald-400" />
                    <CardTitle className="text-lg">{cristal.nome}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Imagem do cristal */}
                  {cristal.imagem_url && (
                    <img 
                      src={cristal.imagem_url} 
                      alt={cristal.nome}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  
                  {/* Explicação simbólica */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-emerald-400">
                      Explicação Simbólica
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {cristal.explicacao_simbolica}
                    </p>
                  </div>

                  {/* Quando usar */}
                  {cristal.quando_usar && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-400">Quando usar</p>
                      <p className="text-sm text-muted-foreground">{cristal.quando_usar}</p>
                    </div>
                  )}

                  {/* Quando evitar */}
                  {cristal.quando_evitar && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-rose-400">Quando evitar</p>
                      <p className="text-sm text-muted-foreground">{cristal.quando_evitar}</p>
                    </div>
                  )}

                  {/* Alerta de excesso */}
                  {cristal.alerta_excesso && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-amber-500 mb-1">Alerta de excesso</p>
                          <p className="text-xs text-muted-foreground">
                            {cristal.alerta_excesso}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Link externo */}
                  {cristal.link_externo && (
                    <a 
                      href={cristal.link_externo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Saiba mais
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}

            {cristaisSugeridos.length === 0 && cristaisAlternativos.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Nenhum cristal específico encontrado para esta combinação.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Considere explorar outras combinações ou consultar um especialista.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Microcopy */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground/60 italic">
                "Nem todo campo precisa de amplificação. Às vezes, precisa de silêncio."
              </p>
            </div>
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
              disabled={
                (step === 'campo' && !campoSelecionado) ||
                (step === 'estado' && !estadoSelecionado)
              }
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Continuar
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {step === 'resultado' && (
            <Button 
              onClick={() => {
                setStep('campo');
                setCampoSelecionado('');
                setEstadoSelecionado('');
              }}
              variant="outline"
            >
              Nova Leitura
            </Button>
          )}
        </div>

        <EthicalNotice toolName="Cristais & Campos" />
      </ContentPageLayout>
    </AppLayout>
  );
}
