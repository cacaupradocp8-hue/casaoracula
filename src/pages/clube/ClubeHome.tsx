import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ClubeHome() {
  const navigate = useNavigate();

  const { data: activeCycle } = useQuery({
    queryKey: ['club-active-cycle'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_cycles')
        .select('*, club_books(*)')
        .eq('ativo', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const { data: nextMeeting } = useQuery({
    queryKey: ['club-next-meeting'],
    queryFn: async () => {
      const { data } = await supabase
        .from('club_meetings')
        .select('*')
        .eq('realizado', false)
        .order('data', { ascending: true })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  return (
    <AppLayout>
      <div className="min-h-screen px-4 py-10 md:py-16 max-w-2xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-3xl md:text-4xl text-primary tracking-wide">
            CLUBE DO LIVRO ORACULAR
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Laboratório de prática simbólica
          </p>
        </div>

        {/* Card principal */}
        <Card className="border-primary/20 bg-card/80 backdrop-blur">
          <CardContent className="p-8 text-center space-y-6">
            <Sparkles className="w-8 h-8 text-primary mx-auto opacity-60" />
            <div className="space-y-2">
              <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed">
                "Você não está lendo um livro.
              </p>
              <p className="font-display text-xl md:text-2xl text-foreground italic leading-relaxed">
                Está treinando sua leitura de campo."
              </p>
            </div>
            <Button 
              onClick={() => navigate('/clube/ciclo')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Continuar ciclo
            </Button>
          </CardContent>
        </Card>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <StatusCard
            icon={<Compass className="w-4 h-4 text-primary" />}
            label="Ciclo atual"
            value={activeCycle?.nome || '—'}
          />
          <StatusCard
            icon={<BookOpen className="w-4 h-4 text-primary" />}
            label="Livro do mês"
            value={(activeCycle?.club_books as any)?.titulo || '—'}
          />
          <StatusCard
            icon={<Sparkles className="w-4 h-4 text-primary" />}
            label="Portal ativo"
            value={activeCycle?.portal || '—'}
          />
          <StatusCard
            icon={<Calendar className="w-4 h-4 text-primary" />}
            label="Próximo encontro"
            value={nextMeeting?.data ? new Date(nextMeeting.data).toLocaleDateString('pt-BR') : '—'}
          />
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate('/clube/ciclo')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-10"
          >
            Entrar no ciclo
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

function StatusCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-border/50 bg-card/60">
      <CardContent className="p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </CardContent>
    </Card>
  );
}
