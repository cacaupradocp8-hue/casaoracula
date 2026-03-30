import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { QaFilters } from '@/hooks/useQaJardimData';

interface QaFiltersProps {
  filters: QaFilters;
  onChange: (filters: QaFilters) => void;
  therapists: { id: string; nome: string | null; email: string | null }[];
  clients: { id: string; nome: string | null; client_user_id: string | null }[];
  jardins: { id: string }[];
}

export function QaFilters({ filters, onChange, therapists, clients, jardins }: QaFiltersProps) {
  const set = (key: keyof QaFilters, value: any) => onChange({ ...filters, [key]: value || undefined });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-lg border bg-card">
      <div className="space-y-1">
        <Label className="text-xs">Terapeuta</Label>
        <Select value={filters.therapistId || '__all'} onValueChange={v => set('therapistId', v === '__all' ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Todas</SelectItem>
            {therapists.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.nome || t.email || t.id.slice(0,8)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Cliente</Label>
        <Select value={filters.clientId || '__all'} onValueChange={v => set('clientId', v === '__all' ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Todas</SelectItem>
            {clients.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.nome || c.id.slice(0,8)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Jardim</Label>
        <Select value={filters.jardimId || '__all'} onValueChange={v => set('jardimId', v === '__all' ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Todos</SelectItem>
            {jardins.map(j => (
              <SelectItem key={j.id} value={j.id}>{j.id.slice(0,8)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Tipo de entry</Label>
        <Select value={filters.entryType || '__all'} onValueChange={v => set('entryType', v === '__all' ? undefined : v)}>
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">Todos</SelectItem>
            <SelectItem value="anotacao">Anotação</SelectItem>
            <SelectItem value="reflexao">Reflexão</SelectItem>
            <SelectItem value="gesto">Gesto</SelectItem>
            <SelectItem value="simbolo">Símbolo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Data início</Label>
        <Input type="date" value={filters.dateFrom || ''} onChange={e => set('dateFrom', e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Data fim</Label>
        <Input type="date" value={filters.dateTo || ''} onChange={e => set('dateTo', e.target.value)} />
      </div>

      <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
        <div className="flex items-center gap-2">
          <Switch checked={!!filters.onlySharedWithTherapist} onCheckedChange={v => set('onlySharedWithTherapist', v)} />
          <Label className="text-xs">Apenas compartilhadas com terapeuta</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={!!filters.onlyVisibleToClient} onCheckedChange={v => set('onlyVisibleToClient', v)} />
          <Label className="text-xs">Apenas visíveis para cliente</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={!!filters.onlySharedWithClient} onCheckedChange={v => set('onlySharedWithClient', v)} />
          <Label className="text-xs">Apenas sessões compartilhadas com cliente</Label>
        </div>
      </div>
    </div>
  );
}
