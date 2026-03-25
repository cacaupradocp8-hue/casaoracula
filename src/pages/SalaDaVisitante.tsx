import { AppLayout } from '@/components/layout/AppLayout';
import { VisitorSalaContent } from '@/components/visitor/VisitorSalaContent';

export default function SalaDaVisitante() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <VisitorSalaContent />
      </div>
    </AppLayout>
  );
}
