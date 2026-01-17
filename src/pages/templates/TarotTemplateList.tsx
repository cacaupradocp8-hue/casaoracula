import { Sparkles } from 'lucide-react';
import { SymbolicTemplateList } from '@/components/templates/SymbolicTemplateList';

export default function TarotTemplateList() {
  return (
    <SymbolicTemplateList
      templateType="tarot"
      title="Tarot – Leitura Simbólica"
      subtitle="Template para registro de leituras simbólicas"
      description="Espaço para estruturar leituras simbólicas do Tarot. Este instrumento foca em significados simbólicos e reflexão. Não há previsões, fortunas ou afirmações sobre o futuro. O Tarot é usado como ferramenta de espelhamento e insight."
      icon={<Sparkles className="w-5 h-5" />}
      editorPath="/templates/tarot"
      backPath="/ferramentas"
    />
  );
}
