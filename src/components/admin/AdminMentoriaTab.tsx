import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { postMentoriaSchema, getValidationError } from '@/lib/validations';

type PostTipo = 'aviso' | 'evento' | 'supervisao';
type PostStatus = 'rascunho' | 'publicado' | 'arquivado';

interface Post {
  id: string;
  tipo: PostTipo;
  titulo: string;
  texto: string;
  status: PostStatus;
  data_evento?: string;
  link_evento?: string;
}

interface FormState {
  tipo: PostTipo;
  titulo: string;
  texto: string;
  status: PostStatus;
  data_evento: string;
  link_evento: string;
}

export function AdminMentoriaTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState<FormState>({ tipo: 'aviso', titulo: '', texto: '', status: 'rascunho', data_evento: '', link_evento: '' });
  const { toast } = useToast();

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts_mentoria').select('*').order('created_at', { ascending: false });
    setPosts((data || []) as Post[]);
    setIsLoading(false);
  };

  const openDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setForm({ tipo: post.tipo, titulo: post.titulo, texto: post.texto, status: post.status, data_evento: post.data_evento || '', link_evento: post.link_evento || '' });
    } else {
      setEditingPost(null);
      setForm({ tipo: 'aviso', titulo: '', texto: '', status: 'rascunho', data_evento: '', link_evento: '' });
    }
    setDialogOpen(true);
  };

  const savePost = async () => {
    const validation = postMentoriaSchema.safeParse(form);
    const error = getValidationError(validation);
    if (error) {
      toast({ title: 'Erro de validação', description: error, variant: 'destructive' });
      return;
    }

    const payload = { ...form, data_evento: form.data_evento || null, link_evento: form.link_evento || null };
    const { error: dbError } = editingPost 
      ? await supabase.from('posts_mentoria').update(payload).eq('id', editingPost.id)
      : await supabase.from('posts_mentoria').insert(payload);
    
    if (dbError) {
      toast({ title: 'Erro ao salvar', description: dbError.message, variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Salvo!' });
    setDialogOpen(false);
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    await supabase.from('posts_mentoria').delete().eq('id', id);
    toast({ title: 'Excluído!' });
    fetchPosts();
  };

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => openDialog()} variant="gold"><Plus className="w-4 h-4 mr-2" /> Novo Post</Button>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <Card key={post.id} className="glass">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{post.titulo}</CardTitle>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{post.tipo}</Badge>
                  <Badge variant={post.status === 'publicado' ? 'default' : 'secondary'}>{post.status}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => openDialog(post)}><Edit className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Excluir post?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deletePost(post.id)}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent><p className="text-sm text-muted-foreground line-clamp-2">{post.texto}</p></CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPost ? 'Editar Post' : 'Novo Post'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Tipo</Label><Select value={form.tipo} onValueChange={v => setForm(p => ({ ...p, tipo: v as PostTipo }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="aviso">Aviso</SelectItem><SelectItem value="evento">Evento</SelectItem><SelectItem value="supervisao">Supervisão</SelectItem></SelectContent></Select></div>
              <div><Label>Status</Label><Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as PostStatus }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rascunho">Rascunho</SelectItem><SelectItem value="publicado">Publicado</SelectItem><SelectItem value="arquivado">Arquivado</SelectItem></SelectContent></Select></div>
            </div>
            <div><Label>Título</Label><Input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} /></div>
            <div><Label>Texto</Label><Textarea value={form.texto} onChange={e => setForm(p => ({ ...p, texto: e.target.value }))} rows={4} /></div>
            {form.tipo === 'evento' && (
              <>
                <div><Label>Data/Hora</Label><Input type="datetime-local" value={form.data_evento} onChange={e => setForm(p => ({ ...p, data_evento: e.target.value }))} /></div>
                <div><Label>Link</Label><Input value={form.link_evento} onChange={e => setForm(p => ({ ...p, link_evento: e.target.value }))} /></div>
              </>
            )}
            <Button onClick={savePost} variant="gold" className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
