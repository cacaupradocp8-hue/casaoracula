import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Compass, Brain, Eye, Sparkles, RefreshCw, Loader2,
  Target, AlertTriangle, TrendingUp, Lightbulb, CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface TherapistProfile {
  estilo_conducao: string;
  linguagem: string;
  nivel_profundidade: string;
  padrao_decisao: string;
  ferramentas_preferidas: string[];
  ferramentas_evitadas: string[];
  distritos_frequentes: string[];
  pontos_fortes: string[];
  pontos_cegos: string[];
  total_sessoes: number;
  total_consultas_mentora: number;
  tendencias_json: any;
  ultima_analise: string | null;
}

interface MentoraInsight {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  lido: boolean;
  created_at: string;
}

const STYLE_ICONS: Record<string, { icon: typeof Compass; color: string; label: string }> = {
  'exploratório': { icon: Compass, color: 'text-blue-400', label: 'Exploratória' },
  'diretivo': { icon: Target, color: 'text-amber-400', label: 'Diretiva' },
  'contemplativo': { icon: Eye, color: 'text-purple-400', label: 'Contemplativa' },
  'integrativo': { icon: Brain, color: 'text-emerald-400', label: 'Integrativa' },
};

const DEPTH_LABELS: Record<string, string> = {
  'superficial': 'Prática e objetiva',
  'médio': 'Equilíbrio entre prática e profundidade',
  'profundo': 'Camadas simbólicas densas',
  'imersivo': 'Imersão total no campo psíquico',
};

export default function PerfilConducaoPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TherapistProfile | null>(null);
  const [insights, setInsights] = useState<MentoraInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [profileRes, insightsRes] = await Promise.all([
      supabase.from('co_therapist_profile').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('co_mentora_insights').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10),
    ]);
    setProfile(profileRes.data as any);
    setInsights((insightsRes.data || []) as any);
    setLoading(false);
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-therapist-profile');
      if (error) throw error;
      toast.success('Perfil atualizado com sucesso');
      await loadData();
    } catch {
      toast.error('Erro ao analisar perfil');
    } finally {
      setAnalyzing(false);
    }
  };

  const markInsightRead = async (id: string) => {
    await supabase.from('co_mentora_insights').update({ lido: true }).eq('id', id);
    setInsights(prev => prev.map(i => i.id === id ? { ...i, lido: true } : i));
  };

  const styleInfo = STYLE_ICONS[profile?.estilo_conducao || 'exploratório'] || STYLE_ICONS['exploratório'];
  const StyleIcon = styleInfo.icon;

  if (loading) {
    return (
      <CasaMaquinasLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Perfil de Condução</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Como a Mentora Orácula enxerga seu estilo terapêutico
            </p>
          </div>
          <Button
            onClick={runAnalysis}
            disabled={analyzing}
            variant="outline"
            size="sm"
            className="gap-2 border-primary/30 text-primary"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {analyzing ? 'Analisando...' : 'Atualizar Perfil'}
          </Button>
        </div>

        {!profile ? (
          <Card className="border-border/30 bg-card/60">
            <CardContent className="py-12 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-7 h-7 text-primary/60" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Perfil ainda não gerado</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  A Mentora precisa de dados das suas sessões e consultas para construir seu perfil adaptativo.
                </p>
              </div>
              <Button onClick={runAnalysis} disabled={analyzing} className="bg-primary text-primary-foreground gap-2">
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Gerar Primeiro Perfil
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Main Style Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <StyleIcon className={`w-7 h-7 ${styleInfo.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-display font-bold text-foreground text-lg">{styleInfo.label}</h2>
                        <Badge variant="secondary" className="text-[9px]">{profile.linguagem}</Badge>
                        <Badge variant="outline" className="text-[9px]">{profile.padrao_decisao}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {DEPTH_LABELS[profile.nivel_profundidade] || profile.nivel_profundidade}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-2 rounded bg-muted/30">
                          <p className="text-lg font-bold text-foreground">{profile.total_sessoes}</p>
                          <p className="text-[10px] text-muted-foreground">Sessões</p>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <p className="text-lg font-bold text-foreground">{profile.total_consultas_mentora}</p>
                          <p className="text-[10px] text-muted-foreground">Consultas</p>
                        </div>
                        <div className="text-center p-2 rounded bg-muted/30">
                          <p className="text-lg font-bold text-foreground">{profile.tendencias_json?.taxa_aceitacao || 0}%</p>
                          <p className="text-[10px] text-muted-foreground">Aceitação</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Strengths & Blind Spots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-emerald-500/20 bg-card/60 h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="w-4 h-4" /> Pontos Fortes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(profile.pontos_fortes || []).map((pf, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {pf}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="border-amber-500/20 bg-card/60 h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="w-4 h-4" /> Pontos Cegos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {(profile.pontos_cegos || []).map((pc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                          <Eye className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                          {pc}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.ferramentas_preferidas.length > 0 && (
                <Card className="border-border/30 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Ferramentas Preferidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.ferramentas_preferidas.map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.distritos_frequentes.length > 0 && (
                <Card className="border-border/30 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Distritos Frequentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.distritos_frequentes.map((d, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">{d}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.ferramentas_evitadas.length > 0 && (
                <Card className="border-border/30 bg-card/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Ferramentas Evitadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.ferramentas_evitadas.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {/* Insights from Mentora */}
        {insights.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/30 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Lightbulb className="w-4 h-4 text-primary" /> Reflexões da Mentora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-64">
                  <div className="space-y-3">
                    {insights.map(insight => (
                      <div
                        key={insight.id}
                        className={`p-3 rounded-lg border transition-all ${
                          insight.lido
                            ? 'bg-muted/10 border-border/10'
                            : 'bg-primary/5 border-primary/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-foreground">{insight.titulo}</p>
                            <p className="text-xs text-muted-foreground mt-1">{insight.descricao}</p>
                            <p className="text-[10px] text-muted-foreground/50 mt-2">
                              {new Date(insight.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {!insight.lido && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[10px] h-6"
                              onClick={() => markInsightRead(insight.id)}
                            >
                              Marcar lido
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Last analysis */}
        {profile?.ultima_analise && (
          <p className="text-[10px] text-center text-muted-foreground/50">
            Última análise: {new Date(profile.ultima_analise).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </CasaMaquinasLayout>
  );
}
