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
// Same categories & fixed tools as FerramentasHub — clinical context
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

interface ToolItem {
  id: string;
  nome: string;
  descricao: string;
  rota: string;
  portalMinimo: string;
  categoria: CategoryKey;
  isPlaceholder?: boolean;
}

const FIXED_TOOLS: ToolItem[] = [
  { id: 'cartografia-psiquica-oracula', nome: 'Cartografia Psíquica Orácula', descricao: 'Mapeamento simbólico dos territórios da psique com geração da CidaDELA Interior.', rota: '/ferramenta/cartografia-psiquica-oracula', portalMinimo: 'visitante', categoria: 'diagnostico' },
  { id: 'cm-cartografia', nome: 'Cartografia Psíquica (Clínica)', descricao: 'Cartografia Big Five simbólico — 30 perguntas, 5 territórios.', rota: '/casa-das-maquinas/ferramentas/cartografia', portalMinimo: 'oracula', categoria: 'diagnostico' },
  { id: 'cm-torre-viva', nome: 'Torre Viva', descricao: 'Identificação da torre predominante da cliente.', rota: '/casa-das-maquinas/ferramentas/torre-viva', portalMinimo: 'oracula', categoria: 'sombras' },
  { id: 'cm-labirinto', nome: 'Labirinto das 39 Portas', descricao: 'Protocolo de leitura simbólica — onde a psique está.', rota: '/casa-das-maquinas/ferramentas/labirinto', portalMinimo: 'oracula', categoria: 'diagnostico' },
  { id: 'cm-atlas', nome: 'Atlas de Arquétipos', descricao: 'Mapeamento dos arquétipos dominantes e latentes.', rota: '/casa-das-maquinas/ferramentas/atlas-arquetipos', portalMinimo: 'oracula', categoria: 'arquetipos' },
  { id: 'cm-decodificacao', nome: 'Decodificação Onírica', descricao: 'Análise simbólica de sonhos.', rota: '/casa-das-maquinas/ferramentas/decodificacao-onirica', portalMinimo: 'oracula', categoria: 'narrativas' },
  { id: 'cm-escrita', nome: 'Escrita Simbólica', descricao: 'Ferramenta narrativa simbólica.', rota: '/casa-das-maquinas/ferramentas/escrita-simbolica', portalMinimo: 'oracula', categoria: 'narrativas', isPlaceholder: true },
  { id: 'cm-espelho', nome: 'Espelho Relacional', descricao: 'Mapeamento de projeções e espelhamentos.', rota: '/casa-das-maquinas/ferramentas/espelho-relacional', portalMinimo: 'oracula', categoria: 'sombras', isPlaceholder: true },
  { id: 'cm-ritual', nome: 'Ritual Simbólico', descricao: 'Protocolo de integração ritualística.', rota: '/casa-das-maquinas/ferramentas/ritual-simbolico', portalMinimo: 'oracula', categoria: 'sombras', isPlaceholder: true },
  { id: 'cm-dialogo', nome: 'Diálogo com Partes', descricao: 'Conselho das partes internas.', rota: '/casa-das-maquinas/ferramentas/dialogo-partes', portalMinimo: 'oracula', categoria: 'arquetipos', isPlaceholder: true },
  { id: 'cm-mapa-transf', nome: 'Mapa de Transformação', descricao: 'Cartografia de evolução terapêutica.', rota: '/casa-das-maquinas/ferramentas/mapa-transformacao', portalMinimo: 'oracula', categoria: 'cartografia', isPlaceholder: true },
  { id: 'cm-ritual-passagem', nome: 'Ritual de Passagem', descricao: 'Protocolo de fechamento e transição.', rota: '/casa-das-maquinas/ferramentas/ritual-passagem', portalMinimo: 'oracula', categoria: 'sombras', isPlaceholder: true },
];

// Clinical tools with :clienteId param
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

  // Also fetch DB ferramentas from sala_ferramentas
  const { data: dbFerramentas, isLoading } = useQuery({
    queryKey: ['cm-ferramentas-db'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, tipo_ferramenta, portal_minimo, ordem')
        .eq('ativa', true)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const hasAccess = (minPortal: string) => isAdmin || canAccessFeature(userPortal, minPortal as PortalType);

  // Merge fixed + clinical + DB, dedup
  const allTools = (() => {
    const fixedIds = new Set([...FIXED_TOOLS, ...CLINICAL_TOOLS].map(t => t.id));
    const dbMapped = (dbFerramentas || [])
      .filter(t => t.rota && !fixedIds.has(t.id))
      .map(t => ({
        id: t.id,
        nome: t.ferramenta_nome,
        descricao: t.ferramenta_descricao || '',
        rota: t.rota!,
        portalMinimo: t.portal_minimo,
        categoria: mapDBCategory(t.tipo_ferramenta),
        isPlaceholder: false,
      } as ToolItem));
    return [...FIXED_TOOLS, ...CLINICAL_TOOLS, ...dbMapped];
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
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5',
                activeCategory === cat.key
                  ? 'bg-primary/10 border-primary/30 text-primary'
                  : 'bg-card/50 border-border/30 text-muted-foreground hover:border-primary/20 hover:text-foreground'
              )}
            >
              <Icon className="w-3 h-3" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
