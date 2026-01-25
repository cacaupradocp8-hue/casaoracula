import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { SalvarJardimModal } from '@/components/shared/SalvarJardimModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRadiestesiaConfig } from '@/hooks/useRadiestesiaConfig';
import { 
  Layers, 
  Loader2, 
  Save, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Eye,
  Compass,
  Lock,
  Unlock,
  Heart,
  Sparkles,
  RotateCcw,
  FileText,
  Grid3X3,
  ExternalLink,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  ImageIcon,
  Repeat,
  Shield,
  TrendingUp,
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================
// ESCALA VIBRACIONAL - Integração
// ============================================================
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
  corBadge: string;
}

const CAMPOS_VIBRACIONAIS: Record<string, CampoVibracional> = {
  contracao: {
    nome: 'Campo de Contração',
    descricao: 'O campo está em retração. Há movimento de recolhimento, proteção passiva, ou paralisia. Não é erro — é mecanismo de sobrevivência. Mas pode haver estagnação se prolongado.',
    tendencia: 'contracao',
    cor: 'from-blue-900/30 to-blue-950/50',
    corBadge: 'border-blue-500/50 text-blue-400',
  },
  defesa: {
    nome: 'Campo de Defesa Ativa',
    descricao: 'O campo está mobilizado para proteção. Há energia disponível, mas direcionada para vigilância. Pode haver exaustão por hiper-alerta ou projeção em outros.',
    tendencia: 'defesa',
    cor: 'from-amber-900/30 to-amber-950/50',
    corBadge: 'border-amber-500/50 text-amber-400',
  },
  expansao: {
    nome: 'Campo de Expansão',
    descricao: 'O campo está em abertura. Há fluxo, conexão, disponibilidade para receber e doar. Atenção: expansão constante também cansa. Há pausas?',
    tendencia: 'expansao',
    cor: 'from-emerald-900/30 to-emerald-950/50',
    corBadge: 'border-emerald-500/50 text-emerald-400',
  },
};

// ============================================================
// MOVIMENTOS DO CAMPO
// ============================================================
interface MovimentoCampo {
  id: string;
  nome: string;
  descricao: string;
  cuidado: string;
  naoForcar: string;
  icone: typeof Shield;
  cor: string;
}

const MOVIMENTOS: MovimentoCampo[] = [
  {
    id: 'protecao',
    nome: 'Movimento de Proteção',
    descricao: 'O campo se recolhe para preservar. Há necessidade de limite, distância ou pausa. Não é recusa — é sobrevivência simbólica.',
    cuidado: 'Respeitar o tempo do recolhimento. Não interpretar como resistência negativa.',
    naoForcar: 'Exposição precoce, confrontação direta, ou pressa por resolução.',
    icone: Shield,
    cor: 'border-blue-500/30 bg-blue-500/10',
  },
  {
    id: 'repeticao',
    nome: 'Movimento de Repetição',
    descricao: 'O campo recria padrões conhecidos. Há segurança na familiaridade, mesmo quando dolorosa. Repetir é tentar resolver o que ainda não foi integrado.',
    cuidado: 'Identificar a função do padrão antes de tentar interrompê-lo.',
    naoForcar: 'Quebra abrupta de ciclos, julgamento moral sobre a repetição.',
    icone: Repeat,
    cor: 'border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'expansao',
    nome: 'Movimento de Expansão',
    descricao: 'O campo busca crescimento, abertura, novas possibilidades. Há disponibilidade para mudança. Mas expansão sem ancoragem pode dispersar.',
    cuidado: 'Sustentar a expansão com práticas de integração. Celebrar sem dissipação.',
    naoForcar: 'Acelerar demais o processo, ignorar necessidades de descanso.',
    icone: TrendingUp,
    cor: 'border-emerald-500/30 bg-emerald-500/10',
  },
];

