import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, Sun, Eye, Flame, Heart, Save, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useClubeLivro } from '@/hooks/useClubeLivro';
import { toast } from 'sonner';

const FASES = [
  { key: 'abertura', label: 'Abertura', icon: Sun, desc: 'O campo se prepara. Silêncio antes da leitura.', color: 'text-amber-400' },
  { key: 'leitura', label: 'Leitura', icon: BookOpen, desc: 'A obra atravessa. Deixe o texto trabalhar.', color: 'text-blue-400' },
  { key: 'reflexao', label: 'Reflexão', icon: Eye, desc: 'O que ficou? O que se moveu internamente?', color: 'text-purple-400' },
  { key: 'integracao', label: 'Integração', icon: Heart, desc: 'Encarnar o que foi tocado. Gesto vivo.', color: 'text-gold' },
];

interface Registro {
  id: string;
  fase: string;
  passagem_atravessou: string | null;
  onde_toca_vida: string | null;
  imagem_ficou: string | null;
  insights_encontro: string | null;
  movimentos_internos: string | null;
  decisoes_simbolicas: string | null;
  gesto_pos_circulo: string | null;
  created_at: string;
}

export default function CirculoOracularPage() {
  const { user } = useAuth();
  const { cicloAtual } = useClubeLivro();
  const [faseAtiva, setFaseAtiva] = useState('abertura');
  const [registro, setRegistro] = useState<Registro | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    passagem_atravessou: '',
    onde_toca_vida: '',
    imagem_ficou: '',
    insights_encontro: '',
    movimentos_internos: '',
    decisoes_simbolicas: '',
    gesto_pos_circulo: '',
  });

  useEffect(() => {
    if (user && cicloAtual?.id) fetchRegistro();
  }, [user, cicloAtual?.id]);

  const fetchRegistro = async () => {
    if (!user || !cicloAtual) return;
    setLoading(true);
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
        decisoes_simbolicas: data[0].decisoes_simbolicas || '',
        gesto_pos_circulo: data[0].gesto_pos_circulo || '',
      });
    }
    setLoading(false);
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
      toast.success('Registro guardado no campo');
      fetchRegistro();
    } catch {
      toast.error('Não foi possível guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-mystic/8 via-gold/5 to-transparent blur-3xl animate-breathe pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-6 text-center max-w-2xl"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center mb-6">
              <Flame className="w-7 h-7 text-gold" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold/50 font-medium mb-4">
              Círculo Oracular
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4 tracking-wide">
              O Círculo se Abre
            </h1>
            <p className="text-muted-foreground text-sm md:text-base font-display italic">
              Cada leitura é uma travessia. O que ficou não precisa ser explicado — precisa ser habitado.
            </p>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 pb-24 max-w-4xl">
          {/* Active Book */}
          {cicloAtual && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-gold/15 mb-10">
                <CardContent className="p-6 flex items-center gap-5">
                  {cicloAtual.capa_url && (
                    <img src={cicloAtual.capa_url} alt={cicloAtual.titulo} className="w-16 h-24 rounded object-cover border border-border/30" />
                  )}
                  <div>
                    <p className="text-xs text-gold/60 uppercase tracking-widest mb-1">Livro do Ciclo</p>
                    <h2 className="font-display text-lg text-foreground">{cicloAtual.titulo}</h2>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Journey Phases */}
          <Tabs value={faseAtiva} onValueChange={setFaseAtiva} className="space-y-8">
            <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-card/50 border border-border/30">
              {FASES.map(fase => {
                const Icon = fase.icon;
                return (
                  <TabsTrigger
                    key={fase.key}
                    value={fase.key}
                    className="flex flex-col gap-1.5 py-3 data-[state=active]:bg-gold/10 data-[state=active]:text-gold text-muted-foreground"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{fase.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div key={faseAtiva} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Phase Description */}
                {FASES.map(fase => (
                  <TabsContent key={fase.key} value={fase.key}>
                    <div className="mb-6">
                      <p className={`text-sm font-display ${fase.color} mb-1`}>{fase.label}</p>
                      <p className="text-muted-foreground text-sm italic">{fase.desc}</p>
                    </div>

                    {fase.key === 'abertura' && (
                      <Card className="glass border-border/20">
                        <CardContent className="p-6 space-y-6">
                          <p className="text-foreground/80 font-display text-sm leading-relaxed">
                            Antes de abrir o livro, abra o campo interno. Perceba o que já está presente em você — sem forçar, sem nomear.
                          </p>
                          <div className="glass p-4 rounded-xl border border-gold/10 text-center">
                            <Sparkles className="w-5 h-5 text-gold/50 mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground italic">
                              "A leitura não começa nos olhos — começa no silêncio que os antecede."
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {fase.key === 'leitura' && (
                      <Card className="glass border-border/20">
                        <CardContent className="p-6 space-y-5">
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Qual passagem te atravessou?
                            </label>
                            <Textarea
                              value={form.passagem_atravessou}
                              onChange={e => updateField('passagem_atravessou', e.target.value)}
                              placeholder="Escreva a passagem ou trecho que ficou em você..."
                              rows={4}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Onde isso toca sua vida?
                            </label>
                            <Textarea
                              value={form.onde_toca_vida}
                              onChange={e => updateField('onde_toca_vida', e.target.value)}
                              placeholder="Que parte da sua vida essa passagem ilumina?"
                              rows={4}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Qual imagem ficou em você?
                            </label>
                            <Textarea
                              value={form.imagem_ficou}
                              onChange={e => updateField('imagem_ficou', e.target.value)}
                              placeholder="Uma imagem, sensação ou palavra que permanece..."
                              rows={3}
                              className="bg-background/50"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {fase.key === 'reflexao' && (
                      <Card className="glass border-border/20">
                        <CardContent className="p-6 space-y-5">
                          <p className="text-foreground/70 text-sm font-display italic mb-2">
                            Espaço para registrar o que emergiu no encontro ao vivo.
                          </p>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Insights do encontro
                            </label>
                            <Textarea
                              value={form.insights_encontro}
                              onChange={e => updateField('insights_encontro', e.target.value)}
                              placeholder="O que surgiu durante o encontro..."
                              rows={4}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Movimentos internos
                            </label>
                            <Textarea
                              value={form.movimentos_internos}
                              onChange={e => updateField('movimentos_internos', e.target.value)}
                              placeholder="O que se moveu em você..."
                              rows={3}
                              className="bg-background/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Decisões simbólicas
                            </label>
                            <Textarea
                              value={form.decisoes_simbolicas}
                              onChange={e => updateField('decisoes_simbolicas', e.target.value)}
                              placeholder="Algo que você decide a partir deste campo..."
                              rows={3}
                              className="bg-background/50"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {fase.key === 'integracao' && (
                      <Card className="glass border-border/20">
                        <CardContent className="p-6 space-y-5">
                          <div className="glass p-4 rounded-xl border border-gold/10 text-center mb-4">
                            <Heart className="w-5 h-5 text-gold/50 mx-auto mb-2" />
                            <p className="text-sm text-foreground/80 font-display">
                              O gesto encarnado é a ponte entre o símbolo e a vida.
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gold/70 font-display tracking-wide block mb-2">
                              Qual gesto você leva para a sua vida após essa leitura?
                            </label>
                            <Textarea
                              value={form.gesto_pos_circulo}
                              onChange={e => updateField('gesto_pos_circulo', e.target.value)}
                              placeholder="Um gesto simples, concreto, encarnado..."
                              rows={4}
                              className="bg-background/50"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                ))}
              </motion.div>
            </AnimatePresence>
          </Tabs>

          {/* Save Button */}
          {faseAtiva !== 'abertura' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
              <Button onClick={handleSave} variant="gold" size="lg" disabled={saving} className="gap-2 px-8">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar no Campo
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
