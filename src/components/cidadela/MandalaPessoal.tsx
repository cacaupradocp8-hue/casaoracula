import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles } from 'lucide-react';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import type { MandalaDistrict, MandalaDistrictState } from '@/components/cidadela/MandalaCidadela';

export function MandalaPessoal() {
  const { user } = useAuth();
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [districtStates, setDistrictStates] = useState<MandalaDistrictState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  const loadData = async () => {
    const distRes = await supabase
      .from('districts')
      .select('id, numero, nome, descricao, icone, cor')
      .order('numero');
    const dists = (distRes.data || []) as unknown as MandalaDistrict[];
    setDistricts(dists);

    // Check if user has a linked client record
    const clienteRes: any = await supabase
      .from('clientes')
      .select('id')
      .eq('email', user!.email!)
      .limit(1);
    const clientId = (clienteRes.data as any)?.[0]?.id as string | undefined;

    // Check personal cartografia
    const cartoRes = await supabase
      .from('cartografia_psiquica')
      .select('territorios_principais')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (clientId) {
      const journeyRes = await supabase
        .from('journeys').select('id').eq('client_id', clientId).limit(1);

      if (journeyRes.data?.length) {
        const jdRes = await supabase
          .from('journey_districts')
          .select('district_id, state, sessions_count, last_session_at')
          .eq('journey_id', journeyRes.data[0].id);
        setDistrictStates((jdRes.data || []) as unknown as MandalaDistrictState[]);
      }
    }

    // Fallback: derive states from cartografia territories
    if (!clientId && cartoRes.data?.[0]?.territorios_principais) {
      const territories = cartoRes.data[0].territorios_principais as string[];
      setDistrictStates(
        dists.map(d => ({
          district_id: d.id,
          state: territories.some(t => d.nome.toLowerCase().includes(t.toLowerCase()))
            ? 'ativo' as const
            : 'inativo' as const,
          sessions_count: 0,
          last_session_at: null,
        }))
      );
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
        <h3 className="text-sm font-medium text-foreground/70">Sua CidaDELA Interior</h3>
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
