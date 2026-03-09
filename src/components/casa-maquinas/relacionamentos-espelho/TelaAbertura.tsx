
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function TelaAbertura({ onStart }: { onStart: () => void }) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardContent className="py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Relacionamentos como Espelho</h2>
          <p className="text-primary/80 font-medium">O que o outro revela sobre você?</p>
        </div>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Cada pessoa significativa na sua vida funciona como um espelho. O que você admira no outro
          revela potenciais seus. O que te irrita revela sombras não integradas. Este mapeamento
          ilumina os padrões que se repetem nos seus vínculos.
        </p>
        <Button variant="gold" size="lg" onClick={onStart}>Explorar Relacionamentos</Button>
      </CardContent>
    </Card>
  );
}
