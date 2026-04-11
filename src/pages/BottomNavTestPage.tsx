import { BottomNavPreview } from '@/components/layout/BottomNavPreview';

export default function BottomNavTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6">
      <h1 className="font-display text-2xl text-gold mb-4 text-center">
        Preview do Bottom Nav
      </h1>
      <p className="text-foreground/70 text-sm text-center max-w-md mb-8">
        Este é o menu flutuante com indicador animado. Toque nos ícones para ver a animação.
        Só aparece no mobile (abaixo de 768px).
      </p>
      <div className="text-foreground/40 text-xs text-center">
        Reduza a tela para visualizar no mobile.
      </div>

      <BottomNavPreview />
    </div>
  );
}