// ============================================
// DIÁRIO DE BORDO DA AULA
// ============================================
// Componente colapsável para anotações pessoais
// Auto-save com debounce, 100% privado

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Check,
  Lock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDiarioBordo } from '@/hooks/useDiarioBordo';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface DiarioBordoAulaProps {
  aulaId: string;
  className?: string;
}

export function DiarioBordoAula({ aulaId, className }: DiarioBordoAulaProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { 
    conteudo, 
    setConteudo, 
    loading, 
    saving, 
    lastSaved, 
    error,
    saveImediato,
  } = useDiarioBordo(aulaId);

  // Não mostrar se não estiver logado
  if (!user) return null;

  const hasContent = conteudo.trim().length > 0;

  return (
    <Card className={cn('border-emerald-500/20 bg-emerald-500/5', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-emerald-500/10 transition-colors py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Diário de Bordo
                {hasContent && !isOpen && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    Com anotações
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">Privado</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            {loading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <>
                <Textarea
                  placeholder="Suas anotações pessoais sobre esta aula... Insights, reflexões, perguntas..."
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  onBlur={saveImediato}
                  className="min-h-[120px] resize-y bg-background/50 border-emerald-500/20 focus:border-emerald-500/50"
                />
                
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Apenas você pode ver estas anotações
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {error && (
                      <span className="text-destructive">{error}</span>
                    )}
                    {saving ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Salvando...
                      </span>
                    ) : lastSaved ? (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <Check className="w-3 h-3" />
                        Salvo {formatDistanceToNow(lastSaved, { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
