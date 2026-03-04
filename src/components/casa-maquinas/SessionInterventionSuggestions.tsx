import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BookOpen, Sparkles, Shield, Pen, Heart, Plus, Filter, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { rankInterventions, ScoringContext, ScoredIntervention } from '@/lib/motor-sugestoes';

const TYPE_ICONS: Record<string, { icon: typeof BookOpen; color: string; label: string }> = {
  pergunta_clinica: { icon: BookOpen, color: '#C9A24A', label: 'Pergunta Clínica' },
  micro_ritual: { icon: Sparkles, color: '#6366F1', label: 'Micro Ritual' },
  exercicio_narrativo: { icon: Pen, color: '#556B57', label: 'Exercício Narrativo' },
  intervencao_simbolica: { icon: Shield, color: '#E879A0', label: 'Intervenção Simbólica' },
};

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

interface Props {
  /** District selected for this session */
  sessionDistrictId?: string | null;
  /** Client's current active district */
  clientDistrictId?: string | null;
  /** Client ID for usage history */
  clientId?: string | null;
  /** Check-in emotional state */
  checkinState?: string | null;
  /** Predominant tower key */
  towerKey?: string | null;
  /** Active archetype key */
  archetypeKey?: string | null;
  /** Oracle card used in session (optional) */
  oracleCard?: { district_id?: string | null; family?: string } | null;
  /** Session ID for recording usage */
  sessionId?: string | null;
  /** Callback when an intervention is used */
  onUse?: (interventionId: string) => void;
}

