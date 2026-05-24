
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Sparkles, Users, CalendarIcon, MapPin, Circle,
  Eye, Plus, CheckCircle2, Clock, Flame, Heart, Shield, Star
} from "lucide-react";

type View = "overview" | "ritual-detail" | "plan" | "my-circles";

const DISTRITOS = [
  "Portão da Chegada", "Torres", "Portas", "Jardim dos Arquétipos",
  "Praça do Abalo", "Casa dos Sonhos", "Espelho dos Vínculos", "Forja",
  "Conselho Interior", "Labirinto", "Praça da Integração", "Portal de Renascimento"
];

const RITUAIS = [
  {
    id: "abertura-campo",
    titulo: "Abertura do Campo Sagrado",
    proposito: "Ritual de abertura que cria um espaço seguro e sagrado para o trabalho em grupo. Estabelece a presença, a intenção coletiva e os limites do círculo.",
    instrucoes: [
      "Convide as participantes a se sentarem em círculo, de preferência no chão ou em almofadas.",
      "Acenda uma vela no centro e peça um momento de silêncio para que cada uma chegue internamente.",
      "A facilitadora fala a intenção do encontro em voz alta, convidando a presença de cada uma.",
      "Cada participante diz seu nome e uma palavra que traz consigo hoje.",
      "A facilitadora fecha a abertura com um gesto simbólico (palmas, sino, ou respiração coletiva)."
    ],
    materiais: ["Vela grande", "Fósforos", "Almofadas ou tapetes", "Sino ou instrumento de som", "Flores frescas (opcional)"],
    icone: Flame,
    cor: "from-amber-500/20 to-orange-500/20"
  },
  {
    id: "espelho-vinculos",
    titulo: "Espelho dos Vínculos",
    proposito: "Ritual de conexão que permite que as participantes vejam e sejam vistas. Trabalha a vulnerabilidade, a escuta profunda e o reconhecimento mútuo.",
    instrucoes: [
      "Forme pares dentro do círculo. Se o número for ímpar, a facilitadora participa.",
      "Cada par senta-se frente a frente, a uma distância confortável.",
      "Por 3 minutos, olhem nos olhos uma da outra em silêncio, sem desviar.",
      "Depois, cada uma compartilha: 'O que vi em seus olhos foi...'",
      "Troque os pares e repita. Ao final, volte ao círculo e compartilhe o que ficou."
    ],
    materiais: ["Espaço amplo para pares", "Timer ou sino", "Lenços de papel", "Música suave de fundo (opcional)"],
    icone: Eye,
    cor: "from-violet-500/20 to-purple-500/20"
  },
  {
    id: "teia-ancestral",
    titulo: "Teia Ancestral",
    proposito: "Ritual de tecelagem coletiva que conecta as participantes às suas ancestrais femininas. Usa um fio ou barbante como símbolo da conexão entre gerações.",
    instrucoes: [
      "Distribua um novelo de lã ou barbante grosso.",
      "A facilitadora começa segurando a ponta e nomeia uma ancestral (mãe, avó, bisavó).",
      "Passa o novelo para outra participante, que faz o mesmo, mantendo o fio esticado.",
      "Continue até que se forme uma teia visível entre todas.",
      "Ao final, observem a teia em silêncio. Depois, cada uma corta um pedaço para levar consigo."
    ],
    materiais: ["Novelo de lã ou barbante (cores terrosas)", "Tesoura", "Vela central", "Fotos de ancestrais (opcional)"],
    icone: Heart,
    cor: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: "circulo-protecao",
    titulo: "Círculo de Proteção e Centramento",
    proposito: "Ritual de fortalecimento que ativa o senso de segurança interna e coletiva. Trabalha com respiração, som e movimento para criar uma âncora de proteção.",
    instrucoes: [
      "De pé, em círculo, deem as mãos.",
      "A facilitadora guia uma respiração coletiva: 4 tempos inspirando, 4 segurando, 4 expirando.",
      "Ainda de mãos dadas, comecem a emitir um som longo ('OM' ou 'AH') juntas.",
      "Soltem as mãos e coloquem-nas sobre o próprio peito. Sintam o calor.",
      "A facilitadora convida: 'Que este calor seja seu escudo e sua morada'."
    ],
    materiais: ["Espaço para ficar em pé em círculo", "Incenso ou sálvia", "Música meditativa (opcional)"],
    icone: Shield,
    cor: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: "constelacao-desejos",
    titulo: "Constelação de Desejos",
    proposito: "Ritual de manifestação que permite que cada participante declare um desejo profundo e o posicione no espaço simbólico do círculo.",
    instrucoes: [
      "Distribua pequenas pedras ou cristais para cada participante.",
      "Em silêncio, cada uma segura sua pedra e projeta nela um desejo profundo.",
      "Uma a uma, cada participante vai ao centro e posiciona sua pedra, dizendo em voz alta seu desejo.",
      "As outras respondem em coro: 'Que assim seja, que assim se teça'.",
      "Ao final, todas observam a constelação formada no centro. A facilitadora fecha com uma bênção."
    ],
    materiais: ["Pedras ou cristais (um por participante)", "Tecido no centro", "Velas pequenas", "Flores"],
    icone: Star,
    cor: "from-indigo-500/20 to-blue-500/20"
  }
];

