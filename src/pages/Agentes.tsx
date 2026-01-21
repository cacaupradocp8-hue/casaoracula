import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Send, ArrowLeft, Loader2, Lock, Settings2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { canAccessFeature, PortalType } from "@/types/portal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { mensagemSchema, getValidationError } from "@/lib/validations";

interface Agente {
  id: string;
  nome: string;
  descricao: string;
  instrucoes_base: string;
  icone: string;
  portal_minimo: PortalType;
  status: "ativo" | "inativo";
}

interface Mensagem {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Conversa {
  id: string;
  titulo: string;
  agente_id: string;
  user_id?: string;
}

const PORTAL_LABELS: Record<PortalType, string> = {
  visitante: "Visitante",
  mentorada: "Mentorada",
  aluna_formacao: "Aluna Formação",
  assinante: "Assinante",
  oracula: "Orácula",
  admin: "Admin",
};

// 🔥 Núcleos (modo avançado)
type Nucleo = "auto" | "ferramenteira" | "archetypos" | "aracne_arcano";

const NUCLEO_LABEL: Record<Nucleo, string> = {
  auto: "AUTO",
  ferramenteira: "🜂 Ferramenteira",
  archetypos: "🧱 Archétypos",
  aracne_arcano: "🎭 Aracne & Arcano",
};

function storageKey(agentId?: string) {
  return agentId ? `syntheia_nucleo_${agentId}` : `syntheia_nucleo_default`;
}

export default function Agentes() {
  const [agentes, setAgentes] = useState<Agente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [selectedConversa, setSelectedConversa] = useState<Conversa | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // ✅ opção 3: modo avançado + forçar núcleo
  const [advancedMode, setAdvancedMode] = useState(false);
  const [forcedNucleo, setForcedNucleo] = useState<Nucleo>("auto");

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchAgentes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAgentes = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.from("agentes").select("*").eq("status", "ativo").order("nome");

    if (error) {
      toast({ title: "Erro ao carregar agentes", description: error.message, variant: "destructive" });
    } else {
      setAgentes((data || []) as Agente[]);
    }
    setIsLoading(false);
  };

  const canAccessAgente = (agente: Agente): boolean => {
    if (!user) return false;
    return canAccessFeature(user.portal, agente.portal_minimo);
  };

