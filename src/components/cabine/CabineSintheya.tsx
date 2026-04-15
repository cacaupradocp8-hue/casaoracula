import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/dal/dbClient';
import type { LeituraCampo } from '@/lib/cabine/motorOracular';
import type { SessionData } from '@/pages/casa-maquinas/CabineTerapeutaPage';

interface Props {
  clienteNome: string;
  leitura: LeituraCampo | null;
  sessionData?: SessionData;
  sessionActive: boolean;
}

interface SintheyaResponse {
  nucleo: string;
  leitura_simbolica: string;
  direcao: string;
  limite?: string;
}

export function CabineSintheya({ clienteNome, leitura, sessionData, sessionActive }: Props) {
  const [response, setResponse] = useState<SintheyaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solicitarLeitura = useCallback(async () => {
    if (!leitura) return;
    setLoading(true);
    setError(null);

    try {
      const context = {
        estado_campo: leitura.mensagem_estado,
        direcao_conducao: leitura.mensagem_direcao,
        risco: leitura.risco,
        permanencia: leitura.mensagem_permanencia,
        alerta: leitura.alerta_seguranca,
        checkin: sessionData?.checkinTexto || null,
        anotacoes: sessionData?.anotacoes || null,
        ferramenta: sessionData?.ferramentaEscolhida || null,
      };

      const { data, error: fnError } = await supabase.functions.invoke('cabine-sintheya', {
        body: { context, cliente_nome: clienteNome },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setResponse(data as SintheyaResponse);
    } catch (err: any) {
      setError(err.message || 'Erro ao consultar SINTHEYA');
    } finally {
      setLoading(false);
    }
  }, [leitura, sessionData, clienteNome]);

  return (
    <Card className="border-border/15 bg-card/40 backdrop-blur-sm">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-primary/70" />
            </div>
            <p className="text-[10px] font-display font-semibold text-primary/60 uppercase tracking-wider">
              SINTHEYA
            </p>
          </div>
          {response && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={solicitarLeitura}
              disabled={loading}
            >
              <RefreshCw className="w-3 h-3 text-muted-foreground/40" />
            </Button>
          )}
        </div>

        {!response && !loading && !error && (
          <div className="text-center py-3">
            <p className="text-[9px] text-muted-foreground/40 italic mb-2">
              Inteligência clínica invisível
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] h-7"
              onClick={solicitarLeitura}
              disabled={!leitura || loading}
            >
              <Brain className="w-3 h-3 mr-1" />
              Solicitar leitura
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-4 h-4 animate-spin text-primary/40" />
          </div>
        )}

        {error && (
          <p className="text-[10px] text-destructive/60 text-center py-2">{error}</p>
        )}

        {response && !loading && (
          <div className="space-y-2.5">
            <SintheyaBlock label="Núcleo" text={response.nucleo} />
            <SintheyaBlock label="Leitura" text={response.leitura_simbolica} />
            <SintheyaBlock label="Direção" text={response.direcao} accent />
            {response.limite && (
              <SintheyaBlock label="Limite" text={response.limite} warning />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SintheyaBlock({ label, text, accent, warning }: { label: string; text: string; accent?: boolean; warning?: boolean }) {
  const bgClass = warning
    ? 'bg-red-500/5 border-red-500/10'
    : accent
    ? 'bg-primary/5 border-primary/10'
    : 'bg-muted/10 border-border/10';

  const labelClass = warning
    ? 'text-red-400/60'
    : accent
    ? 'text-primary/60'
    : 'text-muted-foreground/50';

  return (
    <div className={`p-2 rounded-md border ${bgClass}`}>
      <p className={`text-[8px] uppercase tracking-widest mb-0.5 ${labelClass}`}>{label}</p>
      <p className="text-[11px] text-foreground/80 leading-relaxed">{text}</p>
    </div>
  );
}
