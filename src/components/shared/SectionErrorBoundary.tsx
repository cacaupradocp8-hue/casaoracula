import React from 'react';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName?: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class SectionErrorBoundary extends React.Component<SectionErrorBoundaryProps, SectionErrorBoundaryState> {
  state: SectionErrorBoundaryState = { hasError: false, errorMessage: null };

  static getDerivedStateFromError(error: Error): SectionErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Erro inesperado.' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[section-error-boundary][${this.props.sectionName || 'unknown'}]`, error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[40vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-border/30 bg-card/50 p-6 text-center space-y-4">
          <h2 className="text-lg font-semibold text-foreground/80">
            {this.props.sectionName ? `Erro em ${this.props.sectionName}` : 'Algo saiu do caminho'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {this.state.errorMessage}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, errorMessage: null })}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
}
