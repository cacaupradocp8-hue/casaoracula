import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Brain, Target, Sparkles, MessageCircleQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface Ferramenta {
  id: string;
  nome: string;
  descricao: string;
  rota: string;
  icone: React.ReactNode;
  minPortal: "visitante" | "pre_iniciada" | "iniciada" | "admin";
}

const FERRAMENTAS: Ferramenta[] = [
  {
    id: "big5",
    nome: "Big 5",
    descricao: "Avaliação de personalidade baseada nos cinco grandes fatores psicológicos.",
    rota: "/salas/big5",
    icone: <Brain className="w-6 h-6" />,
    minPortal: "pre_iniciada",
  },
  {
    id: "eneagrama",
    nome: "Eneagrama",
    descricao: "Mapeamento de tipos de personalidade e padrões de comportamento.",
    rota: "/salas/eneagrama",
    icone: <Target className="w-6 h-6" />,
    minPortal: "pre_iniciada",
  },
  {
    id: "oraculo-perguntas",
    nome: "Oráculo das Perguntas",
    descricao: "Perguntas poderosas para facilitar reflexões profundas em sessões.",
    rota: "/salas/oraculo-perguntas",
    icone: <MessageCircleQuestion className="w-6 h-6" />,
    minPortal: "pre_iniciada",
  },
  {
    id: "mapa-oracula",
    nome: "Mapa Orácula",
    descricao: "Integração simbólica dos dados de Big5 e Eneagrama para insights profundos.",
    rota: "/salas/mapa-oracula",
    icone: <Sparkles className="w-6 h-6" />,
    minPortal: "pre_iniciada",
  },
];

const PORTAL_HIERARCHY: Record<string, number> = {
  visitante: 0,
  pre_iniciada: 1,
  iniciada: 2,
  admin: 3,
};

export default function Salas() {
  const { user, canAccess } = useAuth();
  const navigate = useNavigate();

  const userPortalLevel = user?.portal ? PORTAL_HIERARCHY[user.portal] : 0;

  const canAccessFerramenta = (ferramenta: Ferramenta): boolean => {
    const minLevel = PORTAL_HIERARCHY[ferramenta.minPortal];
    return userPortalLevel >= minLevel;
  };

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
          {FERRAMENTAS.map((ferramenta) => {
            const isAccessible = canAccessFerramenta(ferramenta);
            return (
              <Card
                key={ferramenta.id}
                className={`glass transition-all cursor-pointer ${
                  isAccessible
                    ? "hover:border-gold/50 hover:shadow-gold/10 hover:shadow-lg"
                    : "opacity-60"
                }`}
                onClick={() => {
                  if (isAccessible) {
                    navigate(ferramenta.rota);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      isAccessible ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ferramenta.icone}
                  </div>
                  <CardTitle className="text-lg">{ferramenta.nome}</CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {isAccessible ? ferramenta.descricao : "Disponível a partir do portal Pré-Iniciada"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
