import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { useEthicalReview, EthicalReviewResponse } from "@/hooks/useAtelieConteudo";

interface AtelieRevisaoEticaProps {
  conteudoOriginal: string;
  onReviewed?: (result: EthicalReviewResponse) => void;
}

export default function AtelieRevisaoEtica({ conteudoOriginal, onReviewed }: AtelieRevisaoEticaProps) {
  const { review, isReviewing } = useEthicalReview();
  const [contexto, setContexto] = useState("");
  const [resultado, setResultado] = useState<EthicalReviewResponse | null>(null);

  const handleReview = async () => {
    const result = await review({
      conteudo: conteudoOriginal,
      contexto: contexto || undefined,
    });

    if (result) {
      setResultado(result);
      onReviewed?.(result);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Revisão Ética
        </CardTitle>
        <CardDescription>
          Avaliação ética e clínica do conteúdo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!resultado ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="contexto">Contexto adicional (opcional)</Label>
              <Textarea
                id="contexto"
                placeholder="Ex: Este conteúdo será usado em supervisão de grupo..."
                value={contexto}
                onChange={(e) => setContexto(e.target.value)}
                rows={2}
              />
            </div>

            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-md">
              <p className="font-medium">A revisão ética irá verificar:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Linguagem diagnóstica ou prescritiva</li>
                <li>Risco de interpretação absoluta</li>
                <li>Confusão processo pessoal × profissional</li>
                <li>Incentivo à projeção ou salvamento</li>
                <li>Cuidado ético em aplicação clínica</li>
              </ul>
            </div>

            <Button 
              onClick={handleReview} 
              disabled={isReviewing || !conteudoOriginal}
              className="w-full"
              variant="outline"
            >
              {isReviewing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Iniciar Revisão Ética
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Pontos Seguros */}
            {resultado.review.pontos_seguros.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  Pontos Éticos Seguros
                </h4>
                <ul className="text-sm space-y-1 pl-6">
                  {resultado.review.pontos_seguros.map((ponto, i) => (
                    <li key={i} className="list-disc text-muted-foreground">{ponto}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pontos de Atenção */}
            {resultado.review.pontos_atencao.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Pontos de Atenção
                </h4>
                <ul className="text-sm space-y-1 pl-6">
                  {resultado.review.pontos_atencao.map((ponto, i) => (
                    <li key={i} className="list-disc text-muted-foreground">{ponto}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sugestões de Ajuste */}
            {resultado.review.sugestoes_ajuste.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-accent-foreground">
                  <Lightbulb className="h-4 w-4" />
                  Sugestões de Ajuste
                </h4>
                <ul className="text-sm space-y-1 pl-6">
                  {resultado.review.sugestoes_ajuste.map((sugestao, i) => (
                    <li key={i} className="list-disc text-muted-foreground">{sugestao}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={() => setResultado(null)} 
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Nova Revisão
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
