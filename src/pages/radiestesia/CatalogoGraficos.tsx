import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRadiestesiaConfig, Grafico } from '@/hooks/useRadiestesiaConfig';
import { 
  Grid3X3, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  User,
  FileText,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Fallback graphics for when DB is empty
const GRAFICOS_FALLBACK: Grafico[] = [
  {
    id: 'decagono',
    nome: 'Decágono',
    autor: 'Tradicional',
    origem: 'tradicional',
    categoria: 'clinico',
    tipo_leitura: 'campo',
    para_que_serve: 'Harmonização geral de ambientes e campos. Equilibra energias dispersas e cria campo de proteção básico.',
    quando_nao_usar: 'Quando o campo precisa de ação direcionada específica. Não substitui trabalho terapêutico profundo.',
    observacoes_simbolicas: 'Gráfico de equilíbrio universal.',
    imagem_url: null,
    combinacoes: ['Quartzo transparente', 'Ametista', 'Chakra coronário'],
    ordem: 0,
    ativo: true,
  },
  {
    id: 'antahkarana',
    nome: 'Antahkarana',
    autor: 'Tradição Tibetana',
    origem: 'tradicional',
    categoria: 'estudo',
    tipo_leitura: 'narrativa',
    para_que_serve: 'Ponte entre personalidade e alma. Usado para meditação profunda e conexão com o Eu Superior.',
    quando_nao_usar: 'Em situações de urgência emocional. Requer estado meditativo prévio para funcionar adequadamente.',
    observacoes_simbolicas: 'Símbolo de conexão interdimensional.',
    imagem_url: null,
    combinacoes: ['Quartzo azul', 'Lápis-lazúli', 'Chakra frontal'],
    ordem: 1,
    ativo: true,
  },
  {
    id: 'flor-vida',
    nome: 'Flor da Vida',
    autor: 'Geometria Sagrada',
    origem: 'tradicional',
    categoria: 'oracular',
    tipo_leitura: 'campo',
    para_que_serve: 'Geometria sagrada de criação. Potencializa intenções, energiza cristais e alimentos.',
    quando_nao_usar: 'Para intenções de manipulação ou controle. A energia amplifica tudo — inclusive sombras.',
    observacoes_simbolicas: 'Padrão da criação universal.',
    imagem_url: null,
    combinacoes: ['Todos os cristais', 'Água', 'Chakra cardíaco'],
    ordem: 2,
    ativo: true,
  },
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'clinico', label: 'Clínico' },
  { id: 'oracular', label: 'Oracular' },
  { id: 'estudo', label: 'Estudo' },
];

const ORIGENS = {
  tradicional: { label: 'Tradicional', color: 'bg-blue-500/20 text-blue-400' },
  autoral: { label: 'Autoral', color: 'bg-purple-500/20 text-purple-400' },
  alquimico: { label: 'Alquímico', color: 'bg-gold/20 text-gold' },
};

const TIPO_LEITURA = {
  campo: 'Campo',
  frequencia: 'Frequência',
  narrativa: 'Narrativa',
  apoio: 'Apoio',
};

