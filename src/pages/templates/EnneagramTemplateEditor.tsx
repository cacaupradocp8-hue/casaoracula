import { Compass } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const ENNEAGRAM_SECTIONS: TemplateSection[] = [
  {
    key: 'present_theme',
    title: 'Tema do Momento Presente',
    description: 'Qual questão, situação ou padrão está ativo no momento?',
    placeholder: 'O que está vivo agora? Qual a questão central que pede atenção?',
    example: 'Conflito recorrente com a mãe sobre autonomia e escolhas de vida. Sensação de não ser vista ou compreendida. Questão central: como manter conexão familiar sem perder a própria identidade.',
  },
  {
    key: 'emotional_patterns',
    title: 'Padrões Emocionais Dominantes',
    description: 'Quais emoções predominam? Como se manifestam no corpo e nos comportamentos?',
    placeholder: 'Quais emoções aparecem com mais frequência? Como elas se expressam? Onde moram no corpo?',
    example: 'Raiva contida que se manifesta como irritabilidade. Tristeza subjacente que evita acessar. Ansiedade antes de encontros familiares. Vergonha ao expressar necessidades próprias.',
  },
  {
    key: 'defenses',
    title: 'Mecanismos de Defesa Observados',
    description: 'Quais estratégias de proteção estão ativas? Como o ego se defende?',
    placeholder: 'Quais defesas estão presentes? Como elas se manifestam nas relações, no trabalho, na autoimagem?',
    example: 'Racionalização excessiva das próprias emoções. Tendência a intelectualizar conflitos para evitar sentir. Projeção da própria rigidez nos outros. Evitação de conversas difíceis através de humor ou mudança de assunto.',
  },
  {
    key: 'stress_security',
    title: 'Movimentos sob Estresse e Segurança',
    description: 'Como os padrões mudam sob pressão? E em momentos de relaxamento?',
    placeholder: 'O que acontece sob estresse? Para onde vai a energia? E quando há segurança, o que emerge?',
    example: 'Sob estresse: torna-se controladora, exigente, crítica. Isola-se e trabalha compulsivamente. Em segurança: mais espontânea, permite-se brincar, aceita imperfeições, conecta-se emocionalmente.',
  },
  {
    key: 'narratives',
    title: 'Narrativas e Crenças Internas',
    description: 'Quais histórias são contadas internamente? Que crenças sustentam os padrões?',
    placeholder: 'Quais são as narrativas recorrentes? Que crenças sobre si mesmo, os outros e o mundo aparecem?',
    example: 'Crença central: "Preciso ser útil para ser amada." Narrativa: "Se eu não fizer, ninguém fará corretamente." Frases internas: "Não tenho tempo para descansar", "Preciso resolver isso sozinha", "Não posso decepcionar."',
  },
  {
    key: 'awareness_practices',
    title: 'Práticas para Consciência',
    description: 'Que práticas, perguntas ou convites podem apoiar maior consciência?',
    placeholder: 'O que pode ajudar a trazer mais luz para esses padrões? Quais práticas ou reflexões são convidadas?',
    example: 'Pausas de 3 respirações antes de responder a pedidos. Diário noturno registrando momentos de reatividade. Prática de perguntar: "Isso é minha responsabilidade?" Ritual semanal de lazer sem propósito produtivo.',
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
