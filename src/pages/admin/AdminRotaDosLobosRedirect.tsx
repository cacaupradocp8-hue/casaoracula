import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AdminRotaDosLobosRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    async function redirectToActiveStation() {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('id')
        .eq('ativa', true)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data?.id) {
        navigate(`/admin/clube/central/${data.id}`, { replace: true });
      } else {
        navigate('/admin/clube/ciclos', { replace: true });
      }
    }

    redirectToActiveStation();
  }, [navigate]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );
}
