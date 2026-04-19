import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, RefreshCw, Sun, Headphones, Calendar,
  Sparkles, DoorOpen, Settings, ArrowLeft, ArrowRight, Wrench,
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

// 🌟 ENTRADA OFICIAL — único lugar onde o conteúdo do Clube é criado/editado
const PRIMARY_CARD: HubCard = {
  key: 'central',
  title: 'Central de Jornadas',
  description: 'Único lugar para criar conteúdo do Clube: Estrada, Semanas, Aplicação 80/20 e Encontros. Tudo por estação.',
  icon: BookOpen,
  route: '/admin/clube-livro/central',
  color: 'text-gold',
};

// 📚 Apoio editorial (insumos para a Central)
const SUPPORT_CARDS: HubCard[] = [
  {
    key: 'acervo',
    title: 'Acervo de Livros',
    description: 'Cadastrar livros, capa, sinopse simbólica — base do que será trabalhado nas estações.',
    icon: BookOpen,
    route: '/admin/clube-livro/acervo',
    color: 'text-emerald-500',
  },
  {
    key: 'ciclos',
    title: 'Ciclos & Calendário',
    description: 'Definir ciclos mensais/anuais (containers temporais que envolvem as estações).',
    icon: RefreshCw,
    route: '/admin/clube-livro/ciclos',
    color: 'text-amber-500',
  },
  {
    key: 'gerador',
    title: 'Gerador IA — Alquimista',
    description: 'Rascunhar carta + podcast + prática via IA. Depois publique pela Central.',
    icon: Sparkles,
    route: '/admin/clube-livro/gerador',
    color: 'text-pink-500',
  },
];

// ⚙️ Avançado / Legado — manter para retrocompatibilidade, não usar para criar conteúdo novo
const ADVANCED_CARDS: HubCard[] = [
  {
    key: 'estacoes',
    title: 'Estações (CRUD básico)',
    description: 'CRUD simples de estações. Use a Central para o trabalho real.',
    icon: Sun,
    route: '/admin/clube-livro/estacoes',
    color: 'text-muted-foreground',
  },
  {
    key: 'jornadas',
    title: 'Jornadas (legado)',
    description: 'Antigos containers de portais. Substituído pela Central.',
    icon: BookOpen,
    route: '/admin/clube-livro/jornadas',
    color: 'text-muted-foreground',
  },
  {
    key: 'escutas',
    title: 'Escutas avulsas',
    description: 'Aulas-álbum e escutas independentes de estação.',
    icon: Headphones,
    route: '/admin/clube-livro/escutas',
    color: 'text-muted-foreground',
  },
  {
    key: 'encontros',
    title: 'Encontros avulsos',
    description: 'Encontros fora do contexto de uma estação.',
    icon: Calendar,
    route: '/admin/clube-livro/encontros',
    color: 'text-muted-foreground',
  },
  {
    key: 'portais-cms',
    title: 'Portais (CMS completo)',
    description: 'Editor avançado de portais simbólicos (módulo paralelo).',
    icon: DoorOpen,
    route: '/admin/clube-livro/portais-cms',
    color: 'text-muted-foreground',
  },
  {
    key: 'portais',
    title: 'Portais & Travessias (legado)',
    description: 'Portais antigos vinculados a ciclos.',
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
        supabase.from('clube_estacoes').select('id', { count: 'exact', head: true }),
        (supabase as any).from('clube_conteudo_semanal').select('id', { count: 'exact', head: true }),
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
      case 'central': return `${stats.estacoes} estação(ões) · ${stats.semanas} semana(s)`;
      case 'ciclos': return `${stats.ciclos} ciclo(s)`;
      case 'acervo': return `${stats.books} livro(s)`;
      case 'estacoes': return `${stats.estacoes} estação(ões)`;
      case 'gerador': return `${stats.semanas} semana(s)`;
      case 'escutas': return `${stats.escutas} escuta(s)`;
      case 'encontros': return `${stats.encontros} encontro(s)`;
      default: return null;
    }
  };

  const renderCard = (card: HubCard, featured = false) => {
    const stat = getStatForCard(card.key);
    return (
      <Link key={card.key} to={card.route} className="group">
        <Card className={`h-full transition-all duration-200 hover:shadow-md group-hover:bg-card/80 ${
          featured ? 'border-gold/50 bg-gradient-to-br from-gold/5 to-transparent hover:border-gold' : 'hover:border-gold/40'
        }`}>
          <CardContent className={featured ? 'p-6' : 'p-5'}>
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${featured ? 'bg-gold/10' : 'bg-muted/50'} ${card.color}`}>
                <card.icon className={featured ? 'w-6 h-6' : 'w-5 h-5'} />
              </div>
              {featured && (
                <Badge className="bg-gold/20 text-gold border-gold/30 text-[10px]">
                  Entrada oficial
                </Badge>
              )}
              {!featured && <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
            </div>
            <h3 className={`font-semibold text-foreground mb-1 ${featured ? 'text-lg' : ''}`}>{card.title}</h3>
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
            subtitle="Sistema de Leitura como Intervenção Psíquica Guiada"
            icon={<BookOpen className="w-5 h-5" />}
          />
        </div>

        {/* 🌟 Entrada principal */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            Onde o conteúdo é criado
          </h2>
          <div className="grid gap-4 sm:grid-cols-1">
            {renderCard(PRIMARY_CARD, true)}
          </div>
        </div>

        {/* 📚 Apoio editorial */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            Apoio editorial
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_CARDS.map((c) => renderCard(c))}
          </div>
        </div>

        {/* ⚙️ Avançado / Legado */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium flex items-center gap-2">
            <Wrench className="w-3 h-3" />
            Avançado / Legado
          </h2>
          <p className="text-xs text-muted-foreground/70 mb-3 italic">
            Telas mantidas para retrocompatibilidade. Não use para criar conteúdo novo — prefira a Central.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANCED_CARDS.map((c) => renderCard(c))}
          </div>
        </div>

        {/* Quick guide */}
        <Card className="bg-muted/20 border-gold/10">
          <CardContent className="p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              Fluxo de criação recomendado
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded font-medium">1. Acervo (cadastrar livro)</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-muted px-2 py-1 rounded font-medium">2. Ciclo (calendário)</span>
              <ArrowRight className="w-3 h-3" />
              <span className="bg-gold/20 text-gold px-2 py-1 rounded font-semibold">3. Central → Estação → Estrada / Semanas / Aplicação / Encontro</span>
            </div>
            <p className="text-[11px] text-muted-foreground/70 mt-3 italic">
              Dica: o Gerador IA cria rascunhos, mas a publicação real acontece pela aba <strong>Semanas</strong> da Central.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
