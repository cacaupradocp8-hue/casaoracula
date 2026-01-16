import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Layers, 
  Loader2, 
  Save, 
  ChevronRight,
  ChevronLeft,
  Circle,
  CheckCircle2,
  Eye,
  Compass,
  Lock,
  Unlock,
  Heart,
  Sparkles,
  RotateCcw,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Configuração das 5 Camadas
const CAMADAS = [
  {
    numero: 1,
    titulo: 'Camada 1 — Campo Atual',
    simbolo: '🜂',
    icone: Eye,
    cor: 'from-purple-500/20 to-purple-600/10',
    corBorda: 'border-purple-500/30',
    objetivo: 'Identificar o estado do campo no momento da leitura.',
    textoPedagogico: 'Antes de perguntar qualquer coisa, escute o campo. Nem todo campo está disponível para intervenção.',
    perguntaBase: 'Qual é a configuração energética presente neste momento?',
  },
  {
    numero: 2,
    titulo: 'Camada 2 — Origem do Movimento',
    simbolo: '🜁',
    icone: Compass,
    cor: 'from-blue-500/20 to-blue-600/10',
    corBorda: 'border-blue-500/30',
    objetivo: 'Localizar de onde nasce o desequilíbrio.',
    textoPedagogico: 'Todo movimento tem uma origem. Não se trata de encontrar culpa, mas de mapear direções.',
    perguntaBase: 'De onde esse movimento se origina?',
    opcoesSugeridas: [
      'emocional',
      'mental',
      'corporal',
      'relacional',
      'ambiental',
      'simbólica / ancestral',
    ],
  },
  {
    numero: 3,
    titulo: 'Camada 3 — Bloqueio Simbólico',
    simbolo: '🜄',
    icone: Lock,
    cor: 'from-amber-500/20 to-amber-600/10',
    corBorda: 'border-amber-500/30',
    objetivo: 'Identificar o que sustenta o travamento.',
    textoPedagogico: 'Aqui não se procura culpa. Apenas o que sustenta o padrão.',
    perguntaBase: 'O que impede o fluxo neste campo?',
  },
  {
    numero: 4,
    titulo: 'Camada 4 — Movimento Possível',
    simbolo: '🜃',
    icone: Unlock,
    cor: 'from-emerald-500/20 to-emerald-600/10',
    corBorda: 'border-emerald-500/30',
    objetivo: 'Indicar o movimento proporcional e ético.',
    textoPedagogico: 'Nem todo campo pede intervenção imediata. Às vezes, o movimento possível é a pausa.',
    perguntaBase: 'Qual movimento é possível agora, sem violência ao campo?',
    exemplos: [
      'limpeza gradual',
      'harmonização',
      'pausa',
      'ritual simbólico',
      'acompanhamento',
    ],
  },
  {
    numero: 5,
    titulo: 'Camada 5 — Integração',
    simbolo: '🌑',
    icone: Heart,
    cor: 'from-rose-500/20 to-rose-600/10',
    corBorda: 'border-rose-500/30',
    objetivo: 'Fechar o ciclo da leitura com responsabilidade.',
    textoPedagogico: 'A radiestesia não cria dependência. Ela fecha ciclos.',
    perguntaBase: 'O que precisa ser integrado para sustentar esse movimento?',
  },
];

type CamadaNumero = 1 | 2 | 3 | 4 | 5;

interface RespostaCamada {
  anotacao: string;
  origensSelecionadas?: string[]; // Para camada 2
  timestamp: string;
}

