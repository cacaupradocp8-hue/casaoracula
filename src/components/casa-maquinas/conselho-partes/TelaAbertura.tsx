import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';

export function TelaAbertura({ onStart }: { onStart: () => void }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardContent className="py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Crown className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Conselho das Partes Internas</h2>
          <p className="text-primary/80 font-medium">Quais vozes habitam você?</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Dentro de cada pessoa existe um conselho — partes que protegem, partes que temem,
          partes que desejam. Quando essas vozes dialogam, surge uma sabedoria que nenhuma
          delas teria sozinha.
        </p>
        <Button variant="gold" size="lg" onClick={onStart}>Convocar o Conselho</Button>
      </CardContent>
    </Card>
  );
}
