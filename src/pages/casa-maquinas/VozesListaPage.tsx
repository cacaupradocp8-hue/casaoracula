import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, Heart } from 'lucide-react';
import { VOZES } from '@/data/vozes';
import { useUserVoz } from '@/hooks/useUserVoz';

export default function VozesListaPage() {
  const { voz_primaria, voz_apoio, loading } = useUserVoz();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <Link to="/casa-das-maquinas/7-vozes">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <h1 className="text-2xl font-display font-bold text-foreground">As 7 Vozes</h1>
            </div>

            {/* Legend for badges */}
            {!loading && (voz_primaria || voz_apoio) && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-gold" /> Sua voz primária
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-primary" /> Voz de apoio
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VOZES.map((voz) => {
                const isPrimaria = voz.id === voz_primaria;
                const isApoio = voz.id === voz_apoio;

                return (
                  <Link key={voz.id} to={`/casa-das-maquinas/7-vozes/${voz.id}`}>
                    <div className={`group relative rounded-xl border bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all cursor-pointer space-y-3 ${
                      isPrimaria 
                        ? 'border-gold/40 ring-2 ring-gold/20 shadow-md' 
                        : isApoio 
                          ? 'border-primary/30 ring-1 ring-primary/15' 
                          : 'border-border/50 hover:border-primary/30'
                    }`}>
                      {/* Badges */}
                      {(isPrimaria || isApoio) && (
                        <div className="absolute top-3 right-3">
                          {isPrimaria && (
                            <Badge className="bg-gold/15 text-gold border-gold/30 gap-1">
                              <Star className="w-3 h-3" /> Primária
                            </Badge>
                          )}
                          {isApoio && (
                            <Badge variant="outline" className="border-primary/30 text-primary gap-1">
                              <Heart className="w-3 h-3" /> Apoio
                            </Badge>
                          )}
                        </div>
                      )}
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: `hsl(${voz.cor})` }}
                      />
                      <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                        {voz.nome}
                      </h3>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{voz.frase}"
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
