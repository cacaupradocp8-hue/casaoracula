import { Compass } from 'lucide-react';
import { SymbolicTemplateList } from '@/components/templates/SymbolicTemplateList';

export default function EnneagramTemplateList() {
  return (
    <SymbolicTemplateList
      templateType="enneagram"
      title="Eneagrama – Auto-Observação Simbólica"
      subtitle="Template de reflexão sobre padrões emocionais e defesas"
      description="Espaço para auto-observação e exploração simbólica dos padrões do Eneagrama. Este instrumento NÃO atribui ou calcula tipos. O foco está na reflexão e na consciência, não na identificação ou classificação."
      icon={<Compass className="w-5 h-5" />}
      editorPath="/templates/enneagram"
      backPath="/ferramentas"
    />
  );
}
