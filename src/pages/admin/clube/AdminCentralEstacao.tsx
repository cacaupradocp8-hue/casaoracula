import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, Loader2, Compass, ChevronRight, Search, AlertCircle,
  ArrowLeft, Pencil, ImageIcon, Users, Eye, Settings, Rocket, Save, 
  Music, Sparkles, Plus, Trash2, Headphones, Sword, AlertTriangle, 
  Flower2, Scroll, Check, MapPin
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function cleanTechnicalTitle(title: string) {
  if (!title) return '';
  return title
    .replace('SISTEMA_ROTAS:', '')
    .replace('ROTAS:', '')
    .replace('Módulo:', '')
    .trim();
}

/**
 * Camada 2 — Ferramenta Oracular de Rastreamento Simbólico
 * Interface para os dados da ferramenta oracular.
 */
interface FerramentaOracularData {
  enabled: boolean;
  tool_id: string;
  nome_admin: string;
  nome_publico: string;
  kicker: string;
  simbolo: string;
  pergunta_mae: string;
  funcao: string;
  indicadores: Array<{ id: string; label: string; tipo_resposta?: string }>;
  tipo_resultado: "intensidade" | "arquetipo" | "rastro";
  resultados: Array<{ id: string; titulo: string; descricao: string }>;
  registros_sugeridos: {
    jardim_psique: string;
    jardim_oficio: string;
  };
  camada_metodo: 'concepcao' | 'cartografia' | 'rastro' | 'mapa' | 'revelacao' | 'integracao' | '';
}

