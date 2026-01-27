// ============================================
// CLUBE DO LIVRO ORACULAR - Guia Oracular de Leitura (Fase/Semana)
// ============================================

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useClubeCicloDetalhe, useClubeFasePerguntas, ClubeFase } from '@/hooks/useClubeLivro';
import { FaseWeekContent } from '@/components/clube-livro';
import { 
  BookOpen, ChevronRight, Home, Sparkles, 
  ArrowLeft, ArrowRight, Save, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClubeLivroFase() {
  const { id: cicloId, faseId } = useParams<{ id: string; faseId: string }>();
  const navigate = useNavigate();
  const { ciclo, fases, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId);
  const { perguntas, respostas, isLoading: loadingPerguntas, salvarResposta } = useClubeFasePerguntas(faseId, cicloId);
  
  const [localRespostas, setLocalRespostas] = useState<Record<string, string>>({});
  const [savedPerguntaIds, setSavedPerguntaIds] = useState<Set<string>>(new Set());

  // Fase atual
  const faseAtual = fases?.find(f => f.id === faseId);
  const faseIndex = fases?.findIndex(f => f.id === faseId) ?? -1;
  const fasePrev = faseIndex > 0 ? fases?.[faseIndex - 1] : null;
  const faseNext = faseIndex >= 0 && fases && faseIndex < fases.length - 1 ? fases[faseIndex + 1] : null;

  // Sync respostas salvas
  useEffect(() => {
    if (respostas) {
      const map: Record<string, string> = {};
      respostas.forEach(r => {
        map[r.pergunta_id] = r.resposta || '';
      });
      setLocalRespostas(prev => ({ ...prev, ...map }));
    }
  }, [respostas]);

  const handleChange = (perguntaId: string, value: string) => {
    setLocalRespostas(prev => ({ ...prev, [perguntaId]: value }));
    // Remove from saved when editing
    setSavedPerguntaIds(prev => {
      const next = new Set(prev);
      next.delete(perguntaId);
      return next;
    });
  };

  const handleSave = async (perguntaId: string) => {
    const resposta = localRespostas[perguntaId] || '';
    await salvarResposta.mutateAsync({ perguntaId, resposta });
    setSavedPerguntaIds(prev => new Set(prev).add(perguntaId));
  };

  const isLoading = loadingCiclo || loadingPerguntas;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!ciclo || !faseAtual) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-display mb-2">Fase não encontrada</h2>
          <Button variant="outline" onClick={() => navigate(`/clube-livro/${cicloId}`)}>
            Voltar ao Livro
          </Button>
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
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Clube do Livro
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors">
            {ciclo.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{faseAtual.titulo}</span>
        </nav>

        {/* Week-based Content Blocks */}
        <FaseWeekContent fase={faseAtual} faseIndex={faseIndex} />

        {/* Separator before questions */}
        {perguntas && perguntas.length > 0 && (
          <div className="my-8 border-t border-border pt-8">
            <h3 className="text-lg font-display text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Pergunta-Guia
            </h3>
          </div>
        )}

        {/* Perguntas Oraculares */}
        {perguntas && perguntas.length > 0 ? (
          <div className="space-y-6 mb-8">
            {perguntas.map((pergunta, i) => {
              const isSaved = savedPerguntaIds.has(pergunta.id);
              const hasContent = (localRespostas[pergunta.id] || '').trim().length > 0;
              
              return (
                <Card key={pergunta.id} className="bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-display text-foreground flex items-start gap-3">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{pergunta.texto_pergunta}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      value={localRespostas[pergunta.id] || ''}
                      onChange={(e) => handleChange(pergunta.id, e.target.value)}
                      placeholder="Escreva sua reflexão aqui... (privado, só você vê)"
                      className="min-h-[120px] resize-none bg-background/50"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Sua escrita é privada e fica guardada no Jardim da Psique.
                      </p>
                      <Button
                        size="sm"
                        variant={isSaved ? 'outline' : 'default'}
                        onClick={() => handleSave(pergunta.id)}
                        disabled={salvarResposta.isPending || !hasContent}
                        className={cn(
                          isSaved && 'border-green-500/50 text-green-500'
                        )}
                      >
                        {isSaved ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Salvo
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3 mr-1" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed mb-8">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Nenhuma pergunta cadastrada para esta fase.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {fasePrev ? (
            <Button
              variant="ghost"
              onClick={() => navigate(`/clube-livro/${cicloId}/fase/${fasePrev.id}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {fasePrev.titulo}
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate(`/clube-livro/${cicloId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Livro
            </Button>
          )}

          {faseNext && (
            <Button
              variant="ghost"
              onClick={() => navigate(`/clube-livro/${cicloId}/fase/${faseNext.id}`)}
            >
              {faseNext.titulo}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
