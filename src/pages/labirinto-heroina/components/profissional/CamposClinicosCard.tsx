// ============================================
// CAMPOS CLÍNICOS — MODO PROFISSIONAL
// Ficha completa: Nome, Observações, Hipótese, Emoção, Padrão, Direcionamento, Micro-ação
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";

export interface CamposClinicosData {
  nomeCliente: string;
  observacoesClinicas: string;
  hipoteseTerapeutica: string;
  emocaoDominante: string;
  padraoDefensivo: string;
  direcionamentoTerapeutico: string;
  microAcaoDefinida: string;
}

interface CamposClinicosCardProps {
  campos: CamposClinicosData;
  onChange: (field: keyof CamposClinicosData, value: string) => void;
  compact?: boolean;
}

export function CamposClinicosCard({ campos, onChange, compact = false }: CamposClinicosCardProps) {
  return (
    <Card className="border-gold/20 bg-card/50">
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Stethoscope className="w-5 h-5 text-gold" />
          Ficha Clínica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1.5">
            Nome da Cliente
          </label>
          <Input
            value={campos.nomeCliente}
            onChange={(e) => onChange("nomeCliente", e.target.value)}
            placeholder="Nome ou codinome da cliente"
            className="bg-card/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">
              Emoção Dominante
            </label>
            <Input
              value={campos.emocaoDominante}
              onChange={(e) => onChange("emocaoDominante", e.target.value)}
              placeholder="Ex: vergonha, raiva contida"
              className="bg-card/50"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">
              Padrão Defensivo
            </label>
            <Input
              value={campos.padraoDefensivo}
              onChange={(e) => onChange("padraoDefensivo", e.target.value)}
              placeholder="Ex: evitação, racionalização"
              className="bg-card/50"
            />
          </div>
        </div>

        {!compact && (
          <>
            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">
                Observações Clínicas
              </label>
              <Textarea
                value={campos.observacoesClinicas}
                onChange={(e) => onChange("observacoesClinicas", e.target.value)}
                placeholder="Observações relevantes sobre o processo..."
                rows={3}
                className="bg-card/50"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">
                Hipótese Terapêutica
              </label>
              <Textarea
                value={campos.hipoteseTerapeutica}
                onChange={(e) => onChange("hipoteseTerapeutica", e.target.value)}
                placeholder="Hipótese terapêutica e direção do trabalho..."
                rows={3}
                className="bg-card/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">
                  Direcionamento Terapêutico
                </label>
                <Input
                  value={campos.direcionamentoTerapeutico}
                  onChange={(e) => onChange("direcionamentoTerapeutico", e.target.value)}
                  placeholder="Ex: trabalhar vínculo, ampliar..."
                  className="bg-card/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">
                  Micro-ação Acordada
                </label>
                <Input
                  value={campos.microAcaoDefinida}
                  onChange={(e) => onChange("microAcaoDefinida", e.target.value)}
                  placeholder="Ação prática definida para a semana"
                  className="bg-card/50"
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
