import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Send, Reply, Trash2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ForumPost {
  id: string;
  module_id: string;
  user_id: string;
  parent_id: string | null;
  conteudo: string;
  is_instructor_reply: boolean;
  created_at: string;
  user_name?: string;
  replies?: ForumPost[];
}

interface ModuleForumSectionProps {
  moduleId: string;
  moduleTitle: string;
}

export function ModuleForumSection({ moduleId, moduleTitle }: ModuleForumSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('course_module_forum_posts')
        .select('*')
        .eq('module_id', moduleId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Enrich with user names
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome, email')
        .in('id', userIds.length > 0 ? userIds : ['none']);

      const profileMap = new Map((profiles || []).map(p => [p.id, p.nome || p.email || 'Anônima']));

      const enriched = (data || []).map(p => ({
        ...p,
        user_name: profileMap.get(p.user_id) || 'Anônima',
      }));

      // Separate into threads (parent posts with replies)
      const parentPosts = enriched.filter(p => !p.parent_id);
      const replies = enriched.filter(p => p.parent_id);

      const threaded = parentPosts.map(p => ({
        ...p,
        replies: replies.filter(r => r.parent_id === p.id).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      }));

      setPosts(threaded);
    } catch (err) {
      console.error('Error fetching forum posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [moduleId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSubmitPost = async () => {
    if (!user || !newPost.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('course_module_forum_posts').insert({
        module_id: moduleId,
        user_id: user.id,
        conteudo: newPost.trim(),
      });
      if (error) throw error;
      setNewPost('');
      toast({ title: 'Pergunta publicada!' });
      fetchPosts();
    } catch {
      toast({ title: 'Erro ao publicar', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('course_module_forum_posts').insert({
        module_id: moduleId,
        user_id: user.id,
        parent_id: parentId,
        conteudo: replyContent.trim(),
      });
      if (error) throw error;
      setReplyContent('');
      setReplyingTo(null);
      toast({ title: 'Resposta publicada!' });
      fetchPosts();
    } catch {
      toast({ title: 'Erro ao responder', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await supabase.from('course_module_forum_posts').delete().eq('id', postId);
      toast({ title: 'Post removido' });
      fetchPosts();
    } catch {
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    }
  };

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="w-5 h-5 text-gold" />
          Fórum — {moduleTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* New Post Form */}
        {user && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/20">
            <Textarea
              placeholder="Faça uma pergunta ou compartilhe uma reflexão..."
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              variant="gold"
              size="sm"
              onClick={handleSubmitPost}
              disabled={!newPost.trim() || isSubmitting}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Publicar
            </Button>
          </div>
        )}

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-foreground/40 py-8 text-sm">
            Nenhuma discussão ainda. Seja a primeira a perguntar!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="space-y-2">
                {/* Parent Post */}
                <div className="p-4 rounded-lg bg-card border border-border/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground/80">{post.user_name}</span>
                      {post.is_instructor_reply && (
                        <Badge className="bg-gold/20 text-gold border-gold/20 gap-1 text-xs">
                          <Shield className="w-3 h-3" /> Instrutora
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-foreground/30">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">{post.conteudo}</p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1 text-foreground/40"
                      onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    >
                      <Reply className="w-3 h-3" /> Responder
                    </Button>
                    {user?.id === post.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1 text-destructive/50"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="w-3 h-3" /> Remover
                      </Button>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {post.replies && post.replies.length > 0 && (
                  <div className="ml-6 space-y-2">
                    {post.replies.map(reply => (
                      <div key={reply.id} className="p-3 rounded-lg bg-muted/20 border border-border/10 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground/70">{reply.user_name}</span>
                            {reply.is_instructor_reply && (
                              <Badge className="bg-gold/20 text-gold border-gold/20 gap-1 text-xs">
                                <Shield className="w-3 h-3" /> Instrutora
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-foreground/30">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ptBR })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground/60 leading-relaxed whitespace-pre-wrap">{reply.conteudo}</p>
                        {user?.id === reply.user_id && (
                          <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive/50" onClick={() => handleDelete(reply.id)}>
                            <Trash2 className="w-3 h-3" /> Remover
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post.id && (
                  <div className="ml-6 space-y-2 p-3 rounded-lg bg-muted/10 border border-border/10">
                    <Textarea
                      placeholder="Sua resposta..."
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      rows={2}
                      className="resize-none text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" variant="gold" onClick={() => handleSubmitReply(post.id)} disabled={!replyContent.trim() || isSubmitting} className="gap-1 text-xs">
                        <Send className="w-3 h-3" /> Enviar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setReplyingTo(null); setReplyContent(''); }} className="text-xs">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
