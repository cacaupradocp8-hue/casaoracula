import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, RefreshCw, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function BussolaTecelaTab() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [leitura, setLeitura] = useState<string | null>(null);
  const [hasRegistros, setHasRegistros] = useState(false);

  const checkRegistros = useCallback(async () => {
    if (!user) return;
    const { count } = await (supabase.from('tecela_registros_campo' as any) as any)
      .select('id', { count: 'exact', head: true })
      .eq('autor_id', user.id);
    setHasRegistros((count || 0) >= 3);
  }, [user]);

  useEffect(() => { checkRegistros(); }, [checkRegistros]);

  const gerarLeitura = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch user's recent records
      const { data: registros } = await (supabase.from('tecela_registros_campo' as any) as any)
        .select('titulo_simbolico, texto, torre_ativa, porta_ativa, arquetipo_presente, estado_campo')
        .eq('autor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!registros || registros.length < 3) {
        setLeitura('Seu campo ainda precisa de mais registros para revelar padrões. Continue tecendo.');
        setIsLoading(false);
        return;
      }

      // Analyze patterns locally
      const estadoCounts: Record<string, number> = {};
      const torreCounts: Record<string, number> = {};
      const arquetipoCounts: Record<string, number> = {};

      registros.forEach((r: any) => {
        estadoCounts[r.estado_campo] = (estadoCounts[r.estado_campo] || 0) + 1;
        if (r.torre_ativa) torreCounts[r.torre_ativa] = (torreCounts[r.torre_ativa] || 0) + 1;
        if (r.arquetipo_presente) arquetipoCounts[r.arquetipo_presente] = (arquetipoCounts[r.arquetipo_presente] || 0) + 1;
      });

      const estadoDominante = Object.entries(estadoCounts).sort((a, b) => b[1] - a[1])[0];
      const torreDominante = Object.entries(torreCounts).sort((a, b) => b[1] - a[1])[0];
      const arquetipoDominante = Object.entries(arquetipoCounts).sort((a, b) => b[1] - a[1])[0];

      // Build symbolic reading
      const partes: string[] = [];

      if (estadoDominante) {
        const msg: Record<string, string> = {
          retencao: 'Seu campo mostra predominância de retenção. O momento pede escuta e pausa, não intervenção direta.',
          travessia: 'Seu campo revela movimento de travessia. Há um processo ativo de transformação — acompanhe sem apressar.',
          emergencia: 'Seu campo aponta para emergência. Algo novo busca expressão — sustente sem interpretar prematuramente.',
        };
        partes.push(msg[estadoDominante[0]] || `O campo está em ${estadoDominante[0]}.`);
      }

      if (torreDominante) {
        partes.push(`A torre mais ativada é "${torreDominante[0]}" (${torreDominante[1]}× nos últimos registros). Observe o que essa torre guarda e o que protege.`);
      }

      if (arquetipoDominante) {
        partes.push(`O arquétipo "${arquetipoDominante[0]}" aparece com mais frequência. Considere quais ferramentas sustentam essa presença sem reforçar a ferida.`);
      }

      // General suggestion
      if (estadoDominante?.[0] === 'retencao') {
        partes.push('Sugestão: evite ferramentas de confronto direto. Prefira práticas contemplativas e de acolhimento.');
      } else if (estadoDominante?.[0] === 'emergencia') {
        partes.push('Sugestão: utilize ferramentas de contenção e escuta antes de explorar profundamente.');
      } else {
        partes.push('Sugestão: mantenha o ritmo natural da travessia. Use ferramentas de integração quando houver sinais de chegada.');
      }

      setLeitura(partes.join('\n\n'));
    } catch (err) {
      console.error('Bússola error:', err);
      setLeitura('Não foi possível gerar a leitura neste momento.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="text-center max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
          <Compass className="w-8 h-8 text-gold" />
        </div>
        <h3 className="font-display text-xl text-gold mb-2">Bússola da Cartógrafa</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A Bússola analisa seus registros de campo e identifica padrões simbólicos — 
          torres recorrentes, estados predominantes e arquétipos presentes. 
          Ela sugere posturas de facilitação, nunca diagnósticos.
        </p>
      </div>

      {/* Action */}
      <div className="text-center">
        {!hasRegistros ? (
          <Card className="glass border-border/20 max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                A Bússola precisa de ao menos <strong>3 registros de campo</strong> para revelar padrões. Continue tecendo na aba Tecidos.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="gold"
            size="lg"
            onClick={gerarLeitura}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {leitura ? 'Gerar Nova Leitura' : 'Revelar Padrões do Campo'}
          </Button>
        )}
      </div>

      {/* Reading */}
      {leitura && (
        <Card className="glass border-gold/20 max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-gold" />
              <p className="text-xs text-gold tracking-widest uppercase">Leitura do Campo</p>
            </div>
            {leitura.split('\n\n').map((paragrafo, i) => (
              <p key={i} className="text-sm text-foreground/90 leading-relaxed">
                {paragrafo}
              </p>
            ))}
            <div className="pt-3 border-t border-border/20">
              <p className="text-xs text-muted-foreground italic">
                Esta leitura é sugestiva e simbólica. A interpretação final pertence à facilitadora.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
