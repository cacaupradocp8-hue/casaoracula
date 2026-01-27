import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Compass } from 'lucide-react';

interface Big5SintesePerfilProps {
  dimensaoAlta: {
    nome: string;
    media: number;
  } | null;
  dimensaoBaixa: {
    nome: string;
    media: number;
  } | null;
}

export function Big5SintesePerfil({ dimensaoAlta, dimensaoBaixa }: Big5SintesePerfilProps) {
  if (!dimensaoAlta || !dimensaoBaixa) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-display">
            Síntese do Perfil
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground/90 leading-relaxed">
          Seu funcionamento atual mostra maior tendência em{' '}
          <strong className="text-primary">{dimensaoAlta.nome}</strong>{' '}
          e menor tendência em{' '}
          <strong className="text-primary">{dimensaoBaixa.nome}</strong>.
        </p>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          Isso indica como você costuma reagir, não como deve agir.
          Padrões podem mudar com contexto, fase de vida e escolhas conscientes.
        </p>
      </CardContent>
    </Card>
  );
}
