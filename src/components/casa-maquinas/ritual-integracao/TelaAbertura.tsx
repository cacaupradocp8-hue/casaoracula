import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export function TelaAbertura({ onStart }: { onStart: () => void }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardContent className="py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Ritual de Integração</h2>
          <p className="text-primary/80 font-medium">O que você está pronta para integrar?</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          O ritual marca uma passagem. Não é magia — é presença. Você reconhece o que aprendeu,
          honra o que viveu e cria um gesto que ancora a transformação no corpo e no tempo.
        </p>
        <Button variant="gold" size="lg" onClick={onStart}>Iniciar Ritual</Button>
      </CardContent>
    </Card>
  );
}
