import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, Home, ChevronRight, ArrowRight, Lock,
  Stethoscope, Drama, Eclipse, BookOpen, Sparkles, Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { canAccessFeature, PortalType } from '@/types/portal';

// ═══════════════════════════════════════════════════════════════
// CATEGORIAS
// ═══════════════════════════════════════════════════════════════

type CategoryKey = 'diagnostico' | 'arquetipos' | 'sombras' | 'narrativas' | 'oraculos' | 'cartografia';

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  description: string;
  icon: React.ElementType;
  tipoFerramenta: string[];
}[] = [
  {
    key: 'diagnostico',
    label: 'Diagnóstico',
    description: 'Mapas e avaliações para leitura do campo psíquico.',
    icon: Stethoscope,
    tipoFerramenta: ['diagnostico', 'autoleitura'],
  },
  {
    key: 'arquetipos',
    label: 'Arquétipos',
    description: 'Ferramentas de identificação e trabalho arquetípico.',
    icon: Drama,
    tipoFerramenta: ['arquetipos'],
  },
  {
    key: 'sombras',
    label: 'Sombras',
    description: 'Instrumentos para acessar e integrar a sombra.',
    icon: Eclipse,
    tipoFerramenta: ['sombra', 'ritual_simbolico'],
  },
  {
    key: 'narrativas',
    label: 'Narrativas',
    description: 'Protocolos narrativos e de mito pessoal.',
    icon: BookOpen,
    tipoFerramenta: ['ferramenta_narrativa', 'conducao_terapeutica'],
  },
  {
    key: 'oraculos',
    label: 'Oráculos',
    description: 'Leitura simbólica e divinação.',
    icon: Sparkles,
    tipoFerramenta: ['leitura_simbolica', 'oraculo'],
  },
  {
    key: 'cartografia',
    label: 'Cartografia',
    description: 'Mapeamento de territórios e estruturas psíquicas.',
    icon: Map,
    tipoFerramenta: ['cartografia', 'mapeamento'],
  },
];

// ═══════════════════════════════════════════════════════════════
// FERRAMENTAS FIXAS (do FerramentasMetodoHub)
// ═══════════════════════════════════════════════════════════════

interface FixedTool {
  id: string;
  nome: string;
  descricao: string;
  rota: string;
  portalMinimo: PortalType;
  categoria: CategoryKey;
}

