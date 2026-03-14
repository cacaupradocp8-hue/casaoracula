import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';
import { MandalaCidadela, MandalaLegend } from '@/components/cidadela/MandalaCidadela';
import { DistrictDetailSheet } from '@/components/cidadela/DistrictDetailSheet';
import type { MandalaDistrict, MandalaCollectiveData } from '@/components/cidadela/MandalaCidadela';

interface Props {
  groupId: string;
}

export function CidadelaMapGroup({ groupId }: Props) {
  const [districts, setDistricts] = useState<MandalaDistrict[]>([]);
  const [collectiveData, setCollectiveData] = useState<MandalaCollectiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<MandalaDistrict | null>(null);

  useEffect(() => { loadData(); }, [groupId]);

  const loadData = async () => {
    const { data: dists } = await supabase.from('districts').select('*').order('numero');
    setDistricts(dists || []);

    const { data: membersData } = await supabase
      .from('group_members').select('client_id').eq('group_id', groupId);

    if (membersData?.length) {
      const countMap: Record<string, { count: number; names: string[] }> = {};

      for (const m of membersData) {
        const { data: client } = await supabase
          .from('clientes').select('nome').eq('id', m.client_id).single();
        const { data: lastSession } = await supabase
          .from('sessions').select('district_id').eq('client_id', m.client_id)
          .order('created_at', { ascending: false }).limit(1);

        if (client && lastSession?.[0]?.district_id) {
          const did = lastSession[0].district_id;
          if (!countMap[did]) countMap[did] = { count: 0, names: [] };
          countMap[did].count++;
          countMap[did].names.push(client.nome);
        }
      }

      setCollectiveData(
        Object.entries(countMap).map(([district_id, { count, names }]) => ({
          district_id, client_count: count, client_names: names,
        }))
      );
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: '#C9A24A' }} /></div>;
  }

  const selectedCollective = selectedDistrict ? collectiveData.find(c => c.district_id === selectedDistrict.id) : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" style={{ color: 'rgba(201,162,74,0.5)' }} />
        <h3 className="text-sm font-medium" style={{ color: 'rgba(245,241,232,0.6)', fontFamily: "'Playfair Display', serif" }}>
          Mapa do Grupo — CidaDELA
        </h3>
      </div>

      <MandalaCidadela
        districts={districts}
        collectiveData={collectiveData}
        mode="coletivo"
        className="w-full"
        onDistrictClick={d => setSelectedDistrict(d)}
      />
      <MandalaLegend mode="coletivo" />

      {collectiveData.length > 0 && (
        <div className="rounded-xl p-3.5 max-w-[420px] mx-auto" style={{ background: 'rgba(245,241,232,0.02)', border: '1px solid rgba(201,162,74,0.08)' }}>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'rgba(201,162,74,0.35)' }}>Participantes por distrito</p>
          {collectiveData.map(cd => {
            const d = districts.find(dd => dd.id === cd.district_id);
            return (
              <div key={cd.district_id} className="flex items-start gap-2 mb-1.5">
                <span className="text-xs font-medium shrink-0" style={{ color: 'rgba(201,162,74,0.6)' }}>{d?.nome}:</span>
                <span className="text-xs" style={{ color: 'rgba(245,241,232,0.35)' }}>{cd.client_names?.join(', ')}</span>
              </div>
            );
          })}
        </div>
      )}

      <DistrictDetailSheet
        district={selectedDistrict}
        collectiveData={selectedCollective}
        open={!!selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />
    </div>
  );
}
