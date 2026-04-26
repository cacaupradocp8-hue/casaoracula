import { Button } from '@/components/ui/button';
import { ArrowLeft, Library } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { AdminCursosTab } from '@/components/admin/AdminCursosTab';
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
        <SectionHeader
          title="Acervo & Obras"
          subtitle="Biblioteca de livros e áudios do Clube"
          icon={<Library className="w-5 h-5" />}
        />
      </div>
      <AdminCursosTab />
    </div>
  );
}