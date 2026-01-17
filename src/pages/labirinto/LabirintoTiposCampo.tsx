import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Circle, Shield, Droplets, Flame, Sparkles, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const TIPOS_CAMPO = [
  {
    nome: "Campo de Retenção",
    icon: Circle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    descricao: "Algo foi contido para sobreviver.",
    pede: "Pede escuta, silêncio e tempo.",
    naoPede: "Não pede fala forçada ou interpretação.",
  },
  {
    nome: "Campo de Defesa",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    descricao: "A psique protege limites.",
    pede: "Pede contenção e respeito.",
    naoPede: "Não pede descarga nem moralização.",
  },
  {
    nome: "Campo de Dissolução",
    icon: Droplets,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    descricao: "Algo está terminando.",
    pede: "Pede tempo e despedida simbólica.",
    naoPede: "Não pede conserto nem aceleração.",
  },
  {
    nome: "Campo de Emergência",
    icon: Flame,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    descricao: "Algo novo quer nascer, ainda frágil.",
    pede: "Pede proteção e ritmo.",
    naoPede: "Não pede exposição nem pressão.",
  },
  {
    nome: "Campo de Limiar",
    icon: Sparkles,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
    descricao: "A psique está entre dois estados.",
    pede: "Pede presença e não-ação.",
    naoPede: "Não pede decisão nem conclusão.",
  },
];

export default function LabirintoTiposCampo() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/labirinto")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Labirinto
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <Map className="w-12 h-12 text-gold mx-auto" />
          <h1 className="font-display text-3xl text-gold">
            Tipos de Campo Psíquico
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Cada Porta do Labirinto revela um desses cinco tipos de campo.
            Reconhecer o campo é o primeiro passo para sustentá-lo.
          </p>
        </div>

        {/* Campo Cards */}
        <div className="space-y-4">
          {TIPOS_CAMPO.map((campo) => {
            const Icon = campo.icon;
            return (
              <Card key={campo.nome} className={cn("border", campo.borderColor)}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg", campo.bgColor)}>
                      <Icon className={cn("w-6 h-6", campo.color)} />
                    </div>
                    <div className="flex-1 space-y-3">
                      <h3 className={cn("font-display text-xl", campo.color)}>
                        {campo.nome}
                      </h3>
                      <p className="text-foreground leading-relaxed">
                        {campo.descricao}
                      </p>
                      <div className="pt-2 space-y-1 text-sm">
                        <p className="text-gold">{campo.pede}</p>
                        <p className="text-muted-foreground">{campo.naoPede}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground italic">
            O objetivo não é compreender o campo.
            É sustentá-lo com maturidade.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
