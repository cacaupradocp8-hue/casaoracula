import { ArrowLeft, DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AsPortas = () => {
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
            <DoorOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
            As Portas
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Onde a psique está agora
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              As Portas não descrevem quem a pessoa é.
              <br />
              Descrevem o momento psíquico que está ativo.
            </p>

            <p>
              Uma Porta se abre quando algo está em travessia:
              um fim, um início, uma suspensão, uma defesa, um chamado.
              Ela indica em que ponto do Labirinto a experiência humana se encontra.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <p className="text-muted-foreground mb-0">
                As Portas:
              </p>
              <ul className="list-none pl-0 mt-3 space-y-2 text-foreground/80">
                <li>– não são traços de personalidade</li>
                <li>– não são rótulos</li>
                <li>– não são diagnósticos</li>
              </ul>
              <p className="mt-4 mb-0 font-medium text-foreground">
                São eventos psíquicos vivos.
              </p>
            </div>

            <p>
              Quando uma Porta está ativa, a pergunta não é "o que isso significa?",
              mas <span className="font-medium">"o que este momento pede?"</span>.
            </p>

            <p>
              Ler a Porta corretamente evita intervenções prematuras, 
              interpretações invasivas e promessas que a psique ainda não pode sustentar.
            </p>

            <div className="border-l-2 border-primary/50 pl-6 my-8">
              <p className="text-foreground font-light italic mb-0">
                As Portas organizam o tempo interno.
                <br />
                Elas mostram onde não apressar.
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
              onClick={() => navigate("/metodo/campos-psiquicos")}
            >
              Os Campos Psíquicos
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

export default AsPortas;
