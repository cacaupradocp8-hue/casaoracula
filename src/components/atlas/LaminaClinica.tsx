import { AtlasArquetipo, TERRITORIOS } from '@/hooks/useAtlasArquetipos';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, Heart, Mountain, Bird, Compass, Flame, Moon, 
  Sparkles, Zap, Flower2, Palette, Sunrise, 
  MessageCircle, AlertTriangle, Eye, HandHeart
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Heart, Mountain, Bird, Compass, Flame, Moon,
  Sparkles, Zap, Flower2, Palette, Sunrise,
};

interface LaminaClinicaProps {
  arquetipo: AtlasArquetipo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LaminaClinica({ arquetipo, open, onOpenChange }: LaminaClinicaProps) {
  if (!arquetipo) return null;
  
  const IconComponent = ICON_MAP[arquetipo.icone] || Sparkles;
  const territorio = TERRITORIOS[arquetipo.territorio];
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <SheetHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-gold border-gold/30">
                Uso Profissional
              </Badge>
              <Badge 
                variant="secondary" 
                className={`bg-${territorio.color}-500/10 text-${territorio.color}-300 border-${territorio.color}-500/30`}
              >
                {territorio.label}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-${arquetipo.cor_acento}-500/20`}>
                <IconComponent className={`w-6 h-6 text-${arquetipo.cor_acento}-400`} />
              </div>
              <div>
                <SheetTitle className="text-xl text-foreground">
                  {arquetipo.nome}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Lâmina Clínica Simbólica
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <div className="space-y-6 pb-8">
            {/* 1. Descrição Clínica Simbólica */}
            <section>
              <h3 className="text-sm font-medium text-gold flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4" />
                Descrição Clínica
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {arquetipo.descricao_clinica}
              </p>
            </section>
            
            <Separator className="bg-border/50" />
            
            {/* 2. Manifestações Frequentes */}
            <section>
              <h3 className="text-sm font-medium text-gold flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4" />
                Manifestações em Clientes
              </h3>
              <ul className="space-y-2">
                {arquetipo.manifestacoes_frequentes?.map((m, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-gold/50 mt-1">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <Separator className="bg-border/50" />
            
            {/* 3. Perguntas de Sessão */}
            <section>
              <h3 className="text-sm font-medium text-gold flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4" />
                Perguntas Possíveis
              </h3>
              <p className="text-xs text-muted-foreground/70 mb-3">
                Uso opcional, não confrontativas
              </p>
              <div className="space-y-2">
                {arquetipo.perguntas_sessao?.map((p, i) => (
                  <div 
                    key={i} 
                    className="text-sm text-foreground/80 italic pl-3 border-l-2 border-gold/30"
                  >
                    "{p}"
                  </div>
                ))}
              </div>
            </section>
            
            <Separator className="bg-border/50" />
            
            {/* 4. Riscos de Projeção */}
            <section>
              <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Riscos de Projeção da Terapeuta
              </h3>
              <div className="space-y-2">
                {arquetipo.riscos_projecao?.map((r, i) => (
                  <Alert key={i} variant="default" className="bg-amber-500/5 border-amber-500/20">
                    <AlertDescription className="text-sm text-amber-200/80">
                      {r}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </section>
            
            <Separator className="bg-border/50" />
            
            {/* 5. Postura Clínica */}
            <section>
              <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2 mb-2">
                <HandHeart className="w-4 h-4" />
                Como Trabalhar a Força sem Reforçar a Ferida
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {arquetipo.trabalhar_forca_sem_reforcar_ferida}
              </p>
            </section>
            
            {/* 6. Nota Ética Fixa */}
            <Alert className="bg-purple-500/10 border-purple-500/30 mt-6">
              <AlertTriangle className="w-4 h-4 text-purple-400" />
              <AlertDescription className="text-sm text-purple-200/90">
                <strong>Nota Ética:</strong> Este arquétipo não deve ser nomeado à cliente. 
                Serve para orientar a postura da condução.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
