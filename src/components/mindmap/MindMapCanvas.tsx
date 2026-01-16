import { useRef, useState, useCallback, useEffect } from 'react';
import { MindMapNode } from '@/types/mindmap';
import { MindMapNodeComponent } from './MindMapNodeComponent';
import { MindMapConnections } from './MindMapConnections';

interface MindMapCanvasProps {
  nodes: MindMapNode[];
  selectedNodeId: string | null;
  zoom: number;
  onSelectNode: (id: string | null) => void;
  onUpdateNode: (id: string, updates: Partial<MindMapNode>) => void;
  onCreateChild: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
}

export function MindMapCanvas({
  nodes,
  selectedNodeId,
  zoom,
  onSelectNode,
  onUpdateNode,
  onCreateChild,
  onDeleteNode
}: MindMapCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      onSelectNode(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
    
    if (draggingNodeId) {
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        const newX = (e.clientX - dragOffset.x - pan.x) / zoom;
        const newY = (e.clientY - dragOffset.y - pan.y) / zoom;
        onUpdateNode(draggingNodeId, { position_x: newX, position_y: newY });
      }
    }
  }, [isPanning, panStart, draggingNodeId, dragOffset, pan, zoom, nodes, onUpdateNode]);

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggingNodeId(nodeId);
      setDragOffset({
        x: e.clientX - (node.position_x * zoom + pan.x),
        y: e.clientY - (node.position_y * zoom + pan.y)
      });
      onSelectNode(nodeId);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedNodeId) return;
      
      const activeElement = document.activeElement;
      const isEditing = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      
      if (isEditing) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        onCreateChild(selectedNodeId);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const selectedNode = nodes.find(n => n.id === selectedNodeId);
        if (selectedNode?.parent_id) {
          onCreateChild(selectedNode.parent_id);
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        const rootNodes = nodes.filter(n => !n.parent_id);
        if (rootNodes.length === 1 && rootNodes[0].id === selectedNodeId) {
          return; // Don't delete the only root node
        }
        onDeleteNode(selectedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, nodes, onCreateChild, onDeleteNode]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-background cursor-grab active:cursor-grabbing"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
    >
      {/* Background pattern */}
      <div
        className="canvas-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, hsl(var(--muted-foreground) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Content layer */}
      <div
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* SVG connections */}
        <MindMapConnections nodes={nodes} />

        {/* Nodes */}
        {nodes.map(node => (
          <MindMapNodeComponent
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={() => onSelectNode(node.id)}
            onDragStart={(e) => handleNodeDragStart(node.id, e)}
            onUpdateTitle={(title) => onUpdateNode(node.id, { title })}
            onAddChild={() => onCreateChild(node.id)}
          />
        ))}
      </div>
    </div>
  );
}
