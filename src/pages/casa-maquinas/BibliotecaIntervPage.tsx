import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Search, Heart, BookOpen, Sparkles, Shield, Pen } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_LABELS: Record<string, { label: string; icon: typeof BookOpen; color: string }> = {
  pergunta_clinica: { label: 'Pergunta Clínica', icon: BookOpen, color: '#C9A24A' },
  micro_ritual: { label: 'Micro Ritual', icon: Sparkles, color: '#6366F1' },
  exercicio_narrativo: { label: 'Exercício Narrativo', icon: Pen, color: '#556B57' },
  intervencao_simbolica: { label: 'Intervenção Simbólica', icon: Shield, color: '#E879A0' },
};

const LEVEL_LABELS: Record<string, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export default function BibliotecaIntervPage() {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [tab, setTab] = useState('todas');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const [intRes, distRes, favRes] = await Promise.all([
      supabase.from('interventions').select('*').eq('ativa', true).order('title'),
      supabase.from('districts').select('id, nome, numero').order('numero'),
      user ? supabase.from('intervention_favorites').select('intervention_id').eq('user_id', user.id) : Promise.resolve({ data: [] }),
    ]);
    setInterventions(intRes.data || []);
    setDistricts(distRes.data || []);
    setFavorites(new Set((favRes.data || []).map((f: any) => f.intervention_id)));
    setLoading(false);
  };

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

  const filtered = interventions.filter(i => {
    if (tab === 'favoritas' && !favorites.has(i.id)) return false;
    if (filterType !== 'all' && i.type !== filterType) return false;
    if (filterLevel !== 'all' && i.level !== filterLevel) return false;
    if (filterDistrict !== 'all' && i.district_id !== filterDistrict) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.content.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <CasaMaquinasLayout title="Biblioteca de Intervenções">
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Biblioteca de Intervenções" subtitle="Perguntas, rituais, exercícios e intervenções">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-[#0B1B2B]/80 border border-[#C9A24A]/10 mb-4">
          <TabsTrigger value="todas" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60">
            Todas
          </TabsTrigger>
          <TabsTrigger value="favoritas" className="data-[state=active]:bg-[#C9A24A]/15 data-[state=active]:text-[#C9A24A] text-[#F5F1E8]/60">
            <Heart className="w-3 h-3 mr-1" /> Favoritas
          </TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5F1E8]/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar intervenção..." className="pl-9 bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
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
              <SelectTrigger className="w-[140px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
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
              <SelectTrigger className="w-[160px] bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8] h-8 text-xs">
                <SelectValue placeholder="Distrito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os distritos</SelectItem>
                {districts.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.numero}. {d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="todas"><InterventionList items={filtered} favorites={favorites} onToggleFav={toggleFavorite} districts={districts} /></TabsContent>
        <TabsContent value="favoritas"><InterventionList items={filtered} favorites={favorites} onToggleFav={toggleFavorite} districts={districts} /></TabsContent>
      </Tabs>
    </CasaMaquinasLayout>
  );
}

function InterventionList({ items, favorites, onToggleFav, districts }: {
  items: any[]; favorites: Set<string>; onToggleFav: (id: string) => void; districts: any[];
}) {
  if (items.length === 0) {
    return <p className="text-center text-[#F5F1E8]/30 py-16 text-sm">Nenhuma intervenção encontrada</p>;
  }

  const distMap = Object.fromEntries(districts.map((d: any) => [d.id, d.nome]));

  return (
    <div className="space-y-3">
      {items.map(item => {
        const typeInfo = TYPE_LABELS[item.type] || TYPE_LABELS.pergunta_clinica;
        const Icon = typeInfo.icon;
        return (
          <Card key={item.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 hover:border-[#C9A24A]/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${typeInfo.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium text-[#F5F1E8] truncate">{item.title}</h4>
                    <p className="text-xs text-[#F5F1E8]/45 mt-1 line-clamp-2 leading-relaxed">{item.content}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <Badge variant="outline" className="text-[8px] py-0" style={{ borderColor: `${typeInfo.color}30`, color: typeInfo.color }}>
                        {typeInfo.label}
                      </Badge>
                      <Badge variant="outline" className="text-[8px] py-0 border-[#F5F1E8]/10 text-[#F5F1E8]/30">
                        {LEVEL_LABELS[item.level] || item.level}
                      </Badge>
                      {item.district_id && distMap[item.district_id] && (
                        <Badge variant="outline" className="text-[8px] py-0 border-[#556B57]/20 text-[#556B57]">
                          {distMap[item.district_id]}
                        </Badge>
                      )}
                    </div>
                    {item.contraindications && (
                      <p className="text-[10px] text-red-400/50 mt-2 italic">⚠ {item.contraindications}</p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onToggleFav(item.id)} className="shrink-0 h-8 w-8 p-0">
                  <Heart className={`w-4 h-4 ${favorites.has(item.id) ? 'fill-[#C9A24A] text-[#C9A24A]' : 'text-[#F5F1E8]/20'}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
