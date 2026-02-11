import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Home, ChevronRight, Loader2, 
  Scroll, User, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { useMapaHeroina } from "@/hooks/useMapaHeroina";
import { MapaPessoalView } from "./components/MapaPessoalView";
import { MapaProfissionalView } from "./components/MapaProfissionalView";
import { MapaPDFGenerator } from "./components/MapaPDFGenerator";
import { toast } from "sonner";

type MapaModo = "pessoal" | "profissional";

export default function MapaHeroinaPage() {
  const navigate = useNavigate();
  const { data: mapa, isLoading } = useMapaHeroina();
  const [modo, setModo] = useState<MapaModo>("pessoal");
  const [showPDFModal, setShowPDFModal] = useState(false);

  const handleNovaTravessia = () => {
    navigate("/labirinto-heroina");
    toast.info("Iniciando nova travessia no Labirinto...");
  };

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
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/labirinto-heroina')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Labirinto
        </Button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/jornada" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" />
            Casa
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/labirinto-heroina" className="hover:text-foreground transition-colors">
            Labirinto da Heroína
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gold">Mapa Pessoal</span>
        </nav>

        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Scroll className="w-10 h-10 text-gold" />
            <h1 className="font-display text-3xl md:text-4xl text-gold">
              Mapa Pessoal da Heroína®
            </h1>
          </motion.div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sua mandala viva da travessia. Aqui se entrelaçam as 4 camadas do Labirinto: 
            a Fase que você habita, o Arquétipo que a guia, o Cenário que reflete sua psique 
            e o Ritual que ancora seu gesto.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-3">
          <Button
            variant={modo === "pessoal" ? "default" : "outline"}
            onClick={() => setModo("pessoal")}
            className={modo === "pessoal" 
              ? "bg-gold hover:bg-gold/90 text-gold-foreground gap-2" 
              : "border-gold/30 text-gold hover:bg-gold/10 gap-2"
            }
          >
            <User className="w-4 h-4" />
            Travessia Pessoal
          </Button>
          <Button
            variant={modo === "profissional" ? "default" : "outline"}
            onClick={() => setModo("profissional")}
            className={modo === "profissional"
              ? "bg-purple-600 hover:bg-purple-600/90 text-white gap-2"
              : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 gap-2"
            }
          >
            <Briefcase className="w-4 h-4" />
            Condução Profissional
          </Button>
        </div>

        {/* Content by Mode */}
        {modo === "pessoal" && mapa ? (
          <MapaPessoalView
            mapa={mapa}
            onGeneratePDF={() => setShowPDFModal(true)}
            onNovaTravessia={handleNovaTravessia}
          />
        ) : modo === "profissional" && mapa ? (
          <MapaProfissionalView
            mapa={mapa}
            onGeneratePDF={() => setShowPDFModal(true)}
          />
        ) : null}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50 pt-8">
          ✧ O Mapa Pessoal da Heroína® é um espelho vivo da sua travessia ✧
        </p>

        {/* PDF Generator Modal */}
        {showPDFModal && mapa && (
          <MapaPDFGenerator
            open={showPDFModal}
            onOpenChange={setShowPDFModal}
            mapa={mapa}
            insights=""
          />
        )}
      </div>
    </AppLayout>
  );
}
