import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Play, Square, Send, User2, Sparkles, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LabOracularProgress } from '@/hooks/useLabOracular';

type ChatMsg = { role: 'user' | 'assistant'; content: string };
type FaseJornada = 'abertura' | 'exploracao' | 'resistencia' | 'travessia' | 'integracao';

interface PerfilBase {
  ferida_central: string;
  defesa_principal: string;
  motor_oculto: string;
  vinculo_padrao: string;
  zona_cega: string;
}

interface Props {
  progresso: LabOracularProgress | null | undefined;
  obra: { titulo: string; autor?: string | null };
  onBack: () => void;
}

const FASES: { v: FaseJornada; label: string; hint: string }[] = [
  { v: 'abertura', label: 'Abertura', hint: 'Defesa alta, cordialidade controlada' },
  { v: 'exploracao', label: 'Exploração', hint: 'Defesa média, hesitações leves' },
  { v: 'resistencia', label: 'Resistência', hint: 'Algo foi tocado — racionaliza, desvia' },
  { v: 'travessia', label: 'Travessia', hint: 'Oscilação, ambivalência forte' },
  { v: 'integracao', label: 'Integração', hint: 'Defesa baixa, escuta a si mesma' },
];

export function EncarnacaoPhase({ progresso, obra, onBack }: Props) {
  const [personagem, setPersonagem] = useState('');
  const [fase, setFase] = useState<FaseJornada>('exploracao');
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [perfil, setPerfil] = useState<PerfilBase>({
    ferida_central: '',
    defesa_principal: '',
    motor_oculto: '',
    vinculo_padrao: '',
    zona_cega: '',
  });

  const [iniciado, setIniciado] = useState(false);
  const [encerrado, setEncerrado] = useState(false);
  const [mensagens, setMensagens] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analiseLoading, setAnaliseLoading] = useState(false);
  const [analise, setAnalise] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cartografia herdada
  const cartografia = {
    obra: obra.titulo,
    torre: progresso?.cart_torre || null,
    porta: progresso?.cart_porta || null,
    labirinto: progresso?.cart_labirinto || null,
    distrito: progresso?.cart_distrito || null,
    arquetipos: progresso?.cart_arquetipos || [],
    observacoes: progresso?.cart_observacoes || null,
  };

  const cartografiaPronta = !!(cartografia.torre && cartografia.porta);

  function buildCampo() {
    return {
      obra: cartografia.obra,
      personagem: personagem || null,
      perfil_base: {
        ferida_central: perfil.ferida_central || null,
        defesa_principal: perfil.defesa_principal || null,
        motor_oculto: perfil.motor_oculto || null,
        vinculo_padrao: perfil.vinculo_padrao || null,
        zona_cega: perfil.zona_cega || null,
      },
      torre: cartografia.torre,
      porta: cartografia.porta,
      labirinto: cartografia.labirinto,
      arquetipos: cartografia.arquetipos,
      distrito: cartografia.distrito,
      observacoes: cartografia.observacoes,
      fase,
    };
  }

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
        body: { modo: 'reply', campo: buildCampo(), mensagens: novo },
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
        body: { modo: 'analise', campo: buildCampo(), mensagens },
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
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Fase 4 — Campo Psíquico</p>
            <h2 className="font-display text-lg text-foreground">Encarnação Clínica</h2>
            <p className="text-xs text-muted-foreground mt-1">
              A IA deriva comportamento a partir de um <strong>campo psíquico</strong> (obra + figura + perfil base + cartografia + fase). Não é roleplay.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
        </div>

        {!cartografiaPronta && (
          <div className="text-xs text-amber-500/90 bg-amber-500/10 border border-amber-500/20 rounded p-2 mb-3">
            Preencha ao menos <strong>Torre</strong> e <strong>Porta</strong> na fase Cartografia para que a IA possa configurar o campo.
          </div>
        )}

        {!iniciado && (
          <div className="space-y-4">
            {/* Cartografia (lente clínica) */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Cartografia (lente clínica)</p>
              <div className="grid gap-1.5 text-xs">
                <Linha label="Torre" value={cartografia.torre} />
                <Linha label="Porta" value={cartografia.porta} />
                <Linha label="Labirinto" value={cartografia.labirinto} />
                <Linha label="Distrito" value={cartografia.distrito} />
                <Linha label="Arquétipos" value={(cartografia.arquetipos || []).join(', ') || null} />
              </div>
            </div>

            {/* Personagem */}
            <div>
              <label className="text-xs text-muted-foreground">Figura simbólica de base (uso interno, não citada)</label>
              <Input
                value={personagem}
                onChange={(e) => setPersonagem(e.target.value)}
                placeholder="Ex: Vasalisa, Inanna, A noiva…"
                className="mt-1"
              />
            </div>

            {/* Perfil psíquico base — colapsável */}
            <div className="border border-border/50 rounded-md">
              <button
                type="button"
                onClick={() => setPerfilOpen((v) => !v)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-muted/30"
              >
                <span className="font-medium">Perfil psíquico base da figura <span className="text-muted-foreground font-normal">(opcional, refina o campo)</span></span>
                {perfilOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {perfilOpen && (
                <div className="p-3 grid gap-2 border-t border-border/50">
                  <CampoTexto label="Ferida central" placeholder="ex: abandono materno" v={perfil.ferida_central} on={(v) => setPerfil({ ...perfil, ferida_central: v })} />
                  <CampoTexto label="Defesa principal" placeholder="ex: obediência silenciosa" v={perfil.defesa_principal} on={(v) => setPerfil({ ...perfil, defesa_principal: v })} />
                  <CampoTexto label="Motor oculto" placeholder="ex: medo de existir" v={perfil.motor_oculto} on={(v) => setPerfil({ ...perfil, motor_oculto: v })} />
                  <CampoTexto label="Padrão de vínculo" placeholder="ex: submissão protetora" v={perfil.vinculo_padrao} on={(v) => setPerfil({ ...perfil, vinculo_padrao: v })} />
                  <CampoTexto label="Zona cega" placeholder="o que a figura não vê em si" v={perfil.zona_cega} on={(v) => setPerfil({ ...perfil, zona_cega: v })} />
                </div>
              )}
            </div>

            {/* Fase da jornada */}
            <div>
              <label className="text-xs text-muted-foreground">Fase da jornada (define nível de defesa da cliente)</label>
              <Select value={fase} onValueChange={(v) => setFase(v as FaseJornada)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FASES.map((f) => (
                    <SelectItem key={f.v} value={f.v}>
                      <span className="font-medium">{f.label}</span>
                      <span className="text-muted-foreground text-xs ml-2">— {f.hint}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={iniciarSimulacao} disabled={!cartografiaPronta} className="w-full">
              <Play className="w-4 h-4 mr-2" /> Iniciar simulação no campo
            </Button>
          </div>
        )}
      </Card>

      {iniciado && (
        <Card className="p-0 overflow-hidden flex flex-col" style={{ height: '60vh', minHeight: 420 }}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Campo ativo · fase: <strong className="text-foreground">{FASES.find(f => f.v === fase)?.label}</strong>
            </div>
            <Button size="sm" variant="ghost" onClick={encerrar} disabled={analiseLoading}>
              {analiseLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Square className="w-3 h-3 mr-1" />}
              Encerrar e ver análise
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {mensagens.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">
                Faça sua primeira intervenção. A cliente responderá segundo o campo configurado.
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
              <div className="mt-4 border-t border-border/50 pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="font-display text-sm">Análise da condução</h3>
                </div>

                <Bloco titulo="Leitura geral" texto={analise.leitura_geral} />

                {analise.eixos && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Eixos clínicos</p>
                    <EixoLinha titulo="Escuta vs interpretação" eixo={analise.eixos.escuta_vs_interpretacao} />
                    <EixoLinha titulo="Aceleração" eixo={analise.eixos.aceleracao} />
                    <EixoLinha titulo="Respeito ao tempo" eixo={analise.eixos.respeito_ao_tempo} />
                    <EixoLinha titulo="Reforço de defesa" eixo={analise.eixos.reforco_de_defesa} />
                  </div>
                )}

                <BlocoLista titulo="Pontos fortes" itens={analise.pontos_fortes} />
                <BlocoLista titulo="Pontos de melhoria" itens={analise.pontos_de_melhoria} />

                {analise.sugestao_conducao_melhor && (
                  <div className="bg-primary/5 border border-primary/20 rounded p-3">
                    <p className="text-[11px] uppercase tracking-wider text-primary mb-1">Sugestão de condução melhor</p>
                    <p className="text-sm text-foreground">{analise.sugestao_conducao_melhor}</p>
                  </div>
                )}

                {Array.isArray(analise.momentos_chave) && analise.momentos_chave.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Momentos-chave</p>
                    {analise.momentos_chave.map((mk: any, i: number) => (
                      <div key={i} className="text-xs bg-muted/40 border border-border/50 rounded p-2 space-y-1">
                        <p className="text-foreground italic">"{mk.turno_terapeuta}"</p>
                        <p className="text-muted-foreground"><strong>Observação:</strong> {mk.o_que_aconteceu}</p>
                        <p className="text-muted-foreground"><strong>Alternativa:</strong> {mk.alternativa_possivel}</p>
                      </div>
                    ))}
                  </div>
                )}
                {analise.risco_etico_observado && analise.risco_etico_observado !== 'nenhum' && (
                  <Bloco titulo="Risco ético observado" texto={analise.risco_etico_observado} />
                )}
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
function CampoTexto({ label, placeholder, v, on }: { label: string; placeholder: string; v: string; on: (v: string) => void }) {
  return (
    <div>
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <Textarea value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} className="mt-0.5 min-h-[40px] text-xs" rows={1} />
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
