// ============================================
// CLUBE DO LIVRO ORACULAR — Data Layer (Frontend)
// Estação Piloto: Matriz · Chamado · Feminino Arcaico
// ============================================

export interface PortalConteudo {
  textoSimbolico: string;
  essencia8020: string;
  raizPsiquica: string;
  aplicacaoPessoal: string;
  aplicacaoProfissional: string;
  jardimPsique: string;
  jardimHeroina: string;
  laboratorio8020: string;
}

export interface Portal {
  slug: string;
  nome: string;
  subtitulo: string;
  icone: string;
  jornadaSlug: string;
  conteudo: PortalConteudo;
}

export interface Jornada {
  slug: string;
  nome: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface Estacao {
  slug: string;
  numero: number;
  nome: string;
  subtitulo: string;
  livroTitulo: string;
  livroAutor: string;
  faseLunar: string;
  descricao: string;
}

// ─── Estação Piloto ───────────────────────────
export const ESTACAO_PILOTO: Estacao = {
  slug: 'matriz',
  numero: 1,
  nome: 'Estação I — Matriz · Chamado · Feminino Arcaico',
  subtitulo: 'O território onde tudo começa',
  livroTitulo: 'Mulheres que Correm com os Lobos',
  livroAutor: 'Clarissa Pinkola Estés',
  faseLunar: '🌑',
  descricao:
    'Esta estação abre o campo do feminino arcaico — o instinto, o chamado e a memória do corpo. O livro-eixo é um território de retorno à natureza selvagem interior.',
};

// ─── Jornadas ─────────────────────────────────
export const JORNADAS: Jornada[] = [
  {
    slug: 'heroina',
    nome: 'Jornada da Heroína',
    subtitulo: 'Campo pessoal',
    descricao:
      'A jornada que atravessa o campo pessoal — aquilo que a obra desperta em você como mulher, terapeuta e ser vivente.',
    icone: '🌿',
    cor: 'emerald',
  },
  {
    slug: 'sombra',
    nome: 'Jornada da Sombra',
    subtitulo: 'Campo de confronto',
    descricao:
      'A jornada que ilumina o que foi negado, projetado ou esquecido. Aqui o livro funciona como espelho dos pontos cegos.',
    icone: '🌘',
    cor: 'violet',
  },
];

// ─── Portais ──────────────────────────────────
export const PORTAIS: Portal[] = [
  {
    slug: 'reconhecer',
    nome: 'Reconhecer',
    subtitulo: 'O que vive em mim e eu não nomeava',
    icone: '👁',
    jornadaSlug: 'heroina',
    conteudo: {
      textoSimbolico:
        'Reconhecer é o primeiro gesto do despertar. Antes de transformar qualquer coisa, é preciso ver — sem medo, sem pressa, sem julgamento.',
      essencia8020:
        'O reconhecimento é o 20% que sustenta 80% do processo terapêutico. Sem ele, toda intervenção é prematura. Este portal ensina a permanecer no ver antes de agir.',
      raizPsiquica:
        'A raiz psíquica do reconhecimento está ligada ao instinto de auto-preservação — aquele saber do corpo que antecede qualquer teoria.',
      aplicacaoPessoal:
        'Onde na minha vida eu evito reconhecer o que já sei? Que território interno eu continuo chamando de "normal" quando sinto que não é?',
      aplicacaoProfissional:
        'Na clínica: como oferecer ao cliente o espaço para reconhecer sem impor interpretação? Como sustentar o silêncio que antecede o nomear?',
      jardimPsique:
        'Pergunte-se: O que meu corpo reconhece antes da minha mente? Que emoção eu sinto mas não permito que chegue à palavra?',
      jardimHeroina:
        'Prática: Nesta semana, observe um padrão recorrente sem tentar mudá-lo. Apenas reconheça. Anote o que surge.',
      laboratorio8020:
        'Destile: Qual é o gesto mínimo de reconhecimento que, se praticado, muda toda a qualidade da sua presença terapêutica?',
    },
  },
  {
    slug: 'recordar',
    nome: 'Recordar',
    subtitulo: 'O que a memória do corpo guarda',
    icone: '🫀',
    jornadaSlug: 'heroina',
    conteudo: {
      textoSimbolico:
        'Recordar vem de "re-cordis" — passar de novo pelo coração. Não é lembrar com a mente. É deixar o corpo contar sua verdade.',
      essencia8020:
        'A memória corporal é o território onde moram os padrões mais profundos. Este portal ensina a escutar o que o corpo recorda — e o que ele precisa devolver.',
      raizPsiquica:
        'A raiz psíquica do recordar está no feminino arcaico — aquela que sabe antes de saber que sabe. É a inteligência do instinto preservado.',
      aplicacaoPessoal:
        'Que memória vive no meu corpo sem que eu a tenha processado? Que gesto, postura ou tensão carrega uma história que ainda não contei?',
      aplicacaoProfissional:
        'Na sessão: como criar condições para que o corpo do cliente "fale"? Que tipo de silêncio, ritmo ou pergunta abre esse canal?',
      jardimPsique:
        'Observe: Há alguma sensação física que aparece sempre no mesmo contexto? O que ela tenta dizer?',
      jardimHeroina:
        'Prática: Escolha uma parte do corpo que "fala alto" esta semana. Dedique 5 minutos por dia apenas escutando-a, sem interpretar.',
      laboratorio8020:
        'Destile: Qual é a diferença entre recordar com a mente e recordar com o corpo? Como isso muda sua prática clínica?',
    },
  },
  {
    slug: 'romper',
    nome: 'Romper',
    subtitulo: 'O que precisa ser interrompido para que o novo nasça',
    icone: '⚡',
    jornadaSlug: 'sombra',
    conteudo: {
      textoSimbolico:
        'Romper não é destruir. É a coragem de interromper o ciclo que se repete — o padrão, a obediência, o silêncio que já não protege.',
      essencia8020:
        'A ruptura consciente é o gesto mais temido e mais transformador. Este portal ensina a diferenciar a ruptura destrutiva da ruptura que liberta.',
      raizPsiquica:
        'A raiz psíquica da ruptura mora na Sombra — naquilo que foi domesticado à força e que, quando emerge, pode parecer caos mas é reorganização.',
      aplicacaoPessoal:
        'Que contrato silencioso eu mantenho por medo de romper? O que aconteceria se eu permitisse a interrupção do padrão?',
      aplicacaoProfissional:
        'Na clínica: como sustentar o momento em que o cliente rompe um padrão? Como não reforçar a obediência disfarçada de "evolução"?',
      jardimPsique:
        'Pergunte-se: O que eu chamo de "lealdade" que na verdade é submissão? Que ruptura eu adiava e que agora se mostra inevitável?',
      jardimHeroina:
        'Prática: Identifique um "sim" automático que você dá por hábito. Esta semana, substitua-o por uma pausa antes de responder.',
      laboratorio8020:
        'Destile: Qual é a menor ruptura possível que, se feita com consciência, libera a maior quantidade de energia vital?',
    },
  },
];

// ─── Helpers ──────────────────────────────────
export function getJornada(slug: string) {
  return JORNADAS.find((j) => j.slug === slug);
}

export function getPortal(slug: string) {
  return PORTAIS.find((p) => p.slug === slug);
}

export function getPortaisByJornada(jornadaSlug: string) {
  return PORTAIS.filter((p) => p.jornadaSlug === jornadaSlug);
}