interface EditorFormState {
  titulo: string;
  subtitulo: string;
  conteudo_texto: string;
  abertura_imersiva: string;
  hero: { titulo: string; texto: string; cta: string };
  caso_simbolico: { titulo: string; aviso: string; relato: string };
  desafio_terapeuta: { pergunta: string; escolhas: string[]; campo_aberto_label: string };
  ferramenta_oracular: FerramentaOracularData;
  revelacao_estacao: { porta: string; campo_psiquico: string; torre: string; labirinto: string; pergunta_narrativa: string };
  erro_comum: { titulo: string; descricao: string; exemplo: string; explicacao: string };
  conducao_justa: string;
  cautela_etica: string;
  jardim_psique: { chamada: string; pergunta: string; campos: any; botao: string; confirmacao: string };
  jardim_oficio: { chamada: string; aviso_etico: string; pergunta: string; campos: any; botao: string; confirmacao: string };
  missao_campo: { titulo: string; descricao: string; sinais: string; pergunta: string; botao: string };
  oraculo_estacao: { palavra: string; movimento: string; carta_final: string };
  fechamento: { texto: string; pergunta: string; botao: string; confirmacao: string };
  conto_espelho: { titulo: string; texto: string; moral: string };
  audios: any[];
}

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
    ativa: false,
    banner_url: '',
    livro_capa_url: '',
    livro_titulo: ''
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
        ativa: estacao.ativa || false,
        banner_url: estacao.banner_url || '',
        livro_capa_url: estacao.livro_capa_url || '',
        livro_titulo: estacao.livro_titulo || ''
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
          ativa: data.ativa,
          banner_url: data.banner_url,
          livro_capa_url: data.livro_capa_url,
          livro_titulo: data.livro_titulo
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
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/rotas')}>Voltar</Button>
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
            <div className="flex items-start gap-4 mb-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 mt-1" onClick={() => navigate('/admin/rotas')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                  <span className="cursor-pointer hover:text-gold" onClick={() => navigate('/admin/rotas')}>Rotas da Casa</span>
                  <ChevronRight className="w-2.5 h-2.5" />
                  <span className="text-gold">{cleanTechnicalTitle(estacao.livro_titulo || 'Rota')}</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-serif text-foreground truncate">{estacao.titulo}</h1>
                  <Badge variant={estacao.publicada ? 'default' : 'secondary'} className={cn("text-[9px] uppercase tracking-widest", estacao.publicada ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                    {estacao.publicada ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-gold" />
                  Obra-base: {cleanTechnicalTitle(estacao.livro_titulo)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 p-6 border-t md:border-t-0 border-primary/5 bg-muted/20">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={() => {
              const currentPasso = selectedPasso || passos[0];
              if (currentPasso?.slug) {
                navigate(`/clube/rota/${currentPasso.slug}`);
              } else {
                navigate('/admin/rotas');
              }
            }}
          >
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
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold">Modo Operacional</div>
          </div>
          
          <div className="space-y-2">
            {passos.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-primary/10 rounded-xl text-muted-foreground text-sm">
                Nenhuma etapa criada.
                <span className="text-gold opacity-50 block mt-2">Criação disponível via SQL</span>
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
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2 text-left">
            <div className="space-y-2">
              <Label>Obra / Livro Base</Label>
              <Input value={stationForm.livro_titulo} onChange={e => setStationForm({...stationForm, livro_titulo: e.target.value})} placeholder="Ex: Mulheres que Correm com os Lobos" />
            </div>
            <div className="space-y-2">
              <Label>Título da Estação</Label>
              <Input value={stationForm.titulo} onChange={e => setStationForm({...stationForm, titulo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Input value={stationForm.subtitulo} onChange={e => setStationForm({...stationForm, subtitulo: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Banner URL (Fundo Imersivo)</Label>
              <Input value={stationForm.banner_url} onChange={e => setStationForm({...stationForm, banner_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Capa do Livro URL (Miniatura)</Label>
              <Input value={stationForm.livro_capa_url} onChange={e => setStationForm({...stationForm, livro_capa_url: e.target.value})} placeholder="https://..." />
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

interface EditorFormState {
  titulo: string;
  subtitulo: string;
  conteudo_texto: string;
  abertura_imersiva: string;
  hero: { titulo: string; texto: string; cta: string };
  caso_simbolico: { titulo: string; aviso: string; relato: string };
  desafio_terapeuta: { pergunta: string; escolhas: string[]; campo_aberto_label: string };
  ferramenta_oracular: FerramentaOracularData;
  revelacao_estacao: { porta: string; campo_psiquico: string; torre: string; labirinto: string; pergunta_narrativa: string };
  erro_comum: { titulo: string; descricao: string; exemplo: string; explicacao: string };
  conducao_justa: string;
  cautela_etica: string;
  jardim_psique: { chamada: string; pergunta: string; campos: any; botao: string; confirmacao: string };
  jardim_oficio: { chamada: string; aviso_etico: string; pergunta: string; campos: any; botao: string; confirmacao: string };
  missao_campo: { titulo: string; descricao: string; sinais: string; pergunta: string; botao: string };
  oraculo_estacao: { palavra: string; movimento: string; carta_final: string };
  fechamento: { texto: string; pergunta: string; botao: string; confirmacao: string };
  audios: any[];
}

function EditorUnico({ passo, onSave, onDelete, loading }: { passo: any, onSave: (p: any) => void, onDelete: () => void, loading: boolean }) {
  const [form, setForm] = useState<EditorFormState>({
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
    ferramenta_oracular: {
      enabled: passo.metadata?.ferramenta_oracular?.enabled || false,
      tool_id: passo.metadata?.ferramenta_oracular?.tool_id || '',
      nome_admin: passo.metadata?.ferramenta_oracular?.nome_admin || '',
      nome_publico: passo.metadata?.ferramenta_oracular?.nome_publico || '',
      kicker: passo.metadata?.ferramenta_oracular?.kicker || 'Camada do Método',
      simbolo: passo.metadata?.ferramenta_oracular?.simbolo || '',
      pergunta_mae: passo.metadata?.ferramenta_oracular?.pergunta_mae || '',
      funcao: passo.metadata?.ferramenta_oracular?.funcao || '',
      indicadores: Array.isArray(passo.metadata?.ferramenta_oracular?.indicadores) ? passo.metadata.ferramenta_oracular.indicadores : [],
      tipo_resultado: passo.metadata?.ferramenta_oracular?.tipo_resultado || 'intensidade',
      resultados: Array.isArray(passo.metadata?.ferramenta_oracular?.resultados) ? passo.metadata.ferramenta_oracular.resultados : [],
      registros_sugeridos: {
        jardim_psique: passo.metadata?.ferramenta_oracular?.registros_sugeridos?.jardim_psique || '',
        jardim_oficio: passo.metadata?.ferramenta_oracular?.registros_sugeridos?.jardim_oficio || ''
      },
      camada_metodo: passo.metadata?.ferramenta_oracular?.camada_metodo || ''
    },
      revelacao_estacao: {
        porta: passo.metadata?.revelacao_estacao?.porta || '',
        campo_psiquico: passo.metadata?.revelacao_estacao?.campo_psiquico || '',
        torre: passo.metadata?.revelacao_estacao?.torre || '',
        labirinto: passo.metadata?.revelacao_estacao?.labirinto || '',
        pergunta_narrativa: passo.metadata?.revelacao_estacao?.pergunta_narrativa || ''
      },
    conto_espelho: {
      titulo: passo.metadata?.conto_espelho?.titulo || '',
      texto: passo.metadata?.conto_espelho?.texto || '',
      moral: passo.metadata?.conto_espelho?.moral || ''
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
      ? passo.metadata.audios.map((a: any) => ({
          titulo: a.titulo || '',
          tipo: a.tipo || '',
          funcao: a.funcao || '',
          pergunta_central: a.pergunta_central || '',
          duracao: a.duracao || '',
          url: a.url || '',
          roteiro: a.roteiro || '',
          transcricao: a.transcricao || ''
        })).slice(0, 4)
      : [
          { titulo: 'Introdução', tipo: 'introducao', funcao: 'Abrir o campo simbólico da estação', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
          { titulo: 'Principal', tipo: 'principal', funcao: 'A travessia da semana', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
          { titulo: 'Essência 80/20', tipo: 'essencia', funcao: 'O núcleo simbólico', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
          { titulo: 'Conto', tipo: 'conto', funcao: 'A imagem que cura', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' }
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
      // Camada 2 — Ferramenta Oracular de Rastreamento Simbólico
      ferramenta_oracular: {
        enabled: passo.metadata?.ferramenta_oracular?.enabled || false,
        tool_id: passo.metadata?.ferramenta_oracular?.tool_id || '',
        nome_admin: passo.metadata?.ferramenta_oracular?.nome_admin || '',
        nome_publico: passo.metadata?.ferramenta_oracular?.nome_publico || '',
        kicker: passo.metadata?.ferramenta_oracular?.kicker || 'Camada do Método',
        simbolo: passo.metadata?.ferramenta_oracular?.simbolo || '',
        pergunta_mae: passo.metadata?.ferramenta_oracular?.pergunta_mae || '',
        funcao: passo.metadata?.ferramenta_oracular?.funcao || '',
        indicadores: Array.isArray(passo.metadata?.ferramenta_oracular?.indicadores) ? passo.metadata.ferramenta_oracular.indicadores : [],
        tipo_resultado: passo.metadata?.ferramenta_oracular?.tipo_resultado || 'intensidade',
        resultados: Array.isArray(passo.metadata?.ferramenta_oracular?.resultados) ? passo.metadata.ferramenta_oracular.resultados : [],
        registros_sugeridos: {
          jardim_psique: passo.metadata?.ferramenta_oracular?.registros_sugeridos?.jardim_psique || '',
          jardim_oficio: passo.metadata?.ferramenta_oracular?.registros_sugeridos?.jardim_oficio || ''
        },
        camada_metodo: passo.metadata?.ferramenta_oracular?.camada_metodo || ''
      },
      conto_espelho: {
        titulo: passo.metadata?.conto_espelho?.titulo || '',
        texto: passo.metadata?.conto_espelho?.texto || '',
        moral: passo.metadata?.conto_espelho?.moral || ''
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
        ? passo.metadata.audios.map((a: any) => ({
            titulo: a.titulo || '',
            tipo: a.tipo || '',
            funcao: a.funcao || '',
            pergunta_central: a.pergunta_central || '',
            duracao: a.duracao || '',
            url: a.url || '',
            roteiro: a.roteiro || '',
            transcricao: a.transcricao || ''
          })).slice(0, 4)
        : [
            { titulo: 'Introdução', tipo: 'introducao', funcao: 'Abrir o campo simbólico da estação', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
            { titulo: 'Principal', tipo: 'principal', funcao: 'A travessia da semana', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
            { titulo: 'Essência 80/20', tipo: 'essencia', funcao: 'O núcleo simbólico', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' },
            { titulo: 'Conto', tipo: 'conto', funcao: 'A imagem que cura', pergunta_central: '', duracao: '', url: '', roteiro: '', transcricao: '' }
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
        ferramenta_oracular: form.ferramenta_oracular,
        conto_espelho: form.conto_espelho,
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

          <Accordion type="multiple" className="w-full space-y-4">
            {/* 1. Identidade e Entrada */}
            <AccordionItem value="identidade" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">1. Identidade e Entrada</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-6">
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
              </AccordionContent>
            </AccordionItem>

            {/* 1.5. Conto Espelho */}
            <AccordionItem value="conto-espelho" className="border border-gold/20 rounded-xl px-4 bg-gold/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest text-gold">1.5. Conto Espelho (Narrativa)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Título do Conto</Label>
                  <Input value={form.conto_espelho.titulo} onChange={e => setForm({...form, conto_espelho: {...form.conto_espelho, titulo: e.target.value}})} className="bg-background/50" placeholder="O Nome do Conto..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Narrativa Iniciática</Label>
                  <Textarea value={form.conto_espelho.texto} onChange={e => setForm({...form, conto_espelho: {...form.conto_espelho, texto: e.target.value}})} className="bg-background/50 min-h-[200px] font-serif italic" placeholder="Era uma vez..." />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">A Moral/A Chave</Label>
                  <Input value={form.conto_espelho.moral} onChange={e => setForm({...form, conto_espelho: {...form.conto_espelho, moral: e.target.value}})} className="bg-background/50" placeholder="A chave simbólica deste conto é..." />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Estação de Escuta */}
            <AccordionItem value="escuta" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">2. Estação de Escuta</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {form.audios.map((audio, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-gold/60 uppercase tracking-widest">{audio.tipo}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-white/40">Título do Áudio</Label>
                          <Input value={audio.titulo} onChange={e => updateAudio(idx, 'titulo', e.target.value)} className="bg-background/50 text-xs" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-white/40">URL (.mp3)</Label>
                          <Input value={audio.url} onChange={e => updateAudio(idx, 'url', e.target.value)} className="bg-background/50 text-xs font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-white/40">Função</Label>
                            <Input value={audio.funcao} onChange={e => updateAudio(idx, 'funcao', e.target.value)} className="bg-background/50 text-[10px]" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase text-white/40">Duração</Label>
                            <Input value={audio.duracao} onChange={e => updateAudio(idx, 'duracao', e.target.value)} className="bg-background/50 text-[10px]" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-white/40">Pergunta Central</Label>
                          <Input value={audio.pergunta_central} onChange={e => updateAudio(idx, 'pergunta_central', e.target.value)} className="bg-background/50 text-[10px]" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-white/40">Roteiro de Gravação</Label>
                          <Textarea value={audio.roteiro} onChange={e => updateAudio(idx, 'roteiro', e.target.value)} className="bg-background/50 text-[10px] min-h-[60px]" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[9px] uppercase text-white/40">Transcrição Opcional</Label>
                          <Textarea value={audio.transcricao} onChange={e => updateAudio(idx, 'transcricao', e.target.value)} className="bg-background/50 text-[10px] min-h-[60px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Caso Simbólico */}
            <AccordionItem value="caso" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">3. Caso Simbólico</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Título do Caso</Label>
                  <Input placeholder="Título do caso" value={form.caso_simbolico.titulo} onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, titulo: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Aviso Legal/Pedagógico</Label>
                  <Input value={form.caso_simbolico.aviso} onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, aviso: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Relato do Caso</Label>
                  <Textarea placeholder="O relato..." value={form.caso_simbolico.relato} onChange={e => setForm({...form, caso_simbolico: {...form.caso_simbolico, relato: e.target.value}})} className="bg-background/50 min-h-[200px]" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Desafio da Terapeuta */}
            <AccordionItem value="desafio" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sword className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">4. Desafio da Terapeuta</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta Desafiadora</Label>
                  <Textarea placeholder="A pergunta desafiadora..." value={form.desafio_terapeuta.pergunta} onChange={e => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, pergunta: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Label do Campo de Resposta</Label>
                  <Input placeholder="Ex: O que você vê?" value={form.desafio_terapeuta.campo_aberto_label} onChange={e => setForm({...form, desafio_terapeuta: {...form.desafio_terapeuta, campo_aberto_label: e.target.value}})} className="bg-background/50" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Revelação */}
            <AccordionItem value="revelacao" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">5. Revelação</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Porta</Label>
                    <Input value={form.revelacao_estacao.porta} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, porta: e.target.value}})} className="bg-background/50 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Torre</Label>
                    <Input value={form.revelacao_estacao.torre} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, torre: e.target.value}})} className="bg-background/50 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Labirinto</Label>
                    <Input value={form.revelacao_estacao.labirinto} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, labirinto: e.target.value}})} className="bg-background/50 text-xs" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Campo Psíquico</Label>
                    <Input value={form.revelacao_estacao.campo_psiquico} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, campo_psiquico: e.target.value}})} className="bg-background/50 text-xs" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta Narrativa Possível</Label>
                  <Textarea value={form.revelacao_estacao.pergunta_narrativa} onChange={e => setForm({...form, revelacao_estacao: {...form.revelacao_estacao, pergunta_narrativa: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Erro Comum */}
            <AccordionItem value="erro" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">6. Erro Comum</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Título do Erro</Label>
                  <Input value={form.erro_comum.titulo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, titulo: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Descrição</Label>
                  <Textarea value={form.erro_comum.descricao} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, descricao: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Exemplo Prático</Label>
                  <Textarea value={form.erro_comum.exemplo} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, exemplo: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Explicação Teórica</Label>
                  <Textarea value={form.erro_comum.explicacao} onChange={e => setForm({...form, erro_comum: {...form.erro_comum, explicacao: e.target.value}})} className="bg-background/50 text-xs" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Condução Justa */}
            <AccordionItem value="conducao" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">7. Condução Justa</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-2">
                <Label className="text-[10px] uppercase font-bold text-white/40">Texto ou Relato de Condução</Label>
                <Textarea value={form.conducao_justa} onChange={e => setForm({...form, conducao_justa: e.target.value})} className="bg-background/50 text-xs min-h-[150px]" />
              </AccordionContent>
            </AccordionItem>

            {/* 8. Cautela Ética */}
            <AccordionItem value="etica" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">8. Cautela Ética</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-2">
                <Label className="text-[10px] uppercase font-bold text-white/40">Lista de Cautelas (uma por linha)</Label>
                <Textarea value={form.cautela_etica} onChange={e => setForm({...form, cautela_etica: e.target.value})} className="bg-background/50 text-xs min-h-[150px]" />
              </AccordionContent>
            </AccordionItem>

            {/* Camada 2 — Ferramenta Oracular de Rastreamento Simbólico */}
            <AccordionItem value="ferramenta-oracular" className="border-2 border-gold/40 rounded-xl px-4 bg-gold/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest text-gold">Camada 2 — Ferramenta Oracular de Rastreamento</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-6">
                <div className="flex items-center gap-2 mb-4 p-3 bg-background/50 rounded-lg border border-gold/20">
                  <Switch 
                    checked={form.ferramenta_oracular.enabled} 
                    onCheckedChange={v => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, enabled: v}})} 
                  />
                  <Label className="text-xs font-bold uppercase tracking-widest cursor-pointer">Ativar Camada 2 na Rota</Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">ID da Ferramenta</Label>
                    <Input placeholder="radar_silenciamento" value={form.ferramenta_oracular.tool_id} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, tool_id: e.target.value}})} className="bg-background/50" />
                  </div>
                   <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Símbolo do Método</Label>
                    <Input placeholder="O Sino" value={form.ferramenta_oracular.simbolo} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, simbolo: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Kicker Público (Ex: Camada do Método II)</Label>
                    <Input placeholder="Camada do Método I" value={form.ferramenta_oracular.kicker} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, kicker: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Nome Público (App)</Label>
                    <Input placeholder="Radar de Silenciamento™" value={form.ferramenta_oracular.nome_publico} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, nome_publico: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Função/Objetivo</Label>
                    <Input placeholder="O que está tentando despertar?" value={form.ferramenta_oracular.funcao} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, funcao: e.target.value}})} className="bg-background/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta-Mãe (Pergunta do Método)</Label>
                  <Textarea placeholder="O que em você continua tentando chamar sua atenção?" value={form.ferramenta_oracular.pergunta_mae} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, pergunta_mae: e.target.value}})} className="bg-background/50 font-serif italic" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Registros Sugeridos</Label>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase text-white/20">Jardim da Psique</Label>
                        <Input value={form.ferramenta_oracular.registros_sugeridos.jardim_psique} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, registros_sugeridos: {...form.ferramenta_oracular.registros_sugeridos, jardim_psique: e.target.value}}})} className="bg-background/50 text-[10px]" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] uppercase text-white/20">Jardim do Ofício</Label>
                        <Input value={form.ferramenta_oracular.registros_sugeridos.jardim_oficio} onChange={e => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, registros_sugeridos: {...form.ferramenta_oracular.registros_sugeridos, jardim_oficio: e.target.value}}})} className="bg-background/50 text-[10px]" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Status do Método</Label>
                    <div className="p-4 bg-background/50 rounded-xl border border-primary/5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Select 
                          value={form.ferramenta_oracular.camada_metodo} 
                          onValueChange={v => setForm({...form, ferramenta_oracular: {...form.ferramenta_oracular, camada_metodo: v as any}})}
                        >
                          <SelectTrigger className="h-10 bg-background/50 border-gold/30">
                            <SelectValue placeholder="Selecione o valor simbólico" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="concepcao">Concepção</SelectItem>
                            <SelectItem value="cartografia">Cartografia</SelectItem>
                            <SelectItem value="rastro">Rastro</SelectItem>
                            <SelectItem value="mapa">Mapa</SelectItem>
                            <SelectItem value="revelacao">Revelação</SelectItem>
                            <SelectItem value="integracao">Integração</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className="text-[10px] uppercase font-bold text-gold">Valor Simbólico</Label>
                      </div>
                      <p className="text-[9px] text-muted-foreground leading-relaxed">Garante que o rastro seja capturado para a jornada simbólica da aluna nesta rota.</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 9. Jardim da Psique */}
            <AccordionItem value="jardim-psique" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Flower2 className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">9. Jardim da Psique</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Chamada/Instrução</Label>
                  <Input value={form.jardim_psique.chamada} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, chamada: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta Principal</Label>
                  <Textarea value={form.jardim_psique.pergunta} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, pergunta: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Texto do Botão</Label>
                    <Input value={form.jardim_psique.botao} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, botao: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Microcopy de Confirmação</Label>
                    <Input value={form.jardim_psique.confirmacao} onChange={e => setForm({...form, jardim_psique: {...form.jardim_psique, confirmacao: e.target.value}})} className="bg-background/50" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 10. Jardim do Ofício */}
            <AccordionItem value="jardim-oficio" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-bold uppercase tracking-widest">10. Jardim do Ofício</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Aviso de Privacidade/Ético</Label>
                  <Input value={form.jardim_oficio.aviso_etico} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, aviso_etico: e.target.value}})} className="bg-background/50 text-[10px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta Principal</Label>
                  <Textarea value={form.jardim_oficio.pergunta} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, pergunta: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Texto do Botão</Label>
                    <Input value={form.jardim_oficio.botao} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, botao: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Microcopy de Confirmação</Label>
                    <Input value={form.jardim_oficio.confirmacao} onChange={e => setForm({...form, jardim_oficio: {...form.jardim_oficio, confirmacao: e.target.value}})} className="bg-background/50" />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 11. Missão de Campo */}
            <AccordionItem value="missao" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">Etapa 11. Missão de Campo</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Título da Missão</Label>
                  <Input value={form.missao_campo.titulo} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, titulo: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Descrição</Label>
                  <Textarea value={form.missao_campo.descricao} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, descricao: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Sinais de Observação</Label>
                  <Textarea value={form.missao_campo.sinais} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, sinais: e.target.value}})} className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta de Registro</Label>
                  <Textarea value={form.missao_campo.pergunta} onChange={e => setForm({...form, missao_campo: {...form.missao_campo, pergunta: e.target.value}})} className="bg-background/50" />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 12. Oráculo e Fechamento */}
            <AccordionItem value="oraculo" className="border border-primary/10 rounded-xl px-4 bg-white/5 overflow-hidden">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold uppercase tracking-widest">Etapa 12. Oráculo e Fechamento</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">A Palavra</Label>
                    <Input value={form.oraculo_estacao.palavra} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, palavra: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">O Movimento</Label>
                    <Input value={form.oraculo_estacao.movimento} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, movimento: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Carta Final</Label>
                    <Input value={form.oraculo_estacao.carta_final} onChange={e => setForm({...form, oraculo_estacao: {...form.oraculo_estacao, carta_final: e.target.value}})} className="bg-background/50" />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Texto Final</Label>
                    <Textarea value={form.fechamento.texto} onChange={e => setForm({...form, fechamento: {...form.fechamento, texto: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-white/40">Pergunta de Fechamento</Label>
                    <Textarea value={form.fechamento.pergunta} onChange={e => setForm({...form, fechamento: {...form.fechamento, pergunta: e.target.value}})} className="bg-background/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-white/40">Texto do Botão</Label>
                      <Input value={form.fechamento.botao} onChange={e => setForm({...form, fechamento: {...form.fechamento, botao: e.target.value}})} className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-white/40">Microcopy de Conclusão</Label>
                      <Input value={form.fechamento.confirmacao} onChange={e => setForm({...form, fechamento: {...form.fechamento, confirmacao: e.target.value}})} className="bg-background/50" />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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

