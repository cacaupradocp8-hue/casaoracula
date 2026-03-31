import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, MapPin, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  distritoEmergente: string;
  onSelectDistritoEmergente: (nome: string) => void;
  onSelectTool: (tool: { id: string; nome: string; rota: string | null }) => void;
}

interface DistrictWithTools {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  funcao_simbolica: string | null;
  quando_ativo: string | null;
  cor_principal: string | null;
  icone: string | null;
  tools: {
    id: string;
    nome: string;
    rota: string | null;
    icone: string | null;
    tipo: string;
  }[];
}

export function MapaConducaoDistritos({ distritoEmergente, onSelectDistritoEmergente, onSelectTool }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: districts = [] } = useQuery({
    queryKey: ['districts-with-tools'],
    queryFn: async () => {
      const [dRes, tdRes] = await Promise.all([
        supabase.from('city_districts').select('*').eq('ativo', true).order('ordem'),
        supabase.from('tool_districts').select('*, tool:tools(id, nome, rota, icone)').order('tipo'),
      ]);

      const districtMap = new Map<string, DistrictWithTools>();
      for (const d of dRes.data || []) {
        districtMap.set(d.id, { ...d, tools: [] });
      }

      for (const td of tdRes.data || []) {
        const dist = districtMap.get(td.district_id);
        if (dist && td.tool) {
          const tool = td.tool as any;
          dist.tools.push({
            id: tool.id,
            nome: tool.nome,
            rota: tool.rota,
            icone: tool.icone,
            tipo: td.tipo || 'apoio',
          });
        }
      }

      return Array.from(districtMap.values());
    },
  });

  const tipoLabel: Record<string, string> = {
    principal: 'Principal',
    apoio: 'Apoio',
    complementar: 'Complementar',
  };

  const tipoOrder: Record<string, number> = { principal: 0, apoio: 1, complementar: 2 };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-4 h-4 text-primary/60" />
        <h3 className="text-xs font-semibold text-foreground">Distritos da CidaDELA em foco</h3>
      </div>
      <p className="text-[9px] text-muted-foreground/60 italic mb-2">
        Selecione um distrito para ver as ferramentas sugeridas. Você pode usar qualquer ferramenta, independente do distrito.
      </p>

      <div className="grid gap-2">
        {districts.map(d => {
          const isExpanded = expandedId === d.id;
          const isEmergente = d.nome === distritoEmergente;

          return (
            <Card
              key={d.id}
              className={`border transition-all cursor-pointer ${
                isEmergente
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border/20 bg-card/50 hover:border-border/40'
              }`}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                  className="w-full flex items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: d.cor_principal || 'hsl(var(--primary))' }}
                    />
                    <span className="text-xs font-medium text-foreground">{d.nome}</span>
                    {isEmergente && (
                      <Badge className="text-[8px] bg-primary/20 text-primary border-0">emergente</Badge>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-3 border-t border-border/10 pt-2">
                        {/* Descrição e função */}
                        {d.funcao_simbolica && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{d.funcao_simbolica}</p>
                        )}
                        {d.quando_ativo && (
                          <p className="text-[10px] text-foreground/60">
                            <span className="font-medium">Quando ativo:</span> {d.quando_ativo}
                          </p>
                        )}

                        {/* Botão para definir como emergente */}
                        {!isEmergente && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-[10px] h-7 border-primary/20 text-primary/80 hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectDistritoEmergente(d.nome);
                            }}
                          >
                            Definir como distrito emergente da sessão
                          </Button>
                        )}

                        {/* Ferramentas agrupadas por tipo */}
                        {d.tools.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-medium">Ferramentas sugeridas</p>
                            {d.tools
                              .sort((a, b) => (tipoOrder[a.tipo] ?? 9) - (tipoOrder[b.tipo] ?? 9))
                              .map(tool => (
                                <button
                                  key={tool.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectTool(tool);
                                  }}
                                  className="w-full flex items-center justify-between p-2 rounded-md bg-background/50 border border-border/15 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                                >
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-primary/40" />
                                    <span className="text-xs text-foreground">{tool.nome}</span>
                                  </div>
                                  <Badge variant="outline" className="text-[8px] border-border/30">
                                    {tipoLabel[tool.tipo] || tool.tipo}
                                  </Badge>
                                </button>
                              ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-muted-foreground/40 italic">Nenhuma ferramenta mapeada para este distrito</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
