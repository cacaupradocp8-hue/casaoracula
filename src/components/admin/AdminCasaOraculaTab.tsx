import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye, EyeOff, Ear, BookOpen, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Room = 'sustentacao' | 'leitura' | 'circulo';
type MediaType = 'audio' | 'text' | 'video' | 'link' | 'pdf';
type PortalType = 'visitante' | 'pre_iniciada' | 'iniciada' | 'admin';

interface CasaPost {
  id: string;
  room: Room;
  titulo: string;
  descricao: string | null;
  conteudo: string | null;
  media_url: string | null;
  media_type: MediaType;
  duracao_segundos: number | null;
  tags: string[] | null;
  publicado: boolean;
  destaque: boolean;
  ordem: number;
  portal_minimo: PortalType;
  created_at: string;
}

interface Thread {
  id: string;
  titulo: string;
  status: string;
  fixado: boolean;
  respostas_count: number;
  created_at: string;
}

const emptyPost: Partial<CasaPost> = {
  room: 'sustentacao',
  titulo: '',
  descricao: '',
  conteudo: '',
  media_url: '',
  media_type: 'text',
  duracao_segundos: null,
  tags: [],
  publicado: false,
  destaque: false,
  ordem: 0,
  portal_minimo: 'iniciada',
};

export default function AdminCasaOraculaTab() {
  const [activeRoom, setActiveRoom] = useState<Room>('sustentacao');
  const [posts, setPosts] = useState<CasaPost[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<CasaPost> | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (activeRoom === 'circulo') {
      fetchThreads();
    } else {
      fetchPosts();
    }
  }, [activeRoom]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('casa_posts')
        .select('*')
        .eq('room', activeRoom)
        .order('ordem', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as CasaPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Erro ao carregar conteúdos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('casa_circulo_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThreads((data || []) as Thread[]);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openDialog = (post?: CasaPost) => {
    if (post) {
      setEditingPost(post);
      setTagsInput(post.tags?.join(', ') || '');
    } else {
      setEditingPost({ ...emptyPost, room: activeRoom });
      setTagsInput('');
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPost?.titulo?.trim()) {
      toast({ title: 'Título é obrigatório', variant: 'destructive' });
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const payload = {
        room: editingPost.room,
        titulo: editingPost.titulo?.trim(),
        descricao: editingPost.descricao?.trim() || null,
        conteudo: editingPost.conteudo?.trim() || null,
        media_url: editingPost.media_url?.trim() || null,
        media_type: editingPost.media_type || 'text',
        duracao_segundos: editingPost.duracao_segundos || null,
        tags: tags.length > 0 ? tags : null,
        publicado: editingPost.publicado || false,
        destaque: editingPost.destaque || false,
        ordem: editingPost.ordem || 0,
        portal_minimo: editingPost.portal_minimo || 'iniciada',
      };

      if (editingPost.id) {
        const { error } = await supabase
          .from('casa_posts')
          .update(payload)
          .eq('id', editingPost.id);
        if (error) throw error;
        toast({ title: 'Conteúdo atualizado!' });
      } else {
        const { error } = await supabase
          .from('casa_posts')
          .insert(payload);
        if (error) throw error;
        toast({ title: 'Conteúdo criado!' });
      }

      setDialogOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este conteúdo?')) return;

    try {
      const { error } = await supabase
        .from('casa_posts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Conteúdo excluído' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
    }
  };

  const togglePublish = async (post: CasaPost) => {
    try {
      const { error } = await supabase
        .from('casa_posts')
        .update({ publicado: !post.publicado })
        .eq('id', post.id);
      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const toggleThreadStatus = async (thread: Thread) => {
    try {
      const newStatus = thread.status === 'aberto' ? 'fechado' : 'aberto';
      const { error } = await supabase
        .from('casa_circulo_threads')
        .update({ status: newStatus })
        .eq('id', thread.id);
      if (error) throw error;
      fetchThreads();
    } catch (error) {
      console.error('Error toggling thread status:', error);
    }
  };

  const toggleThreadPin = async (thread: Thread) => {
    try {
      const { error } = await supabase
        .from('casa_circulo_threads')
        .update({ fixado: !thread.fixado })
        .eq('id', thread.id);
      if (error) throw error;
      fetchThreads();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const roomConfig = {
    sustentacao: { icon: Ear, label: 'Sustentação', color: 'text-purple-400' },
    leitura: { icon: BookOpen, label: 'Leitura', color: 'text-gold' },
    circulo: { icon: Users, label: 'Círculo', color: 'text-blue-400' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Casa Orácula</h2>
        {activeRoom !== 'circulo' && (
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Conteúdo
          </Button>
        )}
      </div>

      <Tabs value={activeRoom} onValueChange={(v) => setActiveRoom(v as Room)}>
        <TabsList>
          {Object.entries(roomConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Sustentação & Leitura Content */}
        {['sustentacao', 'leitura'].map((room) => (
          <TabsContent key={room} value={room}>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Portal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : posts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum conteúdo cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{post.titulo}</p>
                            {post.destaque && <Badge variant="secondary" className="text-xs mt-1">Destaque</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{post.media_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{post.portal_minimo}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish(post)}
                            className={post.publicado ? 'text-green-500' : 'text-muted-foreground'}
                          >
                            {post.publicado ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(post.created_at), 'dd/MM/yy', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openDialog(post)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        ))}

        {/* Círculo Content - Thread Management */}
        <TabsContent value="circulo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moderação de Tópicos</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fixado</TableHead>
                  <TableHead>Criado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : threads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum tópico criado
                    </TableCell>
                  </TableRow>
                ) : (
                  threads.map((thread) => (
                    <TableRow key={thread.id}>
                      <TableCell className="font-medium">{thread.titulo}</TableCell>
                      <TableCell>{thread.respostas_count}</TableCell>
                      <TableCell>
                        <Badge variant={thread.status === 'aberto' ? 'default' : 'secondary'}>
                          {thread.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={thread.fixado}
                          onCheckedChange={() => toggleThreadPin(thread)}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(thread.created_at), 'dd/MM/yy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleThreadStatus(thread)}
                        >
                          {thread.status === 'aberto' ? 'Fechar' : 'Reabrir'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost?.id ? 'Editar Conteúdo' : 'Novo Conteúdo'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sala</Label>
                <Select
                  value={editingPost?.room || 'sustentacao'}
                  onValueChange={(v) => setEditingPost(prev => ({ ...prev, room: v as Room }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sustentacao">Sustentação</SelectItem>
                    <SelectItem value="leitura">Leitura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Mídia</Label>
                <Select
                  value={editingPost?.media_type || 'text'}
                  onValueChange={(v) => setEditingPost(prev => ({ ...prev, media_type: v as MediaType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="audio">Áudio</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={editingPost?.titulo || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Título do conteúdo"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={editingPost?.descricao || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição breve"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo (texto completo)</Label>
              <Textarea
                value={editingPost?.conteudo || ''}
                onChange={(e) => setEditingPost(prev => ({ ...prev, conteudo: e.target.value }))}
                placeholder="Texto completo do conteúdo"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>URL da Mídia</Label>
                <Input
                  value={editingPost?.media_url || ''}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, media_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              {editingPost?.media_type === 'audio' && (
                <div className="space-y-2">
                  <Label>Duração (segundos)</Label>
                  <Input
                    type="number"
                    value={editingPost?.duracao_segundos || ''}
                    onChange={(e) => setEditingPost(prev => ({ ...prev, duracao_segundos: parseInt(e.target.value) || null }))}
                    placeholder="180"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags (separadas por vírgula)</Label>
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="limites, ética, projeção"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Portal Mínimo</Label>
                <Select
                  value={editingPost?.portal_minimo || 'iniciada'}
                  onValueChange={(v) => setEditingPost(prev => ({ ...prev, portal_minimo: v as PortalType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitante">Visitante</SelectItem>
                    <SelectItem value="pre_iniciada">Pré-iniciada</SelectItem>
                    <SelectItem value="iniciada">Iniciada</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input
                  type="number"
                  value={editingPost?.ordem || 0}
                  onChange={(e) => setEditingPost(prev => ({ ...prev, ordem: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPost?.publicado || false}
                  onCheckedChange={(v) => setEditingPost(prev => ({ ...prev, publicado: v }))}
                />
                <Label>Publicado</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={editingPost?.destaque || false}
                  onCheckedChange={(v) => setEditingPost(prev => ({ ...prev, destaque: v }))}
                />
                <Label>Destaque</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
