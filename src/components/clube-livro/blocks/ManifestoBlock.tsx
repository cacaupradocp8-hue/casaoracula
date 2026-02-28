import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Info } from 'lucide-react';

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

const NOTA_INSTITUCIONAL = [
  'Nem todos os livros serão atravessados no mesmo ano.',
  'Alguns entram como Ciclos Principais.',
  'Outros como Leituras de Profundidade.',
  'Outros como Reservatório Simbólico para o Laboratório 80/20.',
];

export function ManifestoBlock({ manifesto }: ManifestoBlockProps) {
  const text = manifesto || MANIFESTO_DEFAULT;

  return (
    <div className="space-y-4">
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

      {/* Nota Institucional */}
      <Card className="bg-muted/20 border-border/50">
        <CardContent className="pt-5 pb-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div className="space-y-2">
              <ul className="space-y-1">
                {NOTA_INSTITUCIONAL.map((item, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-gold mt-0.5">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/70 italic pt-1 border-t border-border/30">
                O Clube não trabalha com urgência. Trabalha com formação de pensamento simbólico maduro.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