// ============================================================
// CONFIGURAÇÃO DAS 5 CAMADAS INTEGRADAS
// ============================================================
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
    perguntaBase: 'Como este campo se apresenta agora?',
  },
  {
    numero: 2,
    titulo: 'Camada 2 — Frequência Simbólica',
    simbolo: '🜁',
    icone: Activity,
    cor: 'from-blue-500/20 to-blue-600/10',
    corBorda: 'border-blue-500/30',
    objetivo: 'Identificar a faixa vibracional do campo a partir da emoção.',
    textoPedagogico: 'Nenhuma emoção é "baixa" ou "alta". São estados — cada um com sua função. A escala lê tendências narrativas, não frequências absolutas.',
    perguntaBase: 'Qual o tom vibracional presente?',
  },
  {
    numero: 3,
    titulo: 'Camada 3 — Imagem / Símbolo Ativo',
    simbolo: '🜄',
    icone: ImageIcon,
    cor: 'from-indigo-500/20 to-indigo-600/10',
    corBorda: 'border-indigo-500/30',
    objetivo: 'Identificar a imagem ou símbolo que representa o campo.',
    textoPedagogico: 'A imagem que surge não é ilustração — é linguagem. Ela revela o que palavras ainda não alcançaram.',
    perguntaBase: 'Qual imagem ou símbolo representa este campo?',
  },
  {
    numero: 4,
    titulo: 'Camada 4 — Movimento do Campo',
    simbolo: '🜃',
    icone: Compass,
    cor: 'from-amber-500/20 to-amber-600/10',
    corBorda: 'border-amber-500/30',
    objetivo: 'Identificar qual movimento está ativo no campo.',
    textoPedagogico: 'O campo sempre está em movimento. Reconhecer o movimento é o primeiro passo para não violentá-lo.',
    perguntaBase: 'Qual movimento está ativo agora?',
  },
  {
    numero: 5,
    titulo: 'Camada 5 — Direção de Travessia',
    simbolo: '🌑',
    icone: Heart,
    cor: 'from-rose-500/20 to-rose-600/10',
    corBorda: 'border-rose-500/30',
    objetivo: 'Fechar o ciclo da leitura com responsabilidade.',
    textoPedagogico: 'A leitura não encerra o processo. Ela indica por onde o cuidado pode seguir.',
    perguntaBase: 'O que este campo pede agora?',
  },
];

type CamadaNumero = 1 | 2 | 3 | 4 | 5;

interface RespostaCamada {
  anotacao: string;
  emocao?: string;
  sensacaoCorporal?: string;
  situacao?: string;
  campoVibracional?: string;
  imagemSimbolo?: string;
  simboloRecorrente?: string;
  sensacaoImagetica?: string;
  movimentoAtivo?: string;
  oquePede?: string;
  oqueSustentar?: string;
  oqueNaoMexer?: string;
  graficosSelecionados?: string[];
  timestamp: string;
}

// Função simbólica mapping
const FUNCOES_SIMBOLICAS: Record<string, string> = {
  campo: 'Leitura de Campo',
  leitura: 'Leitura de Campo',
  limpeza: 'Limpeza Energética',
  harmonizacao: 'Harmonização',
  amplificacao: 'Amplificação',
  protecao: 'Proteção',
  diagnostico: 'Diagnóstico Simbólico',
  frequencia: 'Frequência',
  narrativa: 'Narrativa',
  apoio: 'Apoio',
};

