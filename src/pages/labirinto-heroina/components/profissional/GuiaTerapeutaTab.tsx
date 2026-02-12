// ============================================
// GUIA DA TERAPEUTA — MODO PROFISSIONAL EXCLUSIVO
// Guia Clínico + Manual Ético do Labirinto da Heroína Interna®
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
  FileText,
  CheckSquare,
  Heart,
  XCircle,
  ScrollText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ROTEIRO_CLINICO_BASE,
  ESTRUTURA_GRUPO_BASE,
  INDICACOES_POR_FAIXA,
  CRITERIOS_SEGURANCA,
  CONSTELACAO_ORIENTACAO,
} from "../../data/protocolosClinicosPorta";

// ─────────── GUIA CLÍNICO (PARTE II) ───────────

const PROTOCOLOS = [
  {
    id: "individual",
    titulo: "Roteiro de Sessão Individual (60 min)",
    icone: BookOpen,
    descricao: "Sessão individual completa com as cartas do Labirinto como dispositivo terapêutico.",
    etapas: ROTEIRO_CLINICO_BASE.map((texto) => {
      const [titulo, ...resto] = texto.split(" — ");
      return { tempo: "", titulo: titulo.trim(), descricao: resto.join(" — ").trim() };
    }),
  },
  {
    id: "grupo",
    titulo: "Roteiro de Grupo Terapêutico (2h)",
    icone: Users,
    descricao: "Estrutura replicável para todas as Portas: grupos terapêuticos, círculos e formações.",
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
    titulo: "Leitura do Mapa da Heroína",
    icone: Map,
    descricao: "Construção e leitura do mapa pessoal da jornada com as cartas já atravessadas.",
    etapas: [
      { tempo: "", titulo: "Recolhimento das Cartas", descricao: "Reúna todas as cartas já atravessadas pela cliente ao longo do processo. Disponha-as desordenadas sobre a mesa." },
      { tempo: "", titulo: "Organização Livre", descricao: "Peça que a cliente organize as cartas na ordem que faz sentido para ELA — não na ordem numérica. Seu mapa é único." },
      { tempo: "", titulo: "Nomeação da Jornada", descricao: "A cliente dá um nome à sua jornada. Escreva-o no topo do mapa. Pergunte: 'Que mulher começou? Que mulher está aqui?'" },
      { tempo: "", titulo: "Registro e Exportação", descricao: "Fotografe ou exporte o mapa. Esse registro é a cartografia viva da transformação." },
    ],
  },
];

const QUANDO_USAR = [
  "Início de processo terapêutico — como ferramenta de abertura e mapeamento.",
  "Processos de transição de vida — mudanças de carreira, maternidade, luto, separação.",
  "Trabalho com identidade feminina — individuação, autoridade, criatividade.",
  "Grupos terapêuticos e círculos de mulheres — estrutura replicável.",
  "Supervisão clínica — como instrumento de leitura simbólica do caso.",
  "Constelação simbólica — as cartas como representantes no campo.",
];

const INDICACOES = [
  "Mulheres em processo de autoconhecimento com acompanhamento profissional.",
  "Terapeutas com formação no Método Orácula® ou equivalente simbólico.",
  "Grupos com contrato terapêutico prévio e facilitadora experiente.",
];

const CONTRAINDICACOES = [
  "Crises psiquiátricas agudas sem suporte médico.",
  "Luto recente (menos de 30 dias) para portas de descida (P5–P6, P8–P9).",
  "Ausência de vínculo terapêutico para portas de alta intensidade.",
  "Uso recreativo ou fora de contexto de cuidado profissional.",
  "Substituição de tratamento psicológico ou médico convencional.",
];

