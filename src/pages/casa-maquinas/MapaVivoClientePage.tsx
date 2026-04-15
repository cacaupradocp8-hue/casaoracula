import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMapaVivoLive } from '@/hooks/useMapaVivoLive';
import { recalcularEstado } from '@/lib/cabine/motorMapaVivo';
import {
  Map,
  Loader2,
  Home,
  ChevronRight,
  Cog,
  User,
  AlertCircle,
} from 'lucide-react';

import { MapaVivoEstadoAtual } from '@/components/mapa-vivo-live/MapaVivoEstadoAtual';
import { MapaVivoLinhaJornada } from '@/components/mapa-vivo-live/MapaVivoLinhaJornada';
import { MapaVivoPadroes } from '@/components/mapa-vivo-live/MapaVivoPadroes';
import { MapaVivoRitmo } from '@/components/mapa-vivo-live/MapaVivoRitmo';
import { MapaVivoDirecaoClinica } from '@/components/mapa-vivo-live/MapaVivoDirecaoClinica';

export default function MapaVivoClientePage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clienteNome, setClienteNome] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const { loading, entries, state, fetchMapaVivo } = useMapaVivoLive();

  useEffect(() => {
    if (user && clienteId) {
      loadClienteNome();
      fetchMapaVivo(clienteId);
    }
  }, [user, clienteId]);

  const loadClienteNome = async () => {
    if (!user || !clienteId) return;
    setPageLoading(true);
    const { data } = await supabase
      .from('clientes')
      .select('nome')
      .eq('id', clienteId)
      .eq('terapeuta_id', user.id)
      .single();
    if (data) setClienteNome(data.nome);
    setPageLoading(false);
  };

  const derivedState = state || (entries.length > 0 ? recalcularEstado(entries) : null);

  if (pageLoading || loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-60" />
            <Skeleton className="h-60" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard-membro" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/casa-das-maquinas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Cog className="w-3 h-3" />
            Casa das Máquinas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Mapa Vivo — {clienteNome}</span>
        </nav>

        <SectionHeader
          title={`Mapa Vivo — ${clienteNome}`}
          subtitle="Motor de decisão clínica e memória da travessia"
          icon={<Map className="w-5 h-5" />}
          action={
            <Button
              variant="outline"
              onClick={() => clienteId && navigate(`/casa-das-maquinas/clientes/${clienteId}`)}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Perfil
            </Button>
          }
          className="mb-8"
        />

        {!derivedState ? (
          <Card className="border-border/20 bg-card/50">
            <CardContent className="p-8">
              <div className="text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Nenhum registro no Mapa Vivo ainda.
                </p>
                <p className="text-xs text-muted-foreground/60">
                  O Mapa Vivo será alimentado automaticamente ao encerrar sessões na Cabine.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* BLOCO 1 — Estado Atual (destaque máximo) */}
            <MapaVivoEstadoAtual state={derivedState} />

            {/* Grid: Jornada + Padrões */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* BLOCO 2 — Linha da Jornada */}
              <MapaVivoLinhaJornada entries={entries} />

              {/* BLOCO 3 — Padrões Detectados */}
              <MapaVivoPadroes entries={entries} />
            </div>

            {/* Grid: Ritmo + Direção */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* BLOCO 4 — Ritmo da Travessia */}
              <MapaVivoRitmo ritmo={derivedState.ritmo_atual} />

              {/* BLOCO 5 — Direção Clínica */}
              <MapaVivoDirecaoClinica state={derivedState} />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
