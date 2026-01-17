import { Brain } from 'lucide-react';
import { SymbolicTemplateList } from '@/components/templates/SymbolicTemplateList';

export default function Big5TemplateList() {
  return (
    <SymbolicTemplateList
      templateType="big5"
      title="Big Five – Reflexão Simbólica"
      subtitle="Template de reflexão sobre dimensões da personalidade"
      description="Espaço para reflexão simbólica sobre as dimensões da personalidade. Este é um instrumento reflexivo que não fornece diagnóstico, análise ou classificação. A interpretação é de responsabilidade exclusiva do profissional."
      icon={<Brain className="w-5 h-5" />}
      editorPath="/templates/big5"
      backPath="/ferramentas"
    />
  );
}
