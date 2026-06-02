import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MessageCircleQuestion, ShieldAlert, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  obterPerguntasParaDistritos,
  CUIDADOS_ETICOS_TEXTO,
  HIPOTESE_CONDUCAO_TEXTO,
  type TerritorioPerguntas,
} from '@/lib/cartografia/perguntasNarrativas';

interface CondutaSimbolicaProps {
  clienteId: string;
}

/**
 * Camada de Condução Clínica — v1
 *
 * Apoio simbólico à escuta da terapeuta. NÃO usa IA.
 * Apenas organiza territórios vivos da CidadELA da cliente e associa
 * a perguntas narrativas pré-cadastradas de um catálogo fixo.
 *
 * Não interpreta. Não diagnostica. Não recomenda rotas/ferramentas.
 */
export function CondutaSimbolica({ clienteId }: CondutaSimbolicaProps) {
  const [loading, setLoading] = useState(true);
  const [territorios, setTerritorios] = useState<string[]>([]);
  const [territoriosComPerguntas, setTerritoriosComPerguntas] = useState<TerritorioPerguntas[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('cartografia_psiquica')
        .select('territorios_principais, created_at')
        .eq('client_id', clienteId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      const distritos = (data?.territorios_principais as string[] | null) ?? [];
      setTerritorios(distritos);
      setTerritoriosComPerguntas(obterPerguntasParaDistritos(distritos));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [clienteId]);

  return (
    <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Compass className="h-5 w-5 text-primary" />
          Condução Simbólica
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Apoio à escuta — sem interpretação automática, sem diagnóstico.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 1. Hipótese de Condução */}
        <section className="space-y-2">
          <h4 className="text-sm font-medium text-foreground/90">Hipótese de Condução</h4>
          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">
            {HIPOTESE_CONDUCAO_TEXTO}
          </p>
        </section>

        {/* 2. Territórios vivos */}
        <section className="space-y-2">
          <h4 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary/80" />
            Territórios vivos
          </h4>
          {loading ? (
            <p className="text-xs text-muted-foreground italic">Carregando mapa…</p>
          ) : territorios.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Nenhum território identificado para esta cliente ainda.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {territorios.map((t) => (
                <Badge key={t} variant="outline" className="border-primary/30 bg-primary/5">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </section>

        {/* 3. Perguntas Narrativas */}
        <section className="space-y-3">
          <h4 className="text-sm font-medium text-foreground/90 flex items-center gap-2">
            <MessageCircleQuestion className="h-4 w-4 text-primary/80" />
            Perguntas narrativas
          </h4>
          {loading ? (
            <p className="text-xs text-muted-foreground italic">Carregando…</p>
          ) : territoriosComPerguntas.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              {territorios.length === 0
                ? 'Aguardando a primeira Cartografia Psíquica da cliente.'
                : 'Não há perguntas catalogadas para os territórios vivos atuais.'}
            </p>
          ) : (
            <ul className="space-y-3">
              {territoriosComPerguntas.map((territorio) => (
                <li key={territorio.chave} className="space-y-1.5">
                  <div className="text-xs font-medium uppercase tracking-wide text-primary/80">
                    {territorio.nome}
                  </div>
                  <ul className="space-y-1 pl-3 border-l border-border/40">
                    {territorio.perguntas.map((p, i) => (
                      <li key={i} className="text-sm text-foreground/85 leading-relaxed">
                        — {p}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 4. Cuidados Éticos */}
        <section className="rounded-md border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500/90 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-100/80 leading-relaxed">{CUIDADOS_ETICOS_TEXTO}</p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
