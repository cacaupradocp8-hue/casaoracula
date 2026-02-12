// ============================================
// ROTEIRO CLÍNICO POR PORTA — MODO PROFISSIONAL
// Exibe: versão grupo + roteiro clínico + indicações + segurança
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, AlertTriangle, Sparkles, Shield } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PROTOCOLOS_POR_PORTA } from "../../data/protocolosClinicosPorta";

interface RoteiroClincoPortaProps {
  faseName: string;
}

export function RoteiroClinicoPorta({ faseName }: RoteiroClincoPortaProps) {
  const protocolo = PROTOCOLOS_POR_PORTA[faseName];

  if (!protocolo) return null;

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="w-5 h-5 text-gold" />
          Protocolo Clínico — {faseName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-3">
          {/* Versão Grupo */}
          <AccordionItem value="grupo" className="border border-gold/15 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-left">
                <Users className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-sm">Aplicação em Grupo</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {protocolo.orientacaoGrupo}
              </p>
              <div className="space-y-2">
                {protocolo.etapasGrupo.map((etapa, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 px-3 rounded bg-card/20 border border-gold/10">
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-[10px] text-gold font-medium">
                        {i + 1}
                      </span>
                      {etapa.tempo && (
                        <span className="text-[10px] text-gold/50 font-mono">{etapa.tempo}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{etapa.titulo}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{etapa.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gold/10">
                <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                  <strong>Regras do círculo:</strong> Nenhuma participante interpreta a fala da outra. A facilitadora costura, não explica. O foco é vivência, não debate.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Roteiro Clínico */}
          <AccordionItem value="roteiro" className="border border-gold/15 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-left">
                <Sparkles className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-sm">Roteiro Clínico (Individual)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-2">
                {protocolo.roteiroClinico.map((etapa, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-gold/60 shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-muted-foreground leading-relaxed">{etapa}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-gold/10 flex gap-4 text-[10px] text-muted-foreground/50">
                <span>Individual: 45–60min</span>
                <span>Grupo: 90–120min</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Indicações Clínicas */}
          <AccordionItem value="indicacoes" className="border border-gold/15 rounded-lg px-4 bg-card/30">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2 text-left">
                <Shield className="w-4 h-4 text-gold shrink-0" />
                <span className="font-medium text-sm">Indicações e Segurança</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-3">
              <div className="space-y-2">
                <IndicacaoItem label="Quando usar" value={protocolo.indicacao.quandoUsar} />
                <IndicacaoItem label="Cuidados" value={protocolo.indicacao.cuidados} />
                <IndicacaoItem label="Constelação simbólica" value={protocolo.indicacao.constelacao} />
              </div>

              {/* Safety alert */}
              <div className="flex items-start gap-2 py-2 px-3 rounded bg-amber-500/5 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-500/80 leading-relaxed">
                  {protocolo.seguranca}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

function IndicacaoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-1.5 px-3 rounded bg-card/20 border border-gold/10">
      <p className="text-[10px] text-gold/60 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{value}</p>
    </div>
  );
}
