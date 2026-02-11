// ============================================
// EXERCÍCIO DO CADERNO DA JORNADA DA HEROÍNA
// Bloco integrado às cartas das 14 Portas
// ============================================

// Content per porta (keyed by numero)
export interface ExercicioPorta {
  titulo: string;
  instrucao: string;
  perguntas: [string, string, string];
}

export const EXERCICIOS_PORTAS: Record<number, ExercicioPorta> = {
  1: {
    titulo: "Reconhecer o Limiar",
    instrucao: "Sente-se em silêncio e perceba: onde está o limite entre o que você conhece e o que ainda não ousou atravessar?",
    perguntas: [
      "O que te trouxe até este ponto?",
      "Que parte de você resiste a entrar?",
      "O que acontece quando você simplesmente para?"
    ],
  },
  2: {
    titulo: "Habitar a Suspensão",
    instrucao: "Feche os olhos por 3 minutos. Permita que nada precise acontecer. Depois, registre o que emergiu.",
    perguntas: [
      "O que seu corpo faz quando nada é exigido?",
      "Que pensamento surge primeiro no silêncio?",
      "O que você tenta controlar quando tudo para?"
    ],
  },
  3: {
    titulo: "Sustentar a Espera",
    instrucao: "Identifique uma situação em que você está esperando por algo. Não tente resolvê-la — apenas nomeie.",
    perguntas: [
      "O que você espera que aconteça?",
      "O que muda quando você para de esperar e começa a observar?",
      "Qual é a diferença entre esperar e estar presente?"
    ],
  },
  4: {
    titulo: "Estar no Vazio",
    instrucao: "Descreva um vazio que você sente agora. Não tente preenchê-lo — permita que ele fale.",
    perguntas: [
      "Esse vazio é ausência de quê?",
      "O que acontece quando você não foge do vazio?",
      "Que sabedoria pode morar no que falta?"
    ],
  },
  5: {
    titulo: "Acolher o Não-Saber",
    instrucao: "Escolha uma pergunta sobre você mesma para a qual não tem resposta. Escreva-a e deixe sem responder.",
    perguntas: [
      "Que certeza sua está se dissolvendo?",
      "O que você perderia se aceitasse não saber?",
      "Como seu corpo reage à incerteza?"
    ],
  },
  6: {
    titulo: "A Travessia Interrompida",
    instrucao: "Pense em algo que você começou e não terminou — não por preguiça, mas porque algo te parou. Nomeie.",
    perguntas: [
      "O que interrompeu sua travessia?",
      "Essa interrupção foi proteção ou fuga?",
      "O que precisa ser honrado antes de continuar?"
    ],
  },
  7: {
    titulo: "O Entre-Tempos",
    instrucao: "Você está entre um antes e um depois. Descreva simbolicamente este lugar de transição.",
    perguntas: [
      "O que ficou para trás e ainda puxa?",
      "O que está à frente e ainda é invisível?",
      "Que qualidade este entre-lugar pede de você?"
    ],
  },
  8: {
    titulo: "Escutar o Silêncio",
    instrucao: "Fique em silêncio total por 5 minutos. Depois, registre: o que o silêncio disse?",
    perguntas: [
      "De que barulho interno você está fugindo?",
      "O que o silêncio revela que a palavra esconde?",
      "Que parte sua só se expressa no silêncio?"
    ],
  },
  9: {
    titulo: "Tocar a Vergonha",
    instrucao: "Nomeie algo de que sente vergonha — sem julgamento, sem explicação. Apenas nomeie.",
    perguntas: [
      "Essa vergonha é sua ou foi colocada em você?",
      "O que aconteceria se essa vergonha fosse vista com compaixão?",
      "Que proteção essa vergonha ofereceu até agora?"
    ],
  },
  10: {
    titulo: "Guardar o Segredo",
    instrucao: "Pense em algo que você nunca disse a ninguém. Não precisa revelar — apenas reconheça que existe.",
    perguntas: [
      "Esse segredo protege quem?",
      "O que acontece no seu corpo quando pensa nele?",
      "Qual a diferença entre segredo e mistério?"
    ],
  },
  11: {
    titulo: "Libertar a Voz Interna",
    instrucao: "Escreva uma frase que você sempre quis dizer mas engoliu. Permita que ela exista no papel.",
    perguntas: [
      "Quem censurou essa voz pela primeira vez?",
      "O que aconteceria se você dissesse em voz alta?",
      "Que parte de você precisa de permissão para existir?"
    ],
  },
  12: {
    titulo: "Questionar a Obediência",
    instrucao: "Identifique uma regra que você segue sem questionar. Pergunte-se: essa regra é minha?",
    perguntas: [
      "De onde veio essa regra?",
      "O que aconteceria se você desobedecesse com consciência?",
      "Que liberdade mora por trás dessa obediência?"
    ],
  },
  13: {
    titulo: "Tornar-se Visível",
    instrucao: "Nomeie um lugar onde você se faz invisível. Descreva o que aconteceria se você se mostrasse.",
    perguntas: [
      "A invisibilidade é escolha ou hábito?",
      "O que seria visto se você aparecesse por inteiro?",
      "Que parte sua está cansada de se esconder?"
    ],
  },
  14: {
    titulo: "Soltar a Contenção",
    instrucao: "Identifique onde no corpo você se contém. Respire nesse lugar e descreva o que sente.",
    perguntas: [
      "O que você está segurando?",
      "O que aconteceria se você soltasse?",
      "Essa contenção é força ou medo disfarçado?"
    ],
  },
};
