import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';

interface Props {
  groupId: string;
}

interface District {
  id: string;
  numero: number;
  nome: string;
}

interface MemberPosition {
  clientName: string;
  districtId: string;
}

export function CidadelaMapGroup({ groupId }: Props) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [members, setMembers] = useState<MemberPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [groupId]);

  const loadData = async () => {
    const { data: dists } = await supabase.from('districts').select('id, numero, nome').order('numero');
    setDistricts(dists || []);

    // Get group participants and their latest session district
    const { data: groupData } = await supabase
      .from('groups').select('id').eq('id', groupId).single();

    if (groupData) {
      const { data: encounters } = await supabase
        .from('group_encounters').select('id').eq('group_id', groupId).order('date', { ascending: false }).limit(1);

      if (encounters?.length) {
        const { data: participants } = await supabase
          .from('encounter_participants').select('client_id').eq('encounter_id', encounters[0].id);

        if (participants?.length) {
          const clientIds = participants.map(p => p.client_id);
          const positions: MemberPosition[] = [];

          for (const cid of clientIds) {
            const { data: client } = await supabase
              .from('clientes').select('nome').eq('id', cid).single();
            const { data: lastSession } = await supabase
              .from('sessions').select('district_id').eq('client_id', cid)
              .order('created_at', { ascending: false }).limit(1);

            if (client && lastSession?.[0]?.district_id) {
              positions.push({ clientName: client.nome, districtId: lastSession[0].district_id });
            }
          }
          setMembers(positions);
        }
      }
    }
    setLoading(false);
  };

  const membersByDistrict = useMemo(() => {
    const map: Record<string, string[]> = {};
    members.forEach(m => {
      if (!map[m.districtId]) map[m.districtId] = [];
      map[m.districtId].push(m.clientName);
    });
    return map;
  }, [members]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" /></div>;
  }

  const cx = 50, cy = 50, r = 36, nodeR = 4.5;
  const getPos = (num: number) => {
    const a = ((num - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-[#C9A24A]/60" />
        <h3 className="text-sm font-medium text-[#F5F1E8]/70">Mapa do Grupo — CidaDELA</h3>
      </div>

      <div className="relative w-full max-w-[520px] mx-auto" style={{ aspectRatio: '1/1' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="glow-member">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Rings */}
          <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="rgba(201,162,74,0.06)" strokeWidth="0.2" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(201,162,74,0.08)" strokeWidth="0.15" strokeDasharray="0.8 1.2" />

          {/* Center */}
          <circle cx={cx} cy={cy} r="5" fill="rgba(201,162,74,0.05)" stroke="rgba(201,162,74,0.15)" strokeWidth="0.3" />
          <text x={cx} y={cy + 0.5} textAnchor="middle" fill="#C9A24A" fontSize="2" opacity="0.6">Grupo</text>

          {/* Districts */}
          {districts.map(d => {
            const pos = getPos(d.numero);
            const membersHere = membersByDistrict[d.id] || [];
            const hasMembers = membersHere.length > 0;

            return (
              <g key={d.id}>
                <circle cx={pos.x} cy={pos.y} r={nodeR} 
                  fill={hasMembers ? 'rgba(201,162,74,0.1)' : 'rgba(245,241,232,0.03)'}
                  stroke={hasMembers ? 'rgba(201,162,74,0.4)' : 'rgba(245,241,232,0.12)'}
                  strokeWidth="0.4" />

                {/* Label */}
                <text x={pos.x} y={pos.y + nodeR + 2.5} textAnchor="middle"
                  fill={hasMembers ? '#C9A24A' : 'rgba(245,241,232,0.3)'}
                  fontSize="1.6" fontWeight="500" opacity="0.8">
                  {d.nome.length > 12 ? d.nome.slice(0, 11) + '…' : d.nome}
                </text>

                {/* Member dots */}
                {membersHere.map((name, i) => {
                  const angle = (i / Math.max(membersHere.length, 1)) * Math.PI * 2;
                  const dotR = 2;
                  const dx = pos.x + dotR * Math.cos(angle);
                  const dy = pos.y + dotR * Math.sin(angle);
                  return (
                    <g key={i}>
                      <circle cx={dx} cy={dy} r="0.8" fill="#C9A24A" filter="url(#glow-member)">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
                      </circle>
                      <title>{name}</title>
                    </g>
                  );
                })}

                {/* Count */}
                {hasMembers && (
                  <text x={pos.x} y={pos.y + nodeR + 4} textAnchor="middle" fill="#C9A24A" fontSize="1.3" opacity="0.5">
                    {membersHere.length} {membersHere.length === 1 ? 'participante' : 'participantes'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Members list */}
      {members.length > 0 && (
        <div className="bg-[#F5F1E8]/[0.03] border border-[#C9A24A]/8 rounded-lg p-3 max-w-[520px] mx-auto">
          <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]/50 mb-2">Participantes por distrito</p>
          {Object.entries(membersByDistrict).map(([distId, names]) => {
            const d = districts.find(dd => dd.id === distId);
            return (
              <div key={distId} className="flex items-start gap-2 mb-1.5">
                <span className="text-xs text-[#C9A24A]/70 font-medium shrink-0">{d?.nome}:</span>
                <span className="text-xs text-[#F5F1E8]/40">{names.join(', ')}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
