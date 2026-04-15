import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { DashboardStats } from '@/components/casa-maquinas/DashboardStats';
import { DashboardAgenda } from '@/components/casa-maquinas/DashboardAgenda';
import { DashboardClientCard } from '@/components/casa-maquinas/DashboardClientCard';
import { DashboardJornadas } from '@/components/casa-maquinas/DashboardJornadas';
import { DashboardDistrictChart } from '@/components/casa-maquinas/DashboardDistrictChart';
import { DashboardArchetypes } from '@/components/casa-maquinas/DashboardArchetypes';
import { DashboardQuickActions } from '@/components/casa-maquinas/DashboardQuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Users, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClienteRecente {
  id: string;
  nome: string;
  status: string;
  updated_at: string;
  distrito_ativo?: string;
  arquetipo_nome?: string;
}

interface AlertaClinico {
  id: string;
  client_id: string;
  cliente_nome?: string;
  motivo: string;
  distrito: string;
  created_at: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function CasaDasMaquinas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clientes: 0, sessoesMes: 0, gestosAtivos: 0, alertas: 0 });
  const [clientesRecentes, setClientesRecentes] = useState<ClienteRecente[]>([]);
  const [alertas, setAlertas] = useState<AlertaClinico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [clientesRes, sessoesRes, gestosRes, recentesRes, alertasRes] = await Promise.all([
      supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('terapeuta_id', user.id),
      supabase.from('sessoes_casa_maquinas').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).gte('data_sessao', firstOfMonth.split('T')[0]),
      supabase.from('gestos_integracao').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status', 'ativo'),
      supabase.from('clientes').select('id, nome, status, updated_at').eq('terapeuta_id', user.id).order('updated_at', { ascending: false }).limit(6),
      supabase.from('co_ai_recommendations').select('id, client_id, motivo, distrito, created_at').order('created_at', { ascending: false }).limit(5),
    ]);

    // Load city state for recent clients
    const recentClients = (recentesRes.data || []) as ClienteRecente[];
    if (recentClients.length > 0) {
      const clientIds = recentClients.map(c => c.id);
      const { data: cityStates } = await supabase
        .from('client_city_state')
        .select('client_id, distrito_ativo, arquetipo_ativo')
        .in('client_id', clientIds);

      if (cityStates) {
        const stateMap = new Map(cityStates.map(s => [s.client_id, s]));
        recentClients.forEach(c => {
          const state = stateMap.get(c.id);
          if (state) {
            c.distrito_ativo = state.distrito_ativo || undefined;
          }
        });
      }
    }

    const alertasData = (alertasRes.data || []) as AlertaClinico[];

    setStats({
      clientes: clientesRes.count ?? 0,
      sessoesMes: sessoesRes.count ?? 0,
      gestosAtivos: gestosRes.count ?? 0,
      alertas: alertasData.length,
    });

    setClientesRecentes(recentClients);
    setAlertas(alertasData);

    setLoading(false);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  const estadoMap: Record<string, 'crise' | 'travessia' | 'integração'> = {
    ativo: 'travessia',
    pausado: 'crise',
    encerrado: 'integração',
  };

  return (
    <CasaMaquinasLayout title="Painel Clínico Orácula" subtitle="Visão geral do espaço profissional">
      {/* Quick Actions */}
      <motion.div {...fadeInUp} transition={{ duration: 0.5 }}>
        <DashboardQuickActions />
      </motion.div>

      {/* Stats */}
      <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.05 }} className="mt-6">
        <DashboardStats
          clientes={stats.clientes}
          sessoesMes={stats.sessoesMes}
          gestosAtivos={stats.gestosAtivos}
          alertas={stats.alertas}
        />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <DashboardAgenda />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.15 }}>
            <DashboardJornadas />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <DashboardArchetypes />
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clientes recentes */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="border-gold/8 bg-card/40 backdrop-blur-md hover:border-gold/15 transition-all duration-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                   <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                     <Users className="w-4 h-4 text-primary" />
                     Clientes Ativas
                    Clientes Recentes
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-gold hover:text-gold hover:bg-gold/10 gap-1"
                    onClick={() => navigate('/casa-das-maquinas/clientes')}
                  >
                    <Plus className="w-3 h-3" />
                    Novo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {clientesRecentes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientesRecentes.map(c => (
                      <DashboardClientCard
                        key={c.id}
                        nome={c.nome}
                        ultimaSessao={new Date(c.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        distritoAtual={c.distrito_ativo || ''}
                        torrePredominante={c.arquetipo_nome || ''}
                        estado={estadoMap[c.status] || 'travessia'}
                        onOpenCity={() => navigate(`/casa-das-maquinas/clientes/${c.id}`)}
                        onStartSession={() => navigate(`/casa-das-maquinas/cabine?clienteId=${c.id}`)}
                        onViewHistory={() => navigate(`/casa-das-maquinas/clientes/${c.id}`)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground/40 text-center py-8">
                    Nenhuma cliente cadastrada ainda
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Alertas Clínicos */}
          {alertas.length > 0 && (
            <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.15 }}>
              <Card className="border-destructive/15 bg-card/40 backdrop-blur-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    Alertas Clínicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {alertas.map(a => (
                      <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs text-foreground/80 line-clamp-2">{a.motivo}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {a.distrito && `${a.distrito} · `}
                            {new Date(a.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* District Chart */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <DashboardDistrictChart />
          </motion.div>
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}
