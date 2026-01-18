import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Ear, Play, Calendar, Volume2, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface CasaPost {
  id: string;
  titulo: string;
  descricao: string | null;
  conteudo: string | null;
  media_url: string | null;
  media_type: 'audio' | 'text' | 'video' | 'link' | 'pdf';
  duracao_segundos: number | null;
  tags: string[] | null;
  created_at: string;
}

export default function CasaSustentacao() {
  const [posts, setPosts] = useState<CasaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('casa_posts')
        .select('*')
        .eq('room', 'sustentacao')
        .eq('publicado', true)
        .order('destaque', { ascending: false })
        .order('ordem', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts((data || []) as CasaPost[]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'audio': return Volume2;
      case 'video': return Play;
      case 'text': return FileText;
      default: return FileText;
    }
  };

  const audioPosts = posts.filter(p => p.media_type === 'audio');
  const textPosts = posts.filter(p => p.media_type === 'text');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/casa')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Casa Orácula
          </Button>

          <SectionHeader
            title="Sala da Sustentação"
            subtitle="Conteúdos vivos, sem trilha, sem obrigatoriedade"
            icon={<Ear className="w-5 h-5 text-purple-400" />}
            className="mb-8"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-8"
        >
          <p className="text-sm text-foreground/80">
            Encontros ao vivo, áudios curtos e textos breves. Sem progresso, sem trilha, sem obrigatoriedade.
            Sobre limites, projeção, fadiga, ética e a solidão de quem sustenta.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i} className="glass">
                <CardContent className="py-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <Ear className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Conteúdos vivos serão adicionados em breve.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Este espaço receberá áudios, textos e replays de encontros.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Audio Section */}
            {audioPosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" /> Áudios
                </h3>
                <div className="space-y-3">
                  {audioPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass hover:border-purple-500/30 transition-colors">
                        <CardContent className="py-4 flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{post.titulo}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{format(new Date(post.created_at), "d 'de' MMMM", { locale: ptBR })}</span>
                              {post.duracao_segundos && (
                                <>
                                  <span>•</span>
                                  <span>{formatDuration(post.duracao_segundos)}</span>
                                </>
                              )}
                            </div>
                            {post.descricao && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {post.descricao}
                              </p>
                            )}
                          </div>
                          {post.media_url && (
                            <Button variant="ghost" size="icon" asChild>
                              <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                                <Play className="w-5 h-5" />
                              </a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Text Section */}
            {textPosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Textos
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {textPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass hover:border-purple-500/30 transition-colors h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{post.titulo}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(post.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        </CardHeader>
                        <CardContent>
                          {post.descricao && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {post.descricao}
                            </p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
