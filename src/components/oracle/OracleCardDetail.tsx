import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Compass, Wrench } from 'lucide-react';
import { OracleCard } from '@/types/oracle';
import { cn } from '@/lib/utils';

interface OracleCardDetailProps {
  card: (OracleCard & Record<string, any>) | null;
  isOpen: boolean;
  onClose: () => void;
  positionName?: string;
  positionMeaning?: string;
  primaryColor?: string;
}

export function OracleCardDetail({
  card,
  isOpen,
  onClose,
  positionName,
  positionMeaning,
  primaryColor = 'hsl(var(--gold))',
}: OracleCardDetailProps) {
  if (!card) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 top-0 z-50 overflow-y-auto"
          >
            <div className="min-h-full flex items-start justify-center p-4 pt-16 pb-8">
              <div className="relative w-full max-w-md">
                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute -top-10 right-0 p-2 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Card Image */}
                <div className="relative mb-6">
                  {card.main_image_url ? (
                    <div className="relative mx-auto w-48 md:w-56">
                      <div
                        className="absolute -inset-4 rounded-2xl blur-2xl opacity-30"
                        style={{ background: primaryColor }}
                      />
                      <img
                        src={card.main_image_url}
                        alt={card.title}
                        className="relative w-full aspect-[2/3] object-cover rounded-xl ring-1 ring-white/10"
                      />
                    </div>
                  ) : (
                    <div
                      className="mx-auto w-48 md:w-56 aspect-[2/3] rounded-xl flex items-center justify-center ring-1 ring-white/10"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}05)` }}
                    >
                      <Sparkles className="w-12 h-12" style={{ color: primaryColor, opacity: 0.4 }} />
                    </div>
                  )}
                </div>

                {/* Position context */}
                {positionName && (
                  <div className="text-center mb-2">
                    <span
                      className="text-xs font-medium tracking-widest uppercase"
                      style={{ color: primaryColor }}
                    >
                      {positionName}
                    </span>
                    {positionMeaning && (
                      <p className="text-xs text-muted-foreground/60 mt-1 italic">
                        {positionMeaning}
                      </p>
                    )}
                  </div>
                )}

                {/* Title */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-display font-medium text-foreground tracking-wide">
                    {card.title}
                  </h2>
                  {card.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />

                {/* Content Sections */}
                <div className="space-y-8">
                  {/* Mensagem Simbólica */}
                  {card.short_message && (
                    <Section title="Mensagem Simbólica" icon="✦">
                      <p className="text-foreground/80 leading-relaxed italic">
                        "{card.short_message}"
                      </p>
                    </Section>
                  )}

                  {/* Pergunta Oracular */}
                  {card.reflection_questions_json && card.reflection_questions_json.length > 0 && (
                    <Section title="Pergunta Oracular" icon="◇">
                      <ul className="space-y-3">
                        {(card.reflection_questions_json as string[]).map((q, i) => (
                          <li key={i} className="text-foreground/70 leading-relaxed pl-4 border-l-2 border-gold/20">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {/* Leitura Profunda */}
                  {card.deep_reading && (
                    <Section title="Leitura Profunda" icon="❖">
                      <p className="text-foreground/70 leading-relaxed">
                        {card.deep_reading}
                      </p>
                    </Section>
                  )}

                  {/* Aplicação Terapêutica */}
                  {card.care_notes && (
                    <Section title="Aplicação Terapêutica" icon="⚕">
                      <p className="text-foreground/70 leading-relaxed">
                        {card.care_notes}
                      </p>
                    </Section>
                  )}

                  {/* Polaridades */}
                  {(card.polarity_light_text || card.polarity_shadow_text) && (
                    <div className="grid grid-cols-2 gap-4">
                      {card.polarity_light_text && (
                        <div className="p-4 rounded-xl bg-card/30 border border-gold/10">
                          <p className="text-xs font-medium text-gold/60 mb-2">✨ Luz</p>
                          <p className="text-sm text-foreground/70">{card.polarity_light_text}</p>
                        </div>
                      )}
                      {card.polarity_shadow_text && (
                        <div className="p-4 rounded-xl bg-card/30 border border-border/10">
                          <p className="text-xs font-medium text-muted-foreground/60 mb-2">🌑 Sombra</p>
                          <p className="text-sm text-foreground/70">{card.polarity_shadow_text}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ritual */}
                  {card.ritual_text && (
                    <Section title="Prática Sugerida" icon="🕯">
                      <p className="text-foreground/70 leading-relaxed">
                        {card.ritual_text}
                      </p>
                    </Section>
                  )}
                </div>

                {/* Footer metadata */}
                <div className="mt-10 pt-6 border-t border-border/10">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground/50">
                    {card.familia && (
                      <span className="flex items-center gap-1">
                        <Compass className="w-3 h-3" /> {card.familia}
                      </span>
                    )}
                    {card.elemento && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {card.elemento}
                      </span>
                    )}
                    {card.cor_principal && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: card.cor_principal }}
                        />
                        {card.cor_principal}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-gold/40 text-sm">{icon}</span>
        <h3 className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
