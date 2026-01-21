import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EspelhoConsciencia() {
  const navigate = useNavigate();

  const { data: ferramenta, isLoading } = useQuery({
    queryKey: ['ferramenta', 'espelho-consciencia'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sala_ferramentas')
        .select('*')
        .eq('ferramenta_chave', 'espelho-consciencia')
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
      title="Espelho de Consciência"
      subtitle="Ferramenta de auto-observação e reflexão simbólica"
      onBack={() => navigate('/ferramentas')}
      backLabel="Voltar para Ferramentas"
    >
      <EthicalNotice toolName="Espelho de Consciência" className="mb-6" />
      
      {ferramenta?.id ? (
        <ModularPageRenderer
          contextType="tool"
          contextId={ferramenta.id}
          fallback={
            <Card className="border-dashed border-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-gold" />
                  Ferramenta em Construção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O Espelho de Consciência é uma ferramenta de auto-observação que permite
                  explorar diferentes facetas da psique através de reflexões guiadas.
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
              <Eye className="w-5 h-5 text-gold" />
              Espelho de Consciência
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
