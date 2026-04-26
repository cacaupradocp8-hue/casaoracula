import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayCircle, Users, BookMarked, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RotaImersao({ estacaoId }: { estacaoId?: string | null }) {
  const navigate = useNavigate();

  const itens = [
    {
      label: 'Escutas da Semana',
      descricao: 'Áudios e aulas-álbum',
      icon: PlayCircle,
      rota: '/clube/escuta',
    },
    {
      label: 'Encontro ao Vivo',
      descricao: 'Mentorias e aulas coletivas',
      icon: Users,
      rota: '/clube/encontro',
    },
    {
      label: 'Biblioteca 80/20',
      descricao: 'Insumos e materiais',
      icon: BookMarked,
      rota: '/clube/acervo',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium text-center">
        Mergulho Semanal
      </p>

      <div className="space-y-2">
        {itens.map((item) => (
          <Card 
            key={item.label}
            className="border-primary/10 bg-card/20 hover:bg-card/30 transition-all cursor-pointer overflow-hidden group"
            onClick={() => navigate(item.rota)}
          >
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-4 h-4 text-primary/70" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{item.label}</h4>
                  <p className="text-[10px] text-muted-foreground/50">{item.descricao}</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
