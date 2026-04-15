import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Activity, Compass, Loader2 } from 'lucide-react';
import { useTherapeuticGroups, type GroupParticipant } from '@/hooks/useTherapeuticGroups';
import { supabase } from '@/lib/dal/dbClient';

interface Props {
  groupId: string | null;
  groupName: string;
}

export function CabineGrupoCenterPanel({ groupId, groupName }: Props) {
  const { fetchGroupParticipants } = useTherapeuticGroups();
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRegistro, setLastRegistro] = useState<any>(null);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    Promise.all([
      fetchGroupParticipants(groupId),
      supabase
        .from('jardim_grupo_registros')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(1)
        .then(r => r.data?.[0] || null),
    ]).then(([p, reg]) => {
      setParticipants(p);
      setLastRegistro(reg);
      setLoading(false);
    });
  }, [groupId]);

  if (!groupId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <Users className="w-10 h-10 text-muted-foreground/20 mx-auto" />
          <p className="text-sm text-muted-foreground/50 italic">Selecione um grupo</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-semibold mb-1">
                Campo Coletivo
              </p>
              <h3 className="text-base font-display font-semibold text-foreground">
                {groupName}
              </h3>
            </div>
          </div>

          {/* Participantes */}
          <div className="flex flex-wrap gap-1.5">
            {participants.map(p => (
              <span
                key={p.id}
                className="text-[10px] px-2 py-0.5 rounded-full bg-background/30 border border-border/10 text-foreground/70"
              >
                {p.cliente?.nome || 'Participante'}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Último registro do Jardim do Grupo */}
      {lastRegistro ? (
        <Card className="border-border/20 bg-card/40">
          <CardContent className="p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
              Último Registro do Campo
            </p>

            <div className="grid grid-cols-2 gap-2">
              {lastRegistro.clima_movimento && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Clima</p>
                  <p className="text-xs text-foreground/80 font-medium capitalize">{lastRegistro.clima_movimento}</p>
                </div>
              )}
              {lastRegistro.tema_simbolico && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Tema simbólico</p>
                  <p className="text-xs text-foreground/80 font-medium">{lastRegistro.tema_simbolico}</p>
                </div>
              )}
              {lastRegistro.fase_jornada_grupo && (
                <div className="p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Fase da jornada</p>
                  <p className="text-xs text-foreground/80 font-medium">{lastRegistro.fase_jornada_grupo}</p>
                </div>
              )}
              {lastRegistro.frase_semente_grupo && (
                <div className="col-span-2 p-2.5 rounded-lg bg-background/20 border border-border/10">
                  <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-0.5">Frase-semente</p>
                  <p className="text-xs text-foreground/80 italic">"{lastRegistro.frase_semente_grupo}"</p>
                </div>
              )}
            </div>

            {lastRegistro.escuta_campo && (
              <div className="p-3 rounded-lg bg-background/30 border border-primary/10">
                <div className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-primary/50 uppercase tracking-wider mb-0.5">Escuta do campo</p>
                    <p className="text-sm text-foreground/90">{lastRegistro.escuta_campo}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/15 bg-card/30">
          <CardContent className="p-8 text-center">
            <Activity className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground/40 italic">Nenhum registro de campo coletivo</p>
            <p className="text-[10px] text-muted-foreground/30 mt-1">O campo será alimentado após o primeiro encontro</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
