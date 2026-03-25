import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

export default function CheckoutSucesso() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard with welcome mode after a brief moment
    const timer = setTimeout(() => {
      navigate('/dashboard-membro?boas-vindas=true', { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AppLayout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" />
          <p className="text-muted-foreground text-sm">Preparando sua entrada na Casa...</p>
        </div>
      </div>
    </AppLayout>
  );
}
