import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, BookOpen, Pencil, ImageIcon, Users, Eye, 
  Loader2, Settings, Rocket, Save, Music, Sparkles, Plus, Trash2, ChevronRight,
  MapPin, Headphones, Sword, AlertTriangle, Flower2, Scroll, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function AdminCentralEstacao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { estacaoId } = useParams<{ estacaoId: string }>();

  const [editStationOpen, setEditStationOpen] = useState(false);
  const [selectedPassoId, setSelectedPassoId] = useState<string | null>(null);
  
  const [stationForm, setStationForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    publicada: false,
    ativa: false
  });

  // 1. Fetch Estação
  const { data: estacao, isLoading: loadingEstacao } = useQuery({
    queryKey: ['admin-v3-estacao-detail', estacaoId],
    queryFn: async () => {
      if (!estacaoId) return null;
      const { data, error } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('id', estacaoId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!estacaoId,
  });

  // 2. Fetch Passos (Itens da Rota)
  const { data: passos = [], isLoading: loadingPassos } = useQuery({
    queryKey: ['admin-rota-passos', estacaoId],
    queryFn: async () => {
      if (!estacaoId) return [];
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoId)
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!estacaoId,
  });

  useEffect(() => {
    if (estacao) {
      setStationForm({
        titulo: estacao.titulo || '',
        subtitulo: estacao.subtitulo || '',
        descricao: estacao.descricao || '',
        publicada: estacao.publicada || false,
        ativa: estacao.ativa || false
      });
    }
  }, [estacao]);

  useEffect(() => {
    if (passos.length > 0 && !selectedPassoId) {
      setSelectedPassoId(passos[0].id);
    }
  }, [passos, selectedPassoId]);

  const selectedPasso = passos.find(p => p.id === selectedPassoId) || null;

  // Mutations
  const updateStationMutation = useMutation({
    mutationFn: async (data: typeof stationForm) => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update({
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          descricao: data.descricao,
          publicada: data.publicada,
          ativa: data.ativa
        })
        .eq('id', estacaoId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-v3-estacao-detail', estacaoId] });
      setEditStationOpen(false);
      toast({ title: 'Estação atualizada!' });
    }
  });

  const savePassoMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (payload.id) {
        const { error } = await supabase
          .from('clube_rota_itens')
          .update(payload)
          .eq('id', payload.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clube_rota_itens')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      toast({ title: 'Conteúdo salvo com sucesso!' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
    }
  });

  const deletePassoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clube_rota_itens').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-rota-passos', estacaoId] });
      setSelectedPassoId(null);
      toast({ title: 'Passo removido' });
    }
  });

  const handleCreatePasso = () => {
    const nextOrdem = passos.length > 0 ? Math.max(...passos.map(p => p.ordem)) + 10 : 10;
    const newPasso = {
      estacao_id: estacaoId,
      titulo: 'Nova Etapa',
      subtitulo: '',
      ordem: nextOrdem,
      tipo: 'escuta',
      tipo_passo: 'escuta',
      publicado: true,
      conteudo_inline: { texto: '' },
      metadata: { audios: [] }
    };
    savePassoMutation.mutate(newPasso);
  };

  if (loadingEstacao || loadingPassos) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!estacao) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Estação não encontrada.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/clube')}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32 max-w-6xl">
      {/* Header Consolidado */}
      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 mb-8 p-0 bg-card border border-primary/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row flex-1 min-w-0">
          <div className="w-full md:w-32 h-32 md:h-auto bg-muted group relative cursor-pointer overflow-hidden" onClick={() => setEditStationOpen(true)}>
            {estacao.banner_url || estacao.livro_capa_url ? (
              <img src={estacao.banner_url || estacao.livro_capa_url} alt="Capa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-muted-foreground p-2 text-center">
                <ImageIcon className="w-6 h-6 mb-1 opacity-20" />
                Sem Capa
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Pencil className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate('/admin/clube/ciclos')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-serif text-foreground truncate">{estacao.titulo}</h1>
                  <Badge variant={estacao.publicada ? 'default' : 'secondary'} className={cn("text-[9px] uppercase tracking-widest", estacao.publicada ? "bg-emerald-500/10 text-emerald-500" : "")}>
                    {estacao.publicada ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  {estacao.livro_titulo}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-6 border-t md:border-t-0 border-primary/5 bg-muted/20">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/clube')}>
            <Eye className="h-3.5 w-3.5" /> Ver como Aluna
          </Button>
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold gap-2" onClick={() => setEditStationOpen(true)}>
            <Settings className="h-3.5 w-3.5" /> Estação
          </Button>
        </div>
      </div>

      {/* Unique Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Steps List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs uppercase tracking-widest font-bold text-gold/60">Etapas da Rota</h2>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gold" onClick={handleCreatePasso}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {passos.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-primary/10 rounded-xl text-muted-foreground text-sm">
                Nenhuma etapa criada.
                <Button variant="link" className="text-gold" onClick={handleCreatePasso}>Criar agora</Button>
              </div>
            ) : (
              passos.map((p, idx) => (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPassoId(p.id)}
                  className={cn(
                    "group relative p-4 rounded-xl border cursor-pointer transition-all",
                    selectedPassoId === p.id 
                      ? "bg-gold/10 border-gold/40 shadow-lg shadow-gold/5" 
                      : "bg-card border-primary/5 hover:border-gold/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                      selectedPassoId === p.id ? "bg-gold text-black" : "bg-muted text-muted-foreground"
                    )}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("text-sm font-semibold truncate", selectedPassoId === p.id ? "text-gold" : "text-foreground")}>
                        {p.titulo}
                      </h3>
                      <p className="text-[10px] text-muted-foreground truncate italic">
                        {p.subtitulo || 'Sem subtítulo'}
                      </p>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", selectedPassoId === p.id ? "translate-x-1 text-gold" : "opacity-0")} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Unique Editor */}
        <div className="lg:col-span-8">
          {selectedPasso ? (
            <EditorUnico 
              passo={selectedPasso} 
              onSave={(payload) => savePassoMutation.mutate(payload)}
              onDelete={() => deletePassoMutation.mutate(selectedPasso.id)}
              loading={savePassoMutation.isPending}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-24 bg-muted/10 border-2 border-dashed border-primary/10 rounded-2xl">
              <Rocket className="w-12 h-12 text-muted-foreground/20 mb-4" />
              <p className="text-muted-foreground">Selecione uma etapa para editar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Station Dialog */}
      <Dialog open={editStationOpen} onOpenChange={setEditStationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações da Estação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={stationForm.titulo} onChange={e => setStationForm({...stationForm, titulo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={stationForm.subtitulo} onChange={e => setStationForm({...stationForm, subtitulo: e.target.value})} />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <Switch checked={stationForm.publicada} onCheckedChange={v => setStationForm({...stationForm, publicada: v})} />
                <Label>Publicada</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={stationForm.ativa} onCheckedChange={v => setStationForm({...stationForm, ativa: v})} />
                <Label>Ativa</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStationOpen(false)}>Cancelar</Button>
            <Button className="bg-gold text-black font-bold" onClick={() => updateStationMutation.mutate(stationForm)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EditorUnico({ passo, onSave, onDelete, loading }: { passo: any, onSave: (p: any) => void, onDelete: () => void, loading: boolean }) {
  const [form, setForm] = useState({
    titulo: passo.titulo || '',
    subtitulo: passo.subtitulo || '',
    conteudo_texto: passo.conteudo_inline?.texto || '',
    // Seções metadata
    abertura_imersiva: renderContent(passo.metadata?.abertura_imersiva),
    hero: {
      titulo: passo.metadata?.hero?.titulo || '',
      texto: passo.metadata?.hero?.texto || '',
      cta: passo.metadata?.hero?.cta || ''
    },
    caso_simbolico: {
      titulo: passo.metadata?.caso_simbolico?.titulo || '',
      aviso: passo.metadata?.caso_simbolico?.aviso || 'Caso fictício e pedagógico. Não representa diagnóstico, nem substitui avaliação profissional.',
      relato: passo.metadata?.caso_simbolico?.relato || ''
    },
    desafio_terapeuta: {
      pergunta: passo.metadata?.desafio_terapeuta?.pergunta || '',
      escolhas: Array.isArray(passo.metadata?.desafio_terapeuta?.escolhas) ? passo.metadata?.desafio_terapeuta?.escolhas : ['Porta', 'Torre', 'Labirinto', 'Campo psíquico', 'Pergunta possível'],
      campo_aberto_label: passo.metadata?.desafio_terapeuta?.campo_aberto_label || ''
    },
    revelacao_estacao: {
      porta: passo.metadata?.revelacao_estacao?.porta || '',
      campo_psiquico: passo.metadata?.revelacao_estacao?.campo_psiquico || '',
      torre: passo.metadata?.revelacao_estacao?.torre || '',
      labirinto: passo.metadata?.revelacao_estacao?.labirinto || '',
      pergunta_narrativa: passo.metadata?.revelacao_estacao?.pergunta_narrativa || ''
    },
    erro_comum: {
      titulo: passo.metadata?.erro_comum?.titulo || '',
      descricao: passo.metadata?.erro_comum?.descricao || '',
      exemplo: passo.metadata?.erro_comum?.exemplo || '',
      explicacao: passo.metadata?.erro_comum?.explicacao || ''
    },
    conducao_justa: passo.metadata?.conducao_justa || '',
    cautela_etica: Array.isArray(passo.metadata?.cautela_etica) ? passo.metadata?.cautela_etica.join('\n') : (passo.metadata?.cautela_etica || 'Não usar linguagem de diagnóstico.\nNão transformar conto em sentença.\nNão sugerir rupturas rápidas.\nNão usar caso fictício como caso real.'),
    jardim_psique: {
      chamada: passo.metadata?.jardim_psique?.chamada || '',
      pergunta: passo.metadata?.jardim_psique?.pergunta || '',
      campos: passo.metadata?.jardim_psique?.campos || '',
      botao: passo.metadata?.jardim_psique?.botao || '',
      confirmacao: passo.metadata?.jardim_psique?.confirmacao || ''
    },
    jardim_oficio: {
      chamada: passo.metadata?.jardim_oficio?.chamada || '',
      aviso_etico: passo.metadata?.jardim_oficio?.aviso_etico || 'Registre apenas padrões gerais e percepções simbólicas. Não inclua nome, dados identificáveis ou informações sensíveis de clientes.',
      pergunta: passo.metadata?.jardim_oficio?.pergunta || '',
      campos: passo.metadata?.jardim_oficio?.campos || '',
      botao: passo.metadata?.jardim_oficio?.botao || '',
      confirmacao: passo.metadata?.jardim_oficio?.confirmacao || ''
    },
    missao_campo: {
      titulo: passo.metadata?.missao_campo?.titulo || '',
      descricao: passo.metadata?.missao_campo?.descricao || '',
      sinais: passo.metadata?.missao_campo?.sinais || '',
      pergunta: passo.metadata?.missao_campo?.pergunta || '',
      botao: passo.metadata?.missao_campo?.botao || ''
    },
    oraculo_estacao: {
      palavra: passo.metadata?.oraculo_estacao?.palavra || '',
      movimento: passo.metadata?.oraculo_estacao?.movimento || '',
      carta_final: passo.metadata?.oraculo_estacao?.carta_final || ''
    },
    fechamento: {
      texto: passo.metadata?.fechamento?.texto || '',
      pergunta: passo.metadata?.fechamento?.pergunta || '',
      botao: passo.metadata?.fechamento?.botao || '',
      confirmacao: passo.metadata?.fechamento?.confirmacao || ''
    },
    // Áudios - Agora array de 4
    audios: Array.isArray(passo.metadata?.audios) && passo.metadata.audios.length > 0
      ? passo.metadata.audios.slice(0, 4)
      : [
          { titulo: 'Introdução', tipo: 'introducao', funcao: 'Abrir o campo simbólico da estação', pergunta_central: '', duracao: '', url: '', roteiro: '' },
          { titulo: 'Principal', tipo: 'principal', funcao: 'A travessia da semana', pergunta_central: '', duracao: '', url: '', roteiro: '' },
          { titulo: 'Essência 80/20', tipo: 'essencia', funcao: 'O núcleo simbólico', pergunta_central: '', duracao: '', url: '', roteiro: '' },
          { titulo: 'Conto', tipo: 'conto', funcao: 'A imagem que cura', pergunta_central: '', duracao: '', url: '', roteiro: '' }
        ]
  });

  useEffect(() => {
    setForm({
      titulo: passo.titulo || '',
      subtitulo: passo.subtitulo || '',
      conteudo_texto: passo.conteudo_inline?.texto || '',
      abertura_imersiva: renderContent(passo.metadata?.abertura_imersiva),
      hero: {
        titulo: passo.metadata?.hero?.titulo || '',
        texto: passo.metadata?.hero?.texto || '',
        cta: passo.metadata?.hero?.cta || ''
      },
      caso_simbolico: {
        titulo: passo.metadata?.caso_simbolico?.titulo || '',
        aviso: passo.metadata?.caso_simbolico?.aviso || 'Caso fictício e pedagógico. Não representa diagnóstico, nem substitui avaliação profissional.',
        relato: passo.metadata?.caso_simbolico?.relato || ''
      },
      desafio_terapeuta: {
        pergunta: passo.metadata?.desafio_terapeuta?.pergunta || '',
        escolhas: Array.isArray(passo.metadata?.desafio_terapeuta?.escolhas) ? passo.metadata?.desafio_terapeuta?.escolhas : ['Porta', 'Torre', 'Labirinto', 'Campo psíquico', 'Pergunta possível'],
        campo_aberto_label: passo.metadata?.desafio_terapeuta?.campo_aberto_label || ''
      },
      revelacao_estacao: {
        porta: passo.metadata?.revelacao_estacao?.porta || '',
        campo_psiquico: passo.metadata?.revelacao_estacao?.campo_psiquico || '',
        torre: passo.metadata?.revelacao_estacao?.torre || '',
        labirinto: passo.metadata?.revelacao_estacao?.labirinto || '',
        pergunta_narrativa: passo.metadata?.revelacao_estacao?.pergunta_narrativa || ''
      },
      erro_comum: {
        titulo: passo.metadata?.erro_comum?.titulo || '',
        descricao: passo.metadata?.erro_comum?.descricao || '',
        exemplo: passo.metadata?.erro_comum?.exemplo || '',
        explicacao: passo.metadata?.erro_comum?.explicacao || ''
      },
      conducao_justa: passo.metadata?.conducao_justa || '',
      cautela_etica: Array.isArray(passo.metadata?.cautela_etica) ? passo.metadata?.cautela_etica.join('\n') : (passo.metadata?.cautela_etica || 'Não usar linguagem de diagnóstico.\nNão transformar conto em sentença.\nNão sugerir rupturas rápidas.\nNão usar caso fictício como caso real.'),
      jardim_psique: {
        chamada: passo.metadata?.jardim_psique?.chamada || '',
        pergunta: passo.metadata?.jardim_psique?.pergunta || '',
        campos: passo.metadata?.jardim_psique?.campos || '',
        botao: passo.metadata?.jardim_psique?.botao || '',
        confirmacao: passo.metadata?.jardim_psique?.confirmacao || ''
      },
      jardim_oficio: {
        chamada: passo.metadata?.jardim_oficio?.chamada || '',
        aviso_etico: passo.metadata?.jardim_oficio?.aviso_etico || 'Registre apenas padrões gerais e percepções simbólicas. Não inclua nome, dados identificáveis ou informações sensíveis de clientes.',
        pergunta: passo.metadata?.jardim_oficio?.pergunta || '',
        campos: passo.metadata?.jardim_oficio?.campos || '',
        botao: passo.metadata?.jardim_oficio?.botao || '',
        confirmacao: passo.metadata?.jardim_oficio?.confirmacao || ''
      },
      missao_campo: {
        titulo: passo.metadata?.missao_campo?.titulo || '',
        descricao: passo.metadata?.missao_campo?.descricao || '',
        sinais: passo.metadata?.missao_campo?.sinais || '',
        pergunta: passo.metadata?.missao_campo?.pergunta || '',
        botao: passo.metadata?.missao_campo?.botao || ''
      },
      oraculo_estacao: {
        palavra: passo.metadata?.oraculo_estacao?.palavra || '',
        movimento: passo.metadata?.oraculo_estacao?.movimento || '',
        carta_final: passo.metadata?.oraculo_estacao?.carta_final || ''
      },
      fechamento: {
        texto: passo.metadata?.fechamento?.texto || '',
        pergunta: passo.metadata?.fechamento?.pergunta || '',
        botao: passo.metadata?.fechamento?.botao || '',
        confirmacao: passo.metadata?.fechamento?.confirmacao || ''
      },
      audios: Array.isArray(passo.metadata?.audios) && passo.metadata.audios.length > 0
        ? passo.metadata.audios.slice(0, 4)
        : [
            { titulo: 'Introdução', tipo: 'introducao', funcao: 'Abrir o campo simbólico da estação', pergunta_central: '', duracao: '', url: '', roteiro: '' },
            { titulo: 'Principal', tipo: 'principal', funcao: 'A travessia da semana', pergunta_central: '', duracao: '', url: '', roteiro: '' },
            { titulo: 'Essência 80/20', tipo: 'essencia', funcao: 'O núcleo simbólico', pergunta_central: '', duracao: '', url: '', roteiro: '' },
            { titulo: 'Conto', tipo: 'conto', funcao: 'A imagem que cura', pergunta_central: '', duracao: '', url: '', roteiro: '' }
          ]
    });
  }, [passo]);

  const handleSave = () => {
    const payload = {
      ...passo,
      titulo: form.titulo,
      subtitulo: form.subtitulo,
      conteudo_inline: { texto: form.conteudo_texto },
      metadata: {
        ...passo.metadata,
        abertura_imersiva: form.abertura_imersiva,
        hero: form.hero,
        audios: form.audios,
        caso_simbolico: form.caso_simbolico,
        desafio_terapeuta: form.desafio_terapeuta,
        revelacao_estacao: form.revelacao_estacao,
        erro_comum: form.erro_comum,
        conducao_justa: form.conducao_justa,
        cautela_etica: form.cautela_etica.split('\n').map(s => s.trim()).filter(Boolean),
        jardim_psique: form.jardim_psique,
        jardim_oficio: form.jardim_oficio,
        missao_campo: form.missao_campo,
        oraculo_estacao: form.oraculo_estacao,
        fechamento: form.fechamento
      }
    };
    onSave(payload);
  };

  const updateAudio = (idx: number, field: string, value: string) => {
    const newAudios = [...form.audios];
    newAudios[idx] = { ...newAudios[idx], [field]: value };
    setForm({ ...form, audios: newAudios });
  };

  return (
    <div className="space-y-8 pb-20">
      <Card className="border-gold/20 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-8 space-y-12">
           {/* HEADER EDITOR */}
           <div className="flex items-center justify-between border-b border-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gold/10">
                <Rocket className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-foreground">Editor Único da Rota</h2>
                <p className="text-xs text-muted-foreground">Construção guiada da travessia simbólica.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => window.confirm('Deseja remover esta etapa?') && onDelete()}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button 
                className="bg-gold hover:bg-gold/90 text-black font-bold gap-2 px-6 h-12" 
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                SALVAR EXPERIÊNCIA
              </Button>
            </div>
          </div>

          {/* 1. POSICIONAMENTO & HERO */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Posicionamento & Hero
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-white/40">Título do Hero</Label>
                <Input value={form.hero.titulo} onChange={e => setForm({...form, hero: {...form.hero, titulo: e.target.value}})} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-white/40">CTA do Hero</Label>
                <Input value={form.hero.cta} onChange={e => setForm({...form, hero: {...form.hero, cta: e.target.value}})} className="bg-background/50" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase font-bold text-white/40">Texto de Entrada</Label>
                <Textarea value={form.hero.texto} onChange={e => setForm({...form, hero: {...form.hero, texto: e.target.value}})} className="bg-background/50 min-h-[80px]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-white/40">Abertura Imersiva (Opcional)</Label>
              <Textarea value={form.abertura_imersiva} onChange={e => setForm({...form, abertura_imersiva: e.target.value})} className="bg-background/50 italic font-serif" placeholder="O portal de entrada..." />
            </div>
          </div>

          {/* 2. ESTAÇÃO DE ESCUTA (ÁUDIOS) */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
              <Headphones className="w-4 h-4" /> Estação de Escuta (Áudios)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {form.audios.map((audio, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gold/60 uppercase tracking-widest">{audio.tipo}</span>
                  </div>
                  <div className="space-y-3">
                    <Input placeholder="Título do áudio" value={audio.titulo} onChange={e => updateAudio(idx, 'titulo', e.target.value)} className="bg-background/50 text-xs" />
                    <Input placeholder="URL (.mp3)" value={audio.url} onChange={e => updateAudio(idx, 'url', e.target.value)} className="bg-background/50 text-xs font-mono" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Função" value={audio.funcao} onChange={e => updateAudio(idx, 'funcao', e.target.value)} className="bg-background/50 text-[10px]" />
                      <Input placeholder="Duração" value={audio.duracao} onChange={e => updateAudio(idx, 'duracao', e.target.value)} className="bg-background/50 text-[10px]" />
                    </div>
                    <Textarea placeholder="Roteiro de gravação / Pergunta central" value={audio.roteiro || audio.pergunta_central} onChange={e => updateAudio(idx, 'roteiro', e.target.value)} className="bg-background/50 text-[10px] min-h-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CASO SIMBÓLICO & DESAFIO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Caso Simbólico
              </h3>
              <div className="space-y-4">
                <Input placeholder="Título do caso" value={form.caso_simbolico.titulo} onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, titulo: e.target.value}})} className="bg-background/50" />
                <Textarea placeholder="O relato..." value={form.caso_simbolico.relato} onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, relato: e.target.value}})} className="bg-background/50 min-h-[200px]" />
              </div>
            </div>
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Sword className="w-4 h-4" /> Desafio da Terapeuta
              </h3>
              <div className="space-y-4">
                <Textarea placeholder="A pergunta desafiadora..." value={form.desafio_terapeuta.pergunta} onChange={e => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, pergunta: e.target.value}})} className="bg-background/50" />
                <Input placeholder="Label do campo aberto" value={form.desafio_terapeuta.campo_aberto_label} onChange={e => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, campo_aberto_label: e.target.value}})} className="bg-background/50" />
              </div>
            </div>
          </div>

          {/* 4. REVELAÇÃO & ERRO COMUM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Revelação
              </h3>
              <div className="grid grid-cols-1 gap-2">
                <Input placeholder="Porta" value={form.revelacao_estacao.porta} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, porta: e.target.value}})} className="bg-background/50 text-xs" />
                <Input placeholder="Torre" value={form.revelacao_estacao.torre} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, torre: e.target.value}})} className="bg-background/50 text-xs" />
                <Input placeholder="Labirinto" value={form.revelacao_estacao.labirinto} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, labirinto: e.target.value}})} className="bg-background/50 text-xs" />
                <Input placeholder="Campo Psíquico" value={form.revelacao_estacao.campo_psiquico} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, campo_psiquico: e.target.value}})} className="bg-background/50 text-xs" />
                <Textarea placeholder="Pergunta narrativa possível" value={form.revelacao_estacao.pergunta_narrativa} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, pergunta_narrativa: e.target.value}})} className="bg-background/50 text-xs" />
              </div>
            </div>
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Erro Comum & Ética
              </h3>
              <div className="space-y-4">
                <Input placeholder="Título do erro comum..." value={form.erro_comum.titulo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, titulo: e.target.value}})} className="bg-background/50 text-xs" />
                <Textarea placeholder="Descrição do erro comum..." value={form.erro_comum.descricao} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, descricao: e.target.value}})} className="bg-background/50 text-xs" />
                <Textarea placeholder="Exemplo de erro comum..." value={form.erro_comum.exemplo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, exemplo: e.target.value}})} className="bg-background/50 text-xs" />
                <Textarea placeholder="Condução justa (texto ou relato)..." value={form.conducao_justa} onChange={e => setForm({...form, conducao_justa: e.target.value})} className="bg-background/50 text-xs min-h-[100px]" />
                <Textarea placeholder="Cautelas éticas (uma por linha)" value={form.cautela_etica} onChange={e => setForm({...form, cautela_etica: e.target.value})} className="bg-background/50 text-xs min-h-[100px]" />
              </div>
            </div>

          </div>

          {/* 5. JARDINS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Flower2 className="w-4 h-4" /> Jardim da Psique
              </h3>
              <Textarea placeholder="Pergunta principal..." value={form.jardim_psique.pergunta} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, pergunta: e.target.value}})} className="bg-background/50" />
            </div>
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Jardim do Ofício
              </h3>
              <Textarea placeholder="Pergunta principal..." value={form.jardim_oficio.pergunta} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, pergunta: e.target.value}})} className="bg-background/50" />
            </div>
          </div>

          {/* 6. ORÁCULO & FECHAMENTO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Scroll className="w-4 h-4" /> Oráculo
              </h3>
              <div className="space-y-4">
                <Input placeholder="A Palavra" value={form.oraculo_estacao.palavra} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, palavra: e.target.value}})} className="bg-background/50" />
                <Input placeholder="O Movimento" value={form.oraculo_estacao.movimento} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, movimento: e.target.value}})} className="bg-background/50" />
              </div>
            </div>
            <div className="space-y-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gold/80 flex items-center gap-2">
                <Check className="w-4 h-4" /> Conclusão
              </h3>
              <Textarea placeholder="Texto de fechamento..." value={form.fechamento.texto} onChange={e => setForm({...form, fechamento: {...form.fechamento, texto: e.target.value}})} className="bg-background/50" />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

// Helper para extrair texto de metadata
const renderContent = (content: any) => {
  if (!content) return "";
  if (typeof content === 'string') return content;
  if (typeof content === 'object') {
    return content.text || content.content || content.value || content.relato || content.pergunta_principal || "";
  }
  return String(content);
};

