import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FerramentaCard, FerramentaCardData } from "@/components/shared/FerramentaCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Wrench,
  Loader2,
  Compass,
  Shield,
  Brain,
  Sparkles,
  Lock,
  Home,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  rota: string | null;
  icone: string | null;
  tipo: string | null;
  tipo_ferramenta: string | null;
  origem_metodologica: string | null;
  finalidade_pratica: string | null;
  portal_minimo: string;
  ordem: number;
  ativa: boolean;
}

// Define the 4 sections with metadata
const SECTIONS = [
  {
    key: 'travessia',
    title: 'Travessia Simbólica',
    subtitle: 'Ferramentas para jornadas de transformação profunda',
    description: 'Instrumentos que acompanham processos de passagem, crise e renascimento.',
    icon: Compass,
    color: 'purple',
  },
  {
    key: 'estrutura',
    title: 'Estrutura & Sobrevivência',
    subtitle: 'Suporte para momentos de reorganização',
    description: 'Recursos para quando o ego precisa se reorganizar.',
    icon: Shield,
    color: 'emerald',
  },
  {
    key: 'mapas',
    title: 'Mapas da Psique',
    subtitle: 'Cartografias do mundo interior',
    description: 'Ferramentas de mapeamento simbólico que revelam territórios internos.',
    icon: Brain,
    color: 'gold',
  },
  {
    key: 'oracular',
    title: 'Prática Oracular',
    subtitle: 'Leitura e interpretação simbólica',
    description: 'Instrumentos de escuta oracular: cartas, imagens e práticas de leitura.',
    icon: Sparkles,
    color: 'rose',
  },
];

// Determine which section a ferramenta belongs to based on tipo_ferramenta
const getSectionForTipoFerramenta = (tipoFerramenta: string | null): string => {
  if (!tipoFerramenta) return 'mapas';
  
  switch (tipoFerramenta) {
    case 'diagnostico':
    case 'autoleitura':
      return 'mapas';
    case 'leitura_simbolica':
      return 'oracular';
    case 'conducao_terapeutica':
    case 'ferramenta_narrativa':
      return 'travessia';
    case 'ritual_simbolico':
      return 'estrutura';
    default:
      return 'mapas';
  }
};

const colorClasses = {
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'bg-purple-500/20 text-purple-400',
    text: 'text-purple-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'bg-emerald-500/20 text-emerald-400',
    text: 'text-emerald-400',
  },
  gold: {
    bg: 'bg-gold/10',
    border: 'border-gold/30',
    icon: 'bg-gold/20 text-gold',
    text: 'text-gold',
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: 'bg-rose-500/20 text-rose-400',
    text: 'text-rose-400',
  },
};

export default function FerramentasVitrine() {
  const navigate = useNavigate();

  // Fetch ALL active ferramentas from database
  const { data: ferramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-vitrine'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, icone, tipo, tipo_ferramenta, origem_metodologica, finalidade_pratica, portal_minimo, ordem, ativa')
        .eq('ativa', true)
        .not('tipo_ferramenta', 'is', null)
        .not('finalidade_pratica', 'is', null)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ferramenta[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Group ferramentas by section
  const groupedBySection = ferramentas?.reduce((acc, ferramenta) => {
    const sectionKey = getSectionForTipoFerramenta(ferramenta.tipo_ferramenta);
    if (!acc[sectionKey]) {
      acc[sectionKey] = [];
    }
    acc[sectionKey].push(ferramenta);
    return acc;
  }, {} as Record<string, Ferramenta[]>) || {};

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  const hasAnyTools = ferramentas && ferramentas.length > 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Vitrine de Ferramentas</span>
        </nav>

        <SectionHeader
          title="Vitrine de Ferramentas"
          subtitle="Conheça os recursos disponíveis para quem atravessa a formação"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-6"
        />

        {/* Vitrine Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5 p-6">
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-display text-lg text-foreground mb-1">
                    Estas ferramentas aguardam sua travessia
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A Casa ORÁCULA oferece recursos profundos para quem deseja trabalhar com leitura simbólica 
                    e sustentação terapêutica. Para utilizá-los, é necessário iniciar sua jornada na formação.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/sala-da-visitante')}
                  className="gap-2 bg-gold hover:bg-gold/90 text-background"
                >
                  Iniciar Travessia
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {!hasAnyTools ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma ferramenta disponível no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {SECTIONS.map((section, sectionIndex) => {
              const sectionTools = groupedBySection[section.key] || [];
              const IconComponent = section.icon;
              const colors = colorClasses[section.color as keyof typeof colorClasses];

              // Only render section if it has tools
              if (sectionTools.length === 0) return null;

              return (
                <motion.section
                  key={section.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  {/* Section Header */}
                  <div className={cn("rounded-xl p-6 mb-6", colors.bg, "border", colors.border)}>
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.icon)}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className={cn("font-display text-xl font-semibold mb-1", colors.text)}>
                          {section.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-2">
                          {section.subtitle}
                        </p>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tools Grid - All in vitrineMode (locked) */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTools.map((ferramenta) => {
                      const cardData: FerramentaCardData = {
                        id: ferramenta.id,
                        nome: ferramenta.ferramenta_nome,
                        icone: ferramenta.icone,
                        tipo: ferramenta.tipo_ferramenta,
                        finalidade: ferramenta.finalidade_pratica || ferramenta.ferramenta_descricao,
                        origem: ferramenta.origem_metodologica,
                        rota: ferramenta.rota,
                        acessivel: false, // Always locked in vitrine
                        portalMinimo: ferramenta.portal_minimo,
                      };

                      return (
                        <FerramentaCard
                          key={ferramenta.id}
                          ferramenta={cardData}
                          colorScheme={section.color as 'gold' | 'purple' | 'emerald' | 'rose'}
                          vitrineMode={true}
                          onClick={() => {}} // No navigation in vitrine
                        />
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Pronta para desbloquear essas ferramentas?
          </p>
          <Button 
            onClick={() => navigate('/sala-da-visitante')}
            size="lg"
            className="gap-2 bg-gold hover:bg-gold/90 text-background"
          >
            Atravessar o Limiar
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
