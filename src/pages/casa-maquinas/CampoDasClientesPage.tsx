import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, MapPin, Shield, Sparkles, BookOpen, Lightbulb, AlertTriangle, HelpCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface CampoData {
  total_clientes: number;
  clientes_ativas: number;
  distritos_frequentes: { nome: string; count: number }[];
  arquetipos_dominantes: { nome: string; count: number }[];
  padroes_recorrentes: { type: string; name: string; count: number }[];
  checkin_states: Record<string, number>;
  journey_states: { ativo: number; integrado: number; inativo: number };
  insights_ia: {
    visao_do_campo: string;
    padroes_coletivos: string[];
    alertas_campo: string[];
    recomendacoes: { tipo: string; titulo: string; descricao: string }[];
    pergunta_reflexiva: string;
  } | null;
}

const fadeIn = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

export default function CampoDasClientesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<CampoData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('campo-das-clientes', {
        body: { therapist_id: user.id },
      });
      if (error) throw error;
      setData(result);
    } catch (e: any) {
      toast.error(e.message || 'Erro ao carregar análise do campo');
    } finally {
      setLoading(false);
    }
  };

  const maxDistrito = data?.distritos_frequentes?.[0]?.count || 1;
  const maxArch = data?.arquetipos_dominantes?.[0]?.count || 1;

  return (
    <CasaMaquinasLayout title="Campo das Clientes" subtitle="Visão sistêmica do campo coletivo">
      {!data && !loading && (
        <motion.div {...fadeIn} className="flex flex-col items-center justify-center py-20 gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-lg font-display font-semibold text-foreground mb-2">Análise Sistêmica</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visualize padrões coletivos, distritos dominantes e arquétipos recorrentes entre todas as suas clientes.
            </p>
          </div>
          <Button onClick={loadData} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Gerar Análise do Campo
          </Button>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analisando o campo coletivo…</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Refresh */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={loadData} className="gap-2 text-xs text-muted-foreground">
              <RefreshCw className="w-3 h-3" /> Atualizar
            </Button>
          </div>

          {/* Stats row */}
          <motion.div {...fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Clientes', value: data.total_clientes, icon: Users },
              { label: 'Clientes Ativas', value: data.clientes_ativas ?? 0, icon: Shield },
              { label: 'Distritos Ativos', value: data.journey_states?.ativo ?? 0, icon: MapPin },
              { label: 'Distritos Integrados', value: data.journey_states?.integrado ?? 0, icon: Sparkles },
            ].map((s, i) => (
              <Card key={i} className="border-border/30 bg-card/40 backdrop-blur-md">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Visão do Campo - AI */}
          {data.insights_ia?.visao_do_campo && (
            <motion.div {...fadeIn} transition={{ delay: 0.05 }}>
              <Card className="border-primary/10 bg-card/40 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Voz Sistêmica da CidaDELA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{data.insights_ia.visao_do_campo}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Two columns: Distritos + Arquétipos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distritos frequentes */}
            <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
              <Card className="border-border/30 bg-card/40 backdrop-blur-md h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Distritos Mais Frequentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.distritos_frequentes.length > 0 ? data.distritos_frequentes.slice(0, 8).map((d, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground/70">{d.nome}</span>
                        <span className="text-xs text-muted-foreground">{d.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${(d.count / maxDistrito) * 100}%` }} />
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-4">Sem dados</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Arquétipos dominantes */}
            <motion.div {...fadeIn} transition={{ delay: 0.15 }}>
              <Card className="border-border/30 bg-card/40 backdrop-blur-md h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Arquétipos Dominantes no Campo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.arquetipos_dominantes.length > 0 ? data.arquetipos_dominantes.slice(0, 8).map((a, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-foreground/70">{a.nome}</span>
                        <span className="text-xs text-muted-foreground">{a.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <div className="h-full rounded-full bg-accent/60 transition-all" style={{ width: `${(a.count / maxArch) * 100}%` }} />
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-4">Sem dados</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Padrões coletivos IA */}
          {data.insights_ia?.padroes_coletivos && data.insights_ia.padroes_coletivos.length > 0 && (
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <Card className="border-border/30 bg-card/40 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary" />
                    Padrões Coletivos Identificados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.insights_ia.padroes_coletivos.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/20">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                      </div>
                      <p className="text-xs text-foreground/70 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Alertas + Recomendações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alertas */}
            {data.insights_ia?.alertas_campo && data.insights_ia.alertas_campo.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.25 }}>
                <Card className="border-destructive/10 bg-card/40 backdrop-blur-md h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      Alertas do Campo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.insights_ia.alertas_campo.map((a, i) => (
                      <div key={i} className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <p className="text-xs text-foreground/70 leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Recomendações */}
            {data.insights_ia?.recomendacoes && data.insights_ia.recomendacoes.length > 0 && (
              <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
                <Card className="border-border/30 bg-card/40 backdrop-blur-md h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      Recomendações para o Campo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {data.insights_ia.recomendacoes.map((r, i) => (
                      <div key={i} className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-wider text-primary/60 font-medium">{r.tipo}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground/80">{r.titulo}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{r.descricao}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Pergunta reflexiva */}
          {data.insights_ia?.pergunta_reflexiva && (
            <motion.div {...fadeIn} transition={{ delay: 0.35 }}>
              <Card className="border-primary/15 bg-primary/5 backdrop-blur-md">
                <CardContent className="p-6 flex items-start gap-4">
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-primary/60 font-medium mb-1">Pergunta-Mãe</p>
                    <p className="text-sm text-foreground/80 italic leading-relaxed">
                      "{data.insights_ia.pergunta_reflexiva}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Padrões recorrentes tabela */}
          {data.padroes_recorrentes.length > 0 && (
            <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
              <Card className="border-border/30 bg-card/40 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70">Padrões Recorrentes (Dados)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {data.padroes_recorrentes.slice(0, 12).map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/10 border border-border/10">
                        <div className="min-w-0">
                          <p className="text-xs text-foreground/70 truncate">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.type}</p>
                        </div>
                        <span className="text-xs font-mono text-primary/60 shrink-0 ml-2">{p.count}×</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </CasaMaquinasLayout>
  );
}
