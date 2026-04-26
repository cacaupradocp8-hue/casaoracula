import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import AdminGeradorSemanal from '@/components/admin/AdminGeradorSemanal';

export default function AdminClubeGerador() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => (window as any).Admin_SetActiveTab?.('clube')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <SectionHeader
          title="Gerador Semanal"
          subtitle="Gerar conteúdo da semana: podcast, carta, prática"
          icon={<Sparkles className="w-5 h-5" />}
        />
      </div>
      <AdminGeradorSemanal />
    </div>
  );
}