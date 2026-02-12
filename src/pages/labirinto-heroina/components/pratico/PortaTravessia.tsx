// ============================================
// TRAVESSIA DA PORTA — LABIRINTO PRÁTICO
// Pareto: Tema → Pergunta-chave → 1 Exercício → 3 Perguntas → Ritual → Micro-ação
// Persiste sessão no banco
// ============================================

import { useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import html2canvas from "html2canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, Scroll, PenLine, FileDown, Loader2,
  RotateCcw, Flame, Target, Check, BookOpen,
  ChevronDown, ChevronUp, Stethoscope, Save
} from "lucide-react";
import { toast } from "sonner";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";
import { useCreateSessao, useCreateRespostaExercicio, useCreateMapaEntry } from "@/hooks/useSessoesLabirinto";
import type { LabirintoModo } from "../ModoSelector";
import type { CamposClinicosData } from "../profissional/CamposClinicosCard";
import { RoteiroClinicoPorta } from "../profissional/RoteiroClinicoPorta";

// Exercícios por fase — fallback quando DB não tem conteúdo
const EXERCICIOS_FALLBACK: Record<string, { titulo: string; instrucao: string; perguntas: [string, string, string] }> = {
  "O Chamado": {
    titulo: "Ouvir o Chamado",
    instrucao: "Sente-se em silêncio por 5 minutos. Permita que o incômodo fale sem julgamento.",
    perguntas: ["O que em mim pede atenção e ainda não foi nomeado?", "Que sussurro tenho ignorado repetidamente?", "Se esse chamado tivesse uma voz, o que ele diria?"],
  },
  "A Ruptura": {
    titulo: "Nomear a Quebra",
    instrucao: "Identifique o momento exato em que o conhecido deixou de funcionar.",
    perguntas: ["O que se partiu em mim recentemente?", "Que certeza se tornou insustentável?", "O que estou deixando para trás ao aceitar essa ruptura?"],
  },
  "A Descida": {
    titulo: "O Primeiro Passo Para Dentro",
    instrucao: "Desenhe ou descreva simbolicamente o que encontra ao descer para dentro de si.",
    perguntas: ["O que habita a parte de mim que evito?", "Que emoção surge quando paro de fugir?", "Se a sombra tivesse um rosto, como seria?"],
  },
  "O Labirinto": {
    titulo: "Mapear a Repetição",
    instrucao: "Observe os padrões que se repetem na sua vida como caminhos circulares.",
    perguntas: ["Qual situação continua retornando com rostos diferentes?", "O que eu faço sempre da mesma forma esperando um resultado diferente?", "Onde está a saída que eu finjo não ver?"],
  },
  "O Osso": {
    titulo: "Tocar a Essência",
    instrucao: "Tire todas as camadas de proteção e identifique o que resta quando não há mais disfarce.",
    perguntas: ["Quem sou eu quando não estou performando?", "Que verdade eu conheço mas tenho medo de viver?", "O que é irredutível em mim?"],
  },
  "A Memória": {
    titulo: "Escutar os Ancestrais",
    instrucao: "Conecte-se com a história que veio antes de você. Que herança emocional você carrega?",
    perguntas: ["Que história da minha linhagem ressoa na minha vida?", "Que dor foi silenciada na minha família?", "O que herdei que não é meu, mas carrego como se fosse?"],
  },
  "A Ferida": {
    titulo: "Nomear a Dor Central",
    instrucao: "Localize no corpo e na história a ferida que organiza suas defesas.",
    perguntas: ["Qual é a dor que está por trás de todas as outras?", "Quando foi a primeira vez que senti isso?", "Se eu pudesse falar com essa ferida, o que ela pediria?"],
  },
  "A Defesa": {
    titulo: "Reconhecer a Armadura",
    instrucao: "Identifique os mecanismos que você criou para sobreviver — e que agora aprisionam.",
    perguntas: ["Que proteção era necessária antes, mas hoje me limita?", "Qual máscara uso com mais frequência?", "O que aconteceria se eu baixasse essa guarda agora?"],
  },
  "O Espelho": {
    titulo: "Ver-se Sem Filtro",
    instrucao: "Olhe para si mesma como se fosse a primeira vez. Sem crítica. Sem elogio. Apenas presença.",
    perguntas: ["O que vejo quando me olho sem julgamento?", "Que parte de mim tenho dificuldade de aceitar?", "O que os outros veem em mim que eu não reconheço?"],
  },
  "A Escolha": {
    titulo: "O Passo Sem Garantias",
    instrucao: "Reconheça que toda transformação exige uma decisão sem rede de segurança.",
    perguntas: ["Qual decisão estou adiando por medo do desconhecido?", "O que preciso abandonar para seguir adiante?", "Que compromisso estou pronta para assumir comigo mesma?"],
  },
  "A Integração": {
    titulo: "Reunir os Fragmentos",
    instrucao: "Traga de volta as partes que foram separadas. A luz e a sombra pertencem ao mesmo corpo.",
    perguntas: ["Que parte rejeitada de mim está pedindo para retornar?", "Como posso honrar tanto minha força quanto minha fragilidade?", "O que surge quando permito que opostos coexistam?"],
  },
  "A Voz": {
    titulo: "Falar a Verdade",
    instrucao: "Encontre as palavras que nunca foram ditas. Dê voz ao que foi silenciado.",
    perguntas: ["O que eu preciso dizer que nunca disse?", "Para quem essa voz se dirige?", "Que verdade minha voz carrega quando para de se desculpar?"],
  },
  "O Retorno": {
    titulo: "A Nova Mulher no Mundo",
    instrucao: "Você atravessou. Agora, como retorna ao mundo com o que aprendeu?",
    perguntas: ["O que trago de volta desta travessia?", "Como vou viver de forma diferente a partir de agora?", "Que dom esta jornada me revelou?"],
  },
  "A Guardiã": {
    titulo: "Incorporar a Sabedoria",
    instrucao: "Você não é mais a mesma. Nomeie a guardiã que nasceu em você.",
    perguntas: ["Que sabedoria agora guia meus passos?", "O que protejo com consciência, não com medo?", "Se eu pudesse dar um conselho à mulher que começou esta jornada, qual seria?"],
  },
};

