// ============================================
// JARDIM DA PSIQUE - DIÁRIO ARQUETÍPICO
// ============================================
// Espaço 100% privado da usuária
// Integrado à Casa das Tecelãs

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JardimFirstExperience } from '@/components/jardim/JardimFirstExperience';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Leaf,
  Search,
  Calendar,
  CheckCircle2,
  Archive,
  Eye,
  Filter,
  Plus,
  Moon,
  Quote,
  FileText,
  PenLine,
  Sparkles,
  Compass,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useJardimPsique, JardimRegistro, TipoRegistroJardim } from '@/hooks/useJardimPsique';
import { NovaEntradaJardimModal } from '@/components/shared/NovaEntradaJardimModal';
import { cn } from '@/lib/utils';

// Mapa de nomes amigáveis para ferramentas
const FERRAMENTA_LABELS: Record<string, string> = {
  'big5-simbolico': 'Mapa dos Cinco Territórios',
  'eneagrama-feminino': 'Oráculo dos Nove Arquétipos',
  'mapa-arquetipos': 'Mapa dos Arquétipos',
  'jornada-heroina': 'Jornada da Heroína',
  '5-camadas': 'Leitura em 5 Camadas',
  'radar-eixo': 'Radar de Eixo',
  'trilha-neuroplasticidade': 'Trilha de Neuroplasticidade',
  radiestesia: 'Radiestesia',
  labirinto: 'Labirinto Oracular',
  tarot: 'Tarot Simbólico',
  sonho: 'Registro de Sonho',
  frase: 'Frase Guardada',
  fragmento: 'Fragmento de Sessão',
  reflexao: 'Reflexão Pessoal',
  oraculo: 'Tiragem de Oráculo',
};

// Configuração de tipos de registro
const TIPO_CONFIG: Record<TipoRegistroJardim, { icon: React.ElementType; label: string; color: string }> = {
  ferramenta: { icon: Compass, label: 'Ferramentas', color: 'text-purple-400' },
  sonho: { icon: Moon, label: 'Sonhos', color: 'text-indigo-400' },
  frase: { icon: Quote, label: 'Frases', color: 'text-amber-400' },
  fragmento: { icon: FileText, label: 'Fragmentos', color: 'text-blue-400' },
  oraculo: { icon: Sparkles, label: 'Oráculos', color: 'text-gold' },
  reflexao: { icon: PenLine, label: 'Reflexões', color: 'text-emerald-400' },
};

