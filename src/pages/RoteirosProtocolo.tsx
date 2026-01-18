import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Compass, Route, Copy, Check, Printer, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ScriptSection {
  id: string;
  title: string;
  content: string;
  editable?: boolean;
}

interface ToolScript {
  id: 'mapa' | 'oraculo' | 'caminho';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  duration: string;
  opening: ScriptSection;
  guidingQuestions: ScriptSection[];
  groundingMoment: ScriptSection;
  integrationQuestion: ScriptSection;
  closing: ScriptSection;
  ethicalReminder: string;
}

const SCRIPTS: ToolScript[] = [
  {
    id: 'mapa',
    title: 'O Mapa dos Cinco Territórios',
    subtitle: 'Roteiro de Localização Psíquica',
    icon: <Map className="w-5 h-5" />,
    color: 'from-amber-500/20 to-orange-500/20',
    duration: '60-75 minutos',
    opening: {
      id: 'mapa-opening',
      title: 'Abertura do Campo',
      content: `"Hoje vamos fazer uma leitura do seu mapa interno — não para rotular ou definir quem você é, mas para localizar onde você está agora. Pense nisso como olhar para um território que você habita, mas talvez nunca tenha mapeado com cuidado."

[Pausa]

"Antes de começarmos, respire três vezes profundamente. A cada expiração, permita que o corpo se acomode. Não estamos buscando respostas certas — estamos buscando reconhecimento."

[Gesto simples: convide a cliente a colocar uma mão no peito]

"O que você percebe quando se pergunta: onde estou hoje?"`,
      editable: true
    },
    guidingQuestions: [
      {
        id: 'mapa-q1',
        title: 'Pergunta 1 — Expressão',
        content: '"Como você se expressa quando sente que pode ser quem é, sem filtros? E quando sente que não pode?"',
        editable: true
      },
      {
        id: 'mapa-q2',
        title: 'Pergunta 2 — Relação',
        content: '"Nos seus relacionamentos mais importantes, onde você sente que perde ou cede mais de si? Onde você se sente mais inteira?"',
        editable: true
      },
      {
        id: 'mapa-q3',
        title: 'Pergunta 3 — Estrutura',
        content: '"Quando a vida pede organização e disciplina, como você responde? Com fluidez ou resistência?"',
        editable: true
      },
      {
        id: 'mapa-q4',
        title: 'Pergunta 4 — Abertura',
        content: '"Diante do desconhecido, você tende a se abrir com curiosidade ou se recolher em proteção?"',
        editable: true
      },
      {
        id: 'mapa-q5',
        title: 'Pergunta 5 — Sensibilidade',
        content: '"O que acontece no seu corpo quando você está sob pressão emocional? Onde a tensão aparece primeiro?"',
        editable: true
      }
    ],
    groundingMoment: {
      id: 'mapa-grounding',
      title: 'Momento de Ancoragem',
      content: `[Após as perguntas, antes de nomear os territórios]

"Vamos fazer uma pausa. Feche os olhos se for confortável."

[30 segundos de silêncio]

"Agora, sem pensar muito, responda: qual dessas perguntas tocou algo que você normalmente evita olhar?"

[Acolha a resposta sem interpretar]

"Obrigada por compartilhar. Esse é o território que vamos cuidar com mais atenção."`,
      editable: true
    },
    integrationQuestion: {
      id: 'mapa-integration',
      title: 'Pergunta de Integração',
      content: `"Olhando para esse mapa que estamos desenhando juntas — sem julgamento, apenas reconhecimento — qual território você sente que precisa de mais atenção, cuidado ou permissão para existir?"

[Deixe a cliente nomear. Não corrija. Não interprete além do que ela trouxer.]`,
      editable: true
    },
    closing: {
      id: 'mapa-closing',
      title: 'Fechamento',
      content: `"Este mapa não é um diagnóstico. É uma fotografia de onde você está agora — e fotografias mudam com o tempo. O que mapeamos hoje serve como ponto de partida, não como destino."

[Pausa]

"Não vou te pedir para resolver nada. Apenas leve consigo a pergunta: qual território precisa de minha presença, não de minha correção?"

[Encerre sem pressa. Permita que o silêncio feche o campo.]`,
      editable: true
    },
    ethicalReminder: 'Este roteiro sustenta localização, não diagnóstico. Evite interpretações conclusivas. A cliente nomeia seu próprio território.'
  },
  {
    id: 'oraculo',
    title: 'O Oráculo dos Nove Arquétipos',
    subtitle: 'Roteiro de Interpretação de Padrões',
    icon: <Compass className="w-5 h-5" />,
    color: 'from-purple-500/20 to-violet-500/20',
    duration: '75-90 minutos',
    opening: {
      id: 'oraculo-opening',
      title: 'Abertura do Campo',
      content: `"Os arquétipos não são caixas onde você cabe. São espelhos — mostram como a psique organiza certos padrões. Hoje não vamos te encaixar em nenhum tipo. Vamos usar os arquétipos como lentes para ver o que já está em movimento dentro de você."

[Pausa]

"Antes de começarmos, feche os olhos. Pergunte para dentro: 'Quem tem vivido a minha vida ultimamente? A mulher que eu gostaria de ser, ou outra?'"

[Gesto: mãos sobre o ventre]

"Deixe a pergunta repousar. Quando estiver pronta, abra os olhos."`,
      editable: true
    },
    guidingQuestions: [
      {
        id: 'oraculo-q1',
        title: 'Pergunta 1 — Dinâmica Dominante',
        content: '"Quando você está sob pressão, qual padrão de comportamento aparece primeiro — a que cuida dos outros, a que busca controle, a que se isola, a que precisa ser vista, ou outra?"',
        editable: true
      },
      {
        id: 'oraculo-q2',
        title: 'Pergunta 2 — Sombra',
        content: '"Existe algum comportamento que você critica fortemente nos outros — mas que, às vezes, percebe em si mesma?"',
        editable: true
      },
      {
        id: 'oraculo-q3',
        title: 'Pergunta 3 — Exílio',
        content: '"Qual parte de você foi menos bem-vinda na sua história? A criativa, a raivosa, a vulnerável, a ambiciosa?"',
        editable: true
      },
      {
        id: 'oraculo-q4',
        title: 'Pergunta 4 — Desejo Profundo',
        content: '"Se você pudesse viver uma versão sua que normalmente esconde — quem seria ela? O que ela faria diferente?"',
        editable: true
      },
      {
        id: 'oraculo-q5',
        title: 'Pergunta 5 — Relação com o Feminino',
        content: '"Como você aprendeu a ser mulher? O que foi ensinado, e o que você precisou desaprender?"',
        editable: true
      }
    ],
    groundingMoment: {
      id: 'oraculo-grounding',
      title: 'Momento de Ancoragem',
      content: `[Após explorar os padrões, antes de nomear os arquétipos]

"Vamos pausar aqui. Não vou te dar respostas — vou te pedir para sentir."

[1 minuto de silêncio]

"Se você pudesse dar um nome simbólico para a mulher que aparece quando você está no seu melhor — qual seria? Não precisa fazer sentido. Pode ser uma imagem, um animal, um personagem."

[Acolha o que vier sem corrigir]

"E a mulher que aparece quando você está em sofrimento? Que nome ela teria?"

[Silêncio]`,
      editable: true
    },
    integrationQuestion: {
      id: 'oraculo-integration',
      title: 'Pergunta de Integração',
      content: `"O que essas duas mulheres precisam uma da outra? O que a luminosa pode oferecer à que sofre? E o que a sombria protege que a outra ignora?"

[Não responda por ela. Deixe a tensão viva.]`,
      editable: true
    },
    closing: {
      id: 'oraculo-closing',
      title: 'Fechamento',
      content: `"Os arquétipos não são prescrições. Não estou te dizendo quem você é — estou te convidando a ver os padrões que te habitam. E padrões podem mudar quando são vistos."

[Pausa]

"Leve esta pergunta com você: qual desses padrões está pedindo para ser integrado — não eliminado, não corrigido, mas reconhecido?"

[Encerre com lentidão. Deixe o campo aberto, não resolvido.]`,
      editable: true
    },
    ethicalReminder: 'Arquétipos são espelhos, não rótulos. Evite afirmações do tipo "você é uma tipo X". Deixe a cliente nomear suas próprias figuras.'
  },
  {
    id: 'caminho',
    title: 'O Caminho da Mulher que se Torna Inteira',
    subtitle: 'Roteiro de Integração e Individuação',
    icon: <Route className="w-5 h-5" />,
    color: 'from-emerald-500/20 to-teal-500/20',
    duration: '60-90 minutos',
    opening: {
      id: 'caminho-opening',
      title: 'Abertura do Campo',
      content: `"A Jornada da Heroína não é uma linha reta. É uma espiral — você passa pelos mesmos temas, mas de lugares diferentes. O que parece retrocesso pode ser aprofundamento."

[Pausa]

"Hoje não vamos descobrir onde você deveria estar. Vamos sentir onde você está — sem pressa de avançar, sem vergonha de ainda estar aqui."

[Gesto: pés no chão, sentir as plantas dos pés]

"Feche os olhos. Pergunte internamente: 'Qual travessia estou fazendo agora? Qual limiar estou atravessando — ou evitando?'"

[Silêncio de 30 segundos]`,
      editable: true
    },
    guidingQuestions: [
      {
        id: 'caminho-q1',
        title: 'Pergunta 1 — Chamado',
        content: '"Existe algo te chamando agora — algo que você sente que precisa fazer, ser ou deixar para trás — mesmo que ainda não saiba como?"',
        editable: true
      },
      {
        id: 'caminho-q2',
        title: 'Pergunta 2 — Recusa',
        content: '"O que você está evitando olhar, fazer ou sentir? Onde a resistência está mais forte?"',
        editable: true
      },
      {
        id: 'caminho-q3',
        title: 'Pergunta 3 — Descida',
        content: '"Houve algum momento recente em que você sentiu que estava no fundo? O que você encontrou lá?"',
        editable: true
      },
      {
        id: 'caminho-q4',
        title: 'Pergunta 4 — Aliança',
        content: '"Quem ou o que tem te sustentado nessa travessia — mesmo que você não tenha pedido?"',
        editable: true
      },
      {
        id: 'caminho-q5',
        title: 'Pergunta 5 — Retorno',
        content: '"Se essa travessia se completasse hoje — não resolvida, mas integrada — o que você levaria de volta para sua vida?"',
        editable: true
      }
    ],
    groundingMoment: {
      id: 'caminho-grounding',
      title: 'Momento de Ancoragem',
      content: `[No centro da sessão, entre exploração e integração]

"Vamos pausar aqui. A jornada não pede pressa."

[1 minuto de silêncio completo]

"Coloque uma mão sobre o coração. Pergunte silenciosamente: 'O que essa travessia está me pedindo que eu ainda não entreguei?'"

[Acolha o que vier — mesmo que seja silêncio]

"Você não precisa responder em voz alta. Apenas reconheça."`,
      editable: true
    },
    integrationQuestion: {
      id: 'caminho-integration',
      title: 'Pergunta de Integração',
      content: `"Se essa jornada que você está vivendo fosse um rito de passagem — não um problema a resolver, mas uma iniciação a atravessar — o que precisaria morrer para que algo novo pudesse nascer?"

[Permita o tempo que for necessário. Não complete o pensamento dela.]`,
      editable: true
    },
    closing: {
      id: 'caminho-closing',
      title: 'Fechamento',
      content: `"A jornada continua depois desta sessão. Não te prometo chegada, nem cura, nem resolução. Te ofereço testemunho: vi você aqui, presente, disposta a olhar."

[Pausa]

"Leve consigo uma única pergunta — a que mais ressoou. Deixe-a trabalhar em você nos próximos dias. Não busque resposta. Deixe a pergunta te habitar."

[Silêncio final]

"Quando estiver pronta, abra os olhos. O campo continua aberto."`,
      editable: true
    },
    ethicalReminder: 'A Jornada é cíclica, não linear. Não acelere fases, não force resoluções. A cliente determina seu próprio ritmo de travessia.'
  }
];

