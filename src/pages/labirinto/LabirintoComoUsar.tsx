import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import { BackButton } from "@/components/navigation/BackButton";

export default function LabirintoComoUsar() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Back button + Breadcrumb */}
        <div>
          <BackButton to="/labirinto" label="Voltar ao Labirinto" />
          <PageBreadcrumb
            items={[
              { label: "Ferramentas", href: "/ferramentas-metodo" },
              { label: "Labirinto", href: "/labirinto" },
              { label: "Como Usar" },
            ]}
          />
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 text-gold mx-auto" />
          <h1 className="font-display text-3xl text-gold">
            Como usar o Labirinto
          </h1>
        </div>

        {/* Main Content */}
        <Card className="border-gold/30">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                O Labirinto das 39 Portas <strong>não responde perguntas</strong>.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                Ele revela <strong>campos psíquicos ativos</strong>.
              </p>
            </div>

            <div className="h-px bg-border/50" />

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Cada Porta não fala sobre quem você é
                nem sobre o que aconteceu,
                mas sobre <strong>em qual campo a psique está operando agora</strong>.
              </p>
            </div>

            <div className="h-px bg-border/50" />

            <div className="space-y-4 bg-gold/5 p-6 rounded-lg border border-gold/20">
              <p className="text-foreground font-medium leading-relaxed">
                O objetivo não é compreender, resolver ou agir.
              </p>
              <p className="text-gold font-medium leading-relaxed">
                O objetivo é <strong>sustentar o campo com maturidade</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate("/labirinto/tipos-de-campo")}
            className="bg-gold hover:bg-gold/90 text-background gap-2"
          >
            Ver Tipos de Campo Psíquico
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