interface PortaTravessiaProps {
  porta: LabirintoFase;
  modo: LabirintoModo;
  camposClinicos?: CamposClinicosData;
  onBack: () => void;
  onComplete: () => void;
}

export function PortaTravessia({ porta, modo, camposClinicos, onBack, onComplete }: PortaTravessiaProps) {
  const [registroAcao, setRegistroAcao] = useState("");
  const [registroPercepcao, setRegistroPercepcao] = useState("");
  const [microAcao, setMicroAcao] = useState("");
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [exercicioRealizado, setExercicioRealizado] = useState(false);
  const [showCorpo, setShowCorpo] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const createSessao = useCreateSessao();
  const createResposta = useCreateRespostaExercicio();
  const createMapaEntry = useCreateMapaEntry();

  // Use DB content if available, fallback to hardcoded
  const exercicio = porta.exercicio_titulo
    ? {
        titulo: porta.exercicio_titulo,
        instrucao: porta.exercicio_instrucao || "",
        perguntas: [
          porta.pergunta_chave || "O que esta porta revela sobre mim?",
          "O que preciso soltar para atravessar?",
          "O que levo comigo desta passagem?",
        ] as [string, string, string],
      }
    : EXERCICIOS_FALLBACK[porta.nome] || {
        titulo: "Reflexão da Travessia",
        instrucao: "Reflita sobre o que esta fase está pedindo de você.",
        perguntas: ["O que esta porta revela sobre mim?", "O que preciso soltar para atravessar?", "O que levo comigo desta passagem?"] as [string, string, string],
      };

  const temaCentral = porta.tema_central || porta.subtitulo;
  const ritualTexto = porta.ritual_texto;

  const handleChangeResposta = (key: string, value: string) => {
    setRespostas(prev => ({ ...prev, [key]: value }));
  };

  const handleMarcarRealizado = () => {
    setExercicioRealizado(true);
    toast.success("Exercício registrado ✓", { icon: "✨" });
  };

  const handleSalvar = async () => {
    setIsSaving(true);
    try {
      const sessao = await createSessao.mutateAsync({
        modo,
        porta_id: porta.id,
        cliente_nome: camposClinicos?.nomeCliente,
        observacoes_clinicas: camposClinicos?.observacoesClinicas,
        hipotese_terapeutica: camposClinicos?.hipoteseTerapeutica,
        emocao_dominante: camposClinicos?.emocaoDominante,
        padrao_defensivo: camposClinicos?.padraoDefensivo,
        direcionamento_terapeutico: camposClinicos?.direcionamentoTerapeutico,
        micro_acao_definida: microAcao || camposClinicos?.microAcaoDefinida,
        registro_acao: registroAcao,
        registro_percepcao: registroPercepcao,
        concluida: exercicioRealizado,
      });

      // Save exercise responses
      if (Object.keys(respostas).length > 0) {
        await createResposta.mutateAsync({
          sessao_id: sessao.id,
          pergunta_1: respostas["pergunta_0"] || undefined,
          pergunta_2: respostas["pergunta_1"] || undefined,
          pergunta_3: respostas["pergunta_2"] || undefined,
          campo_corporal: respostas["corpo"] || undefined,
        });
      }

      // Add to mapa
      await createMapaEntry.mutateAsync({
        porta_id: porta.id,
        cliente_nome: camposClinicos?.nomeCliente,
        evolucao_texto: registroPercepcao || registroAcao,
      });

      toast.success("Sessão salva com sucesso!", { icon: "✨" });
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      toast.error("Erro ao salvar sessão. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2, backgroundColor: null, logging: false, useCORS: true });
      const link = document.createElement("a");
      link.download = `travessia-${porta.nome.toLowerCase().replace(/\s/g, "-")}-${format(new Date(), "yyyy-MM-dd")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("PDF ritual gerado com sucesso!", { icon: "📜" });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const dataTravessia = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const canSave = exercicioRealizado || registroAcao.trim() || registroPercepcao.trim();

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Escolher outra carta
      </Button>

      {/* Card da Carta Selecionada */}
      <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
        <CardContent className="p-6 text-center">
          <div className="text-5xl mb-4">{porta.icone || "🌙"}</div>
          <h2 className="font-display text-2xl text-gold mb-2">{porta.nome}</h2>
          {temaCentral && (
            <p className="text-muted-foreground italic">{temaCentral}</p>
          )}
          {porta.nucleo && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              {porta.nucleo}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Texto Oracular */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scroll className="w-5 h-5 text-gold" />
            Texto Oracular
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed italic">
            {porta.descricao || "Cada porta guarda um ensinamento. Atravesse com presença."}
          </p>
        </CardContent>
      </Card>

      {/* Exercício 80/20 */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-amber-500" />
            📘 {exercicio.titulo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-foreground/80 leading-relaxed text-sm">{exercicio.instrucao}</p>

          {/* 3 Perguntas */}
          <div className="space-y-4">
            {exercicio.perguntas.map((pergunta, i) => (
              <div key={i}>
                <label className="text-sm text-muted-foreground block mb-1.5">
                  {i + 1}. {pergunta}
                </label>
                <Textarea
                  value={respostas[`pergunta_${i}`] || ""}
                  onChange={(e) => handleChangeResposta(`pergunta_${i}`, e.target.value)}
                  placeholder="Escreva sua resposta..."
                  rows={2}
                  className="bg-card/50"
                />
              </div>
            ))}
          </div>

          {/* Campo corporal */}
          <div>
            <button
              type="button"
              onClick={() => setShowCorpo(!showCorpo)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {showCorpo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Registro corporal (opcional)
            </button>
            {showCorpo && (
              <Textarea
                value={respostas["corpo"] || ""}
                onChange={(e) => handleChangeResposta("corpo", e.target.value)}
                placeholder="Onde no corpo você sentiu? Que sensação surgiu?"
                rows={2}
                className="bg-card/50 mt-2"
              />
            )}
          </div>

          {/* Leitura clínica — Modo Profissional */}
          {modo === "profissional" && (
            <div className="pt-4 border-t border-amber-500/20 space-y-3">
              <h4 className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <Stethoscope className="w-4 h-4 text-gold" />
                Leitura Clínica
              </h4>
              <p className="text-xs text-muted-foreground">
                Os campos clínicos da Ficha são preenchidos na seleção. Aqui, registre observações específicas desta travessia.
              </p>
            </div>
          )}

          {/* Marcar realizado */}
          {!exercicioRealizado ? (
            <Button onClick={handleMarcarRealizado} className="w-full bg-amber-600 hover:bg-amber-500 text-white gap-2">
              <Check className="w-4 h-4" />
              Marcar exercício como realizado
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 py-2 text-emerald-500">
              <Check className="w-5 h-5" />
              <span className="font-medium">Exercício realizado</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ritual */}
      {ritualTexto && (
        <Card className="border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5 text-gold" />
              Ritual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed text-sm italic">{ritualTexto}</p>
          </CardContent>
        </Card>
      )}

      {/* Protocolo Clínico — Modo Profissional */}
      {modo === "profissional" && <RoteiroClinicoPorta faseName={porta.nome} />}

      {/* Registro da Ação */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PenLine className="w-5 h-5 text-gold" />
            Registro da Travessia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-2">O que você fez?</label>
            <Textarea value={registroAcao} onChange={(e) => setRegistroAcao(e.target.value)} placeholder="Descreva brevemente a ação que realizou..." rows={3} className="bg-card/50" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-2">O que percebeu?</label>
            <Textarea value={registroPercepcao} onChange={(e) => setRegistroPercepcao(e.target.value)} placeholder="Que sensações, imagens ou insights surgiram?" rows={3} className="bg-card/50" />
          </div>

          {/* Micro-ação (visível em ambos os modos) */}
          <div>
            <label className="text-sm text-muted-foreground block mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-gold" />
              Micro-ação prática
            </label>
            <Input value={microAcao} onChange={(e) => setMicroAcao(e.target.value)} placeholder="Uma ação concreta para os próximos dias..." className="bg-card/50" />
          </div>
        </CardContent>
      </Card>

      {/* Salvar + PDF */}
      <Card className="border-gold/30">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <h4 className="font-medium text-foreground">Selar esta Travessia</h4>
              <p className="text-sm text-muted-foreground">
                Salve no banco e/ou gere um PDF ritual
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSalvar}
                disabled={!canSave || isSaving}
                className="bg-gold hover:bg-gold/90 text-gold-foreground gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={handleGeneratePDF}
                disabled={!canSave || isGeneratingPDF}
                className="border-gold/30 text-gold gap-2"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                PDF
              </Button>
            </div>
          </div>

          {!canSave && (
            <p className="text-xs text-muted-foreground/60 text-center">
              Realize o exercício ou preencha ao menos um campo de registro.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Nova Travessia */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onComplete} className="border-gold/30 text-gold hover:bg-gold/10 gap-2">
          <RotateCcw className="w-4 h-4" />
          Iniciar nova travessia
        </Button>
      </div>

      {/* PDF Hidden Content */}
      <div className="fixed -left-[9999px]" aria-hidden="true">
        <div ref={pdfRef} className="w-[600px] p-8" style={{ background: `linear-gradient(135deg, #1a1510 0%, #252018 50%, #1a1510 100%)`, color: "#d4a574", fontFamily: "Georgia, serif" }}>
          <div className="text-center pb-6 border-b border-amber-800/30">
            <p className="text-xs uppercase tracking-widest mb-2 opacity-70">✧ Labirinto da Heroína Interna® ✧</p>
            <div className="text-5xl mb-4">{porta.icone || "🌙"}</div>
            <h1 className="text-2xl mb-1">{porta.nome}</h1>
            {temaCentral && <p className="text-sm opacity-70 italic">{temaCentral}</p>}
            <p className="text-xs mt-4 opacity-50">{dataTravessia}</p>
          </div>
          <div className="py-6 border-b border-amber-800/20">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">Texto Oracular</h4>
            <p className="text-sm leading-relaxed italic opacity-90">{porta.descricao || "Cada porta guarda um ensinamento."}</p>
          </div>
          <div className="py-6 border-b border-amber-800/20">
            <h4 className="text-xs uppercase tracking-wider mb-3 opacity-60">Exercício — {exercicio.titulo}</h4>
            {Object.entries(respostas).filter(([, v]) => v.trim()).map(([key, value]) => (
              <div key={key} className="mb-2"><p className="text-sm leading-relaxed opacity-90">{value}</p></div>
            ))}
          </div>
          <div className="py-6">
            <h4 className="text-xs uppercase tracking-wider mb-4 opacity-60">Meu Registro</h4>
            {registroAcao && <div className="mb-4"><p className="text-xs opacity-50 mb-1">O que fiz:</p><p className="text-sm leading-relaxed opacity-90">{registroAcao}</p></div>}
            {registroPercepcao && <div className="mb-4"><p className="text-xs opacity-50 mb-1">O que percebi:</p><p className="text-sm leading-relaxed opacity-90">{registroPercepcao}</p></div>}
            {microAcao && <div><p className="text-xs opacity-50 mb-1">Micro-ação:</p><p className="text-sm leading-relaxed opacity-90">{microAcao}</p></div>}
          </div>
          <div className="text-center pt-6 border-t border-amber-800/20">
            <p className="text-xs opacity-40">Casa ORÁCULA — Método Terapêutico Integrativo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
