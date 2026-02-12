// ============================================
// GUIA DA TERAPEUTA — MODO PROFISSIONAL EXCLUSIVO
// 6 protocolos e roteiros para suporte clínico
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Sparkles, 
  Map, 
  Shield, 
  AlertTriangle 
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
    titulo: "Protocolo Individual (60min)",
    icone: BookOpen,
    descricao: "Roteiro para sessão individual utilizando as cartas do Labirinto como dispositivo terapêutico.",
    conteudo: "Acolhimento (10min) → Escolha da Carta (5min) → Leitura e Reflexão Guiada (20min) → Registro da Travessia (15min) → Fechamento Ritual (10min)",
  },
  {
    id: "grupo",
    titulo: "Protocolo de Grupo (2h)",
    icone: Users,
    descricao: "Roteiro para facilitação grupal com o Labirinto como eixo simbólico do encontro.",
    conteudo: "Abertura em Círculo (15min) → Apresentação do Labirinto (10min) → Escolha Individual de Cartas (10min) → Travessia em Silêncio (30min) → Partilha no Círculo (30min) → Integração e Registro (15min) → Fechamento Ritual (10min)",
  },
  {
    id: "constelacao",
    titulo: "Constelação Simbólica",
    icone: Sparkles,
    descricao: "Como usar as cartas do Labirinto como representantes em dinâmicas constelativas.",
    conteudo: "As cartas podem ser posicionadas no campo como representantes de forças psíquicas, fases da jornada ou aspectos da heroína interna. Observe os movimentos e ressonâncias sem interpretar.",
  },
  {
    id: "mapa",
    titulo: "Ritual do Mapa",
    icone: Map,
    descricao: "Protocolo para construção do mapa pessoal da jornada com as cartas já atravessadas.",
    conteudo: "A cliente dispõe as cartas já atravessadas na ordem que faz sentido para ela, criando seu próprio mapa da jornada. Não há ordem certa — o mapa revela o caminho único de cada heroína.",
  },
  {
    id: "postura",
    titulo: "Postura Profissional",
    icone: Shield,
    descricao: "Diretrizes éticas e posturais para o uso do Labirinto em contexto clínico.",
    conteudo: "• Não interpretar as cartas pela cliente\n• Não usar linguagem diagnóstica\n• Respeitar o tempo de cada travessia\n• Manter registro clínico separado do registro ritual\n• Não forçar associações ou insights",
  },
  {
    id: "limites",
    titulo: "Limites Éticos",
    icone: AlertTriangle,
    descricao: "Contraindicações e limites do uso terapêutico do Labirinto.",
    conteudo: "• Não substituir tratamento clínico convencional\n• Contraindicado em crises agudas sem suporte adequado\n• Não usar como ferramenta diagnóstica\n• Respeitar limites de formação profissional\n• Encaminhar quando necessário",
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
                <Card className="border-gold/10 bg-card/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                      {protocolo.conteudo}
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
