import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Stethoscope, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RotaAplicacao() {
  const navigate = useNavigate();

  const acoes = [
    {
      label: 'Aplicar em mim',
      descricao: 'Reflexão pessoal no seu Jardim',
      icon: Heart,
      rota: '/jardim-da-psique',
    },
    {
      label: 'Aplicar em sessão',
      descricao: 'Levar para a prática clínica',
      icon: Stethoscope,
      rota: '/casa-das-maquinas',
    },
    {
      label: 'Aplicar em grupo',
      descricao: 'Usar no Laboratório 80/20',
      icon: Users,
      rota: '/clube/laboratorio-8020',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium text-center">
        Leve isso para a prática
      </p>

      <div className="grid grid-cols-1 gap-2.5">
        {acoes.map((acao) => (
          <Button
            key={acao.rota}
            variant="outline"
            className="h-auto py-3.5 px-4 justify-start gap-3 border-border/15 bg-card/20 hover:bg-card/40 hover:border-primary/20 transition-all"
            onClick={() => navigate(acao.rota)}
          >
            <acao.icon className="w-4 h-4 text-primary/70 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{acao.label}</p>
              <p className="text-[10px] text-muted-foreground/60">{acao.descricao}</p>
            </div>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
