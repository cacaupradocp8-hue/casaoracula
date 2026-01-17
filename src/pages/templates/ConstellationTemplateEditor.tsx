import { Users } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const CONSTELLATION_SECTIONS: TemplateSection[] = [
  {
    key: 'issue',
    title: 'Questão ou Tema',
    description: 'Qual foi a questão trazida ou o tema central da constelação?',
    placeholder: 'Qual a questão central? O que motivou este trabalho sistêmico?',
  },
  {
    key: 'elements',
    title: 'Elementos do Sistema',
    description: 'Pessoas, forças, símbolos e elementos que foram constelados.',
    placeholder: 'Quem ou o que foi representado? Quais elementos do sistema foram trazidos para o campo?',
  },
  {
    key: 'positions',
    title: 'Posições e Relações',
    description: 'Como os elementos se posicionaram? Quais relações se mostraram?',
    placeholder: 'Como os elementos se dispuseram no espaço? Quais relações de proximidade, distância ou tensão apareceram?',
  },
  {
    key: 'sensations',
    title: 'Sensações, Movimentos, Percepções',
    description: 'O que foi percebido sensorialmente? Quais movimentos ou impulsos surgiram?',
    placeholder: 'O que os representantes sentiram? Quais sensações corporais, emoções ou impulsos de movimento apareceram?',
  },
  {
    key: 'insights',
    title: 'Insights Emergentes',
    description: 'O que se revelou durante o processo? Quais compreensões surgiram?',
    placeholder: 'O que o campo mostrou? Quais padrões, exclusões ou emaranhamentos se tornaram visíveis?',
  },
  {
    key: 'closing',
    title: 'Integração de Fechamento',
    description: 'Como o trabalho foi encerrado? O que permanece como convite?',
    placeholder: 'Houve algum movimento de fechamento? Frases de cura? O que permanece como trabalho interno?',
  },
];

const INTRODUCTION = `Este template oferece uma estrutura para registrar observações de constelações sistêmicas de forma fenomenológica.

O foco está na descrição do que se mostrou no campo, sem interpretações forçadas ou sugestões de resolução impostas pelo facilitador.

A postura é de testemunha respeitosa. O sistema revela seu próprio caminho, e o registro serve à memória e à integração.`;

export default function ConstellationTemplateEditor() {
  return (
    <SymbolicTemplateEditor
      templateType="constellation"
      title="Constelação – Mapeamento Simbólico"
      subtitle="Registro de observações sistêmicas"
      icon={<Users className="w-5 h-5" />}
      introduction={INTRODUCTION}
      sections={CONSTELLATION_SECTIONS}
      listPath="/templates/constellation"
    />
  );
}
