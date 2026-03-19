import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Waves, Flame, Zap, ScrollText, MapPin, Compass } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ESTADO_META: Record<string, { icon: any; color: string; label: string }> = {
  retencao: { icon: Waves, color: 'text-blue-400', label: 'Retenção' },
  travessia: { icon: Flame, color: 'text-gold', label: 'Travessia' },
  emergencia: { icon: Zap, color: 'text-purple-400', label: 'Emergência' },
};

interface RegistroResumo {
  id: string;
  titulo_simbolico: string;
  estado_campo: string;
  torre_ativa: string | null;
  porta_ativa: string | null;
  arquetipo_presente: string | null;
  created_at: string;
}

export function ArquivoVivoTab() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState<RegistroResumo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data } = await (supabase.from('tecela_registros_campo' as any) as any)
      .select('id, titulo_simbolico, estado_campo, torre_ativa, porta_ativa, arquetipo_presente, created_at')
      .eq('autor_id', user.id)
      .order('created_at', { ascending: false });
    setRegistros(data || []);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  // Compute stats
  const estadoCounts: Record<string, number> = {};
  const torreCounts: Record<string, number> = {};
  const arquetipoCounts: Record<string, number> = {};

  registros.forEach(r => {
    estadoCounts[r.estado_campo] = (estadoCounts[r.estado_campo] || 0) + 1;
    if (r.torre_ativa) torreCounts[r.torre_ativa] = (torreCounts[r.torre_ativa] || 0) + 1;
    if (r.arquetipo_presente) arquetipoCounts[r.arquetipo_presente] = (arquetipoCounts[r.arquetipo_presente] || 0) + 1;
  });

  const topTorres = Object.entries(torreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topArquetipos = Object.entries(arquetipoCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (isLoading) return <div className="text-center py-8 text-muted-foreground font-display">Revelando o arquivo...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campos recorrentes */}
        <Card className="glass border-border/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-display text-foreground">Campos Recorrentes</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(estadoCounts).map(([estado, count]) => {
                const meta = ESTADO_META[estado] || ESTADO_META.travessia;
                const Icon = meta.icon;
                return (
                  <div key={estado} className="flex items-center justify-between text-sm">
                    <span className={`flex items-center gap-1.5 ${meta.color}`}><Icon className="w-3.5 h-3.5" /> {meta.label}</span>
                    <span className="text-muted-foreground">{count}×</span>
                  </div>
                );
              })}
              {Object.keys(estadoCounts).length === 0 && <p className="text-xs text-muted-foreground italic">Nenhum registro ainda</p>}
            </div>
          </CardContent>
        </Card>

        {/* Torres mais ativadas */}
        <Card className="glass border-border/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-display text-foreground">Torres Mais Ativadas</h3>
            </div>
            <div className="space-y-2">
              {topTorres.map(([nome, count]) => (
                <div key={nome} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">{nome}</span>
                  <span className="text-muted-foreground">{count}×</span>
                </div>
              ))}
              {topTorres.length === 0 && <p className="text-xs text-muted-foreground italic">Nenhuma torre registrada</p>}
            </div>
          </CardContent>
        </Card>

        {/* Arquétipos presentes */}
        <Card className="glass border-border/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <ScrollText className="w-4 h-4 text-gold" />
              <h3 className="text-sm font-display text-foreground">Arquétipos Presentes</h3>
            </div>
            <div className="space-y-2">
              {topArquetipos.map(([nome, count]) => (
                <div key={nome} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">{nome}</span>
                  <span className="text-muted-foreground">{count}×</span>
                </div>
              ))}
              {topArquetipos.length === 0 && <p className="text-xs text-muted-foreground italic">Nenhum arquétipo registrado</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-display text-gold mb-4 flex items-center gap-2">
          <ScrollText className="w-4 h-4" /> Linha do Tempo Simbólica
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-primary/20 to-transparent" />

          <div className="space-y-4">
            {registros.map(registro => {
              const meta = ESTADO_META[registro.estado_campo] || ESTADO_META.travessia;
              const Icon = meta.icon;
              return (
                <div key={registro.id} className="flex gap-4 items-start pl-1">
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 z-10 bg-background ${meta.color === 'text-gold' ? 'border-gold/40' : meta.color === 'text-blue-400' ? 'border-blue-500/40' : 'border-purple-500/40'}`}>
                    <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pb-4">
                    <p className="text-sm font-display text-foreground">{registro.titulo_simbolico}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(registro.created_at), "d 'de' MMMM", { locale: ptBR })}
                      </span>
                      <Badge variant="outline" className={`text-xs ${meta.color}`}>{meta.label}</Badge>
                      {registro.torre_ativa && <Badge variant="secondary" className="text-xs">{registro.torre_ativa}</Badge>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {registros.length === 0 && (
          <div className="text-center py-12">
            <ScrollText className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-display">Seu arquivo ainda não tem tecidos.</p>
            <p className="text-xs text-muted-foreground mt-1">Comece registrando seu primeiro campo na aba Tecidos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
