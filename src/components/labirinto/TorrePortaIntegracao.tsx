import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Shield, 
  Star, 
  Moon, 
  Heart, 
  Waves, 
  Sparkles, 
  Flame,
  AlertTriangle,
  ExternalLink,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTorresPorPorta, TORRE_METADATA, TorreId } from "@/hooks/useTorrePortaIntegracao";

// Mapeamento de ícones
const TORRE_ICONS: Record<TorreId, React.ElementType> = {
  controle: Shield,
  performance: Star,
  silencio: Moon,
  cuidado: Heart,
  adaptacao: Waves,
  espiritualizacao: Sparkles,
  forca: Flame,
};

// Cores de badge por frequência
const FREQUENCIA_STYLES: Record<string, string> = {
  muito_frequente: "bg-gold/20 text-gold border-gold/30",
  comum: "bg-primary/20 text-primary border-primary/30",
  ocasional: "bg-muted text-muted-foreground border-muted",
};

interface TorrePortaIntegracaoProps {
  portaId: string;
  portaNome?: string;
}

export function TorrePortaIntegracao({ portaId, portaNome }: TorrePortaIntegracaoProps) {
  const navigate = useNavigate();
  const { data: torresAssociadas, isLoading } = useTorresPorPorta(portaId);

  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!torresAssociadas || torresAssociadas.length === 0) {
    return null; // Não exibir se não houver associações
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-normal">
            Uso Profissional
          </Badge>
        </div>
        <CardTitle className="text-lg font-display">
          Leitura Estrutural Associada
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Lista de Torres frequentes */}
        <div className="flex flex-wrap gap-2">
          {torresAssociadas.map((relacao) => {
            const meta = TORRE_METADATA[relacao.torre_id];
            const Icon = TORRE_ICONS[relacao.torre_id];
            
            return (
              <Badge 
                key={relacao.id}
                variant="outline"
                className={cn(
                  "gap-1.5 py-1 px-2.5",
                  FREQUENCIA_STYLES[relacao.frequencia]
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{meta.nome.replace("Torre ", "")}</span>
              </Badge>
            );
          })}
        </div>

        {/* Aviso ético */}
        <Alert variant="default" className="bg-muted/50 border-muted">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Estas associações não são exclusivas. A mesma Porta pode ser atravessada por estruturas diferentes.
          </AlertDescription>
        </Alert>

        {/* Risco e Ajuste por Torre */}
        <Accordion type="single" collapsible className="w-full">
          {torresAssociadas.map((relacao) => {
            const meta = TORRE_METADATA[relacao.torre_id];
            const Icon = TORRE_ICONS[relacao.torre_id];
            
            // Só mostra se tiver risco ou ajuste
            if (!relacao.risco_conducao && !relacao.ajuste_com_torre) return null;
            
            return (
              <AccordionItem key={relacao.id} value={relacao.id} className="border-border/50">
                <AccordionTrigger className="py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center",
                      meta.cor
                    )}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{meta.nome}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pb-4">
                  {relacao.risco_conducao && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-destructive/80 uppercase tracking-wide">
                        Risco de Condução
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {relacao.risco_conducao}
                      </p>
                    </div>
                  )}
                  
                  {relacao.ajuste_com_torre && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        Ajuste com Torre Viva™
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {relacao.ajuste_com_torre}
                      </p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* CTA para Torre Viva */}
        <div className="pt-2">
          <Button 
            variant="outline"
            className="w-full gap-2 border-primary/30 hover:bg-primary/10"
            onClick={() => navigate("/ferramentas/torre-viva")}
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Torre Viva™
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
