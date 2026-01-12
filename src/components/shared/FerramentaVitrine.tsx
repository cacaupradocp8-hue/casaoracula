import { Lock, Clock, Sparkles, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTextModels } from "@/hooks/useTextModel";

export type FerramentaStatus = "ativo" | "em_breve" | "bloqueado" | "upgrade";

interface FerramentaVitrineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nome: string;
  descricao?: string | null;
  indicacao?: string;
  status: FerramentaStatus;
  ctaTexto?: string;
  ctaAcao?: () => void;
}

const STATUS_CONFIG: Record<
  FerramentaStatus,
  {
    icon: React.ReactNode;
    badgeLabel: string;
    badgeVariant: "default" | "secondary" | "outline" | "destructive";
    defaultCta: string;
  }
> = {
  ativo: {
    icon: <Sparkles className="w-8 h-8 text-gold" />,
    badgeLabel: "Disponível",
    badgeVariant: "default",
    defaultCta: "Acessar ferramenta",
  },
  em_breve: {
    icon: <Clock className="w-8 h-8 text-muted-foreground" />,
    badgeLabel: "Em breve",
    badgeVariant: "secondary",
    defaultCta: "Em breve",
  },
  bloqueado: {
    icon: <Lock className="w-8 h-8 text-muted-foreground" />,
    badgeLabel: "Bloqueado",
    badgeVariant: "outline",
    defaultCta: "Solicitar acesso",
  },
  upgrade: {
    icon: <Lock className="w-8 h-8 text-gold" />,
    badgeLabel: "Requer upgrade",
    badgeVariant: "destructive",
    defaultCta: "Atualizar plano",
  },
};

export function FerramentaVitrine({
  open,
  onOpenChange,
  nome,
  descricao,
  indicacao,
  status,
  ctaTexto,
  ctaAcao,
}: FerramentaVitrineProps) {
  const { getText } = useTextModels();
  const config = STATUS_CONFIG[status];

  const handleCta = () => {
    if (ctaAcao) {
      ctaAcao();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            {config.icon}
          </div>
          <div className="flex justify-center mb-2">
            <Badge variant={config.badgeVariant}>{config.badgeLabel}</Badge>
          </div>
          <DialogTitle className="text-xl font-display">{nome}</DialogTitle>
          {descricao && (
            <DialogDescription className="text-center mt-2">
              {descricao}
            </DialogDescription>
          )}
        </DialogHeader>

        {indicacao && (
          <div className="bg-muted/30 rounded-lg p-4 mt-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Indicado para: </span>
              {indicacao}
            </p>
          </div>
        )}

        {status === "em_breve" && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Esta ferramenta está em fase de estruturação e será disponibilizada em breve.
            </p>
          </div>
        )}

        {status === "bloqueado" && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {getText(
                "ferramenta_bloqueada_texto",
                "Esta ferramenta requer permissões específicas para acesso."
              )}
            </p>
          </div>
        )}

        {status === "upgrade" && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              {getText(
                "ferramenta_upgrade_texto",
                "Disponível em planos superiores. Faça upgrade para acessar."
              )}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 mt-4">
          {status === "ativo" && ctaAcao && (
            <Button variant="gold" className="w-full gap-2" onClick={handleCta}>
              {ctaTexto || config.defaultCta}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {status === "em_breve" && (
            <Button variant="outline" className="w-full" disabled>
              <Clock className="w-4 h-4 mr-2" />
              {config.defaultCta}
            </Button>
          )}

          {(status === "bloqueado" || status === "upgrade") && ctaAcao && (
            <Button variant="outline" className="w-full gap-2" onClick={handleCta}>
              {ctaTexto || config.defaultCta}
            </Button>
          )}

          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
