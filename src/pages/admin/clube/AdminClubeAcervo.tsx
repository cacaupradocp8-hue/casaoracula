import { Button } from '@/components/ui/button';
import { ArrowLeft, Library } from 'lucide-react';
import { AdminBibliotecaTab } from '@/components/admin/AdminBibliotecaTab';
import { useNavigate } from 'react-router-dom';

export default function AdminClubeAcervo() {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => {
          if ((window as any).Admin_SetActiveTab) {
            (window as any).Admin_SetActiveTab('clube');
          }
          navigate('/admin/clube');
        }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-serif text-foreground">Acervo & Biblioteca</h2>
          <p className="text-sm text-muted-foreground">Gestão de contos, arquétipos, rituais e materiais de apoio</p>
        </div>
      </div>
      <AdminBibliotecaTab />
    </div>
  );
}