interface CirculoRecord {
  id: string;
  nome_circulo: string;
  ritual_base: string;
  data_hora: string;
  local_link: string | null;
  participantes_ids: string[];
  distritos_ativados: string[];
  status_circulo: string;
  created_at: string;
}

const CirculoSagradoPage: React.FC = () => {
  const { user } = useAuth();
  const { clienteId } = useParams<{ clienteId: string }>();
  const [view, setView] = useState<View>("overview");
  const [selectedRitual, setSelectedRitual] = useState<typeof RITUAIS[0] | null>(null);
  const [circulos, setCirculos] = useState<CirculoRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Plan form
  const [nomeCirculo, setNomeCirculo] = useState("");
  const [ritualBase, setRitualBase] = useState("");
  const [dataHora, setDataHora] = useState<Date | undefined>();
  const [horaStr, setHoraStr] = useState("19:00");
  const [localLink, setLocalLink] = useState("");
  const [distritosAtivados, setDistritosAtivados] = useState<string[]>([]);
  const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);
  const [participantesSel, setParticipantesSel] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchCirculos();
      fetchClientes();
    }
  }, [user]);

  const fetchCirculos = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("circulos_sagrados")
      .select("*")
      .eq("facilitadora_id", user.id)
      .order("data_hora", { ascending: false });
    if (data) setCirculos(data as unknown as CirculoRecord[]);
  };

  const fetchClientes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("clientes")
      .select("id, nome")
      .eq("terapeuta_id", user.id)
      .eq("status", "ativo");
    if (data) setClientes(data);
  };

  const openRitualDetail = (r: typeof RITUAIS[0]) => {
    setSelectedRitual(r);
    setView("ritual-detail");
  };

  const startPlan = (ritualTitle?: string) => {
    if (ritualTitle) setRitualBase(ritualTitle);
    setView("plan");
  };

  const handleCreateCirculo = async () => {
    if (!user || !nomeCirculo.trim() || !ritualBase || !dataHora) {
      toast.error("Preencha nome, ritual e data.");
      return;
    }
    setLoading(true);
    const [h, m] = horaStr.split(":").map(Number);
    const fullDate = new Date(dataHora);
    fullDate.setHours(h, m, 0, 0);

    const { error } = await supabase.from("circulos_sagrados").insert({
      facilitadora_id: user.id,
      nome_circulo: nomeCirculo.trim(),
      ritual_base: ritualBase,
      data_hora: fullDate.toISOString(),
      local_link: localLink.trim() || null,
      participantes_ids: participantesSel,
      distritos_ativados: distritosAtivados,
      status_circulo: "pendente",
    } as any);

    setLoading(false);
    if (error) {
      toast.error("Erro ao criar círculo");
      console.error(error);
    } else {
      toast.success("Círculo criado com sucesso!");
      resetPlanForm();
      await fetchCirculos();
      setView("my-circles");
    }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "pendente" ? "realizado" : "pendente";
    await supabase.from("circulos_sagrados").update({ status_circulo: next } as any).eq("id", id);
    await fetchCirculos();
    toast.success(`Status atualizado para ${next}`);
  };

  const resetPlanForm = () => {
    setNomeCirculo("");
    setRitualBase("");
    setDataHora(undefined);
    setHoraStr("19:00");
    setLocalLink("");
    setDistritosAtivados([]);
    setParticipantesSel([]);
  };

  const toggleDistrito = (d: string) =>
    setDistritosAtivados(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const togglePart = (id: string) =>
    setParticipantesSel(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const pageTransition = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 } };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {view !== "overview" && (
            <Button variant="ghost" size="icon" onClick={() => setView(view === "ritual-detail" ? "overview" : view === "plan" ? (selectedRitual ? "ritual-detail" : "overview") : "overview")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Circle className="h-6 w-6 text-primary" />
              Círculo Sagrado
            </h1>
            <p className="text-sm text-muted-foreground">Tecendo Conexões e Rituais</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW */}
          {view === "overview" && (
            <motion.div key="overview" {...pageTransition} className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6">
                  <p className="text-foreground/80 leading-relaxed">
                    O Círculo Sagrado é um espaço de encontro ritualístico entre mulheres. Aqui você encontra rituais preparados para facilitar conexão, cura e fortalecimento coletivo. Escolha um ritual, planeje seu círculo e teça vínculos profundos.
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setView("my-circles")} className="gap-2">
                  <Users className="h-4 w-4" /> Ver Meus Círculos
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {RITUAIS.map(r => {
                  const Icon = r.icone;
                  return (
                    <Card key={r.id} className="group hover:shadow-lg transition-shadow cursor-pointer border-border/50" onClick={() => openRitualDetail(r)}>
                      <CardContent className="p-5">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.cor} flex items-center justify-center mb-3`}>
                          <Icon className="h-6 w-6 text-foreground/70" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{r.titulo}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.proposito}</p>
                        <Button variant="link" className="mt-2 p-0 h-auto text-primary text-sm">Ver Ritual →</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RITUAL DETAIL */}
          {view === "ritual-detail" && selectedRitual && (
            <motion.div key="detail" {...pageTransition} className="space-y-6">
              {(() => { const Icon = selectedRitual.icone; return (
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${selectedRitual.cor} border border-border/30`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-8 w-8 text-foreground/70" />
                    <h2 className="text-xl font-bold text-foreground">{selectedRitual.titulo}</h2>
                  </div>
                  <p className="text-foreground/80">{selectedRitual.proposito}</p>
                </div>
              ); })()}

              <Card>
                <CardHeader><CardTitle className="text-lg">Instruções Passo a Passo</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {selectedRitual.instrucoes.map((inst, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
                      <p className="text-foreground/80 text-sm pt-0.5">{inst}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Materiais Necessários</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedRitual.materiais.map(m => (
                      <Badge key={m} variant="secondary">{m}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full gap-2" size="lg" onClick={() => startPlan(selectedRitual.titulo)}>
                <Plus className="h-5 w-5" /> Planejar Círculo
              </Button>
            </motion.div>
          )}

          {/* PLAN */}
          {view === "plan" && (
            <motion.div key="plan" {...pageTransition} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Planejar Novo Círculo</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Nome do Círculo</label>
                    <Input value={nomeCirculo} onChange={e => setNomeCirculo(e.target.value)} placeholder="Ex: Círculo da Lua Cheia" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Ritual Base</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={ritualBase} onChange={e => setRitualBase(e.target.value)}>
                      <option value="">Selecione...</option>
                      {RITUAIS.map(r => <option key={r.id} value={r.titulo}>{r.titulo}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Data</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataHora && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dataHora ? format(dataHora, "dd/MM/yyyy") : "Escolha..."}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={dataHora} onSelect={setDataHora} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Hora</label>
                      <Input type="time" value={horaStr} onChange={e => setHoraStr(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Local / Link</label>
                    <Input value={localLink} onChange={e => setLocalLink(e.target.value)} placeholder="Endereço ou link de videoconferência" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Distritos da CidaDELA Ativados</label>
                    <div className="flex flex-wrap gap-2">
                      {DISTRITOS.map(d => (
                        <Badge key={d} variant={distritosAtivados.includes(d) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleDistrito(d)}>
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {clientes.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Participantes</label>
                      <div className="flex flex-wrap gap-2">
                        {clientes.map(c => (
                          <Badge key={c.id} variant={participantesSel.includes(c.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => togglePart(c.id)}>
                            {c.nome}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button className="w-full gap-2" size="lg" onClick={handleCreateCirculo} disabled={loading}>
                    <Sparkles className="h-5 w-5" /> {loading ? "Criando..." : "Criar Círculo"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* MY CIRCLES */}
          {view === "my-circles" && (
            <motion.div key="circles" {...pageTransition} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground">Meus Círculos</h2>
                <Button size="sm" onClick={() => startPlan()} className="gap-1"><Plus className="h-4 w-4" /> Novo</Button>
              </div>

              {circulos.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <Circle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum círculo criado ainda.</p>
                    <Button variant="link" onClick={() => setView("overview")}>Explorar rituais</Button>
                  </CardContent>
                </Card>
              ) : (
                circulos.map(c => (
                  <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{c.nome_circulo}</h3>
                          <p className="text-sm text-muted-foreground">{c.ritual_base}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={c.status_circulo === "realizado" ? "default" : "secondary"} className="gap-1">
                            {c.status_circulo === "realizado" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {c.status_circulo === "realizado" ? "Realizado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedId === c.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-sm text-foreground/80">
                              <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-muted-foreground" /> {format(new Date(c.data_hora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                              {c.local_link && <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {c.local_link}</p>}
                              {c.distritos_ativados?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {c.distritos_ativados.map(d => <Badge key={d} variant="outline" className="text-xs">{d}</Badge>)}
                                </div>
                              )}
                              {c.participantes_ids?.length > 0 && (
                                <p className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> {c.participantes_ids.length} participante(s)</p>
                              )}
                              <Button variant="outline" size="sm" className="mt-2" onClick={e => { e.stopPropagation(); toggleStatus(c.id, c.status_circulo); }}>
                                {c.status_circulo === "pendente" ? "Marcar como Realizado" : "Voltar para Pendente"}
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CirculoSagradoPage;
