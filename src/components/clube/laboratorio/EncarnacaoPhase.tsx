import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Play, Square, Send, User2, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LabOracularProgress } from '@/hooks/useLabOracular';

type ChatMsg = { role: 'user' | 'assistant'; content: string };

interface Props {
  progresso: LabOracularProgress | null | undefined;
  obra: { titulo: string; autor?: string | null };
  onBack: () => void;
}

export function EncarnacaoPhase({ progresso, obra, onBack }: Props) {
  const [personagem, setPersonagem] = useState('');
  const [iniciado, setIniciado] = useState(false);
  const [encerrado, setEncerrado] = useState(false);
  const [mensagens, setMensagens] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analiseLoading, setAnaliseLoading] = useState(false);
  const [analise, setAnalise] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Padrão herdado da Cartografia
  const padraoBase = {
    obra: obra.titulo,
    torre: progresso?.cart_torre || null,
    porta: progresso?.cart_porta || null,
    labirinto: progresso?.cart_labirinto || null,
    distrito: progresso?.cart_distrito || null,
    arquetipos: progresso?.cart_arquetipos || [],
    observacoes: progresso?.cart_observacoes || null,
  };

  const cartografiaPronta = !!(progresso?.cart_torre && progresso?.cart_porta);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [mensagens, analise]);

  async function iniciarSimulacao() {
    if (!cartografiaPronta) {
      toast.error('Preencha Torre e Porta na Cartografia primeiro.');
      return;
    }
    setIniciado(true);
    setEncerrado(false);
    setMensagens([]);
    setAnalise(null);
  }

  async function enviar() {
    const texto = input.trim();
    if (!texto || loading) return;
    const novo: ChatMsg[] = [...mensagens, { role: 'user', content: texto }];
    setMensagens(novo);
    setInput('');
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lab-encarnacao-ia', {
        body: { modo: 'reply', padrao: { ...padraoBase, personagem: personagem || null }, mensagens: novo },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const reply = (data as any)?.reply || '...';
      setMensagens((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      toast.error(e?.message || 'Falha na resposta');
    } finally {
      setLoading(false);
    }
  }

  async function encerrar() {
    if (mensagens.length < 2) {
      toast.error('Conduza ao menos uma troca antes de encerrar.');
      return;
    }
    setAnaliseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('lab-encarnacao-ia', {
        body: { modo: 'analise', padrao: { ...padraoBase, personagem: personagem || null }, mensagens },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setAnalise((data as any)?.analise);
      setEncerrado(true);
    } catch (e: any) {
      toast.error(e?.message || 'Falha na análise');
    } finally {
      setAnaliseLoading(false);
    }
  }

  function reiniciar() {
    setIniciado(false);
    setEncerrado(false);
    setMensagens([]);
    setAnalise(null);
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Fase 4</p>
            <h2 className="font-display text-lg text-foreground">Encarnação Clínica</h2>
            <p className="text-xs text-muted-foreground mt-1">
              A IA responde como uma cliente real vivendo o padrão definido na Cartografia. Treine sua condução.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>

        {!cartografiaPronta && (
          <div className="text-xs text-amber-500/90 bg-amber-500/10 border border-amber-500/20 rounded p-2 mb-3">
            Preencha ao menos <strong>Torre</strong> e <strong>Porta</strong> na fase Cartografia para que a IA possa encarnar o padrão.
          </div>
        )}

        {!iniciado && (
          <div className="space-y-3">
            <div className="grid gap-2 text-xs">
              <Linha label="Torre" value={padraoBase.torre} />
              <Linha label="Porta" value={padraoBase.porta} />
              <Linha label="Labirinto" value={padraoBase.labirinto} />
              <Linha label="Distrito" value={padraoBase.distrito} />
              <Linha label="Arquétipos" value={(padraoBase.arquetipos || []).join(', ') || null} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Personagem/figura simbólica (opcional)</label>
              <Input
                value={personagem}
                onChange={(e) => setPersonagem(e.target.value)}
                placeholder="Ex: Vasalisa, Inanna, A noiva… (não será citada pela IA)"
                className="mt-1"
              />
            </div>
            <Button onClick={iniciarSimulacao} disabled={!cartografiaPronta} className="w-full">
              <Play className="w-4 h-4 mr-2" /> Iniciar simulação
            </Button>
          </div>
        )}
      </Card>

      {iniciado && (
        <Card className="p-0 overflow-hidden flex flex-col" style={{ height: '60vh', minHeight: 420 }}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Simulação ativa — você é a terapeuta
            </div>
            <Button size="sm" variant="ghost" onClick={encerrar} disabled={analiseLoading}>
              {analiseLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Square className="w-3 h-3 mr-1" />}
              Encerrar e ver análise
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {mensagens.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">
                Faça sua primeira intervenção. A cliente responderá segundo o padrão da Cartografia.
              </p>
            )}
            {mensagens.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <User2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] text-sm rounded-2xl px-3 py-2 ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <User2 className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <Loader2 className="w-3 h-3 animate-spin inline" />
                </div>
              </div>
            )}

            {encerrado && analise && (
              <div className="mt-4 border-t border-border/50 pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-sm">Análise da condução</h3>
                </div>
                <Bloco titulo="Leitura geral" texto={analise.leitura_geral} />
                <BlocoLista titulo="Pontos fortes" itens={analise.pontos_fortes} />
                <BlocoLista titulo="A desenvolver" itens={analise.pontos_a_desenvolver} />
                {Array.isArray(analise.momentos_chave) && analise.momentos_chave.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Momentos-chave</p>
                    {analise.momentos_chave.map((mk: any, i: number) => (
                      <div key={i} className="text-xs bg-muted/40 border border-border/50 rounded p-2 space-y-1">
                        <p className="text-foreground italic">"{mk.turno_terapeuta}"</p>
                        <p className="text-muted-foreground"><strong>O que aconteceu:</strong> {mk.o_que_aconteceu}</p>
                        <p className="text-muted-foreground"><strong>Alternativa:</strong> {mk.alternativa_possivel}</p>
                      </div>
                    ))}
                  </div>
                )}
                {analise.risco_etico_observado && analise.risco_etico_observado !== 'nenhum' && (
                  <Bloco titulo="Risco ético observado" texto={analise.risco_etico_observado} />
                )}
                <Bloco titulo="Sugestão para próxima sessão" texto={analise.sugestao_proxima_sessao} />
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" onClick={reiniciar} className="flex-1">
                    Nova simulação
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!encerrado && (
            <div className="border-t border-border/50 p-2 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviar())}
                placeholder="Sua intervenção como terapeuta…"
                disabled={loading}
              />
              <Button size="icon" onClick={enviar} disabled={loading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

function Linha({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-20 flex-shrink-0">{label}:</span>
      <span className="text-foreground">{value || <em className="text-muted-foreground/60">não definido</em>}</span>
    </div>
  );
}
function Bloco({ titulo, texto }: { titulo: string; texto?: string }) {
  if (!texto) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{titulo}</p>
      <p className="text-sm text-foreground">{texto}</p>
    </div>
  );
}
function BlocoLista({ titulo, itens }: { titulo: string; itens?: string[] }) {
  if (!itens || itens.length === 0) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{titulo}</p>
      <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
        {itens.map((i, k) => <li key={k}>{i}</li>)}
      </ul>
    </div>
  );
}
