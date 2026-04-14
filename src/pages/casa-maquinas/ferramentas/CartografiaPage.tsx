import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { LeituraRevelacao } from '@/components/cartografia/LeituraRevelacao';
import { calcularLeitura } from '@/lib/cartografia/leituraComportamental';

const TERRITORIOS = [
  { key: 'porta_possivel', nome: 'Porta do Possível', desc: 'Abertura a novas experiências' },
  { key: 'torre_interna', nome: 'Torre Interna', desc: 'Conscienciosidade e disciplina interna' },
  { key: 'campo_outro', nome: 'Campo do Outro', desc: 'Relações e empatia' },
  { key: 'voz_mundo', nome: 'Voz no Mundo', desc: 'Expressão e extroversão' },
  { key: 'porta_abalo', nome: 'Porta do Abalo', desc: 'Sensibilidade e neuroticismo' },
];

const PERGUNTAS_POR_TERRITORIO = 6;

export default function CartografiaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scores, setScores] = useState<Record<string, number[]>>(
    Object.fromEntries(TERRITORIOS.map(t => [t.key, Array(PERGUNTAS_POR_TERRITORIO).fill(3)]))
  );
  const [clientId, setClientId] = useState(searchParams.get('clienteId') || '');
  const [clients, setClients] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [concluido, setConcluido] = useState(false);

  useState(() => {
    if (user) {
      supabase.from('clientes').select('id, nome').eq('terapeuta_id', user.id).order('nome')
        .then(({ data }) => { setClients(data || []); setLoaded(true); });
    }
  });

  const getAverage = (key: string) => {
    const arr = scores[key];
    return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 20);
  };

  const handleScore = (territory: string, qIndex: number, value: number) => {
    setScores(prev => ({
      ...prev,
      [territory]: prev[territory].map((v, i) => i === qIndex ? value : v),
    }));
  };

  const classify = (score: number) => {
    if (score < 35) return 'baixo';
    if (score < 65) return 'equilibrado';
    return 'alto';
  };

  const handleSave = async () => {
    if (!clientId) { toast.error('Selecione uma cliente'); return; }
    setSaving(true);

    const scoresJson = Object.fromEntries(TERRITORIOS.map(t => [t.key, getAverage(t.key)]));
    const classificationJson = Object.fromEntries(TERRITORIOS.map(t => [t.key, classify(getAverage(t.key))]));

    const { error } = await supabase.from('cartographies').insert({
      client_id: clientId,
      scores_json: scoresJson,
      classification_json: classificationJson,
    });

    if (error) {
      toast.error('Erro ao salvar cartografia');
    } else {
      toast.success('Cartografia salva com sucesso');
      navigate(`/casa-das-maquinas/clientes/${clientId}`);
    }
    setSaving(false);
  };

  return (
    <CasaMaquinasLayout title="Cartografia Psíquica Orácula" subtitle="Big Five simbólico — 30 perguntas, 5 territórios">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Client selector */}
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="bg-[#0B1B2B]/60 border-[#C9A24A]/10 text-[#F5F1E8]">
            <SelectValue placeholder="Selecione a cliente..." />
          </SelectTrigger>
          <SelectContent>
            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
          </SelectContent>
        </Select>

        {/* Radar preview */}
        <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
          <CardHeader><CardTitle className="text-sm text-[#F5F1E8]/80">Resultado</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {TERRITORIOS.map(t => {
                const avg = getAverage(t.key);
                const cls = classify(avg);
                return (
                  <div key={t.key} className="text-center">
                    <div className="relative w-12 h-12 mx-auto mb-1">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="rgba(245,241,232,0.05)" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#C9A24A" strokeWidth="3"
                          strokeDasharray={`${avg} ${100 - avg}`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#F5F1E8]">{avg}</span>
                    </div>
                    <p className="text-[8px] text-[#F5F1E8]/40 leading-tight">{t.nome}</p>
                    <span className={`text-[7px] ${cls === 'alto' ? 'text-[#556B57]' : cls === 'baixo' ? 'text-red-400' : 'text-[#C9A24A]'}`}>{cls}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Questions per territory */}
        {TERRITORIOS.map(t => (
          <Card key={t.key} className="border-[#C9A24A]/10 bg-[#0B1B2B]/60">
            <CardHeader>
              <CardTitle className="text-sm text-[#C9A24A]">{t.nome}</CardTitle>
              <p className="text-xs text-[#F5F1E8]/40">{t.desc}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: PERGUNTAS_POR_TERRITORIO }).map((_, qi) => (
                <div key={qi} className="flex items-center gap-3">
                  <span className="text-xs text-[#F5F1E8]/40 w-4">{qi + 1}.</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        onClick={() => handleScore(t.key, qi, v)}
                        className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
                          scores[t.key][qi] === v
                            ? 'bg-[#C9A24A] text-[#0B1B2B]'
                            : 'bg-[#F5F1E8]/5 text-[#F5F1E8]/40 hover:bg-[#F5F1E8]/10'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleSave} disabled={saving || !clientId} className="w-full bg-[#C9A24A] hover:bg-[#C9A24A]/80 text-[#0B1B2B]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Cartografia'}
        </Button>
      </div>
    </CasaMaquinasLayout>
  );
}
