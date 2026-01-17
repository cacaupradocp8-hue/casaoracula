import { Sparkles } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const TAROT_SECTIONS: TemplateSection[] = [
  {
    key: 'intention',
    title: 'Pergunta ou Intenção',
    description: 'Qual foi a pergunta, tema ou intenção que guiou a leitura?',
    placeholder: 'Qual a pergunta ou intenção central? O que está sendo explorado?',
    example: 'Como posso navegar este período de transição profissional com mais clareza? Busco compreender o que precisa ser deixado para trás e o que pede para nascer.',
  },
  {
    key: 'cards',
    title: 'Cartas Tiradas',
    description: 'Liste as cartas que foram tiradas e suas posições, se aplicável.',
    placeholder: 'Quais cartas apareceram? Em que ordem ou posição? (Ex: O Eremita - posição central)',
    example: 'Tiragem de 3 cartas: (1) Passado - A Torre invertida; (2) Presente - O Eremita; (3) Futuro - A Estrela. Carta de síntese: Ás de Copas.',
  },
  {
    key: 'symbolic_meanings',
    title: 'Significados Simbólicos Percebidos',
    description: 'Quais significados e símbolos emergiram das cartas?',
    placeholder: 'O que cada carta evoca simbolicamente? Quais imagens, cores, figuras chamam atenção?',
    example: 'A Torre invertida sugere uma estrutura que já caiu, mas cujos escombros ainda precisam ser processados. O Eremita com sua lanterna indica período de introspecção necessário. A Estrela traz esperança e renovação. A água no Ás de Copas ecoa início emocional.',
  },
  {
    key: 'emotional_resonance',
    title: 'Ressonância Emocional',
    description: 'Quais emoções surgiram durante a leitura? Onde houve reação?',
    placeholder: 'Quais emoções apareceram? Houve resistência ou reconhecimento? O que tocou profundamente?',
    example: 'Alívio ao ver A Torre no passado - confirmação de que o pior já passou. Resistência inicial ao Eremita - medo de solidão. Lágrimas ao ver A Estrela - reconhecimento de esperança que tentava negar. O Ás de Copas trouxe calor no peito.',
  },
  {
    key: 'archetypal_themes',
    title: 'Temas Arquetípicos',
    description: 'Quais temas universais ou padrões arquetípicos se manifestaram?',
    placeholder: 'Quais arquétipos estão presentes? Que temas universais emergem? (jornada, transformação, limites...)',
    example: 'Jornada do herói: destruição (Torre) → travessia solitária (Eremita) → renascimento (Estrela). Tema de morte e renascimento. Arquétipo do sábio interior sendo convocado. Necessidade de descida antes da ascensão.',
  },
  {
    key: 'integration',
    title: 'Notas de Integração',
    description: 'Síntese pessoal, perguntas abertas e próximos passos reflexivos.',
    placeholder: 'O que fica desta leitura? Quais perguntas permanecem? Que convites surgem para reflexão?',
    example: 'Fica o convite para honrar este tempo de recolhimento sem pressa de resultados. Pergunta aberta: o que minha solidão quer me ensinar? Próximo passo: criar rituais de silêncio e escuta interior. Releitura sugerida em 1 mês.',
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