const ERROS_COMUNS = [
  { erro: "Interpretar a carta pela cliente", correcao: "Pergunte: 'O que você vê?' — a leitura é sempre de quem atravessa." },
  { erro: "Apressar a travessia", correcao: "Uma porta pode levar uma sessão inteira ou apenas um respiro. Respeite o tempo." },
  { erro: "Usar linguagem diagnóstica", correcao: "Substitua por linguagem simbólica: 'O que o corpo diz?' em vez de 'Você está dissociando.'" },
  { erro: "Forçar revelações", correcao: "O silêncio é parte da travessia. Não insista se a cliente não quer falar." },
  { erro: "Romantizar a dor", correcao: "A dor não é prêmio. Não diga 'que lindo' para sofrimento." },
  { erro: "Pular a integração corporal", correcao: "NUNCA encerre sem gesto de retorno ao corpo. É inegociável." },
  { erro: "Usar cartas como diagnóstico", correcao: "O Labirinto não é psicodiagnóstico. É dispositivo de escuta e integração." },
  { erro: "Avançar sem checagem de recursos", correcao: "Antes das portas P5–P9, checar: rede de apoio, recursos internos, plano de contenção." },
];

const CHECKLIST_POS_SESSAO = [
  "Integração corporal realizada?",
  "Cliente estável ao sair?",
  "Registro clínico separado do registro ritual?",
  "Micro-ação definida e acordada?",
  "Próxima sessão agendada (se aplicável)?",
  "Orientação de autocuidado fornecida?",
  "Necessidade de contato antes da próxima sessão?",
  "Encaminhamento necessário?",
];

// ─────────── MANUAL ÉTICO (PARTE III) ───────────

const PRINCIPIOS_ETICOS = [
  { principio: "O Labirinto não substitui psicoterapia ou tratamento médico", descricao: "É instrumento de escuta simbólica, não de diagnóstico ou tratamento. Encaminhe quando necessário." },
  { principio: "Não induzir interpretações", descricao: "A leitura é da cliente. A terapeuta sustenta, não conduz. Pergunte em vez de afirmar." },
  { principio: "Não romantizar dor", descricao: "Sofrimento não é prêmio. Acolha sem glamourizar. A travessia é integração, não espetáculo." },
  { principio: "Não forçar revelações", descricao: "O silêncio é parte legítima da travessia. Respeite o que não é dito." },
  { principio: "Respeitar tempo psíquico", descricao: "Cada cliente tem seu ritmo. Não apresse portas, não force descidas, não imponha integrações." },
  { principio: "Não usar cartas como diagnóstico fechado", descricao: "O Labirinto é dispositivo de processo, não de classificação. Nunca diga 'você é essa porta'." },
  { principio: "Garantir sigilo absoluto", descricao: "O que acontece na travessia é confidencial. Em grupos, o contrato de sigilo é obrigatório." },
  { principio: "Uso em grupo exige contrato simbólico prévio", descricao: "Antes de qualquer grupo, estabeleça regras claras: escuta sem julgamento, confidencialidade, voluntariedade." },
  { principio: "Em caso de dissociação → interromper", descricao: "Se a cliente apresentar sinais de dissociação, interrompa a travessia, ative recursos de ancoragem e avalie encaminhamento." },
  { principio: "A terapeuta não é oráculo da vida da cliente", descricao: "Sua função é sustentar o campo e facilitar a escuta. A sabedoria é da cliente, não da facilitadora." },
];

const CLAUSULA_CHAVE = "O Labirinto da Heroína Interna® é um instrumento simbólico de escuta e integração — não de previsão, julgamento ou controle.";

const ENCERRAMENTO_ETICO = [
  "A terapeuta que utiliza o Labirinto da Heroína Interna® compromete-se com a integridade do método e o respeito à dignidade de cada mulher que atravessa.",
  "O uso profissional requer formação no Método Orácula® e supervisão clínica contínua.",
  "A certificação implica adesão ao código ético do método e às diretrizes de segurança clínica.",
  "A facilitadora reconhece os limites da sua atuação e sabe encaminhar quando necessário.",
];

// ─────────── COMPONENTE PRINCIPAL ───────────

