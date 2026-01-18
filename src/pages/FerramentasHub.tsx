import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Wrench,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const PORTAL_HIERARCHY: Record<string, number> = {
  visitante: 0,
  pre_iniciada: 1,
  iniciada: 2,
  admin: 3,
};

// Map icon names to a simple display
const getIconDisplay = (iconName: string | null): string => {
  return iconName || "🔧";
};

export default function FerramentasHub() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;
  const isAdmin = user?.portal === 'admin';

  // Fetch ferramentas from database
  const { data: ferramentas, isLoading } = useQuery({
    queryKey: ['ferramentas-hub'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sala_ferramentas')
        .select('id, ferramenta_nome, ferramenta_descricao, rota, icone, tipo, portal_minimo, ordem, ativa')
        .eq('ativa', true)
        .order('tipo', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Ferramenta[];
    },
  });

  const canAccess = (minPortal: string): boolean => {
    if (isAdmin) return true;
    const requiredLevel = PORTAL_HIERARCHY[minPortal] || 0;
    return userPortalLevel >= requiredLevel;
  };

  // Group ferramentas by tipo (category)
  const groupedFerramentas = ferramentas?.reduce((acc, ferramenta) => {
    const categoria = ferramenta.tipo || 'Geral';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(ferramenta);
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

  const categories = Object.keys(groupedFerramentas);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Ferramentas"
          subtitle="Recursos profissionais para prática simbólica e terapêutica"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-8"
        />

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma ferramenta disponível no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((categoria) => (
              <section key={categoria}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 text-gold flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      {categoria}
                    </h2>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupedFerramentas[categoria].map((ferramenta) => {
                    const isAccessible = canAccess(ferramenta.portal_minimo);

                    return (
                      <Card
                        key={ferramenta.id}
                        className={cn(
                          "group transition-all duration-300 cursor-pointer",
                          isAccessible && "hover:shadow-gold hover:border-gold/30",
                          !isAccessible && "opacity-60"
                        )}
                        onClick={() => isAccessible && ferramenta.rota && navigate(ferramenta.rota)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                                isAccessible
                                  ? "bg-gold/20 text-gold"
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
                              isAccessible && "group-hover:text-gold transition-colors"
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
        )}
      </div>
    </AppLayout>
  );
}
