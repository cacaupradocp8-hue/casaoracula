import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Send, ArrowLeft, Loader2, Lock } from "lucide-react";
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
  pre_iniciada: "Pré-Iniciada",
  iniciada: "Iniciada ORÁCULA",
  admin: "Admin",
};

type Nucleo = "ferramenteira" | "archetypos" | "aracne_arcano";

const NUCLEO_LABEL: Record<Nucleo, string> = {
  ferramenteira: "🜂 Ferramenteira",
  archetypos: "🧱 Archétypos",
  aracne_arcano: "🎭 Aracne & Arcano",
};

function extractMinutes(text: string, fallback = 50) {
  const m = text.match(/(\d{1,3})\s*(min|mins|minuto|minutos)\b/i);
  if (!m) return fallback;
  const n = Number(m[1]);
  if (Number.isFinite(n) && n >= 10 && n <= 240) return n;
  return fallback;
}

function shorten(text: string, max = 140) {
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function detectNucleo(userText: string): Nucleo {
  const t = userText.toLowerCase();

  // Ferramenteira: ritual, roteiro, oráculo, prática, condução guiada
  const ferr = [
    "ritual",
    "oráculo",
    "oraculo",
    "tiragem",
    "cartas",
    "roteiro",
    "script",
    "passo a passo",
    "prática",
    "pratica",
    "exercício",
    "exercicio",
    "meditação",
    "meditacao",
    "respiração",
    "respiracao",
    "visualização",
    "visualizacao",
    "encerramento",
    "abertura",
    "vivência",
    "vivencia",
    "círculo",
    "circulo",
    "grupo",
    "cerimônia",
    "cerimonia",
  ];

  // Archétypos: produto, oferta, jornada, módulos, funil, serviço
  const arch = [
    "produto",
    "oferta",
    "serviço",
    "servico",
    "jornada",
    "módulo",
    "modulo",
    "mentoria",
    "workshop",
    "programa",
    "pacote",
    "ticket",
    "preço",
    "preco",
    "vsl",
    "página",
    "pagina",
    "landing",
    "funil",
    "upsell",
    "order bump",
    "estrutura",
    "posicionamento",
    "promessa",
  ];

  // Aracne & Arcano: metáfora, mito, arquétipo, sombra, conto
  const arac = [
    "metáfora",
    "metafora",
    "mito",
    "arquétipo",
    "arquetipo",
    "sombra",
    "conto",
    "narrativa",
    "jornada da heroína",
    "jornada da heroina",
    "símbolo",
    "simbolo",
    "sonho",
    "imagem",
    "personagem",
    "trama",
  ];

  const score = (list: string[]) => list.reduce((acc, k) => (t.includes(k) ? acc + 1 : acc), 0);

  const sFerr = score(ferr);
  const sArch = score(arch);
  const sArac = score(arac);

  // Heurística: se pediu “estruturar sessão”, tende Ferramenteira
  if (
    t.includes("estruturar uma sessão") ||
    t.includes("estruturar uma sessao") ||
    t.includes("plano de sessão") ||
    t.includes("plano de sessao")
  ) {
    return "ferramenteira";
  }

  const max = Math.max(sFerr, sArch, sArac);
  if (max === 0) return "ferramenteira"; // default útil para V1
  if (max === sArch) return "archetypos";
  if (max === sArac) return "aracne_arcano";
  return "ferramenteira";
}

function buildResponse(nucleo: Nucleo, userText: string) {
  const minutes = extractMinutes(userText, 50);
  const tema = shorten(userText, 160);

  // Respostas V1: estruturadas, aplicáveis e com “cara de ferramenta”
  if (nucleo === "ferramenteira") {
    return `Núcleo ativado: ${NUCLEO_LABEL[nucleo]}

1) Foco simbólico
Limites emocionais como “borda sagrada”: não é frieza — é direção.

2) Intenção terapêutica
• diferenciar responsabilidade própria vs. responsabilidade do outro
• reduzir culpa aprendida
• criar linguagem de “não” sem agressão

3) Estrutura de sessão (${minutes} min)
• Abertura e contrato (5 min)
  — objetivo + segurança + o que NÃO será feito hoje
• Mapa do padrão (15 min)
  — 2 episódios recentes: onde o limite falhou e por quê
• Intervenção prática (20 min)
  — ensaio de frases-limite + respiração de ancoragem (3 ciclos)
• Integração (10 min)
  — 1 limite para praticar + 1 proteção emocional concreta
• Fechamento (restante)
  — micro-ritual: “voltar para si” (mão no peito + frase-âncora)

4) Perguntas (selecione 5–7)
• Onde você diz “sim” querendo dizer “não”?
• Qual medo aparece quando você se protege?
• O que você acredita que perde ao colocar limite?
• Que parte sua tenta manter paz a qualquer custo?
• Se você se respeitasse 10% mais, o que mudaria amanhã?
• Qual frase simples você consegue sustentar sem explicar demais?

5) Encerramento seguro
• 1 ganho | 1 aprendizado | 1 compromisso
Frase-âncora: “Meu limite não é ataque — é cuidado.”

Se quiser refinar: (A) contexto da cliente (família/parceiro/trabalho), (B) nível de risco, (C) histórico de trauma (leve/alto).  
Tema recebido: ${tema}`;
  }

  if (nucleo === "archetypos") {
    return `Núcleo ativado: ${NUCLEO_LABEL[nucleo]}

1) Promessa clara (sem misticismo solto)
“Em X semanas, a terapeuta aprende a conduzir limites emocionais com método, linguagem e prática — sem se perder no cuidado.”

2) Estrutura do produto (V1 enxuto)
• Nome do módulo: “Borda Sagrada”
• Formato: 1 aula central + 1 prática guiada + 1 checklist de aplicação
• Entregáveis:
  – Script de sessão (50 min)
  – Lista de perguntas por perfil
  – Ritual de fechamento de campo (3 min)
  – Folha de treino de frases-limite (cliente)

3) Jornada (4 etapas)
1) Diagnóstico do padrão (mapa de repetição)
2) Linguagem do limite (frases que não abrem debate)
3) Corpo e sistema nervoso (ancoragem e tolerância)
4) Manutenção (micro-hábitos e revisão semanal)

4) Métrica de sucesso (pra vender e provar valor)
• “Quantas vezes eu disse sim por culpa esta semana?”
• “Quantas vezes eu mantive meu limite sem explicar demais?”
• Escala 0–10 de autocontenção após conversa difícil

5) Próximo passo
Me diga: ticket desejado (baixo/médio/alto) + público (terapeutas/mentoras/psicólogas) + se isso é bônus ou módulo principal.  
Tema recebido: ${tema}`;
  }

  // aracne_arcano
  return `Núcleo ativado: ${NUCLEO_LABEL[nucleo]}

1) Chave simbólica
Limites = “porta”. A psique feminina sofre quando vira “casa sem porta”: todo mundo entra, ninguém paga o preço.

2) Leitura arquetípica (linguagem simples)
• A Curadora exausta confunde amor com disponibilidade
• A Menina boa teme rejeição e usa “sim” como moeda
• A Sombra aqui: ressentimento silencioso

3) Exercício simbólico (10–12 min)
• “A Porta e o Guardião”
  1) Nomeie 1 situação onde você se invade
  2) Escreva a frase-limite em 1 linha (sem justificativa)
  3) Visualize a porta fechando com calma (3 respirações)
  4) Repita a frase em voz baixa 3 vezes

4) Perguntas de condução (5–10)
• O que você está tentando provar quando não coloca limite?
• De quem você precisa de permissão para se proteger?
• Qual é o “preço oculto” do seu sim?
• O que você tem medo que aconteça se você virar a “má” da história?

5) Fechamento
Frase: “Eu posso ser amor e ainda assim ter porta.”  
Tema recebido: ${tema}`;
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

  // Override opcional (se quiser forçar um núcleo). Por padrão, é automático.
  const [forcedNucleo, setForcedNucleo] = useState<Nucleo | null>(null);

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
    setForcedNucleo(null); // reset override ao entrar

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

  const sendMessage = async () => {
    if (!user || !selectedConversa || !selectedAgente) return;

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
    const { data: userMsgData, error: insertError } = await supabase
      .from("agente_mensagens")
      .insert({
        conversa_id: selectedConversa.id,
        role: "user",
        content: userMessage,
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

    // 2) V1: resposta estruturada (sem Edge Function)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const nucleo = forcedNucleo ?? detectNucleo(userMessage);
      const assistantText = buildResponse(nucleo, userMessage);

      // 3) Persistir resposta do assistente
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

      // Atualizar título / updated_at
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
    setForcedNucleo(null);
  };

  if (selectedAgente) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={goBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-display text-gold">{selectedAgente.nome}</h1>
              <p className="text-sm text-muted-foreground">{selectedAgente.descricao}</p>

              {/* Override opcional: discreto, mas dá controle */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={forcedNucleo === null ? "gold" : "outline"}
                  onClick={() => setForcedNucleo(null)}
                >
                  Auto
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={forcedNucleo === "ferramenteira" ? "gold" : "outline"}
                  onClick={() => setForcedNucleo("ferramenteira")}
                >
                  🜂 Ferramenteira
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={forcedNucleo === "archetypos" ? "gold" : "outline"}
                  onClick={() => setForcedNucleo("archetypos")}
                >
                  🧱 Archétypos
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={forcedNucleo === "aracne_arcano" ? "gold" : "outline"}
                  onClick={() => setForcedNucleo("aracne_arcano")}
                >
                  🎭 Aracne & Arcano
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Dica: deixe em <b>Auto</b> para a SYNTHEIA escolher o núcleo. Use os botões só se quiser forçar o estilo
                de resposta.
              </p>
            </div>
          </div>

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
                  placeholder="Digite sua mensagem..."
                  className="min-h-[44px] max-h-32"
                  onKeyDown={(e) => {
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
              const hasAccess = user ? canAccessAgente(agente) : false;

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
