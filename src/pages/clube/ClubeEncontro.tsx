import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

const ROTEIRO_FIELDS = [
  { key: 'roteiro_abertura', label: 'Abertura' },
  { key: 'roteiro_compartilhamento', label: 'Compartilhamento' },
  { key: 'roteiro_dialogo', label: 'Diálogo' },
  { key: 'roteiro_integracao', label: 'Integração' },
  { key: 'roteiro_fechamento', label: 'Fechamento' },
] as const;

export default function ClubeEncontro() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: meeting } = useQuery({
    queryKey: ['club-next-meeting'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_meetings')
        .select('*, club_cycles(*, club_books(*))')
        .eq('realizado', false)
        .order('data', { ascending: true })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const [roteiro, setRoteiro] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meeting) {
      const r: Record<string, string> = {};
      ROTEIRO_FIELDS.forEach(f => { r[f.key] = (meeting as any)[f.key] || ''; });
      setRoteiro(r);
    }
  }, [meeting]);

  const saveMeeting = useMutation({
    mutationFn: async () => {
      if (!meeting) return;
      await supabase.from('club_meetings').update(roteiro).eq('id', meeting.id);
    },
    onSuccess: () => { toast.success('Encontro salvo'); qc.invalidateQueries({ queryKey: ['club-next-meeting'] }); },
  });

  const markDone = useMutation({
    mutationFn: async () => {
      if (!meeting) return;
      await supabase.from('club_meetings').update({ ...roteiro, realizado: true }).eq('id', meeting.id);
    },
    onSuccess: () => { toast.success('Encontro marcado como realizado'); qc.invalidateQueries({ queryKey: ['club-next-meeting'] }); },
  });

  const cycle = meeting?.club_cycles as any;
  const book = cycle?.club_books as any;

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl text-primary">Encontro</h1>
          </div>
        </div>

        {!meeting ? (
          <Card className="border-border/50 bg-card/60">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum encontro agendado.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Meta */}
            <div className="grid grid-cols-3 gap-3">
              <MetaCard label="Data" value={meeting.data ? new Date(meeting.data).toLocaleDateString('pt-BR') : '—'} />
              <MetaCard label="Portal" value={meeting.portal || cycle?.portal || '—'} />
              <MetaCard label="Livro" value={meeting.livro || book?.titulo || '—'} />
            </div>

            {/* Roteiro */}
            <Card className="border-border/50 bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg text-primary">Roteiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ROTEIRO_FIELDS.map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</Label>
                    <Textarea
                      value={roteiro[f.key] || ''}
                      onChange={e => setRoteiro(prev => ({ ...prev, [f.key]: e.target.value }))}
                      rows={3}
                      className="bg-input/50"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={() => saveMeeting.mutate()}
                disabled={saveMeeting.isPending}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Salvar
              </Button>
              <Button
                onClick={() => markDone.mutate()}
                disabled={markDone.isPending}
                variant="outline"
                className="flex-1 border-primary/30 text-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar como realizado
              </Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-border/50 bg-card/60">
      <CardContent className="p-3 text-center space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">{value}</p>
      </CardContent>
    </Card>
  );
}
