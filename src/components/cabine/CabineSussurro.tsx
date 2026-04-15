import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Ear, RefreshCw, Pause, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/dal/dbClient';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';

type SussurroEstado = 'observando' | 'sugestao_ativa' | 'pausa';

interface Props {
  leitura: LeituraCampo | null;
  sessionActive: boolean;
  checkinTexto?: string;
  anotacoes?: string;
}

const SUSSURRO_ESTADO_LABELS: Record<SussurroEstado, string> = {
  observando: 'Observando',
  sugestao_ativa: 'Sugestão ativa',
  pausa: 'Pausado',
};

export function CabineSussurro({ leitura, sessionActive, checkinTexto, anotacoes }: Props) {
  const [ativo, setAtivo] = useState(false);
  const [estado, setEstado] = useState<SussurroEstado>('observando');
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const solicitarSussurro = useCallback(async () => {
    if (!leitura) return;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('cabine-sintheya', {
        body: {
          mode: 'sussurro',
          context: {
            estado_campo: leitura.mensagem_estado,
            direcao_conducao: leitura.mensagem_direcao,
            risco: leitura.risco,
            checkin: checkinTexto || null,
            anotacoes: anotacoes || null,
          },
        },
      });

      if (error) throw error;
      setMensagem(data?.sussurro || 'Sustente o silêncio antes de intervir.');
      setEstado('sugestao_ativa');
    } catch {
      setMensagem('Não foi possível gerar sussurro no momento.');
    } finally {
      setLoading(false);
    }
  }, [leitura, checkinTexto, anotacoes]);

  const pausar = () => {
    setEstado('pausa');
    setMensagem(null);
  };

  return (
    <Card className="border-border/10 bg-card/30 backdrop-blur-sm">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-muted/15 flex items-center justify-center">
              <Ear className="w-3.5 h-3.5 text-muted-foreground/40" />
            </div>
            <div>
              <p className="text-[10px] font-display font-semibold text-muted-foreground/50 uppercase tracking-wider">
                Modo Sussurro
              </p>
            </div>
          </div>
          <Switch
            checked={ativo}
            onCheckedChange={(checked) => {
              setAtivo(checked);
              if (!checked) { setEstado('observando'); setMensagem(null); }
            }}
            disabled={!sessionActive}
          />
        </div>

        {!sessionActive && (
          <p className="text-[9px] text-muted-foreground/30 italic text-center">
            Disponível durante a sessão
          </p>
        )}

        {ativo && sessionActive && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground/40 italic">
                {SUSSURRO_ESTADO_LABELS[estado]}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={solicitarSussurro}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin text-muted-foreground/30" />
                  ) : (
                    <RefreshCw className="w-2.5 h-2.5 text-muted-foreground/30" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={pausar}
                >
                  <Pause className="w-2.5 h-2.5 text-muted-foreground/30" />
                </Button>
              </div>
            </div>

            {mensagem && estado === 'sugestao_ativa' && (
              <div className="p-2.5 rounded-md bg-primary/5 border border-primary/10">
                <p className="text-[11px] text-foreground/70 italic leading-relaxed">
                  {mensagem}
                </p>
              </div>
            )}

            {estado === 'observando' && !mensagem && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[10px] h-7 text-muted-foreground/40"
                onClick={solicitarSussurro}
                disabled={loading}
              >
                Nova leitura
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
