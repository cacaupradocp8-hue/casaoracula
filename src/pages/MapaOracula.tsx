import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ArrowLeft, User, Brain, Compass, BookOpen, RefreshCw, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Big5Registro {
  id: string;
  abertura: number;
  conscienciosidade: number;
  extroversao: number;
  amabilidade: number;
  neuroticismo: number;
  notas: string | null;
  created_at: string;
}

interface EneagramaRegistro {
  id: string;
  tipo_principal: number;
  asa: number | null;
  instinto: string | null;
  defesas: string | null;
  virtude: string | null;
  created_at: string;
}

interface CasoInfo {
  id: string;
  codinome: string;
  cliente_id: string;
}

// Arquétipos expandidos com campos do Phase 3
const arquetiposMap: Record<number, { 
  nome: string; 
  descricao: string; 
  defesa: string;
  padraoNarrativo: string;
  convite: string;
  gesto: string;
}> = {
  1: { 
    nome: 'O Reformador', 
    descricao: 'Busca perfeição e integridade',
    defesa: 'perfeccionismo e autocrítica',
    padraoNarrativo: 'um ciclo de esforço constante para corrigir imperfeições',
    convite: 'Aceitar a imperfeição como parte do ser',
    gesto: 'permitir um erro pequeno sem tentar consertá-lo'
  },
  2: { 
    nome: 'O Ajudante', 
    descricao: 'Nutre através do amor',
    defesa: 'negação das próprias necessidades',
    padraoNarrativo: 'um padrão de doar-se até esvaziar',
    convite: 'Reconhecer as próprias necessidades',
    gesto: 'pedir algo para si mesma'
  },
  3: { 
    nome: 'O Realizador', 
    descricao: 'Busca sucesso e reconhecimento',
    defesa: 'identificação com conquistas',
    padraoNarrativo: 'um padrão de medir valor por resultados externos',
    convite: 'Descobrir o valor intrínseco além das conquistas',
    gesto: 'descansar sem produzir nada'
  },
  4: { 
    nome: 'O Individualista', 
    descricao: 'Busca autenticidade e profundidade',
    defesa: 'interiorização e melancolia',
    padraoNarrativo: 'um padrão de sentir-se incompreendida',
    convite: 'Encontrar beleza no ordinário',
    gesto: 'apreciar algo simples do cotidiano'
  },
  5: { 
    nome: 'O Investigador', 
    descricao: 'Busca conhecimento e compreensão',
    defesa: 'isolamento e acúmulo de conhecimento',
    padraoNarrativo: 'um padrão de observar sem participar',
    convite: 'Participar da vida além da observação',
    gesto: 'compartilhar algo pessoal com alguém'
  },
  6: { 
    nome: 'O Lealista', 
    descricao: 'Busca segurança e orientação',
    defesa: 'dúvida e busca de garantias',
    padraoNarrativo: 'um padrão de antecipar perigos invisíveis',
    convite: 'Confiar na própria sabedoria interior',
    gesto: 'agir sem esperar certeza absoluta'
  },
  7: { 
    nome: 'O Entusiasta', 
    descricao: 'Busca liberdade e experiências',
    defesa: 'fuga para o próximo prazer',
    padraoNarrativo: 'um padrão de evitar a dor através da distração',
    convite: 'Encontrar plenitude no momento presente',
    gesto: 'permanecer com um desconforto por alguns minutos'
  },
  8: { 
    nome: 'O Desafiador', 
    descricao: 'Busca poder e proteção',
    defesa: 'controle e proteção excessiva',
    padraoNarrativo: 'um padrão de confrontar antes de ser ferida',
    convite: 'Permitir a vulnerabilidade como força',
    gesto: 'mostrar vulnerabilidade a alguém de confiança'
  },
  9: { 
    nome: 'O Pacificador', 
    descricao: 'Busca paz e harmonia',
    defesa: 'dormência e fusão',
    padraoNarrativo: 'um padrão de apagar a própria voz',
    convite: 'Despertar a própria voz e presença',
    gesto: 'expressar uma preferência clara'
  },
};

