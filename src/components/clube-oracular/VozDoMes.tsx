import { motion } from 'framer-motion';
import { Flame, Ear, BookOpen, Users, Eye, Footprints, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { MesJornada } from '@/constants/jornadaAnual';

const VOZ_ICONS: Record<string, React.ElementType> = {
  'A Voz da Que Carrega o Fogo Antigo': Flame,
  'A Voz da Que Cura pelo Contato': Ear,
  'A Voz da Que Sopra Histórias': BookOpen,
  'A Voz da Que Sonha para o Coletivo': Users,
  'A Voz da Que Tece o Invisível': Eye,
  'A Voz da Que Lembra os Caminhos Antigos': Footprints,
  'A Voz da Que Escuta as Sombras': Moon,
};

interface Props {
  mes: MesJornada;
}

export function VozDoMes({ mes }: Props) {
  const Icon = VOZ_ICONS[mes.voz_dominante] || Flame;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-gold/15 bg-card/40 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-gold/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-medium mb-1">
                Voz do Mês
              </p>
              <h3 className="font-display text-foreground text-lg leading-snug">
                {mes.voz_dominante}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80 leading-relaxed">
            {mes.voz_descricao}
          </p>

          {/* Conducao */}
          <div className="border-l-2 border-gold/20 pl-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5">
              Forma de condução
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed italic">
              {mes.voz_conducao}
            </p>
          </div>

          {/* Pergunta-chave */}
          <div className="bg-gold/5 rounded-lg p-4 border border-gold/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold/60 mb-2">
              Pergunta-chave
            </p>
            <p className="font-display text-foreground text-base italic">
              "{mes.voz_pergunta_chave}"
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