export default function CatalogoGraficos() {
  const navigate = useNavigate();
  const { graficos: graficosDB, isLoading } = useRadiestesiaConfig();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [graficoExpandido, setGraficoExpandido] = useState<string | null>(null);

  // Use DB data or fallback
  const graficos = graficosDB.length > 0 ? graficosDB : GRAFICOS_FALLBACK;

  const graficosFiltrados = graficos.filter((g) => {
    const matchBusca = g.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       (g.para_que_serve?.toLowerCase().includes(busca.toLowerCase()) ?? false) ||
                       (g.autor?.toLowerCase().includes(busca.toLowerCase()) ?? false);
    const matchCategoria = categoriaAtiva === 'todos' || g.categoria === categoriaAtiva;
    return matchBusca && matchCategoria && g.ativo;
  });

  if (isLoading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Catálogo de Gráficos Radiestésicos"
          subtitle="Estudo e uso consciente de gráficos radiónicos"
          badge="Ferramenta Pedagógica"
          badgeIcon={<Grid3X3 className="w-4 h-4 text-gold" />}
          onBack={() => navigate('/radiestesia')}
          backLabel="Voltar ao Portal"
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ContentPageLayout
        title="Catálogo de Gráficos Radiestésicos"
        subtitle="Estudo e uso consciente de gráficos radiónicos"
        badge="Ferramenta Pedagógica"
        badgeIcon={<Grid3X3 className="w-4 h-4 text-gold" />}
        onBack={() => navigate('/radiestesia')}
        backLabel="Voltar ao Portal"
        maxWidth="4xl"
      >
        {/* Introdução */}
        <Card className="bg-gradient-to-br from-blue-900/20 to-background border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-foreground">
                  Este catálogo é uma <strong>ferramenta pedagógica</strong>, não uma galeria decorativa.
                </p>
                <p className="text-sm text-muted-foreground">
                  Cada gráfico contém orientações de uso, contraindicações e possíveis combinações. 
                  Estude antes de usar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Busca e Filtros */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar gráfico por nome ou autor..."
              className="pl-10"
            />
          </div>

          <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva}>
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-background/50">
              {CATEGORIAS.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="text-sm">
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Contador */}
        <p className="text-sm text-muted-foreground">
          {graficosFiltrados.length} gráfico(s) encontrado(s)
        </p>

        {/* Lista de Gráficos */}
        <div className="space-y-4">
          {graficosFiltrados.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum gráfico encontrado com esses critérios.
              </CardContent>
            </Card>
          ) : (
            graficosFiltrados.map((grafico) => (
              <Card 
                key={grafico.id}
                className={cn(
                  "transition-all cursor-pointer",
                  graficoExpandido === grafico.id && "border-gold/50"
                )}
                onClick={() => setGraficoExpandido(
                  graficoExpandido === grafico.id ? null : grafico.id
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Imagem ou placeholder */}
                      {grafico.imagem_url ? (
                        <img 
                          src={grafico.imagem_url} 
                          alt={grafico.nome}
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center border">
                          <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg">{grafico.nome}</CardTitle>
                        {grafico.autor && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            {grafico.autor}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge className={cn("text-xs", ORIGENS[grafico.origem as keyof typeof ORIGENS]?.color || ORIGENS.tradicional.color)}>
                            {ORIGENS[grafico.origem as keyof typeof ORIGENS]?.label || grafico.origem}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {TIPO_LEITURA[grafico.tipo_leitura as keyof typeof TIPO_LEITURA] || grafico.tipo_leitura}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Eye className={cn(
                      "w-5 h-5 transition-transform",
                      graficoExpandido === grafico.id ? "rotate-180 text-gold" : "text-muted-foreground"
                    )} />
                  </div>
                </CardHeader>
                
                {graficoExpandido === grafico.id && (
                  <CardContent className="space-y-4 pt-2 border-t mt-2">
                    {/* Para que serve */}
                    {grafico.para_que_serve && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Para que serve
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {grafico.para_que_serve}
                        </p>
                      </div>
                    )}

                    {/* Quando NÃO usar */}
                    {grafico.quando_nao_usar && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-rose-400">
                          <XCircle className="w-4 h-4" />
                          Quando NÃO usar
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">
                          {grafico.quando_nao_usar}
                        </p>
                      </div>
                    )}

                    {/* Observações Simbólicas */}
                    {grafico.observacoes_simbolicas && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-400">
                          <FileText className="w-4 h-4" />
                          Observações Simbólicas
                        </div>
                        <p className="text-sm text-muted-foreground pl-6 italic">
                          {grafico.observacoes_simbolicas}
                        </p>
                      </div>
                    )}

                    {/* Combinações */}
                    {grafico.combinacoes && grafico.combinacoes.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-gold">
                          <Sparkles className="w-4 h-4" />
                          Possíveis combinações
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {grafico.combinacoes.map((comb, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {comb}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Autores Contemplados */}
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4" />
              Autores Contemplados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['Mássimo Frizari', 'Angelo Vitale', 'Apolonius', 'La Foye', 'Antonio Rodrigues', 'Servranx', 'Giorgio Picchi'].map((autor) => (
                <Badge key={autor} variant="outline" className="text-xs">
                  {autor}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              O catálogo está em construção. Gráficos são adicionados pelo Admin.
            </p>
          </CardContent>
        </Card>

        <EthicalNotice toolName="Catálogo de Gráficos" />
      </ContentPageLayout>
    </AppLayout>
  );
}
