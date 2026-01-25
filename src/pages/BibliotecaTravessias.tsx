import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface TravessiaFamilia {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  slug: string | null;
  ordem: number;
  quando_usar: string | null;
  o_que_sustenta: string | null;
  ferramentas_count: number;
}

export default function BibliotecaTravessias() {
  const navigate = useNavigate();

  const { data: familias, isLoading } = useQuery({
    queryKey: ['biblioteca-familias'],
    queryFn: async () => {
      // Fetch families with tool count
      const { data: familiasData, error: familiasError } = await supabase
        .from('travessia_familias')
        .select('id, nome, descricao, icone, slug, ordem, quando_usar, o_que_sustenta')
        .eq('ativa', true)
        .order('ordem');

      if (familiasError) throw familiasError;

      // Count ferramentas per family
      const { data: countData, error: countError } = await supabase
        .from('sala_ferramentas')
        .select('familia_id')
        .eq('ativa', true)
        .not('familia_id', 'is', null);

      if (countError) throw countError;

      // Calculate counts
      const counts: Record<string, number> = {};
      countData?.forEach((f) => {
        counts[f.familia_id] = (counts[f.familia_id] || 0) + 1;
      });

      return familiasData?.map((f) => ({
        ...f,
        ferramentas_count: counts[f.id] || 0,
      })) as TravessiaFamilia[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const handleFamiliaClick = (familia: TravessiaFamilia) => {
    if (familia.slug) {
      navigate(`/biblioteca-travessias/${familia.slug}`);
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-gold" />
            <span className="text-gold/80 text-sm tracking-widest uppercase">
              Acervo Simbólico
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display text-foreground mb-4">
            Biblioteca das Travessias
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ferramentas para sustentar o que não cabe em protocolos.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </div>
        )}

        {/* Families Grid */}
        {!isLoading && familias && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {familias.map((familia, index) => (
              <motion.div
                key={familia.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:border-gold/50 hover:shadow-gold h-full flex flex-col"
                  onClick={() => handleFamiliaClick(familia)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl">{familia.icone || '✨'}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {familia.ferramentas_count} {familia.ferramentas_count === 1 ? 'ferramenta' : 'ferramentas'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                      {familia.nome}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">
                      {familia.descricao}
                    </p>
                    
                    {familia.quando_usar && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground/70 mb-1">Quando usar:</p>
                        <p className="text-sm text-foreground/80">{familia.quando_usar}</p>
                      </div>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="self-end gap-1 group-hover:text-gold"
                    >
                      Explorar
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!familias || familias.length === 0) && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Nenhuma família de travessia encontrada.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
