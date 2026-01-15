// ============================================
// SESSION GUIDANCE PANEL — PROFESSIONAL ONLY
// Facilitator-only content for symbolic sessions
// ============================================

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lightbulb, AlertTriangle, MessageCircle, Heart, Shield, 
  Sparkles, ChevronDown, ChevronUp, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Arquetipo {
  id: string;
  numero: number;
  nome: string;
  notas_leitura: string | null;
  transferencias_comuns: string | null;
  resistencias_tipicas: string | null;
  linguagem_evitar: string | null;
  linguagem_que_abre: string | null;
  cautelas_eticas: string | null;
}

interface Orientacao {
  id: string;
  arquetipo_id: string;
  tipo: string;
  titulo: string | null;
  texto: string;
  ordem: number;
}

interface SessionGuidancePanelProps {
  arquetipo: Arquetipo;
  className?: string;
}

export function SessionGuidancePanel({ arquetipo, className }: SessionGuidancePanelProps) {
  const [orientacoes, setOrientacoes] = useState<Orientacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetchOrientacoes();
  }, [arquetipo.id]);

  const fetchOrientacoes = async () => {
    const { data } = await supabase
      .from('eneagrama_feminino_orientacoes')
      .select('*')
      .eq('arquetipo_id', arquetipo.id)
      .eq('ativo', true)
      .order('ordem');

    if (data) setOrientacoes(data);
    setLoading(false);
  };

  const getOrientacoesByTipo = (tipo: string) => 
    orientacoes.filter(o => o.tipo === tipo);

  if (loading) {
    return (
      <Card className={cn("glass border-purple-500/30", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("glass border-purple-500/30 overflow-hidden", className)}>
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-purple-500/10 to-transparent p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-purple-400">
              Orientação para Facilitadora
            </h3>
            <p className="text-xs text-muted-foreground">
              Conteúdo exclusivo para profissionais
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {expanded && (
        <CardContent className="p-4 space-y-4">
          <Tabs defaultValue="leitura" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="leitura" className="text-xs">Leitura</TabsTrigger>
              <TabsTrigger value="linguagem" className="text-xs">Linguagem</TabsTrigger>
              <TabsTrigger value="orientacoes" className="text-xs">Conduções</TabsTrigger>
            </TabsList>

            {/* LEITURA TAB */}
            <TabsContent value="leitura" className="space-y-4">
              {/* Reading Notes */}
              {arquetipo.notas_leitura && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      Notas de Leitura
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{arquetipo.notas_leitura}</p>
                </div>
              )}

              {/* Common Transferences */}
              {arquetipo.transferencias_comuns && (
                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-blue-400" />
                    <p className="text-xs font-medium uppercase text-blue-400">
                      Transferências Comuns
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{arquetipo.transferencias_comuns}</p>
                </div>
              )}

              {/* Ethical Cautions */}
              {arquetipo.cautelas_eticas && (
                <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-xs font-medium uppercase text-red-400">
                      Cautelas Éticas
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{arquetipo.cautelas_eticas}</p>
                </div>
              )}
            </TabsContent>

            {/* LINGUAGEM TAB */}
            <TabsContent value="linguagem" className="space-y-4">
              {/* Language to Avoid */}
              {arquetipo.linguagem_evitar && (
                <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <EyeOff className="w-4 h-4 text-orange-400" />
                    <p className="text-xs font-medium uppercase text-orange-400">
                      Linguagem a Evitar
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {arquetipo.linguagem_evitar}
                  </p>
                </div>
              )}

              {/* Language that Opens */}
              {arquetipo.linguagem_que_abre && (
                <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    <p className="text-xs font-medium uppercase text-green-400">
                      Linguagem que Abre
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {arquetipo.linguagem_que_abre}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* ORIENTACOES TAB */}
            <TabsContent value="orientacoes" className="space-y-4">
              {/* Opening Questions */}
              {getOrientacoesByTipo('abertura').length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> Perguntas de Abertura
                  </p>
                  {getOrientacoesByTipo('abertura').map(o => (
                    <div key={o.id} className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                      <p className="text-sm italic">"{o.texto}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Symbolic Mirrors */}
              {getOrientacoesByTipo('espelho').length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase text-gold flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Espelhos Simbólicos
                  </p>
                  {getOrientacoesByTipo('espelho').map(o => (
                    <div key={o.id} className="p-3 bg-gold/5 rounded-lg border border-gold/20">
                      <p className="text-sm italic">"{o.texto}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Closure Rituals */}
              {getOrientacoesByTipo('encerramento').length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase text-blue-400 flex items-center gap-2">
                    <Shield className="w-3 h-3" /> Ritual de Encerramento
                  </p>
                  {getOrientacoesByTipo('encerramento').map(o => (
                    <div key={o.id} className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <p className="text-sm italic">{o.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              {orientacoes.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma orientação cadastrada para este arquétipo.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
