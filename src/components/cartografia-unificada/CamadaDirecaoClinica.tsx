import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass } from 'lucide-react';

interface DirecaoClinicaData {
  estilo_terapeutico: string;
  zona_seguranca: string;
  zona_projecao: string;
  ferramentas_naturais: string[];
  ferramentas_desafio: string[];
  orientacao: string;
}

interface Props {
  data: DirecaoClinicaData;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export function CamadaDirecaoClinica({ data }: Props) {
  return (
    <div className="space-y-6">
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
          <Compass className="w-7 h-7 text-accent-foreground/70" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Camada 3</p>
        <h2 className="font-display text-2xl font-bold text-foreground">Direção Clínica</h2>
        <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto">
          Esta leitura é para você, facilitadora — como guia da sua própria prática.
        </p>
      </motion.div>

      {/* Estilo Terapêutico */}
      <motion.div {...anim(0.15)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/70">Seu estilo como guia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{data.estilo_terapeutico}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Segurança vs Projeção */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div {...anim(0.25)}>
          <Card className="border-accent/15 bg-accent/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-accent-foreground/70">🌿 Zona de segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/70 leading-relaxed">{data.zona_seguranca}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...anim(0.3)}>
          <Card className="border-amber-500/15 bg-amber-500/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-amber-500/70">⚠️ Zona de atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/70 leading-relaxed">{data.zona_projecao}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ferramentas */}
      <motion.div {...anim(0.4)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground/70">Ferramentas do método</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-[10px] text-muted-foreground/50 mb-1.5">Mais naturais para você</p>
              <div className="flex flex-wrap gap-1.5">
                {data.ferramentas_naturais?.map(f => (
                  <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground/50 mb-1.5">Representam crescimento</p>
              <div className="flex flex-wrap gap-1.5">
                {data.ferramentas_desafio?.map(f => (
                  <Badge key={f} variant="outline" className="text-[10px] border-amber-500/20 text-amber-600/70">{f}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orientação */}
      <motion.div {...anim(0.5)}>
        <Card className="border-primary/15 bg-primary/5">
          <CardContent className="p-5 text-center space-y-2">
            <p className="text-[10px] tracking-wider uppercase text-primary/40">Orientação para sua prática</p>
            <p className="text-sm text-foreground/80 italic leading-relaxed">{data.orientacao}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Ethical notice */}
      <motion.div {...anim(0.6)}>
        <p className="text-[10px] text-center text-muted-foreground/30 leading-relaxed max-w-sm mx-auto">
          Esta leitura é simbólica e exploratória. Não constitui avaliação clínica formal.
          A interpretação final pertence a você.
        </p>
      </motion.div>
    </div>
  );
}
