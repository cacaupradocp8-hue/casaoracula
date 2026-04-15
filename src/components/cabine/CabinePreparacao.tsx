import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Play, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { ClienteComStatus, CartografiaProfile } from '@/pages/casa-maquinas/CabineTerapeutaPage';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import { CabineEstadoCampo } from './CabineEstadoCampo';
import { CabineDecisaoClinica } from './CabineDecisaoClinica';
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
  const [showBase, setShowBase] = useState(false);

  return (
    <div className="space-y-4">
      {/* Identidade */}
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

      {/* TOMADA DE DECISÃO CLÍNICA — Centro da cabine */}
      {profileLoading ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-5 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : leituraCampo ? (
        <CabineDecisaoClinica
          leitura={leituraCampo}
          profile={profile}
        />
      ) : (
        <Card className="border-border/20 bg-card/50">
          <CardContent className="p-4">
            <div className="text-center py-6 space-y-3">
              <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto" />
              <p className="text-xs text-muted-foreground/60">Nenhuma leitura de condução disponível para esta cliente.</p>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => navigate('/casa-das-maquinas/ferramentas/cartografia')}
              >
                Criar leitura agora
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão principal — só aparece se há leitura */}
      {leituraCampo && (
        <Button
          onClick={() => onStartSession(false)}
          className="w-full h-12 text-sm font-display font-semibold bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
        >
          <Play className="w-4 h-4" />
          Iniciar Sessão
        </Button>
      )}
    </div>
  );
}
