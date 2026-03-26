import { useNavigate } from 'react-router-dom';
import { Flower2, Briefcase, Users, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const jardins = [
  {
    key: 'psique',
    icon: Flower2,
    titulo: 'Jardim da Psique',
    descricao: 'Registro pessoal e íntimo da jornada simbólica. Sonhos, reflexões e percepções.',
    rota: '/jardim-da-psique',
    botao: 'Abrir Jardim da Psique',
    accent: 'mystic',
  },
  {
    key: 'oficio',
    icon: Briefcase,
    titulo: 'Jardim do Ofício',
    descricao: 'Registro profissional. Aprendizados clínicos, insights terapêuticos e aplicações.',
    rota: '/casa-das-maquinas/jardim-oficio',
    botao: 'Abrir Jardim do Ofício',
    accent: 'gold',
  },
  {
    key: 'comunidade',
    icon: Users,
    titulo: 'Canteiro da Comunidade',
    descricao: 'Compartilhe aprendizados e troque experiências com outras participantes.',
    rota: '/comunidade',
    botao: 'Compartilhar no Canteiro',
    accent: 'primary',
  },
  {
    key: 'encontro',
    icon: Mic,
    titulo: 'Encontro ao Vivo',
    descricao: 'Use seus registros como base para participação nos encontros do Clube.',
    rota: '#',
    botao: 'Preparar para Encontro',
    accent: 'primary',
    disabled: true,
  },
];

const accentStyles: Record<string, { bg: string; border: string; text: string; btn: string }> = {
  mystic: {
    bg: 'bg-mystic/8',
    border: 'border-mystic/12',
    text: 'text-mystic',
    btn: 'border-mystic/15 hover:bg-mystic/5 hover:border-mystic/25',
  },
  gold: {
    bg: 'bg-gold/8',
    border: 'border-gold/12',
    text: 'text-gold',
    btn: 'border-gold/15 hover:bg-gold/5 hover:border-gold/25',
  },
  primary: {
    bg: 'bg-primary/8',
    border: 'border-primary/12',
    text: 'text-primary',
    btn: 'border-primary/15 hover:bg-primary/5 hover:border-primary/25',
  },
};

export function ClubeJardinsIntegracao() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Section header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-mystic/50 to-gold/30" />
          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground/70 font-medium">
            Seus Jardins de Registro
          </h2>
        </div>
        <p className="text-sm text-muted-foreground/50 leading-relaxed max-w-lg pl-4">
          Suas reflexões podem ser registradas e cultivadas em diferentes espaços da Casa.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jardins.map((jardim, i) => {
          const styles = accentStyles[jardim.accent];
          const Icon = jardim.icon;

          return (
            <motion.div
              key={jardim.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="border-border/10 bg-card/40 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[0_8px_25px_-8px_hsl(var(--foreground)/0.06)] transition-all duration-500 h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-full ${styles.bg} ${styles.border} border flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${styles.text}`} />
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {jardim.titulo}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed flex-1 mb-4">
                    {jardim.descricao}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full ${styles.btn} transition-all duration-300 text-xs`}
                    disabled={jardim.disabled}
                    onClick={() => !jardim.disabled && navigate(jardim.rota)}
                  >
                    {jardim.botao}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
