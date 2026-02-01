import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Star, Sparkles, Lock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormationProgress } from '@/hooks/useFormationProgress';
import { MandalaVisualization } from './MandalaVisualization';
import { NodeDetailPanel } from './NodeDetailPanel';

/**
 * FormationMapModal — Modal de Mapa Visual da Formação
 * 
 * Estética: Labirinto/Mandala
 * Foco: Território, não performance
 * Sem gamificação: Sem percentuais ou barras
 */

interface FormationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormationMapModal({ isOpen, onClose }: FormationMapModalProps) {
  const { progress, mapNodes, isLoading, error, getSummary } = useFormationProgress();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const summary = getSummary();
  const selectedNode = mapNodes.find(n => n.id === selectedNodeId);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl h-[90vh] m-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h2 className="text-xl font-display text-foreground">
                  Mapa da Formação
                </h2>
                <p className="text-sm text-muted-foreground">
                  Nem tudo se revela ao mesmo tempo.
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* Mandala Area */}
            <div className="flex-1 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Sparkles className="w-8 h-8 text-gold animate-pulse" />
                    <p className="text-muted-foreground text-sm">
                      Mapeando sua jornada...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <MandalaVisualization
                  nodes={mapNodes}
                  selectedNodeId={selectedNodeId}
                  onNodeSelect={setSelectedNodeId}
                />
              )}
            </div>

            {/* Side Panel */}
            <div className="w-80 flex flex-col gap-4">
              {/* Summary - Symbolic, not numeric */}
              {summary && (
                <div className="glass rounded-lg p-4 border border-border/50">
                  <h3 className="text-sm font-medium text-foreground/80 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gold" />
                    Seu Território
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span className="text-muted-foreground">
                        {summary.travessiasCompletas === 0 
                          ? 'A jornada aguarda seu primeiro passo'
                          : `${summary.travessiasCompletas} travessia${summary.travessiasCompletas > 1 ? 's' : ''} integrada${summary.travessiasCompletas > 1 ? 's' : ''}`
                        }
                      </span>
                    </div>
                    {summary.travessiasEmAndamento > 0 && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-muted-foreground">
                          {summary.travessiasEmAndamento} caminho{summary.travessiasEmAndamento > 1 ? 's' : ''} em andamento
                        </span>
                      </div>
                    )}
                    {summary.rituaisCompletos > 0 && (
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-blue-400" />
                        <span className="text-muted-foreground">
                          {summary.rituaisCompletos} ritual{summary.rituaisCompletos > 1 ? 'is' : ''} de passagem
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                      <span className="text-xs text-muted-foreground/60">
                        {summary.tempoNaCasa} dia{summary.tempoNaCasa !== 1 ? 's' : ''} na Casa
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Node Detail */}
              <NodeDetailPanel 
                node={selectedNode} 
                onClose={() => setSelectedNodeId(null)}
              />

              {/* Legend */}
              <div className="glass rounded-lg p-4 border border-border/50 mt-auto">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Legenda</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold/60" />
                    <span className="text-muted-foreground">Iluminado - caminho aberto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500/60" />
                    <span className="text-muted-foreground">Em travessia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted/40 flex items-center justify-center">
                      <Lock className="w-2 h-2 text-muted-foreground/50" />
                    </div>
                    <span className="text-muted-foreground">Velado - ainda por revelar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
