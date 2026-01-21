import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlasticidadePsiquica() {
  const navigate = useNavigate();

  const { data: ferramenta, isLoading } = useQuery({
    queryKey: ['ferramenta', 'plasticidade-psiquica'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sala_ferramentas')
        .select('*')
        .eq('ferramenta_chave', 'plasticidade-psiquica')
        .single();
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <ContentPageLayout
      title="Mapa de Plasticidade Psíquica"
      subtitle="Acompanhamento da capacidade de transformação e adaptação"
      onBack={() => navigate('/ferramentas')}
      backLabel="Voltar para Ferramentas"
    >
      <EthicalNotice toolName="Plasticidade Psíquica" className="mb-6" />
      
      {ferramenta?.id ? (
        <ModularPageRenderer
          contextType="tool"
          contextId={ferramenta.id}
          fallback={
            <Card className="border-dashed border-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-gold" />
                  Ferramenta em Construção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O Mapa de Plasticidade Psíquica permite acompanhar e visualizar
                  a capacidade de transformação, adaptação e crescimento pessoal.
                </p>
                <p className="text-sm text-muted-foreground">
                  Conteúdo em desenvolvimento. Adicione blocos no painel de administração.
                </p>
              </CardContent>
            </Card>
          }
        />
      ) : (
        <Card className="border-dashed border-gold/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-gold" />
              Mapa de Plasticidade Psíquica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Esta ferramenta ainda não foi configurada no sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </ContentPageLayout>
  );
}
