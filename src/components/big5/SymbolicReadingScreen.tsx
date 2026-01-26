import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Big5OracularFator } from '@/hooks/useBig5Oracular';
import { PortaMapping } from '@/hooks/useBig5PortaMapping';

interface SymbolicReadingScreenProps {
  predominante: Big5OracularFator | null;
  fragilizado: Big5OracularFator | null;
  mapping: PortaMapping | null;
  onContinue: () => void;
}

export function SymbolicReadingScreen({
  predominante,
  fragilizado,
  mapping,
  onContinue,
}: SymbolicReadingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="glass border-gold/20">
        <CardHeader className="text-center pb-2">
          <CardTitle className="font-display text-xl text-gold">
            Seu Campo Simbólico Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Fatores identificados */}
          <div className="space-y-4 text-center">
            {predominante && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{predominante.simbolo}</span>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Em força</p>
                  <p className="font-medium text-foreground">{predominante.nome}</p>
                </div>
              </div>
            )}

            {fragilizado && fragilizado.chave !== predominante?.chave && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl opacity-60">{fragilizado.simbolo}</span>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Em tensão</p>
                  <p className="font-medium text-amber-400">{fragilizado.nome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Porta identificada */}
          {mapping && (
            <div className="p-4 rounded-lg bg-gold/5 border border-gold/20 text-center">
              <p className="text-sm text-muted-foreground mb-1">Porta associada</p>
              <p className="font-display text-lg text-gold">{mapping.porta_associada}</p>
              {mapping.porta_tipo_campo && (
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  Campo de {mapping.porta_tipo_campo}
                </p>
              )}
            </div>
          )}

          {/* Narrativa curta */}
          {mapping?.narrativa_curta && (
            <div className="py-4">
              <p className="text-center text-muted-foreground leading-relaxed italic">
                "{mapping.narrativa_curta}"
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Aviso fixo */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">
              Este mapa não explica. Ele aponta.
            </p>
          </div>

          {/* CTA */}
          <Button 
            onClick={onContinue} 
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Ritual de Abertura
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
