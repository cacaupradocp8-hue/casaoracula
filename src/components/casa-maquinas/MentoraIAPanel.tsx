import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface MentoraIAPanelProps {
  clienteId: string;
  clienteNome: string;
  dadosCidadela?: {
    distrito_ativo?: string;
    torres?: string[];
    portas?: string[];
    arquetipos?: string[];
    ferramentas?: string[];
  };
  historicoSessao?: string;
  vozTerapeuta?: string;
}

interface TherapistProfileData {
  estilo_conducao: string;
  linguagem: string;
  nivel_profundidade: string;
  padrao_decisao: string;
  ferramentas_preferidas: string[];
  pontos_fortes: string[];
  pontos_cegos: string[];
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mentora-ia`;

export function MentoraIAPanel({
  clienteId,
  clienteNome,
  dadosCidadela,
  historicoSessao,
  vozTerapeuta,
}: MentoraIAPanelProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [falaCliente, setFalaCliente] = useState('');
  const [resposta, setResposta] = useState('');
  const [loading, setLoading] = useState(false);
  const [historico, setHistorico] = useState<Array<{ fala: string; resposta: string }>>([]);
  const [perfilTerapeuta, setPerfilTerapeuta] = useState<TherapistProfileData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load therapist profile on open
  useEffect(() => {
    if (open && user) {
      supabase
        .from('co_therapist_profile')
        .select('estilo_conducao, linguagem, nivel_profundidade, padrao_decisao, ferramentas_preferidas, pontos_fortes, pontos_cegos')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setPerfilTerapeuta(data as any);
        });
    }
  }, [open, user]);

  const consultarMentora = async () => {
    if (!falaCliente.trim() || loading) return;
    setLoading(true);
    setResposta('');

    const falaAtual = falaCliente.trim();
    setFalaCliente('');

    // Build session context from previous consultations
    const contextoSessao = historico.length > 0
      ? historico.map((h, i) => `Consulta ${i + 1}: "${h.fala}" → resposta dada`).join('\n') + 
        (historicoSessao ? '\n' + historicoSessao : '')
      : historicoSessao || '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          fala_cliente: falaAtual,
          dados_cidadela: dadosCidadela,
          historico_sessao: contextoSessao,
          voz_terapeuta: vozTerapeuta,
          perfil_terapeuta: perfilTerapeuta || undefined,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast.error('Limite de requisições excedido. Aguarde um momento.');
        } else {
          toast.error('Erro ao consultar a Mentora');
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullResponse = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
              setResposta(fullResponse);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) { fullResponse += content; setResposta(fullResponse); }
          } catch { /* ignore */ }
        }
      }

      setHistorico(prev => [...prev, { fala: falaAtual, resposta: fullResponse }]);
    } catch (err) {
      console.error('Mentora error:', err);
      toast.error('Erro de conexão com a Mentora');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Consultar Mentora
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] bg-card border-border/50 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-3 border-b border-border/30">
          <SheetTitle className="font-display text-base flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            Mentora Orácula
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Orientação simbólica e clínica para a condução de {clienteNome}
          </p>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {/* Previous consultations */}
            {historico.map((h, i) => (
              <div key={i} className="space-y-2">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/20">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Fala da cliente</p>
                  <p className="text-sm text-foreground italic">"{h.fala}"</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown>{h.resposta}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {/* Current response streaming */}
            {(loading || resposta) && !historico.find(h => h.resposta === resposta) && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/15">
                  {resposta ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
                      <ReactMarkdown>{resposta}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      A Mentora está lendo o campo...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {historico.length === 0 && !loading && !resposta && (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Pronta para orientar</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
                    Registre a fala da cliente e receba leitura simbólica, direção clínica e sugestões de condução.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <Textarea
            value={falaCliente}
            onChange={e => setFalaCliente(e.target.value)}
            placeholder="O que a cliente está dizendo ou expressando..."
            className="bg-background/60 border-border/30 min-h-[80px] text-sm resize-none"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                consultarMentora();
              }
            }}
          />
          <Button
            onClick={consultarMentora}
            disabled={!falaCliente.trim() || loading}
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Lendo o campo...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Consultar Mentora
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
