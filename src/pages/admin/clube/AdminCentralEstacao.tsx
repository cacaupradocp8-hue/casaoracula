import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, BookOpen, Pencil, ImageIcon, ListMusic, ListOrdered, Sparkles, Layers, Users, Eye, Loader2, Settings, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PassosRotaTab } from '@/components/admin/central-jornadas/PassosRotaTab';
import { AulaAlbumTab } from '@/components/admin/central-jornadas/AulaAlbumTab';
import { EntradaTab } from '@/components/admin/central-jornadas/EntradaTab';
import { AplicacaoTab } from '@/components/admin/central-jornadas/AplicacaoTab';
import { EncontroTab } from '@/components/admin/central-jornadas/EncontroTab';
import { PublicadorRapido } from '@/components/admin/clube/PublicadorRapido';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminCentralEstacao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { estacaoId } = useParams<{ estacaoId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'publicador';

  const [editStationOpen, setEditStationOpen] = useState(false);
  const [quickPublishOpen, setQuickPublishOpen] = useState(false);
  const [stationForm, setStationForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    publicada: false,
    ativa: false
  });

  const onTabChange = (val: string) => {
    setSearchParams({ tab: val });
  };

  const { data: estacao, isLoading } = useQuery({
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

  useEffect(() => {
    (window as any).OpenQuickPublish = () => setQuickPublishOpen(true);
    return () => { delete (window as any).OpenQuickPublish; };
  }, []);

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
      toast({ title: 'Estação atualizada com sucesso!' });
    },
    onError: (err: any) => {
      toast({ title: 'Erro ao atualizar', description: err.message, variant: 'destructive' });
    }
  });

  if (isLoading) {
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
    <div className="container mx-auto px-4 py-8 pb-32 max-w-5xl">
        {/* Header Consolidado e Operacional */}
        <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 mb-8 p-0 bg-card border border-primary/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row flex-1 min-w-0">
            {/* Book Preview */}
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
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate('/admin/clube')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-serif text-foreground truncate">
                      {estacao.titulo}
                    </h1>
                    <Badge variant={estacao.publicada ? 'default' : 'secondary'} className={cn("text-[9px] uppercase tracking-widest", estacao.publicada ? "bg-emerald-500/10 text-emerald-500" : "")}>
                      {estacao.publicada ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    {estacao.livro_titulo} — {estacao.subtitulo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 p-6 border-t md:border-t-0 border-primary/5">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 rounded-full border border-primary/5">
              <Label htmlFor="station-publish" className="text-[10px] font-bold uppercase tracking-wider cursor-pointer">Visibilidade</Label>
              <Switch 
                id="station-publish"
                checked={estacao.publicada} 
                onCheckedChange={(v) => updateStationMutation.mutate({...stationForm, publicada: v})}
                disabled={updateStationMutation.isPending}
              />
            </div>
            
            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 rounded-full border border-primary/5">
              <Label htmlFor="station-active" className="text-[10px] font-bold uppercase tracking-wider cursor-pointer">Ativa</Label>
              <Switch 
                id="station-active"
                checked={estacao.ativa} 
                onCheckedChange={(v) => updateStationMutation.mutate({...stationForm, ativa: v})}
                disabled={updateStationMutation.isPending}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-primary/10" onClick={() => setEditStationOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Editar Geral
              </Button>
              <Button size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold gap-2" onClick={() => navigate('/clube')}>
                <Eye className="h-3.5 w-3.5" />
                Ver Visão da Aluna
              </Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2" onClick={() => setQuickPublishOpen(true)}>
                <Rocket className="h-3.5 w-3.5" />
                Publicador Rápido
              </Button>
            </div>
          </div>
        </div>

        <PublicadorRapido 
          open={quickPublishOpen}
          onClose={() => setQuickPublishOpen(false)}
          estacao={estacao}
        />

        <Dialog open={editStationOpen} onOpenChange={setEditStationOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Detalhes da Estação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título da Estação</Label>
                  <Input value={stationForm.titulo} onChange={e => setStationForm({...stationForm, titulo: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Subtítulo / Temas</Label>
                  <Input value={stationForm.subtitulo} onChange={e => setStationForm({...stationForm, subtitulo: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição da Estação</Label>
                <Textarea value={stationForm.descricao} onChange={e => setStationForm({...stationForm, descricao: e.target.value})} rows={3} />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Switch checked={stationForm.publicada} onCheckedChange={v => setStationForm({...stationForm, publicada: v})} />
                  <Label>Publicada</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={stationForm.ativa} onCheckedChange={v => setStationForm({...stationForm, ativa: v})} />
                  <Label>Ativa (Destaque)</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditStationOpen(false)}>Cancelar</Button>
              <Button className="bg-gold hover:bg-gold/90 text-black font-bold" onClick={() => updateStationMutation.mutate(stationForm)} disabled={updateStationMutation.isPending}>
                {updateStationMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         {/* Tabs - Operacional */}
         <Tabs value={activeTab} onValueChange={onTabChange}>
           <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted/30 p-1 border border-primary/5 h-auto">
             <TabsTrigger type="button" value="publicador" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold font-bold">
               <Rocket className="w-3.5 h-3.5" />
               Publicador
             </TabsTrigger>
             <TabsTrigger type="button" value="album" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
               <ListMusic className="w-3.5 h-3.5" />
               Aula-Álbum
             </TabsTrigger>
             <TabsTrigger type="button" value="passos" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
               <ListOrdered className="w-3.5 h-3.5" />
               Passos
             </TabsTrigger>
             <TabsTrigger type="button" value="entrada" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
               <Sparkles className="w-3.5 h-3.5" />
               Abertura
             </TabsTrigger>
             <TabsTrigger type="button" value="aplicacao" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
               <Layers className="w-3.5 h-3.5" />
               Lab
             </TabsTrigger>
           </TabsList>

           <TabsContent value="publicador">
             <PublicadorRapido 
               open={true}
               onClose={() => {}}
               estacao={estacao}
             />
           </TabsContent>

           <TabsContent value="album">
             <AulaAlbumTab estacaoId={estacao.id} />
          </TabsContent>

          <TabsContent value="passos">
            {/* We might need to migrate PassosRotaTab to v3 eventually, but for now we keep the layout consistent */}
            <PassosRotaTab estacaoId={estacao.id} />
          </TabsContent>

          <TabsContent value="entrada">
            <EntradaTab estacaoId={estacao.id} />
          </TabsContent>
          
          <TabsContent value="aplicacao">
            {/* The old AplicacaoTab expects the full estacao object, we pass it but it might need field adjustments */}
            <AplicacaoTab estacao={estacao as any} />
          </TabsContent>
          
          <TabsContent value="encontro">
            <EncontroTab estacaoId={estacao.id} />
          </TabsContent>
        </Tabs>
    </div>
  );
}
