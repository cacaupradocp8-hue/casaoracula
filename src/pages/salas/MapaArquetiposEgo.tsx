import { ContentPageLayout } from '@/components/shared/ContentPageLayout';
import { MapaEgoFeminino } from '@/components/mapa-ego';
import { EthicalNotice } from '@/components/shared/EthicalNotice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function MapaArquetiposEgo() {
  const navigate = useNavigate();

  const handleComplete = () => {
    toast.success('Travessia concluída');
  };

  return (
    <ContentPageLayout
      title="Mapa do Ego Feminino"
      subtitle="Travessia pelas cinco camadas do seu ser"
      onBack={() => navigate('/ferramentas')}
      backLabel="Voltar para Ferramentas"
    >
      <EthicalNotice toolName="Mapa do Ego" className="mb-6" />
      
      <MapaEgoFeminino onComplete={handleComplete} />
    </ContentPageLayout>
  );
}
