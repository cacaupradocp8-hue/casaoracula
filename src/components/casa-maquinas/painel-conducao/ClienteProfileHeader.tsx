import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Clock, Target } from 'lucide-react';

interface Props {
  clienteId: string;
  clienteNome: string;
}

export function ClienteProfileHeader({ clienteId, clienteNome }: Props) {
  const { data: cliente } = useQuery({
    queryKey: ['cliente-profile-header', clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from('clientes')
        .select('objetivo_terapeutico, cartografia_sessao, data_inicio, status')
        .eq('id', clienteId)
        .single();
      return data;
    },
  });

  const { data: cityState } = useQuery({
    queryKey: ['client-city-state', clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_city_state')
        .select('distrito_ativo')
        .eq('client_id', clienteId)
        .maybeSingle();
      return data;
    },
  });

  const { data: lastSession } = useQuery({
    queryKey: ['last-session-summary', clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from('sessions')
        .select('date, insight, district_id, tool_id')
        .eq('client_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const cartografia = cliente?.cartografia_sessao as any;

  return (
    <Card className="border-border/30 bg-card/70 mb-4">
      <CardContent className="p-4 space-y-3">
        {/* Nome e status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-foreground text-sm">{clienteNome}</h2>
              <Badge variant="secondary" className="text-[9px]">
                {cliente?.status || 'ativo'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Dados históricos */}
        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/15 space-y-1.5">
          <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-medium">Dados históricos</p>
          {cliente?.objetivo_terapeutico ? (
            <div className="flex items-start gap-1.5">
              <Target className="w-3 h-3 text-primary/50 mt-0.5 shrink-0" />
              <p className="text-xs text-foreground/80 line-clamp-2">{cliente.objetivo_terapeutico}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">Objetivo terapêutico não definido</p>
          )}
          {cityState?.distrito_ativo && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-primary/50 shrink-0" />
              <p className="text-xs text-foreground/70">Distrito estrutural: <span className="font-medium text-foreground">{cityState.distrito_ativo}</span></p>
            </div>
          )}
        </div>

        {/* Leitura atual (da sessão / cartografia) */}
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15 space-y-1.5">
          <p className="text-[9px] uppercase tracking-wider text-primary/50 font-medium">Leitura da sessão anterior</p>
          {lastSession?.insight ? (
            <p className="text-xs text-foreground/80 line-clamp-2">
              <Clock className="w-3 h-3 inline mr-1 text-primary/40" />
              {lastSession.insight}
            </p>
          ) : cartografia?.leitura_psiquica?.frase_espelho ? (
            <p className="text-xs text-foreground/80 italic">{cartografia.leitura_psiquica.frase_espelho}</p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic">Primeira sessão ou dados insuficientes</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
