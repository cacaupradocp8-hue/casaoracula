import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  MessageCircleQuestion, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  History,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
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
  
  // Feedback state
  const [utilidade, setUtilidade] = useState<string>('Muito útil');
  const [observacao, setObservacao] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadFeedbacks = async () => {
    const { data } = await supabase
      .from('conducao_clinica_feedback')
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    if (data) setFeedbacks(data);
  };

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
      loadFeedbacks();
    })();
    return () => {
      cancelled = true;
    };
  }, [clienteId]);

  const handleSendFeedback = async () => {
    try {
      setSending(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const { error } = await supabase
        .from('conducao_clinica_feedback')
        .insert({
          client_id: clienteId,
          therapist_id: user.id,
          utilidade,
          observacao: observacao.trim() || null
        });

      if (error) throw error;

      setShowSuccess(true);
      setObservacao('');
      loadFeedbacks();
      
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Erro ao salvar feedback");
    } finally {
      setSending(false);
    }
  };

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

        <Separator className="bg-primary/10" />

        {/* 5. Feedback da Terapeuta */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-primary/90 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Esta leitura ajudou?
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] uppercase tracking-wider h-7 px-2 text-muted-foreground hover:text-primary"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-3 w-3 mr-1" />
              {showHistory ? 'Ocultar Histórico' : 'Ver Histórico'}
            </Button>
          </div>

          {!showSuccess ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-300">
              <RadioGroup 
                value={utilidade} 
                onValueChange={setUtilidade}
                className="flex flex-wrap gap-4"
              >
                {['Muito útil', 'Parcialmente útil', 'Pouco útil'].map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`util-${opt}`} className="border-primary/50" />
                    <Label htmlFor={`util-${opt}`} className="text-xs cursor-pointer hover:text-primary transition-colors">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="space-y-2">
                <Label htmlFor="obs" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  O que faltou nesta leitura? (opcional)
                </Label>
                <Textarea
                  id="obs"
                  placeholder="Sua observação clínica sobre a utilidade desta camada..."
                  className="min-h-[80px] bg-background/40 border-primary/20 text-sm focus-visible:ring-primary/30"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSendFeedback} 
                disabled={sending}
                className="w-full sm:w-auto bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                size="sm"
              >
                {sending ? 'Enviando...' : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-2" />
                    Registrar Feedback
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in duration-300">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-primary">Feedback registrado!</p>
              <p className="text-xs text-muted-foreground mt-1">Sua contribuição ajuda a validar a camada de condução.</p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2 text-xs" 
                onClick={() => setShowSuccess(false)}
              >
                Enviar outro
              </Button>
            </div>
          )}

          {showHistory && (
            <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300 border-t border-primary/5 pt-4">
              <h5 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Histórico Recente</h5>
              {feedbacks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum registro anterior.</p>
              ) : (
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {feedbacks.map((f) => (
                    <div key={f.id} className="text-xs border-l-2 border-primary/20 pl-3 py-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] h-4 py-0 border-primary/20 text-primary/80">
                          {f.utilidade}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(f.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {f.observacao && (
                        <p className="text-muted-foreground italic line-clamp-2">"{f.observacao}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
