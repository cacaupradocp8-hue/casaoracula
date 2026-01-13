import { ContentBlock, ArchetypeCardContent } from '@/types/modular';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchetypeCardBlockProps {
  block: ContentBlock;
}

export function ArchetypeCardBlock({ block }: ArchetypeCardBlockProps) {
  const content = block.content as ArchetypeCardContent;

  return (
    <Card className="bg-gradient-to-br from-card via-card to-purple-950/20 border-gold/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Header with Image */}
        <div className="relative h-48 bg-gradient-to-b from-purple-900/50 to-transparent">
          {content.imageUrl ? (
            <img 
              src={content.imageUrl} 
              alt={content.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Sparkles className="w-16 h-16 text-gold/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            {content.subtitle && (
              <p className="text-sm text-gold/80 mb-1">{content.subtitle}</p>
            )}
            <h3 className="text-2xl font-serif text-foreground">
              {content.title || block.titulo || 'Arquétipo'}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          {content.description && (
            <p className="text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          )}

          {/* Keywords */}
          {content.keywords && content.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.keywords.map((keyword, index) => (
                <Badge 
                  key={index}
                  variant="outline"
                  className="text-xs border-gold/30 text-gold/80"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* Polarities */}
          {(content.lightAspect || content.shadowAspect) && (
            <div className="grid grid-cols-2 gap-4">
              {content.lightAspect && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">Luz</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {content.lightAspect}
                  </p>
                </div>
              )}
              {content.shadowAspect && (
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">Sombra</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {content.shadowAspect}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Practice */}
          {content.practice && (
            <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
              <h4 className="text-sm font-medium text-gold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Prática Sugerida
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {content.practice}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
