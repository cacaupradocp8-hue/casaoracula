import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass } from 'lucide-react';

interface DirecaoClinicaData {
  // Modo terapeuta
  estilo_terapeutico?: string;
  zona_seguranca?: string;
  zona_projecao?: string;
  ferramentas_naturais?: string[];
  ferramentas_desafio?: string[];
  orientacao?: string;
  // Modo cliente
  abordagem?: string;
  risco?: string;
  sugestoes?: string[];
  ferramentas_indicadas?: string[];
  distrito_foco?: string;
  pergunta_clinica?: string;
}

interface Props {
  data: DirecaoClinicaData;
  modo?: 'terapeuta' | 'cliente';
}

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export function CamadaDirecaoClinica({ data, modo = 'terapeuta' }: Props) {
  const isClient = modo === 'cliente';

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto overflow-hidden">
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
          <Compass className="w-7 h-7 text-accent-foreground/70" />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Camada 3</p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          {isClient ? 'Direção Clínica' : 'Direção Clínica'}
        </h2>
        <p className="text-xs text-muted-foreground/60 max-w-sm mx-auto">
          {isClient
            ? 'Orientações para a condução terapêutica desta cliente.'
            : 'Esta leitura é para você, facilitadora — como guia da sua própria prática.'}
        </p>
      </motion.div>

      {/* === MODO TERAPEUTA === */}
      {!isClient && (
        <>
          <motion.div {...anim(0.15)}>
            <Card className="border-border/10 bg-card/40 mx-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-foreground/70">Seu estilo como guia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed break-words">{data.estilo_terapeutico}</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
            <motion.div {...anim(0.25)}>
              <Card className="border-accent/15 bg-accent/5 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-accent-foreground/70">🌿 Zona de segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-foreground/70 leading-relaxed break-words">{data.zona_seguranca}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...anim(0.3)}>
              <Card className="border-amber-500/15 bg-amber-500/5 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-amber-500/70">⚠️ Zona de atenção</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-foreground/70 leading-relaxed break-words">{data.zona_projecao}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div {...anim(0.4)}>
            <Card className="border-border/10 bg-card/40 mx-4">
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

          <motion.div {...anim(0.5)}>
            <Card className="border-primary/15 bg-primary/5 mx-4">
              <CardContent className="p-5 text-center space-y-2">
                <p className="text-[10px] tracking-wider uppercase text-primary/40">Orientação para sua prática</p>
                <p className="text-sm text-foreground/80 italic leading-relaxed break-words">{data.orientacao}</p>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* === MODO CLIENTE === */}
      {isClient && (
        <>
          {/* Abordagem recomendada */}
          <motion.div {...anim(0.15)}>
            <Card className="border-primary/15 bg-primary/5 mx-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-primary/80">📋 Abordagem Recomendada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed break-words">{data.abordagem}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Risco */}
          <motion.div {...anim(0.25)}>
            <Card className="border-amber-500/15 bg-amber-500/5 mx-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-amber-500/70">⚠️ Risco de Projeção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-foreground/70 leading-relaxed break-words">{data.risco}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sugestões acionáveis */}
          {data.sugestoes && data.sugestoes.length > 0 && (
            <motion.div {...anim(0.35)}>
              <Card className="border-border/10 bg-card/40 mx-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground/70">🎯 Ações Sugeridas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {data.sugestoes.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                        <span className="text-primary mt-0.5 shrink-0">→</span>
                        <span className="break-words">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Ferramentas indicadas */}
          {data.ferramentas_indicadas && data.ferramentas_indicadas.length > 0 && (
            <motion.div {...anim(0.45)}>
              <Card className="border-border/10 bg-card/40 mx-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground/70">🔧 Ferramentas Indicadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {data.ferramentas_indicadas.map(f => (
                      <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Distrito foco + Pergunta clínica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
            {data.distrito_foco && (
              <motion.div {...anim(0.5)}>
                <Card className="border-accent/15 bg-accent/5 h-full">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-[10px] text-accent-foreground/50 uppercase tracking-wider">Foco próxima sessão</p>
                    <p className="text-sm font-medium text-foreground">{data.distrito_foco}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {data.pergunta_clinica && (
              <motion.div {...anim(0.55)}>
                <Card className="border-primary/10 h-full">
                  <CardContent className="p-4 text-center space-y-1">
                    <p className="text-[10px] text-primary/50 uppercase tracking-wider">Pergunta-chave</p>
                    <p className="text-xs text-foreground/80 italic break-words">"{data.pergunta_clinica}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </>
      )}

      {/* Ethical notice */}
      <motion.div {...anim(0.6)}>
        <p className="text-[10px] text-center text-muted-foreground/30 leading-relaxed max-w-sm mx-auto px-4">
          Esta leitura é simbólica e exploratória. Não constitui avaliação clínica formal.
          A interpretação final pertence a você.
        </p>
      </motion.div>
    </div>
  );
}
