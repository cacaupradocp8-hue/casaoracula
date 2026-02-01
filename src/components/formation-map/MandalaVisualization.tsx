import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Sparkles, Moon, BookOpen, Compass, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MandalaVisualization — Visualização em formato mandala/labirinto
 * 
 * Renderiza nodos em anéis concêntricos com posição angular
 * Centro = ponto de origem, anéis externos = progressão
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

interface MandalaVisualizationProps {
  nodes: MapNode[];
  selectedNodeId: string | null;
  onNodeSelect: (nodeId: string | null) => void;
}

const RING_RADIUS_BASE = 80;
const RING_SPACING = 70;
const CENTER_SIZE = 60;

// Icon mapping
const getNodeIcon = (nodeType: string, iconName: string | null) => {
  const iconMap: Record<string, typeof Star> = {
    star: Star,
    moon: Moon,
    sparkles: Sparkles,
    book: BookOpen,
    compass: Compass,
    shield: Shield,
  };
  
  if (iconName && iconMap[iconName.toLowerCase()]) {
    return iconMap[iconName.toLowerCase()];
  }
  
  switch (nodeType) {
    case 'sala': return Compass;
    case 'portal': return Moon;
    case 'travessia': return BookOpen;
    case 'ritual': return Sparkles;
    default: return Star;
  }
};

export function MandalaVisualization({ 
  nodes, 
  selectedNodeId, 
  onNodeSelect 
}: MandalaVisualizationProps) {
  // Group nodes by ring
  const rings = useMemo(() => {
    const ringMap = new Map<number, MapNode[]>();
    
    nodes.forEach(node => {
      const ring = node.position_ring;
      if (!ringMap.has(ring)) {
        ringMap.set(ring, []);
      }
      ringMap.get(ring)!.push(node);
    });
    
    return Array.from(ringMap.entries()).sort((a, b) => a[0] - b[0]);
  }, [nodes]);

  const maxRing = Math.max(...nodes.map(n => n.position_ring), 1);
  const viewBoxSize = (maxRing * RING_SPACING + RING_RADIUS_BASE) * 2 + 100;
  const center = viewBoxSize / 2;

  // Calculate node position
  const getNodePosition = (ring: number, angle: number) => {
    const radius = RING_RADIUS_BASE + (ring - 1) * RING_SPACING;
    const radians = (angle - 90) * (Math.PI / 180); // Start from top
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-gold fill-gold/20 stroke-gold/60';
      case 'active': return 'text-purple-400 fill-purple-500/20 stroke-purple-500/60';
      default: return 'text-muted-foreground/40 fill-muted/20 stroke-muted/40';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'completed': return 'drop-shadow-[0_0_8px_rgba(201,164,92,0.5)]';
      case 'active': return 'drop-shadow-[0_0_8px_rgba(147,51,234,0.4)]';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full max-w-[600px] max-h-[600px]"
      >
        {/* Background rings */}
        {Array.from({ length: maxRing }, (_, i) => i + 1).map((ring) => {
          const radius = RING_RADIUS_BASE + (ring - 1) * RING_SPACING;
          return (
            <circle
              key={`ring-${ring}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
              strokeOpacity={0.15}
              strokeDasharray="4 8"
            />
          );
        })}

        {/* Center point */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <circle
            cx={center}
            cy={center}
            r={CENTER_SIZE / 2}
            className="fill-gold/10 stroke-gold/40"
            strokeWidth={2}
          />
          <foreignObject
            x={center - 12}
            y={center - 12}
            width={24}
            height={24}
          >
            <div className="flex items-center justify-center w-full h-full">
              <Moon className="w-5 h-5 text-gold" />
            </div>
          </foreignObject>
        </motion.g>

        {/* Connection lines */}
        {nodes.map((node) => {
          if (node.position_ring === 1) return null;
          
          const pos = getNodePosition(node.position_ring, node.position_angle);
          const innerPos = getNodePosition(node.position_ring - 1, node.position_angle);
          
          return (
            <motion.line
              key={`line-${node.id}`}
              x1={innerPos.x}
              y1={innerPos.y}
              x2={pos.x}
              y2={pos.y}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeOpacity={node.status === 'locked' ? 0.1 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + node.ordem * 0.05, duration: 0.5 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => {
          const pos = getNodePosition(node.position_ring, node.position_angle);
          const Icon = getNodeIcon(node.node_type, node.icon);
          const isSelected = node.id === selectedNodeId;
          const nodeSize = node.status === 'locked' ? 28 : 36;

          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.4 + index * 0.05,
                type: 'spring',
                damping: 15
              }}
              className={cn(
                'cursor-pointer transition-all duration-200',
                getStatusGlow(node.status)
              )}
              onClick={() => onNodeSelect(isSelected ? null : node.id)}
            >
              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeSize / 2}
                className={cn(
                  'transition-all duration-200',
                  getStatusColor(node.status),
                  isSelected && 'stroke-[3]'
                )}
                strokeWidth={isSelected ? 3 : 2}
              />
              
              {/* Selection ring */}
              {isSelected && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize / 2 + 6}
                  fill="none"
                  stroke="hsl(var(--gold))"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                />
              )}

              {/* Icon */}
              <foreignObject
                x={pos.x - nodeSize / 4}
                y={pos.y - nodeSize / 4}
                width={nodeSize / 2}
                height={nodeSize / 2}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {node.status === 'locked' ? (
                    <Lock className="w-3 h-3 text-muted-foreground/40" />
                  ) : (
                    <Icon className={cn(
                      'w-3.5 h-3.5',
                      node.status === 'completed' ? 'text-gold' : 'text-purple-400'
                    )} />
                  )}
                </div>
              </foreignObject>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
