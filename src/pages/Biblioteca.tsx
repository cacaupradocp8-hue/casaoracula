import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Search, Heart, BookOpen, Sparkles, MessageCircle, Scroll, Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SymbolicItemType = 'conto' | 'arquetipo' | 'pergunta' | 'ritual';

interface SymbolicItem {
  id: string;
  type: SymbolicItemType;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
}

const MOCK_ITEMS: SymbolicItem[] = [
  {
    id: '1',
    type: 'conto',
    title: 'A Mulher Esqueleto',
    content: 'Uma história sobre o amor que não foge da morte. Conta de um pescador que, ao puxar sua rede, traz à tona os ossos de uma mulher afogada. Assustado, ele foge, mas ela o segue, presa em sua linha. Na cabana, enquanto ele dorme, ela reconstrói seu corpo com as lágrimas dele. É uma narrativa sobre amar o que está por baixo da superfície.',
    tags: ['morte', 'renascimento', 'amor profundo', 'feminino'],
    isFavorite: true,
  },
  {
    id: '2',
    type: 'arquetipo',
    title: 'A Donzela Interior',
    content: 'A Donzela representa o aspecto virginal da psique — não no sentido de pureza sexual, mas de inteireza, de pertencer apenas a si mesma. Quando este arquétipo está ferido, a mulher busca constantemente aprovação externa, não confia em suas percepções, entrega seu poder facilmente.',
    tags: ['feminino', 'autonomia', 'início', 'potencial'],
    isFavorite: false,
  },
  {
    id: '3',
    type: 'pergunta',
    title: 'A Pergunta do Limiar',
    content: 'Se você pudesse voltar ao exato momento em que fez a escolha que mudou tudo... você faria diferente? Ou a dor que veio depois ensinou algo que nenhuma facilidade poderia ter ensinado?',
    tags: ['escolha', 'limiar', 'travessia', 'reflexão'],
    isFavorite: true,
  },
  {
    id: '4',
    type: 'ritual',
    title: 'Ritual do Espelho Escuro',
    content: 'Em ambiente escuro e seguro, acenda uma vela e coloque-a ao lado de um espelho. Olhe para seu reflexo por 10 minutos, deixando que as formas se transformem. Não force nenhuma imagem — deixe que seu inconsciente mostre o que precisa ser visto. Depois, escreva o que surgiu sem editar.',
    tags: ['sombra', 'autoconhecimento', 'espelho', 'inconsciente'],
    isFavorite: false,
  },
  {
    id: '5',
    type: 'arquetipo',
    title: 'A Mãe Devoradora',
    content: 'Quando o arquétipo materno se torna devorador, o amor vira prisão. A Mãe Devoradora não permite que os filhos cresçam, mantendo-os dependentes para preencher seu próprio vazio. Este padrão pode aparecer em relações de cuidado onde quem cuida precisa ser indispensável.',
    tags: ['sombra', 'mãe', 'dependência', 'controle'],
    isFavorite: false,
  },
  {
    id: '6',
    type: 'pergunta',
    title: 'A Pergunta Impossível',
    content: 'Qual parte de você precisaria morrer para que você finalmente vivesse?',
    tags: ['morte simbólica', 'transformação', 'profunda'],
    isFavorite: true,
  },
];

const typeConfig: Record<SymbolicItemType, { label: string; icon: React.ReactNode; color: string }> = {
  conto: { label: 'Conto de Poder', icon: <BookOpen className="w-4 h-4" />, color: 'bg-burgundy/20 text-burgundy-light' },
  arquetipo: { label: 'Arquétipo', icon: <Sparkles className="w-4 h-4" />, color: 'bg-gold/20 text-gold' },
  pergunta: { label: 'Pergunta Impossível', icon: <MessageCircle className="w-4 h-4" />, color: 'bg-sage/20 text-sage-light' },
  ritual: { label: 'Ritual Narrativo', icon: <Scroll className="w-4 h-4" />, color: 'bg-accent/40 text-accent-foreground' },
};

export default function Biblioteca() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(MOCK_ITEMS);
  const [selectedType, setSelectedType] = useState<SymbolicItemType | 'all'>('all');

  const toggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Biblioteca Simbólica</span>
        </nav>

        <SectionHeader
          title="Biblioteca Simbólica"
          subtitle="Contos, arquétipos, perguntas e rituais para sua prática"
          icon={<Library className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Search and Filters */}
        <div className="glass rounded-xl p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, conteúdo ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as SymbolicItemType | 'all')} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="conto" className="gap-1">
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Contos</span>
            </TabsTrigger>
            <TabsTrigger value="arquetipo" className="gap-1">
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Arquétipos</span>
            </TabsTrigger>
            <TabsTrigger value="pergunta" className="gap-1">
              <MessageCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Perguntas</span>
            </TabsTrigger>
            <TabsTrigger value="ritual" className="gap-1">
              <Scroll className="w-3 h-3" />
              <span className="hidden sm:inline">Rituais</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="mt-0">
            {filteredItems.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Library className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhum item encontrado</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredItems.map((item) => {
                  const config = typeConfig[item.type];
                  
                  return (
                    <Card key={item.id} className="group hover:shadow-gold transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('p-2 rounded-lg', config.color)}>
                              {config.icon}
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {config.label}
                              </p>
                              <CardTitle className="text-lg font-display">
                                {item.title}
                              </CardTitle>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(item.id)}
                            className="flex-shrink-0"
                          >
                            <Heart className={cn(
                              'w-5 h-5 transition-colors',
                              item.isFavorite ? 'fill-gold text-gold' : 'text-muted-foreground'
                            )} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {item.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
