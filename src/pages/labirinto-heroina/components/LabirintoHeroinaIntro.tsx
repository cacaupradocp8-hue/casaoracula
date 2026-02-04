import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Moon, Sparkles, Feather, Flame } from "lucide-react";

interface LabirintoHeroinaIntroProps {
  onEnter: () => void;
}

export function LabirintoHeroinaIntro({ onEnter }: LabirintoHeroinaIntroProps) {
  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-xl text-center space-y-8">
          <Compass className="w-16 h-16 text-gold mx-auto" />
          
          <h1 className="font-display text-3xl md:text-4xl text-gold">
            O Labirinto da Heroína Interna®
          </h1>
          
          <p className="text-muted-foreground">
            Ecossistema simbólico para navegação do processo de individuação feminina
          </p>
          
          <Card className="border-gold/30 bg-card/50">
            <CardContent className="p-6 space-y-6">
              <p className="text-foreground leading-relaxed text-left">
                Este é um <strong>sistema modular de quatro camadas</strong> que se entrelaçam 
                para sustentar a travessia simbólica.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <Moon className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="font-medium">Fases</div>
                    <div className="text-sm text-muted-foreground">
                      Os estágios da jornada heroica
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="font-medium">Arquétipos</div>
                    <div className="text-sm text-muted-foreground">
                      As forças que regem cada travessia
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Feather className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="font-medium">Metáforas</div>
                    <div className="text-sm text-muted-foreground">
                      Espelhos simbólicos de suporte
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-gold mt-1 shrink-0" />
                  <div>
                    <div className="font-medium">Rituais</div>
                    <div className="text-sm text-muted-foreground">
                      Práticas de integração e ancoragem
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button
            onClick={onEnter}
            size="lg"
            className="bg-gold hover:bg-gold/90 text-background gap-2"
          >
            <Compass className="w-5 h-5" />
            Entrar no Labirinto
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
