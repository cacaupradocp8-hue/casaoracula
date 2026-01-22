import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContentPageLayout } from "@/components/shared/ContentPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Star, 
  Moon, 
  Heart, 
  Waves, 
  Sparkles, 
  Flame,
  AlertTriangle,
  Eye,
  CheckCircle2,
  ArrowRight,
  Quote
} from "lucide-react";
import { cn } from "@/lib/utils";

// ══════════════════════════════════════════════════════════════
// CARTOGRAFIA FIXA — 7 TORRES (NÃO EDITÁVEL)
// ══════════════════════════════════════════════════════════════

interface Torre {
  id: string;
  nome: string;
  icone: React.ElementType;
  cor: string;
  descricao: string;
  sustentar: string[];
  evitar: string[];
  ritmo: string[];
}

const TORRES: Torre[] = [
  {
    id: "controle",
    nome: "Torre do Controle",
    icone: Shield,
    cor: "from-slate-600 to-slate-800",
    descricao: "Estrutura que se organiza através da vigilância constante e da necessidade de prever para se proteger.",
    sustentar: [
      "Validar a inteligência por trás do controle",
      "Oferecer previsibilidade no setting",
      "Respeitar o tempo de entrega",
      "Manter acordos claros e estáveis"
    ],
    evitar: [
      "Surpresas ou mudanças bruscas",
      "Pressão por vulnerabilidade",
      "Interpretações precoces",
      "Confronto direto com a rigidez"
    ],
    ritmo: [
      "Lento e previsível",
      "Pausas anunciadas",
      "Encerramento gradual",
      "Tempo para processar antes de responder"
    ]
  },
  {
    id: "performance",
    nome: "Torre da Performance",
    icone: Star,
    cor: "from-amber-500 to-orange-600",
    descricao: "Estrutura que se organiza através da excelência visível e da necessidade de ser reconhecida para existir.",
    sustentar: [
      "Reconhecer conquistas sem alimentar o ciclo",
      "Validar o esforço, não apenas o resultado",
      "Oferecer presença sem expectativa",
      "Criar espaço para o ordinário"
    ],
    evitar: [
      "Elogios excessivos ou performáticos",
      "Comparações com outras",
      "Foco em produtividade da sessão",
      "Cobranças de progresso visível"
    ],
    ritmo: [
      "Permitir pausas improdutivas",
      "Celebrar o silêncio",
      "Desacelerar narrativas de sucesso",
      "Tempo para existir sem provar"
    ]
  },
  {
    id: "silencio",
    nome: "Torre do Silêncio",
    icone: Moon,
    cor: "from-indigo-600 to-purple-800",
    descricao: "Estrutura que se organiza através do recolhimento e da invisibilidade como proteção.",
    sustentar: [
      "Respeitar o silêncio como linguagem",
      "Oferecer presença sem invasão",
      "Validar o direito de não responder",
      "Criar segurança para a voz emergir"
    ],
    evitar: [
      "Perguntas em excesso",
      "Preencher vazios com palavras",
      "Interpretar o silêncio",
      "Pressão por expressão verbal"
    ],
    ritmo: [
      "Muito lento",
      "Pausas longas e sustentadas",
      "Pouquíssimas intervenções",
      "Tempo para o corpo falar primeiro"
    ]
  },
  {
    id: "cuidado",
    nome: "Torre do Cuidado",
    icone: Heart,
    cor: "from-rose-500 to-pink-600",
    descricao: "Estrutura que se organiza através do cuidar do outro como forma de existir e pertencer.",
    sustentar: [
      "Receber o cuidado oferecido com gratidão",
      "Modelar limites saudáveis",
      "Perguntar sobre necessidades próprias",
      "Validar o direito de receber"
    ],
    evitar: [
      "Aceitar cuidados excessivos",
      "Reforçar o papel de cuidadora",
      "Ignorar inversões de papel",
      "Permitir que cuide da facilitadora"
    ],
    ritmo: [
      "Pausas para sentir o próprio corpo",
      "Redirecionamento gentil ao self",
      "Tempo para descansar do outro",
      "Momentos de receber sem dar"
    ]
  },
  {
    id: "adaptacao",
    nome: "Torre da Adaptação",
    icone: Waves,
    cor: "from-teal-500 to-cyan-600",
    descricao: "Estrutura que se organiza através da fluidez extrema e da leitura constante do ambiente.",
    sustentar: [
      "Oferecer estabilidade no setting",
      "Perguntar o que ela realmente quer",
      "Validar opiniões e preferências",
      "Criar espaço para discordância segura"
    ],
    evitar: [
      "Mudanças frequentes de abordagem",
      "Perguntas que pedem concordância",
      "Assumir que está confortável",
      "Ignorar sinais de sobre-adaptação"
    ],
    ritmo: [
      "Constante e previsível",
      "Mesma estrutura por várias sessões",
      "Tempo para formar opinião própria",
      "Pausas para checar autenticidade"
    ]
  },
  {
    id: "espiritualizacao",
    nome: "Torre da Espiritualização",
    icone: Sparkles,
    cor: "from-violet-500 to-purple-600",
    descricao: "Estrutura que se organiza através da transcendência como forma de evitar a dor encarnada.",
    sustentar: [
      "Honrar a dimensão espiritual autêntica",
      "Trazer gentilmente ao corpo",
      "Validar a experiência sem reforçar fuga",
      "Criar ponte entre o sagrado e o mundano"
    ],
    evitar: [
      "Linguagem excessivamente espiritual",
      "Reforçar bypass espiritual",
      "Ignorar sinais do corpo",
      "Competir no campo do sagrado"
    ],
    ritmo: [
      "Alternância entre céu e terra",
      "Pausas para enraizamento",
      "Tempo para sentir antes de significar",
      "Momentos de presença simples"
    ]
  },
  {
    id: "forca",
    nome: "Torre da Força",
    icone: Flame,
    cor: "from-red-600 to-orange-700",
    descricao: "Estrutura que se organiza através da invulnerabilidade e da resistência como identidade.",
    sustentar: [
      "Reconhecer a força como sobrevivência",
      "Criar segurança para a fragilidade",
      "Validar o cansaço quando surgir",
      "Oferecer permissão para descansar"
    ],
    evitar: [
      "Desafiar a força diretamente",
      "Forçar vulnerabilidade",
      "Interpretar como defesa",
      "Competir em intensidade"
    ],
    ritmo: [
      "Respeitar o tempo da armadura",
      "Pausas para respirar",
      "Não pressionar abertura",
      "Tempo para a força se sentir honrada"
    ]
  }
];

