import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageSquare, Pin, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Forum { id: string; nome: string; descricao: string | null; icone: string; }
interface Topic {
  id: string; forum_id: string; autor_id: string; titulo: string; conteudo: string;
  fixado: boolean; respostas_count: number; ultima_atividade: string; created_at: string;
  autor_nome?: string;
}
interface Reply { id: string; autor_id: string; conteudo: string; created_at: string; autor_nome?: string; }

export function CommunityForums() {
  const { user } = useAuth();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [topicForm, setTopicForm] = useState({ titulo: '', conteudo: '' });
  const [newReply, setNewReply] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from('community_forums').select('*').eq('ativo', true).order('ordem')
      .then(({ data }) => { setForums((data as Forum[]) || []); setLoading(false); });
  }, []);

  const loadTopics = async (forum: Forum) => {
    setSelectedForum(forum);
    setSelectedTopic(null);
    const { data } = await supabase.from('community_topics').select('*').eq('forum_id', forum.id).order('fixado', { ascending: false }).order('ultima_atividade', { ascending: false });
    if (data) {
      const ids = [...new Set(data.map(t => t.autor_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, nome').in('id', ids);
      const map: Record<string, string> = {};
      profiles?.forEach(p => { map[p.id] = p.nome || 'Anônima'; });
      setTopics(data.map(t => ({ ...t, autor_nome: map[t.autor_id] })));
    }
  };

  const loadReplies = async (topic: Topic) => {
    setSelectedTopic(topic);
    const { data } = await supabase.from('community_topic_replies').select('*').eq('topic_id', topic.id).order('created_at');
    if (data) {
      const ids = [...new Set(data.map(r => r.autor_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, nome').in('id', ids);
      const map: Record<string, string> = {};
      profiles?.forEach(p => { map[p.id] = p.nome || 'Anônima'; });
      setReplies(data.map(r => ({ ...r, autor_nome: map[r.autor_id] })));
    }
  };

  const createTopic = async () => {
    if (!user || !selectedForum || !topicForm.titulo.trim() || !topicForm.conteudo.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('community_topics').insert({
      forum_id: selectedForum.id, autor_id: user.id,
      titulo: topicForm.titulo.trim(), conteudo: topicForm.conteudo.trim(),
    });
    setSaving(false);
    if (error) toast.error('Erro ao criar tópico');
    else {
      toast.success('Tópico criado!');
      setTopicForm({ titulo: '', conteudo: '' });
      setNewTopicOpen(false);
      loadTopics(selectedForum);
    }
  };

  const addReply = async () => {
    if (!user || !selectedTopic || !newReply.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('community_topic_replies').insert({
      topic_id: selectedTopic.id, autor_id: user.id, conteudo: newReply.trim(),
    });
    setSaving(false);
    if (error) toast.error('Erro');
    else { setNewReply(''); loadReplies(selectedTopic); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  // Topic detail view
  if (selectedTopic) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTopic(null)} className="text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        <Card className="bg-[#0F2438] border-primary/15">
          <CardHeader>
            <CardTitle className="text-foreground">{selectedTopic.titulo}</CardTitle>
            <p className="text-xs text-muted-foreground">por {selectedTopic.autor_nome}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 whitespace-pre-line">{selectedTopic.conteudo}</p>
          </CardContent>
        </Card>
        <div className="space-y-3 pl-4 border-l-2 border-primary/10">
          {replies.map(r => (
            <div key={r.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6"><AvatarFallback className="bg-primary/10 text-primary text-[10px]">{(r.autor_nome || '?')[0]}</AvatarFallback></Avatar>
                <span className="text-xs font-medium text-foreground">{r.autor_nome}</span>
                <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: ptBR })}</span>
              </div>
              <p className="text-sm text-foreground/70 pl-8">{r.conteudo}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Textarea value={newReply} onChange={e => setNewReply(e.target.value)} placeholder="Responder..." className="min-h-[60px] bg-background border-primary/10" maxLength={2000} />
          <Button onClick={addReply} disabled={saving || !newReply.trim()} className="bg-primary text-primary-foreground self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Topics list
  if (selectedForum) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSelectedForum(null)} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-1" /> Fóruns
          </Button>
          <Dialog open={newTopicOpen} onOpenChange={setNewTopicOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground"><Plus className="w-3 h-3 mr-1" /> Novo Tópico</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B1B2B] border-primary/20">
              <DialogHeader><DialogTitle className="text-foreground">Novo Tópico em {selectedForum.nome}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-2">
                <Input value={topicForm.titulo} onChange={e => setTopicForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título do tópico" className="bg-background border-primary/10" maxLength={200} />
                <Textarea value={topicForm.conteudo} onChange={e => setTopicForm(f => ({ ...f, conteudo: e.target.value }))} placeholder="Conteúdo..." className="min-h-[100px] bg-background border-primary/10" maxLength={5000} />
                <Button onClick={createTopic} disabled={saving} className="w-full bg-primary text-primary-foreground">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Criar Tópico
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <h3 className="text-lg font-medium text-foreground">{selectedForum.icone} {selectedForum.nome}</h3>
        {topics.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum tópico ainda. Crie o primeiro!</p>
        ) : (
          topics.map(t => (
            <Card key={t.id} onClick={() => loadReplies(t)} className="bg-[#0F2438] border-primary/10 hover:border-primary/30 cursor-pointer transition-all">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {t.fixado && <Pin className="w-3 h-3 text-primary shrink-0" />}
                    <p className="text-sm font-medium text-foreground truncate">{t.titulo}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.autor_nome} · {formatDistanceToNow(new Date(t.ultima_atividade), { addSuffix: true, locale: ptBR })}</p>
                </div>
                <Badge variant="outline" className="text-xs shrink-0 ml-2">{t.respostas_count} respostas</Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Forums list
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Escolha um fórum para participar das discussões.</p>
      {forums.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Fóruns serão criados em breve.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {forums.map(f => (
            <Card key={f.id} onClick={() => loadTopics(f)} className="bg-[#0F2438] border-primary/10 hover:border-primary/30 cursor-pointer transition-all">
              <CardContent className="py-4 flex items-center gap-3">
                <span className="text-2xl">{f.icone}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.nome}</p>
                  {f.descricao && <p className="text-xs text-muted-foreground">{f.descricao}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