// Identificar o traço Big5 dominante
const getTracoDominante = (big5: Big5Registro) => {
  const tracos = [
    { nome: 'Abertura', valor: big5.abertura, descricao: 'abertura ao novo' },
    { nome: 'Conscienciosidade', valor: big5.conscienciosidade, descricao: 'organização e disciplina' },
    { nome: 'Extroversão', valor: big5.extroversao, descricao: 'energia social' },
    { nome: 'Amabilidade', valor: big5.amabilidade, descricao: 'empatia e cooperação' },
    { nome: 'Neuroticismo', valor: big5.neuroticismo, descricao: 'sensibilidade emocional' }
  ];
  
  return tracos.reduce((max, t) => t.valor > max.valor ? t : max);
};

// Template exato do Phase 3
const getNarrativaEstruturada = (big5: Big5Registro, eneagrama: EneagramaRegistro) => {
  const arquetipo = arquetiposMap[eneagrama.tipo_principal];
  if (!arquetipo) return null;

  const tracoDominante = getTracoDominante(big5);
  
  return `Quando a ${tracoDominante.descricao} se intensifica, a defesa do Tipo ${eneagrama.tipo_principal} (${arquetipo.defesa}) tende a dominar; isso ativa ${arquetipo.nome} e produz ${arquetipo.padraoNarrativo}. O convite da alma é ${arquetipo.convite.toLowerCase()}, e o primeiro gesto possível é ${arquetipo.gesto}.`;
};

// Narrativa poética complementar (preservada)
const getNarrativaPoetica = (big5: Big5Registro, eneagrama: EneagramaRegistro) => {
  const arquetipo = arquetiposMap[eneagrama.tipo_principal];
  if (!arquetipo) return null;

  const narrativas: string[] = [];

  // Baseado no Big5
  if (big5.abertura > 70) {
    narrativas.push('Uma alma que dança com o desconhecido, abrindo portais para mundos inexplorados.');
  } else if (big5.abertura < 30) {
    narrativas.push('Uma presença que encontra sabedoria nas raízes e tradições ancestrais.');
  }

  if (big5.neuroticismo > 70) {
    narrativas.push('Carrega a sensibilidade de quem sente o mundo com intensidade — um dom que pede cuidado.');
  } else if (big5.neuroticismo < 30) {
    narrativas.push('Possui a âncora interior de quem navega mares turbulentos com serenidade.');
  }

  if (big5.extroversao > 70) {
    narrativas.push('Sua energia irradia como sol, iluminando e aquecendo quem está por perto.');
  } else if (big5.extroversao < 30) {
    narrativas.push('Encontra força no silêncio interior, como uma fonte profunda e inesgotável.');
  }

  // Baseado no Eneagrama
  narrativas.push(`${arquetipo.nome}: ${arquetipo.descricao}.`);
  
  if (eneagrama.instinto === 'autopreservacao') {
    narrativas.push('O instinto de autopreservação tece uma teia de segurança ao redor de seu mundo interior.');
  } else if (eneagrama.instinto === 'sexual') {
    narrativas.push('O instinto sexual busca conexões que transformam e intensificam a experiência de estar vivo.');
  } else if (eneagrama.instinto === 'social') {
    narrativas.push('O instinto social encontra significado na teia de relações e pertencimento comunitário.');
  }

  return narrativas.join(' ');
};

const getConviteDaAlma = (big5: Big5Registro, eneagrama: EneagramaRegistro) => {
  const arquetipo = arquetiposMap[eneagrama.tipo_principal];
  if (!arquetipo) return '';

  const convites: string[] = [arquetipo.convite];

  // Adicionar convites baseados no Big5
  if (big5.conscienciosidade < 40 && big5.neuroticismo > 60) {
    convites.push('Cultivar rituais de autocuidado que ancorem a alma ao corpo.');
  }
  
  if (big5.amabilidade > 80 && big5.extroversao > 60) {
    convites.push('Reservar espaços sagrados de solitude para ouvir a própria voz.');
  }

  if (big5.abertura > 70 && big5.conscienciosidade < 40) {
    convites.push('Transformar visões em realidade através de pequenos passos concretos.');
  }

  return convites.join(' ');
};

