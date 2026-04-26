import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, RefreshCw, DoorOpen, GraduationCap, MessageSquare, Library,
  ArrowLeft, ArrowRight, Wrench, Settings, Sparkles
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

// ═══ ESTRUTURA OFICIAL ═══
const OFFICIAL_CARDS: HubCard[] = [
  {
    key: 'ciclos',
    title: '1. Ciclos & Estações',
    description: 'Gestão de jornadas temporais. É aqui que você define qual livro está sendo lido.',
    icon: RefreshCw,
    route: '/admin/clube/ciclos',
    color: 'text-gold',
  },
  {
    key: 'portais',
    title: '2. Portais Simbólicos',
    description: 'Configuração da cartografia: Porta, Campo, Torre e Labirinto de cada portal.',
    icon: DoorOpen,
    route: '/admin/clube/portais',
    color: 'text-amber-500',
  },
  {
    key: 'conteudos',
    title: '3. Acervo & Conteúdos',
    description: 'Gestão de livros, áudios e materiais de apoio do Clube.',
    icon: Library,
    route: '/admin/clube/conteudos',
    color: 'text-emerald-500',
  },
  {
    key: 'treinamento',
    title: '4. Sala de Treinamento',
    description: 'Configuração de simulações clínicas e orientações éticas por ciclo.',
    icon: GraduationCap,
    route: '/admin/clube/treinamento',
    color: 'text-blue-500',
  },
  {
    key: 'chat',
    title: '5. Chat com o Livro',
    description: 'Perguntas guiadas e base de conhecimento da IA para interação com a obra.',
    icon: MessageSquare,
    route: '/admin/clube/chat',
    color: 'text-pink-500',
  },
];

// ⚙️ Ferramentas de Apoio / Legado
const SUPPORT_CARDS: HubCard[] = [
  {
    key: 'gerador',
    title: 'Gerador IA (Rascunhos)',
    description: 'Use a IA para rascunhar cartas, podcasts e práticas.',
    icon: Sparkles,
    route: '/admin/clube-livro/gerador',
    color: 'text-muted-foreground',
  },
  {
    key: 'config',
    title: 'Configurações Gerais',
    description: 'Regras de acesso, Lab 80/20 e orquestração.',
    icon: Settings,
    route: '/admin/clube-livro/config',
    color: 'text-muted-foreground',
  },
];

export default function AdminClubeHub() {
  const { data: stats } = useQuery({
    queryKey: ['admin-clube-hub-stats-v2'],
    queryFn: async () => {
      const [ciclos, books, estacoes, portais] = await Promise.all([
        supabase.from('clube_livro_ciclos').select('id', { count: 'exact', head: true }),
        supabase.from('books').select('id', { count: 'exact', head: true }),
        supabase.from('clube_estacoes').select('id', { count: 'exact', head: true }),
        supabase.from('clube_portais').select('id', { count: 'exact', head: true }),
      ]);
      return {
        ciclos: ciclos.count || 0,
        books: books.count || 0,
        estacoes: estacoes.count || 0,
        portais: portais.count || 0,
      };
    },
  });

  const getStatForCard = (key: string): string | null => {
    if (!stats) return null;
    switch (key) {
      case 'ciclos': return `${stats.estacoes} estação(ões)`;
      case 'conteudos': return `${stats.books} livro(s)`;
      case 'portais': return `${stats.portais} portal(ais)`;
      default: return null;
    }
  };

  const renderCard = (card: HubCard, featured = false) => {
    const stat = getStatForCard(card.key);
    return (
      <Link key={card.key} to={card.route} className="group">
        <Card className={`h-full transition-all duration-200 hover:shadow-md group-hover:bg-card/80 border-gold/10 hover:border-gold/40`}>
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
            subtitle="Admin Central — Fluxo Unificado de Criação"
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>

        {/* 🌟 Rota Oficial */}
        <div className="mb-12">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-gold" />
            Estrutura Oficial de Trabalho
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICIAL_CARDS.map((c) => renderCard(c))}
          </div>
        </div>

        {/* ⚙️ Apoio & Legado */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium flex items-center gap-2">
            <Wrench className="w-3 h-3" />
            Avançado / Apoio
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_CARDS.map((c) => renderCard(c))}
          </div>
        </div>

        {/* Info Box */}
        <Card className="bg-gold/5 border-gold/10">
          <CardContent className="p-5 flex gap-4 items-start">
            <div className="p-2 bg-gold/10 rounded-full">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Dica da Guardiã</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este novo Hub unifica o acesso ao Clube. As rotas antigas em <code>/admin/clube-livro</code> ainda funcionam para compatibilidade, mas o fluxo oficial agora é centralizado aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
