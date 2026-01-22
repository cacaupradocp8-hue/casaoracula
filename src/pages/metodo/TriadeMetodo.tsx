import { ArrowLeft, Sparkles, DoorOpen, Waves, Castle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TriadeMetodo = () => {
  const navigate = useNavigate();

  const pilares = [
    {
      icon: DoorOpen,
      title: "As Portas",
      subtitle: "Onde a psique está",
      path: "/metodo/portas",
    },
    {
      icon: Waves,
      title: "Os Campos",
      subtitle: "Como sustentar",
      path: "/metodo/campos-psiquicos",
    },
    {
      icon: Castle,
      title: "As Torres",
      subtitle: "Por que se organizou assim",
      path: "/metodo/torres",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/ferramentas")}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às Ferramentas
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
            A Tríade do Método Orácula
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Síntese da cartografia clínica
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              O Método Orácula não corrige a psique.
              <br />
              <span className="font-medium">Ele a escuta com rigor e respeito.</span>
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <ul className="list-none pl-0 space-y-3 text-foreground/90 mb-0">
                <li className="flex items-start gap-3">
                  <DoorOpen className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span><strong>As Portas</strong> mostram onde a psique está.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Waves className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span><strong>Os Campos</strong> mostram como sustentar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Castle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span><strong>As Torres</strong> explicam por que aquela forma de existir foi necessária.</span>
                </li>
              </ul>
            </div>

            <p>
              Quando essas três leituras se alinham,
              a condução se torna ética, precisa e não invasiva.
            </p>

            <div className="border-l-2 border-primary/50 pl-6 my-8">
              <p className="text-foreground font-light italic mb-0">
                A Orácula não interpreta a vida do outro.
                <br />
                Ela sustenta o campo para que a própria psique fale.
              </p>
            </div>
          </div>
        </div>

        {/* Cards for navigation */}
        <div className="grid gap-4">
          {pilares.map((pilar) => (
            <Card
              key={pilar.path}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(pilar.path)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <pilar.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{pilar.title}</h3>
                  <p className="text-sm text-muted-foreground">{pilar.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TriadeMetodo;
