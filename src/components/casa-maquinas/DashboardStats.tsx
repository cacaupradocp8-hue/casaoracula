import { Users, Calendar, Sparkles, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: string;
}

function StatCard({ icon: Icon, label, value, accent = 'hsl(var(--cm-gold-soft))' }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border/30 bg-card/70 backdrop-blur-sm cm-card">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}22` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{value}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        </div>
      </div>
    </div>
  );
}

interface DashboardStatsProps {
  clientes: number;
  sessoesMes: number;
  gestosAtivos: number;
  alertas: number;
}

export function DashboardStats({ clientes, sessoesMes, gestosAtivos, alertas }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={Users} label="Clientes ativos" value={clientes} />
      <StatCard icon={Calendar} label="Sessões este mês" value={sessoesMes} />
      <StatCard icon={Sparkles} label="Gestos ativos" value={gestosAtivos} accent="hsl(var(--cm-green))" />
      <StatCard icon={AlertTriangle} label="Alertas clínicos" value={alertas} accent="hsl(var(--cm-red))" />
    </div>
  );
}
