import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sun } from 'lucide-react';
import { AdminEstacoesTab } from '@/components/admin/AdminEstacoesTab';

export default function AdminClubeEstacoes() {
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
            title="Estações Oraculares"
            subtitle="Gerenciar temporadas e foco de travessia"
            icon={<Sun className="w-5 h-5" />}
          />
        </div>
        <AdminEstacoesTab />
      </div>
    </AppLayout>
  );
}