export default function JardimPsique() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [busca, setBusca] = useState('');
  const [ferramentaFiltro, setFerramentaFiltro] = useState<string>('todas');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [viewArquivados, setViewArquivados] = useState(false);
  const [modalNovaEntrada, setModalNovaEntrada] = useState(false);
  const [profileTag, setProfileTag] = useState<string | null>(null);

  // Fetch entry_archetype for personalized first experience
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('profiles')
      .select('entry_archetype')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfileTag(data?.entry_archetype || null);
      });
  }, [user?.id]);

  // Memorizar filtros para evitar recriação a cada render
  const filtros = useMemo(() => ({
    arquivado: viewArquivados,
    busca: busca || undefined,
  }), [viewArquivados, busca]);

  const { registros, loading, getFerramentasUsadas } = useJardimPsique(filtros);

  // getFerramentasUsadas já é useCallback, chamamos diretamente
  const ferramentasUsadas = getFerramentasUsadas();

  const registrosFiltrados = useMemo(() => {
    let resultado = registros;
    
    if (ferramentaFiltro !== 'todas') {
      resultado = resultado.filter((r) => r.ferramenta_chave === ferramentaFiltro);
    }
    
    if (tipoFiltro !== 'todos') {
      resultado = resultado.filter((r) => r.tipo_registro === tipoFiltro);
    }
    
    return resultado;
  }, [registros, ferramentaFiltro, tipoFiltro]);

  const renderRegistroCard = (registro: JardimRegistro) => {
    const dataFormatada = format(
      new Date(registro.data_aplicacao),
      "d 'de' MMMM",
      { locale: ptBR }
    );

    const tipoConfig = TIPO_CONFIG[registro.tipo_registro] || TIPO_CONFIG.ferramenta;
    const TipoIcon = tipoConfig.icon;

    const displayTitle = registro.titulo || 
      FERRAMENTA_LABELS[registro.ferramenta_chave] || 
      registro.ferramenta_nome;

    const previewText = registro.tipo_registro === 'ferramenta'
      ? registro.reflexao_pessoal
      : (registro.conteudo?.texto as string) || registro.reflexao_pessoal;

    return (
      <Card
        key={registro.id}
        className={cn(
          'cursor-pointer transition-all hover:border-emerald-500/50 group',
          registro.integrado && 'border-emerald-500/30 bg-emerald-500/5'
        )}
        onClick={() => navigate(`/jardim-da-psique/${registro.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <TipoIcon className={cn('w-4 h-4 flex-shrink-0', tipoConfig.color)} />
                <CardTitle className="text-base font-medium truncate">
                  {displayTitle}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {dataFormatada}
                {registro.emocao_predominante && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="italic">{registro.emocao_predominante}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {registro.integrado && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Integrado
                </Badge>
              )}
              {registro.arquivado && (
                <Badge variant="secondary" className="text-xs">
                  <Archive className="w-3 h-3 mr-1" />
                  Arquivado
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {previewText ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {previewText}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">
              {registro.tipo_registro === 'ferramenta' 
                ? 'Sem reflexão adicionada ainda' 
                : 'Sem conteúdo'}
            </p>
          )}
          <div className="flex items-center justify-end mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-3 h-3" />
              Ver registro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout>
      <ContentPageLayout
        title="Jardim da Psique"
        subtitle="Seu diário arquetípico privado — sonhos, oráculos, frases que tocaram"
        badge="100% Privado"
        badgeIcon={<Leaf className="w-4 h-4 text-emerald-500" />}
        maxWidth="4xl"
      >
        {/* Tabs por tipo de registro */}
        <Tabs
          value={tipoFiltro}
          onValueChange={setTipoFiltro}
          className="mb-6"
        >
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="todos" className="gap-2">
              <Leaf className="w-4 h-4" />
              Todos
            </TabsTrigger>
            {Object.entries(TIPO_CONFIG).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="gap-2">
                <config.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Header com filtros e botão de nova entrada */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por palavra-chave..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filtro por ferramenta (apenas quando em Ferramentas) */}
          {tipoFiltro === 'ferramenta' && ferramentasUsadas.length > 0 && (
            <Select value={ferramentaFiltro} onValueChange={setFerramentaFiltro}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por ferramenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as ferramentas</SelectItem>
                {ferramentasUsadas.map((chave) => (
                  <SelectItem key={chave} value={chave}>
                    {FERRAMENTA_LABELS[chave] || chave}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Botão nova entrada */}
          <Button
            onClick={() => setModalNovaEntrada(true)}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova entrada</span>
          </Button>
        </div>

        {/* Toggle: Ativos / Arquivados */}
        <div className="flex items-center gap-4 mb-6">
          <Tabs
            value={viewArquivados ? 'arquivados' : 'ativos'}
            onValueChange={(v) => setViewArquivados(v === 'arquivados')}
          >
            <TabsList>
              <TabsTrigger value="ativos" className="gap-2">
                <Leaf className="w-4 h-4" />
                Ativos
              </TabsTrigger>
              <TabsTrigger value="arquivados" className="gap-2">
                <Archive className="w-4 h-4" />
                Arquivados
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm text-muted-foreground">
            {registrosFiltrados.length} registro{registrosFiltrados.length !== 1 && 's'}
          </span>
        </div>

        {/* Lista de registros */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-32 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : registrosFiltrados.length === 0 ? (
          viewArquivados ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Archive className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum registro arquivado</h3>
                <p className="text-muted-foreground text-sm">Registros arquivados aparecerão aqui.</p>
              </CardContent>
            </Card>
          ) : (
            <JardimFirstExperience
              profileTag={profileTag}
              onNewEntry={() => setModalNovaEntrada(true)}
            />
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {registrosFiltrados.map(renderRegistroCard)}
          </div>
        )}

        {/* Nota de privacidade */}
        <div className="mt-8 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Este espaço é <strong>100% privado</strong>. Nenhuma terapeuta, admin ou IA tem acesso aos seus registros.
          </p>
        </div>
      </ContentPageLayout>

      {/* Botão flutuante para mobile */}
      <Button
        onClick={() => setModalNovaEntrada(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 sm:hidden"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Modal de nova entrada */}
      <NovaEntradaJardimModal
        open={modalNovaEntrada}
        onOpenChange={setModalNovaEntrada}
      />
    </AppLayout>
  );
}
