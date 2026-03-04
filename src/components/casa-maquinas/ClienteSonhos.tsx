import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Moon } from 'lucide-react';

export function ClienteSonhos({ clienteId }: { clienteId: string }) {
  const [dreams, setDreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('dreams')
      .select('*')
      .eq('client_id', clienteId)
      .order('date', { ascending: false })
      .then(({ data }) => { setDreams(data || []); setLoading(false); });
  }, [clienteId]);

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-[#C9A24A]" /></div>;
  if (dreams.length === 0) return <p className="text-center text-[#F5F1E8]/30 py-10">Nenhum sonho registrado</p>;

  return (
    <div className="space-y-3">
      {dreams.map(d => (
        <Card key={d.id} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-[#6366F1]" />
              <span className="text-sm font-medium text-[#F5F1E8]">
                {new Date(d.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {d.dream_text && <p className="text-xs text-[#F5F1E8]/60 mb-2">{d.dream_text}</p>}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {d.central_image && (
                <div><span className="text-[9px] text-[#C9A24A]/60 uppercase">Imagem Central</span><p className="text-[11px] text-[#F5F1E8]/50">{d.central_image}</p></div>
              )}
              {d.psychic_force && (
                <div><span className="text-[9px] text-[#C9A24A]/60 uppercase">Força Psíquica</span><p className="text-[11px] text-[#F5F1E8]/50">{d.psychic_force}</p></div>
              )}
              {d.interrupted_movement && (
                <div><span className="text-[9px] text-[#C9A24A]/60 uppercase">Movimento Interrompido</span><p className="text-[11px] text-[#F5F1E8]/50">{d.interrupted_movement}</p></div>
              )}
              {d.symbolic_message && (
                <div><span className="text-[9px] text-[#C9A24A]/60 uppercase">Mensagem Simbólica</span><p className="text-[11px] text-[#F5F1E8]/50">{d.symbolic_message}</p></div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
