import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, XCircle, RotateCcw, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Passo {
  pergunta: string;
  opcoes: { texto: string; correta: boolean; feedback: string; pontos: number }[];
}

interface Cenario {
  id: string;
  titulo: string;
  contexto: string;
  nivel: string;
  passos_json: Passo[];
}

const NIVEL_STYLES: Record<string, string> = {
  iniciante: 'bg-emerald-500/15 text-emerald-400',
  intermediario: 'bg-amber-500/15 text-amber-400',
  avancado: 'bg-red-500/15 text-red-400',
};

export function SimuladorSessaoAvancado() {
  const { user } = useAuth();
  const [cenarios, setCenarios] = useState<Cenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Cenario | null>(null);
  const [step, setStep] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    supabase.from('simulador_cenarios').select('*').eq('ativo', true).order('ordem')
      .then(({ data }) => {
        const parsed = (data || []).map((d: any) => ({
          ...d,
          passos_json: (typeof d.passos_json === 'string' ? JSON.parse(d.passos_json) : d.passos_json) as Passo[],
        }));
        setCenarios(parsed);
        setLoading(false);
      });
  }, []);

  const iniciar = (c: Cenario) => {
    setActive(c);
    setStep(0);
    setEscolha(null);
    setPontuacao(0);
    setRespostas([]);
    setConcluido(false);
  };

  const escolher = (idx: number) => {
    if (escolha !== null || !active) return;
    setEscolha(idx);
    const passo = active.passos_json[step];
    const opt = passo.opcoes[idx];
    setPontuacao(p => p + opt.pontos);
    setRespostas(r => [...r, idx]);
  };

  const avancar = () => {
    if (!active) return;
    if (step + 1 < active.passos_json.length) {
      setStep(s => s + 1);
      setEscolha(null);
    } else {
      setConcluido(true);
      salvarProgresso();
    }
  };

  const salvarProgresso = async () => {
    if (!user || !active) return;
    await supabase.from('simulador_progresso').upsert({
      user_id: user.id,
      cenario_id: active.id,
      respostas_json: respostas,
      pontuacao,
      concluido: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,cenario_id' });
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!active) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Escolha um cenário e pratique tomada de decisão clínica com feedback imediato.
        </p>
        {cenarios.length === 0 ? (
          <Card className="bg-[#0F2438] border-primary/20 text-center py-12">
            <CardContent>
              <Play className="w-10 h-10 mx-auto text-primary/40 mb-3" />
              <p className="text-muted-foreground">Nenhum cenário disponível ainda.</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Cenários serão adicionados pela equipe pedagógica.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {cenarios.map(c => (
              <Card key={c.id} className="bg-[#0F2438] border-primary/10 hover:border-primary/30 transition-all">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base text-foreground">{c.titulo}</CardTitle>
                    <Badge className={NIVEL_STYLES[c.nivel]}>{c.nivel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.contexto}</p>
                  <p className="text-xs text-muted-foreground/50">{c.passos_json.length} decisões</p>
                  <Button onClick={() => iniciar(c)} size="sm" className="bg-primary text-primary-foreground">
                    <Play className="w-3 h-3 mr-1" /> Iniciar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (concluido) {
    const maxPontos = active.passos_json.reduce((sum, p) => sum + Math.max(...p.opcoes.map(o => o.pontos)), 0);
    const pct = maxPontos > 0 ? Math.round((pontuacao / maxPontos) * 100) : 0;
    return (
      <div className="space-y-6">
        <Card className="bg-[#0F2438] border-emerald-500/30 text-center py-8">
          <CardContent className="space-y-4">
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Cenário Concluído</h3>
            <p className="text-3xl font-bold text-primary">{pct}%</p>
            <p className="text-sm text-muted-foreground">Pontuação: {pontuacao}/{maxPontos}</p>
            <Progress value={pct} className="h-2 max-w-xs mx-auto" />
            <p className="text-sm text-muted-foreground">
              {pct >= 80 ? 'Excelente leitura clínica!' : pct >= 50 ? 'Boa prática. Revise os pontos de atenção.' : 'Continue praticando. Cada cenário é uma oportunidade de aprendizado.'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => iniciar(active)} variant="outline" className="border-primary/30 text-primary">
                <RotateCcw className="w-4 h-4 mr-1" /> Refazer
              </Button>
              <Button onClick={() => setActive(null)} className="bg-primary text-primary-foreground">
                Voltar aos Cenários
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const passo = active.passos_json[step];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Decisão {step + 1} de {active.passos_json.length}</p>
          <Button variant="ghost" size="sm" onClick={() => setActive(null)} className="text-muted-foreground/50 text-xs">Sair</Button>
        </div>
        <Progress value={((step + 1) / active.passos_json.length) * 100} className="h-1" />
      </div>

      <Card className="bg-[#0F2438] border-primary/15">
        <CardHeader>
          <CardTitle className="text-foreground text-base">{passo.pergunta}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {passo.opcoes.map((opt, idx) => {
            const chosen = escolha === idx;
            let style = 'border-primary/10 hover:border-primary/30 cursor-pointer';
            if (escolha !== null) {
              if (chosen && opt.correta) style = 'border-emerald-500/50 bg-emerald-500/5';
              else if (chosen && !opt.correta) style = 'border-red-500/30 bg-red-500/5';
              else if (opt.correta) style = 'border-emerald-500/30';
              else style = 'border-muted/10 opacity-60';
            }
            return (
              <button
                key={idx}
                onClick={() => escolher(idx)}
                disabled={escolha !== null}
                className={`w-full text-left p-4 rounded-lg border transition-all ${style}`}
              >
                <div className="flex items-center gap-2">
                  {escolha !== null && opt.correta && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {escolha !== null && chosen && !opt.correta && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  <span className="text-sm text-foreground">{opt.texto}</span>
                </div>
                {escolha !== null && (chosen || opt.correta) && (
                  <p className="text-xs text-muted-foreground mt-2">{opt.feedback}</p>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {escolha !== null && (
        <div className="flex justify-end">
          <Button onClick={avancar} className="bg-primary text-primary-foreground">
            {step + 1 < active.passos_json.length ? 'Próxima' : 'Concluir'}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
