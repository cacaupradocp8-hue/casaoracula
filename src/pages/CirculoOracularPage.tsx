import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { toast } from 'sonner';

const FASES = [
  { key: 'abertura', label: 'Silêncio' },
  { key: 'leitura', label: 'Escuta' },
  { key: 'reflexao', label: 'Reflexão' },
  { key: 'integracao', label: 'Gesto' },
];

export default function CirculoOracularPage() {
  const { user } = useAuth();
  const { cicloAtual } = useClubeLivro();
  const [faseAtiva, setFaseAtiva] = useState('abertura');
  const [registro, setRegistro] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    passagem_atravessou: '',
    onde_toca_vida: '',
    imagem_ficou: '',
    insights_encontro: '',
    movimentos_internos: '',
    gesto_pos_circulo: '',
  });

  useEffect(() => {
    if (user && cicloAtual?.id) fetchRegistro();
  }, [user, cicloAtual?.id]);

  const fetchRegistro = async () => {
    if (!user || !cicloAtual) return;
    const { data } = await (supabase.from('circulo_oracular_registros' as any) as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('ciclo_id', cicloAtual.id)
      .order('created_at', { ascending: false })
      .limit(1);
    if (data?.[0]) {
      setRegistro(data[0]);
      setForm({
        passagem_atravessou: data[0].passagem_atravessou || '',
        onde_toca_vida: data[0].onde_toca_vida || '',
        imagem_ficou: data[0].imagem_ficou || '',
        insights_encontro: data[0].insights_encontro || '',
        movimentos_internos: data[0].movimentos_internos || '',
        gesto_pos_circulo: data[0].gesto_pos_circulo || '',
      });
    }
  };

  const handleSave = async () => {
    if (!user || !cicloAtual) return;
    setSaving(true);
    try {
      if (registro?.id) {
        await (supabase.from('circulo_oracular_registros' as any) as any)
          .update({ ...form, fase: faseAtiva, updated_at: new Date().toISOString() })
          .eq('id', registro.id);
      } else {
        await (supabase.from('circulo_oracular_registros' as any) as any)
          .insert({ user_id: user.id, ciclo_id: cicloAtual.id, fase: faseAtiva, ...form });
      }
      toast.success('Guardado');
      fetchRegistro();
    } catch {
      toast.error('Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const faseIndex = FASES.findIndex(f => f.key === faseAtiva);

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Entry — contemplative */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gold/5 blur-3xl animate-breathe pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 container mx-auto px-6 text-center max-w-lg"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/8 border border-gold/10 flex items-center justify-center mb-8">
              <Flame className="w-5 h-5 text-gold/50" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40 font-medium mb-6">
              Círculo Oracular
            </p>
            <p className="text-foreground/60 text-sm font-display italic leading-relaxed">
              O que ficou não precisa ser explicado — precisa ser habitado.
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 pb-24 max-w-xl">
          {/* Active Book — subtle */}
          {cicloAtual && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-12">
              <div className="flex items-center gap-4 justify-center">
                {cicloAtual.capa_url && (
                  <img src={cicloAtual.capa_url} alt={cicloAtual.titulo} className="w-10 h-14 rounded object-cover opacity-70" />
                )}
                <p className="text-xs text-muted-foreground font-display">{cicloAtual.titulo}</p>
              </div>
            </motion.div>
          )}

          {/* Phase navigation — minimal dots */}
          <div className="flex items-center justify-center gap-6 mb-12">
            {FASES.map((fase, i) => (
              <button
                key={fase.key}
                onClick={() => setFaseAtiva(fase.key)}
                className="group flex flex-col items-center gap-2"
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  faseAtiva === fase.key ? 'bg-gold scale-125' : i <= faseIndex ? 'bg-gold/30' : 'bg-border'
                }`} />
                <span className={`text-[10px] tracking-wider transition-colors duration-300 ${
                  faseAtiva === fase.key ? 'text-gold/70' : 'text-muted-foreground/40'
                }`}>
                  {fase.label}
                </span>
              </button>
            ))}
          </div>

          {/* Content — spacious, quiet */}
          <AnimatePresence mode="wait">
            <motion.div
              key={faseAtiva}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {faseAtiva === 'abertura' && (
                <div className="text-center py-12">
                  <p className="text-foreground/50 text-sm font-display italic leading-loose max-w-xs mx-auto">
                    Antes de abrir o livro, abra o campo interno. Perceba o que já está presente — sem forçar, sem nomear.
                  </p>
                </div>
              )}

              {faseAtiva === 'leitura' && (
                <div className="space-y-8">
                  <Field
                    label="Qual passagem te atravessou?"
                    value={form.passagem_atravessou}
                    onChange={v => updateField('passagem_atravessou', v)}
                    placeholder="O trecho que ficou..."
                  />
                  <Field
                    label="Onde isso toca sua vida?"
                    value={form.onde_toca_vida}
                    onChange={v => updateField('onde_toca_vida', v)}
                    placeholder="O que essa passagem ilumina..."
                  />
                  <Field
                    label="Qual imagem ficou?"
                    value={form.imagem_ficou}
                    onChange={v => updateField('imagem_ficou', v)}
                    placeholder="Uma imagem, sensação ou palavra..."
                    rows={2}
                  />
                </div>
              )}

              {faseAtiva === 'reflexao' && (
                <div className="space-y-8">
                  <Field
                    label="O que emergiu no encontro?"
                    value={form.insights_encontro}
                    onChange={v => updateField('insights_encontro', v)}
                    placeholder="O que surgiu..."
                  />
                  <Field
                    label="O que se moveu em você?"
                    value={form.movimentos_internos}
                    onChange={v => updateField('movimentos_internos', v)}
                    placeholder="Movimentos internos..."
                  />
                </div>
              )}

              {faseAtiva === 'integracao' && (
                <div className="space-y-8">
                  <div className="text-center py-4">
                    <p className="text-foreground/40 text-xs font-display italic">
                      A ponte entre o símbolo e a vida é um gesto.
                    </p>
                  </div>
                  <Field
                    label="Qual gesto você leva para a vida?"
                    value={form.gesto_pos_circulo}
                    onChange={v => updateField('gesto_pos_circulo', v)}
                    placeholder="Um gesto simples, concreto, encarnado..."
                    rows={3}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Save — quiet */}
          {faseAtiva !== 'abertura' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 text-gold/50 hover:text-gold text-xs uppercase tracking-[0.3em] transition-colors duration-300 disabled:opacity-30"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                Guardar
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, value, onChange, placeholder, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-gold/50 font-display tracking-wide">{label}</p>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-transparent border-border/15 focus:border-gold/20 text-sm text-foreground/80 placeholder:text-muted-foreground/30 resize-none"
      />
    </div>
  );
}
