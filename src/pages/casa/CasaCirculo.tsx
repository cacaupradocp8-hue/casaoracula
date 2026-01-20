import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Users, MessageCircle, ArrowLeft, Plus, Clock, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Thread {
  id: string;
  titulo: string;
  conteudo: string;
  autor_id: string;
  status: 'aberto' | 'fechado' | 'moderado';
  fixado: boolean;
  respostas_count: number;
  ultima_atividade: string;
  created_at: string;
  autor_nome?: string;
}

interface Reply {
  id: string;
  conteudo: string;
  autor_id: string;
  created_at: string;
  autor_nome?: string;
}

export default function CasaCirculo() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThread, setNewThread] = useState({ titulo: '', conteudo: '' });
  const [newReply, setNewReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('casa_circulo_threads')
        .select('*')
        .order('fixado', { ascending: false })
        .order('ultima_atividade', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch author names
      const authorIds = [...new Set((data || []).map(t => t.autor_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome')
        .in('id', authorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.nome]) || []);

      const threadsWithNames = (data || []).map(t => ({
        ...t,
        autor_nome: profileMap.get(t.autor_id) || 'Anônimo'
      }));

      setThreads(threadsWithNames as Thread[]);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReplies = async (threadId: string) => {
    setIsLoadingReplies(true);
    try {
      const { data, error } = await supabase
        .from('casa_circulo_replies')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch author names
      const authorIds = [...new Set((data || []).map(r => r.autor_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nome')
        .in('id', authorIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.nome]) || []);

      const repliesWithNames = (data || []).map(r => ({
        ...r,
        autor_nome: profileMap.get(r.autor_id) || 'Anônimo'
      }));

      setReplies(repliesWithNames as Reply[]);
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
    fetchReplies(thread.id);
  };

  const handleCreateThread = async () => {
    if (!newThread.titulo.trim() || !newThread.conteudo.trim()) {
      toast({ title: 'Preencha título e conteúdo', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('casa_circulo_threads')
        .insert({
          titulo: newThread.titulo.trim(),
          conteudo: newThread.conteudo.trim(),
          autor_id: user?.id
        });

      if (error) throw error;

      toast({ title: 'Tópico criado com sucesso!' });
      setNewThread({ titulo: '', conteudo: '' });
      setNewThreadOpen(false);
      fetchThreads();
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({ title: 'Erro ao criar tópico', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async () => {
    if (!newReply.trim() || !selectedThread) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('casa_circulo_replies')
        .insert({
          thread_id: selectedThread.id,
          conteudo: newReply.trim(),
          autor_id: user?.id
        });

      if (error) throw error;

      setNewReply('');
      fetchReplies(selectedThread.id);
      // Update thread count in local state
      setThreads(prev => prev.map(t => 
        t.id === selectedThread.id 
          ? { ...t, respostas_count: t.respostas_count + 1, ultima_atividade: new Date().toISOString() }
          : t
      ));
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({ title: 'Erro ao responder', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
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
            onClick={() => selectedThread ? setSelectedThread(null) : navigate('/casa')}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> 
            {selectedThread ? 'Voltar aos tópicos' : 'Casa das Tecelãs'}
          </Button>

          <SectionHeader
            title="Sala do Círculo"
            subtitle="Fórum moderado para troca profissional"
            icon={<Users className="w-5 h-5 text-blue-400" />}
            className="mb-6"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="glass p-5 rounded-xl border border-blue-500/30 mb-6 max-w-3xl"
        >
          <p className="text-foreground/90 leading-relaxed">
            <strong className="text-blue-400">Espaço moderado de troca entre pares.</strong>
          </p>
          <p className="text-foreground/80 mt-2 text-sm">
            Poucos tópicos ativos, regras claras, linguagem profissional. 
            Compartilhe práticas, dúvidas clínicas e reflexões de campo.
          </p>
          <p className="text-muted-foreground mt-3 text-xs italic">
            Isso não é terapia. Não é desabafo. Não é competição espiritual.
          </p>
        </motion.div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-4 text-sm p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-8"
        >
          <div>
            <p className="font-medium text-foreground/90 mb-1">Permitido:</p>
            <ul className="text-muted-foreground space-y-0.5 text-xs">
              <li>• Troca de práticas</li>
              <li>• Perguntas clínicas</li>
              <li>• Reflexões de campo</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground/90 mb-1">Não permitido:</p>
            <ul className="text-muted-foreground space-y-0.5 text-xs">
              <li>• Desabafos pessoais</li>
              <li>• Promoção de serviços</li>
              <li>• Competição espiritual</li>
            </ul>
          </div>
        </motion.div>

        {selectedThread ? (
          /* Thread Detail View */
          <div className="space-y-6">
            <Card className="glass border-blue-500/30">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={selectedThread.status === 'aberto' ? 'default' : 'secondary'}>
                    {selectedThread.status === 'aberto' ? 'Aberto' : 'Fechado'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedThread.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <CardTitle>{selectedThread.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">por {selectedThread.autor_nome}</p>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 whitespace-pre-wrap">{selectedThread.conteudo}</p>
              </CardContent>
            </Card>

            {/* Replies */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {selectedThread.respostas_count} resposta{selectedThread.respostas_count !== 1 ? 's' : ''}
              </h3>

              {isLoadingReplies ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <Card key={i} className="glass">
                      <CardContent className="py-4">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-12 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {replies.map((reply, index) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{reply.autor_nome}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: ptBR })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reply.conteudo}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Reply Form */}
                  {selectedThread.status === 'aberto' && (
                    <Card className="glass border-blue-500/20">
                      <CardContent className="py-4">
                        <Textarea
                          placeholder="Escreva sua resposta..."
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="mb-3"
                          rows={3}
                        />
                        <Button 
                          onClick={handleCreateReply} 
                          disabled={isSubmitting || !newReply.trim()}
                          size="sm"
                        >
                          Responder
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Thread List View */
          <>
            {/* New Thread Button */}
            <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
              <DialogTrigger asChild>
                <Button className="mb-6 gap-2">
                  <Plus className="w-4 h-4" /> Novo Tópico
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar novo tópico</DialogTitle>
                  <DialogDescription>
                    Compartilhe uma reflexão, pergunta ou prática com o círculo.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Título do tópico"
                    value={newThread.titulo}
                    onChange={(e) => setNewThread(prev => ({ ...prev, titulo: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Desenvolva sua reflexão ou pergunta..."
                    value={newThread.conteudo}
                    onChange={(e) => setNewThread(prev => ({ ...prev, conteudo: e.target.value }))}
                    rows={5}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewThreadOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateThread} disabled={isSubmitting}>
                    Criar Tópico
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="glass">
                    <CardContent className="py-4">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : threads.length === 0 ? (
              <Card className="glass">
                <CardContent className="py-12 text-center">
                  <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">O Círculo ainda não possui discussões.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Seja a primeira a iniciar uma conversa.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {threads.map((thread, index) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`glass cursor-pointer hover:border-blue-500/30 transition-colors ${thread.fixado ? 'border-blue-500/40' : ''}`}
                      onClick={() => handleSelectThread(thread)}
                    >
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {thread.fixado && <Badge variant="secondary" className="text-xs">Fixado</Badge>}
                              <Badge variant={thread.status === 'aberto' ? 'outline' : 'secondary'} className="text-xs">
                                {thread.status === 'aberto' ? 'Aberto' : 'Fechado'}
                              </Badge>
                            </div>
                            <p className="font-medium">{thread.titulo}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span>por {thread.autor_nome}</span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> {thread.respostas_count}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 
                                {formatDistanceToNow(new Date(thread.ultima_atividade), { addSuffix: true, locale: ptBR })}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
