import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Loader2,
  Lock,
  Check,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Layers,
  Shield,
  Gem,
  Stethoscope,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface PJConfig {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  status: string;
  aviso_etico: string | null;
  texto_encerramento: string | null;
}

interface PJModulo {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  tipo: string;
  ordem: number;
  portal_minimo: string;
}

interface PJPortal {
  id: string;
  modulo_id: string;
  titulo: string;
  subtitulo: string | null;
  numero_ordem: number;
  frase_oraculo: string | null;
  missao_titulo: string | null;
  desbloqueio_tipo: string;
}

interface PJRegistro {
  portal_id: string;
  missao_concluida: boolean;
}

const TIPO_ICON: Record<string, React.ReactNode> = {
  modulo_zero: <BookOpen className="w-4 h-4" />,
  travessia: <Gem className="w-4 h-4" />,
  manual_facilitadora: <Shield className="w-4 h-4" />,
  encerramento: <Layers className="w-4 h-4" />,
};

const TIPO_LABEL: Record<string, string> = {
  modulo_zero: 'Módulo Zero',
  travessia: 'Travessia das 9 Forças',
  manual_facilitadora: 'Manual da Facilitadora',
  encerramento: 'Encerramento',
};

// ─── Component ───────────────────────────────────────────────
export default function PortalJunguiano() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isAdmin = user?.portal === 'admin';
  const isOracula = user?.portal === 'oracula' || isAdmin;

  const [config, setConfig] = useState<PJConfig | null>(null);
  const [modulos, setModulos] = useState<PJModulo[]>([]);
  const [portaisByModulo, setPortaisByModulo] = useState<Record<string, PJPortal[]>>({});
  const [registros, setRegistros] = useState<PJRegistro[]>([]);
  const [modoClinicia, setModoClinicia] = useState(false);
  const [expandedModulo, setExpandedModulo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Config
      let cfgQuery = supabase.from('portal_junguiano_config').select('*');
      if (!isAdmin) cfgQuery = cfgQuery.eq('status', 'publicado');
      const { data: cfgData } = await cfgQuery.order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (!cfgData) { setLoading(false); return; }
      setConfig(cfgData);

      // Módulos
      const { data: modData } = await supabase
        .from('portal_junguiano_modulos')
        .select('*')
        .eq('config_id', cfgData.id)
        .order('ordem');
      const safeModulos = (modData || []) as PJModulo[];
      setModulos(safeModulos);

      if (safeModulos.length > 0) {
        setExpandedModulo(safeModulos[0].id);
      }

      // Portais de todos os módulos
      const moduloIds = safeModulos.map((m) => m.id);
      if (moduloIds.length > 0) {
        const { data: portaisData } = await supabase
          .from('portal_junguiano_portais')
          .select('id, modulo_id, titulo, subtitulo, numero_ordem, frase_oraculo, missao_titulo, desbloqueio_tipo')
          .in('modulo_id', moduloIds)
          .eq('ativo', true)
          .order('numero_ordem');

        const byModulo: Record<string, PJPortal[]> = {};
        for (const p of portaisData || []) {
          if (!byModulo[p.modulo_id]) byModulo[p.modulo_id] = [];
          byModulo[p.modulo_id].push(p as PJPortal);
        }
        setPortaisByModulo(byModulo);
      }

      // Registros do usuário
      if (user?.id) {
        const { data: regData } = await supabase
          .from('portal_junguiano_registros')
          .select('portal_id, missao_concluida')
          .eq('user_id', user.id);
        setRegistros((regData || []) as PJRegistro[]);
      }
    } catch (err) {
      console.error('[PortalJunguiano] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isAdmin]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isPortalConcluido = (portalId: string) =>
    registros.some((r) => r.portal_id === portalId && r.missao_concluida);

  const isPortalDesbloqueado = (portal: PJPortal, allPortais: PJPortal[], modTipo: string): boolean => {
    if (isAdmin) return true;
    if (portal.desbloqueio_tipo === 'livre') return true;
    if (portal.numero_ordem === 1) return true;
    // Sequencial: o anterior deve estar concluído
    const anterior = allPortais.find((p) => p.numero_ordem === portal.numero_ordem - 1);
    if (!anterior) return true;
    return isPortalConcluido(anterior.id);
  };

  const totalPortais = Object.values(portaisByModulo).flat().length;
  const portaisConcluidos = registros.filter((r) => r.missao_concluida).length;
  const progressoPct = totalPortais > 0 ? Math.round((portaisConcluidos / totalPortais) * 100) : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!config) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-16 text-center max-w-lg">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-display mb-2">Portal em preparação</h2>
          <p className="text-muted-foreground text-sm">
            O Portal Junguiano ainda não foi publicado. Volte em breve.
          </p>
            {isAdmin && (
            <p className="text-xs text-yellow-500/80 mt-4">
              Admin: o portal está em rascunho. Publique-o para que as alunas vejam.
            </p>
          )}
          <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-24 max-w-3xl">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-10 space-y-4">
          {isAdmin && config.status === 'rascunho' && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">
              Rascunho — apenas admin visualiza
            </Badge>
          )}

          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
            {config.titulo}
          </h1>
          {config.subtitulo && (
            <p className="text-lg text-muted-foreground">{config.subtitulo}</p>
          )}
          {config.descricao && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
              {config.descricao}
            </p>
          )}

          {/* Barra de progresso */}
          {totalPortais > 0 && (
            <div className="pt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{portaisConcluidos} de {totalPortais} etapas concluídas</span>
                <span>{progressoPct}%</span>
              </div>
              <Progress value={progressoPct} className="h-1.5" />
            </div>
          )}

          {/* Toggle Modo Clínica */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            <Stethoscope className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Modo Clínica</span>
            <Switch
              checked={modoClinicia}
              onCheckedChange={setModoClinicia}
            />
            {modoClinicia && (
              <span className="text-xs text-muted-foreground italic ml-1">
                Linguagem objetiva ativada
              </span>
            )}
          </div>

          {/* Aviso ético (sempre visível no modo clínica, subtle no modo normal) */}
          {(modoClinicia || config.aviso_etico) && (
            <div className={cn(
              'rounded-lg px-4 py-3 text-xs leading-relaxed border',
              modoClinicia
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-muted/40 border-border text-muted-foreground'
            )}>
              <AlertCircle className="w-3.5 h-3.5 inline mr-1.5 align-text-top" />
              {config.aviso_etico}
            </div>
          )}
        </div>

        {/* ── Módulos ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          {modulos.map((modulo) => {
            const portais = portaisByModulo[modulo.id] || [];
            const isManual = modulo.tipo === 'manual_facilitadora';
            const podeVerManual = isOracula;

            // Manual da Facilitadora: oculto para quem não tem acesso
            if (isManual && !podeVerManual) return null;

            const isExpanded = expandedModulo === modulo.id;
            const concluidos = portais.filter((p) => isPortalConcluido(p.id)).length;

            return (
              <Card
                key={modulo.id}
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  isManual && 'border-primary/30 bg-primary/5'
                )}
              >
                {/* Cabeçalho do módulo */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedModulo(isExpanded ? null : modulo.id)}
                >
                  <div className="flex items-center gap-3 px-5 py-4">
                    <div className="text-muted-foreground">
                      {TIPO_ICON[modulo.tipo] || <BookOpen className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs uppercase tracking-widest text-muted-foreground">
                          {TIPO_LABEL[modulo.tipo] || modulo.tipo}
                        </span>
                        {isManual && (
                          <Badge variant="outline" className="text-[10px] border-primary/40 text-primary/80 py-0">
                            Restrito
                          </Badge>
                        )}
                      </div>
                      <h2 className="font-semibold text-foreground text-sm md:text-base">
                        {modulo.titulo}
                      </h2>
                      {portais.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {concluidos}/{portais.length} concluídos
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform shrink-0',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </div>
                </button>

                {/* Portais do módulo */}
                {isExpanded && (
                  <div className="border-t border-border/50">
                    {modulo.descricao && (
                      <p className="px-5 pt-4 pb-2 text-sm text-muted-foreground leading-relaxed">
                        {modulo.descricao}
                      </p>
                    )}

                    {portais.length === 0 ? (
                      <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        {isAdmin
                          ? 'Nenhum conteúdo ainda. Adicione via Ateliê de Conteúdo.'
                          : 'Conteúdo em breve.'}
                      </div>
                    ) : (
                      <div className="divide-y divide-border/30">
                        {portais.map((portal) => {
                          const desbloqueado = isPortalDesbloqueado(portal, portais, modulo.tipo);
                          const concluido = isPortalConcluido(portal.id);

                          return (
                            <button
                              key={portal.id}
                              disabled={!desbloqueado}
                              onClick={() => desbloqueado && navigate(`/portal-junguiano/porta/${portal.id}`)}
                              className={cn(
                                'w-full flex items-center gap-4 px-5 py-4 text-left transition-all',
                                desbloqueado
                                  ? 'hover:bg-muted/40 cursor-pointer'
                                  : 'opacity-40 cursor-not-allowed',
                              )}
                            >
                              {/* Ícone de status */}
                              <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium',
                                concluido
                                  ? 'bg-primary/20 text-primary'
                                  : desbloqueado
                                  ? 'bg-secondary text-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}>
                                {concluido ? (
                                  <Check className="w-4 h-4" />
                                ) : !desbloqueado ? (
                                  <Lock className="w-3.5 h-3.5" />
                                ) : (
                                  portal.numero_ordem
                                )}
                              </div>

                              {/* Conteúdo */}
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'text-sm font-medium truncate',
                                  modoClinicia && 'font-normal'
                                )}>
                                  {portal.titulo}
                                </p>
                                {portal.subtitulo && !modoClinicia && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {portal.subtitulo}
                                  </p>
                                )}
                                {modoClinicia && portal.missao_titulo && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    Missão: {portal.missao_titulo}
                                  </p>
                                )}
                              </div>

                              {desbloqueado && (
                                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Módulo de Encerramento */}
                    {modulo.tipo === 'encerramento' && (
                      <div className="px-5 py-6 text-center space-y-2 border-t border-border/30">
                        <p className="font-display text-base text-foreground/80 italic">
                          {config.texto_encerramento}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── Avisos finais ─────────────────────────────────────────── */}
        <div className="mt-12 text-center space-y-2">
          {modoClinicia && (
            <div className="text-xs text-muted-foreground/60 border border-dashed border-border/40 rounded-lg px-4 py-3 max-w-md mx-auto">
              <p>Modo Clínica ativo — linguagem objetiva e avisos éticos visíveis.</p>
              <p className="mt-1">{config.aviso_etico}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground/40 pt-2">
            Portal Junguiano · Casa Orácula · Conteúdo simbólico formativo
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
