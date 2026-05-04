import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, ChevronRight, ArrowLeft, ArrowRight, Wrench,
  MessageCircle, PenLine, Sparkles, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  useCOTravessia,
  useCOEncontro,
  useCOEncontros,
  useCORespostas,
  useSalvarResposta,
} from '@/hooks/useCOTravessias';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAuth } from '@/contexts/AuthContext';

export default function COTravessiaEncontro() {
  const { travessiaId, encontroId } = useParams<{ travessiaId: string; encontroId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTerapeuta = user?.portal === 'oracula' || user?.portal === 'admin';

  const { data: travessia } = useCOTravessia(travessiaId);
  const { data: encontro, isLoading } = useCOEncontro(encontroId);
  const { data: encontros = [] } = useCOEncontros(travessiaId);
  const { data: respostas = [] } = useCORespostas(travessiaId);
  const salvar = useSalvarResposta();

  const resposta = respostas.find(r => r.encontro_id === encontroId);
  const [pratica, setPratica] = useState('');
  const [integracao, setIntegracao] = useState('');
  const [salvo, setSalvo] = useState(false);

  useEffect(() => {
    if (resposta) {
      setPratica(resposta.resposta_texto || '');
      setIntegracao(resposta.resposta_integracao || '');
    }
  }, [resposta]);

  const handleSalvar = async () => {
    if (!travessiaId || !encontroId) return;
    await salvar.mutateAsync({
      travessiaId,
      encontroId,
      respostaTexto: pratica,
      respostaIntegracao: integracao,
    });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  // Navigation
  const currentIndex = encontros.findIndex(e => e.id === encontroId);
  const prevEncontro = currentIndex > 0 ? encontros[currentIndex - 1] : null;
  const nextEncontro = currentIndex < encontros.length - 1 ? encontros[currentIndex + 1] : null;
  const praticaPreenchida = pratica.trim().length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!encontro || !travessia) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Encontro não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveContainer size="narrow" className="py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mb-8 flex-wrap">
          <Link to="/clube-livro/travessias" className="hover:text-foreground transition-colors">Travessias</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/travessia/${travessiaId}`} className="hover:text-foreground transition-colors">
            {travessia.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/80">Encontro {encontro.numero_encontro}</span>
        </nav>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[10px] text-primary/50 uppercase tracking-[0.3em] mb-1">
            Encontro {encontro.numero_encontro} de 4
          </p>
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-2">{encontro.titulo}</h1>
        </motion.div>

        {/* Modo terapeuta */}
        {isTerapeuta && encontro.conducao_terapeuta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-lg border border-amber-500/15 bg-amber-500/5"
          >
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-amber-500/20 text-amber-400 mb-2">
              Sugestão de Condução
            </Badge>
            <p className="text-sm text-muted-foreground/80">{encontro.conducao_terapeuta}</p>
            {encontro.objetivo_encontro && (
              <p className="text-xs text-muted-foreground/50 mt-2">
                <strong>Objetivo:</strong> {encontro.objetivo_encontro}
              </p>
            )}
          </motion.div>
        )}

        <div className="space-y-6">
          {/* 1. Abertura */}
          {encontro.abertura_texto && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/12 bg-card/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-primary/60" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Abertura</p>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{encontro.abertura_texto}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 2. Reflexões */}
          {encontro.reflexoes && encontro.reflexoes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/12 bg-card/40">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageCircle className="w-4 h-4 text-primary/60" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Reflexões</p>
                  </div>
                  <ul className="space-y-3">
                    {encontro.reflexoes.map((q, i) => (
                      <li key={i} className="text-sm text-foreground/75 leading-relaxed pl-4 border-l-2 border-primary/15">
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 3. Ferramenta sugerida */}
          {encontro.ferramenta_sugerida && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/12 bg-card/40">
                <CardContent className="p-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4 text-primary/70" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Ferramenta Sugerida</p>
                    <p className="text-sm text-foreground/80 font-medium">{encontro.ferramenta_sugerida}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 4. Prática */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/12 bg-card/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <PenLine className="w-4 h-4 text-primary/60" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Prática</p>
                </div>
                {encontro.pratica_texto && (
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{encontro.pratica_texto}</p>
                )}
                <Textarea
                  value={pratica}
                  onChange={e => setPratica(e.target.value)}
                  placeholder="Escreva sua prática aqui..."
                  className="min-h-[120px] bg-background/50 border-border/20 text-sm"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. Integração */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border-border/12 bg-card/40">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary/60" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-medium">Integração</p>
                </div>
                {encontro.integracao_texto && (
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">{encontro.integracao_texto}</p>
                )}
                <Textarea
                  value={integracao}
                  onChange={e => setIntegracao(e.target.value)}
                  placeholder="O que fica para integrar..."
                  className="min-h-[80px] bg-background/50 border-border/20 text-sm"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-4">
          <Button
            onClick={handleSalvar}
            disabled={salvar.isPending}
            className="w-full gap-2"
            size="lg"
          >
            {salvo ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Salvo
              </>
            ) : (
              'Salvar escrita'
            )}
          </Button>

          <div className="flex gap-3">
            {prevEncontro && (
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => navigate(`/clube-livro/travessia/${travessiaId}/encontro/${prevEncontro.id}`)}
              >
                <ArrowLeft className="w-3 h-3" /> Anterior
              </Button>
            )}
            {nextEncontro && praticaPreenchida && (
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => navigate(`/clube-livro/travessia/${travessiaId}/encontro/${nextEncontro.id}`)}
              >
                Próximo <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate(`/clube-livro/travessia/${travessiaId}`)}
          >
            Voltar para a travessia
          </Button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
