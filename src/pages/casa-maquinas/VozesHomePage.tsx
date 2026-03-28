import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { Flame, Map } from 'lucide-react';

export default function VozesHomePage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Flame className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Sistema das 7 Vozes
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
              As Vozes são modos de condução simbólica da psique. Elas não são identidades fixas, mas expressões vivas da escuta dentro do Método Orácula.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/casa-das-maquinas/7-vozes/lista">
                <Button variant="gold" size="lg" className="gap-2 w-full sm:w-auto">
                  <Flame className="w-4 h-4" /> Explorar as Vozes
                </Button>
              </Link>
              <Link to="/casa-das-maquinas/7-vozes/mapa">
                <Button variant="mystical" size="lg" className="gap-2 w-full sm:w-auto">
                  <Map className="w-4 h-4" /> Ver Mapa de Integração
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
