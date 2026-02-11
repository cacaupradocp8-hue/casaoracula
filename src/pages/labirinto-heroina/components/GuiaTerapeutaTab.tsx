import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, AlertTriangle, Lightbulb, Shield, 
  Heart, Eye, Compass, Clock, Users, Sparkles,
  Flame, Map
} from "lucide-react";

// ===== ROTEIRO INDIVIDUAL 60 MIN =====
const ROTEIRO_INDIVIDUAL = [
  { tempo: "0–5 min", fase: "Abertura Ritual", descricao: "Convide a cliente a fechar os olhos e respirar profundamente 3 vezes. Acenda uma vela simbólica (real ou imaginada). Pergunte: 'Como você chega aqui hoje? Que peso traz? Que desejo habita?'" },
  { tempo: "5–15 min", fase: "Escuta do Momento Presente", descricao: "Escute sem interpretar. Identifique as palavras-chave, imagens recorrentes e metáforas espontâneas da fala da cliente. Anote internamente qual Porta parece pulsar." },
  { tempo: "15–25 min", fase: "Escolha da Carta / Porta", descricao: "Apresente as 7 Cartas da Jornada ou as 14 Portas. Permita que a cliente escolha intuitivamente. Leia o texto oracular em voz alta, pausadamente. Observe as reações corporais." },
  { tempo: "25–40 min", fase: "Exercício do Caderno da Heroína", descricao: "Aplique o exercício correspondente à carta/porta escolhida. Utilize as 3 perguntas reflexivas. Registre o campo corporal. No modo profissional, preencha os campos clínicos." },
  { tempo: "40–50 min", fase: "Integração Simbólica", descricao: "Retorne às palavras da cliente. Teça pontes entre o que emergiu no exercício e o momento de vida atual. Não feche sentidos — abra possibilidades. Use a linguagem simbólica, nunca diagnóstica." },
  { tempo: "50–55 min", fase: "Ritual de Fechamento", descricao: "Proponha um gesto simbólico: escrever uma palavra no caderno, tocar uma parte do corpo, ou soprar a vela. Registre o ritual proposto no Mapa da Heroína." },
  { tempo: "55–60 min", fase: "Encerramento e Registro", descricao: "Preencha a ficha clínica. Registre observações, hipóteses e evolução longitudinal. Gere o PDF se for encerramento de ciclo." },
];

// ===== ROTEIRO GRUPO 2H =====
const ROTEIRO_GRUPO = [
  { tempo: "0–15 min", fase: "Abertura do Círculo", descricao: "Forme um círculo. Cada participante diz seu nome e uma palavra que representa como chega. A facilitadora acende o centro simbólico. Estabeleça os acordos do círculo: escuta sem julgamento, confidencialidade, presença." },
  { tempo: "15–30 min", fase: "Contextualização do Labirinto", descricao: "Apresente brevemente a estrutura: 4 Reinos (Marés, Figuras, Cenários, Gestos) e as 7 Cartas da Jornada. Não explique demais — deixe o mistério operar. Distribua as cartas sobre o centro do círculo." },
  { tempo: "30–50 min", fase: "Escolha Intuitiva", descricao: "Cada participante caminha até o centro e escolhe uma carta. Em silêncio. Depois, cada uma lê sua carta em voz alta para o grupo. A facilitadora sustenta o campo — não interpreta." },
  { tempo: "50–70 min", fase: "Exercício em Duplas", descricao: "Forme duplas. Cada uma aplica o exercício do Caderno da Heroína à outra. A que escuta pratica a presença. A que fala pratica a vulnerabilidade. Troque após 10 minutos." },
  { tempo: "70–85 min", fase: "Roda de Partilha", descricao: "Retorne ao círculo. Cada participante compartilha em uma frase o que emergiu. Sem comentários, sem conselhos. Apenas espelho. A facilitadora pode tecer fios simbólicos entre as falas." },
  { tempo: "85–100 min", fase: "Ritual Coletivo", descricao: "Proponha um ritual compartilhado: escrever uma palavra em um papel e queimá-lo simbolicamente, ou criar um gesto corporal coletivo. O grupo sela a travessia juntas." },
  { tempo: "100–120 min", fase: "Encerramento e Mapa", descricao: "Cada participante registra no seu Mapa Pessoal. A facilitadora fecha o círculo com uma frase ritual. Apague o centro simbólico. Distribua um lembrete simbólico se desejar." },
];

