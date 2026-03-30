import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface Props {
  jardins: any[];
}

export function QaJardinsTable({ jardins }: Props) {
  if (!jardins.length) return (
    <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhum jardim encontrado</CardContent></Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Jardins ({jardins.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>client_user_id</TableHead>
              <TableHead>therapist_user_id</TableHead>
              <TableHead>visibility_scope</TableHead>
              <TableHead>created_by</TableHead>
              <TableHead>status</TableHead>
              <TableHead>created_at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jardins.map(j => (
              <TableRow key={j.id}>
                <TableCell className="font-mono text-xs">{j.id.slice(0, 8)}</TableCell>
                <TableCell className="font-mono text-xs">{j.client_user_id?.slice(0, 8)}</TableCell>
                <TableCell className="font-mono text-xs">{j.therapist_user_id?.slice(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{j.visibility_scope}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{j.created_by?.slice(0, 8)}</TableCell>
                <TableCell>
                  <Badge variant={j.status === 'active' ? 'default' : 'secondary'}>{j.status}</Badge>
                </TableCell>
                <TableCell className="text-xs">{format(new Date(j.created_at), 'dd/MM/yy HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
