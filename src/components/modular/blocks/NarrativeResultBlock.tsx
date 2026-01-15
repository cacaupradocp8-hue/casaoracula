// ============================================
// NARRATIVE RESULT BLOCK
// ============================================
// Bloco para exibição de resultados narrativos
// arquetípicos (não numéricos, não diagnósticos)

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sun, Moon, Sparkles, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultSection {
  key: string;
  title: string;
  description: string;
}

export interface NarrativeResultContent {
  introText?: string;
  resultSections?: ResultSection[];
  closingText?: string;
}

interface NarrativeResultBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

// Icons for each result type
const RESULT_ICONS: Record<string, React.ElementType> = {
  predominant: Crown,
  secondary: Sun,
  shadow: Moon,
};

const RESULT_COLORS: Record<string, string> = {
  predominant: 'from-gold/20 to-amber-500/10 border-gold/30 text-gold',
  secondary: 'from-primary/20 to-primary/10 border-primary/30 text-primary',
  shadow: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
};

// Placeholder narratives (in real implementation, these would be dynamically generated)
const ARCHETYPE_NARRATIVES: Record<string, Record<string, string>> = {
  predominant: {
    Artemis: 'A energia de Artemis pulsa forte em você. Você carrega a flecha da independência, não como fuga do outro, mas como afirmação de si. Sua força está em saber quando seguir sozinha — e em não precisar de permissão para fazê-lo.',
    Demeter: 'Deméter habita seu centro. Você nutre, acolhe, sustenta. O cuidado é sua linguagem primeira. Mas lembre-se: até a grande mãe precisa ser nutrida. O ciclo só é completo quando você também permite ser cuidada.',
    Athena: 'Atena guia seus passos. Sua mente é clara, sua estratégia precisa. Você confia na razão e na ação bem pensada. Mas não deixe a armadura bloquear o que o coração quer dizer.',
    Aphrodite: 'Afrodite dança em você. O desejo, o prazer, a expressão vibrante — tudo isso pulsa forte. Você não tem medo de se mostrar, de seduzir a vida. A beleza que você vê é a que você cria.',
    Persephone: 'Perséfone mora em você. Você não teme o escuro, as profundezas, os finais. Sabe que toda morte é semente. Sua força está em habitar o que outros evitam — e renascer sempre.',
  },
  secondary: {
    Artemis: 'Quando sua energia principal precisa descansar, é Artemis quem emerge. A caçadora interior te lembra que você pode confiar em si mesma, seguir seu próprio rastro.',
    Demeter: 'Nos bastidores, Deméter te apoia. Quando tudo parece caótico, é o instinto de cuidar e acolher que te ancora.',
    Athena: 'Atena é sua reserva estratégica. Quando o coração confunde, a mente clareia. Ela te ajuda a agir quando a emoção paralisa.',
    Aphrodite: 'Afrodite sussurra nos momentos difíceis: "permita-se o prazer". Ela te lembra que a vida também é para ser saboreada.',
    Persephone: 'Perséfone te acompanha nas descidas. Quando você precisa mergulhar fundo, ela te guia pelos corredores do invisível.',
  },
  shadow: {
    Artemis: 'A sombra de Artemis pode te isolar. O medo de depender pode se tornar uma armadura que afasta até quem você ama. Pergunte-se: onde a independência virou solidão?',
    Demeter: 'A sombra de Deméter é o cuidado que sufoca, o amor que não solta. Pergunte-se: onde você cuida do outro para evitar olhar para si mesma?',
    Athena: 'A sombra de Atena é a razão que congela o sentir. Quando tudo precisa ser planejado, o espontâneo morre. Pergunte-se: onde a clareza virou controle?',
    Aphrodite: 'A sombra de Afrodite é a sedução que não satisfaz, o desejo que nunca se completa. Pergunte-se: onde você busca fora o que só pode encontrar dentro?',
    Persephone: 'A sombra de Perséfone é a permanência no escuro, a fascinação pelo abismo. Pergunte-se: onde você escolhe o sofrimento em vez de renascer?',
  },
};

export function NarrativeResultBlock({ block, onSave }: NarrativeResultBlockProps) {
  const content = block.content as NarrativeResultContent;
  const sections = content.resultSections || [];
  
  // In a real implementation, these would come from the user's responses
  // For now, we'll use placeholders that would be populated after completing the mapping
  const [results, setResults] = useState<Record<string, string>>({
    predominant: 'Artemis',
    secondary: 'Athena',
    shadow: 'Demeter',
  });

  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    if (onSave) {
      onSave({ results, revealed: true });
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      {block.titulo && (
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
          <h3 className="text-2xl font-semibold text-foreground">{block.titulo}</h3>
        </div>
      )}

      {/* Intro text */}
      {content.introText && (
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          {content.introText}
        </p>
      )}

      {/* Reveal button */}
      {!isRevealed && (
        <div className="text-center py-8">
          <Button
            size="lg"
            onClick={handleReveal}
            className="bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 text-background font-semibold px-8"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Revelar minha leitura
          </Button>
        </div>
      )}

      {/* Result sections */}
      {isRevealed && (
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = RESULT_ICONS[section.key] || Sparkles;
            const colorClass = RESULT_COLORS[section.key] || 'from-primary/20 to-primary/10 border-primary/30 text-primary';
            const archetype = results[section.key];
            const narrative = ARCHETYPE_NARRATIVES[section.key]?.[archetype] || 
              'Sua narrativa será revelada ao completar o mapeamento arquetípico.';

            return (
              <Card 
                key={section.key}
                className={cn(
                  "overflow-hidden border-2 animate-fade-in",
                  `bg-gradient-to-br ${colorClass.split(' ').slice(0, 2).join(' ')}`
                )}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      "bg-background/20"
                    )}>
                      <Icon className={cn("w-5 h-5", colorClass.split(' ').pop())} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Archetype name */}
                    <p className={cn(
                      "text-xl font-semibold",
                      colorClass.split(' ').pop()
                    )}>
                      {archetype}
                    </p>
                    
                    {/* Narrative */}
                    <p className="text-foreground/90 leading-relaxed italic">
                      "{narrative}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Closing text */}
          {content.closingText && (
            <div className="text-center p-6 bg-card/50 border border-border rounded-lg">
              <p className="text-foreground font-medium">
                {content.closingText}
              </p>
            </div>
          )}

          {/* Redo button */}
          <div className="text-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsRevealed(false)}
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Refazer leitura
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
