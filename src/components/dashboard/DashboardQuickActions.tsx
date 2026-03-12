import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Flower2, Play } from "lucide-react";

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

const actions = [
  { icon: Sparkles, label: "Tirar carta", path: "/oraculos" },
  { icon: Moon, label: "Registrar sonho", path: "/jardim-da-psique" },
  { icon: Flower2, label: "Abrir Jardim da Psique", path: "/jardim-da-psique" },
  { icon: Play, label: "Iniciar sessão", path: "/casa-das-maquinas/sessoes" },
];

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div {...anim(0.45)} className="mb-8">
      <h2 className="font-display text-base font-semibold text-foreground mb-3">
        Acessos Rápidos
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Button
              key={a.label}
              variant="outline"
              className="h-auto py-4 flex-col gap-2 border-primary/10 hover:border-primary/25 hover:bg-primary/5 text-foreground/80 hover:text-foreground transition-all"
              onClick={() => navigate(a.path)}
            >
              <Icon className="w-5 h-5 text-primary" />
              <span className="text-xs font-medium">{a.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}
