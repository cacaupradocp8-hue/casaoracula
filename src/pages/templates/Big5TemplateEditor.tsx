import { Brain } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const BIG5_SECTIONS: TemplateSection[] = [
  {
    key: 'context',
    title: 'Contexto da Sessão',
    description: 'Descreva o momento, tema ou circunstância que motivou esta reflexão.',
    placeholder: 'Qual o contexto desta exploração? O que trouxe esta necessidade de reflexão?',
    example: 'A cliente busca compreender melhor suas reações em momentos de pressão no trabalho. Está em transição de carreira e sente dificuldade em tomar decisões importantes. O objetivo é mapear padrões de comportamento que podem estar influenciando esse momento.',
  },
  {
    key: 'openness',
    title: 'Abertura (Openness)',
    description: 'Expressões simbólicas, comportamentos e padrões de vida relacionados à curiosidade, criatividade e imaginação.',
    placeholder: 'Como se manifesta a abertura ao novo? Quais são os padrões de curiosidade e exploração? Onde há resistência ou fluxo?',
    example: 'Demonstra curiosidade intensa por temas filosóficos e artísticos. Gosta de explorar novas ideias, mas percebe resistência quando as mudanças afetam sua rotina emocional. Lê muito, mas admite ter dificuldade em finalizar projetos criativos pessoais.',
  },
  {
    key: 'conscientiousness',
    title: 'Conscienciosidade (Conscientiousness)',
    description: 'Ritmos, organização, disciplina interna e padrões de responsabilidade.',
    placeholder: 'Quais são os ritmos internos? Como se manifesta a organização (ou a falta dela)? Qual a relação com compromisso e estrutura?',
    example: 'Apresenta alta exigência consigo mesma quanto a prazos. Tende a sobrecarregar a agenda e negligenciar momentos de descanso. A organização externa é impecável, mas relata sentir-se internamente caótica. Perfeccionismo aparece como tema recorrente.',
  },
  {
    key: 'extraversion',
    title: 'Extroversão (Extraversion)',
    description: 'Fluxo de energia, expressão social, assertividade e entusiasmo.',
    placeholder: 'Como a energia flui em direção ao mundo? Qual a qualidade da expressão social? Onde há expansão ou recolhimento?',
    example: 'Energia renovada em conversas profundas com poucas pessoas de confiança. Evita grandes grupos e eventos sociais. Precisa de tempo sozinha para processar experiências. Expressa-se melhor pela escrita do que pela fala.',
  },
  {
    key: 'agreeableness',
    title: 'Amabilidade (Agreeableness)',
    description: 'Dinâmicas relacionais, empatia, limites e padrões de cooperação.',
    placeholder: 'Como se dão as dinâmicas relacionais? Onde está a empatia? Como são os limites? Há padrões de adaptação excessiva ou distanciamento?',
    example: 'Altamente empática, tende a absorver emoções alheias. Dificuldade histórica em dizer não. Percebe padrão de colocar necessidades dos outros acima das suas. Trabalho recente de estabelecer limites mais claros está em andamento.',
  },
  {
    key: 'neuroticism',
    title: 'Sensibilidade Emocional (Neuroticism)',
    description: 'Padrões de sensibilidade, resposta ao estresse e vulnerabilidades.',
    placeholder: 'Quais são os padrões de sensibilidade emocional? Como o estresse se manifesta? Onde há vulnerabilidade ou força?',
    example: 'Gatilhos relacionados a críticas e sensação de rejeição. Sob estresse, tende a isolar-se e ruminar pensamentos. Estratégias de regulação incluem caminhadas na natureza e escrita reflexiva. Ansiedade mais presente em períodos de incerteza.',
  },
  {
    key: 'integration',
    title: 'Reflexão Integrativa',
    description: 'Síntese pessoal sem conclusões automáticas. Observações e conexões que emergiram.',
    placeholder: 'O que emerge quando olhamos para o conjunto? Quais conexões surgem? Que perguntas permanecem abertas?',
    example: 'Emerge um padrão de alta sensibilidade combinada com exigência interna elevada. O convite parece ser desenvolver autocompaixão e flexibilizar padrões de perfeição. Permanece a reflexão sobre como honrar sua natureza introspectiva sem isolamento.',
  },
];

const INTRODUCTION = `Este template oferece um espaço estruturado para reflexão sobre as cinco dimensões clássicas da personalidade, adaptado para uma abordagem simbólica e narrativa.

Não há escalas, números ou porcentagens. O foco está na observação qualitativa de padrões, expressões e dinâmicas que se manifestam em cada dimensão.

Use este espaço para registrar observações, insights e perguntas que emergem durante o processo de exploração.`;

export default function Big5TemplateEditor() {
  return (
    <SymbolicTemplateEditor
      templateType="big5"
      title="Big Five – Reflexão Simbólica"
      subtitle="Exploração narrativa das dimensões da personalidade"
      icon={<Brain className="w-5 h-5" />}
      introduction={INTRODUCTION}
      sections={BIG5_SECTIONS}
      listPath="/templates/big5"
    />
  );
}
