import { Users, Calendar, Sparkles, AlertTriangle } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  accent?: string;
}

function StatCard({ icon: Icon, label, value, accent = '#C9A24A' }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl border border-[#C9A24A]/10 bg-[#0B1B2B]/60">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div>
          <p className="text-xl font-bold text-[#F5F1E8]">{value}</p>
          <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-wider">{label}</p>
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
      <StatCard icon={Sparkles} label="Gestos ativos" value={gestosAtivos} accent="#556B57" />
      <StatCard icon={AlertTriangle} label="Alertas clínicos" value={alertas} accent="#E8915A" />
    </div>
  );
}
