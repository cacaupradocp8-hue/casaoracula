import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Brain, Target, Sparkles, MessageCircleQuestion, Lock, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FerramentaVitrine, FerramentaStatus } from "@/components/shared/FerramentaVitrine";
import * as LucideIcons from "lucide-react";

interface FerramentaDB {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  ferramenta_chave: string;
  icone: string | null;
  rota: string;
  ordem: number;
  ativa: boolean;
  sala_id: string;
}

// Fallback hardcoded tools for when database is empty
const FERRAMENTAS_FALLBACK = [
  {
    id: "big5",
    ferramenta_nome: "Big 5",
    ferramenta_descricao: "Avaliação de personalidade baseada nos cinco grandes fatores psicológicos.",
    ferramenta_chave: "big5",
    icone: "brain",
    rota: "/salas/big5",
    ordem: 1,
    ativa: true,
    sala_id: "",
  },
  {
    id: "eneagrama",
    ferramenta_nome: "Eneagrama",
    ferramenta_descricao: "Mapeamento de tipos de personalidade e padrões de comportamento.",
    ferramenta_chave: "eneagrama",
    icone: "target",
    rota: "/salas/eneagrama",
    ordem: 2,
    ativa: true,
    sala_id: "",
  },
  {
    id: "oraculo-perguntas",
    ferramenta_nome: "Oráculo das Perguntas",
    ferramenta_descricao: "Perguntas poderosas para facilitar reflexões profundas em sessões.",
    ferramenta_chave: "oraculo-perguntas",
    icone: "messageCircleQuestion",
    rota: "/salas/oraculo-perguntas",
    ordem: 3,
    ativa: true,
    sala_id: "",
  },
  {
    id: "mapa-oracula",
    ferramenta_nome: "Mapa Orácula",
    ferramenta_descricao: "Integração simbólica dos dados de Big5 e Eneagrama para insights profundos.",
    ferramenta_chave: "mapa-oracula",
    icone: "sparkles",
    rota: "/salas/mapa-oracula",
    ordem: 4,
    ativa: true,
    sala_id: "",
  },
];

const PORTAL_HIERARCHY: Record<string, number> = {
  visitante: 0,
  pre_iniciada: 1,
  iniciada: 2,
  admin: 3,
};

// Dynamic icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  wrench: LucideIcons.Wrench,
  brain: LucideIcons.Brain,
  target: LucideIcons.Target,
  sparkles: LucideIcons.Sparkles,
  messageCircleQuestion: LucideIcons.MessageCircleQuestion,
  compass: LucideIcons.Compass,
  helpCircle: LucideIcons.HelpCircle,
  book: LucideIcons.Book,
  bookOpen: LucideIcons.BookOpen,
  star: LucideIcons.Star,
  heart: LucideIcons.Heart,
  lightbulb: LucideIcons.Lightbulb,
  users: LucideIcons.Users,
  messageCircle: LucideIcons.MessageCircle,
  pencil: LucideIcons.Pencil,
  clipboardList: LucideIcons.ClipboardList,
  lock: LucideIcons.Lock,
  clock: LucideIcons.Clock,
};

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = iconMap[name?.toLowerCase()] || iconMap[name] || LucideIcons.Wrench;
  return <IconComponent className={className} />;
};

export default function Salas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ferramentas, setFerramentas] = useState<FerramentaDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFerramenta, setSelectedFerramenta] = useState<FerramentaDB | null>(null);
  const [showVitrine, setShowVitrine] = useState(false);

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;
  const isAdmin = user?.portal === "admin";

  useEffect(() => {
    fetchFerramentas();
  }, []);

  const fetchFerramentas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sala_ferramentas")
        .select("*")
        .order("ordem");

      if (error) {
        console.error("Error fetching ferramentas:", error);
        // Use fallback if database fetch fails
        setFerramentas(FERRAMENTAS_FALLBACK);
      } else if (data && data.length > 0) {
        setFerramentas(data);
      } else {
        // Use fallback if database is empty
        setFerramentas(FERRAMENTAS_FALLBACK);
      }
    } catch (err) {
      console.error("Error:", err);
      setFerramentas(FERRAMENTAS_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const getFerramentaStatus = (ferramenta: FerramentaDB): FerramentaStatus => {
    // Admin always has access
    if (isAdmin) return "ativo";
    
    // Check if tool is inactive
    if (!ferramenta.ativa) return "em_breve";
    
    // Check portal level (pre_iniciada minimum for tools)
    const minLevel = PORTAL_HIERARCHY["pre_iniciada"];
    if (userPortalLevel < minLevel) return "upgrade";
    
    return "ativo";
  };

  const handleFerramentaClick = (ferramenta: FerramentaDB) => {
    const status = getFerramentaStatus(ferramenta);
    
    if (status === "ativo") {
      navigate(ferramenta.rota);
    } else {
      setSelectedFerramenta(ferramenta);
      setShowVitrine(true);
    }
  };

  const getStatusBadge = (status: FerramentaStatus) => {
    switch (status) {
      case "em_breve":
        return <Badge variant="secondary" className="text-xs"><Clock className="w-3 h-3 mr-1" />Em breve</Badge>;
      case "bloqueado":
      case "upgrade":
        return <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-1" />Bloqueado</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 pb-20">
        <SectionHeader
          title="Ferramentas"
          subtitle="Ferramentas terapêuticas para uso em sessões e autoconhecimento"
          icon={<Wrench className="w-5 h-5" />}
          className="mb-8"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ferramentas.map((ferramenta) => {
            const status = getFerramentaStatus(ferramenta);
            const isAccessible = status === "ativo";
            
            return (
              <Card
                key={ferramenta.id}
                className={`glass transition-all cursor-pointer ${
                  isAccessible
                    ? "hover:border-gold/50 hover:shadow-gold/10 hover:shadow-lg"
                    : "opacity-60"
                }`}
                onClick={() => handleFerramentaClick(ferramenta)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <DynamicIcon name={ferramenta.icone || "wrench"} className="w-6 h-6" />
                    </div>
                    {!isAccessible && getStatusBadge(status)}
                  </div>
                  <CardTitle className="text-lg">{ferramenta.ferramenta_nome}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {isAccessible 
                      ? ferramenta.ferramenta_descricao 
                      : status === "em_breve"
                        ? "Esta ferramenta estará disponível em breve."
                        : "Disponível a partir do portal Pré-Iniciada"
                    }
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Vitrine Modal */}
      {selectedFerramenta && (
        <FerramentaVitrine
          open={showVitrine}
          onOpenChange={setShowVitrine}
          nome={selectedFerramenta.ferramenta_nome}
          descricao={selectedFerramenta.ferramenta_descricao}
          indicacao="Profissionais em formação terapêutica"
          status={getFerramentaStatus(selectedFerramenta)}
          ctaTexto={getFerramentaStatus(selectedFerramenta) === "upgrade" ? "Atualizar plano" : undefined}
          ctaAcao={
            getFerramentaStatus(selectedFerramenta) === "upgrade"
              ? () => window.open("https://rockty.com/formacao-oracula", "_blank")
              : undefined
          }
        />
      )}
    </AppLayout>
  );
}
