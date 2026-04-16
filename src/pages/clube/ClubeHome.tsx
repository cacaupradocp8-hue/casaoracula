import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { ClubeOferta } from '@/components/clube/ClubeOferta';
import { ClubeHomePage } from '@/components/clube-livro/ClubeHomePage';

export default function ClubeHome() {
  const { canAccess } = useEffectivePortal();

  if (!canAccess('mentorada')) {
    return <ClubeOferta />;
  }

  return <ClubeHomePage />;
}
