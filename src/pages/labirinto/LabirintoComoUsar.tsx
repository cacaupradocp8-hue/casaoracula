import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Home, ChevronRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function LabirintoComoUsar() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/labirinto")}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Labirinto
        </Button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/ferramentas-metodo" className="hover:text-foreground transition-colors">
            Ferramentas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/labirinto" className="hover:text-foreground transition-colors">
            Labirinto
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Como Usar</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 text-gold mx-auto" />
          <h1 className="font-display text-3xl text-gold">
            Como usar o Labirinto
          </h1>
        </div>

        {/* Main Content */}
        <Card className="border-gold/30">
          <CardContent className="p-8 space-y-6">
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
