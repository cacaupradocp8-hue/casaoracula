import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuadranteItem {
  nome: string;
  icone: string;
  data?: string | null;
  anotacao?: string | null;
  status?: "ativa" | "realizado" | "contemplado";
}

interface MapaMandalaQuadranteProps {
  titulo: string;
  subtitulo: string;
  icone: React.ReactNode;
  corAccent: string;
  item: QuadranteItem | null;
  total: number;
}

export function MapaMandalaQuadrante({
  titulo,
  subtitulo,
  icone,
  corAccent,
  item,
  total,
}: MapaMandalaQuadranteProps) {
  const formatData = (data: string | null | undefined) => {
    if (!data) return null;
    try {
      return format(new Date(data), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-gold/20 h-full",
        "bg-gradient-to-br",
        corAccent
      )}>
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute top-2 right-2 text-gold/20 text-2xl">✧</div>
        </div>
        
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              {icone}
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gold/70">
                {titulo}
              </h4>
              <p className="text-sm font-display text-foreground">
                {subtitulo}
              </p>
            </div>
          </div>

          {/* Content */}
          {item ? (
            <div className="bg-background/30 rounded-lg p-4 border border-gold/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{item.icone}</span>
                <div className="flex-1">
                  <p className="font-display text-lg text-foreground">
                    {item.nome}
                  </p>
                  {item.data && (
                    <p className="text-xs text-muted-foreground">
                      {formatData(item.data)}
                    </p>
                  )}
                </div>
                {item.status && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    item.status === "ativa" && "bg-blue-500/20 text-blue-300",
                    item.status === "realizado" && "bg-amber-500/20 text-amber-300",
                    item.status === "contemplado" && "bg-emerald-500/20 text-emerald-300"
                  )}>
                    {item.status === "ativa" && "Ativa"}
                    {item.status === "realizado" && "✓ Selado"}
                    {item.status === "contemplado" && "Sentido"}
                  </span>
                )}
              </div>
              
              {item.anotacao && (
                <div className="border-t border-gold/10 pt-3 mt-3">
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    "{item.anotacao}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-background/20 rounded-lg p-4 border border-dashed border-gold/20 text-center">
              <p className="text-sm text-muted-foreground/70 italic">
                Nenhum registro ainda
              </p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                Explore esta camada no Labirinto
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/60 pt-2 border-t border-gold/10">
            <span>Total de registros</span>
            <span className="font-medium text-gold/70">{total}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
