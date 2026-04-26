import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, DoorOpen } from 'lucide-react';
import { CicloSelectorFilter, PortasManager } from '@/components/admin/clube-livro';

export default function AdminClubePortais() {
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);

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
            title="Portais & Travessias"
            subtitle="Portais vinculados a ciclos e jornadas"
            icon={<DoorOpen className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-4">
          <CicloSelectorFilter value={selectedCiclo} onChange={setSelectedCiclo} />

          {selectedCiclo ? (
            <PortasManager cicloId={selectedCiclo} />
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <DoorOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
              Selecione um ciclo para gerenciar os portais.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