export default function MapaOracula() {
  const [searchParams] = useSearchParams();
  const casoId = searchParams.get('caso');

  const [loading, setLoading] = useState(true);
  const [casos, setCasos] = useState<CasoInfo[]>([]);
  const [selectedCaso, setSelectedCaso] = useState<string>(casoId || '');
  const [big5Registro, setBig5Registro] = useState<Big5Registro | null>(null);
  const [eneagramaRegistro, setEneagramaRegistro] = useState<EneagramaRegistro | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCasos();
  }, [user]);

  useEffect(() => {
    if (selectedCaso) {
      fetchRegistros();
    } else {
      fetchSelfData();
    }
  }, [selectedCaso, user]);

  const fetchCasos = async () => {
    const { data } = await supabase
      .from('casos')
      .select('id, codinome, cliente_id')
      .eq('terapeuta_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setCasos(data);
    setLoading(false);
  };

  const fetchSelfData = async () => {
    if (!user) return;
    setLoading(true);

    const [big5Res, eneagramaRes] = await Promise.all([
      supabase
        .from('big5_registros')
        .select('id, abertura, conscienciosidade, extroversao, amabilidade, neuroticismo, notas, created_at')
        .eq('user_id', user.id)
        .is('caso_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('eneagrama_registros')
        .select('id, tipo_principal, asa, instinto, defesas, virtude, created_at')
        .eq('user_id', user.id)
        .is('caso_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    setBig5Registro(big5Res.data);
    setEneagramaRegistro(eneagramaRes.data);
    setLoading(false);
  };

  const fetchRegistros = async () => {
    if (!selectedCaso) return;
    setLoading(true);

    const [big5Res, eneagramaRes] = await Promise.all([
      supabase
        .from('big5_registros')
        .select('id, abertura, conscienciosidade, extroversao, amabilidade, neuroticismo, notas, created_at')
        .eq('caso_id', selectedCaso)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('eneagrama_registros')
        .select('id, tipo_principal, asa, instinto, defesas, virtude, created_at')
        .eq('caso_id', selectedCaso)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    setBig5Registro(big5Res.data);
    setEneagramaRegistro(eneagramaRes.data);
    setLoading(false);
  };

  const hasDados = big5Registro && eneagramaRegistro;
  const arquetipo = eneagramaRegistro ? arquetiposMap[eneagramaRegistro.tipo_principal] : null;
  const tracoDominante = big5Registro ? getTracoDominante(big5Registro) : null;

  const dimensoes = [
    { key: 'abertura', label: 'Abertura', value: big5Registro?.abertura || 0 },
    { key: 'conscienciosidade', label: 'Conscienciosidade', value: big5Registro?.conscienciosidade || 0 },
    { key: 'extroversao', label: 'Extroversão', value: big5Registro?.extroversao || 0 },
    { key: 'amabilidade', label: 'Amabilidade', value: big5Registro?.amabilidade || 0 },
    { key: 'neuroticismo', label: 'Neuroticismo', value: big5Registro?.neuroticismo || 0 },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/salas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <SectionHeader
            title="Mapa Orácula"
            subtitle="Integração simbólica de Big5, Eneagrama e arquétipos"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>

        {/* Seletor de Caso */}
        <Card className="glass mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                <span className="font-medium">Visualizar dados de:</span>
              </div>
              <Select value={selectedCaso} onValueChange={setSelectedCaso}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder="Meu próprio perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Meu próprio perfil</SelectItem>
                  {casos.map(caso => (
                    <SelectItem key={caso.id} value={caso.id}>
                      {caso.codinome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={selectedCaso ? fetchRegistros : fetchSelfData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : !hasDados ? (
          <Card className="glass">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Dados insuficientes</h3>
              <p className="text-muted-foreground mb-6">
                Para gerar o Mapa Orácula, é necessário ter registros de Big Five e Eneagrama.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={selectedCaso ? `/salas/big5?caso=${selectedCaso}` : '/salas/big5'}>
                  <Button variant="outline">
                    <Brain className="w-4 h-4 mr-2" />
                    Aplicar Big Five
                  </Button>
                </Link>
                <Link to={selectedCaso ? `/salas/eneagrama?caso=${selectedCaso}` : '/salas/eneagrama'}>
                  <Button variant="outline">
                    <Compass className="w-4 h-4 mr-2" />
                    Aplicar Eneagrama
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Arquétipo Central */}
            {arquetipo && (
              <Card className="glass border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mb-4">
                    <span className="text-4xl font-display text-gold">{eneagramaRegistro?.tipo_principal}</span>
                  </div>
                  <CardTitle className="text-2xl font-display text-gold">{arquetipo.nome}</CardTitle>
                  <p className="text-muted-foreground">{arquetipo.descricao}</p>
                  {eneagramaRegistro?.asa && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Com asa {eneagramaRegistro.asa} • {eneagramaRegistro.instinto ? `Instinto ${eneagramaRegistro.instinto}` : 'Instinto não definido'}
                    </p>
                  )}
                  {tracoDominante && (
                    <p className="text-xs text-gold/70 mt-2">
                      Traço dominante: {tracoDominante.nome} ({tracoDominante.valor}%)
                    </p>
                  )}
                </CardHeader>
              </Card>
            )}

            {/* Big5 Radar Visual */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-gold" />
                  Dimensões da Personalidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {dimensoes.map(dim => (
                    <div key={dim.key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={tracoDominante?.nome === dim.label ? 'font-medium text-gold' : ''}>
                          {dim.label}
                          {tracoDominante?.nome === dim.label && ' ★'}
                        </span>
                        <span className="font-medium text-gold">{dim.value}</span>
                      </div>
                      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-gold/60 to-gold transition-all duration-500"
                          style={{ width: `${dim.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leitura Estruturada Phase 3 */}
            <Card className="glass border-gold/40 bg-gradient-to-br from-gold/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Quote className="w-5 h-5 text-gold" />
                  Leitura Estruturada
                </CardTitle>
                <p className="text-xs text-muted-foreground">Template Phase 3 — Integração Big5 + Eneagrama + Arquétipo</p>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-gold/50 pl-4 py-2">
                  <p className="text-foreground leading-relaxed font-medium">
                    {getNarrativaEstruturada(big5Registro!, eneagramaRegistro!)}
                  </p>
                </blockquote>
              </CardContent>
            </Card>

            {/* Narrativa Poética (complementar) */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold" />
                  Narrativa Poética
                </CardTitle>
                <p className="text-xs text-muted-foreground">Leitura simbólica expandida</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed italic">
                  "{getNarrativaPoetica(big5Registro!, eneagramaRegistro!)}"
                </p>
              </CardContent>
            </Card>

            {/* Convite da Alma */}
            <Card className="glass border-gold/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  Convite da Alma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-lg font-display text-gold text-center">
                  {getConviteDaAlma(big5Registro!, eneagramaRegistro!)}
                </p>
                {arquetipo && (
                  <p className="text-sm text-muted-foreground text-center pt-2 border-t border-border/50">
                    <span className="font-medium">Primeiro gesto possível:</span> {arquetipo.gesto}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Integração Cruzada */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Leitura Integrativa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {big5Registro!.abertura > 60 && eneagramaRegistro!.tipo_principal === 4 && (
                  <p>
                    ✦ A alta abertura amplifica a busca por autenticidade do Tipo 4, criando uma alma que 
                    constantemente reinventa sua expressão no mundo.
                  </p>
                )}
                {big5Registro!.neuroticismo > 60 && [1, 6].includes(eneagramaRegistro!.tipo_principal) && (
                  <p>
                    ✦ A sensibilidade elevada intensifica a vigilância interna. O caminho de cura passa por 
                    cultivar autocompaixão e confiar no fluxo da vida.
                  </p>
                )}
                {big5Registro!.extroversao < 40 && [7, 3].includes(eneagramaRegistro!.tipo_principal) && (
                  <p>
                    ✦ Uma energia mais introvertida em um tipo naturalmente expansivo sugere uma jornada 
                    de integrar o mundo externo com a riqueza interior.
                  </p>
                )}
                {big5Registro!.amabilidade > 70 && eneagramaRegistro!.tipo_principal === 2 && (
                  <p>
                    ✦ A forte orientação para o outro revela uma alma generosa. O convite é equilibrar 
                    o cuidado com os outros e o autocuidado.
                  </p>
                )}
                {big5Registro!.conscienciosidade > 70 && eneagramaRegistro!.tipo_principal === 1 && (
                  <p>
                    ✦ A disciplina e busca por perfeição se intensificam. Celebrar o "suficientemente bom" 
                    pode ser profundamente libertador.
                  </p>
                )}
                <p className="pt-4 border-t border-border/50">
                  Este mapa é um espelho simbólico, não um diagnóstico. Use-o como ponto de partida 
                  para reflexão e autoconhecimento.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
