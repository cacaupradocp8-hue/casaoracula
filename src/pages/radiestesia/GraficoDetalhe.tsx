import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { useRadiestesiaConfig, Grafico } from '@/hooks/useRadiestesiaConfig';
import { 
  Grid3X3, 
  CheckCircle2,
  XCircle,
  Sparkles,
  AlertTriangle,
  Info,
  Clock,
  Gauge,
  ShieldAlert,
  Users,
  Lightbulb,
  Settings,
  ShoppingBag,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NIVEL_INTENSIDADE: Record<string, { label: string; color: string; icon: string }> = {
  suave: { label: 'Suave', color: 'bg-emerald-500/20 text-emerald-400', icon: '○' },
  medio: { label: 'Médio', color: 'bg-amber-500/20 text-amber-400', icon: '◐' },
  forte: { label: 'Forte', color: 'bg-orange-500/20 text-orange-400', icon: '◕' },
  muito_forte: { label: 'Muito Forte', color: 'bg-rose-500/20 text-rose-400', icon: '●' },
};

const TIPO_ACAO_ICONS: Record<string, string> = {
  'Limpeza': '🧹',
  'Proteção': '🛡️',
  'Potencialização': '⚡',
  'Regulador': '⚖️',
  'Emissor': '📡',
};

export default function GraficoDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { graficos, isLoading } = useRadiestesiaConfig();

  const grafico = graficos.find(g => g.slug === slug);

  if (isLoading) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Carregando..."
          subtitle="Aguarde"
          onBack={() => navigate('/radiestesia/graficos')}
          backLabel="Voltar ao Catálogo"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  if (!grafico) {
    return (
      <AppLayout>
        <ContentPageLayout
          title="Gráfico não encontrado"
          subtitle="O gráfico solicitado não existe"
          onBack={() => navigate('/radiestesia/graficos')}
          backLabel="Voltar ao Catálogo"
          maxWidth="2xl"
        >
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Gráfico não encontrado no catálogo.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/radiestesia/graficos')}
              >
                Ver todos os gráficos
              </Button>
            </CardContent>
          </Card>
        </ContentPageLayout>
      </AppLayout>
    );
  }

  const nivelInfo = grafico.nivel_intensidade 
    ? NIVEL_INTENSIDADE[grafico.nivel_intensidade] 
    : null;

  return (
    <AppLayout>
      <ContentPageLayout
        title={grafico.nome}
        subtitle={grafico.tipo_acao || 'Gráfico Radiestésico'}
        badge={grafico.tipo_acao}
        badgeIcon={<span>{TIPO_ACAO_ICONS[grafico.tipo_acao || ''] || '📊'}</span>}
        onBack={() => navigate('/radiestesia/graficos')}
        backLabel="Voltar ao Catálogo"
        maxWidth="2xl"
      >
        {/* Header com imagem e badges */}
        <Card className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Imagem */}
            <div className="md:w-1/3 bg-muted/30 flex items-center justify-center p-6 min-h-[200px]">
              {grafico.imagem_url ? (
                <img 
                  src={grafico.imagem_url} 
                  alt={grafico.nome}
                  className="max-w-full max-h-[200px] object-contain rounded-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-purple-500/20 flex items-center justify-center">
                  <Grid3X3 className="w-12 h-12 text-gold" />
                </div>
              )}
            </div>

            {/* Info básica */}
            <CardContent className="md:w-2/3 p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {grafico.autor && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {grafico.autor}
                  </Badge>
                )}
                {nivelInfo && (
                  <Badge className={cn("text-xs", nivelInfo.color)}>
                    <Gauge className="w-3 h-3 mr-1" />
                    {nivelInfo.icon} {nivelInfo.label}
                  </Badge>
                )}
              </div>

              {grafico.para_que_serve && (
                <p className="text-muted-foreground leading-relaxed">
                  {grafico.para_que_serve}
                </p>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Seção: Quando Usar */}
        {grafico.quando_usar && (
          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                Quando usar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {grafico.quando_usar}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção: Quando NÃO usar */}
        {grafico.quando_nao_usar && (
          <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-rose-400">
                <XCircle className="w-5 h-5" />
                Quando NÃO usar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {grafico.quando_nao_usar}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção: Como usar corretamente */}
        {grafico.como_usar && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-blue-400">
                <Settings className="w-5 h-5" />
                Como usar corretamente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {grafico.como_usar}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção: Erro comum de iniciantes */}
        {grafico.erro_iniciante && (
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                Erro comum de iniciantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {grafico.erro_iniciante}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Seção: Combinações seguras */}
        {grafico.combinacoes && grafico.combinacoes.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-gold">
                <Sparkles className="w-5 h-5" />
                Combinações seguras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {grafico.combinacoes.map((comb, i) => (
                  <Badge key={i} variant="outline" className="text-sm">
                    {comb}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Observação ética */}
        {grafico.observacao_etica && (
          <Card className="bg-purple-500/5 border-purple-500/20">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground mb-1">Observação ética</h4>
                  <p className="text-sm text-muted-foreground">
                    {grafico.observacao_etica}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Versão Física - se disponível */}
        {grafico.disponivel_loja && (
          <>
            <Separator />
            <Card className="bg-gradient-to-br from-gold/10 to-background border-gold/20">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {(grafico.imagem_fisica_url || grafico.imagem_url) && (
                    <div className="w-full md:w-1/4">
                      <img 
                        src={grafico.imagem_fisica_url || grafico.imagem_url || ''} 
                        alt={`${grafico.nome} - Versão Física`}
                        className="w-full rounded-lg border"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-gold" />
                      <h3 className="font-medium text-foreground">Versão Física</h3>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "O gráfico físico amplia a experiência simbólica, mas não substitui a escuta."
                    </p>
                    <Button
                      variant="outline"
                      className="text-gold border-gold/30 hover:bg-gold/10"
                      onClick={() => {
                        const lojaUrl = grafico.link_loja || 'https://casaoracula.com.br/loja';
                        window.open(lojaUrl, '_blank');
                      }}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Adquirir gráfico físico
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* CTA para usar em atendimento (futuro) */}
        <Card className="border-dashed border-muted-foreground/30 bg-muted/10">
          <CardContent className="py-6 text-center">
            <Lightbulb className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Em breve: vincular este gráfico a protocolos de atendimento
            </p>
          </CardContent>
        </Card>

        <EthicalNotice toolName={`Gráfico ${grafico.nome}`} />
      </ContentPageLayout>
    </AppLayout>
  );
}