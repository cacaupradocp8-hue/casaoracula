// ============================================
// TELA 3 — INTEGRAÇÃO ORACULAR
// Pergunta central, movimentos, ritual, registro
// ============================================

import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useIntegracaoConfig,
  useIntegracaoRecord,
  useSalvarIntegracao,
  DEFAULT_CONFIG,
} from '@/hooks/useIntegracaoOracular';
import { useClubeCicloDetalhe } from '@/hooks/useClubeLivro';
import {
  Home,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Flame,
  PenLine,
  Loader2,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function IntegracaoOracular() {
  const { id: cicloId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { ciclo, isLoading: loadingCiclo } = useClubeCicloDetalhe(cicloId);
  const { data: config, isLoading: loadingConfig } = useIntegracaoConfig(cicloId);
  const { data: record, isLoading: loadingRecord } = useIntegracaoRecord(cicloId);
  const salvar = useSalvarIntegracao(cicloId);

  // Mescla config do banco com defaults
  const cfg = {
    pergunta_central: config?.pergunta_central || DEFAULT_CONFIG.pergunta_central,
    texto_introdutorio: config?.texto_introdutorio || DEFAULT_CONFIG.texto_introdutorio,
    movimento_1: config?.movimento_1 || DEFAULT_CONFIG.movimento_1,
    movimento_2: config?.movimento_2 || DEFAULT_CONFIG.movimento_2,
    movimento_3: config?.movimento_3 || DEFAULT_CONFIG.movimento_3,
    ritual_instrucao: config?.ritual_instrucao || DEFAULT_CONFIG.ritual_instrucao,
  };

  const [movimentos, setMovimentos] = useState<boolean[]>([false, false, false]);
  const [ritualConcluido, setRitualConcluido] = useState(false);
  const [registro, setRegistro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Inicializar com dados salvos
  useEffect(() => {
    if (record) {
      setMovimentos(record.movimentos_concluidos ?? [false, false, false]);
      setRitualConcluido(record.ritual_concluido ?? false);
      setRegistro(record.registro_oracular ?? '');
    }
  }, [record]);

  const movimentosConcluidos = movimentos.filter(Boolean).length;
  const tudo_concluido = movimentosConcluidos === 3 && ritualConcluido && registro.trim().length > 0;

  const handleToggleMovimento = async (index: number) => {
    const novos = [...movimentos];
    novos[index] = !novos[index];
    setMovimentos(novos);
    await salvar.mutateAsync({ movimentos_concluidos: novos });
  };

  const handleToggleRitual = async () => {
    const novo = !ritualConcluido;
    setRitualConcluido(novo);
    await salvar.mutateAsync({ ritual_concluido: novo });
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await salvar.mutateAsync({
        registro_oracular: registro,
        movimentos_concluidos: movimentos,
        ritual_concluido: ritualConcluido,
        status: tudo_concluido ? 'concluida' : 'em_andamento',
      });
      toast.success('Seu registro foi guardado no seu caminho ✨');
      navigate(`/clube-livro/${cicloId}/meu-caminho`);
    } finally {
      setSalvando(false);
    }
  };

  const isLoading = loadingCiclo || loadingConfig || loadingRecord;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/clube-livro" className="hover:text-foreground transition-colors">
            Círculos de Leitura Simbólica
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to={`/clube-livro/${cicloId}`} className="hover:text-foreground transition-colors">
            {ciclo?.titulo}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Integração Oracular</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 mb-4">
            <Sparkles className="w-6 h-6 text-gold" />
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold text-xs mb-3">
            Integração Oracular
          </Badge>
          <h1 className="text-2xl font-display text-foreground mb-2">
            {ciclo?.titulo}
          </h1>
          {cfg.texto_introdutorio && (
            <p className="text-muted-foreground leading-relaxed text-sm max-w-lg mx-auto">
              {cfg.texto_introdutorio}
            </p>
          )}
        </div>

        {/* Pergunta Central */}
        <Card className="mb-6 border-gold/30 bg-gradient-to-br from-card to-gold/5">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-xs uppercase tracking-widest text-gold mb-3">Pergunta Central</p>
            <p className="text-lg font-display text-foreground leading-snug">
              {cfg.pergunta_central}
            </p>
          </CardContent>
        </Card>

        {/* Movimentos de Integração */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gold" />
              Movimentos de Integração
              <Badge variant="secondary" className="ml-auto text-xs">
                {movimentosConcluidos}/3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[cfg.movimento_1, cfg.movimento_2, cfg.movimento_3].map((mov, i) =>
              mov ? (
                <div
                  key={i}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer',
                    movimentos[i] ? 'bg-gold/10' : 'bg-muted/30 hover:bg-muted/50'
                  )}
                  onClick={() => handleToggleMovimento(i)}
                >
                  <Checkbox
                    checked={movimentos[i]}
                    onCheckedChange={() => handleToggleMovimento(i)}
                    className="mt-0.5 shrink-0"
                  />
                  <p className={cn('text-sm leading-relaxed', movimentos[i] && 'line-through text-muted-foreground')}>
                    {mov}
                  </p>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>

        {/* Ritual Simbólico */}
        {cfg.ritual_instrucao && (
          <Card className="mb-6 border-border/50 bg-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-gold" />
                Ritual Simbólico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">
                {cfg.ritual_instrucao}
              </p>
              <div
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
                  ritualConcluido ? 'bg-gold/10' : 'bg-muted/30 hover:bg-muted/50'
                )}
                onClick={handleToggleRitual}
              >
                <Checkbox
                  checked={ritualConcluido}
                  onCheckedChange={handleToggleRitual}
                  className="shrink-0"
                />
                <span className={cn('text-sm', ritualConcluido && 'text-gold font-medium')}>
                  {ritualConcluido ? 'Ritual realizado ✦' : 'Marcar como realizado'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registro Oracular */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <PenLine className="w-4 h-4 text-gold" />
              Registro Oracular
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Escreva livremente. Esta escrita é privada e guardada apenas para você.
            </p>
            <Textarea
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
              placeholder="O que se moveu em você durante esta leitura? O que o livro tocou, acordou ou rompeu?"
              rows={8}
              className="resize-none bg-background/60 border-border/50 focus:border-gold/50 transition-colors text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {registro.length} caracteres
            </p>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="space-y-3">
          <Button
            onClick={handleSalvar}
            disabled={salvando || registro.trim().length === 0}
            className="w-full bg-gold hover:bg-gold/90 text-primary-foreground gap-2 py-6 text-base"
          >
            {salvando ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Star className="w-4 h-4" />
            )}
            Salvar no meu caminho
          </Button>

          {tudo_concluido && (
            <p className="text-center text-xs text-gold">
              ✦ Integração completa — movimentos, ritual e registro concluídos
            </p>
          )}

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate(`/clube-livro/${cicloId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao livro
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
