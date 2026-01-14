import { useState, useEffect } from 'react';
import { useAdminBlocks } from '@/hooks/useAdminBlocks';
import { BlockEditor } from './blocks/BlockEditor';
import { BlockPreview } from './blocks/BlockPreview';
import { 
  ContentBlockType, 
  BlockContextType, 
  BLOCK_TYPE_META,
  BlockContent 
} from '@/types/modular';
import { PortalType } from '@/types/portal';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MoreVertical,
  FileText,
  Image,
  Video,
  Music,
  Bot,
  MousePointerClick,
  Loader2,
  Search,
  Circle,
  Gauge,
  BookOpen,
  Moon,
  Target,
  Layers,
  Sparkles,
  MessageSquare,
  Brain,
} from 'lucide-react';

const CONTEXT_OPTIONS: { value: BlockContextType; label: string }[] = [
  { value: 'quiz_result', label: 'Resultado de Quiz' },
  { value: 'portal', label: 'Portal' },
  { value: 'ritual', label: 'Ritual' },
  { value: 'formation', label: 'Formação' },
  { value: 'tool', label: 'Ferramenta' },
  { value: 'sala', label: 'Sala' },
  { value: 'landing', label: 'Landing Page' },
];

const BLOCK_TYPE_ICONS: Record<ContentBlockType, React.ElementType> = {
  rich_text: FileText,
  image: Image,
  video: Video,
  audio: Music,
  ai_chat: Bot,
  cta_button: MousePointerClick,
  chakra_wheel: Circle,
  energy_slider: Gauge,
  pattern_diary: BookOpen,
  lunar_calendar: Moon,
  pendulum_map: Target,
  ego_layers: Layers,
  archetype_card: Sparkles,
  reflection_prompt: MessageSquare,
  plasticity_map: Brain,
};

interface ContextEntity {
  id: string;
  label: string;
}

