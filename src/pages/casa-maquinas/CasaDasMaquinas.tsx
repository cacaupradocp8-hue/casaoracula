import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasaMaquinasLayout } from '@/components/casa-maquinas/CasaMaquinasLayout';
import { DashboardStats } from '@/components/casa-maquinas/DashboardStats';
import { DashboardAgenda } from '@/components/casa-maquinas/DashboardAgenda';
import { DashboardClientCard } from '@/components/casa-maquinas/DashboardClientCard';
import { DashboardQuickActions } from '@/components/casa-maquinas/DashboardQuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, Plus, Users, AlertTriangle, Calendar, 
  Sparkles, BookOpen, Map, Armchair, AudioLines, 
  ArrowRight, CheckCircle2, Info
} from 'lucide-react';
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

interface ItemAtecao {
  id: string;
  cliente: string;
  motivo: string;
  tipo: 'atraso' | 'gesto' | 'critico';
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
  const [itensAtecao, setItensAtecao] = useState<ItemAtecao[]>([]);
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
      supabase.from('clientes').select('id, nome, status, updated_at').eq('terapeuta_id', user.id).order('updated_at', { ascending: false }).limit(4),
      supabase.from('co_ai_recommendations').select('id, client_id, motivo, distrito, created_at').order('created_at', { ascending: false }).limit(3),
    ]);

    const recentClients = (recentesRes.data || []) as ClienteRecente[];
    if (recentClients.length > 0) {
      const clientIds = recentClients.map(c => c.id);
      const { data: cityStates } = await supabase
        .from('client_city_state')
        .select('client_id, distrito_ativo, arquetipo_ativo')
        .in('client_id', clientIds);

      if (cityStates) {
        const stateMap = new Map();
        cityStates.forEach(s => stateMap.set(s.client_id, s));
        
        recentClients.forEach(c => {
          const state = stateMap.get(c.id);
          if (state) {
            c.distrito_ativo = state.distrito_ativo || undefined;
          }
        });
      }
    }

    const alertasData = (alertasRes.data || []) as AlertaClinico[];
    
    // Fallback logic for attention items (clients without recent sessions - mock or derived from data)
    // In a real scenario, we'd query for last session date > 15 days
    setItensAtecao([]); 

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
      <CasaMaquinasLayout title="Dashboard Profissional">
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
    <CasaMaquinasLayout 
      title={
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span>Olá, Conducente</span>
          <span className="hidden sm:inline text-muted-foreground/30">|</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
            Painel Profissional Orácula
          </span>
        </div>
      }
      subtitle="Organização ética e simbólica da sua prática"
    >
      {/* 1. Cabeçalho & CTA Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-display font-semibold text-foreground">Visão das Máquinas</h2>
          <p className="text-xs text-muted-foreground">O que precisa do seu olhar hoje?</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            className="flex-1 md:flex-none gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            onClick={() => navigate('/casa-das-maquinas/nova-sessao')}
          >
            <Plus className="w-4 h-4" />
            Nova Sessão
          </Button>
          <Button 
            variant="outline"
            className="flex-1 md:flex-none gap-2 border-primary/20 hover:bg-primary/5"
            onClick={() => navigate('/casa-das-maquinas/clientes')}
          >
            <Users className="w-4 h-4" />
            Ver Clientes
          </Button>
        </div>
      </div>

      {/* 2. Cards de Visão Geral (Stats) */}
      <motion.div {...fadeInUp} transition={{ duration: 0.5 }} className="mt-2">
        <DashboardStats
          clientes={stats.clientes}
          sessoesMes={stats.sessoesMes}
          gestosAtivos={stats.gestosAtivos}
          alertas={stats.alertas}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Coluna Central: Agenda e Clientes (8 colunas) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Próximas Sessões / Agenda de Hoje */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <DashboardAgenda />
          </motion.div>

          {/* Clientes Recentes */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.15 }}>
            <Card className="border-border/30 bg-card/40 backdrop-blur-md overflow-hidden">
              <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/10">
                <CardTitle className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Atendimentos Recentes
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-primary hover:bg-primary/5 h-7"
                  onClick={() => navigate('/casa-das-maquinas/clientes')}
                >
                  Ver todos
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
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
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-sm text-muted-foreground/50">Nenhuma cliente cadastrada ainda</p>
                    <Button variant="outline" size="sm" onClick={() => navigate('/casa-das-maquinas/clientes')}>
                      Cadastrar primeira cliente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Bloco 4: Fechamento de Ciclo (Mock visual) */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="border-gold/20 bg-gold/5 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gold/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Fechamento de Ciclo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-background/50 border border-gold/10 text-center">
                    <p className="text-xl font-bold text-gold">0</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Sessões sem síntese</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-gold/10 text-center">
                    <p className="text-xl font-bold text-gold">{stats.gestosAtivos}</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Gestos pendentes</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50 border border-gold/10 text-center">
                    <p className="text-xl font-bold text-gold">0</p>
                    <p className="text-[10px] uppercase text-muted-foreground">Jornadas sem atualização</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3 italic text-center">
                  Mantenha a higiene clínica atualizando as sínteses após cada encontro.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Coluna Lateral: Alertas e Acesso Rápido (4 colunas) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Bloco 3: Atenção da Semana / Alertas */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
              <CardHeader className="pb-3 border-b border-destructive/10">
                <CardTitle className="text-sm font-medium text-destructive/80 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Atenção da Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                {alertas.length > 0 ? (
                  <div className="space-y-3">
                    {alertas.map(a => (
                      <div key={a.id} className="p-3 rounded-lg bg-background/60 border border-destructive/10 hover:border-destructive/30 transition-all cursor-pointer group">
                        <div className="flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-destructive mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-foreground group-hover:text-destructive transition-colors">{a.motivo}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground uppercase">{a.distrito || 'Clínico'}</span>
                              <span className="text-muted-foreground/30">·</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 opacity-40">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs">Nenhum alerta crítico ativo</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 5. Acesso Rápido */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="border-border/30 bg-card/40 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/80">Recursos do Ofício</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <QuickLink 
                  icon={Users} 
                  label="Clientes" 
                  onClick={() => navigate('/casa-das-maquinas/clientes')} 
                />
                <QuickLink 
                  icon={Calendar} 
                  label="Sessões" 
                  onClick={() => navigate('/casa-das-maquinas/sessoes')} 
                />
                <QuickLink 
                  icon={BookOpen} 
                  label="Biblioteca" 
                  onClick={() => navigate('/casa-das-maquinas/biblioteca')} 
                />
                <QuickLink 
                  icon={Sparkles} 
                  label="Jardim" 
                  onClick={() => navigate('/casa-das-maquinas/jardim-oficio')} 
                />
                <QuickLink 
                  icon={Armchair} 
                  label="Sala Sessão" 
                  onClick={() => navigate('/casa-das-maquinas/cabine')} 
                />
                <QuickLink 
                  icon={AudioLines} 
                  label="7 Vozes" 
                  onClick={() => navigate('/casa-das-maquinas/7-vozes')} 
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* District Map Insight (Mini) */}
          <motion.div {...fadeInUp} transition={{ duration: 0.5, delay: 0.25 }}>
             <Card 
               className="border-primary/20 bg-primary/5 cursor-pointer hover:border-primary/40 transition-all"
               onClick={() => navigate('/casa-das-maquinas/painel-clinico')}
             >
               <CardContent className="p-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                     <Map className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-sm font-medium">Mapa da Cidadela</p>
                     <p className="text-[10px] text-muted-foreground">Ver densidade dos distritos</p>
                   </div>
                 </div>
                 <ArrowRight className="w-4 h-4 text-primary/40" />
               </CardContent>
             </Card>
          </motion.div>
        </div>
      </div>
    </CasaMaquinasLayout>
  );
}

function QuickLink({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 rounded-lg border border-border/20 bg-background/40 hover:bg-primary/5 hover:border-primary/30 transition-all gap-2 group"
    >
      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{label}</span>
    </button>
  );
}
