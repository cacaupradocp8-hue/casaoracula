import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, Trash2, Save, LayoutPanelLeft, Sparkles, 
  ChevronUp, ChevronDown, ImageIcon, Filter, CheckCircle, Clock, Settings, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAppSettingsAdmin } from '@/hooks/useAppSettings';

export default function AdminCarrosseisInsights() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('slides');

  // Queries
  const { data: slides, isLoading: isLoadingSlides } = useQuery({
    queryKey: ['admin-clube-slides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_carrossel_slides')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ['admin-clube-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_portal_insights')
        .select('*')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const { data: seasons } = useQuery({
    queryKey: ['admin-seasons-lookup'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('oracular_seasons')
        .select('id, titulo')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Mutations for Slides
  const upsertSlide = useMutation({
    mutationFn: async (slide: any) => {
      const { error } = await supabase
        .from('clube_carrossel_slides')
        .upsert(slide);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-slides'] });
      toast.success("Slide salvo com sucesso");
    }
  });

  const deleteSlide = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_carrossel_slides')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-slides'] });
      toast.success("Slide removido");
    }
  });

  // Mutations for Insights
  const upsertInsight = useMutation({
    mutationFn: async (insight: any) => {
      const { error } = await supabase
        .from('clube_portal_insights')
        .upsert(insight);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-insights'] });
      toast.success("Insight salvo com sucesso");
    }
  });

  const deleteInsight = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clube_portal_insights')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clube-insights'] });
      toast.success("Insight removido");
    }
  });

  const handleAddSlide = () => {
    const nextOrder = (slides?.length || 0) + 1;
    upsertSlide.mutate({
      titulo: 'Novo Slide',
      texto: 'Conteúdo do slide...',
      ordem: nextOrder,
      status: 'rascunho'
    });
  };

  const handleAddInsight = () => {
    const nextOrder = (insights?.length || 0) + 1;
    upsertInsight.mutate({
      frase: 'Nova frase de insight...',
      intensidade: 'suave',
      frequencia: 'diario',
      ordem: nextOrder,
      status: 'ativo'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Badge variant="outline" className="text-gold border-gold/30 bg-gold/5 uppercase tracking-widest text-[10px]">
            Marketing Simbólico
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif text-white">Carrosséis & Insights</h1>
          <p className="text-white/40 font-light">
            Gerencie o que a aluna vê ao entrar no Clube e navegar pelas rotas.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-white/10 hover:bg-white/5 text-white/60"
          onClick={() => navigate('/admin/clube/hub')}
        >
          Voltar ao Hub
        </Button>
      </div>

      <Tabs defaultValue="slides" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border border-white/10 p-1 mb-8">
          <TabsTrigger value="slides" className="data-[state=active]:bg-gold data-[state=active]:text-black gap-2">
            <LayoutPanelLeft className="w-4 h-4" />
            Slides da Rota
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gold data-[state=active]:text-black gap-2">
            <Sparkles className="w-4 h-4" />
            Insights do Portal
          </TabsTrigger>
          <TabsTrigger value="portal-settings" className="data-[state=active]:bg-gold data-[state=active]:text-black gap-2">
            <Settings className="w-4 h-4" />
            Configurações do Portal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <Filter className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Filtros (Em breve)</span>
            </div>
            <Button onClick={handleAddSlide} className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2">
              <Plus className="w-4 h-4" />
              Novo Slide
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoadingSlides ? (
              <div className="py-12 text-center text-white/20">Carregando slides...</div>
            ) : slides?.map((slide) => (
              <SlideEditorCard 
                key={slide.id} 
                slide={slide} 
                seasons={seasons || []}
                onSave={(data) => upsertSlide.mutate({ ...slide, ...data })}
                onDelete={() => deleteSlide.mutate(slide.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <Filter className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Gestão de Frases</span>
            </div>
            <Button onClick={handleAddInsight} className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2">
              <Plus className="w-4 h-4" />
              Novo Insight
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {isLoadingInsights ? (
              <div className="py-12 text-center text-white/20">Carregando insights...</div>
            ) : insights?.map((insight) => (
              <InsightEditorCard 
                key={insight.id} 
                insight={insight} 
                onSave={(data) => upsertInsight.mutate({ ...insight, ...data })}
                onDelete={() => deleteInsight.mutate(insight.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portal-settings">
          <PortalSettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SlideEditorCard({ slide, seasons, onSave, onDelete }: { slide: any, seasons: any[], onSave: (data: any) => void, onDelete: () => void }) {
  const [data, setData] = useState(slide);

  return (
    <Card className="bg-white/5 border-white/10 hover:border-gold/30 transition-all overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-black/40 p-4 border-r border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center overflow-hidden border border-white/10">
              {data.icone ? (
                <img src={data.icone} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-white/10" />
              )}
            </div>
            <Input 
              value={data.icone || ''} 
              onChange={e => setData({...data, icone: e.target.value})}
              placeholder="URL da Imagem..."
              className="bg-black/40 border-white/10 text-xs"
            />
          </div>
          <div className="pt-4 flex items-center justify-between text-[10px] text-white/20 uppercase font-mono">
            <span>Ordem: {data.ordem}</span>
            <Badge variant="outline" className={data.status === 'publicado' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}>
              {data.status}
            </Badge>
          </div>
        </div>

        <CardContent className="flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase">Título do Slide</label>
              <Input 
                value={data.titulo || ''} 
                onChange={e => setData({...data, titulo: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase">Subtítulo</label>
              <Input 
                value={data.subtitulo || ''} 
                onChange={e => setData({...data, subtitulo: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-white/40 uppercase">Texto / Frase Simbólica</label>
            <Textarea 
              value={data.texto || ''} 
              onChange={e => setData({...data, texto: e.target.value})}
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
             <div className="space-y-1">
               <label className="text-[10px] text-white/40 uppercase">Estação Vinculada</label>
               <Select value={data.estacao_id || 'none'} onValueChange={v => setData({...data, estacao_id: v === 'none' ? null : v})}>
                 <SelectTrigger className="bg-white/5 border-white/10">
                   <SelectValue placeholder="Selecione..." />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="none">Geral / Nenhuma</SelectItem>
                   {seasons.map(s => <SelectItem key={s.id} value={s.id}>{s.titulo}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-1">
               <label className="text-[10px] text-white/40 uppercase">Slug da Rota (Opcional)</label>
               <Input 
                 value={data.rota_slug || ''} 
                 onChange={e => setData({...data, rota_slug: e.target.value})}
                 className="bg-white/5 border-white/10"
                 placeholder="ex: o-chamado"
               />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] text-white/40 uppercase">Status</label>
               <Select value={data.status} onValueChange={v => setData({...data, status: v})}>
                 <SelectTrigger className="bg-white/5 border-white/10">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="rascunho">Rascunho</SelectItem>
                   <SelectItem value="publicado">Publicado</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" size="sm" className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => onSave(data)}>
              <Save className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

function InsightEditorCard({ insight, onSave, onDelete }: { insight: any, onSave: (data: any) => void, onDelete: () => void }) {
  const [data, setData] = useState(insight);

  return (
    <Card className="bg-white/5 border-white/10 p-6 space-y-6">
      <div className="space-y-1">
        <label className="text-[10px] text-white/40 uppercase">Frase do Insight</label>
        <Textarea 
          value={data.frase} 
          onChange={e => setData({...data, frase: e.target.value})}
          className="bg-white/5 border-white/10 text-lg font-serif italic"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase">Intensidade</label>
          <Select value={data.intensidade} onValueChange={v => setData({...data, intensidade: v})}>
            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="suave">Suave</SelectItem>
              <SelectItem value="profunda">Profunda</SelectItem>
              <SelectItem value="impactante">Impactante</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase">Frequência</label>
          <Select value={data.frequencia} onValueChange={v => setData({...data, frequencia: v})}>
            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diario">Diário (Um por dia)</SelectItem>
              <SelectItem value="por_acesso">A cada acesso</SelectItem>
              <SelectItem value="sorteio">Sorteio Aleatório</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase">Ordem</label>
          <Input 
            type="number"
            value={data.ordem} 
            onChange={e => setData({...data, ordem: parseInt(e.target.value)})}
            className="bg-white/5 border-white/10 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 uppercase">Status</label>
          <Select value={data.status} onValueChange={v => setData({...data, status: v})}>
            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button variant="ghost" size="sm" className="text-red-500/60 hover:text-red-500 hover:bg-red-500/10" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
        <Button size="sm" className="bg-gold hover:bg-gold/80 text-black font-semibold gap-2" onClick={() => onSave(data)}>
          <Save className="w-4 h-4" />
          Salvar
        </Button>
      </div>
    </Card>
  );
}

function PortalSettingsTab() {
  const { settings, updateSetting, isLoading } = useAppSettingsAdmin();
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings.length > 0) {
      const data: Record<string, string> = {};
      settings.forEach(s => {
        data[s.key] = s.value;
      });
      setFormData(data);
    }
  }, [settings]);

  const handleSave = async () => {
    const keysToSave = [
      'portal_rotas_welcome_audio_title',
      'portal_rotas_welcome_audio_subtitle',
      'portal_rotas_welcome_audio_description',
      'portal_rotas_welcome_audio_url',
      'portal_rotas_welcome_audio_image'
    ];

    for (const key of keysToSave) {
      if (formData[key] !== undefined) {
        await updateSetting(key, formData[key]);
      }
    }
    toast.success("Configurações do portal salvas");
  };

  if (isLoading) return <div className="py-12 text-center text-white/20">Carregando configurações...</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-5 h-5 text-gold" />
            <CardTitle>Áudio de Boas-Vindas</CardTitle>
          </div>
          <CardDescription>Configurações da escuta imersiva que aparece no Portal das Rotas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Título do Bloco</label>
              <Input 
                value={formData['portal_rotas_welcome_audio_title'] || ''} 
                onChange={e => setFormData({...formData, portal_rotas_welcome_audio_title: e.target.value})}
                placeholder="Ex: A Voz da Casa"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Subtítulo</label>
              <Input 
                value={formData['portal_rotas_welcome_audio_subtitle'] || ''} 
                onChange={e => setFormData({...formData, portal_rotas_welcome_audio_subtitle: e.target.value})}
                placeholder="Ex: Antes de escolher uma rota, escute a chegada."
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Descrição Poética</label>
            <Textarea 
              value={formData['portal_rotas_welcome_audio_description'] || ''} 
              onChange={e => setFormData({...formData, portal_rotas_welcome_audio_description: e.target.value})}
              placeholder="Ex: Esta escuta foi criada para desacelerar sua entrada..."
              className="bg-white/5 border-white/10 min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">URL do Áudio (.mp3)</label>
              <Input 
                value={formData['portal_rotas_welcome_audio_url'] || ''} 
                onChange={e => setFormData({...formData, portal_rotas_welcome_audio_url: e.target.value})}
                placeholder="https://sua-url-do-audio.mp3"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">URL da Imagem de Fundo</label>
              <Input 
                value={formData['portal_rotas_welcome_audio_image'] || ''} 
                onChange={e => setFormData({...formData, portal_rotas_welcome_audio_image: e.target.value})}
                placeholder="https://sua-imagem.jpg"
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button onClick={handleSave} className="bg-gold hover:bg-gold/80 text-black font-bold gap-2">
              <Save className="w-4 h-4" />
              Salvar Configurações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
