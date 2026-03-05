import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronRight, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Caso {
  id: string;
  titulo: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  contexto: string;
  opcoes: { ferramenta: string; correta: boolean; justificativa: string }[];
  conducao: string;
}

const CASOS: Caso[] = [
  {
    id: '1',
    titulo: 'A cliente que não consegue sair de um ciclo',
    nivel: 'iniciante',
    contexto: 'Maria, 34 anos, relata que sente estar vivendo as mesmas situações repetidas vezes — nos relacionamentos, no trabalho e na relação consigo mesma. Diz que "sempre acaba no mesmo lugar". Está em sua terceira sessão.',
    opcoes: [
      { ferramenta: 'Cartografia Psíquica', correta: false, justificativa: 'Indicada para mapeamento inicial. O ciclo repetitivo pede ferramentas de padrões, não de campo.' },
      { ferramenta: 'Labirinto das 39 Portas', correta: true, justificativa: 'Ideal para ciclos repetitivos — permite identificar qual porta simbólica está travada e qual padrão se repete.' },
      { ferramenta: 'Ritual de Passagem', correta: false, justificativa: 'Prematuro neste momento. O ritual marca encerramento de ciclo, mas o padrão ainda não foi compreendido.' },
    ],
    conducao: '1. Acolher a narrativa de repetição sem interpretá-la como "erro".\n2. Apresentar o Labirinto como espaço de escuta dos padrões.\n3. Identificar a Porta predominante (aquela que parece abrir e fechar repetidamente).\n4. Usar perguntas de campo: "O que acontece dentro de você exatamente antes de voltar ao ponto conhecido?"\n5. Registrar a Porta identificada e o movimento psíquico no prontuário.',
  },
  {
    id: '2',
    titulo: 'A cliente em crise aguda',
    nivel: 'intermediario',
    contexto: 'Joana, 28 anos, chega à sessão chorando. Terminou um relacionamento de 5 anos na véspera. Sente-se perdida, sem chão. Não consegue parar de pensar no ex. É a primeira vez que passa por isso.',
    opcoes: [
      { ferramenta: 'Atlas de Arquétipos', correta: false, justificativa: 'Ferramenta reflexiva — a cliente precisa de estabilização antes de trabalho simbólico profundo.' },
      { ferramenta: 'Escrita Simbólica', correta: true, justificativa: 'Em crise, a escrita simbólica permite externalizar a dor e dar forma ao caos interno sem exigir racionalização.' },
      { ferramenta: 'Torre Viva', correta: false, justificativa: 'As Torres mapeiam defesas — útil depois da estabilização, quando a cliente puder observar seus mecanismos de proteção.' },
    ],
    conducao: '1. Sustentar silêncio acolhedor nos primeiros minutos.\n2. Oferecer a Escrita Simbólica como gesto — não como tarefa.\n3. Propor: "Escreva para a parte de você que está em dor agora. Não precisa fazer sentido."\n4. Não interpretar o que for escrito. Apenas testemunhar.\n5. Encerrar com pergunta de presença: "O que você precisa agora, neste momento?"',
  },
  {
    id: '3',
    titulo: 'A cliente que racionaliza tudo',
    nivel: 'avancado',
    contexto: 'Fernanda, 42 anos, terapeuta cognitivo-comportamental, procura atendimento simbólico. Fala com clareza e articulação, mas desconecta-se do corpo quando temas emocionais surgem. "Eu já entendi isso intelectualmente", repete.',
    opcoes: [
      { ferramenta: 'Cartografia Psíquica', correta: false, justificativa: 'A Cartografia exige narrativa — o risco é alimentar a racionalização que já é o padrão de defesa.' },
      { ferramenta: 'Decodificação Onírica', correta: true, justificativa: 'Os sonhos contornam o controle racional. Trabalhar com material onírico permite acessar o que o intelecto protege.' },
      { ferramenta: 'Diálogo de Partes', correta: false, justificativa: 'Pode funcionar, mas requer que a cliente acesse estados emocionais distintos — o que a racionalização impede.' },
    ],
    conducao: '1. Validar a inteligência analítica da cliente sem reforçá-la como caminho único.\n2. Perguntar sobre sonhos recentes de forma casual ("Algo curioso durante o sono?").\n3. Se houver sonho, usar Decodificação Onírica com foco sensorial: cores, texturas, sensações.\n4. Evitar interpretações conceituais — privilegiar perguntas corporais: "Onde no corpo você sente isso?"\n5. Registrar o material onírico e a reação corporal como dado clínico.',
  },
];

