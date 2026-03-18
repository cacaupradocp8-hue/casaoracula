import { useNavigate } from 'react-router-dom';
import { Plus, Users, Map, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardQuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'Nova Sessão', icon: Plus, route: '/casa-das-maquinas/sessoes', accent: 'hsl(var(--primary))' },
    { label: 'Clientes', icon: Users, route: '/casa-das-maquinas/clientes', accent: 'hsl(var(--accent))' },
    { label: 'Oráculo', icon: Sparkles, route: '/casa-das-maquinas/oraculo', accent: 'hsl(var(--gold, var(--primary)))' },
    { label: 'Mapa Simbólico', icon: Map, route: '/casa-das-maquinas/mapa-vivo', accent: 'hsl(var(--secondary-foreground))' },
    { label: 'Ferramentas', icon: FileText, route: '/casa-das-maquinas/ferramentas', accent: 'hsl(var(--primary))' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(a => (
        <Button
          key={a.label}
          variant="outline"
          size="sm"
          onClick={() => navigate(a.route)}
          className="h-8 text-xs border-border/40 text-foreground/70 hover:text-foreground hover:bg-primary/10 gap-1.5"
        >
          <a.icon className="w-3.5 h-3.5" style={{ color: a.accent }} />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
