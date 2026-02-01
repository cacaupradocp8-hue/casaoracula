import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * NodeDetailPanel — Painel lateral com detalhes do nodo selecionado
 * 
 * Mostra informação simbólica, nunca erro técnico
 */

interface MapNode {
  id: string;
  node_type: 'sala' | 'portal' | 'travessia' | 'ritual';
  reference_id: string | null;
  label: string;
  description_locked: string | null;
  description_unlocked: string | null;
  position_ring: number;
  position_angle: number;
  icon: string | null;
  color: string | null;
  ordem: number;
  status: 'locked' | 'active' | 'completed';
}

interface NodeDetailPanelProps {
  node: MapNode | undefined;
  onClose: () => void;
}

const getNodeTypeLabel = (type: string) => {
  switch (type) {
    case 'sala': return 'Sala';
    case 'portal': return 'Portal';
    case 'travessia': return 'Travessia';
    case 'ritual': return 'Ritual de Passagem';
    default: return 'Elemento';
  }
};

const getStatusMessage = (status: string, type: string) => {
  if (status === 'completed') {
    return 'Este caminho foi integrado à sua jornada.';
  }
  if (status === 'active') {
    return 'Você está atravessando este território.';
  }
  
  // Locked messages - symbolic, not technical
  switch (type) {
    case 'sala':
      return 'Esta sala aguarda o momento certo para se revelar.';
    case 'portal':
      return 'O portal permanece velado até que os passos anteriores sejam dados.';
    case 'travessia':
      return 'O caminho existe, mas ainda não é hora de percorrê-lo.';
    case 'ritual':
      return 'Este ritual será oferecido quando a passagem for necessária.';
    default:
      return 'Nem tudo se revela ao mesmo tempo.';
  }
};

export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!node || !node.reference_id) return;
    
    switch (node.node_type) {
      case 'sala':
        navigate(`/salas/${node.reference_id}`);
        break;
      case 'travessia':
        navigate(`/travessia/${node.reference_id}`);
        break;
      case 'portal':
        navigate(`/portais/${node.reference_id}`);
        break;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {node ? (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-lg border border-border/50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-border/30">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {getNodeTypeLabel(node.node_type)}
                </span>
                <h3 className="text-lg font-medium text-foreground mt-1">
                  {node.label}
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 -mt-1 -mr-1"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {node.status === 'locked' ? (
                <Lock className="w-4 h-4 text-muted-foreground/60" />
              ) : node.status === 'completed' ? (
                <Star className="w-4 h-4 text-gold" />
              ) : (
                <Sparkles className="w-4 h-4 text-purple-400" />
              )}
              <span className={`text-sm ${
                node.status === 'locked' 
                  ? 'text-muted-foreground/60' 
                  : node.status === 'completed'
                    ? 'text-gold'
                    : 'text-purple-400'
              }`}>
                {node.status === 'locked' 
                  ? 'Velado'
                  : node.status === 'completed' 
                    ? 'Integrado'
                    : 'Em travessia'
                }
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {node.status === 'locked' 
                ? (node.description_locked || getStatusMessage('locked', node.node_type))
                : (node.description_unlocked || getStatusMessage(node.status, node.node_type))
              }
            </p>

            {/* Action */}
            {node.status !== 'locked' && node.reference_id && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={handleNavigate}
              >
                {node.status === 'active' ? 'Continuar' : 'Revisitar'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-lg border border-border/30 p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            Selecione um ponto no mapa para ver detalhes
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
