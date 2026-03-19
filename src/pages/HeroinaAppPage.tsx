import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Eye, Heart, ArrowRight, Save, Loader2, BookOpen, Waves } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const FASES_JORNADA = [
  { key: 'limiar', label: 'Limiar', icon: '◇', desc: 'O chamado ao desconhecido', color: 'text-amber-400', bg: 'bg-amber-400' },
  { key: 'emocao', label: 'Emoção', icon: '◈', desc: 'O que se move dentro', color: 'text-blue-400', bg: 'bg-blue-400' },
  { key: 'torre', label: 'Torre', icon: '◉', desc: 'A estrutura que sustenta', color: 'text-purple-400', bg: 'bg-purple-400' },
  { key: 'travessia', label: 'Travessia', icon: '◊', desc: 'A passagem que transforma', color: 'text-gold', bg: 'bg-gold' },
  { key: 'integracao', label: 'Integração', icon: '●', desc: 'O que ficou vivo em você', color: 'text-emerald-400', bg: 'bg-emerald-400' },
];

const PERGUNTAS = {
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
    'O que se tornou parte de você após essa jornada?',
    'Que gesto simples pode encarnar essa integração?',
  ],
};

interface Jornada {
  id: string;
  fase_atual: string;
  porta_ativa: string | null;
  torre_ativa: string | null;
  mensagem_simbolica: string | null;
}

interface Registro {
  id: string;
  tipo: string;
  pergunta: string | null;
  resposta: string | null;
  fase: string | null;
  emocao_dominante: string | null;
  arquetipo_ativo: string | null;
  created_at: string;
}

