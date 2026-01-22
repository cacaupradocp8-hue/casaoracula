import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { PortaFamiliasBlock } from '@/components/modular/blocks/PortaFamiliasBlock';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentBlock } from '@/types/modular';

export default function CartografiaTorre() {
  const navigate = useNavigate();

  const { data: ferramenta, isLoading } = useQuery({
    queryKey: ['ferramenta', 'cartografia-torre'],
    queryFn: async () => {
      const { data } = await supabase
        .from('sala_ferramentas')
        .select('*')
        .eq('ferramenta_chave', 'cartografia-torre')
        .single();
      return data;
    }
  });

  // Create a mock block for the Porta Familias
  const familiasBlock: ContentBlock = {
    id: 'familias-block',
    contextType: 'tool',
    contextId: ferramenta?.id || 'cartografia-torre',
    blockType: 'porta_familias',
    ordem: 1,
    ativo: true,
    portalMinimo: 'visitante',
    content: {
      showRisks: true,
      showIntegration: true,
      compactMode: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <ContentPageLayout
      title="Cartografia da Torre"
      subtitle="Mapeamento das estruturas de defesa e transformação"
      onBack={() => navigate('/ferramentas')}
      backLabel="Voltar para Ferramentas"
    >
      <EthicalNotice toolName="Cartografia da Torre" className="mb-6" />
      
      {/* Famílias Block - always visible */}
      <div className="mb-8">
        <PortaFamiliasBlock block={familiasBlock} />
      </div>
      
      {ferramenta?.id && (
        <ModularPageRenderer
          contextType="tool"
          contextId={ferramenta.id}
          fallback={null}
        />
      )}
    </ContentPageLayout>
  );
}
