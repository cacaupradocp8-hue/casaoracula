import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Route, Calendar, Layers, Users, Loader2 } from 'lucide-react';
import { EstradaTab } from '@/components/admin/central-jornadas/EstradaTab';
import { SemanasTab } from '@/components/admin/central-jornadas/SemanasTab';
import { AplicacaoTab } from '@/components/admin/central-jornadas/AplicacaoTab';
import { EncontroTab } from '@/components/admin/central-jornadas/EncontroTab';

export default function AdminCentralEstacao() {
  const { estacaoId } = useParams<{ estacaoId: string }>();
  const [activeTab, setActiveTab] = useState('estrada');

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
      <AppLayout>
        <div className="flex justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!estacao) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Estação não encontrada.</p>
          <Link to="/admin/clube-livro/central">
            <Button variant="outline" className="mt-4">Voltar</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro/central">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="estrada" className="gap-1.5 text-xs">
              <Route className="w-3.5 h-3.5" />
              Estrada
            </TabsTrigger>
            <TabsTrigger value="semanas" className="gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Semanas
            </TabsTrigger>
            <TabsTrigger value="aplicacao" className="gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              Laboratório
            </TabsTrigger>
            <TabsTrigger value="encontro" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              Encontro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estrada">
            <EstradaTab estacaoId={estacao.id} />
          </TabsContent>
          <TabsContent value="semanas">
            <SemanasTab estacaoId={estacao.id} />
          </TabsContent>
          <TabsContent value="aplicacao">
            <AplicacaoTab estacao={estacao} />
          </TabsContent>
          <TabsContent value="encontro">
            <EncontroTab estacaoId={estacao.id} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
