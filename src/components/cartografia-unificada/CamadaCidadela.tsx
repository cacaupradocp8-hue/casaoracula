import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface CidadelaData {
  distrito_dominante: string;
  distrito_dominante_descricao: string;
  distritos_ativos: string[];
  distritos_tensao: string[];
  territorio_crescimento: string;
  territorio_crescimento_descricao: string;
  leitura_integrada: string;
  tensao_simbolica: string;
  direcao_travessia: string;
}

interface Props {
  data: CidadelaData;
  cor: string;
  corHex: string;
  atmosfera: string[];
  simbolo: string;
  simboloIcon: string;
  territorios: string[];
  pontoPartida: string;
}

const DISTRITOS_META: Record<string, { nome: string; icon: string }> = {
  portao_chegada: { nome: 'Portão da Chegada', icon: '🚪' },
  torres: { nome: 'Torres', icon: '🏛️' },
  portas: { nome: 'Portas', icon: '🔑' },
  jardim_arquetipos: { nome: 'Jardim dos Arquétipos', icon: '🌿' },
  praca_abalo: { nome: 'Praça do Abalo', icon: '⚡' },
  casa_sonhos: { nome: 'Casa dos Sonhos', icon: '🌙' },
  espelho_vinculos: { nome: 'Espelho dos Vínculos', icon: '🪞' },
  forja: { nome: 'Forja', icon: '🔥' },
  conselho_interior: { nome: 'Conselho Interior', icon: '👁️' },
  labirinto: { nome: 'Labirinto', icon: '🌀' },
  praca_integracao: { nome: 'Praça da Integração', icon: '☀️' },
  portal_renascimento: { nome: 'Portal de Renascimento', icon: '🦋' },
};

const anim = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export function CamadaCidadela({ data, cor, corHex, atmosfera, simbolo, simboloIcon, territorios, pontoPartida }: Props) {
  const distritosAtivos = territorios
    .map(key => ({ key, ...DISTRITOS_META[key] }))
    .filter(d => d.nome);

  return (
    <div className="space-y-6">
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
          style={{ background: `${corHex}15`, border: `2px solid ${corHex}40` }}>
          <MapPin className="w-7 h-7" style={{ color: corHex }} />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Camada 2</p>
        <h2 className="font-display text-2xl font-bold text-foreground">Sua CidaDELA Interior</h2>
      </motion.div>

      {/* Cor e atmosfera */}
      <motion.div {...anim(0.1)} className="flex items-center justify-center gap-3 flex-wrap">
        <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: corHex }} />
        <span className="text-sm font-medium text-foreground">{cor}</span>
        <span className="text-xs text-muted-foreground">·</span>
        {atmosfera.slice(0, 3).map(a => (
          <span key={a} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{a}</span>
        ))}
      </motion.div>

      {/* Mandala visual */}
      <motion.div {...anim(0.2)} className="relative mx-auto" style={{ width: '260px', height: '260px' }}>
        {/* Centro */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
            style={{ background: `${corHex}12`, border: `2px solid ${corHex}40` }}>
            <span className="text-2xl">{simboloIcon}</span>
            <span className="text-[8px] text-foreground/50">{simbolo}</span>
          </div>
        </div>
        {/* Distritos em órbita */}
        {distritosAtivos.map((d, i) => {
          const angle = (i / distritosAtivos.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 38;
          const y = 50 + Math.sin(angle) * 38;
          const isPonto = d.key === pontoPartida;
          return (
            <div key={d.key} className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                isPonto ? 'bg-primary/15 ring-2 ring-primary/40' : 'bg-card/60 border border-border/20'
              }`}>
                {d.icon}
              </div>
              <span className="text-[7px] text-foreground/40 mt-0.5 text-center max-w-[60px] truncate">{d.nome}</span>
            </div>
          );
        })}
      </motion.div>

      {/* Distrito Dominante */}
      <motion.div {...anim(0.3)}>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary/80">
              {DISTRITOS_META[data.distrito_dominante]?.icon} Distrito Central: {data.distrito_dominante}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">{data.distrito_dominante_descricao}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leitura Integrada */}
      <motion.div {...anim(0.4)}>
        <Card className="border-border/10 bg-card/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground/70">Leitura Simbólica Integrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed italic">{data.leitura_integrada}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid: Tensão + Crescimento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div {...anim(0.5)}>
          <Card className="border-amber-500/15 bg-amber-500/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-amber-500/70">Tensão Simbólica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/70 leading-relaxed">{data.tensao_simbolica}</p>
              {data.distritos_tensao?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.distritos_tensao.map(d => (
                    <span key={d} className="text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-600/70">{d}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...anim(0.55)}>
          <Card className="border-accent/15 bg-accent/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-accent-foreground/70">Território de Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/70 leading-relaxed">{data.territorio_crescimento_descricao}</p>
              <p className="text-[10px] text-accent-foreground/50 mt-1">{data.territorio_crescimento}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Direção da Travessia */}
      <motion.div {...anim(0.6)}>
        <Card className="border-primary/10">
          <CardContent className="p-5 text-center">
            <p className="text-[10px] tracking-wider uppercase text-muted-foreground/40 mb-2">Direção da travessia</p>
            <p className="text-sm text-foreground/80 italic leading-relaxed">{data.direcao_travessia}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
