import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AdminGeradorSemanal from '@/components/admin/AdminGeradorSemanal';

export default function AdminClubeGerador() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/admin/clube-livro">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <SectionHeader
            title="Gerador Semanal"
            subtitle="Gerar conteúdo da semana: podcast, carta, prática"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>
        <AdminGeradorSemanal />
      </div>
    </AppLayout>
  );
}
