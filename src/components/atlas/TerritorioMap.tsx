import { motion } from 'framer-motion';
import { AtlasArquetipo, TERRITORIOS } from '@/hooks/useAtlasArquetipos';
import { cn } from '@/lib/utils';
import { 
  Shield, Heart, Mountain, Bird, Compass, Flame, Moon, 
  Sparkles, Zap, Flower2, Palette, Sunrise 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Heart, Mountain, Bird, Compass, Flame, Moon,
  Sparkles, Zap, Flower2, Palette, Sunrise,
};

interface TerritorioMapProps {
  arquetipos: AtlasArquetipo[];
  onSelectArquetipo: (arquetipo: AtlasArquetipo) => void;
  selectedId?: string;
}

export function TerritorioMap({ arquetipos, onSelectArquetipo, selectedId }: TerritorioMapProps) {
  // Agrupa por território
  const porTerritorio = arquetipos.reduce((acc, arq) => {
    if (!acc[arq.territorio]) acc[arq.territorio] = [];
    acc[arq.territorio].push(arq);
    return acc;
  }, {} as Record<string, AtlasArquetipo[]>);
  
  // Ordem visual: de baixo para cima (sustentação na base, integração no topo)
  const territoriosOrdenados = ['sustentacao', 'travessia', 'profundidade', 'integracao'] as const;
  
  return (
    <div className="relative w-full max-w-2xl mx-auto py-8">
      {/* Mapa em camadas concêntricas */}
      <div className="relative flex flex-col-reverse items-center gap-6">
        {territoriosOrdenados.map((territorioKey, layerIndex) => {
          const territorio = TERRITORIOS[territorioKey];
          const arqs = porTerritorio[territorioKey] || [];
          
          // Calcular largura decrescente (base maior, topo menor)
          const widthPercent = 100 - (layerIndex * 15);
          
          return (
            <motion.div
              key={territorioKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: layerIndex * 0.1, duration: 0.5 }}
              className={cn(
                "relative rounded-2xl p-4 transition-all",
                `bg-${territorio.color}-500/5 border border-${territorio.color}-500/20`
              )}
              style={{ width: `${widthPercent}%` }}
            >
              {/* Label do território */}
              <div className="absolute -top-3 left-4 px-2 bg-background">
                <span className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  `text-${territorio.color}-400`
                )}>
                  {territorio.label}
                </span>
              </div>
              
              {/* Arquétipos do território */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                {arqs.map((arq, i) => {
                  const IconComponent = ICON_MAP[arq.icone] || Sparkles;
                  const isSelected = arq.id === selectedId;
                  
                  return (
                    <motion.button
                      key={arq.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: layerIndex * 0.1 + i * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectArquetipo(arq)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all",
                        "hover:bg-white/5 group cursor-pointer",
                        isSelected && "bg-gold/10 ring-2 ring-gold/50"
                      )}
                    >
                      <div className={cn(
                        "p-2.5 rounded-full transition-all",
                        `bg-${arq.cor_acento}-500/20`,
                        "group-hover:bg-opacity-40"
                      )}>
                        <IconComponent className={cn(
                          "w-5 h-5 transition-all",
                          `text-${arq.cor_acento}-400`,
                          "group-hover:scale-110"
                        )} />
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center max-w-[80px] leading-tight">
                        {arq.nome}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Indicador de direção */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-muted-foreground/50">
        <span className="text-[10px] uppercase tracking-widest rotate-90 origin-center whitespace-nowrap">
          Integração ↑
        </span>
      </div>
    </div>
  );
}
