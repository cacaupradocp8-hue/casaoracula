import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Play, FileText, Link as LinkIcon, ArrowLeft, Video } from 'lucide-react';
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
  tags: string[] | null;
  created_at: string;
}

export default function CasaLeitura() {
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
        .eq('room', 'leitura')
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

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'pdf': return FileText;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  const getMediaLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Vídeo';
      case 'pdf': return 'PDF';
      case 'link': return 'Link';
      case 'text': return 'Texto';
      default: return 'Conteúdo';
    }
  };

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
            title="Sala da Leitura"
            subtitle="Estudos de caso e prática simbólica"
            icon={<BookOpen className="w-5 h-5 text-gold" />}
            className="mb-6"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass p-5 rounded-xl border border-gold/30 mb-8 max-w-3xl"
        >
          <p className="text-foreground/90 leading-relaxed">
            <strong className="text-gold">Casos anonimizados e aplicação real das ferramentas.</strong>
          </p>
          <p className="text-foreground/80 mt-2 text-sm">
            Exemplos concretos de uso das Ferramentas Oraculares em sessão, 
            leituras oraculares comentadas e materiais práticos.
          </p>
          <p className="text-muted-foreground mt-3 text-xs italic">
            Todos os casos são supervisionados e seguem rigoroso protocolo de anonimização.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="glass">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Estudos de caso serão disponibilizados em breve.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Todos os casos são anonimizados e supervisionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => {
              const MediaIcon = getMediaIcon(post.media_type);
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass hover:border-gold/50 transition-colors h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <MediaIcon className="w-3 h-3" />
                          {getMediaLabel(post.media_type)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), "d MMM yyyy", { locale: ptBR })}
                        </span>
                      </div>
                      <CardTitle className="text-base leading-tight">{post.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      {post.descricao && (
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                          {post.descricao}
                        </p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {post.media_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4 w-full"
                          asChild
                        >
                          <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                            <Play className="w-4 h-4 mr-2" />
                            Acessar
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
