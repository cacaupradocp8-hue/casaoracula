import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Orbit } from 'lucide-react';

export function TelaAbertura({ onStart }: { onStart: () => void }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardContent className="py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Orbit className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Cartografia de Complexos</h2>
          <p className="text-primary/80 font-medium">Quais forças autônomas operam em você?</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Um complexo é um padrão emocional autônomo — uma reação que se ativa antes que você perceba.
          Mapear seus complexos é o primeiro passo para deixar de ser conduzida por eles.
        </p>
        <Button variant="gold" size="lg" onClick={onStart}>Iniciar Cartografia</Button>
      </CardContent>
    </Card>
  );
}
