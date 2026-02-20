import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePageShell } from "@/components/shared/MobilePageShell";
import { FerramentaCard, FerramentaCardData } from "@/components/shared/FerramentaCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  Map,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessFeature, PortalType } from "@/types/portal";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

// Using centralized portal hierarchy from types

// Define the 4 sections with metadata
const SECTIONS = [
  {
    key: 'travessia',
    title: 'Travessia Simbólica',
    subtitle: 'Ferramentas para jornadas de transformação profunda',
    description: 'Instrumentos que acompanham processos de passagem, crise e renascimento. Cada travessia é única e guiada pela narrativa da própria psique.',
    icon: Compass,
    color: 'purple',
    // Categories that belong to this section
    categories: ['Jornadas', 'Travessias', 'Processos', 'Caminho'],
  },
  {
    key: 'estrutura',
    title: 'Estrutura & Sobrevivência',
    subtitle: 'Suporte para momentos de reorganização',
    description: 'Recursos para quando o ego precisa se reorganizar. Contêm estrutura, ancoragem e práticas de sustentação durante períodos difíceis.',
    icon: Shield,
    color: 'emerald',
    categories: ['Estrutura', 'Sobrevivência', 'Suporte', 'Ancoragem', 'Protocolos'],
  },
  {
    key: 'mapas',
    title: 'Mapas da Psique',
    subtitle: 'Cartografias do mundo interior',
    description: 'Ferramentas de mapeamento simbólico que revelam territórios internos, arquétipos dominantes e padrões inconscientes.',
    icon: Brain,
    color: 'gold',
    categories: ['Mapas', 'Visualizações', 'Diagnóstico', 'Perfil', 'Territórios'],
  },
  {
    key: 'oracular',
    title: 'Prática Oracular',
    subtitle: 'Leitura e interpretação simbólica',
    description: 'Instrumentos de escuta oracular: cartas, imagens e práticas de leitura que acessam a linguagem do inconsciente.',
    icon: Sparkles,
    color: 'rose',
    categories: ['Oráculos', 'Leituras', 'Cartas', 'Divinação', 'Simbólico'],
  },
];

// Determine which section a ferramenta belongs to based on tipo_ferramenta (standardized)
const getSectionForTipoFerramenta = (tipoFerramenta: string | null): string => {
  if (!tipoFerramenta) return 'mapas'; // Default
  
  switch (tipoFerramenta) {
    case 'diagnostico':
      return 'mapas'; // Mapas da Psique
    case 'leitura_simbolica':
      return 'oracular'; // Prática Oracular
    case 'autoleitura':
      return 'mapas'; // Mapas da Psique (autorreflexão)
    case 'conducao_terapeutica':
      return 'travessia'; // Travessia Simbólica
    case 'ritual_simbolico':
      return 'estrutura'; // Estrutura & Sustentação
    case 'ferramenta_narrativa':
      return 'travessia'; // Travessia Simbólica
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

export default function FerramentasHub() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userPortal = user?.portal || 'visitante';
  const isAdmin = userPortal === 'admin';
  const canAccessSyntheia = canAccessFeature(userPortal as PortalType, 'aluna');

  // Fetch ferramentas from database with new classification fields
  // Only show complete, active tools (must have tipo_ferramenta and finalidade_pratica)
  const { data: ferramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-hub'],
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
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent flickering from refetches
  });

  const canAccess = (minPortal: string): boolean => {
    if (isAdmin) return true;
    return canAccessFeature(userPortal as PortalType, minPortal as PortalType);
  };

  // Group ferramentas by section using tipo_ferramenta (standardized field)
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
          <span className="text-foreground">Ferramentas</span>
        </nav>

        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-gold font-medium mb-1">Hub</p>
          <h1 className="font-display text-2xl md:text-3xl text-foreground">Ferramentas do Método</h1>
          <p className="text-sm text-muted-foreground mt-1">Recursos profissionais para prática simbólica e terapêutica</p>
        </div>

        {/* Nota: Tríade do Método, Ferramentas Profissionais e Syntheia foram movidas para Travessias */}

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

                  {/* Tools Grid - Using FerramentaCard */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTools.map((ferramenta) => {
                      const isAccessible = canAccess(ferramenta.portal_minimo);

                      const cardData: FerramentaCardData = {
                        id: ferramenta.id,
                        nome: ferramenta.ferramenta_nome,
                        icone: ferramenta.icone,
                        tipo: ferramenta.tipo_ferramenta,
                        finalidade: ferramenta.finalidade_pratica || ferramenta.ferramenta_descricao,
                        origem: ferramenta.origem_metodologica,
                        rota: ferramenta.rota,
                        acessivel: isAccessible,
                        portalMinimo: ferramenta.portal_minimo,
                      };

                      return (
                        <FerramentaCard
                          key={ferramenta.id}
                          ferramenta={cardData}
                          colorScheme={section.color as 'gold' | 'purple' | 'emerald' | 'rose'}
                          onClick={() => {
                            if (ferramenta.rota) navigate(ferramenta.rota);
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}

            {/* Personal Symbolic Maps - Fixed Internal Tool */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: SECTIONS.length * 0.1 }}
            >
              <div className={cn("rounded-xl p-6 mb-6", colorClasses.gold.bg, "border", colorClasses.gold.border)}>
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colorClasses.gold.icon)}>
                    <Map className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className={cn("font-display text-xl font-semibold mb-1", colorClasses.gold.text)}>
                      Mapas Reflexivos Pessoais
                    </h2>
                    <p className="text-sm text-muted-foreground mb-2">
                      Espaço privado de reflexão simbólica
                    </p>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Ferramentas de autorreflexão baseadas em modelos simbólicos. Totalmente privadas — somente você tem acesso ao conteúdo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                  className="group transition-all duration-300 cursor-pointer hover:shadow-gold hover:border-gold/30"
                  onClick={() => navigate('/mapas-pessoais')}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-lg", colorClasses.gold.icon)}>
                        <Map className="w-5 h-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-base mb-1 group-hover:text-gold transition-colors">
                      Mapas Reflexivos
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      Big5, Eneagrama, Antroposofia, Constelação e Tarô — modelos de reflexão simbólica pessoal.
                    </CardDescription>
                    <div className="flex items-center justify-end mt-3">
                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
