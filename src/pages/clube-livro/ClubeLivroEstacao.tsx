// ============================================
// ESTAÇÃO SIMBÓLICA — Laboratório 80/20
// ============================================

import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useEstacao, useEstacaoRegistros, useSaveRegistro } from '@/hooks/useEstacoes';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, ChevronRight, Home, Save, Loader2, PenLine, GraduationCap, User, Lightbulb } from 'lucide-react';
import { EstacaoAudioSection } from '@/components/audio/EstacaoAudioSection';
import { BookMediaDisplay } from '@/components/clube-livro/BookMediaDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function ClubeLivroEstacao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: estacao, isLoading } = useEstacao(id);
  const { data: registros } = useEstacaoRegistros(id);
  const saveRegistro = useSaveRegistro();
  const [texto, setTexto] = useState('');

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="animate-pulse text-muted-foreground text-sm text-center">Carregando estação…</div>
        </div>
      </AppLayout>
    );
  }

  if (!estacao) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
          <p className="text-muted-foreground">Estação não encontrada.</p>
          <Button variant="ghost" className="mt-4" onClick={() => navigate('/clube-livro/mapa')}>
            Voltar ao Mapa
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleSave = () => {
    if (!texto.trim() || !id) return;
    saveRegistro.mutate(
      { estacao_id: id, texto: texto.trim() },
      {
        onSuccess: () => {
          setTexto('');
          toast({ title: 'Registro salvo ✓' });
        },
        onError: () => {
          toast({ title: 'Erro ao salvar', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Clube do Livro</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro/mapa" className="hover:text-foreground transition-colors">Mapa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground truncate">{estacao.titulo}</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl select-none">{estacao.fase_lunar || '◯'}</span>
            <div>
              <h1 className="font-display text-xl text-foreground">{estacao.titulo}</h1>
              <p className="text-xs text-muted-foreground">{estacao.subtitulo}</p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/40 border border-border/50">
            <p className="text-sm font-medium text-foreground">{estacao.livro_titulo}</p>
            {estacao.livro_autor && <p className="text-xs text-muted-foreground">{estacao.livro_autor}</p>}
          </div>
        </motion.div>

        {/* Texto-matriz */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 border-l-2 border-primary/30"
        >
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            Este ciclo não foi criado para te explicar nada.
            <br />Ele existe para te deslocar.
          </p>
        </motion.div>

        {/* Mídia do Livro */}
        {id && <BookMediaDisplay stationId={id} />}

        {/* Áudio da Estação */}
        {id && <EstacaoAudioSection estacaoId={id} />}

        <Separator className="my-6" />

        {/* ====== LABORATÓRIO 80/20 ====== */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Laboratório 80/20
          </h2>

          <div className="space-y-6">
            {/* Bloco 1 — Essência 80/20 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Bloco 1</Badge>
                  Essência 80/20
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {estacao.essencia_nucleo ? (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Núcleo Vivo</p>
                      <p className="text-sm text-foreground">{estacao.essencia_nucleo}</p>
                    </div>
                    {estacao.essencia_tensao && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Tensão Central</p>
                        <p className="text-sm text-foreground">{estacao.essencia_tensao}</p>
                      </div>
                    )}
                    {estacao.essencia_transformacao && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Transformação Exigida</p>
                        <p className="text-sm text-foreground">{estacao.essencia_transformacao}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Conteúdo em construção.</p>
                )}
              </CardContent>
            </Card>

            {/* Bloco 2 — Tradução Profissional */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Bloco 2</Badge>
                  <GraduationCap className="w-4 h-4" />
                  Tradução Profissional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {estacao.traducao_aula || estacao.traducao_sessao || estacao.traducao_circulo ? (
                  <>
                    {estacao.traducao_aula && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Aula</p>
                        <p className="text-sm text-foreground">{estacao.traducao_aula}</p>
                      </div>
                    )}
                    {estacao.traducao_sessao && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Sessão</p>
                        <p className="text-sm text-foreground">{estacao.traducao_sessao}</p>
                      </div>
                    )}
                    {estacao.traducao_circulo && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Círculo / Palestra</p>
                        <p className="text-sm text-foreground">{estacao.traducao_circulo}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Conteúdo em construção.</p>
                )}
              </CardContent>
            </Card>

            {/* Bloco 3 — Aplicação Pessoal */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Bloco 3</Badge>
                  <User className="w-4 h-4" />
                  Aplicação Pessoal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {estacao.aplicacao_reflexao || estacao.aplicacao_acao ? (
                  <>
                    {estacao.aplicacao_reflexao && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Reflexão Pessoal</p>
                        <p className="text-sm text-foreground">{estacao.aplicacao_reflexao}</p>
                      </div>
                    )}
                    {estacao.aplicacao_acao && (
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Ação Concreta</p>
                        <p className="text-sm text-foreground">{estacao.aplicacao_acao}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Conteúdo em construção.</p>
                )}
              </CardContent>
            </Card>

            {/* Bloco 4 — Registro Integrado */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">Bloco 4</Badge>
                  <PenLine className="w-4 h-4" />
                  Registro Integrado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Escreva aqui seu registro sobre esta estação…"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleSave}
                  disabled={!texto.trim() || saveRegistro.isPending}
                >
                  {saveRegistro.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Salvar Registro
                </Button>

                {/* Registros anteriores */}
                {registros && registros.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Seus registros ({registros.length})
                    </p>
                    {registros.map((r) => (
                      <div key={r.id} className="p-3 rounded-lg bg-muted/40 border border-border/50">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{r.texto}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">
                          {new Date(r.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
