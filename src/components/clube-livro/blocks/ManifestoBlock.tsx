import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ManifestoBlockProps {
  manifesto: string;
}

const MANIFESTO_DEFAULT = `Este não é um clube de leitura comum.

Aqui, o livro não é estudado — é atravessado.

Não buscamos resumos, não fazemos fichamentos, não produzimos análises acadêmicas. 
Lemos como quem desce ao labirinto: devagar, em silêncio, deixando que as palavras trabalhem.

Cada ciclo traz um livro escolhido por sua força simbólica, por sua capacidade de mover algo interior. 
As perguntas que você encontrará não têm resposta certa. Elas existem para abrir, não para fechar.

Sua escrita é privada. Suas respostas ficam guardadas no Jardim da Psique, disponíveis apenas para você.

Não há obrigação de participar de encontros. Não há ritmo imposto. 
Você lê no seu tempo, escreve quando sente, atravessa como pode.

O que importa não é quanto você leu, mas o que se moveu.`;

export function ManifestoBlock({ manifesto }: ManifestoBlockProps) {
  const text = manifesto || MANIFESTO_DEFAULT;

  return (
    <Card className="bg-card/50 border-gold/20">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold" />
          <h3 className="text-sm uppercase tracking-widest text-gold font-medium">
            Manifesto
          </h3>
        </div>
        <div className="prose prose-invert prose-sm max-w-none">
          {text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
