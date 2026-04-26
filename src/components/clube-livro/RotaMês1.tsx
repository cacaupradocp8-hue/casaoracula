import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, Info, Check, Zap, Sparkles, BookOpen, PlayCircle, ClipboardList, PenTool, Lightbulb, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface RotaMês1 {
  id: number;
  tema: string;
  portal: {
    titulo: string;
    texto: string;
  };
  escuta: {
    roteiro: string;
  };
  aplicacao: {
    acao: string;
  };
  registro: {
    pergunta: string;
  };
  integracao: {
    sintese: string;
    fraseSemente: string;
  };
  impacto: {
    distrito: 'instinto' | 'sombra' | 'estrutura' | 'vínculo' | 'expressão';
    tipo: 'ativação' | 'estabilização';
    intensidade: number;
  };
  proximoPasso?: string;
}

export const rotasMes1: RotaMês1[] = [
  {
    id: 1,
    tema: "A voz silenciada",
    portal: {
      titulo: "O Limiar do Chamado",
      texto: "Há uma voz que não é sua, mas que fala por você. \nEla dita o ritmo, impõe o silêncio e policia o desejo. \nNesta semana, o portal se abre para identificar onde a natureza selvagem foi abafada pelo ruído do mundo."
    },
    escuta: {
      roteiro: "Feche os olhos. Sinta o peso da civilidade em seus ombros. Onde dói o silêncio? Escute o sussurro que tenta emergir. Não é uma palavra, é um rosnado tímido. Acolha-o. Você não precisa responder agora, apenas permitir que ele seja ouvido."
    },
    aplicacao: {
      acao: "Identifique um momento do dia em que você 'engoliu' uma verdade para manter a paz. Não mude o comportamento ainda, apenas registre a sensação física desse silenciamento."
    },
    registro: {
      pergunta: "Qual é a frase que sua voz silenciada diria se não houvesse medo do julgamento?"
    },
    integracao: {
      sintese: "O silêncio imposto é a primeira barreira entre você e sua força.",
      fraseSemente: "Eu ouço o que o silêncio guarda."
    },
    impacto: {
      distrito: "instinto",
      tipo: "ativação",
      intensidade: 1
    },
    proximoPasso: "A adaptação invisível"
  },
  {
    id: 2,
    tema: "A adaptação invisível",
    portal: {
      titulo: "A Pele Estranha",
      texto: "Vestimos peles que não nos cabem para pertencer. \nA adaptação é útil, mas quando se torna invisível, ela nos devora. \nVamos olhar para os mecanismos de defesa que se tornaram sua prisão."
    },
    escuta: {
      roteiro: "Observe sua postura. Como você se molda para caber nos espaços? A loba sabe quando se esconder, mas ela nunca esquece quem é. Você esqueceu? O excesso de adaptação é a perda da forma original. Respire fundo e sinta sua própria pele por baixo da máscara."
    },
    aplicacao: {
      acao: "Mude um pequeno hábito automático de 'agradar'. Diga 'vou pensar' em vez de um 'sim' imediato. Sinta o desconforto da não-adaptação."
    },
    registro: {
      pergunta: "De qual expectativa externa você está mais cansada de sustentar hoje?"
    },
    integracao: {
      sintese: "Pertencer a si mesma é o único pertencimento que não exige mutilação.",
      fraseSemente: "Minha forma original é sagrada."
    },
    impacto: {
      distrito: "estrutura",
      tipo: "estabilização",
      intensidade: 2
    },
    proximoPasso: "O instinto não desaparece"
  },
  {
    id: 3,
    tema: "O instinto não desaparece",
    portal: {
      titulo: "O Fogo Sob a Cinza",
      texto: "Você pode enterrar o que é vivo, mas não pode matá-lo. \nO instinto permanece pulsando no escuro, esperando o oxigênio. \nEsta semana é sobre localizar o que ainda queima em você."
    },
    escuta: {
      roteiro: "Sinta seu sangue. Ele carrega a memória de mil gerações que sobreviveram. O instinto é sua bússola biológica. Ele avisa quando o perigo é real e quando a comida é boa. Reative seus sentidos: o que você cheira? O que você intui agora?"
    },
    aplicacao: {
      acao: "Siga um impulso intuitivo simples hoje (mudar o caminho, ligar para alguém, parar o que está fazendo). Valide sua 'vontade súbita' sem racionalizar."
    },
    registro: {
      pergunta: "O que em você se recusa a morrer, mesmo após tantas tentativas de controle?"
    },
    integracao: {
      sintese: "O selvagem é resiliente; ele apenas aguarda permissão para agir.",
      fraseSemente: "Meu instinto é minha bússola fiel."
    },
    impacto: {
      distrito: "instinto",
      tipo: "ativação",
      intensidade: 3
    },
    proximoPasso: "O primeiro reconhecimento"
  },
  {
    id: 4,
    tema: "O primeiro reconhecimento",
    portal: {
      titulo: "O Encontro no Espelho",
      texto: "O chamado termina onde o reconhecimento começa. \nReconhecer a Mulher Selvagem em si não é um ato de intelecto, é de sangue. \nVocê chegou ao final do primeiro ciclo: a percepção da própria força."
    },
    escuta: {
      roteiro: "Olhe para suas mãos. Elas são ferramentas de criação e defesa. Olhe para sua história: você sobreviveu. O reconhecimento é o abraço entre quem você se tornou e quem você sempre foi. Não há mais volta, o chamado foi atendido."
    },
    aplicacao: {
      acao: "Faça um pequeno ritual de marcação: escreva sua frase-semente favorita em um lugar visível ou use um objeto que symbolize sua força retomada."
    },
    registro: {
      pergunta: "Quem é você agora que a loba começou a uivar de volta?"
    },
    integracao: {
      sintese: "O reconhecimento é o portal definitivo para a autonomia simbólica.",
      fraseSemente: "Eu reconheço minha natureza e ela me reconhece."
    },
    impacto: {
      distrito: "vínculo",
      tipo: "estabilização",
      intensidade: 2
    }
  }
];

