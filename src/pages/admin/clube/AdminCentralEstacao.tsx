import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Route, Calendar, Layers, Users, Loader2, Sparkles, Layout } from 'lucide-react';
import { EstradaTab } from '@/components/admin/central-jornadas/EstradaTab';
import { SemanasTab } from '@/components/admin/central-jornadas/SemanasTab';
import { EntradaTab } from '@/components/admin/central-jornadas/EntradaTab';
import { AplicacaoTab } from '@/components/admin/central-jornadas/AplicacaoTab';
import { EncontroTab } from '@/components/admin/central-jornadas/EncontroTab';

export default function AdminCentralEstacao() {
  const { estacaoId: paramId } = useParams<{ estacaoId: string }>();
  const activeAdminTab = (window as any).Admin_ActiveTab || '';
  const estacaoId = paramId || (activeAdminTab.startsWith('central-estacao-') ? activeAdminTab.replace('central-estacao-', '') : null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'entrada';

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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => (window as any).Admin_SetActiveTab?.('clube-jornadas')}>
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
          <TabsList className="grid w-full grid-cols-5 mb-6 bg-muted/30 p-1 border border-primary/5 h-auto">
            <TabsTrigger type="button" value="entrada" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Sparkles className="w-3.5 h-3.5" />
              1. Entrada
            </TabsTrigger>
            <TabsTrigger type="button" value="semanas" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Calendar className="w-3.5 h-3.5" />
              2. Imersão
            </TabsTrigger>
            <TabsTrigger type="button" value="estrada" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Route className="w-3.5 h-3.5" />
              3. Estrada
            </TabsTrigger>
            <TabsTrigger type="button" value="aplicacao" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Layers className="w-3.5 h-3.5" />
              4. Treino
            </TabsTrigger>
            <TabsTrigger type="button" value="encontro" className="gap-1.5 text-[10px] md:text-xs py-2 data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
              <Users className="w-3.5 h-3.5" />
              Apoio
            </TabsTrigger>
          </TabsList>

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