export function AdminBlocksTab() {
  const [selectedContext, setSelectedContext] = useState<BlockContextType | ''>('');
  const [selectedContextId, setSelectedContextId] = useState<string>('');
  const [contextEntities, setContextEntities] = useState<ContextEntity[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<{
    id?: string;
    blockType: ContentBlockType;
    content?: BlockContent;
    titulo?: string;
    descricao?: string;
    portalMinimo?: PortalType;
    agenteId?: string;
  } | null>(null);

  const {
    blocks,
    isLoading,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    toggleActive,
  } = useAdminBlocks({
    contextType: selectedContext || undefined,
    contextId: selectedContextId || undefined,
  });

  // Fetch entities for the selected context type
  useEffect(() => {
    if (!selectedContext) {
      setContextEntities([]);
      setSelectedContextId('');
      return;
    }

    const fetchEntities = async () => {
      setIsLoadingEntities(true);
      let data: ContextEntity[] = [];

      try {
        switch (selectedContext) {
          case 'quiz_result': {
            const { data: results } = await supabase
              .from('quiz_resultados')
              .select('id, titulo_simbolico')
              .order('titulo_simbolico');
            data = results?.map(r => ({ id: r.id, label: r.titulo_simbolico })) || [];
            break;
          }
          case 'portal': {
            const { data: portals } = await supabase
              .from('conteudo_travessias')
              .select('id, titulo')
              .order('titulo');
            data = portals?.map(p => ({ id: p.id, label: p.titulo })) || [];
            break;
          }
          case 'sala': {
            const { data: salas } = await supabase
              .from('salas')
              .select('id, nome_exibicao')
              .order('nome_exibicao');
            data = salas?.map(s => ({ id: s.id, label: s.nome_exibicao })) || [];
            break;
          }
          case 'formation': {
            const { data: formations } = await supabase
              .from('formacoes')
              .select('id, titulo')
              .order('titulo');
            data = formations?.map(f => ({ id: f.id, label: f.titulo })) || [];
            break;
          }
          case 'tool': {
            const { data: tools } = await supabase
              .from('sala_ferramentas')
              .select('id, ferramenta_nome')
              .order('ferramenta_nome');
            data = tools?.map(t => ({ id: t.id, label: t.ferramenta_nome })) || [];
            break;
          }
          default:
            // For landing/ritual, allow manual ID input
            break;
        }
      } catch (error) {
        console.error('Error fetching entities:', error);
      }

      setContextEntities(data);
      setIsLoadingEntities(false);
    };

    fetchEntities();
  }, [selectedContext]);

  const openNewBlockDialog = (blockType: ContentBlockType) => {
    setEditingBlock({ blockType });
    setIsEditorOpen(true);
  };

  const openEditBlockDialog = (block: typeof blocks[0]) => {
    setEditingBlock({
      id: block.id,
      blockType: block.blockType,
      content: block.content,
      titulo: block.titulo,
      descricao: block.descricao,
      portalMinimo: block.portalMinimo,
      agenteId: block.agenteId,
    });
    setIsEditorOpen(true);
  };

  const handleSaveBlock = async (data: {
    content: BlockContent;
    titulo?: string;
    descricao?: string;
    portalMinimo: PortalType;
    agenteId?: string;
  }) => {
    if (!editingBlock) return;

    try {
      if (editingBlock.id) {
        await updateBlock(editingBlock.id, data);
      } else {
        await createBlock(editingBlock.blockType, data.content, {
          titulo: data.titulo,
          descricao: data.descricao,
          portalMinimo: data.portalMinimo,
          agenteId: data.agenteId,
        });
      }
      setIsEditorOpen(false);
      setEditingBlock(null);
    } catch (error) {
      console.error('Error saving block:', error);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm('Tem certeza que deseja excluir este bloco?')) {
      await deleteBlock(blockId);
    }
  };

  const needsManualId = selectedContext === 'landing' || selectedContext === 'ritual';

  return (
    <div className="space-y-6">
      {/* Context Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Selecionar Contexto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Contexto</Label>
              <Select 
                value={selectedContext} 
                onValueChange={(v) => {
                  setSelectedContext(v as BlockContextType);
                  setSelectedContextId('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {CONTEXT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedContext && !needsManualId && (
              <div className="space-y-2">
                <Label>Entidade</Label>
                <Select 
                  value={selectedContextId} 
                  onValueChange={setSelectedContextId}
                  disabled={isLoadingEntities}
                >
                  <SelectTrigger>
                    {isLoadingEntities ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <SelectValue placeholder="Selecione..." />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {contextEntities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedContext && needsManualId && (
              <div className="space-y-2">
                <Label>ID do Contexto</Label>
                <Input
                  value={selectedContextId}
                  onChange={e => setSelectedContextId(e.target.value)}
                  placeholder="Digite o ID único..."
                />
              </div>
            )}

            {selectedContext && selectedContextId && (
              <div className="flex items-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Bloco
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {(Object.keys(BLOCK_TYPE_META) as ContentBlockType[]).map(type => {
                      const Icon = BLOCK_TYPE_ICONS[type];
                      return (
                        <DropdownMenuItem 
                          key={type} 
                          onClick={() => openNewBlockDialog(type)}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {BLOCK_TYPE_META[type].label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blocks List */}
      {selectedContext && selectedContextId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Blocos
              <Badge variant="secondary">{blocks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : blocks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum bloco encontrado para este contexto.</p>
                <p className="text-sm">Use o botão acima para adicionar o primeiro bloco.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => {
                  const Icon = BLOCK_TYPE_ICONS[block.blockType];
                  return (
                    <div
                      key={block.id}
                      className={`
                        flex items-center gap-4 p-4 border rounded-lg
                        ${block.ativo ? 'bg-card' : 'bg-muted/50 opacity-60'}
                      `}
                    >
                      {/* Order Controls */}
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => reorderBlocks(block.id, 'up')}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === blocks.length - 1}
                          onClick={() => reorderBlocks(block.id, 'down')}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Block Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {BLOCK_TYPE_META[block.blockType].label}
                          </span>
                          {block.titulo && (
                            <span className="text-muted-foreground truncate">
                              — {block.titulo}
                            </span>
                          )}
                        </div>
                        <BlockPreview block={block} compact />
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-2">
                        <Badge variant={block.ativo ? 'default' : 'secondary'}>
                          {block.portalMinimo}
                        </Badge>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(block.id)}
                          title={block.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {block.ativo ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditBlockDialog(block)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBlock(block.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Block Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlock?.id ? 'Editar Bloco' : 'Novo Bloco'}
              {editingBlock && ` — ${BLOCK_TYPE_META[editingBlock.blockType].label}`}
            </DialogTitle>
          </DialogHeader>
          {editingBlock && (
            <BlockEditor
              blockType={editingBlock.blockType}
              initialContent={editingBlock.content}
              initialTitulo={editingBlock.titulo}
              initialDescricao={editingBlock.descricao}
              initialPortalMinimo={editingBlock.portalMinimo}
              initialAgenteId={editingBlock.agenteId}
              onSave={handleSaveBlock}
              onCancel={() => {
                setIsEditorOpen(false);
                setEditingBlock(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
