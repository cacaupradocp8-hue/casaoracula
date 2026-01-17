import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMindMapEditor } from '@/hooks/useMindMaps';
import { MindMapCanvas } from '@/components/mindmap/MindMapCanvas';
import { MindMapSidePanel } from '@/components/mindmap/MindMapSidePanel';
import { MindMapToolbar } from '@/components/mindmap/MindMapToolbar';
import { MindMapNode, NodeWithChildren } from '@/types/mindmap';
import { toast } from 'sonner';

export default function MapaVivoEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const {
    map,
    nodes,
    loading,
    saving,
    lastSaved,
    updateMapTitle,
    createNode,
    updateNode,
    deleteNode
  } = useMindMapEditor(id);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [titleValue, setTitleValue] = useState('');

  // Update title when map loads
  if (map && titleValue === '' && map.title) {
    setTitleValue(map.title);
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

  const handleTitleChange = useCallback((title: string) => {
    setTitleValue(title);
  }, []);

  const handleTitleBlur = useCallback(() => {
    if (titleValue && titleValue !== map?.title) {
      updateMapTitle(titleValue);
    }
  }, [titleValue, map?.title, updateMapTitle]);

  const handleCreateChild = useCallback(async (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    // Position new node below and slightly to the right of parent
    const siblings = nodes.filter(n => n.parent_id === parentId);
    const offsetX = (siblings.length % 3 - 1) * 150;
    const offsetY = 120 + Math.floor(siblings.length / 3) * 80;

    const newNode = await createNode(parentId, {
      x: parent.position_x + offsetX,
      y: parent.position_y + offsetY
    });

    if (newNode) {
      setSelectedNodeId(newNode.id);
    }
  }, [nodes, createNode]);

  const handleCreateRootNode = useCallback(async () => {
    const rootNodes = nodes.filter(n => !n.parent_id);
    const newX = 400 + rootNodes.length * 200;
    
    const newNode = await createNode(null, { x: newX, y: 300 });
    if (newNode) {
      setSelectedNodeId(newNode.id);
    }
  }, [nodes, createNode]);

  const handleUpdateNode = useCallback(async (nodeId: string, updates: Partial<MindMapNode>) => {
    await updateNode(nodeId, updates);
  }, [updateNode]);

  const handleDeleteNode = useCallback(async (nodeId: string) => {
    const rootNodes = nodes.filter(n => !n.parent_id);
    if (rootNodes.length === 1 && rootNodes[0].id === nodeId) {
      toast.error('Não é possível excluir o único nó raiz');
      return;
    }

    await deleteNode(nodeId);
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [nodes, deleteNode, selectedNodeId]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleZoomReset = () => setZoom(1);

  const buildTree = (parentId: string | null = null): NodeWithChildren[] => {
    return nodes
      .filter(n => n.parent_id === parentId)
      .sort((a, b) => a.order_index - b.order_index)
      .map(node => ({
        ...node,
        children: buildTree(node.id)
      }));
  };

  const handleExportPng = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const result = await html2canvas(canvas, {
        backgroundColor: null,
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `${map?.title || 'mapa'}.png`;
      link.href = result.toDataURL('image/png');
      link.click();
      toast.success('PNG exportado!');
    } catch (error) {
      toast.error('Erro ao exportar PNG');
      console.error(error);
    }
  };

  const handleExportText = () => {
    const tree = buildTree();
    
    const renderNode = (node: NodeWithChildren, indent: number = 0): string => {
      const prefix = '  '.repeat(indent) + (indent > 0 ? '└─ ' : '');
      let text = prefix + node.title;
      if (node.notes) {
        text += `\n${'  '.repeat(indent + 1)}   [${node.notes}]`;
      }
      if (node.children.length > 0) {
        text += '\n' + node.children.map(c => renderNode(c, indent + 1)).join('\n');
      }
      return text;
    };

    const textContent = tree.map(n => renderNode(n)).join('\n\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${map?.title || 'mapa'}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    toast.success('Texto exportado!');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!map) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Mapa não encontrado</p>
        <Button onClick={() => navigate('/ferramentas/mapa-vivo')}>
          Voltar para lista
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-12 border-b bg-card px-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/ferramentas/mapa-vivo')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
      </div>

      {/* Toolbar */}
      <MindMapToolbar
        title={titleValue}
        onTitleChange={handleTitleChange}
        onTitleBlur={handleTitleBlur}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onExportPng={handleExportPng}
        onExportText={handleExportText}
        saving={saving}
        lastSaved={lastSaved}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div ref={canvasRef} className="flex-1 relative">
          <MindMapCanvas
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            zoom={zoom}
            onSelectNode={setSelectedNodeId}
            onUpdateNode={handleUpdateNode}
            onCreateChild={handleCreateChild}
            onDeleteNode={handleDeleteNode}
          />

          {/* Floating add button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 left-4 gap-2 shadow-md"
            onClick={handleCreateRootNode}
          >
            <Plus className="h-4 w-4" />
            Novo Nó Raiz
          </Button>
        </div>

        {/* Side panel */}
        {selectedNode && (
          <MindMapSidePanel
            node={selectedNode}
            onClose={() => setSelectedNodeId(null)}
            onUpdate={(updates) => handleUpdateNode(selectedNode.id, updates)}
          />
        )}
      </div>
    </div>
  );
}
