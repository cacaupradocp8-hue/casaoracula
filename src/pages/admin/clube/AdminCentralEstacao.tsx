import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Route, Calendar, Layers, Users, Loader2, Sparkles, Layout, ListOrdered, Pencil, Image as ImageIcon, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PassosRotaTab } from '@/components/admin/central-jornadas/PassosRotaTab';
import { EstradaTab } from '@/components/admin/central-jornadas/EstradaTab';
import { SemanasTab } from '@/components/admin/central-jornadas/SemanasTab';
import { EntradaTab } from '@/components/admin/central-jornadas/EntradaTab';
import { AplicacaoTab } from '@/components/admin/central-jornadas/AplicacaoTab';
import { EncontroTab } from '@/components/admin/central-jornadas/EncontroTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function AdminCentralEstacao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { estacaoId: paramId } = useParams<{ estacaoId: string }>();
  const activeAdminTab = (window as any).Admin_ActiveTab || '';
  const estacaoId = paramId || (activeAdminTab.startsWith('central-estacao-') ? activeAdminTab.replace('central-estacao-', '') : null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'passos';

  const [editStationOpen, setEditStationOpen] = useState(false);
  const [stationForm, setStationForm] = useState({
    titulo: '',
    subtitulo: '',
    descricao: '',
    banner_url: '',
    livro_titulo: '',
    livro_autor: '',
    livro_capa_url: '',
    livro_imagem_banner_url: '',
    ativa: false,
    publicada: false
  });

  const onTabChange = (val: string) => {
    setSearchParams({ tab: val });
  };

  const { data: estacao, isLoading } = useQuery({
    queryKey: ['admin-estacao-detail', estacaoId],
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
    if (estacao) {
      setStationForm({
        titulo: estacao.titulo || '',
        subtitulo: estacao.subtitulo || '',
        descricao: estacao.descricao || '',
        banner_url: estacao.banner_url || '',
        livro_titulo: estacao.livro_titulo || '',
        livro_autor: estacao.livro_autor || '',
        livro_capa_url: estacao.livro_capa_url || '',
        livro_imagem_banner_url: estacao.livro_imagem_banner_url || '',
        ativa: estacao.ativa || false,
        publicada: estacao.publicada || false
      });
    }
  }, [estacao]);

  const updateStationMutation = useMutation({
    mutationFn: async (data: typeof stationForm) => {
      const { error } = await supabase
        .from('clube_estacoes')
        .update(data)
        .eq('id', estacaoId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-estacao-detail', estacaoId] });
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
        <Button variant="outline" className="mt-4" onClick={() => (window as any).Admin_SetActiveTab?.('clube-jornadas')}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32 max-w-5xl">
        {/* Header Consolidado e Operacional */}
        <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 mb-8 p-0 bg-card border border-primary/5 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row flex-1 min-w-0">
            {/* Book Preview / Quick Upload Zone */}
            <div className="w-full md:w-32 h-32 md:h-auto bg-muted group relative cursor-pointer overflow-hidden" onClick={() => setEditStationOpen(true)}>
              {estacao.livro_capa_url ? (
                <img src={estacao.livro_capa_url} alt="Capa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => {
                  (window as any).Admin_SetActiveTab?.('clube-jornadas');
                  navigate('/admin/clube/ciclos');
                }}>
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
                    {estacao.ativa && <Badge variant="outline" className="text-[9px] border-gold text-gold uppercase tracking-widest bg-gold/5">Ativa</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-gold" />
                    {estacao.livro_titulo} {estacao.livro_autor ? `— ${estacao.livro_autor}` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-primary/5">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/30 rounded-full border border-primary/5">
              <Label htmlFor="station-publish" className="text-[10px] font-bold uppercase tracking-wider cursor-pointer">Visibilidade</Label>
              <Switch 
                id="station-publish"
                checked={estacao.publicada} 
                onCheckedChange={(v) => updateStationMutation.mutate({...stationForm, publicada: v})}
                disabled={updateStationMutation.isPending}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-primary/10" onClick={() => setEditStationOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Editar Geral
              </Button>
              <Button size="sm" className="bg-gold hover:bg-gold/90 text-black font-bold gap-2" onClick={() => (window as any).open(`https://clube.oracular.com.br/estacao/${estacao.id}`, '_blank')}>
                <ExternalLink className="h-3.5 w-3.5" />
                Ver na Aluna
              </Button>
            </div>
          </div>
        </div>

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
                  <Label>Subtítulo</Label>
                  <Input value={stationForm.subtitulo} onChange={e => setStationForm({...stationForm, subtitulo: e.target.value})} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição da Estação</Label>
                <Textarea value={stationForm.descricao} onChange={e => setStationForm({...stationForm, descricao: e.target.value})} rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <ImageUpload 
                  label="Banner da Estação" 
                  value={stationForm.banner_url} 
                  onChange={url => setStationForm({...stationForm, banner_url: url})} 
                  folder="estacoes"
                  aspectRatio="banner"
                />
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={stationForm.ativa} onCheckedChange={v => setStationForm({...stationForm, ativa: v})} />
                      <Label>Ativa</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={stationForm.publicada} onCheckedChange={v => setStationForm({...stationForm, publicada: v})} />
                      <Label>Publicada</Label>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />
              <h3 className="font-semibold text-sm flex items-center gap-2"><BookOpen className="w-4 h-4 text-gold" /> Dados do Livro</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título do Livro</Label>
                  <Input value={stationForm.livro_titulo} onChange={e => setStationForm({...stationForm, livro_titulo: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Autora/Autor</Label>
                  <Input value={stationForm.livro_autor} onChange={e => setStationForm({...stationForm, livro_autor: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ImageUpload 
                  label="Capa do Livro" 
                  value={stationForm.livro_capa_url} 
                  onChange={url => setStationForm({...stationForm, livro_capa_url: url})} 
                  folder="livros"
                  aspectRatio="square"
                />
                <ImageUpload 
                  label="Banner do Livro" 
                  value={stationForm.livro_imagem_banner_url} 
                  onChange={url => setStationForm({...stationForm, livro_imagem_banner_url: url})} 
                  folder="livros"
                  aspectRatio="banner"
                />
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

        {/* Tabs - Alinhadas com as 4 Camadas da Aluna */}
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-muted/30 p-1 border border-primary/5 h-auto">
            <TabsTrigger type="button" value="passos" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <ListOrdered className="w-3.5 h-3.5" />
              Rota (Passos)
            </TabsTrigger>
            <TabsTrigger type="button" value="entrada" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              Iniciação
            </TabsTrigger>
            <TabsTrigger type="button" value="semanas" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold opacity-50">
              <Calendar className="w-3.5 h-3.5" />
              Legado
            </TabsTrigger>
            <TabsTrigger type="button" value="estrada" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold opacity-50">
              <Route className="w-3.5 h-3.5" />
              Estrada (Velha)
            </TabsTrigger>
            <TabsTrigger type="button" value="aplicacao" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Layers className="w-3.5 h-3.5" />
              Lab IA
            </TabsTrigger>
            <TabsTrigger type="button" value="encontro" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Users className="w-3.5 h-3.5" />
              Apoio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passos">
            <PassosRotaTab estacaoId={estacao.id} />
          </TabsContent>

          <TabsContent value="entrada">
            <EntradaTab estacaoId={estacao.id} />
          </TabsContent>
          
          <TabsContent value="semanas">
            <SemanasTab estacaoId={estacao.id} />
          </TabsContent>
          
          <TabsContent value="estrada">
            <EstradaTab estacaoId={estacao.id} />
          </TabsContent>
          
          <TabsContent value="aplicacao">
            <AplicacaoTab estacao={estacao} />
          </TabsContent>
          
          <TabsContent value="encontro">
            <EncontroTab estacaoId={estacao.id} />
          </TabsContent>
        </Tabs>
    </div>
  );
}