export function RotaExecutavelMes1() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-2">
        <Badge variant="outline" className="text-[9px] uppercase tracking-widest border-primary/30 text-primary/70">
          Mês 1 — O Chamado Selvagem
        </Badge>
        <h2 className="font-display text-2xl text-foreground">Rotas da Jornada</h2>
        <p className="text-xs text-muted-foreground/60 max-w-xs mx-auto">
          Quatro caminhos para despertar o que foi silenciado e retomar sua rota original.
        </p>
      </div>

      <div className="space-y-6">
        {rotasMes1.map((rota, idx) => (
          <Card key={rota.id} className="border-primary/10 bg-card/40 backdrop-blur-sm overflow-hidden group">
            <CardContent className="p-0">
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-tighter text-primary/50 font-bold">
                      Rota 0{rota.id}
                    </p>
                    <h3 className="text-lg font-display text-foreground group-hover:text-primary transition-colors">
                      {rota.tema}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                    <span className="text-sm font-bold text-primary/40">{rota.id}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 p-1.5 rounded bg-gold/10">
                      <BookOpen className="w-3.5 h-3.5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">{rota.portal.titulo}</h4>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed whitespace-pre-line">
                        {rota.portal.texto}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/5">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Escuta</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/80 italic leading-relaxed">
                        "{rota.escuta.roteiro}"
                      </p>
                    </div>

                    <div className="space-y-2 p-3 rounded-lg bg-gold/5 border border-gold/5">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-3.5 h-3.5 text-gold/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gold/60">Aplicação</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                        {rota.aplicacao.acao}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary" className="bg-muted/30 text-[9px] uppercase tracking-tighter flex gap-1.5 items-center">
                      <Zap className="w-3 h-3 text-gold" />
                      Impacto: {rota.impacto.distrito} (+{rota.impacto.intensidade})
                    </Badge>
                    <Badge variant="secondary" className="bg-muted/30 text-[9px] uppercase tracking-tighter flex gap-1.5 items-center">
                      <Lightbulb className="w-3 h-3 text-primary" />
                      {rota.impacto.tipo}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-primary/5">
                  <div className="space-y-0.5">
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 font-bold">Frase-Semente</p>
                    <p className="text-xs font-medium text-primary/80">"{rota.integracao.fraseSemente}"</p>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 gap-2 text-[10px] uppercase tracking-widest font-bold text-primary group-hover:bg-primary/5">
                    Explorar
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {rota.proximoPasso && (
                <div className="bg-primary/5 px-5 py-2 flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-widest text-primary/40 font-bold">Próximo Passo</p>
                  <p className="text-[9px] font-bold text-primary/60">{rota.proximoPasso}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
