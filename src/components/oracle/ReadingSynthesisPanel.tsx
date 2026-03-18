import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, MapPin, Sparkles, Wrench, HelpCircle } from 'lucide-react';
import { OracleCard } from '@/types/oracle';
import { cn } from '@/lib/utils';

interface ReadingSynthesisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cards: (OracleCard & Record<string, any>)[];
  primaryColor?: string;
}

function analyzeCards(cards: (OracleCard & Record<string, any>)[]) {
  // Count familia (archetype) occurrences
  const familiaCount: Record<string, number> = {};
  const elementoCount: Record<string, number> = {};
  
  cards.forEach(card => {
    if (card.familia) {
      familiaCount[card.familia] = (familiaCount[card.familia] || 0) + 1;
    }
    if (card.elemento) {
      elementoCount[card.elemento] = (elementoCount[card.elemento] || 0) + 1;
    }
  });

  const dominantArchetype = Object.entries(familiaCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const dominantElement = Object.entries(elementoCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Detect patterns
  const patterns: string[] = [];
  if (Object.keys(familiaCount).length === 1 && cards.length > 1) {
    patterns.push(`Todas as cartas pertencem à mesma família: ${dominantArchetype}. Indica foco intenso neste território.`);
  }
  if (Object.keys(familiaCount).length === cards.length && cards.length > 2) {
    patterns.push('Cada carta vem de uma família diferente. Diversidade de territórios convocados.');
  }

  // Generate clinical question
  const questions = [
    dominantArchetype ? `O que a presença de "${dominantArchetype}" está pedindo para ser visto?` : null,
    cards.length > 1 ? 'Que fio invisível conecta estas cartas entre si?' : null,
    'O que se repete na vida que este espelho está mostrando?',
  ].filter(Boolean);

  return {
    dominantArchetype,
    dominantElement,
    patterns,
    clinicalQuestion: questions[0] || 'O que precisa ser escutado agora?',
    uniqueFamilies: Object.keys(familiaCount),
    uniqueElements: Object.keys(elementoCount),
  };
}

export function ReadingSynthesisPanel({
  isOpen,
  onClose,
  cards,
  primaryColor = 'hsl(var(--gold))',
}: ReadingSynthesisPanelProps) {
  const analysis = analyzeCards(cards);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-card border-l border-border/10 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-display text-foreground tracking-wide">
                  Síntese da Leitura
                </h2>
                <button onClick={onClose} className="text-muted-foreground/50 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Dominant Archetype */}
                {analysis.dominantArchetype && (
                  <SynthesisBlock
                    icon={<Sparkles className="w-4 h-4" />}
                    label="Arquétipo Dominante"
                    value={analysis.dominantArchetype}
                    primaryColor={primaryColor}
                  />
                )}

                {/* Dominant Element / District */}
                {analysis.dominantElement && (
                  <SynthesisBlock
                    icon={<MapPin className="w-4 h-4" />}
                    label="Elemento Predominante"
                    value={analysis.dominantElement}
                    primaryColor={primaryColor}
                  />
                )}

                {/* Families present */}
                {analysis.uniqueFamilies.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-3">
                      Territórios Convocados
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.uniqueFamilies.map(f => (
                        <span
                          key={f}
                          className="text-xs px-3 py-1.5 rounded-full bg-card border border-border/20 text-foreground/70"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Patterns */}
                {analysis.patterns.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-3">
                      Padrão Percebido
                    </p>
                    {analysis.patterns.map((p, i) => (
                      <p key={i} className="text-sm text-foreground/70 leading-relaxed mb-2">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

                {/* Bússola da Cartógrafa */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Compass className="w-4 h-4 text-gold/60" />
                    <h3 className="text-sm font-display text-foreground tracking-wide">
                      Bússola da Cartógrafa
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-background/50 border border-border/10">
                      <p className="text-xs text-muted-foreground/60 mb-1">Pergunta Clínica</p>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">
                        "{analysis.clinicalQuestion}"
                      </p>
                    </div>

                    {analysis.dominantArchetype && (
                      <div className="p-4 rounded-xl bg-background/50 border border-border/10">
                        <p className="text-xs text-muted-foreground/60 mb-1">Território a Explorar</p>
                        <p className="text-sm text-foreground/80">
                          {analysis.dominantArchetype}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cards summary */}
                <div>
                  <p className="text-xs text-muted-foreground/60 tracking-widest uppercase mb-3">
                    Cartas da Leitura
                  </p>
                  <div className="space-y-2">
                    {cards.map((card, i) => (
                      <div key={card.id} className="flex items-center gap-3">
                        <span className="text-xs text-gold/40 w-5">{i + 1}.</span>
                        {card.main_image_url ? (
                          <img
                            src={card.main_image_url}
                            alt={card.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-8 h-12 rounded bg-card flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-gold/30" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">{card.title}</p>
                          {card.familia && (
                            <p className="text-xs text-muted-foreground/50">{card.familia}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SynthesisBlock({
  icon,
  label,
  value,
  primaryColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  primaryColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: `${primaryColor}15` }}
      >
        <span style={{ color: primaryColor }}>{icon}</span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground/60 tracking-widest uppercase">{label}</p>
        <p className="text-base font-display text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}