// Afirmações observacionais para seleção
const OBSERVACOES = [
  { id: "controle_constante", texto: "Necessidade constante de controle", torres: ["controle"] },
  { id: "excesso_responsabilidade", texto: "Excesso de responsabilidade", torres: ["controle", "cuidado"] },
  { id: "fala_elaborada", texto: "Fala elaborada demais", torres: ["performance", "espiritualizacao"] },
  { id: "silencio_persistente", texto: "Silêncio persistente", torres: ["silencio"] },
  { id: "dificuldade_desejos", texto: "Dificuldade em nomear desejos", torres: ["adaptacao", "silencio"] },
  { id: "discurso_espiritualizado", texto: "Discurso espiritualizado da dor", torres: ["espiritualizacao"] },
  { id: "adaptacao_rapida", texto: "Adaptação rápida ao ambiente", torres: ["adaptacao"] },
  { id: "resistencia_fragilidade", texto: "Resistência à fragilidade", torres: ["forca", "controle"] },
  { id: "corpo_rigido", texto: "Corpo rígido ou ausente", torres: ["controle", "forca", "silencio"] },
  { id: "necessidade_aprovacao", texto: "Necessidade de aprovação constante", torres: ["performance", "adaptacao"] },
  { id: "cuidar_excessivo", texto: "Cuidar excessivamente dos outros", torres: ["cuidado"] },
  { id: "hipervigilancia", texto: "Hipervigilância ao ambiente", torres: ["controle", "adaptacao"] }
];

type Step = "apresentacao" | "aviso" | "observacao" | "selecao" | "orientacao" | "pergunta" | "fechamento";

