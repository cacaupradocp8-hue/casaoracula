import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapaArquetiposEgo() {
  const navigate = useNavigate();

  const { data: ferramenta, isLoading } = useQuery({
    queryKey: ['ferramenta', 'mapa_arquetipos_ego'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sala_ferramentas')
        .select('*')
        .eq('ferramenta_chave', 'mapa_arquetipos_ego')
        .maybeSingle();
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
      title="Mapa Arquetípico do Ego Feminino"
      subtitle="Exploração das dinâmicas arquetípicas do ego"
      onBack={() => navigate('/ferramentas')}
      backLabel="Voltar para Ferramentas"
    >
      <EthicalNotice toolName="Mapa Arquetípico" className="mb-6" />
      
      {ferramenta?.id ? (
        <ModularPageRenderer
          contextType="tool"
          contextId={ferramenta.id}
          fallback={
            <Card className="border-dashed border-gold/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gold" />
                  Ferramenta em Construção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  O Mapa Arquetípico do Ego Feminino permite explorar as diferentes
                  facetas e expressões arquetípicas presentes na estrutura egóica.
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
              <Target className="w-5 h-5 text-gold" />
              Mapa Arquetípico do Ego Feminino
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
