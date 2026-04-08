import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, DoorOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PortasManager } from '@/components/admin/clube-livro/PortasManager';

export default function AdminClubePortais() {
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);

  const { data: ciclos } = useQuery({
    queryKey: ['admin-clube-ciclos-select'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo, autor_livro')
        .order('ordem');
      return data || [];
    },
  });

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
            title="Portais & Travessias"
            subtitle="Portais vinculados a ciclos e jornadas"
            icon={<DoorOpen className="w-5 h-5" />}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Filtrar por Ciclo</Label>
            <Select value={selectedCiclo || ''} onValueChange={v => setSelectedCiclo(v || null)}>
              <SelectTrigger className="w-full sm:w-80">
                <SelectValue placeholder="Selecione um ciclo..." />
              </SelectTrigger>
              <SelectContent>
                {ciclos?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.titulo} {c.autor_livro ? `— ${c.autor_livro}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
