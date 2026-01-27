import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  ArrowRight,
  Brain,
  Map,
  Wrench,
  Target,
  Castle,
  Layers,
  Users,
  Triangle,
  Compass,
  Sparkles,
  Eye,
  BookOpen,
  Lightbulb,
  Heart,
  Flame,
  Mountain,
  Flower2,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map of known Lucide icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Map,
  Wrench,
  Target,
  Castle,
  Layers,
  Users,
  Triangle,
  Compass,
  Sparkles,
  Eye,
  BookOpen,
  Lightbulb,
  Heart,
  Flame,
  Mountain,
  Flower2,
  Scale,
  // lowercase variants
  brain: Brain,
  map: Map,
  wrench: Wrench,
  target: Target,
  castle: Castle,
  layers: Layers,
  users: Users,
  triangle: Triangle,
  compass: Compass,
  sparkles: Sparkles,
  eye: Eye,
  bookOpen: BookOpen,
  lightbulb: Lightbulb,
  heart: Heart,
  flame: Flame,
  mountain: Mountain,
  flower2: Flower2,
  scale: Scale,
};

// Helper to render icon - either from map or as emoji
function renderIcon(icone: string | null, className?: string) {
  if (!icone) return "🔧";
  
  const IconComponent = ICON_MAP[icone];
  if (IconComponent) {
    return <IconComponent className={cn("w-5 h-5", className)} />;
  }
  
  // Return as emoji/text if not in map
  return icone;
}

// Label mappings for display
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

export interface FerramentaCardData {
  id: string;
  nome: string;
  icone: string | null;
  tipo: string | null;
  finalidade: string | null;
  origem: string | null;
  rota: string | null;
  acessivel: boolean;
  portalMinimo?: string;
}

interface FerramentaCardProps {
  ferramenta: FerramentaCardData;
  onClick: () => void;
  colorScheme?: 'gold' | 'purple' | 'emerald' | 'rose';
}

const colorSchemes = {
  gold: {
    icon: 'bg-gold/20 text-gold',
    badge: 'bg-gold/10 text-gold border-gold/30',
    hover: 'hover:border-gold/50 hover:shadow-gold',
    text: 'group-hover:text-gold',
  },
  purple: {
    icon: 'bg-purple-500/20 text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    hover: 'hover:border-purple-500/50 hover:shadow-purple-500/20',
    text: 'group-hover:text-purple-400',
  },
  emerald: {
    icon: 'bg-emerald-500/20 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    hover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20',
    text: 'group-hover:text-emerald-400',
  },
  rose: {
    icon: 'bg-rose-500/20 text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    hover: 'hover:border-rose-500/50 hover:shadow-rose-500/20',
    text: 'group-hover:text-rose-400',
  },
};

export function FerramentaCard({ ferramenta, onClick, colorScheme = 'gold' }: FerramentaCardProps) {
  const { nome, icone, tipo, finalidade, origem, acessivel, portalMinimo } = ferramenta;
  const colors = colorSchemes[colorScheme];

  const tipoLabel = tipo ? TIPO_LABELS[tipo] || tipo : null;
  const origemLabel = origem ? ORIGEM_LABELS[origem] || origem : null;

  return (
    <Card
      className={cn(
        "group transition-all duration-300 cursor-pointer",
        acessivel && colors.hover,
        !acessivel && "opacity-60 cursor-not-allowed"
      )}
      onClick={() => acessivel && onClick()}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          {/* Icon + Type Badge */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0",
                acessivel ? colors.icon : "bg-muted text-muted-foreground"
              )}
            >
              {acessivel ? renderIcon(icone) : <Lock className="w-5 h-5" />}
            </div>
            {tipoLabel && acessivel && (
              <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", colors.badge)}>
                {tipoLabel}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        {/* Tool Name */}
        <CardTitle
          className={cn(
            "text-base leading-tight",
            acessivel && colors.text,
            "transition-colors"
          )}
        >
          {nome}
        </CardTitle>

        {/* Purpose (1 line) */}
        <CardDescription className="text-sm line-clamp-2">
          {acessivel
            ? (finalidade || "Ferramenta simbólica do método")
            : `Disponível a partir do portal ${portalMinimo?.replace("_", "-") || "superior"}`}
        </CardDescription>

        {/* Origin Badge + CTA */}
        <div className="flex items-center justify-between pt-2">
          {acessivel && origemLabel ? (
            <span className="text-[10px] text-muted-foreground/70">{origemLabel}</span>
          ) : (
            <span />
          )}
          
          {acessivel && (
            <Button variant="ghost" size="sm" className={cn("h-7 px-2 gap-1", colors.text)}>
              Abrir
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
