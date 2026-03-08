import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, Eye, EyeOff, Loader2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EstudoCaso {
  id: string;
  titulo: string;
  nivel: string;
  prontuario_ficticio: string;
  mapa_cidadela_json: Record<string, unknown>;
  perguntas_analise: string[];
  feedback_especialista: string;
}

const NIVEL_STYLES: Record<string, string> = {
  iniciante: 'bg-emerald-500/15 text-emerald-400',
  intermediario: 'bg-amber-500/15 text-amber-400',
  avancado: 'bg-red-500/15 text-red-400',
};

export function EstudosCasoTreinamento() {
  const { user } = useAuth();
  const [casos, setCasos] = useState<EstudoCaso[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<EstudoCaso | null>(null);
  const [resposta, setResposta] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [savedRespostas, setSavedRespostas] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('estudos_caso')
        .select('*')
        .eq('ativo', true)
        .order('ordem');
      setCasos((data as unknown as EstudoCaso[]) || []);

      if (user) {
        const { data: resps } = await supabase
          .from('estudos_caso_respostas')
          .select('estudo_caso_id, resposta')
          .eq('user_id', user.id);
        const map: Record<string, string> = {};
        resps?.forEach((r: any) => { map[r.estudo_caso_id] = r.resposta; });
        setSavedRespostas(map);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const openCaso = (caso: EstudoCaso) => {
    setSelected(caso);
    setResposta(savedRespostas[caso.id] || '');
    setShowFeedback(false);
  };

  const salvarResposta = async () => {
    if (!user || !selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('estudos_caso_respostas')
      .upsert({
        user_id: user.id,
        estudo_caso_id: selected.id,
        resposta,
      }, { onConflict: 'user_id,estudo_caso_id' });
    setSaving(false);
    if (error) toast.error('Erro ao salvar');
    else {
      toast.success('Resposta salva!');
      setSavedRespostas(prev => ({ ...prev, [selected.id]: resposta }));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (casos.length === 0) {
    return (
      <Card className="bg-[#0F2438] border-primary/20 text-center py-12">
        <CardContent>
          <BookOpen className="w-10 h-10 mx-auto text-primary/40 mb-3" />
          <p className="text-muted-foreground">Nenhum estudo de caso disponível ainda.</p>
          <p className="text-xs text-muted-foreground/50 mt-1">Os casos serão adicionados pela equipe pedagógica.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Analise prontuários de clientes fictícias, registre suas intervenções e compare com o feedback especialista.
      </p>

      <div className="grid gap-3">
        {casos.map(caso => (
          <Card
            key={caso.id}
            onClick={() => openCaso(caso)}
            className="bg-[#0F2438] border-primary/10 hover:border-primary/30 cursor-pointer transition-all group"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  {caso.titulo}
                  <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </CardTitle>
                <div className="flex gap-2">
                  {savedRespostas[caso.id] && <Badge className="bg-emerald-500/15 text-emerald-400 text-xs">Respondido</Badge>}
                  <Badge className={NIVEL_STYLES[caso.nivel] || ''}>{caso.nivel}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">{caso.prontuario_ficticio}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B1B2B] border-primary/20">
          {selected && (
            <div className="space-y-4">
              <DialogHeader>
                <Badge className={`w-fit ${NIVEL_STYLES[selected.nivel]}`}>{selected.nivel}</Badge>
                <DialogTitle className="text-xl text-foreground">{selected.titulo}</DialogTitle>
              </DialogHeader>

              <div className="p-4 rounded-lg bg-background border border-primary/10">
                <p className="text-xs text-primary mb-1 font-medium">Prontuário Fictício</p>
                <p className="text-sm text-foreground/70 whitespace-pre-line">{selected.prontuario_ficticio}</p>
              </div>

              {selected.perguntas_analise?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-primary font-medium">Perguntas para Análise</p>
                  <ul className="space-y-1">
                    {selected.perguntas_analise.map((p, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary/50">{i + 1}.</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="text-sm text-foreground/60 mb-1 block">Sua análise e intervenções sugeridas</label>
                <Textarea
                  value={resposta}
                  onChange={e => setResposta(e.target.value)}
                  placeholder="Registre aqui sua leitura clínica e intervenções que você proporia..."
                  className="min-h-[120px] bg-background border-primary/10 text-foreground placeholder:text-muted-foreground/30"
                />
                <Button onClick={salvarResposta} disabled={saving || !resposta.trim()} size="sm" className="mt-2 bg-primary text-primary-foreground">
                  {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                  Salvar Resposta
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="border-primary/30 text-primary"
                >
                  {showFeedback ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showFeedback ? 'Ocultar' : 'Ver'} Feedback Especialista
                </Button>

                {showFeedback && (
                  <Card className="mt-3 bg-[#0F2438] border-primary/20">
                    <CardContent className="pt-4">
                      <p className="text-sm text-foreground/70 whitespace-pre-line">{selected.feedback_especialista}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
