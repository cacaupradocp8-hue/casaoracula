import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BootSafeBoundaryProps {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
}

interface BootSafeBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export class BootSafeBoundary extends React.Component<BootSafeBoundaryProps, BootSafeBoundaryState> {
  state: BootSafeBoundaryState = {
    hasError: false,
    errorMessage: null,
  };

  static getDerivedStateFromError(error: Error): BootSafeBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Erro inesperado de renderização.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[boot-safe-boundary:${this.props.label}]`, error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.compact) {
      return (
        <div className="mx-auto my-2 flex w-full items-center justify-between gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Falha em {this.props.label}: {this.state.errorMessage}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </div>
      );
    }

    return (
      <div className="mx-auto my-6 w-full max-w-2xl rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
        <div className="mb-2 flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4" />
          <span>Falha ao carregar: {this.props.label}</span>
        </div>
        <p className="text-sm opacity-90">{this.state.errorMessage}</p>
        <Button size="sm" variant="outline" className="mt-3" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }
}
