import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Wrench,
  Lock,
  ArrowRight,
  Loader2,
  Compass,
  Shield,
  Brain,
  Sparkles,
  Map,
  Wand2,
  Home,
  ChevronRight,
  DoorOpen,
  Waves,
  Castle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessFeature, PortalType } from "@/types/portal";

interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  rota: string | null;
  icone: string | null;
  tipo: string | null;
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

// Map icon names to emoji display
const getIconDisplay = (iconName: string | null): string => {
  return iconName || "🔧";
};

// Determine which section a ferramenta belongs to based on its tipo
const getSectionForTipo = (tipo: string | null): string => {
  if (!tipo) return 'oracular'; // Default section
  
  const tipoLower = tipo.toLowerCase();
  
  for (const section of SECTIONS) {
    for (const cat of section.categories) {
      if (tipoLower.includes(cat.toLowerCase())) {
        return section.key;
      }
    }
  }
  
  // Default fallback based on common patterns
  if (tipoLower.includes('jornada') || tipoLower.includes('heroina') || tipoLower.includes('caminho')) {
    return 'travessia';
  }
  if (tipoLower.includes('mapa') || tipoLower.includes('territorio') || tipoLower.includes('big5') || tipoLower.includes('eneagrama')) {
    return 'mapas';
  }
  if (tipoLower.includes('labirinto') || tipoLower.includes('protocolo') || tipoLower.includes('estrutura')) {
    return 'estrutura';
  }
  
  return 'oracular'; // Default
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
  const canAccessSyntheia = canAccessFeature(userPortal as PortalType, 'mentorada');

  // Fetch ferramentas from database
  const { data: ferramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-hub'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, icone, tipo, portal_minimo, ordem, ativa')
        .eq('ativa', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ferramenta[];
    },
  });

  const canAccess = (minPortal: string): boolean => {
    if (isAdmin) return true;
    return canAccessFeature(userPortal as PortalType, minPortal as PortalType);
  };

  // Group ferramentas by section
  const groupedBySection = ferramentas?.reduce((acc, ferramenta) => {
    const sectionKey = getSectionForTipo(ferramenta.tipo);
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

        <SectionHeader
          title="Ferramentas do Método"
          subtitle="Recursos profissionais para prática simbólica e terapêutica"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-10"
        />

        {/* Tríade do Método Orácula - Seção Conceitual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="rounded-xl p-6 bg-gradient-to-br from-purple-900/10 via-background to-gold/5 border border-purple-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold mb-1 text-purple-300">
                  A Tríade do Método Orácula
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fundamentos conceituais da cartografia clínica
                </p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-3">
              <Card
                className="cursor-pointer hover:border-purple-500/30 transition-colors"
                onClick={() => navigate('/metodo/portas')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <DoorOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">As Portas</h3>
                    <p className="text-xs text-muted-foreground">Onde a psique está</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card
                className="cursor-pointer hover:border-purple-500/30 transition-colors"
                onClick={() => navigate('/metodo/campos-psiquicos')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Waves className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Os Campos</h3>
                    <p className="text-xs text-muted-foreground">Como sustentar</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card
                className="cursor-pointer hover:border-purple-500/30 transition-colors"
                onClick={() => navigate('/metodo/torres')}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Castle className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">As Torres</h3>
                    <p className="text-xs text-muted-foreground">Por que se organizou</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/metodo/triade')}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                Ver síntese completa
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* SYNTHEIA - Destaque Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <Card
            className={cn(
              "relative overflow-hidden transition-all duration-300 cursor-pointer",
              "bg-gradient-to-br from-purple-900/20 via-background to-gold/5",
              "border border-purple-500/30 hover:border-gold/50",
              "hover:shadow-xl hover:shadow-gold/10",
              !canAccessSyntheia && "opacity-60"
            )}
            onClick={() => canAccessSyntheia && navigate('/syntheia')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-gold/5 opacity-50" />
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-gold/30 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <Wand2 className="w-8 h-8 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                      ✦ Inteligência Operacional
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    SYNTHEIA — O Templo
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Inteligência de apoio à profissional. Transforma intenções em estrutura, linguagem e prática aplicável. 
                    Três personalidades ativas: <span className="text-amber-400">A Ferramenteira</span>, 
                    <span className="text-purple-400"> Archétypos</span> e 
                    <span className="text-rose-400"> Aracne & Arcano</span>.
                  </p>
                  {canAccessSyntheia ? (
                    <div className="flex items-center text-gold font-medium">
                      <span>Acessar Syntheia</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <Lock className="w-4 h-4 mr-2" />
                      <span>Disponível a partir do portal mentorada</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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

                  {/* Tools Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTools.map((ferramenta) => {
                      const isAccessible = canAccess(ferramenta.portal_minimo);

                      return (
                        <Card
                          key={ferramenta.id}
                          className={cn(
                            "group transition-all duration-300 cursor-pointer",
                            isAccessible && "hover:shadow-gold hover:border-gold/30",
                            !isAccessible && "opacity-60"
                          )}
                          onClick={() => {
                            if (!isAccessible) return;
                            if (!ferramenta.rota) return;
                            navigate(ferramenta.rota);
                          }}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                                  isAccessible
                                    ? colors.icon
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {isAccessible ? getIconDisplay(ferramenta.icone) : <Lock className="w-5 h-5" />}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardTitle
                              className={cn(
                                "text-base mb-1",
                                isAccessible && `group-hover:${colors.text} transition-colors`
                              )}
                            >
                              {ferramenta.ferramenta_nome}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                              {isAccessible
                                ? (ferramenta.ferramenta_descricao || "Ferramenta simbólica")
                                : `Disponível a partir do portal ${ferramenta.portal_minimo.replace("_", "-")}`}
                            </CardDescription>
                            {isAccessible && (
                              <div className="flex items-center justify-end mt-3">
                                <ArrowRight className={cn("w-4 h-4 text-muted-foreground transition-all group-hover:translate-x-1", `group-hover:${colors.text}`)} />
                              </div>
                            )}
                          </CardContent>
                        </Card>
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
