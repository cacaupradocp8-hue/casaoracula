// ============================================
// MAPA PROFISSIONAL — DASHBOARD CLÍNICO
// Evolução longitudinal + dados clínicos
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

interface MapaProfissionalProps {
  fasesAtravessadas: LabirintoFase[];
  todasFases: LabirintoFase[];
  camposClinicos?: {
    nomeCliente: string;
    observacoesClinicas: string;
    hipoteseTerapeutica: string;
    crencaCentral?: string;
    emocaoDominante?: string;
    padraoDefensivo?: string;
    direcionamento?: string;
  };
}

export function MapaProfissional({ fasesAtravessadas, todasFases, camposClinicos }: MapaProfissionalProps) {
  const progresso = todasFases.length > 0
    ? Math.round((fasesAtravessadas.length / todasFases.length) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* Cliente header */}
      {camposClinicos?.nomeCliente && (
        <div className="flex items-center gap-2 pb-3 border-b border-gold/10">
          <Stethoscope className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-foreground">{camposClinicos.nomeCliente}</span>
        </div>
      )}

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Evolução da Jornada</span>
          <span>{fasesAtravessadas.length}/{todasFases.length} portas ({progresso}%)</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {todasFases.map((fase) => {
          const atravessada = fasesAtravessadas.some(f => f.id === fase.id);
          return (
            <div
              key={fase.id}
              className={`flex items-center gap-3 py-2 px-3 rounded text-sm ${
                atravessada
                  ? "bg-gold/5 border border-gold/20"
                  : "opacity-40"
              }`}
            >
              <span className="text-base w-6 text-center">{fase.icone || "○"}</span>
              <span className="flex-1">{fase.nome}</span>
              {atravessada && <span className="text-gold text-xs font-medium">Ativada</span>}
            </div>
          );
        })}
      </div>

      {/* Clinical data summary */}
      {camposClinicos && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gold/10">
          {camposClinicos.crencaCentral && (
            <ClinicalField label="Crença central" value={camposClinicos.crencaCentral} />
          )}
          {camposClinicos.emocaoDominante && (
            <ClinicalField label="Emoção dominante" value={camposClinicos.emocaoDominante} />
          )}
          {camposClinicos.padraoDefensivo && (
            <ClinicalField label="Padrão defensivo" value={camposClinicos.padraoDefensivo} />
          )}
          {camposClinicos.direcionamento && (
            <ClinicalField label="Direcionamento" value={camposClinicos.direcionamento} />
          )}
          {camposClinicos.observacoesClinicas && (
            <div className="sm:col-span-2">
              <ClinicalField label="Observações clínicas" value={camposClinicos.observacoesClinicas} />
            </div>
          )}
          {camposClinicos.hipoteseTerapeutica && (
            <div className="sm:col-span-2">
              <ClinicalField label="Hipótese terapêutica" value={camposClinicos.hipoteseTerapeutica} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClinicalField({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-gold/10 bg-card/20">
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm text-foreground/80">{value}</p>
      </CardContent>
    </Card>
  );
}