const FIXED_TOOLS: FixedTool[] = [
  {
    id: 'labirinto',
    nome: 'Labirinto das 39 Portas',
    descricao: 'Protocolo de leitura simbólica — onde a psique está.',
    rota: '/labirinto',
    portalMinimo: 'aluna',
    categoria: 'diagnostico',
  },
  {
    id: 'cartografia-psiquica-oracula',
    nome: 'Cartografia Psíquica Orácula',
    descricao: 'Mapeamento simbólico dos territórios da psique com geração da CidaDELA Interior.',
    rota: '/ferramenta/cartografia-psiquica-oracula',
    portalMinimo: 'visitante',
    categoria: 'diagnostico',
  },
  {
    id: 'torre-viva',
    nome: 'Torre Viva™',
    descricao: 'Identifique as 7 Torres de defesa que organizam a psique.',
    rota: '/ferramentas/torre-viva',
    portalMinimo: 'oracula',
    categoria: 'sombras',
  },
  {
    id: 'cartografia-torre',
    nome: 'Cartografia das Torres',
    descricao: 'Explore as 5 Famílias de Torres e seus padrões.',
    rota: '/ferramentas/cartografia-torre',
    portalMinimo: 'aluna',
    categoria: 'cartografia',
  },
  {
    id: 'atlas-arquetipos',
    nome: 'Atlas dos Arquétipos Femininos',
    descricao: 'Mapeamento dos arquétipos dominantes e latentes.',
    rota: '/atlas-arquetipos-femininos',
    portalMinimo: 'aluna',
    categoria: 'arquetipos',
  },
  {
    id: 'leitura-5-camadas',
    nome: 'Leitura em 5 Camadas',
    descricao: 'Ferramenta central do Método — do sintoma ao portal.',
    rota: '/sala-do-metodo?tab=5-camadas',
    portalMinimo: 'oracula',
    categoria: 'narrativas',
  },
  {
    id: 'radar-eixo',
    nome: 'Radar de Eixo',
    descricao: 'Mapeamento de 6 competências estruturais da psique.',
    rota: '/sala-do-metodo?tab=radar',
    portalMinimo: 'oracula',
    categoria: 'diagnostico',
  },
  {
    id: 'mapas-reflexivos',
    nome: 'Mapas Reflexivos Pessoais',
    descricao: 'Big5, Eneagrama, Constelação e Tarô — modelos de reflexão.',
    rota: '/mapas-pessoais',
    portalMinimo: 'visitante',
    categoria: 'cartografia',
  },
  {
    id: 'oraculos',
    nome: 'Oráculos da Casa',
    descricao: 'Tiragem de cartas e leitura simbólica.',
    rota: '/oraculos',
    portalMinimo: 'visitante',
    categoria: 'oraculos',
  },
  {
    id: 'narroterapia',
    nome: 'Narroterapia Oracular™',
    descricao: 'Protocolos narrativos e biblioteca de contos clínicos.',
    rota: '/narroterapia',
    portalMinimo: 'aluna',
    categoria: 'narrativas',
  },
  {
    id: 'cartografia-psiquica',
    nome: 'Cartografia Psíquica',
    descricao: 'Mapeamento simbólico do mundo interior.',
    rota: '/cartografia-psiquica',
    portalMinimo: 'visitante',
    categoria: 'cartografia',
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════════════════════

interface DBFerramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  rota: string | null;
  tipo_ferramenta: string | null;
  portal_minimo: string;
  ordem: number;
}

export default function FerramentasHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryKey | 'todas'>('todas');

  const userPortal = (user?.portal || 'visitante') as PortalType;
  const isAdmin = userPortal === 'admin';

  // DB ferramentas
  const { data: dbFerramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-hub-unified'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, tipo_ferramenta, portal_minimo, ordem')
        .eq('ativa', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data as DBFerramenta[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const canAccess = (minPortal: string): boolean => {
    if (isAdmin) return true;
    return canAccessFeature(userPortal, minPortal as PortalType);
  };

  // Map DB tools to categories
  const mapDBToolCategory = (tipo: string | null): CategoryKey => {
    if (!tipo) return 'diagnostico';
    if (['diagnostico', 'autoleitura'].includes(tipo)) return 'diagnostico';
    if (['arquetipos'].includes(tipo)) return 'arquetipos';
    if (['sombra', 'ritual_simbolico'].includes(tipo)) return 'sombras';
    if (['ferramenta_narrativa', 'conducao_terapeutica'].includes(tipo)) return 'narrativas';
    if (['leitura_simbolica', 'oraculo'].includes(tipo)) return 'oraculos';
    if (['cartografia', 'mapeamento'].includes(tipo)) return 'cartografia';
    return 'diagnostico';
  };

  // Merge fixed + DB tools, dedup by id
  const allTools = (() => {
    const fixedIds = new Set(FIXED_TOOLS.map(t => t.id));
    const dbMapped = (dbFerramentas || [])
      .filter(t => t.rota && !fixedIds.has(t.id))
      .map(t => ({
        id: t.id,
        nome: t.ferramenta_nome,
        descricao: t.ferramenta_descricao || '',
        rota: t.rota!,
        portalMinimo: t.portal_minimo as PortalType,
        categoria: mapDBToolCategory(t.tipo_ferramenta),
      }));
    return [...FIXED_TOOLS, ...dbMapped];
  })();

  const filteredTools = activeCategory === 'todas'
    ? allTools
    : allTools.filter(t => t.categoria === activeCategory);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard-membro" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Ferramentas</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            Ferramentas Orácula
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Todos os instrumentos da Casa Orácula em um só lugar.
            Explore por categoria ou navegue livremente.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setActiveCategory('todas')}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium border transition-all',
              activeCategory === 'todas'
                ? 'bg-primary/10 border-primary/30 text-primary'
                : 'bg-card/50 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground'
            )}
          >
            Todas
          </button>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-1.5',
                  activeCategory === cat.key
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-card/50 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma ferramenta nesta categoria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool, i) => {
              const hasAccess = canAccess(tool.portalMinimo);
              const catMeta = CATEGORIES.find(c => c.key === tool.categoria);
              const CatIcon = catMeta?.icon || Sparkles;

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * Math.min(i, 12) }}
                >
                  <Card
                    className={cn(
                      'h-full transition-all duration-300 group',
                      hasAccess
                        ? 'cursor-pointer hover:border-primary/30 hover:shadow-lg'
                        : 'opacity-60'
                    )}
                    onClick={() => hasAccess && navigate(tool.rota)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <CatIcon className="w-5 h-5 text-primary" />
                        </div>
                        {!hasAccess && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Lock className="w-3 h-3" />
                            Bloqueada
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-base mb-1 group-hover:text-primary transition-colors">
                        {tool.nome}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 mb-3">
                        {tool.descricao}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {catMeta?.label || 'Geral'}
                        </Badge>
                        {hasAccess && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
