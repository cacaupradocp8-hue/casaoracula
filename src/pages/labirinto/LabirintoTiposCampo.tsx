import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Circle, Shield, Droplets, Flame, Sparkles, Map, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const TIPOS_CAMPO = [
  {
    nome: "Campo de Limiar",
    chave: "limiar",
    icon: Sparkles,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
    descricao: "A psique está entre dois estados. Nada deve ser decidido.",
    pede: "Presença sem pressa.",
    naoPede: "Não pede decisão nem conclusão.",
    essencia: "👉 Essência: presença sem pressa",
  },
  {
    nome: "Campo de Retenção",
    chave: "retencao",
    icon: Circle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    descricao: "Algo precisou se conter para sobreviver.",
    pede: "Escuta, silêncio e tempo.",
    naoPede: "Não pede fala forçada ou interpretação.",
    essencia: "👉 Essência: escuta sem exigência",
  },
  {
    nome: "Campo de Defesa",
    chave: "defesa",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    descricao: "A psique ergueu força para não ser invadida.",
    pede: "Contenção e respeito ao limite.",
    naoPede: "Não pede descarga nem moralização.",
    essencia: "👉 Essência: limite sem moralização",
  },
  {
    nome: "Campo de Dissolução",
    chave: "dissolucao",
    icon: Droplets,
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
    borderColor: "border-gray-400/30",
    descricao: "Algo já terminou, mesmo que doa.",
    pede: "Tempo e despedida simbólica.",
    naoPede: "Não pede conserto nem aceleração.",
    essencia: "👉 Essência: tempo sem correção",
  },
  {
    nome: "Campo de Emergência",
    chave: "emergencia",
    icon: Flame,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    descricao: "Algo novo quer nascer, ainda frágil.",
    pede: "Proteção e ritmo.",
    naoPede: "Não pede exposição nem pressão.",
    essencia: "👉 Essência: continência sem aceleração",
  },
  {
    nome: "Campo de Reintegração",
    chave: "reintegracao",
    icon: RotateCcw,
    color: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/30",
    descricao: "Portas raras, de volta consciente.",
    pede: "Estabilização e presença.",
    naoPede: "Não pede euforia nem glorificação.",
    essencia: "👉 Essência: estabilização sem euforia",
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
            Cada Porta do Labirinto revela um desses seis tipos de campo.
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
                        <p className="text-muted-foreground/70 italic pt-1">{campo.essencia}</p>
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
