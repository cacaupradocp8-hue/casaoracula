import { Sparkles } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const TAROT_SECTIONS: TemplateSection[] = [
  {
    key: 'intention',
    title: 'Pergunta ou Intenção',
    description: 'Qual foi a pergunta, tema ou intenção que guiou a leitura?',
    placeholder: 'Qual a pergunta ou intenção central? O que está sendo explorado?',
  },
  {
    key: 'cards',
    title: 'Cartas Tiradas',
    description: 'Liste as cartas que foram tiradas e suas posições, se aplicável.',
    placeholder: 'Quais cartas apareceram? Em que ordem ou posição? (Ex: O Eremita - posição central)',
  },
  {
    key: 'symbolic_meanings',
    title: 'Significados Simbólicos Percebidos',
    description: 'Quais significados e símbolos emergiram das cartas?',
    placeholder: 'O que cada carta evoca simbolicamente? Quais imagens, cores, figuras chamam atenção?',
  },
  {
    key: 'emotional_resonance',
    title: 'Ressonância Emocional',
    description: 'Quais emoções surgiram durante a leitura? Onde houve reação?',
    placeholder: 'Quais emoções apareceram? Houve resistência ou reconhecimento? O que tocou profundamente?',
  },
  {
    key: 'archetypal_themes',
    title: 'Temas Arquetípicos',
    description: 'Quais temas universais ou padrões arquetípicos se manifestaram?',
    placeholder: 'Quais arquétipos estão presentes? Que temas universais emergem? (jornada, transformação, limites...)',
  },
  {
    key: 'integration',
    title: 'Notas de Integração',
    description: 'Síntese pessoal, perguntas abertas e próximos passos reflexivos.',
    placeholder: 'O que fica desta leitura? Quais perguntas permanecem? Que convites surgem para reflexão?',
  },
];

const INTRODUCTION = `Este template oferece uma estrutura para registrar leituras simbólicas do Tarot de forma profissional e ética.

O foco está na exploração de significados simbólicos, ressonâncias emocionais e temas arquetípicos – não em previsões ou afirmações sobre o futuro.

O Tarot é usado aqui como espelho, não como oráculo preditivo. O profissional permanece responsável pela condução e interpretação.`;

export default function TarotTemplateEditor() {
  return (
    <SymbolicTemplateEditor
      templateType="tarot"
      title="Tarot – Leitura Simbólica"
      subtitle="Registro de significados e ressonâncias"
      icon={<Sparkles className="w-5 h-5" />}
      introduction={INTRODUCTION}
      sections={TAROT_SECTIONS}
      listPath="/templates/tarot"
    />
  );
}