export default function TorreViva() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("apresentacao");
  const [observacoesSelecionadas, setObservacoesSelecionadas] = useState<string[]>([]);
  const [torreEscolhida, setTorreEscolhida] = useState<Torre | null>(null);

  const toggleObservacao = (id: string) => {
    setObservacoesSelecionadas(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const handleSelecionarTorre = (torre: Torre) => {
    setTorreEscolhida(torre);
    setStep("orientacao");
  };

  const renderStep = () => {
    switch (step) {
      // ══════════════════════════════════════════════════════════════
      // TELA 1 — APRESENTAÇÃO
      // ══════════════════════════════════════════════════════════════
      case "apresentacao":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                Ferramenta Profissional
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground">
                TORRE VIVA™
              </h1>
              <p className="text-lg text-muted-foreground">
                Leitura da Estrutura Psíquica Predominante
              </p>
            </div>

            <div className="max-w-xl space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                A Torre Viva™ reconhece como a psique se organizou para sobreviver.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ela não interpreta, não define e não diagnostica.
              </p>
              <p className="text-foreground font-medium leading-relaxed">
                Ela orienta postura, ritmo e limite da condução simbólica.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={() => setStep("aviso")}
              className="mt-8"
            >
              Iniciar Leitura
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 2 — AVISO ÉTICO (OBRIGATÓRIA)
      // ══════════════════════════════════════════════════════════════
      case "aviso":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
            <div className="p-4 rounded-full bg-amber-500/10">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>

            <h2 className="text-2xl font-serif text-foreground">
              Aviso Ético
            </h2>

            <Card className="max-w-lg bg-card/50 border-amber-500/20">
              <CardContent className="pt-6 space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-muted-foreground">Não é diagnóstico</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-muted-foreground">Não substitui acompanhamento clínico</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-muted-foreground">Não deve ser nomeada à cliente</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-foreground font-medium">
                    Serve apenas para organizar a postura da facilitadora
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              onClick={() => setStep("observacao")}
              className="mt-4"
            >
              Compreendo e desejo continuar
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 3 — OBSERVAÇÃO GUIADA
      // ══════════════════════════════════════════════════════════════
      case "observacao":
        return (
          <div className="max-w-2xl mx-auto space-y-8 px-4">
            <div className="text-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-serif text-foreground">
                Observação Guiada
              </h2>
              <p className="text-muted-foreground">
                Selecione os padrões observados no campo
              </p>
            </div>

            <Card className="bg-card/50">
              <CardContent className="pt-6 space-y-3">
                {OBSERVACOES.map((obs) => (
                  <div
                    key={obs.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                      observacoesSelecionadas.includes(obs.id)
                        ? "bg-primary/10 border-primary/30"
                        : "bg-background/50 border-border/50 hover:border-primary/20"
                    )}
                    onClick={() => toggleObservacao(obs.id)}
                  >
                    <Checkbox
                      checked={observacoesSelecionadas.includes(obs.id)}
                      onCheckedChange={() => toggleObservacao(obs.id)}
                    />
                    <span className="text-foreground">{obs.texto}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={() => setStep("selecao")}
                disabled={observacoesSelecionadas.length === 0}
              >
                Avançar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 4 — SELEÇÃO DA TORRE PREDOMINANTE
      // ══════════════════════════════════════════════════════════════
      case "selecao":
        return (
          <div className="max-w-4xl mx-auto space-y-8 px-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif text-foreground">
                Torre Predominante
              </h2>
              <p className="text-muted-foreground">
                Confirme a estrutura predominante observada no campo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TORRES.map((torre) => {
                const Icon = torre.icone;
                return (
                  <Card 
                    key={torre.id}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
                      "bg-card/50 border-border/50 hover:border-primary/30"
                    )}
                    onClick={() => handleSelecionarTorre(torre)}
                  >
                    <CardHeader className="pb-2">
                      <div className={cn(
                        "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center mb-2",
                        torre.cor
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{torre.nome}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {torre.descricao}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-sm text-muted-foreground italic">
              Esta leitura não define a pessoa. Ela indica a organização predominante do campo neste momento.
            </p>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 5 — ORIENTAÇÃO DE POSTURA
      // ══════════════════════════════════════════════════════════════
      case "orientacao":
        if (!torreEscolhida) return null;
        const Icon = torreEscolhida.icone;
        
        return (
          <div className="max-w-3xl mx-auto space-y-8 px-4">
            <div className="text-center space-y-4">
              <div className={cn(
                "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center mx-auto",
                torreEscolhida.cor
              )}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-serif text-foreground">
                {torreEscolhida.nome}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {torreEscolhida.descricao}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* SUSTENTAR */}
              <Card className="bg-emerald-500/5 border-emerald-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    SUSTENTAR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {torreEscolhida.sustentar.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      • {item}
                    </p>
                  ))}
                </CardContent>
              </Card>

              {/* EVITAR */}
              <Card className="bg-red-500/5 border-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    EVITAR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {torreEscolhida.evitar.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      • {item}
                    </p>
                  ))}
                </CardContent>
              </Card>

              {/* RITMO */}
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-blue-400 flex items-center gap-2">
                    <Waves className="h-4 w-4" />
                    RITMO
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {torreEscolhida.ritmo.map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      • {item}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setStep("pergunta")}
              >
                Pergunta de Reconhecimento
                <Quote className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 6 — PERGUNTA ÚNICA
      // ══════════════════════════════════════════════════════════════
      case "pergunta":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Quote className="h-12 w-12 text-primary" />
            </div>

            <div className="max-w-xl space-y-6">
              <h2 className="text-2xl font-serif text-foreground">
                Pergunta de Reconhecimento
              </h2>
              
              <Card className="bg-card/50 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-lg text-foreground italic leading-relaxed">
                    "O que em você precisou se organizar dessa forma para continuar existindo?"
                  </p>
                </CardContent>
              </Card>

              <p className="text-muted-foreground text-sm">
                Não insista. O silêncio também é resposta.
              </p>
            </div>

            <Button 
              size="lg" 
              onClick={() => setStep("fechamento")}
              className="mt-4"
            >
              Encerrar Leitura
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      // ══════════════════════════════════════════════════════════════
      // TELA 7 — FECHAMENTO
      // ══════════════════════════════════════════════════════════════
      case "fechamento":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4">
            <div className="p-4 rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>

            <div className="max-w-xl space-y-6">
              <h2 className="text-2xl font-serif text-foreground">
                Leitura Concluída
              </h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  A Torre Viva™ cumpre sua função quando protege o campo, não quando explica a história.
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  Confie no ritmo. A travessia não pede pressa.
                </p>
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={() => navigate(-1)}
              className="mt-4"
            >
              Voltar à Sessão
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const handleBack = () => navigate('/ferramentas');

  return (
    <ContentPageLayout
      title=""
      onBack={handleBack}
      backLabel="Ferramentas"
    >
      <div className="py-8">
        {renderStep()}
      </div>
    </ContentPageLayout>
  );
}
