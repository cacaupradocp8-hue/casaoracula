import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CicloSelectorFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
}

export function CicloSelectorFilter({ value, onChange, label = 'Filtrar por Ciclo' }: CicloSelectorFilterProps) {
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
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value || ''} onValueChange={v => onChange(v || null)}>
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
  );
}