export function SessionInterventionSuggestions({
  sessionDistrictId,
  clientDistrictId,
  clientId,
  checkinState,
  towerKey,
  archetypeKey,
  oracleCard,
  sessionId,
  onUse,
}: Props) {
  const { user } = useAuth();
  const [allInterventions, setAllInterventions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showFavs, setShowFavs] = useState(false);
  const [lastSessionIds, setLastSessionIds] = useState<string[]>([]);
  const [usageMap, setUsageMap] = useState<Record<string, number>>({});
  const [districts, setDistricts] = useState<any[]>([]);

  // Manual filter overrides
  const [filterType, setFilterType] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const hasManualFilters = filterType !== 'all' || filterDistrict !== 'all' || filterLevel !== 'all';

  useEffect(() => {
    loadData();
  }, [user, clientId]);

  const loadData = async () => {
    if (!user) return;

    const promises: Promise<any>[] = [
      // All active interventions
      supabase.from('interventions').select('*').eq('ativa', true).order('title'),
      // Favorites
      supabase.from('intervention_favorites').select('intervention_id').eq('user_id', user.id),
      // Districts for filter
      supabase.from('districts').select('id, nome, numero').order('numero'),
    ];

    // Usage history for this client
    if (clientId) {
      promises.push(
        supabase
          .from('sessions')
          .select('used_intervention_ids')
          .eq('client_id', clientId)
          .order('date', { ascending: false })
          .limit(20)
      );
    }

    const results = await Promise.all(promises);

    setAllInterventions(results[0].data || []);
    setFavorites(new Set((results[1].data || []).map((f: any) => f.intervention_id)));
    setDistricts(results[2].data || []);

    // Build usage map & last session IDs
    if (clientId && results[3]?.data) {
      const sessionsData = results[3].data as any[];
      const uMap: Record<string, number> = {};
      let lastIds: string[] = [];

      sessionsData.forEach((s, idx) => {
        const ids = s.used_intervention_ids || [];
        if (idx === 0) lastIds = ids;
        ids.forEach((id: string) => {
          uMap[id] = (uMap[id] || 0) + 1;
        });
      });

      setUsageMap(uMap);
      setLastSessionIds(lastIds);
    }

    setLoading(false);
  };

  // Scored suggestions using the Motor de Sugestões
  const scoredSuggestions = useMemo<ScoredIntervention[]>(() => {
    if (allInterventions.length === 0) return [];

    // If manual filters are active, bypass scoring
    if (hasManualFilters) {
      const filtered = allInterventions.filter(i => {
        if (filterType !== 'all' && i.type !== filterType) return false;
        if (filterDistrict !== 'all' && i.district_id !== filterDistrict) return false;
        if (filterLevel !== 'all' && i.level !== filterLevel) return false;
        return true;
      });
      return filtered.slice(0, 5).map(i => ({ intervention: i, score: 0, reasons: ['filtro manual'] }));
    }

    const ctx: ScoringContext = {
      sessionDistrictId: sessionDistrictId || undefined,
      clientDistrictId: clientDistrictId || undefined,
      towerKey: towerKey || undefined,
      checkinState: checkinState || undefined,
      archetypeKey: archetypeKey || undefined,
      oracleCard: oracleCard || undefined,
      lastSessionInterventionIds: lastSessionIds,
      usageCountMap: usageMap,
    };

    return rankInterventions(allInterventions, ctx, 5);
  }, [allInterventions, sessionDistrictId, clientDistrictId, towerKey, checkinState, archetypeKey, oracleCard, lastSessionIds, usageMap, hasManualFilters, filterType, filterDistrict, filterLevel]);

  const toggleFavorite = async (id: string) => {
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

  const useIntervention = async (interventionId: string) => {
    // Record in session_interventions if session exists
    if (sessionId) {
      await supabase.from('session_interventions').insert({
        session_id: sessionId,
        intervention_id: interventionId,
      });
    }
    // Increment usage_count
    const current = allInterventions.find(i => i.id === interventionId);
    if (current) {
      await supabase
        .from('interventions')
        .update({ usage_count: (current.usage_count || 0) + 1 })
        .eq('id', interventionId);
    }
    onUse?.(interventionId);
    toast.success('Intervenção adicionada à sessão');
  };

  if (loading) {
    return (
      <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
        <CardContent className="p-3 flex items-center justify-center gap-2 text-[#F5F1E8]/30">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-[10px]">Carregando sugestões…</span>
        </CardContent>
      </Card>
    );
  }

  // Favorite items
  const favItems = showFavs
    ? allInterventions.filter(i => favorites.has(i.id))
    : [];

  const displayItems = showFavs ? favItems : scoredSuggestions;
  const distMap = Object.fromEntries(districts.map((d: any) => [d.id, d.nome]));

  if (displayItems.length === 0 && scoredSuggestions.length === 0) return null;

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mt-3">
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-[#C9A24A]/50" />
            <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 font-semibold">
              {showFavs ? 'Minhas Favoritas' : hasManualFilters ? 'Filtro Manual' : 'Sugestões da Biblioteca Orácula'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-6 px-2 text-[9px] ${showFilters ? 'text-[#C9A24A]' : 'text-[#C9A24A]/50'}`}
            >
              <Filter className="w-3 h-3 mr-1" />
              Filtros
            </Button>
            {favorites.size > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setShowFavs(!showFavs)} className="h-6 px-2 text-[9px] text-[#C9A24A]/50">
                <Heart className={`w-3 h-3 mr-1 ${showFavs ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`} />
                {showFavs ? 'Sugestões' : 'Favoritas'}
              </Button>
            )}
          </div>
        </div>

        {/* Manual filters */}
        {showFilters && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px] bg-[#0B1B2B]/80 border-[#C9A24A]/10 text-[#F5F1E8] h-6 text-[9px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos tipos</SelectItem>
                {Object.entries(TYPE_ICONS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[100px] bg-[#0B1B2B]/80 border-[#C9A24A]/10 text-[#F5F1E8] h-6 text-[9px]">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-[120px] bg-[#0B1B2B]/80 border-[#C9A24A]/10 text-[#F5F1E8] h-6 text-[9px]">
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasManualFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[9px] text-red-400/60"
                onClick={() => { setFilterType('all'); setFilterLevel('all'); setFilterDistrict('all'); }}
              >
                Limpar
              </Button>
            )}
          </div>
        )}

        {/* Intervention list */}
        <div className="space-y-1.5">
          {(showFavs ? favItems.map(i => ({ intervention: i, score: 0, reasons: [] as string[] })) : scoredSuggestions).map(({ intervention: item, score, reasons }) => {
            const ti = TYPE_ICONS[item.type] || TYPE_ICONS.pergunta_clinica;
            const Icon = ti.icon;
            const usageCount = usageMap[item.id] || 0;
            return (
              <div key={item.id} className="flex items-start gap-2 py-2 px-2 rounded-md bg-[#F5F1E8]/[0.02] hover:bg-[#F5F1E8]/[0.04] transition-colors">
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${ti.color}15` }}>
                  <Icon className="w-3 h-3" style={{ color: ti.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11px] text-[#F5F1E8]/70 font-medium truncate">{item.title}</p>
                    {!showFavs && score > 0 && (
                      <Badge variant="outline" className="text-[7px] py-0 px-1 border-[#C9A24A]/20 text-[#C9A24A]/50 shrink-0">
                        +{score}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-[#F5F1E8]/40 line-clamp-2 mt-0.5 leading-relaxed">{item.content}</p>
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-[7px] py-0" style={{ borderColor: `${ti.color}30`, color: ti.color }}>
                      {ti.label}
                    </Badge>
                    <Badge variant="outline" className="text-[7px] py-0 border-[#F5F1E8]/10 text-[#F5F1E8]/25">
                      {LEVEL_LABELS[item.level] || item.level}
                    </Badge>
                    {item.district_id && distMap[item.district_id] && (
                      <Badge variant="outline" className="text-[7px] py-0 border-[#556B57]/20 text-[#556B57]/60">
                        {distMap[item.district_id]}
                      </Badge>
                    )}
                    {usageCount >= 3 && (
                      <span className="text-[8px] text-amber-400/60">↻ {usageCount}×</span>
                    )}
                  </div>
                  {!showFavs && reasons.length > 0 && (
                    <p className="text-[8px] text-[#C9A24A]/30 mt-1 italic">
                      {reasons.join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {onUse && (
                    <Button variant="ghost" size="sm" onClick={() => useIntervention(item.id)} className="h-6 px-1.5 text-[#C9A24A]/50 hover:text-[#C9A24A]" title="Usar na sessão">
                      <Plus className="w-3 h-3" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item.id)} className="h-6 px-1.5" title="Favoritar">
                    <Heart className={`w-3 h-3 ${favorites.has(item.id) ? 'fill-[#C9A24A] text-[#C9A24A]' : 'text-[#F5F1E8]/20'}`} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {displayItems.length === 0 && (
          <p className="text-center text-[#F5F1E8]/20 text-[10px] py-4">Nenhuma intervenção encontrada</p>
        )}
      </CardContent>
    </Card>
  );
}
