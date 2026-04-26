import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, GraduationCap, Info } from 'lucide-react';
import { LabConfigManager } from '@/components/admin/clube-livro/LabConfigManager';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export default function AdminClubeTreinamento() {
  const navigate = useNavigate();
  const [selectedCiclo, setSelectedCiclo] = useState<string | null>(null);

  const { data: ciclos } = useQuery({
    queryKey: ['admin-clube-ciclos-treino'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clube_livro_ciclos')
        .select('id, titulo')
        .order('ordem', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => (window as any).Admin_SetActiveTab?.('clube')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <SectionHeader
            title="Laboratório Clínico"
            subtitle="Configuração de simulações e práticas éticas"
            icon={<GraduationCap className="w-5 h-5" />}
          />
        </div>

        <div className="grid gap-6">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Selecione o Ciclo/Estação</CardTitle>
              <CardDescription>O treinamento é configurado por ciclo de leitura.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedCiclo || ''} onValueChange={setSelectedCiclo}>
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Escolha um ciclo..." />
                </SelectTrigger>
                <SelectContent>
                  {ciclos?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCiclo ? (
            <LabConfigManager cicloId={selectedCiclo} />
          ) : (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Info className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-sm text-muted-foreground max-w-xs">
                  Selecione um ciclo acima para começar a configurar as simulações e orientações clínicas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
