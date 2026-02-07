import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { useReviseContent, ReviseContentResponse } from "@/hooks/useAtelieConteudo";

interface AtelieRevisaoProps {
  conteudoOriginal: string;
  conteudoId?: string;
  onRevised: (result: ReviseContentResponse) => void;
}

const TIPO_REVISAO_OPTIONS = [
  { value: "geral", label: "Revisão geral (todos os critérios)" },
  { value: "clareza", label: "Foco em clareza e 80/20" },
  { value: "simbolico", label: "Foco em força simbólica" },
  { value: "profissional", label: "Foco em aplicação profissional" },
  { value: "pratica", label: "Foco em prática de autoeficácia" },
  { value: "etico", label: "Foco em tom ético" },
];

export default function AtelieRevisao({ conteudoOriginal, conteudoId, onRevised }: AtelieRevisaoProps) {
  const { revise, isRevising } = useReviseContent();
  const [tipoRevisao, setTipoRevisao] = useState("geral");

  const handleRevise = async () => {
    const tipoLabel = TIPO_REVISAO_OPTIONS.find(o => o.value === tipoRevisao)?.label || tipoRevisao;
    
    const result = await revise({
      aula_original: conteudoOriginal,
      tipo_revisao: tipoLabel,
      conteudo_id: conteudoId,
    });

    if (result) {
      onRevised(result);
    }
  };

  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <RefreshCw className="h-5 w-5 text-accent-foreground" />
          Revisar Aula
        </CardTitle>
        <CardDescription>
          Refine o conteúdo mantendo a autoria e o método
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Foco da Revisão</Label>
          <Select value={tipoRevisao} onValueChange={setTipoRevisao}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {TIPO_REVISAO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-md">
          <p className="font-medium">A revisão irá:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Preservar a estrutura das 7 seções</li>
            <li>Manter a voz autoral original</li>
            <li>Ajustar conforme o foco selecionado</li>
            <li>Listar os ajustes realizados</li>
          </ul>
        </div>

        <Button 
          onClick={handleRevise} 
          disabled={isRevising || !conteudoOriginal}
          className="w-full"
          variant="outline"
        >
          {isRevising ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Revisando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Enviar para Revisão
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
