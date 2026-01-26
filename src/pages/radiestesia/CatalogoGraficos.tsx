import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRadiestesiaConfig, Grafico } from '@/hooks/useRadiestesiaConfig';
import { 
  Grid3X3, 
  Search, 
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  User,
  FileText,
  Image as ImageIcon,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Fallback graphics for when DB is empty
const GRAFICOS_FALLBACK: Grafico[] = [
  {
    id: 'decagono',
    nome: 'Decágono',
    slug: 'decagono',
    autor: 'Tradicional',
    origem: 'tradicional',
    categoria: 'clinico',
    tipo_leitura: 'campo',
    tipo_acao: 'Regulador',
    para_que_serve: 'Harmonização geral de ambientes e campos. Equilibra energias dispersas e cria campo de proteção básico.',
    quando_usar: 'Em ambientes desarmônicos. Para equilibrar campos gerais.',
    quando_nao_usar: 'Quando o campo precisa de ação direcionada específica. Não substitui trabalho terapêutico profundo.',
    como_usar: 'Posicionar no ambiente. Tempo: 15-30 minutos.',
    erro_iniciante: 'Esperar resultados imediatos sem preparação do campo.',
    nivel_intensidade: 'medio',
    observacao_etica: 'Gráfico de equilíbrio, não de cura. Use com discernimento.',
    observacoes_simbolicas: 'Gráfico de equilíbrio universal.',
    imagem_url: null,
    combinacoes: ['Quartzo transparente', 'Ametista', 'Chakra coronário'],
    ordem: 0,
    ativo: true,
    link_loja: null,
    imagem_fisica_url: null,
    disponivel_loja: false,
  },
  {
    id: 'antahkarana',
    nome: 'Antahkarana',
    slug: 'antahkarana-fallback',
    autor: 'Tradição Tibetana',
    origem: 'tradicional',
    categoria: 'estudo',
    tipo_leitura: 'narrativa',
    tipo_acao: 'Regulador',
    para_que_serve: 'Ponte entre personalidade e alma. Usado para meditação profunda e conexão com o Eu Superior.',
    quando_usar: 'Em meditações profundas. Para trabalhos de integração.',
    quando_nao_usar: 'Em situações de urgência emocional. Requer estado meditativo prévio para funcionar adequadamente.',
    como_usar: 'Meditar com o símbolo. Tempo: 15-30 minutos.',
    erro_iniciante: 'Usar para fugir da realidade.',
    nivel_intensidade: 'medio',
    observacao_etica: 'A ponte une céu e terra. Mantenha-se ancorado.',
    observacoes_simbolicas: 'Símbolo de conexão interdimensional.',
    imagem_url: null,
    combinacoes: ['Quartzo azul', 'Lápis-lazúli', 'Chakra frontal'],
    ordem: 1,
    ativo: true,
    link_loja: null,
    imagem_fisica_url: null,
    disponivel_loja: false,
  },
  {
    id: 'flor-vida',
    nome: 'Flor da Vida',
    slug: 'flor-vida-fallback',
    autor: 'Geometria Sagrada',
    origem: 'tradicional',
    categoria: 'oracular',
    tipo_leitura: 'campo',
    tipo_acao: 'Regulador',
    para_que_serve: 'Geometria sagrada de criação. Potencializa intenções, energiza cristais e alimentos.',
    quando_usar: 'Para harmonização geral. Em meditações. Para carregar objetos.',
    quando_nao_usar: 'Para intenções de manipulação ou controle. A energia amplifica tudo — inclusive sombras.',
    como_usar: 'Posicionar objeto no centro. Tempo: 15-60 minutos.',
    erro_iniciante: 'Tratar como decoração.',
    nivel_intensidade: 'medio',
    observacao_etica: 'Use com reverência e propósito claro.',
    observacoes_simbolicas: 'Padrão da criação universal.',
    imagem_url: null,
    combinacoes: ['Todos os cristais', 'Água', 'Chakra cardíaco'],
    ordem: 2,
    ativo: true,
    link_loja: null,
    imagem_fisica_url: null,
    disponivel_loja: false,
  },
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'clinico', label: 'Clínico' },
  { id: 'oracular', label: 'Oracular' },
  { id: 'estudo', label: 'Estudo' },
];


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
                  "transition-all cursor-pointer hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10",
                  "group"
                )}
                onClick={() => {
                  if (grafico.slug) {
                    navigate(`/radiestesia/graficos/${grafico.slug}`);
                  } else {
                    setGraficoExpandido(
                      graficoExpandido === grafico.id ? null : grafico.id
                    );
                  }
                }}
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
                          {grafico.tipo_acao && (
                            <Badge className="text-xs bg-gold/20 text-gold">
                              {grafico.tipo_acao}
                            </Badge>
                          )}
                          {grafico.nivel_intensidade && (
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              grafico.nivel_intensidade === 'suave' && "border-emerald-500/50 text-emerald-400",
                              grafico.nivel_intensidade === 'medio' && "border-amber-500/50 text-amber-400",
                              grafico.nivel_intensidade === 'forte' && "border-orange-500/50 text-orange-400",
                              grafico.nivel_intensidade === 'muito_forte' && "border-rose-500/50 text-rose-400"
                            )}>
                              {grafico.nivel_intensidade === 'suave' && '○ Suave'}
                              {grafico.nivel_intensidade === 'medio' && '◐ Médio'}
                              {grafico.nivel_intensidade === 'forte' && '◕ Forte'}
                              {grafico.nivel_intensidade === 'muito_forte' && '● Muito Forte'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver detalhes →
                    </div>
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

                    <Separator className="my-4" />

                    {/* Seção: Versão Física - só mostra se disponível na loja */}
                    {grafico.disponivel_loja && (
                      <div className="p-4 rounded-lg bg-gradient-to-br from-gold/10 to-background border border-gold/20">
                        <div className="flex items-start gap-3">
                          <ShoppingBag className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                          <div className="flex-1 space-y-2">
                            <h4 className="font-medium text-foreground">Versão Física</h4>
                            <p className="text-xs text-muted-foreground italic">
                              "O gráfico físico amplia a experiência simbólica, mas não substitui a escuta."
                            </p>
                            
                            {/* Imagem do produto físico */}
                            {(grafico.imagem_fisica_url || grafico.imagem_url) && (
                              <div className="py-2">
                                <img 
                                  src={grafico.imagem_fisica_url || grafico.imagem_url || ''} 
                                  alt={`${grafico.nome} - Versão Física`}
                                  className="w-full max-w-[200px] rounded-lg border"
                                />
                              </div>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gold border-gold/30 hover:bg-gold/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                const lojaUrl = grafico.link_loja || 'https://casaoracula.com.br/loja';
                                window.open(lojaUrl, '_blank');
                              }}
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Adquirir gráfico físico
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          </div>
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

        {/* Nota sobre a loja */}
        <Card className="border-gold/20 bg-gold/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  A loja de gráficos físicos é integrada como continuidade da prática.
                </p>
                <p className="text-xs text-muted-foreground">
                  O foco é educação + prática, não vitrine. Cada gráfico foi incluído por sua qualidade simbólica.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <EthicalNotice toolName="Catálogo de Gráficos" />
      </ContentPageLayout>
    </AppLayout>
  );
}
