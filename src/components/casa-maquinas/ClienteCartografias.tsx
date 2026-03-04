import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Radar } from 'lucide-react';

const TERRITORY_LABELS: Record<string, string> = {
  porta_possivel: 'Porta do Possível',
  torre_interna: 'Torre Interna',
  campo_outro: 'Campo do Outro',
  voz_mundo: 'Voz no Mundo',
  porta_abalo: 'Porta do Abalo',
};

export function ClienteCartografias({ clienteId }: { clienteId: string }) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('cartographies')
      .select('*')
      .eq('client_id', clienteId)
      .order('date', { ascending: false })
      .then(({ data }) => { setRecords(data || []); setLoading(false); });
  }, [clienteId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" /></div>;

  if (records.length === 0) return <p className="text-center text-[#F5F1E8]/30 py-10">Nenhuma cartografia registrada</p>;

  return (
    <div className="space-y-4">
      {records.map(r => {
        const scores = (r.scores_json || {}) as Record<string, number>;
        const classification = (r.classification_json || {}) as Record<string, string>;
        return (
          <Card key={r.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#F5F1E8]">
                  {new Date(r.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <Radar className="w-4 h-4 text-[#C9A24A]/40" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(scores).map(([key, score]) => (
                  <div key={key} className="text-center">
                    <div className="relative w-10 h-10 mx-auto mb-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="rgba(245,241,232,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#C9A24A" strokeWidth="3"
                          strokeDasharray={`${score} ${100 - score}`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#F5F1E8]">{score}</span>
                    </div>
                    <p className="text-[7px] text-[#F5F1E8]/40 leading-tight">{TERRITORY_LABELS[key] || key}</p>
                    <Badge variant="outline" className={`text-[6px] mt-0.5 ${
                      classification[key] === 'alto' ? 'border-[#556B57]/30 text-[#556B57]'
                      : classification[key] === 'baixo' ? 'border-red-400/30 text-red-400'
                      : 'border-[#C9A24A]/30 text-[#C9A24A]'
                    }`}>
                      {classification[key] || '—'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
