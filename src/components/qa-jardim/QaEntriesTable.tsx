import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  entries: any[];
  onSelect?: (entry: any) => void;
}

function truncate(text: string | null, max = 60) {
  if (!text) return '—';
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function QaEntriesTable({ entries, onSelect }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (!entries.length) return (
    <Card><CardContent className="py-8 text-center text-muted-foreground">Nenhuma entry encontrada</CardContent></Card>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Entries do Jardim ({entries.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>jardim_id</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>entry_type</TableHead>
              <TableHead>content</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>created_at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(e => {
              const isClient = e.created_by === e.client_user_id;
              const isExpanded = expanded.has(e.id);
              return (
                <>
                  <TableRow key={e.id} className="cursor-pointer" onClick={() => onSelect?.(e)}>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(ev) => { ev.stopPropagation(); toggle(e.id); }}>
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </Button>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-mono text-xs">{e.jardim_id?.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant={isClient ? 'secondary' : 'default'} className="text-xs">
                        {isClient ? 'Cliente' : 'Terapeuta'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{e.entry_type}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{truncate(e.content)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {e.visibility_to_client && <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700">Visível→C</Badge>}
                        {e.shared_with_therapist && <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700">Comp→T</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{format(new Date(e.created_at), 'dd/MM/yy HH:mm')}</TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow key={`${e.id}-exp`}>
                      <TableCell colSpan={8} className="bg-muted/30 p-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-muted-foreground">client_user_id</p>
                            <p className="font-mono">{e.client_user_id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">therapist_user_id</p>
                            <p className="font-mono">{e.therapist_user_id}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">created_by</p>
                            <p className="font-mono">{e.created_by}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">content (truncado 200 chars)</p>
                            <p className="whitespace-pre-wrap">{truncate(e.content, 200)}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
