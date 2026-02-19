import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Target, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntegracoesBlockProps {
  cicloId: string;
  integracaoConcluida: boolean;
  integracao8020Concluida: boolean;
  onNavigate: (path: string) => void;
}

export function IntegracoesBlock({
  cicloId,
  integracaoConcluida,
  integracao8020Concluida,
  onNavigate,
}: IntegracoesBlockProps) {
  return (
    <section>
      {/* Integração Oracular */}
      <Card
        className={cn(
          'cursor-pointer transition-all border group',
          integracaoConcluida
            ? 'border-gold/40 bg-gold/5 hover:bg-gold/10'
            : 'border-gold/20 bg-gradient-to-br from-card to-gold/5 hover:border-gold/40'
        )}
        onClick={() => onNavigate(`/clube-livro/${cicloId}/integracao`)}
      >
        <CardContent className="py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              {integracaoConcluida ? (
                <CheckCircle2 className="w-5 h-5 text-gold" />
              ) : (
                <Sparkles className="w-5 h-5 text-gold" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Integração Oracular</p>
              <p className="text-xs text-muted-foreground">
                {integracaoConcluida
                  ? 'Integração concluída — ver registro'
                  : 'Transforme a leitura em experiência prática'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {integracaoConcluida && (
              <Badge variant="outline" className="text-xs border-gold/40 text-gold hidden sm:flex">
                Concluída ✦
              </Badge>
            )}
            <Button
              size="sm"
              className={cn(
                'gap-2 text-xs',
                integracaoConcluida
                  ? 'bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40'
                  : 'bg-gold hover:bg-gold/90 text-primary-foreground'
              )}
              onClick={(e) => { e.stopPropagation(); onNavigate(`/clube-livro/${cicloId}/integracao`); }}
            >
              <Star className="w-3 h-3" />
              {integracaoConcluida ? 'Ver registro' : 'Integrar conteúdo'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Integração 80/20 */}
      <Card
        className={cn(
          'cursor-pointer transition-all border group mt-3',
          integracao8020Concluida
            ? 'border-gold/40 bg-gold/5 hover:bg-gold/10'
            : 'border-border/40 hover:border-gold/30'
        )}
        onClick={() => onNavigate(`/clube-livro/${cicloId}/integracao-8020`)}
      >
        <CardContent className="py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
              {integracao8020Concluida ? (
                <CheckCircle2 className="w-4 h-4 text-gold" />
              ) : (
                <Target className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Integração 80/20</p>
              <p className="text-xs text-muted-foreground">
                {integracao8020Concluida
                  ? 'Integração concluída — ver aplicação'
                  : 'Traduzir o livro em aplicação profissional e pessoal'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {integracao8020Concluida && (
              <Badge variant="outline" className="text-xs border-gold/40 text-gold hidden sm:flex">
                Concluída ✦
              </Badge>
            )}
            <Button
              size="sm"
              variant={integracao8020Concluida ? 'outline' : 'secondary'}
              className="gap-2 text-xs"
              onClick={(e) => { e.stopPropagation(); onNavigate(`/clube-livro/${cicloId}/integracao-8020`); }}
            >
              <Target className="w-3 h-3" />
              {integracao8020Concluida ? 'Ver aplicação' : 'Fazer integração'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Meu Caminho */}
      <div className="mt-3 text-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-gold gap-1"
          onClick={() => onNavigate(`/clube-livro/${cicloId}/meu-caminho`)}
        >
          <Star className="w-3 h-3" />
          Ver Meu Caminho no Clube
        </Button>
      </div>
    </section>
  );
}