const NIVEL_BADGE: Record<string, string> = {
  iniciante: 'bg-green-600/20 text-green-400',
  intermediario: 'bg-amber-600/20 text-amber-400',
  avancado: 'bg-red-600/20 text-red-400',
};

const NIVEL_LABEL: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export function CasosSimulados() {
  const [selectedCaso, setSelectedCaso] = useState<Caso | null>(null);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [revelado, setRevelado] = useState(false);

  const abrirCaso = (caso: Caso) => {
    setSelectedCaso(caso);
    setEscolha(null);
    setRevelado(false);
  };

  const escolherFerramenta = (idx: number) => {
    setEscolha(idx);
    setRevelado(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-[#F5F1E8]/60">
          <strong className="text-amber-400">Área educativa.</strong> Casos fictícios para estudo e prática de escolha de ferramentas. Nenhum dado real é utilizado.
        </p>
      </div>

      <div className="grid gap-4">
        {CASOS.map(caso => (
          <Card
            key={caso.id}
            className="bg-[#0F2438] border-[#C9A24A]/10 hover:border-[#C9A24A]/30 cursor-pointer transition-all group"
            onClick={() => abrirCaso(caso)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#F5F1E8] flex items-center gap-2">
                  {caso.titulo}
                  <ChevronRight className="w-4 h-4 text-[#F5F1E8]/30 group-hover:text-[#C9A24A] transition-colors" />
                </CardTitle>
                <Badge className={NIVEL_BADGE[caso.nivel]}>{NIVEL_LABEL[caso.nivel]}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#F5F1E8]/50 line-clamp-2">{caso.contexto}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedCaso} onOpenChange={open => !open && setSelectedCaso(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0B1B2B] border-[#C9A24A]/20">
          {selectedCaso && (
            <>
              <DialogHeader>
                <Badge className={`w-fit ${NIVEL_BADGE[selectedCaso.nivel]}`}>{NIVEL_LABEL[selectedCaso.nivel]}</Badge>
                <DialogTitle className="text-xl text-[#F5F1E8]">{selectedCaso.titulo}</DialogTitle>
                <DialogDescription className="text-[#F5F1E8]/50">{selectedCaso.contexto}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <p className="text-sm font-medium text-[#C9A24A]">Qual ferramenta você escolheria?</p>
                <div className="grid gap-2">
                  {selectedCaso.opcoes.map((opt, idx) => {
                    const isChosen = escolha === idx;
                    const isCorrect = opt.correta;
                    let borderClass = 'border-[#C9A24A]/10';
                    if (revelado && isChosen && isCorrect) borderClass = 'border-emerald-500/50 bg-emerald-500/5';
                    if (revelado && isChosen && !isCorrect) borderClass = 'border-red-500/30 bg-red-500/5';
                    if (revelado && !isChosen && isCorrect) borderClass = 'border-emerald-500/30';

                    return (
                      <button
                        key={idx}
                        onClick={() => !revelado && escolherFerramenta(idx)}
                        disabled={revelado}
                        className={`text-left p-4 rounded-lg border transition-all ${borderClass} ${!revelado ? 'hover:border-[#C9A24A]/40 cursor-pointer' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {revelado && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          <span className="text-sm font-medium text-[#F5F1E8]">{opt.ferramenta}</span>
                        </div>
                        {revelado && (
                          <p className="text-xs text-[#F5F1E8]/50 mt-1">{opt.justificativa}</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {revelado && (
                  <Card className="bg-[#0F2438] border-[#C9A24A]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-[#C9A24A] flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Condução sugerida pelo Método Orácula
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-[#F5F1E8]/70 whitespace-pre-line">{selectedCaso.conducao}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
