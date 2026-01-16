import { MindMapNode } from '@/types/mindmap';

interface MindMapConnectionsProps {
  nodes: MindMapNode[];
}

export function MindMapConnections({ nodes }: MindMapConnectionsProps) {
  const nodesMap = new Map(nodes.map(n => [n.id, n]));

  const connections = nodes
    .filter(n => n.parent_id)
    .map(child => {
      const parent = nodesMap.get(child.parent_id!);
      if (!parent) return null;

      return {
        id: `${parent.id}-${child.id}`,
        x1: parent.position_x,
        y1: parent.position_y,
        x2: child.position_x,
        y2: child.position_y,
        color: child.color || parent.color
      };
    })
    .filter(Boolean);

  if (connections.length === 0) return null;

  // Find bounds
  const allX = nodes.map(n => n.position_x);
  const allY = nodes.map(n => n.position_y);
  const minX = Math.min(...allX) - 200;
  const minY = Math.min(...allY) - 200;
  const maxX = Math.max(...allX) + 200;
  const maxY = Math.max(...allY) + 200;
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: minX,
        top: minY,
        width,
        height,
        overflow: 'visible'
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--muted-foreground))"
            opacity={0.5}
          />
        </marker>
      </defs>
      
      {connections.map(conn => {
        if (!conn) return null;
        
        const x1 = conn.x1 - minX;
        const y1 = conn.y1 - minX;
        const x2 = conn.x2 - minX;
        const y2 = conn.y2 - minY;

        // Bezier curve control points
        const midY = (y1 + y2) / 2;
        const dx = Math.abs(x2 - x1);
        const controlOffset = Math.min(dx * 0.5, 50);

        const path = `M ${conn.x1 - minX} ${conn.y1 - minY} 
                      C ${conn.x1 - minX} ${conn.y1 - minY + controlOffset},
                        ${conn.x2 - minX} ${conn.y2 - minY - controlOffset},
                        ${conn.x2 - minX} ${conn.y2 - minY}`;

        return (
          <path
            key={conn.id}
            d={path}
            fill="none"
            stroke={conn.color || 'hsl(var(--muted-foreground))'}
            strokeWidth={2}
            strokeOpacity={0.4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
