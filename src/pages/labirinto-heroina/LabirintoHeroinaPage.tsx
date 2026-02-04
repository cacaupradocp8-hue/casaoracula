import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Home, ChevronRight, Loader2, 
  Compass, Moon, Sparkles, Feather, Flame,
  History, BookOpen
} from "lucide-react";
import { useLabirintoHeroinaData, useLabirintoHeroinaRegistros } from "@/hooks/useLabirintoHeroina";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { FasesLayer } from "./components/FasesLayer";
import { ArquetiposLayer } from "./components/ArquetiposLayer";
import { MetaforasLayer } from "./components/MetaforasLayer";
import { RituaisLayer } from "./components/RituaisLayer";
import { LabirintoHeroinaIntro } from "./components/LabirintoHeroinaIntro";

const LABIRINTO_HEROINA_INTRO_KEY = "labirinto-heroina-intro-seen";

export default function LabirintoHeroinaPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fases, arquetipos, metaforas, rituais, isLoading } = useLabirintoHeroinaData();
  const { data: registros } = useLabirintoHeroinaRegistros();
  const [showIntro, setShowIntro] = useState(() => {
    const seen = localStorage.getItem(LABIRINTO_HEROINA_INTRO_KEY);
    return seen !== "true";
  });

  const handleEnter = () => {
    localStorage.setItem(LABIRINTO_HEROINA_INTRO_KEY, "true");
    setShowIntro(false);
  };

  if (showIntro) {
    return <LabirintoHeroinaIntro onEnter={handleEnter} />;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/ferramentas-metodo')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às Ferramentas do Método
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/ferramentas-metodo" className="hover:text-foreground transition-colors">
            Ferramentas do Método
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Labirinto da Heroína Interna®</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Compass className="w-10 h-10 text-gold" />
            <h1 className="font-display text-3xl md:text-4xl text-gold">
              O Labirinto da Heroína Interna®
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ecossistema simbólico modular para navegação do processo de individuação feminina.
            Quatro camadas sistêmicas que se entrelaçam.
          </p>
        </div>

        {/* Layer Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LayerCard
            icon={<Moon className="w-6 h-6" />}
            title="Fases"
            count={fases.length}
            description="Estágios da travessia"
          />
          <LayerCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Arquétipos"
            count={arquetipos.length}
            description="Forças regentes"
          />
          <LayerCard
            icon={<Feather className="w-6 h-6" />}
            title="Metáforas"
            count={metaforas.length}
            description="Espelhos simbólicos"
          />
          <LayerCard
            icon={<Flame className="w-6 h-6" />}
            title="Rituais"
            count={rituais.length}
            description="Práticas de integração"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="fases" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-1 bg-muted/50">
            <TabsTrigger value="fases" className="gap-2">
              <Moon className="w-4 h-4" />
              Fases
            </TabsTrigger>
            <TabsTrigger value="arquetipos" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Arquétipos
            </TabsTrigger>
            <TabsTrigger value="metaforas" className="gap-2">
              <Feather className="w-4 h-4" />
              Metáforas
            </TabsTrigger>
            <TabsTrigger value="rituais" className="gap-2">
              <Flame className="w-4 h-4" />
              Rituais
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fases">
            <FasesLayer fases={fases} />
          </TabsContent>

          <TabsContent value="arquetipos">
            <ArquetiposLayer arquetipos={arquetipos} />
          </TabsContent>

          <TabsContent value="metaforas">
            <MetaforasLayer metaforas={metaforas} />
          </TabsContent>

          <TabsContent value="rituais">
            <RituaisLayer rituais={rituais} />
          </TabsContent>

          <TabsContent value="historico">
            <HistoricoTab registros={registros || []} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Layer Card Component
function LayerCard({ 
  icon, 
  title, 
  count, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  count: number; 
  description: string;
}) {
  return (
    <Card className="border-gold/20 bg-card/50 hover:bg-card/80 transition-colors">
      <CardContent className="p-4 text-center">
        <div className="text-gold mb-2">{icon}</div>
        <div className="font-display text-lg text-foreground">{title}</div>
        <div className="text-2xl font-bold text-gold">{count}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
    </Card>
  );
}

// Historico Tab
function HistoricoTab({ registros }: { registros: any[] }) {
  if (registros.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Você ainda não tem registros neste labirinto.</p>
          <p className="text-sm mt-2">
            Navegue pelas camadas e explore o ecossistema simbólico.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {registros.map((registro) => (
        <Card key={registro.id} className="border-gold/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  {new Date(registro.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Modo: {registro.modo_uso}
                </div>
              </div>
              {registro.sintese_final && (
                <BookOpen className="w-4 h-4 text-gold" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
