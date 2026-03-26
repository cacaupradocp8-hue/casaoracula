import { useAuth } from '@/contexts/AuthContext';
import MapaVivoCidadelaV2 from '@/components/cidadela/MapaVivoCidadelaV2';

export default function RevelacaoCidadelaPage() {
  const { user } = useAuth();

  return (
    <MapaVivoCidadelaV2
      selfMode
      overrideId={user?.id}
      standalone
    />
  );
}
