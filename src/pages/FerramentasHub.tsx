import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wrench,
  Map,
  FileText,
  Sparkles,
  Brain,
  Target,
  Compass,
  Users,
  Lock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FerramentaCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: FerramentaItem[];
}

interface FerramentaItem {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  minPortal: "visitante" | "pre_iniciada" | "iniciada" | "admin";
}

const PORTAL_HIERARCHY: Record<string, number> = {
  visitante: 0,
  pre_iniciada: 1,
  iniciada: 2,
  admin: 3,
};

const categories: FerramentaCategory[] = [
  {
    title: "Mapas & Visualizações",
    description: "Ferramentas visuais para mapeamento simbólico",
    icon: <Map className="w-5 h-5" />,
    items: [
      {
        name: "Mapa Vivo",
        description: "Mapas mentais simbólicos para organização de insights",
        path: "/ferramentas/mapa-vivo",
        icon: <Map className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Mapa Orácula",
        description: "Integração visual de Big5 e Eneagrama",
        path: "/ferramentas/mapa-oracula",
        icon: <Compass className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
    ],
  },
  {
    title: "Templates Guiados",
    description: "Sessões estruturadas para facilitação profissional",
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        name: "Template Big Five",
        description: "Sessão guiada de reflexão sobre personalidade",
        path: "/templates/big5",
        icon: <Brain className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Template Eneagrama",
        description: "Sessão guiada de mapeamento tipológico",
        path: "/templates/enneagram",
        icon: <Target className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Template Tarot",
        description: "Sessão guiada de leitura simbólica",
        path: "/templates/tarot",
        icon: <Sparkles className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Template Constelação",
        description: "Sessão guiada de mapeamento sistêmico",
        path: "/templates/constellation",
        icon: <Users className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
    ],
  },
  {
    title: "Leituras Simbólicas",
    description: "Ferramentas de interpretação e análise",
    icon: <Sparkles className="w-5 h-5" />,
    items: [
      {
        name: "Big5 Simbólico",
        description: "Leitura narrativa das cinco forças",
        path: "/ferramenta/big5-simbolico",
        icon: <Brain className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Eneagrama Feminino",
        description: "Mapeamento dos nove arquétipos",
        path: "/ferramenta/eneagrama-feminino",
        icon: <Target className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Jornada da Heroína",
        description: "Navegação pelas 7 fases da travessia",
        path: "/ferramenta/jornada-heroina",
        icon: <Sparkles className="w-5 h-5" />,
        minPortal: "pre_iniciada",
      },
      {
        name: "Leitura 5 Camadas",
        description: "Análise radiestésica multicamadas",
        path: "/radiestesia/leitura-5-camadas",
        icon: <Compass className="w-5 h-5" />,
        minPortal: "iniciada",
      },
    ],
  },
];

export default function FerramentasHub() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;

  const canAccess = (minPortal: string): boolean => {
    const requiredLevel = PORTAL_HIERARCHY[minPortal] || 0;
    return userPortalLevel >= requiredLevel;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Ferramentas"
          subtitle="Recursos profissionais para prática simbólica e terapêutica"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="space-y-12">
          {categories.map((category) => (
            <section key={category.title}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold flex items-center justify-center">
                  {category.icon}
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((item) => {
                  const isAccessible = canAccess(item.minPortal);

                  return (
                    <Card
                      key={item.path}
                      className={cn(
                        "group transition-all duration-300 cursor-pointer",
                        isAccessible && "hover:shadow-gold hover:border-gold/30",
                        !isAccessible && "opacity-60"
                      )}
                      onClick={() => isAccessible && navigate(item.path)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isAccessible
                                ? "bg-gold/20 text-gold"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isAccessible ? item.icon : <Lock className="w-5 h-5" />}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle
                          className={cn(
                            "text-base mb-1",
                            isAccessible && "group-hover:text-gold transition-colors"
                          )}
                        >
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {isAccessible
                            ? item.description
                            : `Disponível a partir do portal ${item.minPortal.replace("_", "-")}`}
                        </CardDescription>
                        {isAccessible && (
                          <div className="flex items-center justify-end mt-3">
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold transition-all group-hover:translate-x-1" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
