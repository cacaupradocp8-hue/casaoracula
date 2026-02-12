// ============================================
// GUIA DA TERAPEUTA — MODO PROFISSIONAL EXCLUSIVO
// 5 protocolos clínicos + indicações por faixa + segurança
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Map, 
  Shield,
  AlertTriangle,
  Layers,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ROTEIRO_CLINICO_BASE,
  ESTRUTURA_GRUPO_BASE,
  INDICACOES_POR_FAIXA,
  CRITERIOS_SEGURANCA,
  CONSTELACAO_ORIENTACAO,
} from "../../data/protocolosClinicosPorta";

const PROTOCOLOS = [
  {
    id: "individual",
    titulo: "Roteiro de Aplicação Individual (45–60min)",
    icone: BookOpen,
    descricao: "Sessão individual completa com as cartas do Labirinto como dispositivo terapêutico.",
    etapas: ROTEIRO_CLINICO_BASE.map((texto) => {
      const [titulo, ...resto] = texto.split(" — ");
      return { tempo: "", titulo: titulo.trim(), descricao: resto.join(" — ").trim() };
    }),
  },
  {
    id: "grupo",
    titulo: "Estrutura Fixa de Grupo (90–120min)",
    icone: Users,
    descricao: "Estrutura replicável para todas as Portas: grupos terapêuticos, círculos, formações e constelação simbólica.",
    etapas: ESTRUTURA_GRUPO_BASE,
  },
  {
    id: "constelacao",
    titulo: "Uso em Constelação Simbólica",
    icone: Sparkles,
    descricao: "As cartas como representantes em dinâmicas constelativas.",
    etapas: [
      { tempo: "", titulo: "Campo-tema", descricao: CONSTELACAO_ORIENTACAO.campo },
      { tempo: "", titulo: "Exercício preparatório", descricao: CONSTELACAO_ORIENTACAO.exercicio },
      { tempo: "", titulo: "Ancoragem pós-campo", descricao: CONSTELACAO_ORIENTACAO.ritual },
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
      { tempo: "", titulo: "Postura da Terapeuta", descricao: "Não interprete as cartas pela cliente. Não use linguagem diagnóstica. Sua função é sustentar, não conduzir." },
      { tempo: "", titulo: "Tempo e Ritmo", descricao: "Respeite o tempo de cada travessia. Não há pressa. Uma porta pode levar uma sessão inteira ou apenas um respiro." },
      { tempo: "", titulo: "Registros", descricao: "Mantenha registro clínico separado do registro ritual. O que a cliente escreve é dela. O que você observa é seu instrumento." },
      { tempo: "", titulo: "Limites Éticos", descricao: "Não substitua tratamento clínico convencional. Contraindicado em crises agudas sem suporte adequado. Encaminhe quando necessário." },
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

      {/* Indicações clínicas por faixa */}
      <Card className="border-gold/20 bg-card/30">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-gold" />
            <span className="font-medium text-sm">Indicações Clínicas por Faixa</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INDICACOES_POR_FAIXA.map((faixa) => (
              <div key={faixa.faixa} className="py-2 px-3 rounded bg-card/20 border border-gold/10">
                <span className="text-xs text-gold font-mono">{faixa.faixa}</span>
                <p className="text-xs font-medium text-foreground">{faixa.label}</p>
                <p className="text-[11px] text-muted-foreground">{faixa.descricao}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critérios de segurança */}
      <div className="flex items-start gap-2 py-3 px-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-amber-500">Critérios de Segurança Obrigatórios</p>
          {CRITERIOS_SEGURANCA.map((criterio, i) => (
            <p key={i} className="text-[11px] text-amber-500/80 leading-relaxed">• {criterio}</p>
          ))}
        </div>
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
