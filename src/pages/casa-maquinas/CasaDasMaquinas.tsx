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
import { Loader2, Plus, Users } from 'lucide-react';

interface ClienteRecente {
  id: string;
  nome: string;
  status: string;
  updated_at: string;
}

export default function CasaDasMaquinas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ clientes: 0, sessoesMes: 0, gestosAtivos: 0, alertas: 0 });
  const [clientesRecentes, setClientesRecentes] = useState<ClienteRecente[]>([]);
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

    const [clientesRes, sessoesRes, gestosRes, recentesRes] = await Promise.all([
      supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('terapeuta_id', user.id),
      supabase.from('sessoes_casa_maquinas').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).gte('data_sessao', firstOfMonth.split('T')[0]),
      supabase.from('gestos_integracao').select('id', { count: 'exact', head: true }).eq('owner_id', user.id).eq('status', 'ativo'),
      supabase.from('clientes').select('id, nome, status, updated_at').eq('terapeuta_id', user.id).order('updated_at', { ascending: false }).limit(4),
    ]);

    setStats({
      clientes: clientesRes.count ?? 0,
      sessoesMes: sessoesRes.count ?? 0,
      gestosAtivos: gestosRes.count ?? 0,
      alertas: 0,
    });

    if (recentesRes.data) {
      setClientesRecentes(recentesRes.data as ClienteRecente[]);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <CasaMaquinasLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
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
    <CasaMaquinasLayout title="Dashboard" subtitle="Visão geral do espaço profissional">
      {/* Quick Actions */}
      <DashboardQuickActions />

      {/* Stats */}
      <div className="mt-4">
        <DashboardStats
          clientes={stats.clientes}
          sessoesMes={stats.sessoesMes}
          gestosAtivos={stats.gestosAtivos}
          alertas={stats.alertas}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-4">
          <DashboardAgenda />
          <DashboardJornadas />
          <DashboardArchetypes />
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Clientes recentes */}
          <Card className="border-[#C9A24A]/10 bg-[#0B1B2B]/60 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#F5F1E8]/80 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C9A24A]" />
                  Clientes Recentes
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-[#C9A24A] hover:text-[#C9A24A] hover:bg-[#C9A24A]/10 gap-1"
                  onClick={() => navigate('/casa-das-maquinas/clientes')}
                >
                  <Plus className="w-3 h-3" />
                  Novo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {clientesRecentes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clientesRecentes.map(c => (
                    <DashboardClientCard
                      key={c.id}
                      nome={c.nome}
                      ultimaSessao={new Date(c.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      distritoAtual=""
                      torrePredominante=""
                      estado={estadoMap[c.status] || 'travessia'}
                      onOpenCity={() => navigate(`/casa-das-maquinas/clientes/${c.id}`)}
                      onStartSession={() => navigate('/casa-das-maquinas/sessoes')}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#F5F1E8]/30 text-center py-6">
                  Nenhuma cliente cadastrada ainda
                </p>
              )}
            </CardContent>
          </Card>

          {/* District Chart */}
          <DashboardDistrictChart />
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}
