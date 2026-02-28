import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSeasonLab, useLabProgress, useSaveLabProgress } from '@/hooks/useSeasonLab';
import { useSeasonForBook, useSeasonBooks } from '@/hooks/useOracularSeasons';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import {
  Home, ChevronRight, Search, Brain, Moon, CheckCircle2,
  Loader2, Target, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Lab8020Season() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ciclo, isLoading: cicloLoading } = useClubeCicloDetalhe(id);

  const season = useSeasonForBook(id);
  const { data: labConfig, isLoading: configLoading } = useSeasonLab(season?.id);
  const { data: progress, isLoading: progressLoading } = useLabProgress(season?.id);
  const saveMutation = useSaveLabProgress(season?.id);

  const [resposta1, setResposta1] = useState('');
  const [resposta2, setResposta2] = useState('');
  const [insight, setInsight] = useState('');

  useEffect(() => {
    if (progress) {
      setResposta1(progress.resposta_1 || '');
      setResposta2(progress.resposta_2 || '');
      setInsight(progress.insight_livre || '');
    }
  }, [progress]);

  const isLoading = cicloLoading || configLoading || progressLoading;
  const concluido = progress?.concluido === true;

  const handleSave = () => {
    saveMutation.mutate(
      { resposta_1: resposta1, resposta_2: resposta2, insight_livre: insight },
      { onSuccess: () => toast.success('Respostas salvas.') }
    );
  };

  const handleConcluir = () => {
    if (!resposta1.trim() || !resposta2.trim()) {
      toast.error('Responda às duas perguntas antes de concluir.');
      return;
    }
    saveMutation.mutate(
      { resposta_1: resposta1, resposta_2: resposta2, insight_livre: insight, concluido: true },
      { onSuccess: () => toast.success('Laboratório concluído.') }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!ciclo || !season) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl text-center">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Laboratório indisponível</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Este livro ainda não está vinculado a uma estação oracular.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Círculo de Leitura</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${id}`} className="hover:text-foreground transition-colors">{ciclo.titulo}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Lab 80/20</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-3xl mb-2">{season.simbolo}</div>
          <h1 className="text-2xl font-display text-foreground mb-1">Laboratório 80/20</h1>
          <p className="text-sm text-muted-foreground">{season.nome_estacao} · {season.periodo}</p>
        </div>

        {concluido && (
          <Card className="mb-6 border-gold/30 bg-gold/5">
            <CardContent className="p-4 flex items-center justify-center gap-2 text-gold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Laboratório concluído
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* BLOCO 1 — ESSÊNCIA */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="w-4 h-4 text-gold" />
                Essência 80/20
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {labConfig?.nucleo_vivo && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Núcleo Vivo</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.nucleo_vivo}</p>
                </div>
              )}
              {labConfig?.tensao_central && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Tensão Central</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.tensao_central}</p>
                </div>
              )}
              {labConfig?.essencia_transformadora && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Essência Transformadora</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.essencia_transformadora}</p>
                </div>
              )}
              {!labConfig && (
                <p className="text-sm text-muted-foreground italic">Conteúdo ainda não configurado para esta estação.</p>
              )}
            </CardContent>
          </Card>

          {/* BLOCO 2 — TRADUÇÃO PROFISSIONAL */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-gold" />
                Tradução Profissional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {labConfig?.traducao_aula && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Aula</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.traducao_aula}</p>
                </div>
              )}
              {labConfig?.traducao_sessao && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Sessão</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.traducao_sessao}</p>
                </div>
              )}
              {labConfig?.traducao_circulo && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Círculo</p>
                  <p className="text-sm text-foreground leading-relaxed">{labConfig.traducao_circulo}</p>
                </div>
              )}
              {!labConfig && (
                <p className="text-sm text-muted-foreground italic">Conteúdo ainda não configurado para esta estação.</p>
              )}
            </CardContent>
          </Card>

          {/* BLOCO 3 — APLICAÇÃO PESSOAL */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Moon className="w-4 h-4 text-gold" />
                Aplicação Pessoal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {labConfig?.pergunta_aplicacao_1 || 'O que este eixo simbólico move em sua prática?'}
                </label>
                <Textarea
                  value={resposta1}
                  onChange={(e) => setResposta1(e.target.value)}
                  placeholder="Escreva sua reflexão..."
                  rows={4}
                  disabled={concluido}
                  className="resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {labConfig?.pergunta_aplicacao_2 || 'Que comportamento você reconhece que precisa ser abandonado?'}
                </label>
                <Textarea
                  value={resposta2}
                  onChange={(e) => setResposta2(e.target.value)}
                  placeholder="Escreva sua reflexão..."
                  rows={4}
                  disabled={concluido}
                  className="resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Insight livre (opcional)
                </label>
                <Textarea
                  value={insight}
                  onChange={(e) => setInsight(e.target.value)}
                  placeholder="Algo mais que emergiu..."
                  rows={3}
                  disabled={concluido}
                  className="resize-none"
                />
              </div>

              {!concluido && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="flex-1"
                  >
                    {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Salvar Rascunho
                  </Button>
                  <Button
                    onClick={handleConcluir}
                    disabled={saveMutation.isPending}
                    className="flex-1 bg-gold hover:bg-gold/90 text-primary-foreground"
                  >
                    Marcar como Concluído
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
