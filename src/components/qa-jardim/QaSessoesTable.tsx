import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Props {
  sessoes: any[];
  onSelect?: (sessao: any) => void;
}

function truncate(text: string | null, max = 50) {
  if (!text) return '—';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function QaSessoesTable({ sessoes, onSelect }: Props) {
  if (!sessoes.length) return (
    <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma sessão encontrada</CardContent></Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Sessões ({sessoes.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>client_user_id</TableHead>
              <TableHead>therapist_user_id</TableHead>
              <TableHead>status</TableHead>
              <TableHead>session_date</TableHead>
              <TableHead>summary (trunc.)</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>jardim_ref</TableHead>
              <TableHead>created_at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessoes.map(s => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => onSelect?.(s)}>
                <TableCell className="font-mono text-xs">{s.id.slice(0, 8)}</TableCell>
                <TableCell className="font-mono text-xs">{s.client_user_id?.slice(0, 8)}</TableCell>
                <TableCell className="font-mono text-xs">{s.therapist_user_id?.slice(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{s.status}</Badge>
                </TableCell>
                <TableCell className="text-xs">
                  {s.session_date ? format(new Date(s.session_date), 'dd/MM/yy HH:mm') : '—'}
                </TableCell>
                <TableCell className="text-xs max-w-[150px] truncate">{truncate(s.summary_internal)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {s.shared_with_client ? (
                      <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700">Comp→C</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">Interna</Badge>
                    )}
                    {s.jardim_ref_id && (
                      <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-700">Ref Jardim</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{s.jardim_ref_id?.slice(0, 8) || '—'}</TableCell>
                <TableCell className="text-xs">{format(new Date(s.created_at), 'dd/MM/yy HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
