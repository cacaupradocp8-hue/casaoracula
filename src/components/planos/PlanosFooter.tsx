export function PlanosFooter() {
  return (
    <footer className="py-16 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/15" />
        <span className="text-gold/50 text-xs">✦</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/30" />
      </div>
      <p className="text-xs text-muted-foreground/70 max-w-md mx-auto px-6 leading-relaxed">
        Conteúdo simbólico e formativo. Não substitui acompanhamento psicológico, supervisão clínica ou atendimento de saúde mental.
      </p>
    </footer>
  );
}
