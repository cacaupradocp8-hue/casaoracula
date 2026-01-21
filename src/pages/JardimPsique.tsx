// ============================================
// JARDIM DA PSIQUE - LISTA DE REGISTROS
// ============================================
// Espaço 100% privado da usuária

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
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
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useJardimPsique, JardimRegistro } from '@/hooks/useJardimPsique';
import { cn } from '@/lib/utils';

// Mapa de nomes amigáveis para ferramentas
const FERRAMENTA_LABELS: Record<string, string> = {
  'big5-simbolico': 'Big5 Simbólico',
  'eneagrama-feminino': 'Eneagrama Feminino',
  'mapa-arquetipos': 'Mapa dos Arquétipos',
  'jornada-heroina': 'Jornada da Heroína',
  '5-camadas': 'Leitura em 5 Camadas',
  'radar-eixo': 'Radar de Eixo',
  'trilha-neuroplasticidade': 'Trilha de Neuroplasticidade',
  radiestesia: 'Radiestesia',
  labirinto: 'Labirinto Oracular',
  tarot: 'Tarot Simbólico',
};

export default function JardimPsique() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [ferramentaFiltro, setFerramentaFiltro] = useState<string>('todas');
  const [viewArquivados, setViewArquivados] = useState(false);

  const { registros, loading, getFerramentasUsadas } = useJardimPsique({
    arquivado: viewArquivados,
    busca: busca || undefined,
  });

  const ferramentasUsadas = useMemo(() => getFerramentasUsadas(), [getFerramentasUsadas]);

  const registrosFiltrados = useMemo(() => {
    if (ferramentaFiltro === 'todas') return registros;
    return registros.filter((r) => r.ferramenta_chave === ferramentaFiltro);
  }, [registros, ferramentaFiltro]);

  const renderRegistroCard = (registro: JardimRegistro) => {
    const dataFormatada = format(
      new Date(registro.data_aplicacao),
      "d 'de' MMMM 'de' yyyy",
      { locale: ptBR }
    );

    return (
      <Card
        key={registro.id}
        className={cn(
          'cursor-pointer transition-all hover:border-emerald-500/50',
          registro.integrado && 'border-emerald-500/30 bg-emerald-500/5'
        )}
        onClick={() => navigate(`/jardim-da-psique/${registro.id}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-medium">
                {FERRAMENTA_LABELS[registro.ferramenta_chave] || registro.ferramenta_nome}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {dataFormatada}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {registro.integrado && (
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Integrado
                </Badge>
              )}
              {registro.arquivado && (
                <Badge variant="secondary">
                  <Archive className="w-3 h-3 mr-1" />
                  Arquivado
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {registro.reflexao_pessoal ? (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {registro.reflexao_pessoal}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">
              Sem reflexão adicionada ainda
            </p>
          )}
          <div className="flex items-center justify-end mt-3">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Eye className="w-3 h-3" />
              Ver leitura
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
        subtitle="Seu espaço privado de registros e reflexões"
        badge="100% Privado"
        badgeIcon={<Leaf className="w-4 h-4 text-emerald-500" />}
        maxWidth="4xl"
      >
        {/* Header com filtros */}
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

          {/* Filtro por ferramenta */}
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
        </div>

        {/* Tabs: Ativos / Arquivados */}
        <Tabs
          value={viewArquivados ? 'arquivados' : 'ativos'}
          onValueChange={(v) => setViewArquivados(v === 'arquivados')}
          className="mb-6"
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
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Leaf className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {viewArquivados ? 'Nenhum registro arquivado' : 'Seu Jardim está vazio'}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                {viewArquivados
                  ? 'Registros arquivados aparecerão aqui.'
                  : 'Quando você aplicar uma ferramenta em si mesma e escolher salvar, sua leitura aparecerá aqui.'}
              </p>
            </CardContent>
          </Card>
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
    </AppLayout>
  );
}
