import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

interface Props {
  onNext: () => void;
}

export function TelaAbertura({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Map className="w-10 h-10 text-primary" />
      </div>

      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl font-display text-foreground">Cartografia Psíquica Orácula</h2>
        <p className="text-muted-foreground text-sm italic">
          Como é a geografia da sua cidade interior agora?
        </p>
      </div>

      <p className="text-sm text-muted-foreground/70 max-w-sm leading-relaxed">
        Vamos criar um mapa da sua psique — não é um teste, é uma leitura simbólica
        do seu estado interior neste momento.
      </p>

      <Button onClick={onNext} variant="gold" size="lg" className="mt-4">
        Começar cartografia
      </Button>
    </div>
  );
}
