import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Save, Loader2, Eye } from 'lucide-react';
import { InsightDoDia } from '@/components/heroina/InsightDoDia';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const FASES_JORNADA = [
  { key: 'limiar', label: 'Limiar' },
  { key: 'emocao', label: 'Emoção' },
  { key: 'torre', label: 'Torre' },
  { key: 'travessia', label: 'Travessia' },
  { key: 'integracao', label: 'Integração' },
];

const CONVITES: Record<string, string[]> = {
  limiar: [
    'O que chamou você até aqui?',
    'Que porta você percebe, mesmo sem atravessar?',
  ],
  emocao: [
    'Que emoção está mais presente agora?',
    'Onde no corpo essa emoção habita?',
  ],
  torre: [
    'Que estrutura interna você percebe ativa?',
    'O que essa torre protege em você?',
  ],
  travessia: [
    'O que você está deixando para trás?',
    'O que ainda precisa ser atravessado?',
  ],
  integracao: [
    'O que se tornou parte de você?',
    'Que gesto simples pode encarnar isso?',
  ],
};

interface Jornada {
  id: string;
  fase_atual: string;
  porta_ativa: string | null;
  torre_ativa: string | null;
  mensagem_simbolica: string | null;
}

export default function HeroinaAppPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'campo' | 'espelho'>('campo');
  const [jornada, setJornada] = useState<Jornada | null>(null);
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      fetchJornada();
      fetchRegistros();
    }
  }, [user]);

  const fetchJornada = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await (supabase.from('heroina_jornada' as any) as any)
      .select('*').eq('user_id', user.id).single();
    if (data) {
      setJornada(data);
    } else {
      const { data: newData } = await (supabase.from('heroina_jornada' as any) as any)
        .insert({ user_id: user.id, fase_atual: 'limiar' }).select().single();
      setJornada(newData);
    }
    setLoading(false);
  };

  const fetchRegistros = async () => {
    if (!user) return;
    const { data } = await (supabase.from('heroina_registros' as any) as any)
      .select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
    setRegistros(data || []);
  };

  const saveResposta = async (convite: string) => {
    if (!user || !jornada || !respostas[convite]?.trim()) return;
    setSaving(true);
    try {
      await (supabase.from('heroina_registros' as any) as any).insert({
        user_id: user.id, tipo: 'exercicio', pergunta: convite,
        resposta: respostas[convite].trim(), fase: jornada.fase_atual,
      });
      toast.success('Guardado');
      setRespostas(prev => ({ ...prev, [convite]: '' }));
      fetchRegistros();
    } catch {
      toast.error('Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  const faseAtual = FASES_JORNADA.find(f => f.key === jornada?.fase_atual) || FASES_JORNADA[0];
  const faseIndex = FASES_JORNADA.findIndex(f => f.key === jornada?.fase_atual);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-gold/40 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Entry — contemplative */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gold/5 blur-3xl animate-breathe pointer-events-none" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative z-10 container mx-auto px-6 text-center max-w-md"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-gold/8 border border-gold/10 flex items-center justify-center mb-8">
              <Sparkles className="w-5 h-5 text-gold/50" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold/40 font-medium mb-6">
              Jardim da Heroína
            </p>

            {/* Symbolic message */}
            <p className="text-foreground/60 text-sm font-display italic leading-relaxed">
              "{jornada?.mensagem_simbolica || 'O caminho se revela a quem se dispõe a andar sem mapa.'}"
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 pb-24 max-w-xl space-y-8">
          {/* Insight do dia */}
          <InsightDoDia />
            {FASES_JORNADA.map((fase, i) => (
              <div key={fase.key} className="flex flex-col items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  i <= faseIndex ? 'bg-gold/60' : 'bg-border/40'
                } ${i === faseIndex ? 'scale-150' : ''}`} />
                <span className={`text-[9px] tracking-wider ${
                  i === faseIndex ? 'text-gold/60' : 'text-transparent'
                }`}>
                  {fase.label}
                </span>
              </div>
            ))}
          </div>

          {/* View toggle — minimal */}
          <div className="flex justify-center gap-6 mb-12">
            <button
              onClick={() => setView('campo')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                view === 'campo' ? 'text-gold/60' : 'text-muted-foreground/30'
              }`}
            >
              Campo
            </button>
            <button
              onClick={() => setView('espelho')}
              className={`text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                view === 'espelho' ? 'text-gold/60' : 'text-muted-foreground/30'
              }`}
            >
              Espelho
            </button>
          </div>

          <AnimatePresence mode="wait">
            {view === 'campo' ? (
              <motion.div
                key="campo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                {(CONVITES[jornada?.fase_atual as keyof typeof CONVITES] || CONVITES.limiar).map((convite, i) => (
                  <div key={i} className="space-y-3">
                    <p className="text-[11px] text-gold/50 font-display tracking-wide">{convite}</p>
                    <Textarea
                      value={respostas[convite] || ''}
                      onChange={e => setRespostas(prev => ({ ...prev, [convite]: e.target.value }))}
                      placeholder="Escreva o que surge..."
                      rows={3}
                      className="bg-transparent border-border/15 focus:border-gold/20 text-sm text-foreground/80 placeholder:text-muted-foreground/30 resize-none"
                    />
                    {respostas[convite]?.trim() && (
                      <div className="text-right">
                        <button
                          disabled={saving}
                          onClick={() => saveResposta(convite)}
                          className="inline-flex items-center gap-1.5 text-gold/40 hover:text-gold/70 text-[10px] uppercase tracking-[0.2em] transition-colors"
                        >
                          {saving ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Save className="w-2.5 h-2.5" />}
                          Guardar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="espelho"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-8">
                  <Eye className="w-5 h-5 text-gold/30 mx-auto mb-3" />
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.3em]">
                    Espelho Simbólico
                  </p>
                </div>

                {registros.length === 0 ? (
                  <p className="text-center text-muted-foreground/40 font-display text-sm italic py-12">
                    O espelho reflete quando há registros para observar.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {registros.slice(0, 6).map(r => (
                      <div key={r.id} className="border-l border-gold/10 pl-4 py-1">
                        {r.pergunta && (
                          <p className="text-[10px] text-gold/40 font-display mb-1">{r.pergunta}</p>
                        )}
                        <p className="text-sm text-foreground/60 leading-relaxed">{r.resposta}</p>
                        {r.fase && (
                          <p className="text-[9px] text-muted-foreground/30 mt-1 uppercase tracking-wider">{r.fase}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
