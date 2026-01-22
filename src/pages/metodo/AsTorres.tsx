import { ArrowLeft, Castle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AsTorres = () => {
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
            <Castle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-foreground mb-3">
            As Torres
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Por que a psique se organizou assim
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-foreground/90 leading-relaxed">
            <p className="text-lg">
              As Torres representam estruturas de sobrevivência.
              <br />
              Arquiteturas internas que mantiveram a psique de pé quando não havia sustentação externa suficiente.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <p className="text-foreground/80 mb-0">
                Toda Torre nasce de uma necessidade real.
                <br />
                <span className="font-medium">Nenhuma Torre é defeito.</span>
                <br />
                <span className="font-medium">Nenhuma deve ser demolida.</span>
              </p>
            </div>

            <p>
              Uma Torre pode aparecer em várias fases da vida, atravessando diferentes Portas e Campos.
              Ela não descreve um estado momentâneo, mas um modo recorrente de se organizar diante do mundo.
            </p>

            <div className="bg-muted/30 rounded-lg p-6 my-8 border border-border/50">
              <p className="text-muted-foreground mb-3">
                A Cartografia da Torre permite reconhecer:
              </p>
              <ul className="list-none pl-0 space-y-2 text-foreground/80 mb-0">
                <li>– padrões de defesa</li>
                <li>– modos de se proteger</li>
                <li>– estruturas que dão estabilidade, mas também limite</li>
              </ul>
            </div>

            <p>
              Reconhecer a Torre devolve dignidade à história psíquica.
              <br />
              Não se trata de derrubá-la, mas de compreender sua função.
            </p>

            <div className="border-l-2 border-primary/50 pl-6 my-8">
              <p className="text-foreground font-light italic mb-0">
                Só quando a Torre é reconhecida, a psique pode decidir se ainda precisa dela.
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
              onClick={() => navigate("/metodo/campos-psiquicos")}
            >
              Os Campos Psíquicos
            </Button>
          </div>
        </div>

        {/* Link to practical tool */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Ferramenta de aplicação prática
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/ferramentas/torre-viva")}
            className="text-primary"
          >
            Acessar Torre Viva™
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AsTorres;
