import { Brain } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const BIG5_SECTIONS: TemplateSection[] = [
  {
    key: 'context',
    title: 'Contexto da Sessão',
    description: 'Descreva o momento, tema ou circunstância que motivou esta reflexão.',
    placeholder: 'Qual o contexto desta exploração? O que trouxe esta necessidade de reflexão?',
  },
  {
    key: 'openness',
    title: 'Abertura (Openness)',
    description: 'Expressões simbólicas, comportamentos e padrões de vida relacionados à curiosidade, criatividade e imaginação.',
    placeholder: 'Como se manifesta a abertura ao novo? Quais são os padrões de curiosidade e exploração? Onde há resistência ou fluxo?',
  },
  {
    key: 'conscientiousness',
    title: 'Conscienciosidade (Conscientiousness)',
    description: 'Ritmos, organização, disciplina interna e padrões de responsabilidade.',
    placeholder: 'Quais são os ritmos internos? Como se manifesta a organização (ou a falta dela)? Qual a relação com compromisso e estrutura?',
  },
  {
    key: 'extraversion',
    title: 'Extroversão (Extraversion)',
    description: 'Fluxo de energia, expressão social, assertividade e entusiasmo.',
    placeholder: 'Como a energia flui em direção ao mundo? Qual a qualidade da expressão social? Onde há expansão ou recolhimento?',
  },
  {
    key: 'agreeableness',
    title: 'Amabilidade (Agreeableness)',
    description: 'Dinâmicas relacionais, empatia, limites e padrões de cooperação.',
    placeholder: 'Como se dão as dinâmicas relacionais? Onde está a empatia? Como são os limites? Há padrões de adaptação excessiva ou distanciamento?',
  },
  {
    key: 'neuroticism',
    title: 'Sensibilidade Emocional (Neuroticism)',
    description: 'Padrões de sensibilidade, resposta ao estresse e vulnerabilidades.',
    placeholder: 'Quais são os padrões de sensibilidade emocional? Como o estresse se manifesta? Onde há vulnerabilidade ou força?',
  },
  {
    key: 'integration',
    title: 'Reflexão Integrativa',
    description: 'Síntese pessoal sem conclusões automáticas. Observações e conexões que emergiram.',
    placeholder: 'O que emerge quando olhamos para o conjunto? Quais conexões surgem? Que perguntas permanecem abertas?',
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
