// ============================================
// TELA 4 — MEU CAMINHO NO CLUBE
// Histórico de integrações da usuária
// ============================================

import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMeuCaminhoIntegracoes } from '@/hooks/useIntegracaoOracular';
import {
  Home,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Clock,
  Loader2,
  ArrowRight,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MeuCaminhoClube() {
  const navigate = useNavigate();
  const { data: integracoes, isLoading } = useMeuCaminhoIntegracoes();

  const concluidas = integracoes?.filter((i) => i.status === 'concluida') || [];
  const emAndamento = integracoes?.filter((i) => i.status === 'em_andamento') || [];
  const totalMovimentos = integracoes?.reduce(
    (sum, i) => sum + (i.movimentos_concluidos?.filter(Boolean).length ?? 0),
    0
  ) ?? 0;

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
          <span className="text-foreground">Meu Caminho</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-gold" />
            <h1 className="text-2xl font-display text-foreground">Meu Caminho no Clube</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Seus registros oraculares — privados, guardados, só seus.
          </p>
        </div>

        {/* Indicador simbólico */}
        {!isLoading && integracoes && integracoes.length > 0 && (
          <Card className="mb-8 border-gold/20 bg-gradient-to-br from-card to-gold/5">
            <CardContent className="pt-5 pb-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-display text-gold">{integracoes.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Livros iniciados</p>
                </div>
                <div>
                  <p className="text-2xl font-display text-gold">{concluidas.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Integrações completas</p>
                </div>
                <div>
                  <p className="text-2xl font-display text-gold">{totalMovimentos}</p>
                  <p className="text-xs text-muted-foreground mt-1">Movimentos realizados</p>
                </div>
              </div>

              {/* Barra de progresso simbólica */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Caminho percorrido</span>
                  <span>{concluidas.length}/{integracoes.length}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{
                      width: `${integracoes.length > 0 ? (concluidas.length / integracoes.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : integracoes && integracoes.length > 0 ? (
          <div className="space-y-4">
            {/* Em andamento */}
            {emAndamento.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Em andamento
                </h2>
                <div className="space-y-3">
                  {emAndamento.map((item) => (
                    <IntegracaoCard key={item.id} item={item} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}

            {/* Concluídas */}
            {concluidas.length > 0 && (
              <section className={emAndamento.length > 0 ? 'mt-6' : ''}>
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Integrações concluídas
                </h2>
                <div className="space-y-3">
                  {concluidas.map((item) => (
                    <IntegracaoCard key={item.id} item={item} navigate={navigate} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <Card className="bg-muted/20 border-dashed">
            <CardContent className="py-12 text-center">
              <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">Seu caminho ainda está em branco.</p>
              <p className="text-xs text-muted-foreground mb-6">
                Acesse um livro do Clube e inicie sua primeira integração.
              </p>
              <Button variant="outline" onClick={() => navigate('/clube-livro')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Ir para os Círculos de Leitura
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

// Card de cada integração
function IntegracaoCard({
  item,
  navigate,
}: {
  item: ReturnType<typeof useMeuCaminhoIntegracoes>['data'] extends (infer T)[] ? T : never;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const ciclo = item?.clube_livro_ciclos;
  const movFeitos = item?.movimentos_concluidos?.filter(Boolean).length ?? 0;
  const isConcluida = item?.status === 'concluida';

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-gold/40 group',
        isConcluida && 'bg-gold/5 border-gold/20'
      )}
      onClick={() => navigate(`/clube-livro/${item.ciclo_id}/integracao`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {ciclo?.capa_url ? (
            <img
              src={ciclo.capa_url}
              alt={ciclo.titulo}
              className="w-10 h-14 object-cover rounded shrink-0"
            />
          ) : (
            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={isConcluida ? 'default' : 'secondary'}
                className={cn('text-xs shrink-0', isConcluida && 'bg-gold/20 text-gold border-gold/30')}
              >
                {isConcluida ? '✦ Concluída' : 'Em andamento'}
              </Badge>
            </div>
            <p className="font-medium text-foreground text-sm truncate">
              {ciclo?.titulo || 'Livro'}
            </p>
            {ciclo?.autor_livro && (
              <p className="text-xs text-muted-foreground">{ciclo.autor_livro}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">
                {movFeitos}/3 movimentos
              </span>
              {item?.ritual_concluido && (
                <span className="text-xs text-gold">ritual ✦</span>
              )}
              {item?.registro_oracular && (
                <span className="text-xs text-muted-foreground">registro escrito</span>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
        </div>

        {/* Preview do registro */}
        {item?.registro_oracular && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground italic line-clamp-2 leading-relaxed">
              "{item.registro_oracular}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
