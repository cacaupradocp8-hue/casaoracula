import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TowerControl, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Sombra da Torre — sub-experiência da Estação 2 (Casa da Boa Menina).
 * Reutiliza `clube_estacao_registros` (tipo='sombra_torre').
 * O conteúdo das sombras é editável via Admin (campo `sombras` em metadados da estação)
 * mas, na ausência, usa um conjunto canônico definido na metodologia.
 */

const SOMBRAS_PADRAO = [
  { id: 'raiva', label: 'Raiva' },
  { id: 'discordancia', label: 'Discordância' },
  { id: 'ambicao', label: 'Ambição' },
  { id: 'desejo', label: 'Desejo' },
  { id: 'tristeza', label: 'Tristeza' },
  { id: 'egoismo_saudavel', label: 'Egoísmo saudável' },
  { id: 'frustracao', label: 'Frustração' },
  { id: 'necessidade_ajuda', label: 'Necessidade de ajuda' },
];

interface SombraDaTorreProps {
  estacaoId: string;
  sombras?: { id: string; label: string }[];
  perguntaIntegracao?: string;
}

export const SombraDaTorre: React.FC<SombraDaTorreProps> = ({
  estacaoId,
  sombras,
  perguntaIntegracao = 'Qual dessas sombras você reconhece em si — e como ela aparece travestida de "boa"?',
}) => {
  const { user } = useAuth();
  const opcoes = useMemo(() => (sombras?.length ? sombras : SOMBRAS_PADRAO), [sombras]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [reflexao, setReflexao] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('clube_estacao_registros')
        .select('texto')
        .eq('user_id', user.id)
        .eq('estacao_id', estacaoId)
        .eq('tipo', 'sombra_torre')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data?.texto) {
        try {
          const parsed = JSON.parse(data.texto);
          setSelecionadas(parsed.selecionadas || []);
          setReflexao(parsed.reflexao || '');
          setSaved(true);
        } catch {
          /* noop */
        }
      }
    })();
  }, [user, estacaoId]);

  const toggle = (id: string) => {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user) return;
    if (selecionadas.length === 0) {
      toast.error('Selecione ao menos uma sombra para registrar.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('clube_estacao_registros').insert({
      user_id: user.id,
      estacao_id: estacaoId,
      tipo: 'sombra_torre',
      texto: JSON.stringify({ selecionadas, reflexao }),
    });
    setSaving(false);
    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
      return;
    }
    setSaved(true);
    toast.success('Sombra da Torre registrada.');
  };

  return (
    <Card className="bg-white/[0.03] border border-gold/10 p-8 md:p-10 rounded-[32px] space-y-8">
      <div className="flex items-center gap-3 text-gold/80">
        <TowerControl className="w-6 h-6" />
        <h4 className="text-xl font-serif italic tracking-wide">Sombra da Torre</h4>
      </div>

      <p className="text-white/60 font-serif italic text-base md:text-lg leading-relaxed">
        Dentro da Torre da Boa Menina, certos afetos foram trancados para que a aparência de bondade
        seguisse intacta. Marque os que reconhece como exilados em você:
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {opcoes.map((s) => {
          const active = selecionadas.includes(s.id);
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(s.id)}
              className={`relative p-4 rounded-2xl border text-left transition-all ${
                active
                  ? 'bg-gold/15 border-gold/50 text-white shadow-lg shadow-gold/10'
                  : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-gold/30'
              }`}
            >
              <span className="font-serif italic text-sm md:text-base">{s.label}</span>
              {active && (
                <Check className="w-4 h-4 text-gold absolute top-3 right-3" />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-white/5">
        <label className="text-[10px] uppercase tracking-widest text-gold/60 font-black">
          {perguntaIntegracao}
        </label>
        <Textarea
          value={reflexao}
          onChange={(e) => {
            setReflexao(e.target.value);
            setSaved(false);
          }}
          placeholder="Escreva sem pressa. Esta reflexão é privada."
          className="bg-white/[0.02] border-white/10 text-white/80 font-serif italic min-h-[120px]"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || saved}
          className="bg-gold hover:bg-gold/80 text-midnight font-bold px-8 py-5 rounded-full text-[10px] uppercase tracking-widest"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? 'Registrado' : 'Registrar Sombra'}
        </Button>
      </div>
    </Card>
  );
};
