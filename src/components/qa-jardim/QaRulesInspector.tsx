import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  selectedItem: any | null;
  type: 'entry' | 'sessao' | null;
}

export function QaRulesInspector({ selectedItem, type }: Props) {
  if (!selectedItem || !type) return (
    <Card>
      <CardContent className="py-6 text-center text-muted-foreground text-sm">
        Selecione uma entry ou sessão para inspecionar regras de visibilidade
      </CardContent>
    </Card>
  );

  const isCreatedByClient = selectedItem.created_by === selectedItem.client_user_id;
  const isCreatedByTherapist = selectedItem.created_by === selectedItem.therapist_user_id;

  const rules = type === 'entry' ? [
    {
      label: 'Quem criou',
      value: isCreatedByClient ? 'Cliente' : isCreatedByTherapist ? 'Terapeuta' : 'Desconhecido',
      variant: isCreatedByClient ? 'secondary' : 'default',
    },
    {
      label: 'Visível para cliente?',
      value: isCreatedByClient ? 'Sim (própria)' : selectedItem.visibility_to_client ? 'Sim (flag)' : 'Não',
      variant: (isCreatedByClient || selectedItem.visibility_to_client) ? 'default' : 'secondary',
    },
    {
      label: 'Compartilhada com terapeuta?',
      value: isCreatedByTherapist ? 'Sim (própria)' : selectedItem.shared_with_therapist ? 'Sim (flag)' : 'Não',
      variant: (isCreatedByTherapist || selectedItem.shared_with_therapist) ? 'default' : 'secondary',
    },
    {
      label: 'Deveria aparecer para cliente',
      value: isCreatedByClient || selectedItem.visibility_to_client ? 'SIM' : 'NÃO',
      variant: (isCreatedByClient || selectedItem.visibility_to_client) ? 'default' : 'destructive',
    },
    {
      label: 'Deveria aparecer para terapeuta',
      value: isCreatedByTherapist || selectedItem.shared_with_therapist ? 'SIM' : 'NÃO',
      variant: (isCreatedByTherapist || selectedItem.shared_with_therapist) ? 'default' : 'destructive',
    },
  ] : [
    {
      label: 'Quem criou',
      value: isCreatedByTherapist ? 'Terapeuta' : 'Desconhecido',
      variant: 'default' as const,
    },
    {
      label: 'Compartilhada com cliente?',
      value: selectedItem.shared_with_client ? 'Sim' : 'Não',
      variant: selectedItem.shared_with_client ? 'default' : 'secondary',
    },
    {
      label: 'Referência ao jardim?',
      value: selectedItem.jardim_ref_id ? `Sim (${selectedItem.jardim_ref_id.slice(0, 8)})` : 'Não',
      variant: selectedItem.jardim_ref_id ? 'default' : 'secondary',
    },
    {
      label: 'Deveria aparecer para cliente',
      value: selectedItem.shared_with_client ? 'SIM' : 'NÃO',
      variant: selectedItem.shared_with_client ? 'default' : 'destructive',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Teste de Regras — {type === 'entry' ? 'Entry' : 'Sessão'} {selectedItem.id.slice(0, 8)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/20">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <Badge variant={r.variant as any} className="text-xs">{r.value}</Badge>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          ⚠️ Esta inspeção é calculada no frontend para visualização. A segurança real é garantida pela RLS do banco.
        </p>
      </CardContent>
    </Card>
  );
}
