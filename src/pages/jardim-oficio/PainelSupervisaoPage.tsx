import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Eye,
  Home,
  ChevronRight,
  Loader2,
  CheckCircle2,
  CalendarDays,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SupervisaoRegistro {
  id: string;
  reflexao_profissional: string;
  tensao_etica: string | null;
  aprendizado_tecnico: string | null;
  pergunta_supervisao: string | null;
  status_supervisao: string;
  created_at: string;
  user_id: string;
  cliente_id: string | null;
}

export default function PainelSupervisaoPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [registros, setRegistros] = useState<SupervisaoRegistro[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.portal === 'admin';

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch sent records - admin sees all, others see only their own sent
    const query = supabase
      .from('jardim_do_oficio')
      .select('*')
      .in('status_supervisao', ['enviado', 'discutido'])
      .order('created_at', { ascending: false });

    const { data } = await query;
    if (data) {
      setRegistros(data as unknown as SupervisaoRegistro[]);

      // Load profile names for the user_ids
      const userIds = [...new Set(data.map((r: any) => r.user_id))];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, nome')
          .in('id', userIds);
        if (profilesData) {
          const map: Record<string, string> = {};
          profilesData.forEach((p: any) => { map[p.id] = p.nome || 'Sem nome'; });
          setProfiles(map);
        }
      }
    }
    setLoading(false);
  };

  const markAsDiscutido = async (id: string) => {
    const { error } = await supabase
      .from('jardim_do_oficio')
      .update({ status_supervisao: 'discutido' } as any)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    } else {
      setRegistros((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status_supervisao: 'discutido' } : r))
      );
      toast({ title: 'Marcado como discutido ✓' });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  const enviados = registros.filter((r) => r.status_supervisao === 'enviado');
  const discutidos = registros.filter((r) => r.status_supervisao === 'discutido');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/casa-das-maquinas" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa das Máquinas
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Painel de Supervisão</span>
        </nav>

        <SectionHeader
          title="Painel de Supervisão"
          subtitle="Reflexões enviadas para supervisão"
          icon={<Eye className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Pendentes */}
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold" />
          Pendentes ({enviados.length})
        </h2>

        {enviados.length === 0 ? (
          <Card className="mb-8">
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma reflexão pendente de supervisão.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mb-8">
            {enviados.map((r) => (
              <Card key={r.id} className="border-gold/20">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {profiles[r.user_id] || 'Terapeuta'}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {format(new Date(r.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => markAsDiscutido(r.id)}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Marcar discutido
                      </Button>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed mb-3">{r.reflexao_profissional}</p>

                  {r.pergunta_supervisao && (
                    <div className="bg-gold/5 border border-gold/20 rounded-md p-3 text-sm">
                      <span className="font-medium text-gold text-xs">Pergunta para supervisão:</span>
                      <p className="mt-1">{r.pergunta_supervisao}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                    {r.tensao_etica && (
                      <div className="bg-secondary/50 rounded-md p-2">
                        <span className="font-medium text-muted-foreground">Tensão ética:</span>
                        <p className="mt-0.5">{r.tensao_etica}</p>
                      </div>
                    )}
                    {r.aprendizado_tecnico && (
                      <div className="bg-secondary/50 rounded-md p-2">
                        <span className="font-medium text-muted-foreground">Aprendizado:</span>
                        <p className="mt-0.5">{r.aprendizado_tecnico}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Discutidos */}
        {discutidos.length > 0 && (
          <>
            <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              Discutidos ({discutidos.length})
            </h2>
            <div className="space-y-3">
              {discutidos.map((r) => (
                <Card key={r.id} className="opacity-70">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {profiles[r.user_id] || 'Terapeuta'}
                        <span>•</span>
                        {format(new Date(r.created_at), "dd/MM/yyyy")}
                      </div>
                      <Badge variant="outline">Discutido</Badge>
                    </div>
                    <p className="text-sm line-clamp-2">{r.reflexao_profissional}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