export default function Leitura5Camadas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const clienteId = searchParams.get('cliente');
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  
  const [camadaAtual, setCamadaAtual] = useState<CamadaNumero>(1);
  const [respostas, setRespostas] = useState<Record<number, RespostaCamada>>({});
  const [anotacaoAtual, setAnotacaoAtual] = useState('');
  const [origensSelecionadas, setOrigensSelecionadas] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [mostrarResumo, setMostrarResumo] = useState(false);

  const camadaConfig = CAMADAS[camadaAtual - 1];

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  // Restaurar estado ao voltar para uma camada
  useEffect(() => {
    const respostaSalva = respostas[camadaAtual];
    if (respostaSalva) {
      setAnotacaoAtual(respostaSalva.anotacao);
      setOrigensSelecionadas(respostaSalva.origensSelecionadas || []);
    } else {
      setAnotacaoAtual('');
      setOrigensSelecionadas([]);
    }
  }, [camadaAtual, respostas]);

  const fetchCliente = async () => {
    if (!clienteId) return;
    const { data } = await supabase
      .from('clientes')
      .select('id, nome')
      .eq('id', clienteId)
      .single();
    if (data) setClienteInfo(data);
  };

  const salvarCamadaAtual = () => {
    setRespostas(prev => ({
      ...prev,
      [camadaAtual]: {
        anotacao: anotacaoAtual,
        origensSelecionadas: camadaAtual === 2 ? origensSelecionadas : undefined,
        timestamp: new Date().toISOString(),
      },
    }));
  };

  const handleAvancar = () => {
    salvarCamadaAtual();
    
    if (camadaAtual < 5) {
      setCamadaAtual((prev) => (prev + 1) as CamadaNumero);
    } else {
      setMostrarResumo(true);
    }
  };

  const handleVoltar = () => {
    if (mostrarResumo) {
      setMostrarResumo(false);
      return;
    }
    
    if (camadaAtual > 1) {
      salvarCamadaAtual();
      setCamadaAtual((prev) => (prev - 1) as CamadaNumero);
    } else {
      navigate('/radiestesia');
    }
  };

  const handleSalvarLeitura = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // Buscar ferramenta_id para radiestesia
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'radiestesia')
        .single();

      if (ferramenta) {
        const dadosLeitura = JSON.parse(JSON.stringify({
          tipo: 'leitura_5_camadas',
          camadas: respostas,
          completada_em: new Date().toISOString(),
        }));
        
        await supabase.from('ferramenta_registros').insert([{
          user_id: user.id,
          ferramenta_id: ferramenta.id,
          cliente_id: clienteId || null,
          dados: dadosLeitura,
          notas: gerarResumoTexto(),
        }]);
      }

      toast({
        title: 'Leitura registrada',
        description: 'As 5 camadas foram salvas com sucesso.',
      });

      if (clienteId) {
        navigate(`/cliente/${clienteId}`);
      } else {
        navigate('/radiestesia/diario');
      }
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNovaLeitura = () => {
    setRespostas({});
    setAnotacaoAtual('');
    setOrigensSelecionadas([]);
    setCamadaAtual(1);
    setMostrarResumo(false);
  };

  const gerarResumoTexto = () => {
    return CAMADAS.map((camada) => {
      const resposta = respostas[camada.numero];
      if (!resposta) return '';
      
      let texto = `${camada.titulo}:\n${resposta.anotacao}`;
      if (resposta.origensSelecionadas?.length) {
        texto += `\nOrigens: ${resposta.origensSelecionadas.join(', ')}`;
      }
      return texto;
    }).filter(Boolean).join('\n\n---\n\n');
  };

  const toggleOrigem = (origem: string) => {
    setOrigensSelecionadas(prev => 
      prev.includes(origem) 
        ? prev.filter(o => o !== origem)
        : [...prev, origem]
    );
  };

  // Verificar se pode avançar
  const podeAvancar = anotacaoAtual.trim().length > 0;

  // Tela de Resumo
  if (mostrarResumo) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Resumo da Leitura"
          subtitle="5 Camadas da Escuta"
          badge="Integração"
          badgeIcon={<Layers className="w-4 h-4 text-gold" />}
          onBack={handleVoltar}
          backLabel="Revisar Camadas"
          showNavigation={false}
          maxWidth="2xl"
        >
          {/* Cliente Info */}
          {clienteInfo && (
            <Card className="border-gold/30 bg-gold/5">
              <CardContent className="py-4">
                <p className="text-sm">
                  Leitura para: <strong>{clienteInfo.nome}</strong>
                </p>
              </CardContent>
            </Card>
          )}

          {/* Resumo das 5 Camadas */}
          <Card className="bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                Leitura em 5 Camadas
              </CardTitle>
              <CardDescription>
                Resumo completo da sua leitura simbólica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CAMADAS.map((camada) => {
                const resposta = respostas[camada.numero];
                if (!resposta) return null;
                
                return (
                  <div 
                    key={camada.numero}
                    className={cn(
                      "p-4 rounded-lg border",
                      camada.corBorda,
                      "bg-gradient-to-br",
                      camada.cor
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{camada.simbolo}</span>
                      <h4 className="font-medium text-sm">{camada.titulo}</h4>
                    </div>
                    
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {resposta.anotacao}
                    </p>
                    
                    {resposta.origensSelecionadas && resposta.origensSelecionadas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resposta.origensSelecionadas.map((origem) => (
                          <Badge key={origem} variant="outline" className="text-xs">
                            {origem}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Aviso Ético */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                ⚠️ Esta leitura não gera interpretação automática, não sugere diagnóstico 
                e não promete resultado. É um registro da escuta simbólica conduzida pela 
                profissional.
              </p>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleNovaLeitura}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Nova Leitura
            </Button>
            
            <Button 
              onClick={handleSalvarLeitura}
              disabled={saving}
              className="flex-1 bg-gold hover:bg-gold/90 text-background"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Leitura
            </Button>
          </div>

          <EthicalNotice toolName="Leitura em 5 Camadas" />
        </ContentPageLayout>
      </AppLayout>
    );
  }

  // Tela da Camada Atual
  return (
    <AppLayout>
      <ContentPageLayout
        title={camadaConfig.titulo}
        subtitle="Leitura em 5 Camadas"
        badge={`Camada ${camadaAtual}/5`}
        badgeIcon={<camadaConfig.icone className="w-4 h-4 text-gold" />}
        onBack={handleVoltar}
        backLabel={camadaAtual === 1 ? 'Voltar ao Portal' : 'Camada anterior'}
        showNavigation={false}
        maxWidth="2xl"
      >
        {/* Cliente Info */}
        {clienteInfo && (
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="py-4">
              <p className="text-sm">
                Leitura para: <strong>{clienteInfo.nome}</strong>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Indicador de Progresso */}
        <div className="flex items-center justify-center gap-1 py-4">
          {CAMADAS.map((camada) => {
            const completada = respostas[camada.numero]?.anotacao?.trim();
            const atual = camada.numero === camadaAtual;
            
            return (
              <div key={camada.numero} className="flex items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  atual && "ring-2 ring-gold ring-offset-2 ring-offset-background",
                  completada 
                    ? "bg-gold text-background" 
                    : atual 
                      ? "bg-gold/20 text-gold border border-gold/50" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {completada ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{camada.numero}</span>
                  )}
                </div>
                {camada.numero < 5 && (
                  <div className={cn(
                    "w-4 h-0.5 mx-0.5",
                    respostas[camada.numero]?.anotacao?.trim() 
                      ? "bg-gold" 
                      : "bg-muted-foreground/20"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card Principal da Camada */}
        <Card className={cn(
          "bg-gradient-to-br",
          camadaConfig.cor,
          camadaConfig.corBorda
        )}>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{camadaConfig.simbolo}</span>
              <div>
                <CardTitle className="text-lg">{camadaConfig.titulo}</CardTitle>
                <CardDescription className="text-sm mt-1">
                  {camadaConfig.objetivo}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Texto Pedagógico */}
            <div className="p-4 rounded-lg bg-background/50 border border-dashed">
              <p className="text-sm text-muted-foreground italic">
                "{camadaConfig.textoPedagogico}"
              </p>
            </div>

            {/* Pergunta Base */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {camadaConfig.perguntaBase}
              </Label>
              
              {/* Opções sugeridas (Camada 2) */}
              {camadaConfig.opcoesSugeridas && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Origens sugeridas (opcional):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {camadaConfig.opcoesSugeridas.map((opcao) => (
                      <label
                        key={opcao}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all",
                          origensSelecionadas.includes(opcao)
                            ? "border-gold bg-gold/10"
                            : "border-border hover:border-gold/30"
                        )}
                      >
                        <Checkbox
                          checked={origensSelecionadas.includes(opcao)}
                          onCheckedChange={() => toggleOrigem(opcao)}
                        />
                        <span className="text-sm">{opcao}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Exemplos (Camada 4) */}
              {camadaConfig.exemplos && (
                <div className="p-3 rounded-lg bg-background/30">
                  <p className="text-xs text-muted-foreground mb-2">
                    Exemplos de movimentos possíveis:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {camadaConfig.exemplos.map((exemplo) => (
                      <Badge key={exemplo} variant="outline" className="text-xs">
                        {exemplo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Campo de Anotação */}
              <Textarea
                value={anotacaoAtual}
                onChange={(e) => setAnotacaoAtual(e.target.value)}
                placeholder="Registre suas percepções, sensações, impressões..."
                rows={5}
                className="resize-none bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Campo de anotação livre. Registre o que o campo revelou.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleVoltar}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            {camadaAtual === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <Button 
            onClick={handleAvancar}
            disabled={!podeAvancar}
            className="bg-gold hover:bg-gold/90 text-background"
          >
            {camadaAtual === 5 ? (
              <>
                Ver Resumo
                <Sparkles className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Avançar
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Microcopy de Fechamento */}
        {camadaAtual === 5 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground/60 italic">
              "A radiestesia não cria dependência. Ela fecha ciclos."
            </p>
          </div>
        )}
      </ContentPageLayout>
    </AppLayout>
  );
}
