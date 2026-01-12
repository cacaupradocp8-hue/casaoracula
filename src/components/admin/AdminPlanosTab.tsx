import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Loader2,
  CreditCard,
  Infinity
} from 'lucide-react';

interface PlanLimit {
  id: string;
  portal: string;
  max_clientes: number;
}

export function AdminPlanosTab() {
  const { toast } = useToast();
  const [limits, setLimits] = useState<PlanLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plan_limits')
      .select('*')
      .order('portal');

    if (error) {
      console.error('Erro ao carregar limites:', error);
      toast({ title: 'Erro ao carregar limites', variant: 'destructive' });
    } else {
      setLimits(data || []);
      const values: Record<string, number> = {};
      (data || []).forEach(l => {
        values[l.id] = l.max_clientes;
      });
      setEditValues(values);
    }
    setLoading(false);
  };

  const handleSave = async (limit: PlanLimit) => {
    const newValue = editValues[limit.id];
    if (newValue === limit.max_clientes) return;

    setSaving(limit.id);
    const { error } = await supabase
      .from('plan_limits')
      .update({ max_clientes: newValue })
      .eq('id', limit.id);

    if (error) {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    } else {
      toast({ title: 'Limite atualizado!' });
      fetchLimits();
    }
    setSaving(null);
  };

  const getPortalName = (portal: string) => {
    switch (portal) {
      case 'visitante':
        return 'Visitante';
      case 'pre_iniciada':
        return 'Pré-Iniciada';
      case 'iniciada':
        return 'Iniciada';
      case 'admin':
        return 'Admin';
      default:
        return portal;
    }
  };

  const getPortalBadge = (portal: string) => {
    switch (portal) {
      case 'visitante':
        return <Badge variant="outline">Visitante</Badge>;
      case 'pre_iniciada':
        return <Badge variant="secondary">Pré-Iniciada</Badge>;
      case 'iniciada':
        return <Badge className="bg-gold text-black">Iniciada</Badge>;
      case 'admin':
        return <Badge className="bg-purple-600">Admin</Badge>;
      default:
        return <Badge variant="outline">{portal}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Planos & Limites de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> Use <code>-1</code> para indicar "ilimitado".
              Visitantes normalmente não podem criar clientes (limite 0).
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portal</TableHead>
                <TableHead>Máximo de Clientes</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {limits.map((limit) => (
                <TableRow key={limit.id}>
                  <TableCell>
                    {getPortalBadge(limit.portal)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <Input
                        type="number"
                        value={editValues[limit.id] ?? limit.max_clientes}
                        onChange={(e) => setEditValues({
                          ...editValues,
                          [limit.id]: parseInt(e.target.value) || 0
                        })}
                        className="w-24"
                      />
                      {(editValues[limit.id] ?? limit.max_clientes) === -1 && (
                        <Infinity className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(limit)}
                      disabled={saving === limit.id || editValues[limit.id] === limit.max_clientes}
                    >
                      {saving === limit.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
