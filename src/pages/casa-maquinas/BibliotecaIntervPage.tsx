import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Loader2, Search, Heart, BookOpen, Sparkles, Shield, Pen, ArrowRight,
  Target, HelpCircle, Package, MapPin, ChevronRight, Play, X, Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_LABELS: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  pergunta_clinica: { label: 'Pergunta Clínica', icon: HelpCircle, color: '#C9A24A' },
  micro_ritual: { label: 'Micro Ritual', icon: Sparkles, color: '#6366F1' },
  exercicio_narrativo: { label: 'Exercício Narrativo', icon: Pen, color: '#556B57' },
  intervencao_simbolica: { label: 'Intervenção Simbólica', icon: Shield, color: '#E879A0' },
};

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

interface Intervention {
  id: string;
  title: string;
  content: string;
  descricao_breve: string | null;
  objetivo: string | null;
  passo_a_passo: string | null;
  perguntas_chave: string[] | null;
  materiais: string[] | null;
  arquetipos_relacionados: string[] | null;
  type: string;
  level: string;
  district_id: string | null;
  archetype_key: string | null;
  tower_key: string | null;
  tags: string[] | null;
  contraindications: string | null;
  ativa: boolean;
  usage_count: number | null;
}

export default function BibliotecaIntervPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterArchetype, setFilterArchetype] = useState('all');
  const [tab, setTab] = useState('todas');
  const [selected, setSelected] = useState<Intervention | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const [intRes, distRes, favRes] = await Promise.all([
      supabase.from('interventions').select('*').eq('ativa', true).order('title'),
      supabase.from('districts').select('id, nome, numero').order('numero'),
      user
        ? supabase.from('intervention_favorites').select('intervention_id').eq('user_id', user.id)
        : Promise.resolve({ data: [] }),
    ]);
    setInterventions((intRes.data as Intervention[]) || []);
    setDistricts(distRes.data || []);
    setFavorites(new Set((favRes.data || []).map((f: any) => f.intervention_id)));
    setLoading(false);
  };

  const toggleFavorite = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!user) return;
    if (favorites.has(id)) {
      await supabase.from('intervention_favorites').delete().eq('user_id', user.id).eq('intervention_id', id);
      setFavorites(prev => { const n = new Set(prev); n.delete(id); return n; });
      toast.success('Removida dos favoritos');
    } else {
      await supabase.from('intervention_favorites').insert({ user_id: user.id, intervention_id: id });
      setFavorites(prev => new Set(prev).add(id));
      toast.success('Adicionada aos favoritos');
    }
  };

  // Collect unique archetypes for filter
  const allArchetypes = Array.from(new Set(
    interventions.flatMap(i => [
      ...(i.arquetipos_relacionados || []),
      ...(i.archetype_key ? [i.archetype_key] : []),
    ]).filter(Boolean)
  )).sort();

  const distMap = Object.fromEntries(districts.map((d: any) => [d.id, d.nome]));

  const filtered = interventions.filter(i => {
    if (tab === 'favoritas' && !favorites.has(i.id)) return false;
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (filterLevel !== 'all' && i.level !== filterLevel) return false;
    if (filterDistrict !== 'all' && i.district_id !== filterDistrict) return false;
    if (filterArchetype !== 'all') {
      const arqs = [...(i.arquetipos_relacionados || []), ...(i.archetype_key ? [i.archetype_key] : [])];
      if (!arqs.includes(filterArchetype)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const searchable = [i.title, i.content, i.descricao_breve, i.objetivo, ...(i.tags || [])].filter(Boolean).join(' ').toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const handleUseInSession = (intervention: Intervention) => {
    // Navigate to new session mode — could pre-select intervention via query param
    toast.info('Selecione um cliente para iniciar a sessão');
    navigate('/casa-das-maquinas/clientes');
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Biblioteca de Intervenções">
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Biblioteca de Intervenções" subtitle="Catálogo de ferramentas e protocolos do Método Orácula">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <TabsList className="bg-[#0B1B2B]/80 border border-[#C9A24A]/10">
            <TabsTrigger value="todas" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 text-xs">
              Todas ({interventions.length})
            </TabsTrigger>
            <TabsTrigger value="favoritas" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60 text-xs">
              <Heart className="w-3 h-3 mr-1" /> Favoritas ({favorites.size})
            </TabsTrigger>
          </TabsList>
          <p className="text-xs text-[#F5F1E8]/30">
            {filtered.length} intervenç{filtered.length === 1 ? 'ão' : 'ões'} encontrada{filtered.length === 1 ? '' : 's'}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, palavra-chave ou tag..."
              className="pl-9 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] placeholder:text-[#F5F1E8]/25"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="w-3.5 h-3.5 text-[#F5F1E8]/20" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[155px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[135px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-[155px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os distritos</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.numero}. {d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {allArchetypes.length > 0 && (
              <Select value={filterArchetype} onValueChange={setFilterArchetype}>
                <SelectTrigger className="w-[155px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
                  <SelectValue placeholder="Arquétipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os arquétipos</SelectItem>
                  {allArchetypes.map(a => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {(filterType !== 'all' || filterLevel !== 'all' || filterDistrict !== 'all' || filterArchetype !== 'all' || search) && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] text-[#C9A24A]/50 hover:text-[#C9A24A] h-7"
                onClick={() => { setFilterType('all'); setFilterLevel('all'); setFilterDistrict('all'); setFilterArchetype('all'); setSearch(''); }}
              >
                <X className="w-3 h-3 mr-1" /> Limpar
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="todas">
          <InterventionGrid
            items={filtered}
            favorites={favorites}
            onToggleFav={toggleFavorite}
            distMap={distMap}
            onSelect={setSelected}
          />
        </TabsContent>
        <TabsContent value="favoritas">
          <InterventionGrid
            items={filtered}
            favorites={favorites}
            onToggleFav={toggleFavorite}
            distMap={distMap}
            onSelect={setSelected}
          />
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl bg-[#0B1B2B] border-[#C9A24A]/15 max-h-[85vh] p-0">
          {selected && (
            <InterventionDetail
              item={selected}
              isFavorite={favorites.has(selected.id)}
              onToggleFav={() => toggleFavorite(selected.id)}
              distMap={distMap}
              onUseInSession={() => handleUseInSession(selected)}
              onClose={() => setSelected(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </CasaMaquinasLayout>
  );
}

/* ─── Grid Component ─── */
function InterventionGrid({ items, favorites, onToggleFav, distMap, onSelect }: {
  items: Intervention[];
  favorites: Set<string>;
  onToggleFav: (id: string, e?: React.MouseEvent) => void;
  distMap: Record<string, string>;
  onSelect: (item: Intervention) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-8 h-8 text-[#F5F1E8]/10 mx-auto mb-3" />
        <p className="text-[#F5F1E8]/30 text-sm">Nenhuma intervenção encontrada</p>
        <p className="text-[#F5F1E8]/15 text-xs mt-1">Tente ajustar os filtros</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
    >
      {items.map((item, i) => {
        const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.pergunta_clinica;
        const Icon = typeInfo.icon;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card
              className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 hover:border-[#C9A24A]/25 transition-all cursor-pointer group h-full"
              onClick={() => onSelect(item)}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${typeInfo.color}12` }}>
                    <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onToggleFav(item.id, e)}
                    className="shrink-0 h-7 w-7 p-0 opacity-50 hover:opacity-100"
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.has(item.id) ? 'fill-[#C9A24A] text-[#C9A24A]' : 'text-[#F5F1E8]/30'}`} />
                  </Button>
                </div>

                <h4 className="text-sm font-medium text-[#F5F1E8] mb-1 line-clamp-2 leading-snug">{item.title}</h4>
                <p className="text-xs text-[#F5F1E8]/40 line-clamp-2 leading-relaxed flex-1">
                  {item.descricao_breve || item.content}
                </p>

                <div className="flex flex-wrap gap-1 mt-3">
                  <Badge variant="outline" className="text-[8px] py-0 px-1.5" style={{ borderColor: `${typeInfo.color}25`, color: typeInfo.color }}>
                    {typeInfo.label}
                  </Badge>
                  <Badge variant="outline" className="text-[8px] py-0 px-1.5 border-[#F5F1E8]/8 text-[#F5F1E8]/25">
                    {LEVEL_LABELS[item.level] || item.level}
                  </Badge>
                  {item.district_id && distMap[item.district_id] && (
                    <Badge variant="outline" className="text-[8px] py-0 px-1.5 border-[#556B57]/20 text-[#556B57]">
                      <MapPin className="w-2 h-2 mr-0.5" />
                      {distMap[item.district_id]}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-end mt-2">
                  <span className="text-[10px] text-[#C9A24A]/40 group-hover:text-[#C9A24A]/70 transition-colors flex items-center gap-0.5">
                    Ver detalhes <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ─── Detail Component ─── */
function InterventionDetail({ item, isFavorite, onToggleFav, distMap, onUseInSession, onClose }: {
  item: Intervention;
  isFavorite: boolean;
  onToggleFav: () => void;
  distMap: Record<string, string>;
  onUseInSession: () => void;
  onClose: () => void;
}) {
  const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.pergunta_clinica;
  const Icon = typeInfo.icon;

  return (
    <ScrollArea className="max-h-[85vh]">
      <div className="p-6 space-y-5">
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${typeInfo.color}15` }}>
              <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-[#F5F1E8] text-lg leading-snug">{item.title}</DialogTitle>
              <DialogDescription className="text-[#F5F1E8]/40 text-xs mt-1">
                {typeInfo.label} · {LEVEL_LABELS[item.level] || item.level}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {item.district_id && distMap[item.district_id] && (
            <Badge variant="outline" className="text-[10px] border-[#556B57]/25 text-[#556B57]">
              <MapPin className="w-2.5 h-2.5 mr-0.5" />
              {distMap[item.district_id]}
            </Badge>
          )}
          {(item.arquetipos_relacionados || []).map(arq => (
            <Badge key={arq} variant="outline" className="text-[10px] border-[#C9A24A]/20 text-[#C9A24A]/70">
              <Sparkles className="w-2.5 h-2.5 mr-0.5" />
              {arq}
            </Badge>
          ))}
          {item.archetype_key && !item.arquetipos_relacionados?.includes(item.archetype_key) && (
            <Badge variant="outline" className="text-[10px] border-[#C9A24A]/20 text-[#C9A24A]/70">
              <Sparkles className="w-2.5 h-2.5 mr-0.5" />
              {item.archetype_key}
            </Badge>
          )}
          {(item.tags || []).map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] border-[#F5F1E8]/8 text-[#F5F1E8]/25">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="bg-[#C9A24A]/8" />

        {/* Descrição Completa */}
        <Section title="Descrição" icon={<BookOpen className="w-3.5 h-3.5" />}>
          <p className="text-xs text-[#F5F1E8]/60 leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </Section>

        {/* Objetivo */}
        {item.objetivo && (
          <Section title="Objetivo Terapêutico" icon={<Target className="w-3.5 h-3.5" />}>
            <p className="text-xs text-[#F5F1E8]/60 leading-relaxed">{item.objetivo}</p>
          </Section>
        )}

        {/* Passo a Passo */}
        {item.passo_a_passo && (
          <Section title="Passo a Passo" icon={<Play className="w-3.5 h-3.5" />}>
            <div className="text-xs text-[#F5F1E8]/60 leading-relaxed whitespace-pre-wrap">{item.passo_a_passo}</div>
          </Section>
        )}

        {/* Perguntas Chave */}
        {item.perguntas_chave && item.perguntas_chave.length > 0 && (
          <Section title="Perguntas Chave" icon={<HelpCircle className="w-3.5 h-3.5" />}>
            <ul className="space-y-1.5">
              {item.perguntas_chave.map((p, i) => (
                <li key={i} className="text-xs text-[#F5F1E8]/60 leading-relaxed flex gap-2">
                  <span className="text-[#C9A24A]/40 shrink-0">{i + 1}.</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Materiais */}
        {item.materiais && item.materiais.length > 0 && (
          <Section title="Materiais Necessários" icon={<Package className="w-3.5 h-3.5" />}>
            <ul className="space-y-1">
              {item.materiais.map((m, i) => (
                <li key={i} className="text-xs text-[#F5F1E8]/60 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C9A24A]/30 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Contraindicações */}
        {item.contraindications && (
          <Section title="Contraindicações" icon={<Shield className="w-3.5 h-3.5" />}>
            <p className="text-xs text-red-400/60 leading-relaxed italic">⚠ {item.contraindications}</p>
          </Section>
        )}

        <Separator className="bg-[#C9A24A]/8" />

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs border-[#C9A24A]/15 text-[#C9A24A]/70 hover:text-[#C9A24A] hover:bg-[#C9A24A]/10"
            onClick={onToggleFav}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`} />
            {isFavorite ? 'Favorita' : 'Favoritar'}
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B] ml-auto"
            onClick={onUseInSession}
          >
            <Play className="w-3.5 h-3.5" />
            Usar na Sessão
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

/* ─── Section helper ─── */
function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[#C9A24A]/60 uppercase tracking-wider flex items-center gap-1.5 mb-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}
