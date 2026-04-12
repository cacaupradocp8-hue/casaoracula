import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, RefreshCw, Sun, Headphones, Calendar,
  Sparkles, DoorOpen, Settings, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HubCard {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
}

const CARDS: HubCard[] = [
  {
    key: 'jornadas',
    title: 'Jornadas',
    description: 'Criar e gerenciar jornadas formativas (containers de portais).',
    icon: BookOpen,
    route: '/admin/clube-livro/jornadas',
    color: 'text-gold',
  },
  {
    key: 'portais-cms',
    title: 'Portais (CMS)',
    description: 'Editor completo: Essência, Áudio, Laboratório, Jardins, Aplicação, Ferramenta, Risco Ético.',
    icon: DoorOpen,
    route: '/admin/clube-livro/portais-cms',
    color: 'text-teal-500',
  },
  {
    key: 'ciclos',
    title: 'Ciclos & Fases',
    description: 'Gerenciar ciclos de leitura, semanas, fases e importar calendário anual.',
    icon: RefreshCw,
    route: '/admin/clube-livro/ciclos',
    color: 'text-amber-500',
  },
  {
    key: 'acervo',
    title: 'Livros & Acervo',
    description: 'CRUD de livros, metadados simbólicos, tours e aulas-álbum.',
    icon: BookOpen,
    route: '/admin/clube-livro/acervo',
    color: 'text-emerald-500',
  },
  {
    key: 'estacoes',
    title: 'Estações',
    description: 'Gerenciar estações oraculares (temporadas) do Clube.',
    icon: Sun,
    route: '/admin/clube-livro/estacoes',
    color: 'text-orange-500',
  },
  {
    key: 'escutas',
    title: 'Escutas & Aulas-Álbum',
    description: 'Aulas-álbum, escutas guiadas e blocos de aula por ciclo.',
    icon: Headphones,
    route: '/admin/clube-livro/escutas',
    color: 'text-purple-500',
  },
  {
    key: 'encontros',
    title: 'Encontros',
    description: 'Encontros ao vivo, replays e links de reunião.',
    icon: Calendar,
    route: '/admin/clube-livro/encontros',
    color: 'text-blue-500',
  },
  {
    key: 'gerador',
    title: 'Gerador Semanal',
    description: 'Gerar conteúdo da semana: podcast, carta, prática terapêutica.',
    icon: Sparkles,
    route: '/admin/clube-livro/gerador',
    color: 'text-pink-500',
  },
  {
    key: 'portais',
    title: 'Portais & Travessias (legado)',
    description: 'Portais vinculados a ciclos e jornadas.',
    icon: DoorOpen,
    route: '/admin/clube-livro/portais',
    color: 'text-muted-foreground',
  },
  {
    key: 'config',
    title: 'Configurações',
    description: 'Regras de progressão, níveis de acesso e Lab 80/20.',
    icon: Settings,
    route: '/admin/clube-livro/config',
    color: 'text-muted-foreground',
  },
];

export default function AdminClubeHub() {
  const { data: stats } = useQuery({
    queryKey: ['admin-clube-hub-stats'],
    queryFn: async () => {
      const [ciclos, books, estacoes, semanas, escutas, encontros] = await Promise.all([
        supabase.from('clube_livro_ciclos').select('id', { count: 'exact', head: true }),
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('oracular_seasons').select('id', { count: 'exact', head: true }),
        supabase.from('clube_livro_semana').select('id', { count: 'exact', head: true }),
        (supabase as any).from('clube_livro_escutas').select('id', { count: 'exact', head: true }),
        (supabase as any).from('clube_livro_encontros').select('id', { count: 'exact', head: true }),
      ]);
      return {
        ciclos: ciclos.count || 0,
        books: books.count || 0,
        estacoes: estacoes.count || 0,
        semanas: semanas.count || 0,
        escutas: escutas.count || 0,
        encontros: encontros.count || 0,
      };
    },
  });

  const getStatForCard = (key: string): string | null => {
    if (!stats) return null;
    switch (key) {
      case 'ciclos': return `${stats.ciclos} ciclo(s)`;
      case 'acervo': return `${stats.books} livro(s)`;
      case 'estacoes': return `${stats.estacoes} estação(ões)`;
      case 'gerador': return `${stats.semanas} semana(s)`;
      case 'escutas': return `${stats.escutas} escuta(s)`;
      case 'encontros': return `${stats.encontros} encontro(s)`;
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Clube de Leitura Oracular"
            subtitle="Sistema de Leitura como Intervenção Psíquica Guiada"
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => {
            const stat = getStatForCard(card.key);
            return (
              <Link key={card.key} to={card.route} className="group">
                <Card className="h-full transition-all duration-200 hover:border-gold/40 hover:shadow-md group-hover:bg-card/80">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-muted/50 ${card.color}`}>
                        <card.icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {card.description}
                    </p>
                    {stat && (
                      <Badge variant="secondary" className="text-[10px]">
                        {stat}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick guide */}
        <Card className="mt-8 bg-muted/20 border-gold/10">
          <CardContent className="p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Fluxo de criação recomendado
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded font-medium">1. Estações</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">2. Jornadas</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">3. Portais (CMS)</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">4. Ciclos</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">5. Escutas</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">6. Encontros</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
