import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Cog,
  Users,
  Calendar,
  Sparkles,
  Flower2,
  TreePine,
  Home,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export default function CasaDasMaquinas() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clientes: 0, sessoesMes: 0, gestosAtivos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [clientesRes, sessoesRes, gestosRes] = await Promise.all([
      supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('terapeuta_id', user.id),
      supabase.from('sessoes_casa_maquinas').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).gte('data_sessao', firstOfMonth.split('T')[0]),
      supabase.from('gestos_integracao').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status', 'ativo'),
    ]);

    setStats({
      clientes: clientesRes.count ?? 0,
      sessoesMes: sessoesRes.count ?? 0,
      gestosAtivos: gestosRes.count ?? 0,
    });
    setLoading(false);
  };

  const cards = [
    { label: 'Clientes', icon: Users, to: '/minhas-clientes', desc: 'Gerencie suas clientes e acompanhamentos' },
    { label: 'Sala de Sessão', icon: Calendar, to: '/casa-das-maquinas/sessoes', desc: 'Registre sessões simbólicas' },
    { label: 'Gestos de Integração', icon: Sparkles, to: '/casa-das-maquinas/gestos', desc: 'Ações simbólicas de integração' },
    { label: 'Jardim do Ofício', icon: Flower2, to: '/casa-das-maquinas/jardim-oficio', desc: 'Reflexão sobre postura profissional' },
    { label: 'Painel de Supervisão', icon: TreePine, to: '/casa-das-maquinas/supervisao', desc: 'Reflexões para supervisão' },
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Casa das Máquinas</span>
        </nav>

        <SectionHeader
          title="Casa das Máquinas"
          subtitle="Seu espaço administrativo privado de gestão terapêutica"
          icon={<Cog className="w-5 h-5" />}
          className="mb-8"
        />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-gold" />
              <p className="text-2xl font-display font-bold">{stats.clientes}</p>
              <p className="text-xs text-muted-foreground">Clientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-gold" />
              <p className="text-2xl font-display font-bold">{stats.sessoesMes}</p>
              <p className="text-xs text-muted-foreground">Sessões este mês</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-gold" />
              <p className="text-2xl font-display font-bold">{stats.gestosAtivos}</p>
              <p className="text-xs text-muted-foreground">Gestos ativos</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.to} to={card.to}>
              <Card className="hover:shadow-gold transition-all hover:border-gold/30 cursor-pointer h-full">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <card.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{card.label}</h3>
                  <p className="text-sm text-muted-foreground">{card.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
