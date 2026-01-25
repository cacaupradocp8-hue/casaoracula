import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessFeature, PortalType } from "@/types/portal";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Label mappings
const TIPO_LABELS: Record<string, string> = {
  diagnostico: 'Diagnóstico',
  leitura_simbolica: 'Leitura Simbólica',
  autoleitura: 'Autoleitura',
  conducao_terapeutica: 'Condução Terapêutica',
  ritual_simbolico: 'Ritual Simbólico',
  ferramenta_narrativa: 'Ferramenta Narrativa',
};

const ORIGEM_LABELS: Record<string, string> = {
  padrao_psicologico: 'Padrão Psicológico',
  metodo_oracula: 'Método Orácula',
  metodo_hibrido: 'Método Híbrido',
};

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string | null;
  tipo_ferramenta: string | null;
  origem_metodologica: string | null;
  finalidade_pratica: string | null;
  portal_minimo: PortalType | null;
  ordem: number;
}

interface Familia {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  quando_usar: string | null;
  o_que_sustenta: string | null;
}

export default function BibliotecaTravessiasFamilia() {
  const { familiaSlug } = useParams<{ familiaSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userPortal = user?.portal || 'visitante';

  // Fetch family data
  const { data: familia, isLoading: loadingFamilia } = useQuery({
    queryKey: ['familia', familiaSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travessia_familias')
        .select('id, nome, descricao, icone, quando_usar, o_que_sustenta')
        .eq('slug', familiaSlug)
        .eq('ativa', true)
        .maybeSingle();

      if (error) throw error;
      return data as Familia | null;
    },
    enabled: !!familiaSlug,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch ferramentas for this family
  const { data: ferramentas, isLoading: loadingFerramentas } = useQuery({
    queryKey: ['familia-ferramentas', familia?.id],
    queryFn: async () => {
      if (!familia?.id) return [];
      
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, icone, rota, tipo_ferramenta, origem_metodologica, finalidade_pratica, portal_minimo, ordem')
        .eq('familia_id', familia.id)
        .eq('ativa', true)
        .order('ordem');

      if (error) throw error;
      return data as Ferramenta[];
    },
    enabled: !!familia?.id,
    staleTime: 5 * 60 * 1000,
  });

  const checkAccess = (minPortal: PortalType | null): boolean => {
    if (!minPortal) return true;
    return canAccessFeature(userPortal, minPortal);
  };

  const handleFerramentaClick = (ferramenta: Ferramenta) => {
    if (!checkAccess(ferramenta.portal_minimo)) return;
    if (ferramenta.rota) {
      navigate(ferramenta.rota);
    }
  };

  const isLoading = loadingFamilia || loadingFerramentas;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  if (!familia) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Família não encontrada.</p>
          <Button asChild variant="outline">
            <Link to="/biblioteca-travessias">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Biblioteca
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="gap-1">
            <Link to="/biblioteca-travessias">
              <ArrowLeft className="w-4 h-4" />
              Biblioteca das Travessias
            </Link>
          </Button>
        </div>

        {/* Family Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{familia.icone || '✨'}</span>
            <h1 className="text-2xl md:text-3xl font-display text-foreground">
              {familia.nome}
            </h1>
          </div>
          
          <p className="text-muted-foreground text-lg mb-6 max-w-3xl">
            {familia.descricao}
          </p>

          {(familia.quando_usar || familia.o_que_sustenta) && (
            <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
              {familia.quando_usar && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs text-gold/80 mb-1 uppercase tracking-wide">Quando usar</p>
                  <p className="text-sm text-foreground/90">{familia.quando_usar}</p>
                </div>
              )}
              {familia.o_que_sustenta && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                  <p className="text-xs text-gold/80 mb-1 uppercase tracking-wide">O que sustenta</p>
                  <p className="text-sm text-foreground/90">{familia.o_que_sustenta}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Ferramentas List */}
        {ferramentas && ferramentas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ferramentas.map((ferramenta, index) => {
              const hasAccess = checkAccess(ferramenta.portal_minimo);
              const tipoLabel = ferramenta.tipo_ferramenta ? TIPO_LABELS[ferramenta.tipo_ferramenta] : null;
              const origemLabel = ferramenta.origem_metodologica ? ORIGEM_LABELS[ferramenta.origem_metodologica] : null;

              return (
                <motion.div
                  key={ferramenta.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`group transition-all duration-300 h-full flex flex-col ${
                      hasAccess
                        ? 'cursor-pointer hover:border-gold/50 hover:shadow-gold'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => handleFerramentaClick(ferramenta)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                              hasAccess ? 'bg-gold/20 text-gold' : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {hasAccess ? (ferramenta.icone || '🔧') : <Lock className="w-5 h-5" />}
                          </div>
                          {tipoLabel && hasAccess && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-gold/10 text-gold border-gold/30">
                              {tipoLabel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col">
                      <CardTitle className={`text-base leading-tight mb-2 ${hasAccess ? 'group-hover:text-gold' : ''} transition-colors`}>
                        {ferramenta.ferramenta_nome}
                      </CardTitle>

                      <CardDescription className="text-sm line-clamp-2 flex-1">
                        {hasAccess
                          ? (ferramenta.finalidade_pratica || ferramenta.ferramenta_descricao || 'Ferramenta simbólica do método')
                          : `Disponível a partir do portal ${ferramenta.portal_minimo?.replace('_', '-') || 'superior'}`}
                      </CardDescription>

                      <div className="flex items-center justify-between pt-3 mt-auto">
                        {hasAccess && origemLabel ? (
                          <span className="text-[10px] text-muted-foreground/70">{origemLabel}</span>
                        ) : (
                          <span />
                        )}
                        
                        {hasAccess && (
                          <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 group-hover:text-gold">
                            Abrir
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma ferramenta disponível nesta família ainda.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
