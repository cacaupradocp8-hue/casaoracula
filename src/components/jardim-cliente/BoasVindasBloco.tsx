import { Leaf } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function getSaudacao(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

const FRASES = [
  'Este é o seu espaço. Sem pressa.',
  'O Jardim te espera, no seu tempo.',
  'Um lugar para guardar o que importa.',
  'Cada registro é uma semente.',
  'Respire. Observe. Registre se quiser.',
];

export function BoasVindasBloco() {
  const { user } = useAuth();
  const nome = user?.user_metadata?.nome || user?.email?.split('@')[0] || '';
  const frase = FRASES[new Date().getDate() % FRASES.length];

  return (
    <div className="text-center space-y-3 py-6">
      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
        <Leaf className="w-6 h-6 text-emerald-500/60" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">
          {getSaudacao()}{nome ? `, ${nome}` : ''}
        </p>
        <p className="text-xs text-muted-foreground/60 italic mt-1">{frase}</p>
      </div>
    </div>
  );
}
