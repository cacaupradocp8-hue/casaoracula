// ============================================
// SELEÇÃO DE CARTA/PORTA — LABIRINTO PRÁTICO
// Grid de cartas clicáveis para iniciar a travessia
// ============================================

import { Card, CardContent } from "@/components/ui/card";
import type { LabirintoFase } from "@/hooks/useLabirintoHeroina";

interface PortaSelecaoProps {
  portas: LabirintoFase[];
  onSelect: (portaId: string) => void;
}

export function PortaSelecao({ portas, onSelect }: PortaSelecaoProps) {
  // Filtrar duplicatas por nome (manter apenas a primeira de cada nome)
  const portasUnicas = portas.reduce((acc, porta) => {
    if (!acc.find(p => p.nome === porta.nome)) {
      acc.push(porta);
    }
    return acc;
  }, [] as LabirintoFase[]);

  return (
    <div className="space-y-6">
      {/* Introdução */}
      <div className="text-center space-y-2">
        <h3 className="font-display text-xl text-gold">
          Escolha uma Porta da Jornada
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Cada porta representa uma fase do caminho. Clique para entrar e realizar o exercício correspondente.
        </p>
      </div>

      {/* Grid de Cartas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {portasUnicas.map((porta) => (
          <button
            key={porta.id}
            onClick={() => onSelect(porta.id)}
            className="text-left group"
          >
            <Card className="h-full border-gold/20 bg-card/50 hover:bg-card/80 hover:border-gold/40 transition-all duration-300 cursor-pointer group-hover:shadow-lg group-hover:shadow-gold/5">
              <CardContent className="p-6">
                {/* Ícone */}
                <div className="text-4xl mb-4 transition-transform group-hover:scale-110">
                  {porta.icone || "🌙"}
                </div>
                
                {/* Nome */}
                <h4 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
                  {porta.nome}
                </h4>
                
                {/* Subtítulo */}
                {porta.subtitulo && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {porta.subtitulo}
                  </p>
                )}

                {/* Indicador de ação */}
                <p className="text-xs text-gold/60 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Clique para atravessar →
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {portasUnicas.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Nenhuma porta configurada ainda.</p>
            <p className="text-sm mt-2">
              As cartas da jornada serão adicionadas pelo administrador.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
