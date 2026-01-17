import { Users } from 'lucide-react';
import { SymbolicTemplateList } from '@/components/templates/SymbolicTemplateList';

export default function ConstellationTemplateList() {
  return (
    <SymbolicTemplateList
      templateType="constellation"
      title="Constelação – Mapeamento Simbólico"
      subtitle="Template para observação sistêmica e fenomenológica"
      description="Espaço para registro de observações sistêmicas e insights fenomenológicos. Este instrumento NÃO oferece sugestões de resolução ou direção terapêutica. O foco está na observação pura e na escuta do campo."
      icon={<Users className="w-5 h-5" />}
      editorPath="/templates/constellation"
      backPath="/ferramentas"
    />
  );
}
