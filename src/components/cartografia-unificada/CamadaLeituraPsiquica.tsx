import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface LeituraPsiquicaData {
  titulo: string;
  tracos_dominantes: string;
  padroes_emocionais: string;
  estrutura_funcionamento: string;
  frase_espelho: string;
}

interface Props {
  data: LeituraPsiquicaData;
  predominante?: { nome: string; simbolo: string; cor_primaria: string; narrativa_elevada: string } | null;
  fragilizado?: { nome: string; simbolo: string; cor_primaria: string; narrativa_fragil: string } | null;
  medias?: Record<string, number>;
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export function CamadaLeituraPsiquica({ data, predominante, fragilizado, medias }: Props) {
  return (
    <div className="space-y-6">
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Camada 1</p>
        <h2 className="font-display text-2xl font-bold text-foreground">Leitura Psíquica</h2>
        <p className="text-lg italic text-primary/80 font-display">"{data.titulo}"</p>
      </motion.div>

      {/* Frase Espelho */}
      <motion.div {...anim(0.15)}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <p className="text-base italic text-foreground/90 leading-relaxed">
              "{data.frase_espelho}"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Traços Dominantes */}
      <motion.div {...anim(0.25)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground/70">Traços Dominantes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{data.tracos_dominantes}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Padrões Emocionais */}
      <motion.div {...anim(0.35)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground/70">Padrões Emocionais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{data.padroes_emocionais}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Estrutura de Funcionamento */}
      <motion.div {...anim(0.45)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground/70">Estrutura de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{data.estrutura_funcionamento}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Big5 Bars */}
      {medias && Object.keys(medias).length > 0 && (
        <motion.div {...anim(0.55)}>
          <Card className="border-border/10 bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground/70">Mapa de Forças</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(medias)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([chave, media]) => (
                  <div key={chave} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground/70 capitalize">{chave.replace(/_/g, ' ')}</span>
                      <span className="text-muted-foreground">{(media as number).toFixed(1)}/5</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${((media as number) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Predominante & Fragilizado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {predominante && (
          <motion.div {...anim(0.6)}>
            <Card className="border-2 h-full" style={{ borderColor: predominante.cor_primaria + '60' }}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{predominante.simbolo}</span>
                  <span className="text-[10px] tracking-wider uppercase text-primary/60">Predominante</span>
                </div>
                <p className="text-sm font-medium text-foreground">{predominante.nome}</p>
                <p className="text-xs text-foreground/60 leading-relaxed">{predominante.narrativa_elevada}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {fragilizado && fragilizado.nome !== predominante?.nome && (
          <motion.div {...anim(0.65)}>
            <Card className="border border-amber-500/20 h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{fragilizado.simbolo}</span>
                  <span className="text-[10px] tracking-wider uppercase text-amber-500/60">Pede atenção</span>
                </div>
                <p className="text-sm font-medium text-foreground">{fragilizado.nome}</p>
                <p className="text-xs text-foreground/60 leading-relaxed">{fragilizado.narrativa_fragil}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
