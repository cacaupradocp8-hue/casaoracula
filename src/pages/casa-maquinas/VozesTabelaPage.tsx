import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { VOZES } from '@/data/vozes';

export default function VozesTabelaPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <Link to="/casa-das-maquinas/7-vozes">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <h1 className="text-2xl font-display font-bold text-foreground">Tabela Geral das Vozes</h1>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Voz</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Distritos</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Ferramentas</th>
                    <th className="text-left px-4 py-3 font-semibold text-foreground">Estilo de Condução</th>
                  </tr>
                </thead>
                <tbody>
                  {VOZES.map(voz => (
                    <tr key={voz.id} className="border-t border-border/20 hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <Link to={`/casa-das-maquinas/7-vozes/${voz.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: `hsl(${voz.cor})` }} />
                          <span className="font-medium">{voz.nome}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {voz.distritos.map(d => (
                            <span key={d} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">{d}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {voz.ferramentas.map(f => (
                            <span key={f} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px]">{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{voz.estiloSessao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
