import { Compass } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const ENNEAGRAM_SECTIONS: TemplateSection[] = [
  {
    key: 'present_theme',
    title: 'Tema do Momento Presente',
    description: 'Qual questão, situação ou padrão está ativo no momento?',
    placeholder: 'O que está vivo agora? Qual a questão central que pede atenção?',
  },
  {
    key: 'emotional_patterns',
    title: 'Padrões Emocionais Dominantes',
    description: 'Quais emoções predominam? Como se manifestam no corpo e nos comportamentos?',
    placeholder: 'Quais emoções aparecem com mais frequência? Como elas se expressam? Onde moram no corpo?',
  },
  {
    key: 'defenses',
    title: 'Mecanismos de Defesa Observados',
    description: 'Quais estratégias de proteção estão ativas? Como o ego se defende?',
    placeholder: 'Quais defesas estão presentes? Como elas se manifestam nas relações, no trabalho, na autoimagem?',
  },
  {
    key: 'stress_security',
    title: 'Movimentos sob Estresse e Segurança',
    description: 'Como os padrões mudam sob pressão? E em momentos de relaxamento?',
    placeholder: 'O que acontece sob estresse? Para onde vai a energia? E quando há segurança, o que emerge?',
  },
  {
    key: 'narratives',
    title: 'Narrativas e Crenças Internas',
    description: 'Quais histórias são contadas internamente? Que crenças sustentam os padrões?',
    placeholder: 'Quais são as narrativas recorrentes? Que crenças sobre si mesmo, os outros e o mundo aparecem?',
  },
  {
    key: 'awareness_practices',
    title: 'Práticas para Consciência',
    description: 'Que práticas, perguntas ou convites podem apoiar maior consciência?',
    placeholder: 'O que pode ajudar a trazer mais luz para esses padrões? Quais práticas ou reflexões são convidadas?',
  },
];

const INTRODUCTION = `Este template oferece um espaço para auto-observação simbólica inspirada no Eneagrama, sem a intenção de tipificar ou classificar.

O objetivo é facilitar a exploração de padrões emocionais, mecanismos de defesa e narrativas internas, apoiando o processo de consciência e auto-conhecimento.

Este não é um instrumento de identificação de tipo. A reflexão é aberta e o profissional permanece responsável por qualquer interpretação.`;

export default function EnneagramTemplateEditor() {
  return (
    <SymbolicTemplateEditor
      templateType="enneagram"
      title="Eneagrama – Auto-Observação Simbólica"
      subtitle="Exploração de padrões emocionais e defesas"
      icon={<Compass className="w-5 h-5" />}
      introduction={INTRODUCTION}
      sections={ENNEAGRAM_SECTIONS}
      listPath="/templates/enneagram"
    />
  );
}
