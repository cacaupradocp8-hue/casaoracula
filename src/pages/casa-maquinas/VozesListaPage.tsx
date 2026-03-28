import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VOZES } from '@/data/vozes';

export default function VozesListaPage() {
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {VOZES.map((voz) => (
                <Link key={voz.id} to={`/casa-das-maquinas/7-vozes/${voz.id}`}>
                  <div className="group relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer space-y-3">
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
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