export default function Leitura5Camadas() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { graficos } = useRadiestesiaConfig();
  
  const clienteId = searchParams.get('cliente');
  const [clienteInfo, setClienteInfo] = useState<{ id: string; nome: string } | null>(null);
  
  const [camadaAtual, setCamadaAtual] = useState<CamadaNumero>(1);
  const [respostas, setRespostas] = useState<Record<number, RespostaCamada>>({});
  const [saving, setSaving] = useState(false);
  const [mostrarResumo, setMostrarResumo] = useState(false);
  const [showJardimModal, setShowJardimModal] = useState(false);
  const isUsoPessoal = !clienteId;

  // Estados específicos por camada
  // Camada 1
  const [emocaoSelecionada, setEmocaoSelecionada] = useState('');
  const [sensacaoCorporal, setSensacaoCorporal] = useState('');
  const [situacaoAtivadora, setSituacaoAtivadora] = useState('');
  const [anotacaoCampo, setAnotacaoCampo] = useState('');
  
  // Camada 2 - derivada da emoção
  const [anotacaoFrequencia, setAnotacaoFrequencia] = useState('');
  
  // Camada 3
  const [imagemSimbolo, setImagemSimbolo] = useState('');
  const [simboloRecorrente, setSimboloRecorrente] = useState('');
  const [sensacaoImagetica, setSensacaoImagetica] = useState('');
  
  // Camada 4
  const [movimentoSelecionado, setMovimentoSelecionado] = useState('');
  const [anotacaoMovimento, setAnotacaoMovimento] = useState('');
  
  // Camada 5
  const [oquePede, setOquePede] = useState('');
  const [oqueSustentar, setOqueSustentar] = useState('');
  const [oqueNaoMexer, setOqueNaoMexer] = useState('');
  const [graficosSelecionados, setGraficosSelecionados] = useState<string[]>([]);

  const camadaConfig = CAMADAS[camadaAtual - 1];
  const emocaoObj = EMOCOES.find(e => e.id === emocaoSelecionada);
  const campoVibracional = emocaoObj ? CAMPOS_VIBRACIONAIS[emocaoObj.grupo] : null;
  const movimentoAtivo = MOVIMENTOS.find(m => m.id === movimentoSelecionado);

  // Gráficos sugeridos (ativos)
  const graficosSugeridos = graficos.filter(g => g.ativo).slice(0, 8);

  useEffect(() => {
    if (clienteId) {
      fetchCliente();
    }
  }, [clienteId]);

  // Restaurar estado ao voltar para uma camada
  useEffect(() => {
    const respostaSalva = respostas[camadaAtual];
    if (respostaSalva) {
      if (camadaAtual === 1) {
        setEmocaoSelecionada(respostaSalva.emocao || '');
        setSensacaoCorporal(respostaSalva.sensacaoCorporal || '');
        setSituacaoAtivadora(respostaSalva.situacao || '');
        setAnotacaoCampo(respostaSalva.anotacao || '');
      } else if (camadaAtual === 2) {
        setAnotacaoFrequencia(respostaSalva.anotacao || '');
      } else if (camadaAtual === 3) {
        setImagemSimbolo(respostaSalva.imagemSimbolo || '');
        setSimboloRecorrente(respostaSalva.simboloRecorrente || '');
        setSensacaoImagetica(respostaSalva.sensacaoImagetica || '');
      } else if (camadaAtual === 4) {
        setMovimentoSelecionado(respostaSalva.movimentoAtivo || '');
        setAnotacaoMovimento(respostaSalva.anotacao || '');
      } else if (camadaAtual === 5) {
        setOquePede(respostaSalva.oquePede || '');
        setOqueSustentar(respostaSalva.oqueSustentar || '');
        setOqueNaoMexer(respostaSalva.oqueNaoMexer || '');
        setGraficosSelecionados(respostaSalva.graficosSelecionados || []);
      }
    }
  }, [camadaAtual]);

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
    let resposta: RespostaCamada = {
      anotacao: '',
      timestamp: new Date().toISOString(),
    };

    if (camadaAtual === 1) {
      resposta = {
        ...resposta,
        anotacao: anotacaoCampo,
        emocao: emocaoSelecionada,
        sensacaoCorporal,
        situacao: situacaoAtivadora,
        campoVibracional: emocaoObj?.grupo || '',
      };
    } else if (camadaAtual === 2) {
      resposta = {
        ...resposta,
        anotacao: anotacaoFrequencia,
        campoVibracional: emocaoObj?.grupo || '',
      };
    } else if (camadaAtual === 3) {
      resposta = {
        ...resposta,
        anotacao: imagemSimbolo,
        imagemSimbolo,
        simboloRecorrente,
        sensacaoImagetica,
      };
    } else if (camadaAtual === 4) {
      resposta = {
        ...resposta,
        anotacao: anotacaoMovimento,
        movimentoAtivo: movimentoSelecionado,
      };
    } else if (camadaAtual === 5) {
      resposta = {
        ...resposta,
        anotacao: [oquePede, oqueSustentar, oqueNaoMexer].filter(Boolean).join('\n\n'),
        oquePede,
        oqueSustentar,
        oqueNaoMexer,
        graficosSelecionados,
      };
    }

    setRespostas(prev => ({
      ...prev,
      [camadaAtual]: resposta,
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
      const { data: ferramenta } = await supabase
        .from('sala_ferramentas')
        .select('id')
        .eq('ferramenta_chave', 'radiestesia')
        .single();

      if (ferramenta) {
        const dadosLeitura = JSON.parse(JSON.stringify({
          tipo: 'leitura_5_camadas_integrada',
          versao: 2,
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

      // Se for uso pessoal, oferecer salvar no Jardim
      if (isUsoPessoal) {
        setShowJardimModal(true);
      } else if (clienteId) {
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
    setEmocaoSelecionada('');
    setSensacaoCorporal('');
    setSituacaoAtivadora('');
    setAnotacaoCampo('');
    setAnotacaoFrequencia('');
    setImagemSimbolo('');
    setSimboloRecorrente('');
    setSensacaoImagetica('');
    setMovimentoSelecionado('');
    setAnotacaoMovimento('');
    setOquePede('');
    setOqueSustentar('');
    setOqueNaoMexer('');
    setGraficosSelecionados([]);
    setCamadaAtual(1);
    setMostrarResumo(false);
  };

  const gerarResumoTexto = () => {
    const linhas: string[] = [];
    
    // Camada 1
    const r1 = respostas[1];
    if (r1) {
      linhas.push(`🜂 CAMADA 1 — CAMPO ATUAL`);
      if (r1.emocao) linhas.push(`Emoção: ${EMOCOES.find(e => e.id === r1.emocao)?.label}`);
      if (r1.sensacaoCorporal) linhas.push(`Sensação corporal: ${r1.sensacaoCorporal}`);
      if (r1.situacao) linhas.push(`Situação: ${r1.situacao}`);
      if (r1.anotacao) linhas.push(`Notas: ${r1.anotacao}`);
    }
    
    // Camada 2
    const r2 = respostas[2];
    if (r2) {
      linhas.push(`\n🜁 CAMADA 2 — FREQUÊNCIA SIMBÓLICA`);
      if (r2.campoVibracional) linhas.push(`Campo: ${CAMPOS_VIBRACIONAIS[r2.campoVibracional]?.nome}`);
      if (r2.anotacao) linhas.push(`Notas: ${r2.anotacao}`);
    }
    
    // Camada 3
    const r3 = respostas[3];
    if (r3) {
      linhas.push(`\n🜄 CAMADA 3 — IMAGEM / SÍMBOLO`);
      if (r3.imagemSimbolo) linhas.push(`Imagem: ${r3.imagemSimbolo}`);
      if (r3.simboloRecorrente) linhas.push(`Símbolo recorrente: ${r3.simboloRecorrente}`);
      if (r3.sensacaoImagetica) linhas.push(`Sensação imagética: ${r3.sensacaoImagetica}`);
    }
    
    // Camada 4
    const r4 = respostas[4];
    if (r4) {
      linhas.push(`\n🜃 CAMADA 4 — MOVIMENTO DO CAMPO`);
      if (r4.movimentoAtivo) linhas.push(`Movimento: ${MOVIMENTOS.find(m => m.id === r4.movimentoAtivo)?.nome}`);
      if (r4.anotacao) linhas.push(`Notas: ${r4.anotacao}`);
    }
    
    // Camada 5
    const r5 = respostas[5];
    if (r5) {
      linhas.push(`\n🌑 CAMADA 5 — DIREÇÃO DE TRAVESSIA`);
      if (r5.oquePede) linhas.push(`O que pede: ${r5.oquePede}`);
      if (r5.oqueSustentar) linhas.push(`O que sustentar: ${r5.oqueSustentar}`);
      if (r5.oqueNaoMexer) linhas.push(`O que não mexer: ${r5.oqueNaoMexer}`);
      if (r5.graficosSelecionados?.length) {
        const nomes = r5.graficosSelecionados.map(id => graficos.find(g => g.id === id)?.nome || id).join(', ');
        linhas.push(`Gráficos: ${nomes}`);
      }
    }
    
    return linhas.join('\n');
  };

  const toggleGrafico = (graficoId: string) => {
    setGraficosSelecionados(prev => 
      prev.includes(graficoId) 
        ? prev.filter(g => g !== graficoId)
        : [...prev, graficoId]
    );
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'expansao': return <ArrowUp className="w-5 h-5 text-emerald-400" />;
      case 'contracao': return <ArrowDown className="w-5 h-5 text-blue-400" />;
      case 'defesa': return <Minus className="w-5 h-5 text-amber-400" />;
    }
  };

  // Validação por camada
  const podeAvancar = () => {
    if (camadaAtual === 1) return emocaoSelecionada.length > 0;
    if (camadaAtual === 2) return true; // Só visualização
    if (camadaAtual === 3) return imagemSimbolo.trim().length > 0;
    if (camadaAtual === 4) return movimentoSelecionado.length > 0;
    if (camadaAtual === 5) return oquePede.trim().length > 0;
    return true;
  };

  // ============================================================
  // TELA DE RESUMO
  // ============================================================
  if (mostrarResumo) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Resumo da Leitura"
          subtitle="Leitura Simbólica Integrada"
          badge="5 Camadas"
          badgeIcon={<Layers className="w-4 h-4 text-gold" />}
          onBack={handleVoltar}
          backLabel="Revisar Camadas"
          showNavigation={false}
          maxWidth="2xl"
        >
          {clienteInfo && (
            <Card className="border-gold/30 bg-gold/5">
              <CardContent className="py-4">
                <p className="text-sm">
                  Leitura para: <strong>{clienteInfo.nome}</strong>
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-background to-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                Leitura em 5 Camadas — Integrada
              </CardTitle>
              <CardDescription>
                Escala Vibracional + Símbolo + Movimento + Travessia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camada 1 */}
              {respostas[1] && (
                <div className="p-4 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🜂</span>
                    <h4 className="font-medium text-sm">Camada 1 — Campo Atual</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {respostas[1].emocao && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{EMOCOES.find(e => e.id === respostas[1].emocao)?.label}</Badge>
                      </div>
                    )}
                    {respostas[1].sensacaoCorporal && (
                      <p className="text-muted-foreground">Sensação: {respostas[1].sensacaoCorporal}</p>
                    )}
                    {respostas[1].situacao && (
                      <p className="text-muted-foreground">Situação: {respostas[1].situacao}</p>
                    )}
                    {respostas[1].anotacao && (
                      <p className="text-foreground/90 italic">"{respostas[1].anotacao}"</p>
                    )}
                  </div>
                </div>
              )}

              {/* Camada 2 - Frequência */}
              {respostas[2] && campoVibracional && (
                <div className={cn("p-4 rounded-lg border", "border-blue-500/30", "bg-gradient-to-br", campoVibracional.cor)}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🜁</span>
                    <h4 className="font-medium text-sm">Camada 2 — Frequência Simbólica</h4>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTendenciaIcon(campoVibracional.tendencia)}
                    <span className="font-medium">{campoVibracional.nome}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{campoVibracional.descricao}</p>
                  {respostas[2].anotacao && (
                    <p className="text-sm text-foreground/90 italic mt-2">"{respostas[2].anotacao}"</p>
                  )}
                </div>
              )}

              {/* Camada 3 - Símbolo */}
              {respostas[3] && (
                <div className="p-4 rounded-lg border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🜄</span>
                    <h4 className="font-medium text-sm">Camada 3 — Imagem / Símbolo</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    {respostas[3].imagemSimbolo && (
                      <p className="text-foreground font-medium">"{respostas[3].imagemSimbolo}"</p>
                    )}
                    {respostas[3].simboloRecorrente && (
                      <p className="text-muted-foreground">Símbolo recorrente: {respostas[3].simboloRecorrente}</p>
                    )}
                    {respostas[3].sensacaoImagetica && (
                      <p className="text-muted-foreground italic">Sensação: {respostas[3].sensacaoImagetica}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Camada 4 - Movimento */}
              {respostas[4] && movimentoAtivo && (
                <div className={cn("p-4 rounded-lg border", movimentoAtivo.cor)}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🜃</span>
                    <h4 className="font-medium text-sm">Camada 4 — Movimento do Campo</h4>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <movimentoAtivo.icone className="w-5 h-5" />
                    <span className="font-medium">{movimentoAtivo.nome}</span>
                  </div>
                  {respostas[4].anotacao && (
                    <p className="text-sm text-foreground/90 italic mt-2">"{respostas[4].anotacao}"</p>
                  )}
                </div>
              )}

              {/* Camada 5 - Travessia */}
              {respostas[5] && (
                <div className="p-4 rounded-lg border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-600/5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🌑</span>
                    <h4 className="font-medium text-sm">Camada 5 — Direção de Travessia</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    {respostas[5].oquePede && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">O que o campo pede:</p>
                        <p className="text-foreground">{respostas[5].oquePede}</p>
                      </div>
                    )}
                    {respostas[5].oqueSustentar && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">O que pode ser sustentado:</p>
                        <p className="text-foreground">{respostas[5].oqueSustentar}</p>
                      </div>
                    )}
                    {respostas[5].oqueNaoMexer && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">O que não deve ser mexido:</p>
                        <p className="text-foreground">{respostas[5].oqueNaoMexer}</p>
                      </div>
                    )}
                    {respostas[5].graficosSelecionados && respostas[5].graficosSelecionados.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-2">Gráficos selecionados:</p>
                        <div className="flex flex-wrap gap-1">
                          {respostas[5].graficosSelecionados.map((id) => {
                            const grafico = graficos.find(g => g.id === id);
                            return (
                              <Badge key={id} variant="outline" className="text-xs bg-gold/10 text-gold border-gold/30">
                                {grafico?.nome || id}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Texto de Fechamento */}
          <Card className="border-muted bg-muted/10">
            <CardContent className="py-4">
              <p className="text-sm text-center text-muted-foreground italic">
                "A leitura não encerra o processo.<br/>
                Ela indica por onde o cuidado pode seguir."
              </p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                ⚠️ Esta leitura não gera interpretação automática, não sugere diagnóstico 
                e não promete resultado. É um registro da escuta simbólica conduzida pela 
                profissional.
              </p>
            </CardContent>
          </Card>

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

  // ============================================================
  // TELAS DAS CAMADAS
  // ============================================================
  return (
    <AppLayout>
      <ContentPageLayout
        title={camadaConfig.titulo}
        subtitle="Leitura Simbólica Integrada"
        badge={`Camada ${camadaAtual}/5`}
        badgeIcon={<camadaConfig.icone className="w-4 h-4 text-gold" />}
        onBack={handleVoltar}
        backLabel={camadaAtual === 1 ? 'Voltar ao Portal' : 'Camada anterior'}
        showNavigation={false}
        maxWidth="2xl"
      >
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
            const completada = !!respostas[camada.numero];
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
                  {completada && !atual ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{camada.numero}</span>
                  )}
                </div>
                {camada.numero < 5 && (
                  <div className={cn(
                    "w-4 h-0.5 mx-0.5",
                    respostas[camada.numero] ? "bg-gold" : "bg-muted-foreground/20"
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
            <Label className="text-base font-medium block">
              {camadaConfig.perguntaBase}
            </Label>

            {/* ===================== CAMADA 1: CAMPO ATUAL ===================== */}
            {camadaAtual === 1 && (
              <div className="space-y-6">
                {/* Emoção */}
                <div className="space-y-3">
                  <Label className="text-sm">Emoção predominante</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {EMOCOES.map((emocao) => (
                      <Button
                        key={emocao.id}
                        variant={emocaoSelecionada === emocao.id ? "default" : "outline"}
                        className={cn(
                          "h-auto py-2 text-sm",
                          emocaoSelecionada === emocao.id && "bg-gold hover:bg-gold/90 text-background"
                        )}
                        onClick={() => setEmocaoSelecionada(emocao.id)}
                      >
                        {emocao.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sensação Corporal */}
                <div className="space-y-2">
                  <Label className="text-sm">Sensação corporal associada (opcional)</Label>
                  <Input
                    value={sensacaoCorporal}
                    onChange={(e) => setSensacaoCorporal(e.target.value)}
                    placeholder="Ex: aperto no peito, peso nos ombros, calor no rosto..."
                    className="bg-background/50"
                  />
                </div>

                {/* Situação */}
                <div className="space-y-2">
                  <Label className="text-sm">Situação que ativa o campo (opcional)</Label>
                  <Input
                    value={situacaoAtivadora}
                    onChange={(e) => setSituacaoAtivadora(e.target.value)}
                    placeholder="Ex: conflito familiar, decisão profissional..."
                    className="bg-background/50"
                  />
                </div>

                {/* Anotação livre */}
                <div className="space-y-2">
                  <Label className="text-sm">Observações adicionais (opcional)</Label>
                  <Textarea
                    value={anotacaoCampo}
                    onChange={(e) => setAnotacaoCampo(e.target.value)}
                    placeholder="Registre outras percepções sobre o campo atual..."
                    rows={3}
                    className="resize-none bg-background/50"
                  />
                </div>
              </div>
            )}

            {/* ===================== CAMADA 2: FREQUÊNCIA SIMBÓLICA ===================== */}
            {camadaAtual === 2 && (
              <div className="space-y-6">
                {emocaoSelecionada && campoVibracional ? (
                  <>
                    {/* Campo Vibracional */}
                    <Card className={cn(
                      "bg-gradient-to-br border-0 relative overflow-hidden",
                      campoVibracional.cor
                    )}>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
                      <CardContent className="relative py-6 space-y-4">
                        <div className="flex items-center gap-3">
                          {getTendenciaIcon(campoVibracional.tendencia)}
                          <span className="text-xl font-medium">{campoVibracional.nome}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn("w-fit", campoVibracional.corBadge)}
                        >
                          Tendência: {campoVibracional.tendencia === 'expansao' ? 'Expansão' : 
                                      campoVibracional.tendencia === 'contracao' ? 'Contração' : 'Defesa'}
                        </Badge>
                        <p className="text-muted-foreground">
                          {campoVibracional.descricao}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Contexto da emoção */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Baseado na emoção:</span>
                      <Badge variant="outline">{emocaoObj?.label}</Badge>
                    </div>

                    {/* Anotação */}
                    <div className="space-y-2">
                      <Label className="text-sm">Observações sobre a frequência (opcional)</Label>
                      <Textarea
                        value={anotacaoFrequencia}
                        onChange={(e) => setAnotacaoFrequencia(e.target.value)}
                        placeholder="O que você percebe sobre este campo vibracional?"
                        rows={3}
                        className="resize-none bg-background/50"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Selecione uma emoção na Camada 1 para ver a frequência simbólica.</p>
                  </div>
                )}
              </div>
            )}

            {/* ===================== CAMADA 3: IMAGEM / SÍMBOLO ===================== */}
            {camadaAtual === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm">Imagem que representa o campo *</Label>
                  <Textarea
                    value={imagemSimbolo}
                    onChange={(e) => setImagemSimbolo(e.target.value)}
                    placeholder="Descreva a imagem que surge quando você escuta este campo. Pode ser uma cena, um objeto, uma paisagem, uma figura..."
                    rows={4}
                    className="resize-none bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe a imagem surgir sem forçar. Ela pode não "fazer sentido" racional.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Símbolo recorrente (opcional)</Label>
                  <Input
                    value={simboloRecorrente}
                    onChange={(e) => setSimboloRecorrente(e.target.value)}
                    placeholder="Ex: água, fogo, espelho, porta, árvore..."
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Sensação imagética (opcional)</Label>
                  <Input
                    value={sensacaoImagetica}
                    onChange={(e) => setSensacaoImagetica(e.target.value)}
                    placeholder="Ex: peso, leveza, prisão, abertura, movimento..."
                    className="bg-background/50"
                  />
                </div>
              </div>
            )}

            {/* ===================== CAMADA 4: MOVIMENTO DO CAMPO ===================== */}
            {camadaAtual === 4 && (
              <div className="space-y-6">
                <RadioGroup 
                  value={movimentoSelecionado} 
                  onValueChange={setMovimentoSelecionado}
                  className="space-y-3"
                >
                  {MOVIMENTOS.map((movimento) => (
                    <label
                      key={movimento.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all",
                        movimentoSelecionado === movimento.id
                          ? movimento.cor + " ring-2 ring-offset-2 ring-offset-background ring-gold"
                          : "border-border hover:border-gold/30 bg-background/30"
                      )}
                    >
                      <RadioGroupItem value={movimento.id} className="mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <movimento.icone className="w-5 h-5" />
                          <span className="font-medium">{movimento.nome}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{movimento.descricao}</p>
                        
                        {movimentoSelecionado === movimento.id && (
                          <div className="pt-2 space-y-2 text-sm">
                            <div className="p-2 rounded bg-background/50">
                              <span className="text-gold font-medium">⚠️ O que pede cuidado:</span>
                              <p className="text-muted-foreground mt-1">{movimento.cuidado}</p>
                            </div>
                            <div className="p-2 rounded bg-background/50">
                              <span className="text-rose-400 font-medium">🚫 O que não deve ser forçado:</span>
                              <p className="text-muted-foreground mt-1">{movimento.naoForcar}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                {movimentoSelecionado && (
                  <div className="space-y-2">
                    <Label className="text-sm">Observações sobre o movimento (opcional)</Label>
                    <Textarea
                      value={anotacaoMovimento}
                      onChange={(e) => setAnotacaoMovimento(e.target.value)}
                      placeholder="Como você percebe esse movimento neste campo específico?"
                      rows={3}
                      className="resize-none bg-background/50"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ===================== CAMADA 5: DIREÇÃO DE TRAVESSIA ===================== */}
            {camadaAtual === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm">O que este campo pede agora? *</Label>
                  <Textarea
                    value={oquePede}
                    onChange={(e) => setOquePede(e.target.value)}
                    placeholder="O que o campo está pedindo neste momento?"
                    rows={3}
                    className="resize-none bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">O que pode ser sustentado? (opcional)</Label>
                  <Textarea
                    value={oqueSustentar}
                    onChange={(e) => setOqueSustentar(e.target.value)}
                    placeholder="Quais práticas ou atitudes podem ser mantidas agora?"
                    rows={2}
                    className="resize-none bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">O que não deve ser mexido agora? (opcional)</Label>
                  <Textarea
                    value={oqueNaoMexer}
                    onChange={(e) => setOqueNaoMexer(e.target.value)}
                    placeholder="Há algo que precisa de pausa, que não deve ser tocado neste momento?"
                    rows={2}
                    className="resize-none bg-background/50"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Seção de Gráficos (Camada 5) */}
        {camadaAtual === 5 && graficosSugeridos.length > 0 && (
          <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-background">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-gold" />
                <CardTitle className="text-base">Gráficos Radiestésicos (opcional)</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Selecione gráficos compatíveis com o campo. O app organiza possibilidades, não escolhe por você.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {graficosSugeridos.map((grafico) => (
                  <label
                    key={grafico.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      graficosSelecionados.includes(grafico.id)
                        ? "border-gold bg-gold/10"
                        : "border-border hover:border-gold/30 bg-background/50"
                    )}
                  >
                    <Checkbox
                      checked={graficosSelecionados.includes(grafico.id)}
                      onCheckedChange={() => toggleGrafico(grafico.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{grafico.nome}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {grafico.categoria}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {FUNCOES_SIMBOLICAS[grafico.tipo_leitura] || grafico.tipo_leitura}
                        </Badge>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground italic">
                  Uso sugerido: Clínico, Oracular ou Estudo simbólico.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/radiestesia/graficos')}
                  className="text-xs text-gold"
                >
                  Ver Catálogo
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navegação */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleVoltar}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            {camadaAtual === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <Button 
            onClick={handleAvancar}
            disabled={!podeAvancar()}
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
            "A leitura não encerra o processo. Ela indica por onde o cuidado pode seguir."
            </p>
          </div>
        )}

        {/* Modal Jardim da Psique - apenas para uso pessoal */}
        <SalvarJardimModal
          open={showJardimModal}
          onOpenChange={setShowJardimModal}
          ferramenta_nome="Leitura em 5 Camadas"
          ferramenta_chave="radiestesia_5_camadas"
          tipo_registro="ferramenta"
          conteudo={{
            camadas: respostas,
            emocao: emocaoSelecionada,
            campo_vibracional: campoVibracional?.nome,
            imagem_simbolo: imagemSimbolo,
            movimento: movimentoAtivo?.nome,
            o_que_pede: oquePede,
            o_que_sustentar: oqueSustentar,
            o_que_nao_mexer: oqueNaoMexer,
          }}
          resultado_simbolico={{
            campo: campoVibracional?.nome,
            movimento: movimentoAtivo?.nome,
            emocao: EMOCOES.find(e => e.id === emocaoSelecionada)?.label,
            imagem: imagemSimbolo,
          }}
          onSaved={() => {
            toast({ title: 'Salvo no Jardim da Psique!' });
            navigate('/jardim-da-psique');
          }}
          onSkipped={() => navigate('/radiestesia')}
        />
      </ContentPageLayout>
    </AppLayout>
  );
}
