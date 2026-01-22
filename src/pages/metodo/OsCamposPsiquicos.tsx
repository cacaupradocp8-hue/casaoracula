import { ArrowLeft, Waves } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const OsCamposPsiquicos = () => {
  const navigate = useNavigate();

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
            <Waves className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
            Os Campos Psíquicos
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Como sustentar o momento
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              Os Campos Psíquicos descrevem o clima interno que atravessa a Porta.
              <br />
              Eles não pedem ação.
              <br />
              <span className="font-medium">Pedem postura.</span>
            </p>

            <p>
              Um Campo pode ser de retenção, defesa, dissolução, emergência ou reintegração.
              Ele indica como a psique está reagindo ao evento que a Porta abriu.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <p className="text-muted-foreground mb-3">
                Os Campos orientam:
              </p>
              <ul className="list-none pl-0 space-y-2 text-foreground/80 mb-0">
                <li>– o que sustentar</li>
                <li>– o que não fazer</li>
                <li>– o que pode ferir se for forçado</li>
                <li>– o que precisa de tempo</li>
              </ul>
            </div>

            <p>
              O Campo não resolve a experiência.
              <br />
              Ele protege o tempo psíquico necessário para que a experiência se organize sozinha.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <p className="text-muted-foreground mb-3">
                Ler o Campo corretamente é saber quando:
              </p>
              <ul className="list-none pl-0 space-y-2 text-foreground/80 mb-0">
                <li>– não interpretar</li>
                <li>– não conduzir</li>
                <li>– não estimular</li>
                <li>– não concluir</li>
              </ul>
            </div>

            <div className="border-l-2 border-primary/50 pl-6 my-8">
              <p className="text-foreground font-light italic mb-0">
                O Campo ensina a arte de não violar.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation to other pages */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Continuar a leitura
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate("/metodo/portas")}
            >
              As Portas
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/metodo/torres")}
            >
              As Torres
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OsCamposPsiquicos;
