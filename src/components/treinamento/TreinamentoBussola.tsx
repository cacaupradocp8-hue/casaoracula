import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TrainingCase {
  id: string;
  titulo: string | null;
  descricao: string | null;
  distrito_correto: string | null;
  ferramenta_correta: string | null;
  pergunta_correta: string | null;
  nivel: string | null;
}

export function TreinamentoBussola() {
  const { user } = useAuth();
  const [cases, setCases] = useState<TrainingCase[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [userAnswer, setUserAnswer] = useState<{ distrito: string; ferramenta: string }>({ distrito: '', ferramenta: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('cartographer_training_cases')
      .select('*')
      .order('created_at');
    setCases((data as TrainingCase[]) || []);
    setLoading(false);
  };

  const currentCase = cases[currentIndex];

  const handleReveal = () => {
    setRevealed(true);
    const distritoMatch = userAnswer.distrito.toLowerCase().trim() === currentCase?.distrito_correto?.toLowerCase().trim();
    const ferramentaMatch = userAnswer.ferramenta.toLowerCase().trim() === currentCase?.ferramenta_correta?.toLowerCase().trim();
    if (distritoMatch && ferramentaMatch) {
      setScore(s => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScore(s => ({ ...s, total: s.total + 1 }));
    }
  };

  const handleNext = () => {
    setRevealed(false);
    setUserAnswer({ distrito: '', ferramenta: '' });
    setCurrentIndex(i => Math.min(i + 1, cases.length - 1));
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setRevealed(false);
    setUserAnswer({ distrito: '', ferramenta: '' });
    setScore({ correct: 0, total: 0 });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Compass className="w-5 h-5 animate-spin mr-2" />
        Carregando casos de treino…
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <Card className="border-dashed border-primary/30">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Compass className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>Nenhum caso de treinamento cadastrado ainda.</p>
          <p className="text-xs mt-1">Casos serão adicionados pela administração.</p>
        </CardContent>
      </Card>
    );
  }

  const isLast = currentIndex >= cases.length - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Treino da Bússola</h3>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1}/{cases.length}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            Acertos: <strong className="text-primary">{score.correct}</strong>/{score.total}
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reiniciar
          </Button>
        </div>
      </div>

      {/* Case Card */}
      {currentCase && (
        <Card className="border-primary/20 bg-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{currentCase.titulo || 'Caso sem título'}</CardTitle>
              <Badge variant="secondary" className="text-xs capitalize">
                {currentCase.nivel || 'iniciante'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentCase.descricao || 'Sem descrição disponível.'}
            </p>

            {/* User inputs */}
            {!revealed && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Qual distrito você sugeriria?
                  </label>
                  <input
                    type="text"
                    value={userAnswer.distrito}
                    onChange={e => setUserAnswer(a => ({ ...a, distrito: e.target.value }))}
                    placeholder="Ex: labirinto-narrativo"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Qual ferramenta principal?
                  </label>
                  <input
                    type="text"
                    value={userAnswer.ferramenta}
                    onChange={e => setUserAnswer(a => ({ ...a, ferramenta: e.target.value }))}
                    placeholder="Ex: torre-viva"
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <Button onClick={handleReveal} className="w-full" disabled={!userAnswer.distrito && !userAnswer.ferramenta}>
                  Revelar resposta
                </Button>
              </div>
            )}

            {/* Revealed answer */}
            {revealed && (
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                    <p className="text-xs text-muted-foreground mb-1">Distrito correto</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {userAnswer.distrito.toLowerCase().trim() === currentCase.distrito_correto?.toLowerCase().trim()
                        ? <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        : <XCircle className="w-3.5 h-3.5 text-destructive" />}
                      {currentCase.distrito_correto || '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                    <p className="text-xs text-muted-foreground mb-1">Ferramenta correta</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {userAnswer.ferramenta.toLowerCase().trim() === currentCase.ferramenta_correta?.toLowerCase().trim()
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                      {currentCase.ferramenta_correta || '—'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                    <p className="text-xs text-muted-foreground mb-1">Pergunta sugerida</p>
                    <p className="text-sm italic text-foreground">
                      {currentCase.pergunta_correta || '—'}
                    </p>
                  </div>
                </div>

                <Button onClick={handleNext} disabled={isLast} variant="outline" className="w-full">
                  {isLast ? 'Último caso' : <>Próximo caso <ArrowRight className="w-3.5 h-3.5 ml-1" /></>}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
