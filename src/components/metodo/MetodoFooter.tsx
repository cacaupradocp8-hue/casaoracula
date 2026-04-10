export function MetodoFooter() {
  return (
    <footer className="py-12 border-t border-border/30">
      <div className="text-center space-y-3">
        <p className="text-foreground/70 text-xs">
          Casa Orácula © {new Date().getFullYear()}
        </p>
        <p className="text-muted-foreground/70 text-xs max-w-md mx-auto leading-relaxed">
          A Casa Orácula não substitui terapia, acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </div>
    </footer>
  );
}
