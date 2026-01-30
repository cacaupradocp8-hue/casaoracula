import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Send, Trash2, Edit2, X, Check } from 'lucide-react';

interface Comentario {
  id: string;
  conteudo: string;
  created_at: string;
  user_id: string;
  profile?: {
    nome: string | null;
    avatar_url: string | null;
  };
}

interface TravessiaComentariosProps {
  travessiaId: string;
}

export function TravessiaComentarios({ travessiaId }: TravessiaComentariosProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [novoComentario, setNovoComentario] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEditado, setTextoEditado] = useState('');

  // Buscar comentários
  const { data: comentarios = [], isLoading } = useQuery({
    queryKey: ['travessia-comentarios', travessiaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessia_comentarios')
        .select(`
          id,
          conteudo,
          created_at,
          user_id,
          profiles:user_id (
            nome,
            avatar_url
          )
        `)
        .eq('travessia_id', travessiaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map((c: any) => ({
        id: c.id,
        conteudo: c.conteudo,
        created_at: c.created_at,
        user_id: c.user_id,
        profile: c.profiles
      })) as Comentario[];
    },
    enabled: true,
  });

  // Criar comentário
  const criarMutation = useMutation({
    mutationFn: async (conteudo: string) => {
      if (!user) throw new Error('Não autenticada');
      
      const { error } = await supabase
        .from('travessia_comentarios')
        .insert({
          travessia_id: travessiaId,
          user_id: user.id,
          conteudo,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNovoComentario('');
      queryClient.invalidateQueries({ queryKey: ['travessia-comentarios', travessiaId] });
      toast({ title: 'Comentário enviado!' });
    },
    onError: () => {
      toast({ title: 'Erro ao enviar comentário', variant: 'destructive' });
    },
  });

  // Editar comentário
  const editarMutation = useMutation({
    mutationFn: async ({ id, conteudo }: { id: string; conteudo: string }) => {
      const { error } = await supabase
        .from('travessia_comentarios')
        .update({ conteudo })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      setEditandoId(null);
      setTextoEditado('');
      queryClient.invalidateQueries({ queryKey: ['travessia-comentarios', travessiaId] });
      toast({ title: 'Comentário atualizado!' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' });
    },
  });

  // Deletar comentário
  const deletarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('travessia_comentarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travessia-comentarios', travessiaId] });
      toast({ title: 'Comentário removido' });
    },
    onError: () => {
      toast({ title: 'Erro ao remover', variant: 'destructive' });
    },
  });

  const handleEnviar = () => {
    if (!novoComentario.trim()) return;
    criarMutation.mutate(novoComentario.trim());
  };

  const handleEditar = (comentario: Comentario) => {
    setEditandoId(comentario.id);
    setTextoEditado(comentario.conteudo);
  };

  const handleSalvarEdicao = () => {
    if (!editandoId || !textoEditado.trim()) return;
    editarMutation.mutate({ id: editandoId, conteudo: textoEditado.trim() });
  };

  const getInitials = (nome: string | null) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <div className="mt-12 pt-8 border-t border-border/50 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-gold mb-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="font-display text-lg font-semibold tracking-wide uppercase">
            Vozes da Travessia
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Compartilhe sua experiência com outras viajantes
        </p>
      </div>

      {/* Área de novo comentário */}
      {user ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <Textarea
              placeholder="Deixe sua reflexão sobre esta travessia..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              className="min-h-[80px] resize-none mb-3 bg-background/50"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="gold"
                onClick={handleEnviar}
                disabled={!novoComentario.trim() || criarMutation.isPending}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {criarMutation.isPending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/30 border-gold/20">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-3">
              Entre para compartilhar sua experiência
            </p>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de comentários */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Carregando comentários...
        </div>
      ) : comentarios.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Nenhum comentário ainda. Seja a primeira!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <Card key={comentario.id} className="bg-card/50 border-border/50">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={comentario.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gold/20 text-gold text-sm">
                      {getInitials(comentario.profile?.nome)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-foreground truncate">
                        {comentario.profile?.nome || 'Anônima'}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDistanceToNow(new Date(comentario.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    {editandoId === comentario.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={textoEditado}
                          onChange={(e) => setTextoEditado(e.target.value)}
                          className="min-h-[60px] resize-none bg-background/50"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditandoId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="gold"
                            onClick={handleSalvarEdicao}
                            disabled={editarMutation.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                        {comentario.conteudo}
                      </p>
                    )}

                    {/* Ações do próprio usuário */}
                    {user?.id === comentario.user_id && editandoId !== comentario.id && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleEditar(comentario)}
                        >
                          <Edit2 className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-muted-foreground hover:text-destructive"
                          onClick={() => deletarMutation.mutate(comentario.id)}
                          disabled={deletarMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA Conheça a Casa */}
      <section className="text-center py-8">
        <Button
          size="lg"
          variant="outline"
          className="border-gold/30 hover:border-gold/60 hover:bg-gold/5 text-foreground"
          onClick={() => navigate('/tour')}
        >
          <span className="mr-2">🜂</span>
          Conheça a Casa Orácula
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          Sem pressa. Apenas quando fizer sentido.
        </p>
      </section>
    </div>
  );
}
