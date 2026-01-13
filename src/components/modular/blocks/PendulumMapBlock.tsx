import { useState, useEffect, useRef } from 'react';
import { ContentBlock, PendulumMapContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Target, RotateCcw, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendulumMapBlockProps {
  block: ContentBlock;
  onSave?: (data: { map: string; result: string }) => void;
}

const DEFAULT_MAPS = [
  { 
    id: 'sim_nao', 
    name: 'Sim/Não', 
    options: ['Sim', 'Não', 'Talvez', 'Reformule'] 
  },
  { 
    id: 'chakras', 
    name: 'Chakras', 
    options: ['Raiz', 'Sacral', 'Plexo Solar', 'Cardíaco', 'Laríngeo', 'Frontal', 'Coronário'] 
  },
  { 
    id: 'elementos', 
    name: 'Elementos', 
    options: ['Terra', 'Água', 'Fogo', 'Ar', 'Éter'] 
  },
  { 
    id: 'direcoes', 
    name: 'Direções', 
    options: ['Norte', 'Sul', 'Leste', 'Oeste', 'Centro'] 
  },
];

export function PendulumMapBlock({ block, onSave }: PendulumMapBlockProps) {
  const content = block.content as PendulumMapContent;
  const maps = content.maps || DEFAULT_MAPS;
  
  const [activeMap, setActiveMap] = useState(maps[0]?.id || 'sim_nao');
  const [isSwinging, setIsSwinging] = useState(false);
  const [swingAngle, setSwingAngle] = useState(0);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const currentMap = maps.find(m => m.id === activeMap) || maps[0];
  const optionCount = currentMap?.options?.length || 4;

  useEffect(() => {
    if (isSwinging) {
      const animate = () => {
        timeRef.current += 0.05;
        // Damped oscillation
        const damping = Math.exp(-timeRef.current * 0.3);
        const angle = Math.sin(timeRef.current * 3) * 45 * damping;
        setSwingAngle(angle);
        
        if (damping < 0.05) {
          // Pendulum stopped, pick a result
          setIsSwinging(false);
          const randomIndex = Math.floor(Math.random() * optionCount);
          setSelectedResult(currentMap.options[randomIndex]);
          timeRef.current = 0;
        } else {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSwinging, optionCount, currentMap]);

  const startPendulum = () => {
    setSelectedResult(null);
    setIsSwinging(true);
    timeRef.current = 0;
  };

  const stopPendulum = () => {
    setIsSwinging(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const reset = () => {
    stopPendulum();
    setSwingAngle(0);
    setSelectedResult(null);
    timeRef.current = 0;
  };

  const handleSave = () => {
    if (onSave && selectedResult) {
      onSave({ map: activeMap, result: selectedResult });
    }
  };

  // Calculate positions for options around a semicircle
  const getOptionPosition = (index: number, total: number) => {
    const angle = (Math.PI / (total - 1)) * index;
    const radius = 120;
    const x = Math.cos(Math.PI - angle) * radius;
    const y = -Math.sin(Math.PI - angle) * radius + 20;
    return { x, y };
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-gold" />
          {block.titulo || 'Pêndulo Oracular'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Selection */}
        <Tabs value={activeMap} onValueChange={setActiveMap}>
          <TabsList className="w-full flex-wrap h-auto gap-1 bg-background/50">
            {maps.map(map => (
              <TabsTrigger 
                key={map.id} 
                value={map.id}
                className="text-sm"
              >
                {map.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Pendulum Visualization */}
        <div className="relative h-72 flex items-start justify-center pt-4">
          {/* Options around semicircle */}
          <div className="absolute w-full h-full">
            {currentMap.options.map((option, index) => {
              const pos = getOptionPosition(index, currentMap.options.length);
              const isSelected = selectedResult === option;
              
              return (
                <div
                  key={option}
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    isSelected && "scale-110"
                  )}
                  style={{
                    left: `calc(50% + ${pos.x}px)`,
                    top: `calc(50% + ${pos.y}px)`,
                  }}
                >
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "text-xs px-3 py-1 transition-all",
                      isSelected && "bg-gold text-background border-gold shadow-lg shadow-gold/30"
                    )}
                  >
                    {option}
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Pendulum */}
          <div
            className="absolute top-0 left-1/2 origin-top transition-transform"
            style={{
              transform: `translateX(-50%) rotate(${swingAngle}deg)`,
              transition: isSwinging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {/* String */}
            <div className="w-0.5 h-32 bg-gradient-to-b from-gold/80 to-gold/40 mx-auto" />
            
            {/* Crystal/Weight */}
            <div className={cn(
              "w-6 h-10 bg-gradient-to-b from-purple-400 to-purple-600 rounded-b-full mx-auto",
              "shadow-lg shadow-purple-500/30",
              isSwinging && "animate-pulse"
            )}>
              <div className="w-3 h-3 bg-white/30 rounded-full mx-auto mt-1" />
            </div>
          </div>

          {/* Pivot point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold shadow-lg shadow-gold/30" />
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {isSwinging ? (
            <Button
              variant="outline"
              onClick={stopPendulum}
              className="border-gold/30"
            >
              <Pause className="w-4 h-4 mr-2" />
              Parar
            </Button>
          ) : (
            <Button
              onClick={startPendulum}
              className="bg-gold hover:bg-gold/90 text-background"
            >
              <Play className="w-4 h-4 mr-2" />
              Consultar
            </Button>
          )}
          <Button
            variant="outline"
            onClick={reset}
            className="border-border/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
        </div>

        {/* Result */}
        {selectedResult && (
          <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">Resultado:</p>
            <p className="text-xl font-medium text-gold">{selectedResult}</p>
          </div>
        )}

        {/* Save */}
        {content.saveToRegistros && onSave && selectedResult && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Salvar Consulta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
