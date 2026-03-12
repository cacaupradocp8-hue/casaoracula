import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles } from 'lucide-react';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';

/**
 * Personal mandala for the logged-in user.
 * Shows their own journey progress across the CidaDELA districts.
 * Used on /mapa-casa.
 */
export function MandalaPessoal() {
  const { user } = useAuth();
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [districtStates, setDistrictStates] = useState<MandalaDistrictState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    const { data: dists } = await supabase
      .from('districts').select('*').order('numero') as { data: MandalaDistrict[] | null };
    setDistricts(dists || []);

    // Try to find user's journey (they may be a client or self-exploring)
    const { data: clienteData } = await supabase
      .from('clientes')
      .select('id')
      .eq('email', user!.email!)
      .limit(1) as { data: { id: string }[] | null };

    let clientId = clienteData?.[0]?.id;

    // Also check personal cartografia_psiquica for journey data
    const { data: cartografia } = await supabase
      .from('cartografia_psiquica')
      .select('territorios_principais')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (clientId) {
      const { data: journeys } = await supabase
        .from('journeys').select('id').eq('client_id', clientId).limit(1);

      if (journeys?.length) {
        const { data: jd } = await supabase
          .from('journey_districts').select('district_id, state, sessions_count, last_session_at')
          .eq('journey_id', journeys[0].id);
        setDistrictStates((jd || []) as MandalaDistrictState[]);
      }
    }

    // If no journey data but has cartografia, derive simple states
    if (!clientId && cartografia?.[0]?.territorios_principais) {
      const territories = cartografia[0].territorios_principais;
      const simpleStates: MandalaDistrictState[] = (dists || []).map(d => ({
        district_id: d.id,
        state: territories.some((t: string) => d.nome.toLowerCase().includes(t.toLowerCase()))
          ? 'ativo' as const
          : 'inativo' as const,
        sessions_count: 0,
        last_session_at: null,
      }));
      setDistrictStates(simpleStates);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (districts.length === 0) return null;

  const hasJourneyData = districtStates.some(s => s.state !== 'inativo');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-primary/60" />
        <h3 className="text-sm font-medium text-foreground/70">
          Sua CidaDELA Interior
        </h3>
      </div>

      <MandalaCidadela
        districts={districts}
        districtStates={districtStates}
        mode="explorar"
        className="w-full max-w-[420px] mx-auto"
      />
      <MandalaLegend mode="explorar" />

      {!hasJourneyData && (
        <p className="text-center text-xs text-muted-foreground/60 italic">
          Sua mandala será preenchida conforme você avança na jornada.
        </p>
      )}
    </div>
  );
}