export default function RoteirosProtocolo() {
  const navigate = useNavigate();
  const [editedScripts, setEditedScripts] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({
    mapa: true,
    oraculo: false,
    caminho: false
  });

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copiado para a área de transferência');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = (id: string, content: string) => {
    setEditedScripts(prev => ({ ...prev, [id]: content }));
  };

  const getContent = (section: ScriptSection) => {
    return editedScripts[section.id] ?? section.content;
  };

  const handlePrint = () => {
    const printContent = SCRIPTS.map(script => `
      <div style="page-break-after: always; padding: 40px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">${script.title}</h1>
        <p style="font-size: 14px; color: #666; margin-bottom: 24px;">${script.subtitle} • ${script.duration}</p>
        
        <h2 style="font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">1. Abertura do Campo</h2>
        <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">${getContent(script.opening)}</pre>
        
        <h2 style="font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">2. Perguntas Guias</h2>
        ${script.guidingQuestions.map((q, i) => `
          <h3 style="font-size: 14px; margin: 16px 0 8px; color: #555;">${q.title}</h3>
          <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">${getContent(q)}</pre>
        `).join('')}
        
        <h2 style="font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">3. Momento de Ancoragem</h2>
        <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">${getContent(script.groundingMoment)}</pre>
        
        <h2 style="font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">4. Pergunta de Integração</h2>
        <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">${getContent(script.integrationQuestion)}</pre>
        
        <h2 style="font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">5. Fechamento</h2>
        <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">${getContent(script.closing)}</pre>
        
        <div style="margin-top: 30px; padding: 16px; background: #fff3cd; border-radius: 8px;">
          <strong style="color: #856404;">⚠️ Lembrete Ético:</strong>
          <p style="margin: 8px 0 0; color: #856404;">${script.ethicalReminder}</p>
        </div>
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Roteiros de Sessão - Protocolo Oracular</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const toggleTool = (toolId: string) => {
    setExpandedTools(prev => ({ ...prev, [toolId]: !prev[toolId] }));
  };

  const ScriptBlock = ({ section, showCopy = true }: { section: ScriptSection; showCopy?: boolean }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{section.title}</h4>
        {showCopy && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(section.id, getContent(section))}
          >
            {copiedId === section.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        )}
      </div>
      {section.editable ? (
        <Textarea
          value={getContent(section)}
          onChange={(e) => handleEdit(section.id, e.target.value)}
          className="min-h-[150px] font-serif text-sm leading-relaxed"
        />
      ) : (
        <div className="p-4 bg-muted/50 rounded-lg">
          <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">{getContent(section)}</pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold">Roteiros de Sessão</h1>
              <p className="text-muted-foreground">Protocolo Oracular do Feminino</p>
            </div>
          </div>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>

        {/* Ethical Framework */}
        <Alert className="mb-8 border-gold/30 bg-gold/5">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <AlertDescription className="text-sm">
            <strong className="text-gold">Princípios Éticos dos Roteiros:</strong>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• <strong>Autonomia:</strong> A cliente nomeia, você sustenta.</li>
              <li>• <strong>Ritmo:</strong> Respeite o tempo dela, não a agenda da sessão.</li>
              <li>• <strong>Contenção:</strong> Acolha sem resolver; testemunhe sem interpretar.</li>
              <li>• <strong>Sem promessas:</strong> Não há cura garantida, apenas presença oferecida.</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Scripts */}
        <div className="space-y-6">
          {SCRIPTS.map((script) => (
            <Collapsible
              key={script.id}
              open={expandedTools[script.id]}
              onOpenChange={() => toggleTool(script.id)}
            >
              <Card className="overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className={`cursor-pointer hover:bg-muted/50 transition-colors bg-gradient-to-r ${script.color}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background/80 rounded-lg">
                          {script.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{script.title}</CardTitle>
                          <CardDescription>{script.subtitle} • {script.duration}</CardDescription>
                        </div>
                      </div>
                      {expandedTools[script.id] ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-6 space-y-8">
                    {/* Ethical Reminder */}
                    <Alert className="bg-amber-500/10 border-amber-500/30">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <AlertDescription className="text-sm text-amber-200">
                        {script.ethicalReminder}
                      </AlertDescription>
                    </Alert>

                    {/* 1. Opening */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-sm flex items-center justify-center">1</span>
                        Abertura do Campo
                      </h3>
                      <ScriptBlock section={script.opening} />
                    </div>

                    <Separator />

                    {/* 2. Guiding Questions */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-sm flex items-center justify-center">2</span>
                        Perguntas Guias
                      </h3>
                      <div className="space-y-6">
                        {script.guidingQuestions.map((q) => (
                          <ScriptBlock key={q.id} section={q} />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* 3. Grounding Moment */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-sm flex items-center justify-center">3</span>
                        Momento de Ancoragem
                      </h3>
                      <ScriptBlock section={script.groundingMoment} />
                    </div>

                    <Separator />

                    {/* 4. Integration Question */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-sm flex items-center justify-center">4</span>
                        Pergunta de Integração
                      </h3>
                      <ScriptBlock section={script.integrationQuestion} />
                    </div>

                    <Separator />

                    {/* 5. Closing */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-sm flex items-center justify-center">5</span>
                        Fechamento
                      </h3>
                      <ScriptBlock section={script.closing} />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 p-6 bg-muted/30 rounded-lg border border-border/50">
          <h3 className="font-semibold mb-2">Nota Final</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Estes roteiros são guias, não scripts rígidos. O terapeuta permanece como intérprete e guardião do campo. 
            Adapte as perguntas ao contexto da cliente, ao momento terapêutico e à sua própria linguagem. 
            Os textos são editáveis para que você personalize conforme sua prática.
          </p>
          <p className="text-sm text-muted-foreground mt-3 italic">
            A sessão pertence à cliente. O roteiro serve ao encontro.
          </p>
        </div>
      </div>
    </div>
  );
}
