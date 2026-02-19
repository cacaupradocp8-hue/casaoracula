import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const REGRAS_ETICAS = [
  'Sua escrita é sempre privada — nunca compartilhada.',
  'Não há obrigação de ritmo ou participação.',
  'Não fazemos interpretações automáticas do seu processo.',
  'Este é um espaço de escuta, não de debate.',
  'O livro trabalha você — não o contrário.',
];

export function RegrasEticasBlock() {
  return (
    <Card className="bg-muted/20 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Regras Éticas do Círculo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {REGRAS_ETICAS.map((regra, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="text-gold mt-1">•</span>
              {regra}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
