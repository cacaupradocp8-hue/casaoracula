import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Send, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: string;
  autor_id: string;
  conteudo: string;
  curtidas_count: number;
  comentarios_count: number;
  created_at: string;
  autor_nome?: string;
  liked?: boolean;
}

interface Comment {
  id: string;
  autor_id: string;
  conteudo: string;
  created_at: string;
  autor_nome?: string;
}

export function CommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const loadPosts = async () => {
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*')
      .eq('publicado', true)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!postsData) { setLoading(false); return; }

    // Get author names
    const authorIds = [...new Set(postsData.map(p => p.autor_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nome')
      .in('id', authorIds);
    const nameMap: Record<string, string> = {};
    profiles?.forEach(p => { nameMap[p.id] = p.nome || 'Anônima'; });

    // Get user likes
    let likedIds: string[] = [];
    if (user) {
      const { data: likes } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id);
      likedIds = likes?.map(l => l.post_id) || [];
    }

    setPosts(postsData.map(p => ({
      ...p,
      autor_nome: nameMap[p.autor_id],
      liked: likedIds.includes(p.id),
    })));
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, [user]);

  const createPost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);
    const { error } = await supabase.from('community_posts').insert({
      autor_id: user.id,
      conteudo: newPost.trim(),
    });
    setPosting(false);
    if (error) toast.error('Erro ao publicar');
    else {
      toast.success('Post publicado!');
      setNewPost('');
      loadPosts();
    }
  };

  const toggleLike = async (post: Post) => {
    if (!user) return;
    if (post.liked) {
      await supabase.from('community_likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    } else {
      await supabase.from('community_likes').insert({ user_id: user.id, post_id: post.id });
    }
    setPosts(prev => prev.map(p =>
      p.id === post.id
        ? { ...p, liked: !p.liked, curtidas_count: p.curtidas_count + (p.liked ? -1 : 1) }
        : p
    ));
  };

  const loadComments = async (postId: string) => {
    if (expandedComments === postId) { setExpandedComments(null); return; }
    setExpandedComments(postId);
    setLoadingComments(true);
    const { data } = await supabase
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at');
    if (data) {
      const authorIds = [...new Set(data.map(c => c.autor_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, nome').in('id', authorIds);
      const nameMap: Record<string, string> = {};
      profiles?.forEach(p => { nameMap[p.id] = p.nome || 'Anônima'; });
      setComments(data.map(c => ({ ...c, autor_nome: nameMap[c.autor_id] })));
    }
    setLoadingComments(false);
  };

  const addComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;
    await supabase.from('community_comments').insert({
      post_id: postId, autor_id: user.id, conteudo: newComment.trim(),
    });
    setNewComment('');
    loadComments(postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comentarios_count: p.comentarios_count + 1 } : p));
  };

  const sharePost = (post: Post) => {
    if (navigator.share) {
      navigator.share({ title: 'Casa das Tecelãs', text: post.conteudo.slice(0, 100) });
    } else {
      navigator.clipboard.writeText(post.conteudo.slice(0, 200));
      toast.success('Conteúdo copiado!');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      {/* New Post */}
      <Card className="bg-[#0F2438] border-primary/15">
        <CardContent className="pt-4 space-y-3">
          <Textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Compartilhe uma reflexão, descoberta ou pergunta com a comunidade..."
            className="min-h-[80px] bg-background border-primary/10 text-foreground placeholder:text-muted-foreground/40"
            maxLength={2000}
          />
          <div className="flex justify-end">
            <Button onClick={createPost} disabled={posting || !newPost.trim()} size="sm" className="bg-primary text-primary-foreground">
              {posting ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
              Publicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Nenhum post ainda. Seja a primeira a compartilhar!</p>
      ) : (
        posts.map(post => (
          <Card key={post.id} className="bg-[#0F2438] border-primary/10">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {(post.autor_nome || '?')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{post.autor_nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-foreground/80 whitespace-pre-line">{post.conteudo}</p>
              <div className="flex gap-4 pt-1">
                <button onClick={() => toggleLike(post)} className={`flex items-center gap-1 text-xs transition-colors ${post.liked ? 'text-red-400' : 'text-muted-foreground hover:text-red-400'}`}>
                  <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} /> {post.curtidas_count}
                </button>
                <button onClick={() => loadComments(post.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post.comentarios_count}
                </button>
                <button onClick={() => sharePost(post)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" /> Compartilhar
                </button>
              </div>

              {expandedComments === post.id && (
                <div className="pt-2 border-t border-primary/10 space-y-3">
                  {loadingComments ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary mx-auto" />
                  ) : (
                    <>
                      {comments.map(c => (
                        <div key={c.id} className="flex gap-2 pl-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                              {(c.autor_nome || '?')[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs"><span className="font-medium text-foreground">{c.autor_nome}</span> <span className="text-muted-foreground">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ptBR })}</span></p>
                            <p className="text-sm text-foreground/70">{c.conteudo}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Textarea
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder="Escreva um comentário..."
                          className="min-h-[40px] text-xs bg-background border-primary/10"
                          maxLength={500}
                        />
                        <Button onClick={() => addComment(post.id)} size="sm" variant="ghost" disabled={!newComment.trim()}>
                          <Send className="w-3 h-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