// ===== CONSTELAÇÃO SIMBÓLICA =====
const CONSTELACAO_DIRETRIZES = [
  {
    titulo: "Quando Usar",
    conteudo: "Quando a cliente apresenta conflitos entre partes internas (ex: 'uma parte de mim quer, outra parte resiste'). As Portas e Arquétipos do Labirinto podem ser usados como representantes no campo constelativo.",
  },
  {
    titulo: "Montagem do Campo",
    conteudo: "Disponha as cartas dos Arquétipos no espaço. Peça à cliente que posicione fisicamente as cartas representando as forças internas em conflito. Observe distâncias, direções e relações espaciais.",
  },
  {
    titulo: "Movimentos",
    conteudo: "Convide a cliente a mover as cartas lentamente, uma de cada vez. Pergunte: 'O que muda quando esta carta se aproxima?' 'O que o corpo sente?' Nunca force movimentos — siga o campo.",
  },
  {
    titulo: "Integração",
    conteudo: "Quando um novo arranjo emerge, peça à cliente que nomeie o que sente. Registre a configuração final. Use o Mapa da Heroína para documentar a constelação realizada.",
  },
  {
    titulo: "Cuidados",
    conteudo: "Não utilize se a cliente estiver em estado dissociativo. Mantenha a linguagem simbólica — evite interpretações psicanalíticas diretas. O campo constelativo no Labirinto é exploratório, não resolutivo.",
  },
];

// ===== RITUAL DO MAPA =====
const RITUAL_MAPA = {
  titulo: "Ritual de Selagem do Mapa Pessoal da Heroína®",
  passos: [
    "Prepare o espaço: uma vela, o Mapa impresso ou na tela, e um objeto pessoal da cliente.",
    "Leia em voz alta as quatro cartas ativadas na travessia (Fase, Arquétipo, Metáfora, Ritual).",
    "Peça à cliente que toque cada quadrante do Mapa e diga uma palavra que sintetiza o que recebeu daquela camada.",
    "Convide-a a escrever no verso do Mapa (ou no Caderno de Insights) uma carta para a Heroína que ela está se tornando.",
    "Feche com o gesto da selagem: mãos sobre o Mapa, olhos fechados, três respirações profundas.",
    "A facilitadora diz: 'Esta travessia está selada. O que foi visto, não se desvê. O que foi tocado, não se destoca. Siga, Heroína.'",
    "Gere o PDF e entregue como registro sagrado da travessia.",
  ],
};

// ===== ORIENTAÇÕES DE CONDUÇÃO =====
const ORIENTACOES_CONDUCAO = [
  { titulo: "Tom de Voz", conteudo: "Mantenha um tom pausado, grave e acolhedor. Não infantilize. Não dramatize. Permita silêncios." },
  { titulo: "Linguagem", conteudo: "Use linguagem simbólica e evocativa. Substitua 'problema' por 'portal'. 'Trauma' por 'ferida que pede voz'. 'Cura' por 'integração'." },
  { titulo: "Transferência", conteudo: "Observe projeções sobre as cartas e sobre você. As Portas podem ativar material transferencial intenso. Sustente sem se defender." },
  { titulo: "Limite Ético", conteudo: "O Labirinto não é psicoterapia. É uma ferramenta simbólica de apoio. Se conteúdo de risco emergir (ideação suicida, abuso), priorize protocolos clínicos padrão." },
  { titulo: "Registros", conteudo: "Preencha sempre a ficha clínica após a sessão. Use o modo profissional para documentar evolução. Nunca compartilhe registros clínicos sem mediação." },
  { titulo: "Autocuidado", conteudo: "Após sessões intensas, realize seu próprio ritual de encerramento. O Labirinto mobiliza campo — a facilitadora também é atravessada. Cuide-se." },
];

