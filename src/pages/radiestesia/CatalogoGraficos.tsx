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
import { 
  Grid3X3, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Grafico {
  id: string;
  nome: string;
  origem: 'tradicional' | 'autoral' | 'alquimico';
  paraQueServe: string;
  quandoNaoUsar: string;
  combinacoes: string[];
  categoria: string;
}

const GRAFICOS: Grafico[] = [
  {
    id: 'decagono',
    nome: 'Decágono',
    origem: 'tradicional',
    paraQueServe: 'Harmonização geral de ambientes e campos. Equilibra energias dispersas e cria campo de proteção básico.',
    quandoNaoUsar: 'Quando o campo precisa de ação direcionada específica. Não substitui trabalho terapêutico profundo.',
    combinacoes: ['Quartzo transparente', 'Ametista', 'Chakra coronário'],
    categoria: 'harmonizacao',
  },
  {
    id: 'antahkarana',
    nome: 'Antahkarana',
    origem: 'tradicional',
    paraQueServe: 'Ponte entre personalidade e alma. Usado para meditação profunda e conexão com o Eu Superior.',
    quandoNaoUsar: 'Em situações de urgência emocional. Requer estado meditativo prévio para funcionar adequadamente.',
    combinacoes: ['Quartzo azul', 'Lápis-lazúli', 'Chakra frontal'],
    categoria: 'espiritual',
  },
  {
    id: 'flor-vida',
    nome: 'Flor da Vida',
    origem: 'tradicional',
    paraQueServe: 'Geometria sagrada de criação. Potencializa intenções, energiza cristais e alimentos.',
    quandoNaoUsar: 'Para intenções de manipulação ou controle. A energia amplifica tudo — inclusive sombras.',
    combinacoes: ['Todos os cristais', 'Água', 'Chakra cardíaco'],
    categoria: 'amplificacao',
  },
  {
    id: 'sri-yantra',
    nome: 'Sri Yantra',
    origem: 'tradicional',
    paraQueServe: 'Manifestação e abundância. Trabalhado em meditação para materializar intenções alinhadas.',
    quandoNaoUsar: 'Para desejos egóicos ou materialistas puros. Requer purificação de intenção prévia.',
    combinacoes: ['Citrino', 'Pirita', 'Chakra plexo solar'],
    categoria: 'manifestacao',
  },
  {
    id: 'merkaba',
    nome: 'Merkaba',
    origem: 'alquimico',
    paraQueServe: 'Proteção energética avançada e viagens de consciência. Campo de luz tridimensional.',
    quandoNaoUsar: 'Sem preparação prévia ou em estados alterados não controlados. Pode intensificar processos.',
    combinacoes: ['Obsidiana', 'Turmalina negra', 'Todos os chakras'],
    categoria: 'protecao',
  },
  {
    id: 'labirinto-chartres',
    nome: 'Labirinto de Chartres',
    origem: 'tradicional',
    paraQueServe: 'Jornada interior, meditação caminhante. Integração de polaridades através do movimento.',
    quandoNaoUsar: 'Como escape de questões práticas. O labirinto revela, não resolve.',
    combinacoes: ['Ametista', 'Selenita', 'Chakra coronário'],
    categoria: 'jornada',
  },
];

const CATEGORIAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'harmonizacao', label: 'Harmonização' },
  { id: 'protecao', label: 'Proteção' },
  { id: 'espiritual', label: 'Espiritual' },
  { id: 'manifestacao', label: 'Manifestação' },
  { id: 'amplificacao', label: 'Amplificação' },
  { id: 'jornada', label: 'Jornada' },
];

const ORIGENS = {
  tradicional: { label: 'Tradicional', color: 'bg-blue-500/20 text-blue-400' },
  autoral: { label: 'Autoral', color: 'bg-purple-500/20 text-purple-400' },
  alquimico: { label: 'Alquímico', color: 'bg-gold/20 text-gold' },
};

export default function CatalogoGraficos() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [graficoExpandido, setGraficoExpandido] = useState<string | null>(null);

  const graficosFiltrados = GRAFICOS.filter((g) => {
    const matchBusca = g.nome.toLowerCase().includes(busca.toLowerCase()) ||
                       g.paraQueServe.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaAtiva === 'todos' || g.categoria === categoriaAtiva;
    return matchBusca && matchCategoria;
  });

  return (
    <AppLayout>
      <ContentPageLayout
        title="Catálogo Vivo de Gráficos"
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
              placeholder="Buscar gráfico..."
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
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{grafico.nome}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge className={cn("text-xs", ORIGENS[grafico.origem].color)}>
                          {ORIGENS[grafico.origem].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {graficoExpandido === grafico.id && (
                  <CardContent className="space-y-4 pt-2">
                    {/* Para que serve */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Para que serve
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {grafico.paraQueServe}
                      </p>
                    </div>

                    {/* Quando NÃO usar */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-rose-400">
                        <XCircle className="w-4 h-4" />
                        Quando NÃO usar
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {grafico.quandoNaoUsar}
                      </p>
                    </div>

                    {/* Combinações */}
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
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        <EthicalNotice toolName="Catálogo de Gráficos" />
      </ContentPageLayout>
    </AppLayout>
  );
}
