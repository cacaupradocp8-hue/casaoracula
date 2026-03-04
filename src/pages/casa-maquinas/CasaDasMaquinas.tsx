import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { DashboardStats } from '@/components/casa-maquinas/DashboardStats';
import { DashboardAgenda } from '@/components/casa-maquinas/DashboardAgenda';
import { DashboardClientCard } from '@/components/casa-maquinas/DashboardClientCard';
import { DashboardJornadas } from '@/components/casa-maquinas/DashboardJornadas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Users } from 'lucide-react';

const mockClientes = [
  {
    nome: 'Helena M.',
    ultimaSessao: '28 fev 2026',
    distritoAtual: 'Torres',
    torrePredominante: 'Controle',
    estado: 'travessia' as const,
  },
  {
    nome: 'Isabela R.',
    ultimaSessao: '01 mar 2026',
    distritoAtual: 'Labirinto',
    torrePredominante: 'Silêncio',
    estado: 'crise' as const,
  },
  {
    nome: 'Marina S.',
    ultimaSessao: '03 mar 2026',
    distritoAtual: 'Jardim dos Arquétipos',
    torrePredominante: 'Adaptação',
    estado: 'integração' as const,
  },
  {
    nome: 'Camila F.',
    ultimaSessao: '25 fev 2026',
    distritoAtual: 'Casa dos Sonhos',
    torrePredominante: 'Performance',
    estado: 'travessia' as const,
  },
];

export default function CasaDasMaquinas() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <CasaMaquinasLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-[#C9A24A]" />
        </div>
      </CasaMaquinasLayout>
    );
  }

  return (
    <CasaMaquinasLayout title="Dashboard" subtitle="Visão geral do espaço profissional">
      {/* Stats */}
      <DashboardStats
        clientes={stats.clientes || mockClientes.length}
        sessoesMes={stats.sessoesMes || 12}
        gestosAtivos={stats.gestosAtivos || 4}
        alertas={1}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* Left: Agenda + Jornadas */}
        <div className="lg:col-span-1 space-y-4">
          <DashboardAgenda />
          <DashboardJornadas />
        </div>

        {/* Right: Clientes recentes */}
        <div className="lg:col-span-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockClientes.map((c, i) => (
                  <DashboardClientCard
                    key={i}
                    {...c}
                    onOpenCity={() => navigate(`/casa-das-maquinas/clientes/${i + 1}`)}
                    onStartSession={() => navigate('/casa-das-maquinas/sessoes')}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}
