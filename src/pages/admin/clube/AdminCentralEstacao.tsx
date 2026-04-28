import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Route, Calendar, Layers, Users, Loader2, Sparkles, Layout, ListOrdered, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PassosRotaTab } from '@/components/admin/central-jornadas/PassosRotaTab';
import { EstradaTab } from '@/components/admin/central-jornadas/EstradaTab';
import { SemanasTab } from '@/components/admin/central-jornadas/SemanasTab';
import { EntradaTab } from '@/components/admin/central-jornadas/EntradaTab';
import { AplicacaoTab } from '@/components/admin/central-jornadas/AplicacaoTab';
import { EncontroTab } from '@/components/admin/central-jornadas/EncontroTab';

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
    livro_titulo: '',
    livro_autor: '',
    livro_capa_url: '',
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
        livro_titulo: estacao.livro_titulo || '',
        livro_autor: estacao.livro_autor || '',
        livro_capa_url: estacao.livro_capa_url || '',
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => {
              (window as any).Admin_SetActiveTab?.('clube-jornadas');
              navigate('/admin/clube/ciclos');
            }}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-display text-foreground truncate">
                {estacao.titulo}
              </h1>
              <Badge variant={estacao.ativa ? 'default' : 'secondary'} className="text-[10px]">
                {estacao.ativa ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {estacao.livro_titulo} {estacao.livro_autor ? `— ${estacao.livro_autor}` : ''}
            </p>
          </div>
        </div>

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
