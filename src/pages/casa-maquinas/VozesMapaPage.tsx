import { Link } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CasaMaquinasSidebar } from '@/components/casa-maquinas/CasaMaquinasSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, MapPin, Wrench, HelpCircle, ArrowRight } from 'lucide-react';
import { VOZES, type Voz } from '@/data/vozes';
import { useUserVoz } from '@/hooks/useUserVoz';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function VozCard({ voz, isActive, isPrimaria, isApoio, isSelected, onSelect }: {
  voz: Voz;
  isActive: boolean;
  isPrimaria: boolean;
  isApoio: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const hsl = `hsl(${voz.cor})`;

  return (
    <motion.button
      layout
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all relative overflow-hidden group",
        isSelected
          ? "border-primary/30 bg-card/80 shadow-lg"
          : "border-border/15 bg-card/30 hover:border-border/30 hover:bg-card/50"
      )}
    >
      {/* Active/primary/apoio badge */}
      {(isPrimaria || isApoio) && (
        <span className={cn(
          "absolute top-3 right-3 text-[9px] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full",
          isPrimaria ? "bg-gold/15 text-gold border border-gold/20" : "bg-primary/10 text-primary/70 border border-primary/15"
        )}>
          {isPrimaria ? '✦ Primária' : 'Apoio'}
        </span>
      )}

      <div className="flex items-start gap-3.5">
        {/* Color indicator */}
        <div
          className={cn(
            "w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-all mt-0.5",
            isSelected ? "ring-2 ring-offset-2 ring-offset-background" : ""
          )}
          style={{
            backgroundColor: isSelected ? hsl : `${hsl}`,
            opacity: isSelected ? 1 : 0.7,
            // ring color set via inline style on parent
          }}
          style-ring-color={hsl}
        >
          {/* Override ring color */}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-all mt-0.5 absolute inset-0",
          )}
          }}
        >
          <span className="text-white text-xs font-bold">
            {voz.nome.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-display text-sm font-semibold transition-colors",
            isSelected ? "text-foreground" : "text-foreground/70"
          )}>
            {voz.nome}
          </h3>
          <p className="text-[11px] text-muted-foreground/60 italic mt-0.5 line-clamp-1">
            {voz.frase}
          </p>
          <p className="text-[10px] text-muted-foreground/40 mt-1">
            {voz.arquetipoCentral}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function VozDetailPanel({ voz, isPrimaria, isApoio }: {
  voz: Voz;
  isPrimaria: boolean;
  isApoio: boolean;
}) {
  const hsl = `hsl(${voz.cor})`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border/20 bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/10" style={{ background: `linear-gradient(135deg, ${voz.corHex}08, transparent 60%)` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: hsl }} />
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">{voz.nome}</h2>
            {(isPrimaria || isApoio) && (
              <span className={cn(
                "text-[10px] uppercase tracking-widest",
                isPrimaria ? "text-gold" : "text-primary/60"
              )}>
                {isPrimaria ? '✦ Sua voz primária' : '◇ Sua voz de apoio'}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-foreground/70 italic">{voz.frase}</p>
      </div>

      {/* Content sections */}
      <div className="p-5 space-y-5">
        {/* Função */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1.5">Função Psicológica</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{voz.funcaoPsicologica}</p>
        </div>

        {/* Forma de condução */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-1.5">Forma de Condução</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{voz.formaConducao}</p>
        </div>

        {/* Distritos */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3 h-3 text-muted-foreground/40" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Distritos</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {voz.distritos.map(d => (
              <span key={d} className="px-2.5 py-1 rounded-lg text-[11px] border border-border/20 bg-background/50 text-foreground/70">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Ferramentas */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Wrench className="w-3 h-3 text-muted-foreground/40" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Ferramentas</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {voz.ferramentas.map(f => (
              <span key={f} className="px-2.5 py-1 rounded-lg text-[11px] border border-primary/15 bg-primary/5 text-primary/70">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Perguntas clínicas */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <HelpCircle className="w-3 h-3 text-muted-foreground/40" />
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">Perguntas Clínicas</p>
          </div>
          <ul className="space-y-1.5">
            {voz.perguntasClinicas.map((p, i) => (
              <li key={i} className="text-[12px] text-foreground/70 pl-3 border-l-2 py-0.5" style={{ borderColor: `${voz.corHex}40` }}>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Estilo de sessão e tipo de cliente */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-background/50 border border-border/10">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 mb-1">Estilo de Sessão</p>
            <p className="text-[11px] text-foreground/70">{voz.estiloSessao}</p>
          </div>
          <div className="p-3 rounded-lg bg-background/50 border border-border/10">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground/40 mb-1">Tipo de Cliente</p>
            <p className="text-[11px] text-foreground/70">{voz.tipoCliente}</p>
          </div>
        </div>

        {/* Sombra e riscos */}
        <div className="p-3 rounded-lg border border-destructive/10 bg-destructive/[0.03]">
          <p className="text-[9px] uppercase tracking-widest text-destructive/50 mb-1.5">⚠ Sombra Possível</p>
          <p className="text-[11px] text-foreground/60 mb-2">{voz.sombraPossivel}</p>
          <p className="text-[9px] uppercase tracking-widest text-destructive/50 mb-1">Riscos Clínicos</p>
          <p className="text-[11px] text-foreground/60">{voz.riscosClinicos}</p>
        </div>

        {/* CTA */}
        <Link to={`/casa-das-maquinas/7-vozes/${voz.id}`}>
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs mt-1">
            Ver página completa <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function VozesMapaPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const { voz_primaria, voz_apoio, loading } = useUserVoz();
  const selectedVoz = VOZES.find(v => v.id === selected);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <CasaMaquinasSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <Link to="/casa-das-maquinas/7-vozes">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                  Mapa das 7 Vozes
                </h1>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Selecione uma voz para explorar sua função, ferramentas e distritos
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded-lg border border-border/10 bg-card/20 text-[10px] text-muted-foreground/50">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold" /> Sua voz primária
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary/50" /> Voz de apoio
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Clique para explorar
              </span>
            </div>

            {/* Main content */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Voice list */}
              <div className="w-full lg:w-[340px] xl:w-[380px] space-y-2 shrink-0">
                {VOZES.map(voz => (
                  <VozCard
                    key={voz.id}
                    voz={voz}
                    isActive={voz.id === (voz_primaria || voz_apoio)}
                    isPrimaria={voz.id === voz_primaria}
                    isApoio={voz.id === voz_apoio}
                    isSelected={voz.id === selected}
                    onSelect={() => setSelected(prev => prev === voz.id ? null : voz.id)}
                  />
                ))}
              </div>

              {/* Detail panel */}
              <div className="flex-1 lg:sticky lg:top-8 w-full min-w-0">
                <AnimatePresence mode="wait">
                  {selectedVoz ? (
                    <VozDetailPanel
                      key={selectedVoz.id}
                      voz={selectedVoz}
                      isPrimaria={selectedVoz.id === voz_primaria}
                      isApoio={selectedVoz.id === voz_apoio}
                    />
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border/15 bg-card/10"
                    >
                      <Sparkles className="w-8 h-8 text-muted-foreground/20 mb-4" />
                      <p className="text-sm text-muted-foreground/40 font-display">
                        Selecione uma voz ao lado
                      </p>
                      <p className="text-xs text-muted-foreground/30 mt-1 max-w-xs">
                        Explore a função, ferramentas, distritos e perguntas clínicas de cada voz do Método Orácula
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
