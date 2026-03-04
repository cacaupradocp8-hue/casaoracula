import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Sparkles, Shield, Pen, Heart, Plus } from 'lucide-react';
import { toast } from 'sonner';

const TYPE_ICONS: Record<string, { icon: typeof BookOpen; color: string }> = {
  pergunta_clinica: { icon: BookOpen, color: '#C9A24A' },
  micro_ritual: { icon: Sparkles, color: '#6366F1' },
  exercicio_narrativo: { icon: Pen, color: '#556B57' },
  intervencao_simbolica: { icon: Shield, color: '#E879A0' },
};

interface Props {
  districtId?: string;
  checkinState?: string;
  onUse?: (interventionId: string) => void;
}

export function SessionInterventionSuggestions({ districtId, checkinState, onUse }: Props) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    loadSuggestions();
  }, [districtId, user]);

  const loadSuggestions = async () => {
    if (!user) return;

    // Prioritize level based on check-in state
    const preferredLevel = checkinState === 'instavel' ? 'basico'
      : checkinState === 'presente' ? 'intermediario'
      : null;

    // Load suggestions matching district + preferred level first
    let items: any[] = [];
    if (districtId) {
      let q = supabase.from('interventions').select('*').eq('ativa', true).eq('district_id', districtId);
      if (preferredLevel) q = q.eq('level', preferredLevel);
      const { data } = await q.order('title').limit(5);
      items = data || [];

      // Fill with same district, any level
      if (items.length < 5) {
        const existingIds = items.map(i => i.id);
        const { data: more } = await supabase.from('interventions').select('*')
          .eq('ativa', true).eq('district_id', districtId)
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('title').limit(5 - items.length);
        items = [...items, ...(more || [])];
      }
    }

    // Fill remaining with general items
    if (items.length < 5) {
      const existingIds = items.map(i => i.id);
      const { data: general } = await supabase.from('interventions').select('*').eq('ativa', true)
        .not('id', 'in', `(${existingIds.length ? existingIds.join(',') : '00000000-0000-0000-0000-000000000000'})`)
        .order('title').limit(5 - items.length);
      items = [...items, ...(general || [])];
    }

    setSuggestions(items.slice(0, 5));

    // Load favorites
    const { data: favIds } = await supabase
      .from('intervention_favorites').select('intervention_id').eq('user_id', user.id);
    if (favIds?.length) {
      const ids = favIds.map(f => f.intervention_id);
      const { data: favItems } = await supabase
        .from('interventions').select('*').in('id', ids).eq('ativa', true).limit(10);
      setFavorites(favItems || []);
    }

    setLoading(false);
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

  const displayItems = showFavs ? favorites : suggestions;

  if (displayItems.length === 0 && suggestions.length === 0) return null;

  return (
    <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 mt-3">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 font-semibold">
            {showFavs ? 'Minhas Favoritas' : 'Sugestões da Biblioteca'}
          </span>
          {favorites.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setShowFavs(!showFavs)} className="h-6 px-2 text-[9px] text-[#C9A24A]/50">
              <Heart className={`w-3 h-3 mr-1 ${showFavs ? 'fill-[#C9A24A] text-[#C9A24A]' : ''}`} />
              {showFavs ? 'Ver sugestões' : 'Favoritas'}
            </Button>
          )}
        </div>
        <div className="space-y-1.5">
          {displayItems.map(item => {
            const ti = TYPE_ICONS[item.type] || TYPE_ICONS.pergunta_clinica;
            const Icon = ti.icon;
            return (
              <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-[#F5F1E8]/[0.02] hover:bg-[#F5F1E8]/[0.04] transition-colors">
                <Icon className="w-3 h-3 shrink-0" style={{ color: ti.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#F5F1E8]/60 truncate">{item.title}</p>
                </div>
                {onUse && (
                  <Button variant="ghost" size="sm" onClick={() => onUse(item.id)} className="h-6 px-1.5 text-[#C9A24A]/50 hover:text-[#C9A24A]">
                    <Plus className="w-3 h-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
