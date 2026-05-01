import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, Pencil, ChevronDown, Headphones, Loader2, Trash2, 
  MessageSquare, Dumbbell, Flower2, Stethoscope, Map as MapIcon,
  BookOpen, Info, Sparkles
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Semana {
  id: string;
  estacao_id: string | null;
  semana_numero: number;
  data_inicio: string;
  podcast_titulo: string | null;
  podcast_descricao: string | null;
  podcast_audio_url: string | null;
  audio_roteiro: string | null;
  chat_perguntas: any;
  treinamento_simulacao: string | null;
  jardim_prompt: string | null;
  aplicacao_clinica: string | null;
  cartografia_detalhes: any;
  pratica_titulo: string | null;
  pratica_descricao: string | null;
  pergunta_contemplativa: string | null;
  ativo: boolean;
}

interface Props {
  estacaoId: string;
}

export function SemanasTab({ estacaoId }: Props) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSemana, setEditingSemana] = useState<Semana | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [form, setForm] = useState({
    semana_numero: 1,
    data_inicio: '',
    podcast_titulo: '',
    podcast_descricao: '',
    podcast_audio_url: '',
    audio_roteiro: '',
    treinamento_simulacao: '',
    jardim_prompt: '',
    aplicacao_clinica: '',
    pratica_titulo: '',
    pratica_descricao: '',
    pergunta_contemplativa: '',
    cartografia_porta: '',
    cartografia_campo: '',
    cartografia_torre: '',
    cartografia_labirinto: '',
  });

  const { data: semanas = [], isLoading } = useQuery({
    queryKey: ['admin-semanas-estacao', estacaoId],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from('clube_conteudo_semanal')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('semana_numero', { ascending: true });
      return (data || []) as Semana[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const payload: any = {
        estacao_id: estacaoId,
        semana_numero: data.semana_numero,
        data_inicio: data.data_inicio || new Date().toISOString().split('T')[0],
        podcast_titulo: data.podcast_titulo || null,
        podcast_descricao: data.podcast_descricao || null,
        podcast_audio_url: data.podcast_audio_url || null,
        audio_roteiro: data.audio_roteiro || null,
        treinamento_simulacao: data.treinamento_simulacao || null,
        jardim_prompt: data.jardim_prompt || null,
        aplicacao_clinica: data.aplicacao_clinica || null,
        pratica_titulo: data.pratica_titulo || null,
        pratica_descricao: data.pratica_descricao || null,
        pergunta_contemplativa: data.pergunta_contemplativa || null,
        cartografia_detalhes: {
          porta: data.cartografia_porta,
          campo: data.cartografia_campo,
          torre: data.cartografia_torre,
          labirinto: data.cartografia_labirinto,
        },
        podcast_status: (data as any).podcast_status || 'pendente',
        ativo: true,
      };
      
      if (data.id) {
        const { error } = await (supabase as any).from('clube_conteudo_semanal').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from('clube_conteudo_semanal').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-semanas-estacao', estacaoId] });
      setDialogOpen(false);
      toast({ title: editingSemana ? 'Portal atualizado' : 'Portal criado' });
    },
    onError: (err: Error) => {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('clube_conteudo_semanal').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-semanas-estacao', estacaoId] });
      toast({ title: 'Portal removido' });
    },
  });

  const openEdit = (s: Semana) => {
    setEditingSemana(s);
    const cart = s.cartografia_detalhes || {};
    setForm({
      semana_numero: s.semana_numero,
      data_inicio: s.data_inicio,
      podcast_titulo: s.podcast_titulo || '',
      podcast_descricao: s.podcast_descricao || '',
      podcast_audio_url: s.podcast_audio_url || '',
      audio_roteiro: s.audio_roteiro || '',
      treinamento_simulacao: s.treinamento_simulacao || '',
      jardim_prompt: s.jardim_prompt || '',
      aplicacao_clinica: s.aplicacao_clinica || '',
      pratica_titulo: s.pratica_titulo || '',
      pratica_descricao: s.pratica_descricao || '',
      pergunta_contemplativa: s.pergunta_contemplativa || '',
      cartografia_porta: cart.porta || '',
      cartografia_campo: cart.campo || '',
      cartografia_torre: cart.torre || '',
      cartografia_labirinto: cart.labirinto || '',
      podcast_status: (s as any).podcast_status || 'pendente',
    } as any);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingSemana(null);
    setForm({
      semana_numero: (semanas[semanas.length - 1]?.semana_numero || 0) + 1,
      data_inicio: new Date().toISOString().split('T')[0],
      podcast_titulo: '', podcast_descricao: '', podcast_audio_url: '',
      audio_roteiro: '', treinamento_simulacao: '', jardim_prompt: '', aplicacao_clinica: '',
      pratica_titulo: '', pratica_descricao: '', pergunta_contemplativa: '',
      cartografia_porta: '', cartografia_campo: '', cartografia_torre: '', cartografia_labirinto: '',
      podcast_status: 'pendente',
    } as any);
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            Portais da Jornada
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Gestão dos conteúdos semanais (Áudio, Cartografia, Treino e Aplicação)
          </p>
        </div>
        <Button size="sm" onClick={openCreate} className="bg-gold hover:bg-gold/90 text-gold-foreground">
          <Plus className="w-3.5 h-3.5 mr-1" /> Novo Portal
        </Button>
      </div>

      {semanas.length === 0 ? (
        <Card className="border-dashed border-gold/20 bg-gold/5">
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            Nenhum portal cadastrado. Comece criando o primeiro portal da jornada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {semanas.map((s) => (
            <Collapsible key={s.id} open={expandedId === s.id} onOpenChange={(open) => setExpandedId(open ? s.id : null)}>
              <Card className="hover:border-gold/30 transition-all border-gold/10">
                <CollapsibleTrigger asChild>
                  <CardContent className="p-4 flex items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-[10px] font-bold text-gold shrink-0">
                      {s.semana_numero}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-foreground truncate block">
                        {s.podcast_titulo || `Portal ${s.semana_numero}`}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{s.data_inicio}</span>
                        {s.podcast_audio_url && <Badge variant="secondary" className="h-3.5 px-1 text-[8px] bg-primary/10 text-primary">Áudio OK</Badge>}
                        {s.treinamento_simulacao && <Badge variant="secondary" className="h-3.5 px-1 text-[8px] bg-emerald-500/10 text-emerald-500">Treino OK</Badge>}
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === s.id ? 'rotate-180' : ''}`} />
                  </CardContent>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4 border-t border-gold/5 pt-4 bg-muted/5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                          <Headphones className="w-3 h-3" /> Imersão (Áudio)
                        </span>
                        <p className="text-xs text-foreground line-clamp-2">{s.podcast_descricao || 'Sem descrição'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                          <Dumbbell className="w-3 h-3" /> Treino (Simulação)
                        </span>
                        <p className="text-xs text-foreground line-clamp-2">{s.treinamento_simulacao || 'Não configurado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-gold/5">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-gold/30 text-gold hover:bg-gold/5" onClick={() => openEdit(s)}>
                        <Pencil className="w-3 h-3 mr-1.5" /> Editar Portal Completo
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" 
                        onClick={() => {
                          if (window.confirm('Excluir este portal permanentemente?')) {
                            deleteMutation.mutate(s.id);
                          }
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1.5" /> Excluir
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}

      {/* Full Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto p-0 flex flex-col">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              {editingSemana ? `Configurar Portal ${form.semana_numero}` : `Novo Portal ${form.semana_numero}`}
            </DialogTitle>
            <DialogDescription>
              Preencha as 4 camadas da experiência para este portal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 pb-2 pt-2">
            <div className="space-y-8 pb-8">
              {/* Informações Básicas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Número do Portal</label>
                  <Input type="number" value={form.semana_numero} onChange={(e) => setForm({ ...form, semana_numero: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Data de Liberação</label>
                  <Input type="date" value={form.data_inicio} onChange={(e) => setForm({ ...form, data_inicio: e.target.value })} />
                </div>
              </div>

              {/* 1. IMERSÃO (ÁUDIO) */}
              <section className="space-y-4 p-4 rounded-xl border border-primary/10 bg-primary/5">
                <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                  <Headphones className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold uppercase tracking-tight">1. Imersão (Áudio Semanal)</h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Título do Episódio</label>
                      <Input value={form.podcast_titulo} onChange={(e) => setForm({ ...form, podcast_titulo: e.target.value })} placeholder="Ex: O Chamado da Floresta" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium">Status do Áudio</label>
                      <Select 
                        value={(form as any).podcast_status || 'pendente'} 
                        onValueChange={(v) => setForm({ ...form, podcast_status: v } as any)}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">⏳ Pendente</SelectItem>
                          <SelectItem value="roteiro_pronto">📝 Roteiro Pronto</SelectItem>
                          <SelectItem value="audio_enviado">🎤 Áudio Enviado</SelectItem>
                          <SelectItem value="publicado">✅ Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Sinopse Simbólica (Curta)</label>
                    <Textarea value={form.podcast_descricao} onChange={(e) => setForm({ ...form, podcast_descricao: e.target.value })} placeholder="Breve resumo para a aluna..." rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">URL do Áudio (MP3/HLS)</label>
                    <Input value={form.podcast_audio_url} onChange={(e) => setForm({ ...form, podcast_audio_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Roteiro Completo (Opcional)</label>
                    <Textarea value={form.audio_roteiro} onChange={(e) => setForm({ ...form, audio_roteiro: e.target.value })} placeholder="Texto completo do áudio para acessibilidade..." rows={4} />
                  </div>
                </div>
              </section>

              {/* 2. CARTOGRAFIA (ESTRADA) */}
              <section className="space-y-4 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5">
                <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                  <MapIcon className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold uppercase tracking-tight">2. Cartografia Simbólica</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">A Porta (Entrada)</label>
                    <Input value={form.cartografia_porta} onChange={(e) => setForm({ ...form, cartografia_porta: e.target.value })} placeholder="O que se cruza..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">O Campo (Contexto)</label>
                    <Input value={form.cartografia_campo} onChange={(e) => setForm({ ...form, cartografia_campo: e.target.value })} placeholder="Onde se pisa..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">A Torre (Visão)</label>
                    <Input value={form.cartografia_torre} onChange={(e) => setForm({ ...form, cartografia_torre: e.target.value })} placeholder="O que se vê do alto..." />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">O Labirinto (Desafio)</label>
                    <Input value={form.cartografia_labirinto} onChange={(e) => setForm({ ...form, cartografia_labirinto: e.target.value })} placeholder="Onde se perde/acha..." />
                  </div>
                </div>
              </section>

              {/* GESTÃO DE ÁUDIOS EXTRAS */}
              <section className="space-y-4 p-4 rounded-xl border border-blue-500/10 bg-blue-500/5">
                <div className="flex items-center justify-between border-b border-blue-500/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-blue-500" />
                    <h3 className="text-sm font-bold uppercase tracking-tight">Áudios Extras da Rota</h3>
                  </div>
                  {editingSemana && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-[10px] bg-blue-500/10 border-blue-500/20 text-blue-600"
                      onClick={() => window.open(`/admin/clube/portais/${editingSemana.id}`, '_blank')}
                    >
                      Gerenciar Slots de Áudio
                    </Button>
                  )}
                </div>
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 flex gap-2">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-700 leading-tight">
                    Os áudios abaixo são os slots configurados para esta rota. 
                    No momento, o upload deve ser feito através do gerenciador de portais.
                  </p>
                </div>
              </section>

              {/* 3. TREINO (SALA DE TREINAMENTO) */}
              <section className="space-y-4 p-4 rounded-xl border border-gold/10 bg-gold/5">
                <div className="flex items-center gap-2 border-b border-gold/10 pb-2">
                  <Dumbbell className="w-4 h-4 text-gold" />
                  <h3 className="text-sm font-bold uppercase tracking-tight">3. Treino (Sala de Treinamento)</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Simulação de Caso / Estudo de Conto</label>
                    <Textarea value={form.treinamento_simulacao} onChange={(e) => setForm({ ...form, treinamento_simulacao: e.target.value })} placeholder="Descreva o cenário para prática..." rows={4} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Título da Prática Guiada</label>
                    <Input value={form.pratica_titulo} onChange={(e) => setForm({ ...form, pratica_titulo: e.target.value })} placeholder="Ex: Meditação da Loba" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Instruções da Prática</label>
                    <Textarea value={form.pratica_descricao} onChange={(e) => setForm({ ...form, pratica_descricao: e.target.value })} placeholder="Passo a passo..." rows={3} />
                  </div>
                </div>
              </section>

              {/* 4. APLICAÇÃO (JARDIM & CLÍNICA) */}
              <section className="space-y-4 p-4 rounded-xl border border-pink-500/10 bg-pink-500/5">
                <div className="flex items-center gap-2 border-b border-pink-500/10 pb-2">
                  <Flower2 className="w-4 h-4 text-pink-500" />
                  <h3 className="text-sm font-bold uppercase tracking-tight">4. Aplicação (Jardim & Clínica)</h3>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium flex items-center gap-1">
                      <Flower2 className="w-3 h-3" /> Prompt do Jardim (Integração)
                    </label>
                    <Textarea value={form.jardim_prompt} onChange={(e) => setForm({ ...form, jardim_prompt: e.target.value })} placeholder="Pergunta para o Jardim da Psique..." rows={2} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium flex items-center gap-1">
                      <Stethoscope className="w-3 h-3" /> Aplicação Clínica (Manual da Orácula)
                    </label>
                    <Textarea value={form.aplicacao_clinica} onChange={(e) => setForm({ ...form, aplicacao_clinica: e.target.value })} placeholder="Como usar este conteúdo em sessão..." rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Pergunta Contemplativa (Chat)</label>
                    <Textarea value={form.pergunta_contemplativa} onChange={(e) => setForm({ ...form, pergunta_contemplativa: e.target.value })} placeholder="Para o Chat com o Livro..." rows={2} />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="p-6 border-t border-border bg-background flex items-center gap-3 shrink-0">
            <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="flex-[2] bg-gold hover:bg-gold/90 text-gold-foreground font-bold"
              disabled={saveMutation.isPending}
              onClick={() => {
                console.log('Salvando portal...', form);
                saveMutation.mutate({ ...form, id: editingSemana?.id });
              }}
            >
              {saveMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
              ) : (
                editingSemana ? 'Atualizar Portal' : 'Criar Portal'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
