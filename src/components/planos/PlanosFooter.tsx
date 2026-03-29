export function PlanosFooter() {
  return (
    <footer className="py-16 text-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/15" />
        <span className="text-gold/20 text-xs">✦</span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/15" />
      </div>
      <p className="text-xs text-muted-foreground/40 max-w-md mx-auto px-6 leading-relaxed">
        O plano permite o uso do sistema. A condução simbólica depende do nível de formação.
      </p>
    </footer>
  );
}