export function GuiaTerapeutaTab() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-gold">
          📘 Guia Clínico do Labirinto da Heroína Interna®
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Protocolos, roteiros e manual ético para uso clínico profissional.
        </p>
      </div>

      <Tabs defaultValue="guia" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="guia" className="gap-2 text-xs sm:text-sm">
            <FileText className="w-4 h-4" />
            Guia Clínico
          </TabsTrigger>
          <TabsTrigger value="etica" className="gap-2 text-xs sm:text-sm">
            <ScrollText className="w-4 h-4" />
            Manual Ético
          </TabsTrigger>
        </TabsList>

        {/* ═══════ ABA: GUIA CLÍNICO ═══════ */}
        <TabsContent value="guia" className="space-y-6">
          {/* Apresentação */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Apresentação do Método</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                O Labirinto da Heroína Interna® é um instrumento clínico baseado na jornada da heroína (Maureen Murdock), estruturado em 14 Portas que mapeiam o processo de individuação feminina. Cada porta contém um exercício central (Pareto 80/20), uma pergunta terapêutica-chave e um ritual de integração. O método aplica princípios de Autoeficácia (Bandura) e Andragogia (aprendizagem adulta) para garantir experiência vivida, não teórica.
              </p>
            </CardContent>
          </Card>

          {/* Quando Usar */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Quando Usar o Labirinto</span>
              </div>
              <div className="space-y-1.5">
                {QUANDO_USAR.map((item, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {item}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Indicações e Contraindicações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-green-500/20 bg-card/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-sm text-green-500">Indicações</span>
                </div>
                <div className="space-y-1.5">
                  {INDICACOES.map((item, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed">✓ {item}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-500/20 bg-card/30">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="font-medium text-sm text-red-500">Contraindicações</span>
                </div>
                <div className="space-y-1.5">
                  {CONTRAINDICACOES.map((item, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed">✗ {item}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicações por faixa */}
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

          {/* Protocolos em accordion */}
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

          {/* Erros Comuns */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Erros Comuns de Condução</span>
              </div>
              <div className="space-y-2">
                {ERROS_COMUNS.map((item, i) => (
                  <div key={i} className="py-2 px-3 rounded bg-card/20 border border-gold/10">
                    <p className="text-xs font-medium text-red-400">✗ {item.erro}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">→ {item.correcao}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Checklist Pós-Sessão */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckSquare className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Checklist Pós-Sessão</span>
              </div>
              <div className="space-y-1.5">
                {CHECKLIST_POS_SESSAO.map((item, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">☐ {item}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════ ABA: MANUAL ÉTICO ═══════ */}
        <TabsContent value="etica" className="space-y-6">
          {/* Cláusula-chave */}
          <Card className="border-gold/30 bg-gold/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-gold italic leading-relaxed">
                "{CLAUSULA_CHAVE}"
              </p>
            </CardContent>
          </Card>

          {/* Princípios Éticos */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Princípios Éticos Fundamentais</span>
              </div>
              <Accordion type="multiple" className="space-y-2">
                {PRINCIPIOS_ETICOS.map((item, i) => (
                  <AccordionItem key={i} value={`etico-${i}`} className="border border-gold/10 rounded-lg px-3 bg-card/20">
                    <AccordionTrigger className="hover:no-underline py-2.5">
                      <div className="flex items-center gap-2 text-left">
                        <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-[10px] text-gold font-medium shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-xs font-medium text-foreground">{item.principio}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                        {item.descricao}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Encerramento Ético */}
          <Card className="border-gold/20 bg-card/30">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <ScrollText className="w-4 h-4 text-gold" />
                <span className="font-medium text-sm">Encerramento Ético</span>
              </div>
              <div className="space-y-2">
                {ENCERRAMENTO_ETICO.map((item, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Segurança final */}
          <div className="flex items-start gap-2 py-3 px-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-500">Lembrete Final de Segurança</p>
              <p className="text-[11px] text-amber-500/80 leading-relaxed">
                Este documento é parte integrante da certificação no Método Orácula®. O uso do Labirinto da Heroína Interna® sem formação adequada compromete a segurança da cliente e a integridade do método.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
