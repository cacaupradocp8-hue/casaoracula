import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Ear, Play, Volume2, FileText, ArrowLeft, Calendar, Radio } from 'lucide-react';
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
  destaque: boolean;
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

  const audioPosts = posts.filter(p => p.media_type === 'audio');
  const textPosts = posts.filter(p => p.media_type === 'text');
  const livePosts = posts.filter(p => p.media_type === 'video' || p.tags?.includes('encontro'));
  const featuredPosts = posts.filter(p => p.destaque);

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
            <ArrowLeft className="w-4 h-4" /> Casa das Tecelãs
          </Button>

          <SectionHeader
            title="Sala da Sustentação"
            subtitle="Conteúdos vivos para quem sustenta outros"
            icon={<Ear className="w-5 h-5 text-purple-400" />}
            className="mb-6"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-5 rounded-xl border border-purple-500/30 mb-8 max-w-3xl"
        >
          <p className="text-foreground/90 leading-relaxed">
            <strong className="text-purple-400">Áudios curtos, encontros ao vivo e reflexões escritas.</strong>
          </p>
          <p className="text-foreground/80 mt-2 text-sm">
            Sem trilha, sem obrigatoriedade, sem progresso. Sobre limites, projeção, fadiga ética 
            e a solidão de quem sustenta processos simbólicos.
          </p>
          <p className="text-muted-foreground mt-3 text-xs italic">
            Isso não é terapia. Não é supervisão. É sustentação simbólica entre pares.
          </p>
        </motion.div>

        {/* Content Format Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-3 sm:grid-cols-3 mb-8"
        >
          <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm">Áudios curtos (3-10 min)</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gold/10 border border-gold/20">
            <Radio className="w-4 h-4 text-gold" />
            <span className="text-sm">Encontros ao vivo</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Reflexões escritas</span>
          </div>
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
          <Card className="glass border-purple-500/20">
            <CardContent className="py-12 text-center">
              <Ear className="w-12 h-12 mx-auto text-purple-400/50 mb-4" />
              <p className="text-foreground/80 font-medium">Este espaço está sendo preparado.</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                Conteúdos de sustentação — áudios, reflexões e replays de encontros — 
                serão adicionados progressivamente.
              </p>
              <p className="text-xs text-muted-foreground mt-4 italic">
                A sustentação vem aos poucos, assim como os processos que você conduz.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* Featured Section */}
            {featuredPosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
                  Em Destaque
                </h3>
                <div className="space-y-3">
                  {featuredPosts.slice(0, 3).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass border-gold/30 hover:border-gold/50 transition-colors">
                        <CardContent className="py-4 flex items-center justify-between gap-4">
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

            {/* Live Encounters */}
            {livePosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Encontros ao Vivo
                </h3>
                <div className="space-y-3">
                  {livePosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass hover:border-gold/30 transition-colors">
                        <CardContent className="py-4 flex items-center justify-between gap-4">
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
                            <Button variant="outline" size="sm" asChild>
                              <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                                Assistir Replay
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

            {/* Audio Section */}
            {audioPosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-purple-400 mb-4 flex items-center gap-2">
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
                        <CardContent className="py-4 flex items-center justify-between gap-4">
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

            {/* Text/Reflections Section */}
            {textPosts.length > 0 && (
              <section>
                <h3 className="text-lg font-display text-blue-400 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Reflexões
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {textPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass hover:border-blue-500/30 transition-colors h-full">
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
