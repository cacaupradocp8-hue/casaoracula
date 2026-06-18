import React, { useEffect, useState } from 'react';
import { useCidadelaOverview } from '@/hooks/useCidadelaOverview';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Map, Compass, GraduationCap, Dumbbell, History, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CidadelaMapSVG from '@/components/cidadela/CidadelaMapSVG';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ResultCard } from '@/components/primeira-leitura/ResultCard';

/**
 * PÁGINA /cidadela V0.3
 * 
 * Interface informativa e simbólica da Cidadela pessoal da habitante.
 * Domínio: CIDADELA_PESSOAL_ALUNA.
 * 
 * Restrições:
 * - Read-only.
 * - Sem acesso direto a serviços ou banco de dados.
 * - Sem dados clínicos ou IA.
 */
const CidadelaPage = () => {
  const {
    isLoading,
    error,
    estadoAtual,
    travessias,
    rotas,
    treinamento,
    formacao,
    proximoPasso
  } = useCidadelaOverview();

  const [primeiraLeituraResult, setPrimeiraLeituraResult] = useState<string | null>(null);
  const [resultOpen, setResultOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('primeira_leitura_result');
      if (stored) {
        setPrimeiraLeituraResult(stored);
        setResultOpen(true);
      }
    } catch {}
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <header className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <h2 className="text-2xl font-semibold text-destructive">Sinais obscurecidos</h2>
        <p className="text-muted-foreground">Não foi possível reunir os fragmentos do seu percurso neste momento.</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Tentar reconectar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* 1. Cabeçalho */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Cidadela</h1>
        <p className="text-xl text-muted-foreground font-medium">Seu centro pessoal dentro da Casa Orácula.</p>
        <p className="text-sm text-muted-foreground/80 max-w-2xl">
          Um mapa simbólico do seu percurso, das travessias já acesas e dos próximos passos possíveis.
        </p>
      </header>

      {/* Mandala da Cidadela */}
      <section className="relative flex flex-col items-center justify-center py-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-[40px]" />
        <div className="w-full max-w-[420px]">
          <CidadelaMapSVG forceCircular hideTechnicalLabels maxWidth={420} />
        </div>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-primary/50">
          Sua Cidadela Interior
        </p>
        {primeiraLeituraResult && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setResultOpen(true)}
            className="mt-3 text-xs text-primary/70 gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Rever resultado da Primeira Leitura
          </Button>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2. Card "Onde estou" */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Onde estou</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-primary">{estadoAtual.titulo}</p>
              <p className="text-sm text-muted-foreground">{estadoAtual.descricao}</p>
            </div>
            {estadoAtual.distritoAtivo && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Distrito Ativo: {estadoAtual.distritoAtivo}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* 7. Card "Próximo passo" - Priorizado visualmente */}
        {proximoPasso ? (
          <Card className="border-primary/40 shadow-sm bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Próximo passo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="font-semibold text-lg">{proximoPasso.titulo}</p>
                <p className="text-sm text-muted-foreground">{proximoPasso.descricao}</p>
              </div>
              <Button asChild className="w-full">
                <Link to={proximoPasso.href}>Seguir percurso</Link>
              </Button>
              <p className="text-[10px] text-center uppercase tracking-widest text-muted-foreground/60">
                Domínio: {proximoPasso.tipo}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Próximo passo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                A Casa ainda está reunindo sinais do seu percurso. Você pode começar pelas Rotas da Casa ou pela Sala de Treinamento.
              </p>
            </CardContent>
          </Card>
        )}

        {/* 3. Card "O que já atravessei" */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Travessias</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{travessias.total}</span>
              <span className="text-sm text-muted-foreground">marcos acesos</span>
            </div>
            {travessias.recentes.length > 0 ? (
              <ul className="space-y-2 border-t pt-4">
                {travessias.recentes.map((t) => (
                  <li key={t.id} className="text-sm flex flex-col">
                    <span className="font-medium">{t.titulo}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.contexto && `${t.contexto} • `}{t.data && new Date(t.data).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic border-t pt-4">
                Suas primeiras travessias aparecerão aqui conforme você avança na jornada.
              </p>
            )}
          </CardContent>
        </Card>

        {/* 4. Card "Rotas da Casa" */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Rotas da Casa</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{rotas.emAndamento}</p>
                <p className="text-[10px] uppercase text-muted-foreground">Ativas</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{rotas.concluidas}</p>
                <p className="text-[10px] uppercase text-muted-foreground">Concluídas</p>
              </div>
            </div>
            {rotas.proximaRota && (
              <Button asChild variant="link" className="p-0 h-auto text-primary">
                <Link to={rotas.proximaRota.href} className="flex items-center gap-1 text-sm">
                  Continuar em {rotas.proximaRota.titulo} <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 5. Card "Sala de Treinamento" */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Treinamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Módulos Iniciados</span>
                <span className="font-semibold">{treinamento.modulosIniciados}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exercícios Concluídos</span>
                <span className="font-semibold">{treinamento.exerciciosConcluidos}</span>
              </div>
            </div>
            {treinamento.proximoTreino && (
              <Button asChild variant="link" className="p-0 h-auto text-primary">
                <Link to={treinamento.proximoTreino.href} className="flex items-center gap-1 text-sm">
                  Retomar treino: {treinamento.proximoTreino.titulo} <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* 6. Card "Formação Orácula" */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Formação Orácula</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Cursos Ativos</span>
                <span className="font-semibold">{formacao.cursosAtivos}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Aulas Concluídas</span>
                <span className="font-semibold">{formacao.aulasConcluidas}</span>
              </div>
            </div>
            {formacao.proximoCurso && (
              <Button asChild variant="link" className="p-0 h-auto text-primary">
                <Link to={formacao.proximoCurso.href} className="flex items-center gap-1 text-sm">
                  Acessar {formacao.proximoCurso.titulo} <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CidadelaPage;
