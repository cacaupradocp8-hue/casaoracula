import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AdminRotaDosLobosRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona sempre para a lista de estações da Rota dos Lobos,
    // sem depender de estação ativa ou filtros de sistema.
    navigate('/admin/rotas?obra=Mulheres que Correm com os Lobos', { replace: true });
  }, [navigate]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );
}
