import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCOTravessia, useCOEncontros, useProgressoTravessia } from '@/hooks/useCOTravessias';
import { useAuth } from '@/contexts/AuthContext';

export default function COTravessiaDetail() {
  const { travessiaId } = useParams<{ travessiaId: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isTerapeuta = profile?.portal === 'oracula' || profile?.portal === 'admin';

  const { data: travessia, isLoading: loadingT } = useCOTravessia(travessiaId);
  const { data: encontros = [], isLoading: loadingE } = useCOEncontros(travessiaId);
  const { total, completados, respostas } = useProgressoTravessia(travessiaId);

  const percent = Math.round((completados / total) * 100);

  const isEncontroCompleto = (encontroId: string) => {
    const r = respostas.find(res => res.encontro_id === encontroId);
    return !!r?.resposta_texto && r.resposta_texto.trim().length > 0;
  };

  const isEncontroDesbloqueado = (index: number) => {
    if (index === 0) return true;
    const prevEncontro = encontros[index - 1];
    return prevEncontro ? isEncontroCompleto(prevEncontro.id) : false;
  };

  // Próximo encontro disponível
  const proximoIndex = encontros.findIndex((e, i) => isEncontroDesbloqueado(i) && !isEncontroCompleto(e.id));

  if (loadingT || loadingE) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!travessia) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Travessia não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-8 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">Círculos</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro/travessias" className="hover:text-foreground transition-colors">Travessias</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/80">{travessia.titulo}</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {travessia.livro_base && (
            <p className="text-[11px] text-muted-foreground/50 flex items-center gap-1 mb-2">
              <BookOpen className="w-3 h-3" /> {travessia.livro_base}
            </p>
          )}
          <h1 className="text-3xl font-display text-foreground mb-2">{travessia.titulo}</h1>
          <p className="text-muted-foreground">{travessia.descricao}</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-muted-foreground/60 mb-2">
            <span>{completados} de {total} encontros concluídos</span>
            <span className="font-medium text-primary/70">{percent}%</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>

        {/* Próximo passo */}
        {proximoIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 rounded-lg border border-primary/15 bg-primary/5"
          >
            <p className="text-xs text-primary/60 uppercase tracking-wider mb-1">Seu próximo passo</p>
            <p className="text-sm text-foreground font-medium mb-2">
              Encontro {encontros[proximoIndex].numero_encontro}: {encontros[proximoIndex].titulo}
            </p>
            <Button
              size="sm"
              onClick={() => navigate(`/clube-livro/travessia/${travessiaId}/encontro/${encontros[proximoIndex].id}`)}
              className="gap-1"
            >
              Entrar no encontro <ArrowRight className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        {/* Encontros list */}
        <div className="space-y-3">
          {encontros.map((encontro, index) => {
            const completo = isEncontroCompleto(encontro.id);
            const desbloqueado = isEncontroDesbloqueado(index);

            return (
              <motion.div
                key={encontro.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card
                  className={`border-border/12 transition-all duration-300 ${
                    desbloqueado
                      ? 'bg-card/40 hover:-translate-y-0.5 hover:shadow-md cursor-pointer'
                      : 'bg-muted/10 opacity-60'
                  } ${completo ? 'border-primary/20' : ''}`}
                  onClick={() =>
                    desbloqueado &&
                    navigate(`/clube-livro/travessia/${travessiaId}/encontro/${encontro.id}`)
                  }
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        completo
                          ? 'bg-primary/15 text-primary'
                          : desbloqueado
                          ? 'bg-muted/20 text-foreground/70'
                          : 'bg-muted/10 text-muted-foreground/30'
                      }`}
                    >
                      {completo ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : desbloqueado ? (
                        <span className="text-sm font-medium">{encontro.numero_encontro}</span>
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">
                        Encontro {encontro.numero_encontro}
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">{encontro.titulo}</p>
                    </div>
                    {desbloqueado && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Modo terapeuta */}
        {isTerapeuta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 p-5 rounded-lg border border-amber-500/15 bg-amber-500/5"
          >
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-500/20 text-amber-400 mb-3">
              Modo Terapeuta
            </Badge>
            <div className="space-y-3">
              {encontros.map(e => (
                <div key={e.id} className="text-sm">
                  <p className="text-foreground/80 font-medium">Encontro {e.numero_encontro}: {e.titulo}</p>
                  {e.objetivo_encontro && (
                    <p className="text-muted-foreground/60 text-xs mt-0.5">
                      <strong>Objetivo:</strong> {e.objetivo_encontro}
                    </p>
                  )}
                  {e.ferramenta_sugerida && (
                    <p className="text-muted-foreground/60 text-xs">
                      <strong>Ferramenta:</strong> {e.ferramenta_sugerida}
                    </p>
                  )}
                  {e.conducao_terapeuta && (
                    <p className="text-muted-foreground/60 text-xs">
                      <strong>Condução:</strong> {e.conducao_terapeuta}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
