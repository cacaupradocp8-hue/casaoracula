import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import CidadelaMapSVG, { type DistrictDisplayState } from '@/components/cidadela/CidadelaMapSVG';

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
  nivel_integracao?: string;
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
  // Build district states for the SVG map
  const svgDistrictStates = useMemo(() => {
    const states: Record<string, DistrictDisplayState> = {};
    const tensaoSet = new Set((data.distritos_tensao || []).map(d => d.toLowerCase()));
    const ativoSet = new Set((data.distritos_ativos || []).map(d => d.toLowerCase()));
    Object.values(DISTRITOS_META).forEach(d => {
      const key = d.nome.toLowerCase();
      if (tensaoSet.has(key)) states[key] = 'em_tensao';
      else if (ativoSet.has(key)) states[key] = 'ativo';
    });
    if (data.distrito_dominante) {
      const domKey = data.distrito_dominante.toLowerCase();
      if (!states[domKey] || states[domKey] === 'nao_explorado') {
        states[domKey] = 'ativo';
      }
    }
    return states;
  }, [data]);

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto overflow-hidden">
      <motion.div {...anim(0)} className="text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center"
          style={{ background: `${corHex}15`, border: `2px solid ${corHex}40` }}>
          <MapPin className="w-7 h-7" style={{ color: corHex }} />
        </div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">Camada 2</p>
        <h2 className="font-display text-2xl font-bold text-foreground">Sua CidaDELA Interior</h2>
      </motion.div>

      {/* Cor e atmosfera */}
      <motion.div {...anim(0.1)} className="flex items-center justify-center gap-3 flex-wrap px-4">
        <div className="w-6 h-6 rounded-full shadow-md shrink-0" style={{ backgroundColor: corHex }} />
        <span className="text-sm font-medium text-foreground">{cor}</span>
        <span className="text-xs text-muted-foreground">·</span>
        {atmosfera.slice(0, 3).map(a => (
          <span key={a} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">{a}</span>
        ))}
      </motion.div>

      {/* Nível de integração */}
      {data.nivel_integracao && (
        <motion.div {...anim(0.15)} className="flex justify-center">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            data.nivel_integracao === 'alto' ? 'bg-accent/15 text-accent-foreground' :
            data.nivel_integracao === 'medio' ? 'bg-amber-500/15 text-amber-600' :
            'bg-destructive/10 text-destructive'
          }`}>
            Integração: {data.nivel_integracao}
          </div>
        </motion.div>
      )}

      {/* SVG Map — mesmo visual da Casa das Máquinas */}
      <motion.div {...anim(0.2)}>
        <CidadelaMapSVG
          districtStates={svgDistrictStates}
          activeDistrict={data.distrito_dominante}
          maxWidth={520}
        />
      </motion.div>

      {/* Distrito Dominante */}
      <motion.div {...anim(0.3)}>
        <Card className="border-primary/20 bg-primary/5 mx-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary/80">
              {DISTRITOS_META[data.distrito_dominante]?.icon || '🏛️'} Distrito Central: {data.distrito_dominante}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed break-words">{data.distrito_dominante_descricao}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leitura Integrada */}
      <motion.div {...anim(0.4)}>
        <Card className="border-border/10 bg-card/40 mx-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground/70">Leitura Simbólica Integrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed italic break-words">{data.leitura_integrada}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid: Tensão + Crescimento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
        <motion.div {...anim(0.5)}>
          <Card className="border-amber-500/15 bg-amber-500/5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-amber-500/70">Tensão Simbólica</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-foreground/70 leading-relaxed break-words">{data.tensao_simbolica}</p>
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
              <p className="text-xs text-foreground/70 leading-relaxed break-words">{data.territorio_crescimento_descricao}</p>
              <p className="text-[10px] text-accent-foreground/50 mt-1">{data.territorio_crescimento}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Direção da Travessia */}
      <motion.div {...anim(0.6)}>
        <Card className="border-primary/10 mx-4">
          <CardContent className="p-5 text-center">
            <p className="text-[10px] tracking-wider uppercase text-muted-foreground/40 mb-2">Direção da travessia</p>
            <p className="text-sm text-foreground/80 italic leading-relaxed break-words">{data.direcao_travessia}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
