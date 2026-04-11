export function MetodoFooter() {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="text-center space-y-6">
        <p className="text-gold font-display text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-4 font-medium italic">
          A Casa Orácula forma mulheres capazes de atravessar, integrar e transmitir conhecimento simbólico com ética, aplicabilidade e maturidade psíquica.
        </p>
        <div className="space-y-2">
          <p className="text-foreground/80 text-xs">
            Casa Orácula © {new Date().getFullYear()}
          </p>
          <p className="text-foreground/60 text-xs max-w-md mx-auto leading-relaxed">
            A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
          </p>
        </div>
      </div>
    </footer>
  );
}
