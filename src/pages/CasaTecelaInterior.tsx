import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Ear, 
  BookOpen, 
  Users, 
  Play, 
  Calendar, 
  FileText,
  ExternalLink,
  Volume2,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface EscutaContent {
  id: string;
  tipo: 'encontro' | 'audio';
  titulo: string;
  descricao: string;
  url?: string;
  data?: string;
  created_at: string;
}

interface AtelieContent {
  id: string;
  tipo: 'caso' | 'video' | 'pdf';
  titulo: string;
  descricao: string;
  url?: string;
  created_at: string;
}

interface CirculoThread {
  id: string;
  titulo: string;
  autor_nome: string;
  status: 'aberto' | 'fechado';
  respostas_count: number;
  created_at: string;
}

export default function CasaTecelaInterior() {
  const [escutaContent, setEscutaContent] = useState<EscutaContent[]>([]);
  const [atelieContent, setAtelieContent] = useState<AtelieContent[]>([]);
  const [circuloThreads, setCirculoThreads] = useState<CirculoThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch from posts_mentoria filtered by category or create dedicated tables
      // For now, we'll use mock data structure - in production, this would query actual tables
      
      // In a real implementation, you would have tables like:
      // - casa_tecela_escuta (encontros, audios)
      // - casa_tecela_atelie (casos, videos, pdfs)
      // - casa_tecela_circulo (forum threads)
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching content:', error);
      setIsLoading(false);
    }
  };

  const areaConfig = {
    sustentacao: {
      icon: Ear,
      title: 'Sala da Sustentação',
      subtitle: 'Conteúdos vivos, sem trilha, sem obrigatoriedade',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
    leitura: {
      icon: BookOpen,
      title: 'Sala da Leitura',
      subtitle: 'Estudos de caso e uso prático das ferramentas',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      borderColor: 'border-gold/30',
    },
    circulo: {
      icon: Users,
      title: 'Sala do Círculo',
      subtitle: 'Fórum moderado para troca profissional',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
  };

  const renderSalaSustentacao = () => (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${areaConfig.sustentacao.bgColor} border ${areaConfig.sustentacao.borderColor}`}>
        <p className="text-sm text-foreground/80">
          Encontros ao vivo, áudios curtos e textos breves. Sem progresso, sem trilha, sem obrigatoriedade.
          Sobre limites, projeção, fadiga, ética e a solidão de quem sustenta.
        </p>
      </div>

      {/* Live Encounters */}
      <section>
        <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" /> Encontros ao Vivo
        </h3>
        {escutaContent.filter(c => c.tipo === 'encontro').length === 0 ? (
          <Card className="glass">
            <CardContent className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum encontro agendado no momento.</p>
              <p className="text-sm text-muted-foreground mt-2">Os encontros são anunciados mensalmente.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {escutaContent.filter(c => c.tipo === 'encontro').map(item => (
              <Card key={item.id} className={`glass ${areaConfig.sustentacao.borderColor}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.titulo}</CardTitle>
                  {item.data && (
                    <Badge variant="outline" className={areaConfig.sustentacao.color}>
                      {format(new Date(item.data), "d MMM 'às' HH:mm", { locale: ptBR })}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                  {item.url && (
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" /> Acessar
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Audio Reflections */}
      <section>
        <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5" /> Áudios & Textos
        </h3>
        {escutaContent.filter(c => c.tipo === 'audio').length === 0 ? (
          <Card className="glass">
            <CardContent className="py-8 text-center">
              <Volume2 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Conteúdos vivos serão adicionados em breve.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {escutaContent.filter(c => c.tipo === 'audio').map(item => (
              <Card key={item.id} className="glass">
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item.created_at), "d 'de' MMMM", { locale: ptBR })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Play className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderSalaLeitura = () => (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${areaConfig.leitura.bgColor} border ${areaConfig.leitura.borderColor}`}>
        <p className="text-sm text-foreground/80">
          Estudos de caso anonimizados, uso prático das Ferramentas Oraculares em sessões reais,
          vídeos curtos, exemplos concretos e materiais simples.
        </p>
      </div>

      {/* Case Studies */}
      <section>
        <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" /> Estudos de Caso
        </h3>
        {atelieContent.filter(c => c.tipo === 'caso').length === 0 ? (
          <Card className="glass">
            <CardContent className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Estudos de caso serão disponibilizados em breve.</p>
              <p className="text-sm text-muted-foreground mt-2">Todos os casos são anonimizados e supervisionados.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {atelieContent.filter(c => c.tipo === 'caso').map(item => (
              <Card key={item.id} className={`glass ${areaConfig.leitura.borderColor}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Videos & Materials */}
      <section>
        <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
          <Play className="w-5 h-5" /> Vídeos & Materiais
        </h3>
        {atelieContent.filter(c => c.tipo === 'video' || c.tipo === 'pdf').length === 0 ? (
          <Card className="glass">
            <CardContent className="py-8 text-center">
              <Play className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Materiais práticos em desenvolvimento.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {atelieContent.filter(c => c.tipo === 'video' || c.tipo === 'pdf').map(item => (
              <Card key={item.id} className="glass">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.tipo === 'video' ? 'Vídeo' : 'PDF'}
                    </Badge>
                    <CardTitle className="text-sm">{item.titulo}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderSalaCirculo = () => (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${areaConfig.circulo.bgColor} border ${areaConfig.circulo.borderColor}`}>
        <p className="text-sm text-foreground/80 mb-3">
          Fórum moderado para troca profissional. Poucos tópicos ativos. Regras claras.
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-medium text-foreground/90">Permitido:</p>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• Troca de práticas</li>
              <li>• Perguntas clínicas</li>
              <li>• Reflexões de campo</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground/90">Não permitido:</p>
            <ul className="text-muted-foreground space-y-0.5">
              <li>• Não é terapia</li>
              <li>• Não é desabafo</li>
              <li>• Não é competição espiritual</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Forum Threads */}
      <section>
        <h3 className="text-lg font-display text-gold mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> Discussões Ativas
        </h3>
        {circuloThreads.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">O Círculo ainda não possui discussões.</p>
              <p className="text-sm text-muted-foreground mt-2">Este espaço será ativado em breve.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {circuloThreads.map(thread => (
              <Card key={thread.id} className={`glass ${areaConfig.circulo.borderColor}`}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{thread.titulo}</p>
                      <p className="text-sm text-muted-foreground">
                        por {thread.autor_nome} • {thread.respostas_count} respostas
                      </p>
                    </div>
                    <Badge variant={thread.status === 'aberto' ? 'default' : 'secondary'}>
                      {thread.status === 'aberto' ? 'Aberto' : 'Fechado'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SectionHeader
            title="A Casa das Tecelãs"
            subtitle="Sustentação, refinamento e maturação profissional"
            icon={<Sparkles className="w-5 h-5" />}
            className="mb-8"
          />
        </motion.div>

        <Tabs defaultValue="sustentacao" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 h-auto p-1">
            {Object.entries(areaConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex flex-col gap-1 py-3 data-[state=active]:bg-secondary"
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <span className="text-xs font-medium">{config.title.split(' ').slice(-1)[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="sustentacao" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderSalaSustentacao()}
            </motion.div>
          </TabsContent>

          <TabsContent value="leitura" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderSalaLeitura()}
            </motion.div>
          </TabsContent>

          <TabsContent value="circulo" className="mt-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {renderSalaCirculo()}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
