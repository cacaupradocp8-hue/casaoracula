import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Megaphone, Calendar, FileText, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface PostMentoria {
  id: string;
  tipo: 'aviso' | 'evento' | 'supervisao';
  titulo: string;
  texto: string;
  data_evento?: string;
  link_evento?: string;
  status: string;
  created_at: string;
}

const tipoConfig = {
  aviso: { label: 'Aviso', icon: Megaphone, color: 'bg-gold/20 text-gold' },
  evento: { label: 'Evento', icon: Calendar, color: 'bg-purple-500/20 text-purple-400' },
  supervisao: { label: 'Supervisão', icon: FileText, color: 'bg-blue-500/20 text-blue-400' },
};

export default function Mentoria() {
  const [posts, setPosts] = useState<PostMentoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [supervisionForm, setSupervisionForm] = useState({ titulo: '', texto: '' });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts_mentoria')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao carregar posts', description: error.message, variant: 'destructive' });
    } else {
      setPosts((data || []) as PostMentoria[]);
    }
    setIsLoading(false);
  };

  const submitSupervision = async () => {
    if (!supervisionForm.titulo || !supervisionForm.texto) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('posts_mentoria').insert({
      tipo: 'supervisao',
      titulo: supervisionForm.titulo,
      texto: supervisionForm.texto,
      status: 'rascunho',
      created_by: user?.id,
    });

    if (error) {
      toast({ title: 'Erro ao enviar', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Supervisão enviada para análise' });
      setDialogOpen(false);
      setSupervisionForm({ titulo: '', texto: '' });
      fetchPosts();
    }
  };

  const avisos = posts.filter(p => p.tipo === 'aviso');
  const eventos = posts.filter(p => p.tipo === 'evento');
  const supervisoes = posts.filter(p => p.tipo === 'supervisao');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Mentoria & Supervisão"
          subtitle="Espaço de encontro, acolhimento e orientação entre guardiãs"
          icon={<Users className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Avisos da Guardiã */}
        <section className="mb-10">
          <h2 className="text-xl font-display text-gold mb-4 flex items-center gap-2">
            <Megaphone className="w-5 h-5" /> Avisos da Guardiã
          </h2>
          {avisos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum aviso no momento.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {avisos.map(post => (
                <Card key={post.id} className="glass">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{post.titulo}</CardTitle>
                    <CardDescription>
                      {format(new Date(post.created_at), "d 'de' MMMM", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.texto}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Eventos / Sessões ao vivo */}
        <section className="mb-10">
          <h2 className="text-xl font-display text-gold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Eventos & Sessões ao Vivo
          </h2>
          {eventos.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum evento agendado.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {eventos.map(post => (
                <Card key={post.id} className="glass border-purple-500/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{post.titulo}</CardTitle>
                      {post.data_evento && (
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                          {format(new Date(post.data_evento), "d MMM 'às' HH:mm", { locale: ptBR })}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{post.texto}</p>
                    {post.link_evento && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={post.link_evento} target="_blank" rel="noopener noreferrer">
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

        {/* Supervisão */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display text-gold flex items-center gap-2">
              <FileText className="w-5 h-5" /> Supervisão
            </h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" size="sm">
                  <Plus className="w-4 h-4 mr-2" /> Solicitar Supervisão
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Supervisão</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Título / Tema</Label>
                    <Input
                      value={supervisionForm.titulo}
                      onChange={e => setSupervisionForm(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: Dificuldade com cliente resistente"
                    />
                  </div>
                  <div>
                    <Label>Descrição do caso</Label>
                    <Textarea
                      value={supervisionForm.texto}
                      onChange={e => setSupervisionForm(prev => ({ ...prev, texto: e.target.value }))}
                      placeholder="Descreva o caso, suas dúvidas e o que gostaria de supervisionar..."
                      rows={6}
                    />
                  </div>
                  <Button onClick={submitSupervision} className="w-full" variant="gold">
                    Enviar para análise
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {supervisoes.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma supervisão solicitada.</p>
          ) : (
            <div className="space-y-3">
              {supervisoes.map(post => (
                <Card key={post.id} className="glass border-blue-500/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{post.titulo}</CardTitle>
                      <Badge variant={post.status === 'publicado' ? 'default' : 'secondary'}>
                        {post.status === 'rascunho' ? 'Em análise' : post.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {format(new Date(post.created_at), "d 'de' MMMM", { locale: ptBR })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">{post.texto}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
