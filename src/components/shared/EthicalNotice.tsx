import { AlertTriangle } from 'lucide-react';

export function EthicalNotice() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border/50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
          <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          <p>
            Este app não substitui supervisão clínica, psicoterapia ou psiquiatria. 
            Conteúdo formativo e simbólico, exclusivo para profissionais.
          </p>
        </div>
      </div>
    </footer>
  );
}