  const openAgente = async (agente: Agente) => {
    if (!user) {
      toast({ title: "Faça login para continuar", variant: "destructive" });
      return;
    }

    if (!canAccessAgente(agente)) {
      toast({
        title: "Acesso restrito",
        description: `Este agente requer nível ${PORTAL_LABELS[agente.portal_minimo]} ou superior.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedAgente(agente);

    // carregar preferência de núcleo por agente (default auto)
    try {
      const saved = localStorage.getItem(storageKey(agente.id)) as Nucleo | null;
      if (saved && NUCLEO_LABEL[saved]) setForcedNucleo(saved);
      else setForcedNucleo("auto");
    } catch {
      setForcedNucleo("auto");
    }

    // filtra por user_id
    const { data: conversasData, error: convError } = await supabase
      .from("agente_conversas")
      .select("*")
      .eq("agente_id", agente.id)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (convError) {
      toast({ title: "Erro ao carregar conversas", description: convError.message, variant: "destructive" });
      setConversas([]);
      setSelectedConversa(null);
      setMensagens([]);
      return;
    }

    setConversas((conversasData || []) as Conversa[]);

    if (!conversasData || conversasData.length === 0) {
      await startNewConversa(agente.id);
    } else {
      await loadConversa(conversasData[0] as Conversa);
    }
  };

  const startNewConversa = async (agenteId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("agente_conversas")
      .insert({ agente_id: agenteId, user_id: user.id, titulo: "Nova conversa" })
      .select()
      .single();

    if (error) {
      toast({ title: "Erro ao criar conversa", description: error.message, variant: "destructive" });
      return;
    }

    if (data) {
      setSelectedConversa(data as Conversa);
      setMensagens([]);
      setConversas((prev) => [data as Conversa, ...prev]);
    }
  };

  const loadConversa = async (conversa: Conversa) => {
    setSelectedConversa(conversa);

    const { data, error } = await supabase
      .from("agente_mensagens")
      .select("*")
      .eq("conversa_id", conversa.id)
      .order("created_at");

    if (error) {
      toast({ title: "Erro ao carregar mensagens", description: error.message, variant: "destructive" });
      setMensagens([]);
      return;
    }

    setMensagens((data || []) as Mensagem[]);
  };

  const recentHistoryForLLM = useMemo(() => {
    const last = mensagens.slice(-12);
    return last.map((m) => ({ role: m.role, content: m.content }));
  }, [mensagens]);

  const persistForcedNucleo = (n: Nucleo) => {
    setForcedNucleo(n);
    if (selectedAgente?.id) {
      try {
        localStorage.setItem(storageKey(selectedAgente.id), n);
      } catch {
        // ignore
      }
    }
  };

  // ✅ Opcional: montar prompt com “roteamento”
  // - se você já tem Edge Function, ela pode ler forcedNucleo
  // - se não tiver, isso não quebra nada
  const buildUserMessageWithRouting = (raw: string) => {
    // quando está em auto, não polui a mensagem
    if (!advancedMode || forcedNucleo === "auto") return raw;

    // Marca discreta (fácil de parsear no backend)
    // Se você não quiser isso aparecendo no histórico,
    // a gente move para metadata quando ligar Edge Function.
    return `[NUCLEO:${forcedNucleo}]\n${raw}`;
  };

  const sendMessage = async () => {
    if (!user || !selectedConversa || !selectedAgente) return;

    // ✅ trava anti-duplo-envio
    if (sending) return;

    const validation = mensagemSchema.safeParse({ content: input });
    const validationError = getValidationError(validation);
    if (validationError) {
      toast({ title: "Erro de validação", description: validationError, variant: "destructive" });
      return;
    }

    const userMessage = input.trim();
    if (!userMessage) return;

    setInput("");
    setSending(true);

    // 1) Persistir mensagem do usuário
    const messageToStore = buildUserMessageWithRouting(userMessage);

    const { data: userMsgData, error: insertError } = await supabase
      .from("agente_mensagens")
      .insert({
        conversa_id: selectedConversa.id,
        role: "user",
        content: messageToStore,
      })
      .select()
      .single();

    if (insertError) {
      toast({ title: "Erro ao enviar mensagem", description: insertError.message, variant: "destructive" });
      setSending(false);
      return;
    }

    if (userMsgData) {
      setMensagens((prev) => [...prev, userMsgData as Mensagem]);
    }

    // 2) Resposta do “assistente”
    // 👉 V1 seguro: mock
    // 👉 quando você quiser ligar Edge Function: substitui aqui
    try {
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Se você quiser deixar “sabor SYNTHEIA” no mock:
      const nucleoAtual = advancedMode ? NUCLEO_LABEL[forcedNucleo] : "AUTO";
      const assistantText =
        forcedNucleo === "auto" || !advancedMode
          ? `Núcleo ativado: ${nucleoAtual}\n\nCompreendo. Esse é um ponto significativo para sua jornada. Há algo específico que você gostaria de aprofundar?`
          : `Núcleo ativado: ${nucleoAtual}\n\nRecebido. Vou trabalhar exatamente nesse núcleo.\n\nQual o contexto (cliente / grupo / trabalho) e qual risco (baixo/médio/alto) para eu calibrar a condução?`;

      // ✅ Se você já tem Edge Function e quer usar, é aqui:
      // const { data, error } = await supabase.functions.invoke("NOME_DA_SUA_FUNCAO", {
      //   body: {
      //     agenteId: selectedAgente.id,
      //     conversaId: selectedConversa.id,
      //     forcedNucleo: advancedMode ? forcedNucleo : "auto",
      //     message: userMessage,
      //     history: recentHistoryForLLM,
      //   },
      // });
      // if (error) throw error;
      // const assistantText = data?.content ?? "Sem resposta";

      const { data: assistantMsgData, error: assistantInsertError } = await supabase
        .from("agente_mensagens")
        .insert({
          conversa_id: selectedConversa.id,
          role: "assistant",
          content: assistantText,
        })
        .select()
        .single();

      if (assistantInsertError) throw new Error(assistantInsertError.message);

      if (assistantMsgData) {
        setMensagens((prev) => [...prev, assistantMsgData as Mensagem]);
      }

      // 3) Atualizar título + updated_at
      if (selectedConversa.titulo === "Nova conversa") {
        const suggestedTitle = userMessage.length > 36 ? `${userMessage.slice(0, 36)}…` : userMessage;

        await supabase
          .from("agente_conversas")
          .update({ titulo: suggestedTitle, updated_at: new Date().toISOString() })
          .eq("id", selectedConversa.id);

        setSelectedConversa((prev) => (prev ? { ...prev, titulo: suggestedTitle } : prev));
      } else {
        await supabase
          .from("agente_conversas")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", selectedConversa.id);
      }
    } catch (e: any) {
      toast({
        title: "Erro ao gerar resposta",
        description: e?.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const goBack = () => {
    setSelectedAgente(null);
    setSelectedConversa(null);
    setMensagens([]);
    setInput("");
    setAdvancedMode(false);
    setForcedNucleo("auto");
  };

  if (selectedAgente) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={goBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-display text-gold">{selectedAgente.nome}</h1>
                <p className="text-sm text-muted-foreground">{selectedAgente.descricao}</p>
              </div>
            </div>

            {/* ⚙️ Modo avançado */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={advancedMode ? "secondary" : "outline"}
                    className="gap-2"
                    onClick={() => setAdvancedMode((v) => !v)}
                  >
                    <Settings2 className="w-4 h-4" />
                    {advancedMode ? "Modo avançado" : "Avançado"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Forçar núcleo da SYNTHEIA (opcional)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Seletor de núcleo (só no avançado) */}
          {advancedMode && (
            <Card className="glass mb-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Se quiser, force o núcleo. Se não, deixe em{" "}
                      <span className="text-foreground font-medium">AUTO</span>.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(["auto", "ferramenteira", "archetypos", "aracne_arcano"] as Nucleo[]).map((n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={forcedNucleo === n ? "secondary" : "outline"}
                        onClick={() => persistForcedNucleo(n)}
                        disabled={sending}
                      >
                        {NUCLEO_LABEL[n]}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass h-[60vh] flex flex-col">
            <ScrollArea className="flex-1 p-4">
              {mensagens.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>Inicie uma conversa com {selectedAgente.nome}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mensagens.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user" ? "bg-gold/20 text-foreground" : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}

                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-lg px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    advancedMode ? `Digite... (núcleo: ${NUCLEO_LABEL[forcedNucleo]})` : "Digite sua mensagem..."
                  }
                  className="min-h-[44px] max-h-32"
                  disabled={sending}
                  onKeyDown={(e) => {
                    if (sending) return;
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={sending || !input.trim()} variant="gold">
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 text-xs text-muted-foreground">
                <span className="opacity-80">
                  ⚠️ Este app não substitui supervisão clínica, psicoterapia ou psiquiatria. Conteúdo formativo e
                  simbólico, exclusivo para profissionais.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Agentes da Casa (IA)"
          subtitle="Assistentes inteligentes para apoiar sua jornada"
          icon={<Bot className="w-5 h-5" />}
          className="mb-8"
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        ) : agentes.length === 0 ? (
          <Card className="glass p-8 text-center">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum agente disponível no momento.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agentes.map((agente) => {
              const hasAccess = canAccessAgente(agente);

              return (
                <Tooltip key={agente.id}>
                  <TooltipTrigger asChild>
                    <Card
                      className={`glass transition-colors ${
                        hasAccess ? "hover:border-gold/50 cursor-pointer" : "opacity-60 cursor-not-allowed"
                      }`}
                      onClick={() => hasAccess && openAgente(agente)}
                    >
                      <CardHeader>
                        <div className="relative w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mb-2">
                          <Bot className="w-6 h-6 text-gold" />
                          {!hasAccess && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                              <Lock className="w-3 h-3 text-destructive-foreground" />
                            </div>
                          )}
                        </div>
                        <CardTitle className="text-lg">{agente.nome}</CardTitle>
                        <CardDescription>{agente.descricao}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant={hasAccess ? "outline" : "secondary"}
                          className="w-full gap-2"
                          disabled={!hasAccess}
                        >
                          {hasAccess ? (
                            <>
                              <MessageSquare className="w-4 h-4" /> Abrir Chat
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" /> Bloqueado
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
                  {!hasAccess && (
                    <TooltipContent>
                      <p>Requer nível {PORTAL_LABELS[agente.portal_minimo]} ou superior</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