export default function HeroinaAppPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('jornada');
  const [jornada, setJornada] = useState<Jornada | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
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
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setJornada(data);
    } else {
      // Create initial journey
      const { data: newData } = await (supabase.from('heroina_jornada' as any) as any)
        .insert({ user_id: user.id, fase_atual: 'limiar' })
        .select()
        .single();
      setJornada(newData);
    }
    setLoading(false);
  };

  const fetchRegistros = async () => {
    if (!user) return;
    const { data } = await (supabase.from('heroina_registros' as any) as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setRegistros(data || []);
  };

  const saveResposta = async (pergunta: string) => {
    if (!user || !jornada || !respostas[pergunta]?.trim()) return;
    setSaving(true);
    try {
      await (supabase.from('heroina_registros' as any) as any).insert({
        user_id: user.id,
        tipo: 'exercicio',
        pergunta,
        resposta: respostas[pergunta].trim(),
        fase: jornada.fase_atual,
      });
      toast.success('Registro guardado');
      setRespostas(prev => ({ ...prev, [pergunta]: '' }));
      fetchRegistros();
    } catch {
      toast.error('Erro ao guardar');
    } finally {
      setSaving(false);
    }
  };

  const avancarFase = async () => {
    if (!jornada) return;
    const idx = FASES_JORNADA.findIndex(f => f.key === jornada.fase_atual);
    if (idx >= FASES_JORNADA.length - 1) return;
    const novaFase = FASES_JORNADA[idx + 1].key;
    await (supabase.from('heroina_jornada' as any) as any)
      .update({ fase_atual: novaFase, updated_at: new Date().toISOString() })
      .eq('id', jornada.id);
    setJornada(prev => prev ? { ...prev, fase_atual: novaFase } : null);
    toast.success(`Você avançou para: ${FASES_JORNADA[idx + 1].label}`);
  };

  const faseAtual = FASES_JORNADA.find(f => f.key === jornada?.fase_atual) || FASES_JORNADA[0];
  const faseIndex = FASES_JORNADA.findIndex(f => f.key === jornada?.fase_atual);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-gradient-to-br from-mystic/8 via-gold/5 to-transparent blur-3xl animate-breathe pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-6 text-center max-w-2xl"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gold/50 font-medium mb-3">
              Jardim da Heroína
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
              Sua Jornada Interior
            </h1>

            {/* Current State */}
            <Card className="glass border-gold/15 max-w-sm mx-auto mt-8">
              <CardContent className="p-5 text-center">
                <p className="text-4xl mb-2">{faseAtual.icon}</p>
                <p className={`font-display text-lg ${faseAtual.color}`}>{faseAtual.label}</p>
                <p className="text-sm text-muted-foreground italic mt-1">{faseAtual.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <div className="container mx-auto px-6 pb-24 max-w-4xl">
          {/* Journey Path Visual */}
          <div className="flex items-center justify-center gap-1 mb-10">
            {FASES_JORNADA.map((fase, i) => (
              <div key={fase.key} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    i <= faseIndex
                      ? `${fase.bg} text-background`
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {fase.icon}
                </div>
                {i < FASES_JORNADA.length - 1 && (
                  <div className={`w-8 h-0.5 ${i < faseIndex ? 'bg-gold/50' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          <Tabs value={tab} onValueChange={setTab} className="space-y-6">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-card/50 border border-border/30">
              <TabsTrigger value="jornada" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                <Flame className="w-4 h-4" />
                <span className="text-xs">Jornada</span>
              </TabsTrigger>
              <TabsTrigger value="exercicios" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs">Exercícios</span>
              </TabsTrigger>
              <TabsTrigger value="espelho" className="flex flex-col gap-1 py-3 data-[state=active]:bg-gold/10 data-[state=active]:text-gold">
                <Eye className="w-4 h-4" />
                <span className="text-xs">Espelho</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jornada">
              <Card className="glass border-border/20">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <p className={`font-display text-xl ${faseAtual.color} mb-2`}>
                      {faseAtual.label}
                    </p>
                    <p className="text-muted-foreground text-sm italic">{faseAtual.desc}</p>
                  </div>

                  {jornada?.porta_ativa && (
                    <div className="glass p-3 rounded-xl border border-border/20 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Porta ativa</p>
                      <p className="text-sm text-foreground font-display">{jornada.porta_ativa}</p>
                    </div>
                  )}

                  {jornada?.torre_ativa && (
                    <div className="glass p-3 rounded-xl border border-border/20 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Torre ativa</p>
                      <p className="text-sm text-foreground font-display">{jornada.torre_ativa}</p>
                    </div>
                  )}

                  {/* Symbolic Message */}
                  <div className="glass p-4 rounded-xl border border-gold/10 text-center">
                    <Sparkles className="w-4 h-4 text-gold/40 mx-auto mb-2" />
                    <p className="text-sm text-foreground/80 font-display italic">
                      {jornada?.mensagem_simbolica || '"O caminho se revela a quem se dispõe a andar sem mapa."'}
                    </p>
                  </div>

                  {faseIndex < FASES_JORNADA.length - 1 && (
                    <div className="text-center pt-4">
                      <Button variant="gold" onClick={avancarFase} className="gap-2">
                        Avançar na Jornada
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exercicios">
              <div className="space-y-5">
                {(PERGUNTAS[jornada?.fase_atual as keyof typeof PERGUNTAS] || PERGUNTAS.limiar).map((pergunta, i) => (
                  <Card key={i} className="glass border-border/20">
                    <CardContent className="p-5 space-y-3">
                      <p className="text-sm font-display text-gold/80">{pergunta}</p>
                      <Textarea
                        value={respostas[pergunta] || ''}
                        onChange={e => setRespostas(prev => ({ ...prev, [pergunta]: e.target.value }))}
                        placeholder="Escreva o que surge..."
                        rows={3}
                        className="bg-background/50"
                      />
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={saving || !respostas[pergunta]?.trim()}
                          onClick={() => saveResposta(pergunta)}
                          className="gap-1"
                        >
                          <Save className="w-3 h-3" /> Guardar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="espelho">
              <Card className="glass border-border/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Eye className="w-8 h-8 text-gold/40 mx-auto mb-3" />
                    <h3 className="font-display text-lg text-foreground">Espelho Simbólico</h3>
                    <p className="text-sm text-muted-foreground mt-1">Padrões e movimentos da sua jornada</p>
                  </div>

                  {registros.length === 0 ? (
                    <div className="text-center py-8">
                      <Waves className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-display text-sm">
                        O espelho reflete quando há registros para observar.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Phase distribution */}
                      <div className="grid grid-cols-5 gap-2 mb-6">
                        {FASES_JORNADA.map(fase => {
                          const count = registros.filter(r => r.fase === fase.key).length;
                          return (
                            <div key={fase.key} className="text-center">
                              <div className={`text-lg font-display ${count > 0 ? fase.color : 'text-muted-foreground/30'}`}>
                                {count}
                              </div>
                              <p className="text-[10px] text-muted-foreground">{fase.label}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recent records */}
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Últimos registros</p>
                      {registros.slice(0, 5).map(r => (
                        <div key={r.id} className="glass p-3 rounded-lg border border-border/10">
                          <div className="flex items-center gap-2 mb-1">
                            {r.fase && <Badge variant="outline" className="text-[10px]">{r.fase}</Badge>}
                            {r.emocao_dominante && <Badge variant="secondary" className="text-[10px]">{r.emocao_dominante}</Badge>}
                          </div>
                          {r.pergunta && <p className="text-xs text-gold/60 font-display mb-0.5">{r.pergunta}</p>}
                          <p className="text-sm text-foreground/80">{r.resposta}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
