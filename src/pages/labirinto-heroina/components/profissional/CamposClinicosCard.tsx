// ============================================
// CAMPOS CLÍNICOS — MODO PROFISSIONAL
// Nome da Cliente, Observações Clínicas, Hipótese Terapêutica
// ============================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Stethoscope } from "lucide-react";

interface CamposClinicosCardProps {
  nomeCliente: string;
  observacoesClinicas: string;
  hipoteseTerapeutica: string;
  onChangeNomeCliente: (value: string) => void;
  onChangeObservacoes: (value: string) => void;
  onChangeHipotese: (value: string) => void;
}

export function CamposClinicosCard({
  nomeCliente,
  observacoesClinicas,
  hipoteseTerapeutica,
  onChangeNomeCliente,
  onChangeObservacoes,
  onChangeHipotese,
}: CamposClinicosCardProps) {
  return (
    <Card className="border-gold/20 bg-card/50">
      <CardHeader>
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
            value={nomeCliente}
            onChange={(e) => onChangeNomeCliente(e.target.value)}
            placeholder="Nome ou codinome da cliente"
            className="bg-card/50"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-1.5">
            Observações Clínicas
          </label>
          <Textarea
            value={observacoesClinicas}
            onChange={(e) => onChangeObservacoes(e.target.value)}
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
            value={hipoteseTerapeutica}
            onChange={(e) => onChangeHipotese(e.target.value)}
            placeholder="Hipótese terapêutica e direção do trabalho..."
            rows={3}
            className="bg-card/50"
          />
        </div>
      </CardContent>
    </Card>
  );
}
