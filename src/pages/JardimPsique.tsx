// ============================================
// JARDIM DA PSIQUE - DIÁRIO ARQUETÍPICO
// ============================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JardimFirstExperience } from '@/components/jardim/JardimFirstExperience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Leaf, Search, Calendar, CheckCircle2, Archive, Eye, Filter, Plus,
  Moon, Quote, FileText, PenLine, Sparkles, Compass, Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useJardimPsique, JardimRegistro, TipoRegistroJardim } from '@/hooks/useJardimPsique';
import { NovaEntradaJardimModal } from '@/components/shared/NovaEntradaJardimModal';
import { CompartilharCanteiroBtn } from '@/components/jardim-psique/CompartilharCanteiroBtn';
import { MinhasPublicacoesCanteiro } from '@/components/jardim-psique/MinhasPublicacoesCanteiro';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('entry_archetype').eq('id', user.id).single().then(({ data }) => {
      setProfileTag(data?.entry_archetype || null);
    });
  }, [user?.id]);

  const filtros = useMemo(() => ({ arquivado: viewArquivados, busca: busca || undefined }), [viewArquivados, busca]);
  const { registros, loading, getFerramentasUsadas } = useJardimPsique(filtros);
  const ferramentasUsadas = getFerramentasUsadas();

  const registrosFiltrados = useMemo(() => {
    let resultado = registros;
    if (ferramentaFiltro !== 'todas') resultado = resultado.filter((r) => r.ferramenta_chave === ferramentaFiltro);
    if (tipoFiltro !== 'todos') resultado = resultado.filter((r) => r.tipo_registro === tipoFiltro);
    return resultado;
  }, [registros, ferramentaFiltro, tipoFiltro]);

  const renderRegistroCard = (registro: JardimRegistro, index: number) => {
    const dataFormatada = format(new Date(registro.data_aplicacao), "d 'de' MMMM", { locale: ptBR });
    const tipoConfig = TIPO_CONFIG[registro.tipo_registro] || TIPO_CONFIG.ferramenta;
    const TipoIcon = tipoConfig.icon;
    const displayTitle = registro.titulo || FERRAMENTA_LABELS[registro.ferramenta_chave] || registro.ferramenta_nome;
    const previewText = registro.tipo_registro === 'ferramenta' ? registro.reflexao_pessoal : (registro.conteudo?.texto as string) || registro.reflexao_pessoal;

    return (
      <motion.div
        key={registro.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.06 }}
      >
        <Card
          className={cn(
            'cursor-pointer transition-all duration-500 group border-border/20 bg-card/60 backdrop-blur-sm',
            'hover:border-emerald-500/30 hover:shadow-[0_8px_40px_-12px_hsl(152_60%_40%/0.2)]',
            registro.integrado && 'border-emerald-500/20 bg-emerald-500/5'
          )}
          onClick={() => navigate(`/jardim-da-psique/${registro.id}`)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-background/60', tipoConfig.color)}>
                    <TipoIcon className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-medium truncate">{displayTitle}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-10">
                  <Calendar className="w-3 h-3" />
                  {dataFormatada}
                  {registro.emocao_predominante && (
                    <>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="italic text-foreground/50">{registro.emocao_predominante}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {registro.integrado && (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 text-xs bg-emerald-500/5">
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
          <CardContent className="pl-[calc(2rem+1.25rem)]">
            {previewText ? (
              <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">{previewText}</p>
            ) : (
              <p className="text-sm text-muted-foreground/40 italic">
                {registro.tipo_registro === 'ferramenta' ? 'Sem reflexão adicionada ainda' : 'Sem conteúdo'}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <CompartilharCanteiroBtn registro={registro} />
              <span className="text-xs text-gold/0 group-hover:text-gold/60 transition-all duration-500 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Ver registro
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 max-w-4xl overflow-x-hidden">
        <PageBreadcrumb items={[{ label: 'Jardim da Psique' }]} />
        {/* ─── Hero Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          {/* Decorative icon */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
              <Leaf className="w-7 h-7 text-emerald-400" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <Lock className="w-3 h-3 text-emerald-400/60" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-400/60 font-medium">100% Privado</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-display text-foreground tracking-wide mb-3">
            Jardim da Psique
          </h1>
          
          <p className="text-foreground/60 max-w-md mx-auto leading-relaxed">
            Seu diário arquetípico privado — sonhos, oráculos, frases que tocaram
          </p>

          <div className="h-px w-24 mx-auto mt-6 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        </motion.div>

        {/* ─── Tabs by type ─── */}
        <Tabs value={tipoFiltro} onValueChange={setTipoFiltro} className="mb-6">
          <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none">
            <TabsList className="inline-flex w-max sm:flex sm:flex-wrap h-auto gap-1 bg-card/50 backdrop-blur-sm border border-border/20 p-1.5">
              <TabsTrigger value="todos" className="gap-2 data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 whitespace-nowrap">
                <Leaf className="w-4 h-4" />
                Todos
              </TabsTrigger>
              {Object.entries(TIPO_CONFIG).map(([key, config]) => (
                <TabsTrigger key={key} value={key} className="gap-2 data-[state=active]:bg-emerald-500/15 whitespace-nowrap">
                  <config.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {/* ─── Filters bar ─── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por palavra-chave..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-9 bg-card/50 border-border/20" />
          </div>

          {tipoFiltro === 'ferramenta' && ferramentasUsadas.length > 0 && (
            <Select value={ferramentaFiltro} onValueChange={setFerramentaFiltro}>
              <SelectTrigger className="w-full sm:w-[200px] bg-card/50 border-border/20">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por ferramenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as ferramentas</SelectItem>
                {ferramentasUsadas.map((chave) => (
                  <SelectItem key={chave} value={chave}>{FERRAMENTA_LABELS[chave] || chave}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button onClick={() => setModalNovaEntrada(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-[0_0_20px_-4px_hsl(152_60%_40%/0.3)]">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova entrada</span>
          </Button>
        </div>

        {/* ─── Active/Archived toggle ─── */}
        <div className="flex items-center gap-4 mb-6">
          <Tabs value={viewArquivados ? 'arquivados' : 'ativos'} onValueChange={(v) => setViewArquivados(v === 'arquivados')}>
            <TabsList className="bg-card/50 border border-border/20">
              <TabsTrigger value="ativos" className="gap-2"><Leaf className="w-4 h-4" />Ativos</TabsTrigger>
              <TabsTrigger value="arquivados" className="gap-2"><Archive className="w-4 h-4" />Arquivados</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm text-muted-foreground/60">
            {registrosFiltrados.length} registro{registrosFiltrados.length !== 1 && 's'}
          </span>
        </div>

        {/* ─── Records list ─── */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/50 border-border/20">
                <CardHeader><Skeleton className="h-5 w-48" /><Skeleton className="h-3 w-32 mt-2" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : registrosFiltrados.length === 0 ? (
          viewArquivados ? (
            <Card className="border-dashed border-border/20 bg-card/30">
              <CardContent className="py-16 text-center">
                <Archive className="w-14 h-14 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum registro arquivado</h3>
                <p className="text-muted-foreground/60 text-sm">Registros arquivados aparecerão aqui.</p>
              </CardContent>
            </Card>
          ) : (
            <JardimFirstExperience profileTag={profileTag} onNewEntry={() => setModalNovaEntrada(true)} />
          )
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {registrosFiltrados.map((r, i) => renderRegistroCard(r, i))}
          </div>
        )}

        {/* ─── Minhas Publicações no Canteiro ─── */}
        <div className="mt-10">
          <MinhasPublicacoesCanteiro />
        </div>

        {/* ─── Privacy notice ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 relative"
        >
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-emerald-500/10" />
          <div className="relative rounded-xl bg-card/40 backdrop-blur-sm border border-emerald-500/10 p-5 text-center">
            <p className="text-sm text-foreground/60">
              🔒 Este espaço é <strong className="text-emerald-400">100% privado</strong>. Nenhuma terapeuta, admin ou IA tem acesso aos seus registros.
            </p>
          </div>
        </motion.div>
      </div>

      <NovaEntradaJardimModal open={modalNovaEntrada} onOpenChange={setModalNovaEntrada} />
    </AppLayout>
  );
}
