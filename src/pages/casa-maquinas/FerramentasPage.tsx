import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronRight, Lock, Stethoscope, Drama, Eclipse, BookOpen, Sparkles, Map } from 'lucide-react';
import { cn } from '@/lib/utils';
import { canAccessFeature, PortalType } from '@/types/portal';

// ═══════════════════════════════════════════════════════════════
// Categories for clinical context
// ═══════════════════════════════════════════════════════════════

type CategoryKey = 'todas' | 'diagnostico' | 'arquetipos' | 'sombras' | 'narrativas' | 'oraculos' | 'cartografia';

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ElementType }[] = [
  { key: 'todas', label: 'Todas', icon: Sparkles },
  { key: 'diagnostico', label: 'Diagnóstico', icon: Stethoscope },
  { key: 'arquetipos', label: 'Arquétipos', icon: Drama },
  { key: 'sombras', label: 'Sombras', icon: Eclipse },
  { key: 'narrativas', label: 'Narrativas', icon: BookOpen },
  { key: 'oraculos', label: 'Oráculos', icon: Sparkles },
  { key: 'cartografia', label: 'Cartografia', icon: Map },
];

// ═══════════════════════════════════════════════════════════════
// Clinical-only tools (SaaS context, not in sala_ferramentas)
// ═══════════════════════════════════════════════════════════════

interface ToolItem {
  id: string;
  nome: string;
  descricao: string;
  rota: string;
  portalMinimo: string;
  categoria: CategoryKey;
  isPlaceholder?: boolean;
}

const CLINICAL_TOOLS: ToolItem[] = [
  { id: 'cm-inventario', nome: 'Inventário de Personas', descricao: 'Mapeamento de personas ativas.', rota: '/casa-das-maquinas/ferramentas/inventario-personas', portalMinimo: 'aluna_formacao', categoria: 'arquetipos' },
  { id: 'cm-complexos', nome: 'Mapeamento de Complexos', descricao: 'Cartografia de complexos psíquicos.', rota: '/casa-das-maquinas/ferramentas/mapeamento-complexos', portalMinimo: 'aluna_formacao', categoria: 'sombras' },
  { id: 'cm-mapa-sombra', nome: 'Mapa da Sombra', descricao: 'Identificação e integração de sombras.', rota: '/casa-das-maquinas/ferramentas/mapa-sombra', portalMinimo: 'aluna_formacao', categoria: 'sombras' },
  { id: 'cm-diag-ego', nome: 'Diagnóstico de Ego', descricao: 'Avaliação da estrutura egoica.', rota: '/casa-das-maquinas/ferramentas/diagnostico-ego', portalMinimo: 'aluna_formacao', categoria: 'diagnostico' },
  { id: 'cm-sonho', nome: 'Sonho Estruturado', descricao: 'Protocolo de sonho dirigido.', rota: '/casa-das-maquinas/ferramentas/sonho-estruturado', portalMinimo: 'aluna_formacao', categoria: 'narrativas' },
  { id: 'cm-imaginacao', nome: 'Imaginação Ativa', descricao: 'Protocolo junguiano de imaginação ativa.', rota: '/casa-das-maquinas/ferramentas/imaginacao-ativa', portalMinimo: 'aluna_formacao', categoria: 'narrativas' },
  { id: 'cm-escrita-nc', nome: 'Escrita Não Censurada', descricao: 'Escrita livre sem filtro consciente.', rota: '/casa-das-maquinas/ferramentas/escrita-nao-censurada', portalMinimo: 'aluna_formacao', categoria: 'narrativas' },
  { id: 'cm-corpo', nome: 'Corpo Inconsciente', descricao: 'Mapeamento corporal simbólico.', rota: '/casa-das-maquinas/ferramentas/corpo-inconsciente', portalMinimo: 'aluna_formacao', categoria: 'cartografia' },
];

const mapDBCategory = (tipo: string | null): CategoryKey => {
  if (!tipo) return 'diagnostico';
  if (['diagnostico', 'autoleitura'].includes(tipo)) return 'diagnostico';
  if (['arquetipos'].includes(tipo)) return 'arquetipos';
  if (['sombra', 'ritual_simbolico'].includes(tipo)) return 'sombras';
  if (['ferramenta_narrativa', 'conducao_terapeutica'].includes(tipo)) return 'narrativas';
  if (['leitura_simbolica', 'oraculo'].includes(tipo)) return 'oraculos';
  if (['cartografia', 'mapeamento'].includes(tipo)) return 'cartografia';
  return 'diagnostico';
};

export default function FerramentasPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('todas');
  const userPortal = (user?.portal || 'visitante') as PortalType;
  const isAdmin = userPortal === 'admin';

  // Fetch DB ferramentas — 100% database-driven
  const { data: dbFerramentas, isLoading } = useQuery({
    queryKey: ['cm-ferramentas-db'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, tipo_ferramenta, portal_minimo, ordem, e_complementar')
        .eq('ativa', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const hasAccess = (minPortal: string) => isAdmin || canAccessFeature(userPortal, minPortal as PortalType);

  // Merge clinical-only tools + DB tools, dedup
  const allTools = (() => {
    const clinicalIds = new Set(CLINICAL_TOOLS.map(t => t.id));
    const dbMapped = (dbFerramentas || [])
      .filter(t => t.rota && !clinicalIds.has(t.id) && !t.e_complementar)
      .map(t => ({
        id: t.id,
        nome: t.ferramenta_nome,
        descricao: t.ferramenta_descricao || '',
        rota: t.rota!,
        portalMinimo: t.portal_minimo,
        categoria: mapDBCategory(t.tipo_ferramenta),
        isPlaceholder: false,
      } as ToolItem));
    return [...CLINICAL_TOOLS, ...dbMapped];
  })();

  const filtered = activeCategory === 'todas' ? allTools : allTools.filter(t => t.categoria === activeCategory);

  if (isLoading) {
    return (
      <CasaMaquinasLayout title="Ferramentas">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Ferramentas Clínicas" subtitle="Instrumentos clínicos do Método Orácula">
      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin md:flex-wrap md:overflow-visible">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'shrink-0 px-3 py-2 min-h-[40px] rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 whitespace-nowrap',
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
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filtered.map(t => {
          const accessible = hasAccess(t.portalMinimo);
          const catMeta = CATEGORIES.find(c => c.key === t.categoria);
          const CatIcon = catMeta?.icon || Sparkles;

          return (
            <Card
              key={t.id}
              className={cn(
                'border-border/20 bg-card/60 transition-all group',
                accessible ? 'hover:border-primary/30 cursor-pointer' : 'opacity-50',
                t.isPlaceholder && 'opacity-60'
              )}
              onClick={() => {
                if (accessible && !t.isPlaceholder) navigate(t.rota);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <CatIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t.nome}
                    </h3>
                  </div>
                  {!accessible ? (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : t.isPlaceholder ? (
                    <Badge variant="outline" className="text-[8px] border-border/30 text-muted-foreground">em breve</Badge>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{t.descricao}</p>
                <Badge variant="outline" className="text-[9px] border-border/20 text-muted-foreground">
                  {catMeta?.label || 'Geral'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </CasaMaquinasLayout>
  );
}
