import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';

interface NavAula {
  id: string;
  titulo?: string;
}

interface ParentInfo {
  type: 'travessia' | 'portal';
  id: string;
  titulo: string;
  slug?: string;
}

interface AulaNavigationBlockProps {
  prevAula: NavAula | null;
  nextAula: NavAula | null;
  parentInfo: ParentInfo | null;
  isTravessiaZero: boolean;
  isNextLocked: boolean;
  onNavigate: (path: string) => void;
}

export function AulaNavigationBlock({
  prevAula,
  nextAula,
  parentInfo,
  isTravessiaZero,
  isNextLocked,
  onNavigate,
}: AulaNavigationBlockProps) {
  const goBack = () => {
    if (prevAula) {
      onNavigate(`/aulas/${prevAula.id}`);
    } else if (parentInfo?.type === 'travessia') {
      onNavigate(`/travessia/${parentInfo.slug}`);
    } else if (parentInfo) {
      onNavigate(`/portal/${parentInfo.id}`);
    } else {
      onNavigate('/travessias');
    }
  };

  const goForward = () => {
    if (nextAula) {
      onNavigate(`/aulas/${nextAula.id}`);
    } else if (parentInfo?.type === 'travessia') {
      onNavigate(`/travessia/${parentInfo.slug}`);
    } else if (parentInfo) {
      onNavigate(`/portal/${parentInfo.id}`);
    } else {
      onNavigate('/travessias');
    }
  };

  return (
    <div className="flex justify-between">
      <Button variant="outline" onClick={goBack} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        {prevAula ? 'Aula Anterior' : 'Voltar'}
      </Button>

      {nextAula ? (
        isNextLocked ? (
          <Button variant="outline" disabled className="gap-2 opacity-60 cursor-not-allowed">
            <Lock className="w-4 h-4" />
            Próxima Aula Bloqueada
          </Button>
        ) : (
          <Button variant="gold" onClick={() => onNavigate(`/aulas/${nextAula.id}`)} className="gap-2">
            Próxima Aula
            <ArrowRight className="w-4 h-4" />
          </Button>
        )
      ) : (
        <Button variant="outline" onClick={goForward} className="gap-2">
          Concluir Travessia
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
