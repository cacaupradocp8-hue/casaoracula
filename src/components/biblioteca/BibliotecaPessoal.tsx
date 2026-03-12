import { motion } from 'framer-motion';
import { Library, Search, Calendar, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMinhaBiblioteca, FiltroPeriodo } from '@/hooks/useMinhaBiblioteca';
import { BibliotecaTabs, BibliotecaTimeline } from '@/components/biblioteca-pessoal';

const PERIOD_OPTIONS: { value: FiltroPeriodo; label: string }[] = [
  { value: 'todos', label: 'Todo o período' },
  { value: 'semana', label: 'Última semana' },
  { value: 'mes', label: 'Último mês' },
  { value: '3meses', label: 'Últimos 3 meses' },
];

export default function BibliotecaPessoal() {
  const { registros, contagem, isLoading, filters, setTipo, setPeriodo, setBusca } = useMinhaBiblioteca();
  const isFiltered = filters.tipo !== 'todos' || filters.periodo !== 'todos' || filters.busca.trim() !== '';

  return (
    <div className="space-y-6">
      <BibliotecaTabs value={filters.tipo} onChange={setTipo} contagem={contagem} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar..." value={filters.busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
        </div>
        <Select value={filters.periodo} onValueChange={(v) => setPeriodo(v as FiltroPeriodo)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      <BibliotecaTimeline registros={registros} isLoading={isLoading} isFiltered={isFiltered} />

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-full px-4 py-2">
          <Lock className="w-3 h-3" />
          <span>Tudo aqui é 100% privado. Nenhum admin vê seus registros.</span>
        </div>
      </div>
    </div>
  );
}
