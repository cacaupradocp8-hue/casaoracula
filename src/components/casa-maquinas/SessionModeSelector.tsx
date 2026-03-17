import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Compass, Feather, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SessionMode } from '@/hooks/useSessionMode';

interface SessionModeSelectorProps {
  open: boolean;
  onSelect: (mode: SessionMode) => void;
  onClose?: () => void;
}

export function SessionModeSelector({ open, onSelect, onClose }: SessionModeSelectorProps) {
  const [hoveredMode, setHoveredMode] = useState<SessionMode | null>(null);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && onClose) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-display">
            Como deseja conduzir esta sessão?
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Escolha o modo de condução. Você pode alternar durante a sessão.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {/* Modo Orácula */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredMode('oracula')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onSelect('oracula')}
            className={`relative p-5 rounded-xl border-2 text-left transition-all ${
              hoveredMode === 'oracula'
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-border/30 bg-background/50 hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">Modo Orácula</h3>
                <Badge variant="secondary" className="text-[9px] mt-0.5">Guiado</Badge>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <Sparkles className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <span>Sugere a próxima ferramenta automaticamente</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <span>Conduz a sessão em fluxo contínuo</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                <span>Atualiza o mapa da CidaDELA ao finalizar</span>
              </li>
            </ul>
          </motion.button>

          {/* Modo Livre */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHoveredMode('livre')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onSelect('livre')}
            className={`relative p-5 rounded-xl border-2 text-left transition-all ${
              hoveredMode === 'livre'
                ? 'border-accent bg-accent/5 shadow-lg shadow-accent/10'
                : 'border-border/30 bg-background/50 hover:border-accent/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                <Feather className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-foreground text-sm">Modo Livre</h3>
                <Badge variant="outline" className="text-[9px] mt-0.5">Não guiado</Badge>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-1.5">
                <Feather className="w-3 h-3 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Acesso livre a todas as ferramentas</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Registro manual da sessão</span>
              </li>
              <li className="flex items-start gap-1.5">
                <ArrowRight className="w-3 h-3 text-accent-foreground mt-0.5 flex-shrink-0" />
                <span>Sugestões opcionais disponíveis</span>
              </li>
            </ul>
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
