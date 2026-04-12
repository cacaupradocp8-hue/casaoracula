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

const ROTEIRO_KEYS = ['abertura', 'compartilhamento', 'dialogo', 'integracao', 'fechamento'];
const ROTEIRO_LABELS: Record<string, string> = {
  abertura: 'Abertura',
  compartilhamento: 'Compartilhamento',
  dialogo: 'Diálogo',
  integracao: 'Integração',
  fechamento: 'Fechamento',
};

export default function ClubeEncontro() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: cycle } = useQuery({
    queryKey: ['club-active-cycle'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cycles' as any)
        .select('*, club_books(*)')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  const { data: meeting } = useQuery({
    queryKey: ['club-next-meeting'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_meetings' as any)
        .select('*')
        .eq('completed', false)
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle();
      return data as any;
    },
  });

  const [roteiro, setRoteiro] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meeting?.roteiro && typeof meeting.roteiro === 'object') {
      setRoteiro(meeting.roteiro as Record<string, string>);
    }
  }, [meeting]);

  const saveMeeting = useMutation({
    mutationFn: async () => {
      if (!meeting) return;
      await supabase.from('club_meetings' as any).update({ roteiro }).eq('id', meeting.id);
    },
    onSuccess: () => { toast.success('Roteiro salvo'); qc.invalidateQueries({ queryKey: ['club-next-meeting'] }); },
  });

  const markDone = useMutation({
    mutationFn: async () => {
      if (!meeting) return;
      await supabase.from('club_meetings' as any).update({ roteiro, completed: true }).eq('id', meeting.id);
    },
    onSuccess: () => { toast.success('Encontro marcado como realizado'); qc.invalidateQueries({ queryKey: ['club-next-meeting'] }); },
  });

  const bookArr = cycle?.club_books;
  const book = Array.isArray(bookArr) ? bookArr[0] : bookArr;

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/clube')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl text-primary">Encontro</h1>
        </div>

        {!meeting ? (
          <Card className="border-border/50 bg-card/60">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhum encontro agendado.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <MetaCard label="Data" value={meeting.date ? new Date(meeting.date).toLocaleDateString('pt-BR') : '—'} />
              <MetaCard label="Portal" value={cycle?.portal || '—'} />
              <MetaCard label="Livro" value={book?.title || '—'} />
            </div>

            <Card className="border-border/50 bg-card/60">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg text-primary">Roteiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ROTEIRO_KEYS.map(k => (
                  <div key={k} className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">{ROTEIRO_LABELS[k]}</Label>
                    <Textarea
                      value={roteiro[k] || ''}
                      onChange={e => setRoteiro(prev => ({ ...prev, [k]: e.target.value }))}
                      rows={3}
                      className="bg-input/50"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button onClick={() => saveMeeting.mutate()} disabled={saveMeeting.isPending} className="flex-1 bg-primary text-primary-foreground">
                Salvar
              </Button>
              <Button onClick={() => markDone.mutate()} disabled={markDone.isPending} variant="outline" className="flex-1 border-primary/30 text-primary">
                <Check className="w-4 h-4 mr-2" /> Realizado
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
