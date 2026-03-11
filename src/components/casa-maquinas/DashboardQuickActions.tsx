import { useNavigate } from 'react-router-dom';
import { Plus, Users, Map, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Nova Sessão', icon: Plus, route: '/casa-das-maquinas/sessoes', accent: '#C9A24A' },
    { label: 'Clientes', icon: Users, route: '/casa-das-maquinas/clientes', accent: '#556B57' },
    { label: 'Mapa Simbólico', icon: Map, route: '/casa-das-maquinas/mapa-vivo', accent: '#8B5CF6' },
    { label: 'Ferramentas', icon: FileText, route: '/casa-das-maquinas/ferramentas', accent: '#3B82F6' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(a => (
        <Button
          key={a.label}
          variant="outline"
          size="sm"
          onClick={() => navigate(a.route)}
          className="h-8 text-xs border-[#C9A24A]/15 text-[#F5F1E8]/70 hover:text-[#F5F1E8] hover:bg-[#C9A24A]/10 gap-1.5"
        >
          <a.icon className="w-3.5 h-3.5" style={{ color: a.accent }} />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
