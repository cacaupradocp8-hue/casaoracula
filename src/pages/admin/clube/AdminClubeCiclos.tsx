import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { AdminClubeLivroTab } from '@/components/admin/AdminClubeLivroTab';

export default function AdminClubeCiclos() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Ciclos & Fases"
            subtitle="Gerenciar ciclos de leitura, semanas e fases"
            icon={<RefreshCw className="w-5 h-5" />}
          />
        </div>
        <AdminClubeLivroTab />
      </div>
    </AppLayout>
  );
}
