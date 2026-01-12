import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Wrench, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EthicalNotice } from "@/components/shared/EthicalNotice";

interface FerramentaPlaceholderProps {
  titulo: string;
  descricao?: string;
  categoria?: "ferramenta" | "ia" | "conteudo";
  mostrarEtica?: boolean;
}

export function FerramentaPlaceholder({
  titulo,
  descricao,
  categoria = "ferramenta",
  mostrarEtica = false,
}: FerramentaPlaceholderProps) {
  const navigate = useNavigate();

  const categoriaLabel = {
    ferramenta: "Ferramenta Terapêutica",
    ia: "Assistente IA",
    conteudo: "Conteúdo Formativo",
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title={titulo}
          subtitle={descricao || "Ferramenta em desenvolvimento"}
          icon={<Wrench className="w-5 h-5" />}
          className="mb-8"
        />

        <Card className="glass max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="mx-auto mb-4">
              {categoriaLabel[categoria]}
            </Badge>
            <CardTitle className="text-xl font-display">{titulo}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Esta ferramenta está em fase de estruturação.
              </p>
            </div>

            {/* Área reservada para futuras funcionalidades */}
            <div className="border-2 border-dashed border-muted rounded-lg p-8">
              <div className="text-center text-muted-foreground space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Área reservada para:</span>
                </div>
                <ul className="text-sm space-y-2">
                  <li>• Inputs e formulários futuros</li>
                  <li>• Visualizações e gráficos</li>
                  <li>• Integrações com outras ferramentas</li>
                </ul>
              </div>
            </div>

            {mostrarEtica && (
              <div className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
                Este app não substitui supervisão clínica, psicoterapia ou psiquiatria. 
                Conteúdo formativo e simbólico, exclusivo para profissionais.
              </div>
            )}

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
