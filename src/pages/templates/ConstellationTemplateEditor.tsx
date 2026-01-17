import { Users } from 'lucide-react';
import { SymbolicTemplateEditor, TemplateSection } from '@/components/templates/SymbolicTemplateEditor';

const CONSTELLATION_SECTIONS: TemplateSection[] = [
  {
    key: 'issue',
    title: 'Questão ou Tema',
    description: 'Qual foi a questão trazida ou o tema central da constelação?',
    placeholder: 'Qual a questão central? O que motivou este trabalho sistêmico?',
    example: 'Dificuldade em prosperar financeiramente, apesar de muito esforço. Sensação de carregar um peso que não é seu. Padrão repetitivo de autossabotagem em momentos de sucesso.',
  },
  {
    key: 'elements',
    title: 'Elementos do Sistema',
    description: 'Pessoas, forças, símbolos e elementos que foram constelados.',
    placeholder: 'Quem ou o que foi representado? Quais elementos do sistema foram trazidos para o campo?',
    example: 'Representados: a cliente, o pai, a avó paterna, o dinheiro/prosperidade, um irmão do avô que faleceu jovem (excluído do sistema). Âncoras utilizadas: almofadas coloridas para cada elemento.',
  },
  {
    key: 'positions',
    title: 'Posições e Relações',
    description: 'Como os elementos se posicionaram? Quais relações se mostraram?',
    placeholder: 'Como os elementos se dispuseram no espaço? Quais relações de proximidade, distância ou tensão apareceram?',
    example: 'Cliente posicionada de costas para o dinheiro. Pai entre ela e prosperidade, como barreira. Avó olhando para fora do campo. Lugar vazio onde estaria o tio excluído - todos evitavam olhar para lá.',
  },
  {
    key: 'sensations',
    title: 'Sensações, Movimentos, Percepções',
    description: 'O que foi percebido sensorialmente? Quais movimentos ou impulsos surgiram?',
    placeholder: 'O que os representantes sentiram? Quais sensações corporais, emoções ou impulsos de movimento apareceram?',
    example: 'Representante do pai relatou peso nos ombros e tristeza profunda. Cliente sentiu frio intenso ao se aproximar do lugar do tio. Dinheiro queria sair do campo. Avó chorou ao olhar para o lugar vazio. Impulso forte de ajoelhar surgiu na cliente.',
  },
  {
    key: 'insights',
    title: 'Insights Emergentes',
    description: 'O que se revelou durante o processo? Quais compreensões surgiram?',
    placeholder: 'O que o campo mostrou? Quais padrões, exclusões ou emaranhamentos se tornaram visíveis?',
    example: 'O tio que morreu jovem nunca foi mencionado na família. Pai carrega luto não processado. Cliente identificada inconscientemente com o destino do tio. Lealdade invisível: não pode prosperar mais que aquele que partiu cedo. Prosperidade só pôde se aproximar quando o tio foi reconhecido.',
  },
  {
    key: 'closing',
    title: 'Integração de Fechamento',
    description: 'Como o trabalho foi encerrado? O que permanece como convite?',
    placeholder: 'Houve algum movimento de fechamento? Frases de cura? O que permanece como trabalho interno?',
    example: 'Cliente fez reverência ao tio e disse: "Eu te vejo. Você pertence." Frase ao pai: "Querido pai, o destino dele não é meu. Eu fico." Movimento de fechamento: virar-se para o dinheiro e dizer sim. Convite: acender uma vela para o tio uma vez por semana durante um mês.',
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