// ===== SECTIONS ORIGINAIS =====
const GUIA_SECTIONS = [
  {
    icon: <Compass className="w-5 h-5 text-gold" />,
    title: "Propósito da Ferramenta",
    content:
      "O Labirinto da Heroína Interna® é uma ferramenta de aplicação prática que integra o Livro A Jornada da Heroína, o Caderno de Atividades e os Arquétipos Femininos. Não é um oráculo independente — é um ecossistema simbólico de apoio à individuação.",
  },
  {
    icon: <Eye className="w-5 h-5 text-gold" />,
    title: "Postura Clínica",
    content:
      "Mantenha a escuta simbólica ativa. Não interprete diretamente — facilite a elaboração da cliente. As cartas e camadas são espelhos, não diagnósticos. Seu papel é sustentar o campo para que a cliente construa sentido.",
  },
  {
    icon: <Heart className="w-5 h-5 text-gold" />,
    title: "Registro e Acompanhamento",
    content:
      "Utilize os campos de Observações Clínicas e Hipótese Terapêutica para documentar sua leitura profissional. Esses dados ficam protegidos e visíveis apenas para você. A ficha de acompanhamento em PDF pode ser gerada a qualquer momento.",
  },
  {
    icon: <Shield className="w-5 h-5 text-gold" />,
    title: "Limites Éticos",
    content:
      "Nunca compartilhe os registros clínicos com a cliente sem mediação. O Labirinto não substitui avaliação psicológica formal. Em caso de conteúdos de risco, aplique os protocolos clínicos habituais.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    title: "Contraindicações",
    content:
      "Evite uso em contextos de crise aguda, surtos psicóticos ou dissociação severa. A ferramenta pressupõe capacidade reflexiva mínima. Se a cliente apresentar conteúdo de risco, priorize acolhimento e encaminhamento.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-gold" />,
    title: "Dicas de Condução",
    content:
      "Comece sempre pela escuta do momento presente da cliente. Permita que ela escolha a carta ou camada que mais ressoa. Use as reflexões registradas como pontes entre sessões. Finalize com um gesto simbólico de integração.",
  },
];

export function GuiaTerapeutaTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-6 h-6 text-gold" />
        <h2 className="font-display text-xl text-gold">
          Guia da Terapeuta
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Roteiros, rituais e diretrizes completas para aplicação individual, em grupo e em constelação simbólica.
      </p>

      <Tabs defaultValue="visao-geral" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50">
          <TabsTrigger value="visao-geral" className="gap-1.5 text-xs">
            <Eye className="w-3.5 h-3.5" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="individual" className="gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5" />
            Individual (60 min)
          </TabsTrigger>
          <TabsTrigger value="grupo" className="gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5" />
            Grupo (2h)
          </TabsTrigger>
          <TabsTrigger value="constelacao" className="gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Constelação Simbólica
          </TabsTrigger>
          <TabsTrigger value="ritual-mapa" className="gap-1.5 text-xs">
            <Map className="w-3.5 h-3.5" />
            Ritual do Mapa
          </TabsTrigger>
          <TabsTrigger value="conducao" className="gap-1.5 text-xs">
            <Compass className="w-3.5 h-3.5" />
            Orientações
          </TabsTrigger>
        </TabsList>

        {/* VISÃO GERAL */}
        <TabsContent value="visao-geral">
          <div className="grid gap-4 md:grid-cols-2">
            {GUIA_SECTIONS.map((section) => (
              <Card key={section.title} className="border-gold/20 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ROTEIRO INDIVIDUAL */}
        <TabsContent value="individual">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <Clock className="w-5 h-5" />
                Roteiro de Aplicação Individual — 60 minutos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {ROTEIRO_INDIVIDUAL.map((step, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-shrink-0 w-20">
                    <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-1 rounded">
                      {step.tempo}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium text-foreground">{step.fase}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.descricao}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROTEIRO GRUPO */}
        <TabsContent value="grupo">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gold">
                <Users className="w-5 h-5" />
                Roteiro de Aplicação em Grupo — 2 horas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {ROTEIRO_GRUPO.map((step, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex-shrink-0 w-24">
                    <span className="text-xs font-mono text-gold bg-gold/10 px-2 py-1 rounded">
                      {step.tempo}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-medium text-foreground">{step.fase}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.descricao}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONSTELAÇÃO SIMBÓLICA */}
        <TabsContent value="constelacao">
          <div className="space-y-4">
            <Card className="border-purple-500/20 bg-gradient-to-br from-purple-950/10 to-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                  Diretrizes para Constelação Simbólica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {CONSTELACAO_DIRETRIZES.map((d, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="text-sm font-medium text-foreground">{d.titulo}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{d.conteudo}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* RITUAL DO MAPA */}
        <TabsContent value="ritual-mapa">
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-950/10 to-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Flame className="w-5 h-5" />
                {RITUAL_MAPA.titulo}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {RITUAL_MAPA.passos.map((passo, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-medium text-amber-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{passo}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORIENTAÇÕES DE CONDUÇÃO */}
        <TabsContent value="conducao">
          <div className="grid gap-4 md:grid-cols-2">
            {ORIENTACOES_CONDUCAO.map((o, i) => (
              <Card key={i} className="border-gold/20 bg-card/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-foreground">{o.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{o.conteudo}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
