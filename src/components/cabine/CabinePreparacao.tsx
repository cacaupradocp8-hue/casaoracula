import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Shield, Zap, Target, AlertCircle, Compass, Play } from 'lucide-react';
import type { ClienteComStatus, CartografiaProfile } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import { CabineEstadoCampo } from './CabineEstadoCampo';
import { useNavigate } from 'react-router-dom';

interface Props {
  cliente: ClienteComStatus;
  profile: CartografiaProfile | null;
  profileLoading: boolean;
  leituraCampo: LeituraCampo | null;
  onStartSession: (withoutProfile: boolean) => void;
}

export function CabinePreparacao({ cliente, profile, profileLoading, leituraCampo, onStartSession }: Props) {
  const navigate = useNavigate();
  const pj = profile?.profile_json;

  return (
    <div className="space-y-4">
      {/* Bloco 1: Identidade */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground">{cliente.nome}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-[9px]">{cliente.status || 'ativo'}</Badge>
                {cliente.lastSessionDate && (
                  <span className="text-[10px] text-muted-foreground">
                    Último atendimento: {new Date(cliente.lastSessionDate).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bloco 2: ESTADO DO CAMPO — Elemento central */}
      {profileLoading ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : leituraCampo ? (
        <CabineEstadoCampo leitura={leituraCampo} />
      ) : null}

      {/* Bloco 3: Leitura de condução clínica */}
      <Card className="border-border/20 bg-card/50">
        <CardContent className="p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-primary/60 font-medium">
            Leitura de condução clínica
          </p>

          {profileLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : profile && pj ? (
            <div className="space-y-3">
              {pj.padrao_dominante && (
                <div className="flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-primary/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase">Padrão dominante</p>
                    <p className="text-xs text-foreground/90">{pj.padrao_dominante}</p>
                  </div>
                </div>
              )}

              {pj.estrategia_defesa && (
                <div className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-500/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase">Estratégia de defesa</p>
                    <p className="text-xs text-foreground/90">{pj.estrategia_defesa}</p>
                  </div>
                </div>
              )}

              {pj.tensao_central && (
                <div className="flex items-start gap-2">
                  <Zap className="w-3.5 h-3.5 text-red-400/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase">Tensão central</p>
                    <p className="text-xs text-foreground/90">{pj.tensao_central}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {pj.o_que_evitar && (
                  <div className="p-2 rounded-md bg-destructive/5 border border-destructive/10">
                    <p className="text-[9px] text-destructive/60 uppercase mb-0.5">Evitar</p>
                    <p className="text-[11px] text-foreground/80">{pj.o_que_evitar}</p>
                  </div>
                )}
                {pj.o_que_priorizar && (
                  <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                    <p className="text-[9px] text-primary/60 uppercase mb-0.5">Priorizar</p>
                    <p className="text-[11px] text-foreground/80">{pj.o_que_priorizar}</p>
                  </div>
                )}
              </div>

              {pj.ritmo_ideal && (
                <div className="flex items-start gap-2">
                  <Compass className="w-3.5 h-3.5 text-primary/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase">Ritmo recomendado</p>
                    <p className="text-xs text-foreground/90">{pj.ritmo_ideal}</p>
                  </div>
                </div>
              )}

              {pj.direcao_inicial && (
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15">
                  <p className="text-[9px] text-primary/60 uppercase mb-1">Direção inicial</p>
                  <p className="text-xs text-foreground/90">{pj.direcao_inicial}</p>
                </div>
              )}

              <p className="text-[9px] text-muted-foreground/40 italic">
                Contexto: {profile.contexto} · Atualizado em {new Date(profile.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground/60">Nenhuma leitura de condução disponível para esta cliente.</p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate('/casa-das-maquinas/ferramentas/cartografia')}
                >
                  Criar leitura agora
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => onStartSession(true)}
                >
                  Iniciar sem leitura
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bloco 4: Botão principal */}
      {(profile || profileLoading) && (
        <Button
          onClick={() => onStartSession(!profile)}
          className="w-full h-12 text-sm font-display font-semibold bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
          disabled={profileLoading}
        >
          <Play className="w-4 h-4" />
          Iniciar Sessão
        </Button>
      )}
    </div>
  );
}
