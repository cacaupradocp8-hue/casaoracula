// ============================================
// GUIA DA TERAPEUTA — MODO PROFISSIONAL EXCLUSIVO
// 5 protocolos clínicos expandidos
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Map, 
  Shield,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PROTOCOLOS = [
  {
    id: "individual",
    titulo: "Roteiro de Aplicação Individual (60min)",
    icone: BookOpen,
    descricao: "Sessão individual completa com as cartas do Labirinto como dispositivo terapêutico.",
    etapas: [
      { tempo: "10min", titulo: "Acolhimento e Presença", descricao: "Receba a cliente em silêncio. Conduza 3 respirações profundas. Pergunte: 'Como você chega hoje?'" },
      { tempo: "5min", titulo: "Apresentação das Cartas", descricao: "Disponha as 14 cartas voltadas para baixo. Peça que a cliente escolha com a mão não-dominante, sem racionalizar." },
      { tempo: "5min", titulo: "Revelação e Leitura", descricao: "A cliente vira a carta. Leia o texto oracular em voz alta, lentamente. Observe reações corporais." },
      { tempo: "20min", titulo: "Exercício do Caderno", descricao: "Conduza o exercício correspondente à porta revelada. Guie as 3 perguntas de aprofundamento. Permita pausas longas." },
      { tempo: "10min", titulo: "Registro da Travessia", descricao: "A cliente escreve livremente: O que fez? O que percebeu? Registre observações clínicas em paralelo." },
      { tempo: "10min", titulo: "Fechamento Ritual", descricao: "Peça que a cliente nomeie uma palavra-síntese. Encerre com gesto simbólico de fechamento (mãos no coração)." },
    ],
  },
  {
    id: "grupo",
    titulo: "Roteiro de Aplicação em Grupo (2h)",
    icone: Users,
    descricao: "Facilitação grupal com o Labirinto como eixo simbólico do encontro.",
    etapas: [
      { tempo: "15min", titulo: "Abertura em Círculo", descricao: "Forme o círculo. Cada participante diz seu nome e uma palavra sobre como chega. Acenda vela central se possível." },
      { tempo: "10min", titulo: "Apresentação do Labirinto", descricao: "Explique brevemente a estrutura das 14 portas. Não revele conteúdo — apenas a intenção da travessia." },
      { tempo: "10min", titulo: "Escolha Individual", descricao: "Cada participante escolhe sua carta em silêncio. As cartas podem ser compartilhadas ou individuais." },
      { tempo: "30min", titulo: "Travessia em Silêncio", descricao: "Cada uma lê sua carta, realiza o exercício e registra. A facilitadora circula em silêncio, disponível mas não invasiva." },
      { tempo: "30min", titulo: "Partilha no Círculo", descricao: "Cada participante compartilha o que deseja. Regra de ouro: escuta sem comentário ou conselho. Apenas presença." },
      { tempo: "15min", titulo: "Integração Coletiva", descricao: "Pergunte ao grupo: 'O que o Labirinto nos revelou como corpo coletivo?' Registre palavras-chave no centro." },
      { tempo: "10min", titulo: "Fechamento Ritual", descricao: "Cada participante diz uma palavra de encerramento. Sopre a vela juntas. Agradeça o círculo." },
    ],
  },
  {
    id: "constelacao",
    titulo: "Uso em Constelação Simbólica",
    icone: Sparkles,
    descricao: "As cartas como representantes em dinâmicas constelativas.",
    etapas: [
      { tempo: "", titulo: "Preparação do Campo", descricao: "Disponha as 14 cartas em círculo no chão. O centro representa o Self. Peça à cliente que entre no campo." },
      { tempo: "", titulo: "Escolha por Ressonância", descricao: "A cliente caminha pelo campo e para diante das cartas que 'chamam'. Observe qual porta atrai e qual repele." },
      { tempo: "", titulo: "Posicionamento", descricao: "A cliente posiciona as cartas escolhidas no campo como representantes de forças psíquicas. Não interprete — observe." },
      { tempo: "", titulo: "Movimento Simbólico", descricao: "Pergunte: 'Se essa carta pudesse se mover, para onde iria?' Permita reorganizações espontâneas." },
      { tempo: "", titulo: "Leitura do Campo", descricao: "Ao final, leia o campo como um mapa: proximidades, distâncias, eixos de tensão. A cliente nomeia o que vê." },
    ],
  },
  {
    id: "mapa",
    titulo: "Ritual do Mapa Pessoal da Heroína",
    icone: Map,
    descricao: "Construção do mapa pessoal da jornada com as cartas já atravessadas.",
    etapas: [
      { tempo: "", titulo: "Recolhimento das Cartas", descricao: "Reúna todas as cartas já atravessadas pela cliente ao longo do processo. Disponha-as desordenadas sobre a mesa." },
      { tempo: "", titulo: "Organização Livre", descricao: "Peça que a cliente organize as cartas na ordem que faz sentido para ELA — não na ordem numérica. Seu mapa é único." },
      { tempo: "", titulo: "Nomeação da Jornada", descricao: "A cliente dá um nome à sua jornada. Escreva-o no topo do mapa. Pergunte: 'Que mulher começou? Que mulher está aqui?'" },
      { tempo: "", titulo: "Registro e Exportação", descricao: "Fotografe ou exporte o mapa. Esse registro é a cartografia viva da transformação." },
    ],
  },
  {
    id: "postura",
    titulo: "Orientações de Condução",
    icone: Shield,
    descricao: "Diretrizes éticas, posturais e limites do uso clínico.",
    etapas: [
      { tempo: "", titulo: "Postura da Terapeuta", descricao: "Não interprete as cartas pela cliente. Não use linguagem diagnóstica. Sua função é sustentar, não conduzir. A heroína faz sua própria travessia." },
      { tempo: "", titulo: "Tempo e Ritmo", descricao: "Respeite o tempo de cada travessia. Não há pressa. Uma porta pode levar uma sessão inteira ou apenas um respiro. Confie no processo." },
      { tempo: "", titulo: "Registros", descricao: "Mantenha registro clínico separado do registro ritual. O que a cliente escreve é dela. O que você observa é seu instrumento." },
      { tempo: "", titulo: "Limites Éticos", descricao: "Não substitua tratamento clínico convencional. Contraindicado em crises agudas sem suporte adequado. Não use como ferramenta diagnóstica. Encaminhe quando necessário." },
      { tempo: "", titulo: "Formação", descricao: "O uso profissional do Labirinto requer formação no Método Orácula. Respeite os limites da sua formação e experiência clínica." },
    ],
  },
];

export function GuiaTerapeutaTab() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-gold">
          Guia da Terapeuta
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Protocolos e roteiros para uso clínico do Labirinto da Heroína Interna®.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {PROTOCOLOS.map((protocolo) => {
          const Icon = protocolo.icone;
          return (
            <AccordionItem
              key={protocolo.id}
              value={protocolo.id}
              className="border border-gold/20 rounded-lg px-4 bg-card/30"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <Icon className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{protocolo.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{protocolo.descricao}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-3">
                  {protocolo.etapas.map((etapa, i) => (
                    <Card key={i} className="border-gold/10 bg-card/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-xs text-gold font-medium">
                              {i + 1}
                            </span>
                            {etapa.tempo && (
                              <span className="text-xs text-gold/60 font-mono">{etapa.tempo}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{etapa.titulo}</p>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {etapa.descricao}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
