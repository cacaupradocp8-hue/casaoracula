// ============================================
// JORNADA ANUAL — Ano 1: Jornada da Facilitadora Oracular
// 12 Meses com Portal, Voz Dominante e Foco Clínico
// ============================================

export interface MesJornada {
  mes: number;
  nome: string;
  portal: string;
  voz_dominante: string;
  voz_descricao: string;
  voz_conducao: string;
  voz_pergunta_chave: string;
  foco_clinico: string;
}

export const JORNADA_ANO_1: MesJornada[] = [
  {
    mes: 1,
    nome: 'Janeiro — Despertar',
    portal: 'Portal do Chamado',
    voz_dominante: 'A Voz da Que Carrega o Fogo Antigo',
    voz_descricao: 'Ativa a força primordial e a coragem de iniciar a travessia. É a voz que acende o fogo interno quando tudo parece adormecido.',
    voz_conducao: 'Condução direta, ritualística, com perguntas que confrontam a inércia e convocam a presença.',
    voz_pergunta_chave: 'O que em você precisa ser aceso agora?',
    foco_clinico: 'Reconhecimento do chamado interior — diferenciação entre desejo autêntico e performance.',
  },
  {
    mes: 2,
    nome: 'Fevereiro — Colapso do Personagem',
    portal: 'Portal da Máscara',
    voz_dominante: 'A Voz da Que Escuta as Sombras',
    voz_descricao: 'Sustenta o encontro com o que foi negado. Permite que a sombra se manifeste sem julgamento.',
    voz_conducao: 'Escuta profunda, silêncio sustentado, perguntas que revelam o que está por trás da adaptação.',
    voz_pergunta_chave: 'Quem você precisou deixar de ser para sobreviver?',
    foco_clinico: 'Desmontagem da persona — identificação de padrões de adaptação excessiva.',
  },
  {
    mes: 3,
    nome: 'Março — Corpo & Sombra',
    portal: 'Portal do Corpo',
    voz_dominante: 'A Voz da Que Cura pelo Contato',
    voz_descricao: 'Trabalha através da presença corporal e da sensorialidade. Cura pela proximidade e pelo toque simbólico.',
    voz_conducao: 'Condução somática, atenção ao corpo, ritmo lento e pausas de respiração.',
    voz_pergunta_chave: 'Onde no seu corpo essa história está guardada?',
    foco_clinico: 'Integração corpo-psique — somatização e escuta corporal como ferramenta clínica.',
  },
  {
    mes: 4,
    nome: 'Abril — Espaço Potencial',
    portal: 'Portal do Brincar',
    voz_dominante: 'A Voz da Que Sopra Histórias',
    voz_descricao: 'Cria espaços de imaginação ativa e narrativa. Transforma a rigidez em possibilidade através do conto.',
    voz_conducao: 'Condução narrativa, uso de metáforas, convite ao imaginário e ao brincar simbólico.',
    voz_pergunta_chave: 'Se essa dor pudesse contar sua própria história, o que ela diria?',
    foco_clinico: 'Criação do espaço transicional — capacidade de brincar como indicador de saúde psíquica.',
  },
  {
    mes: 5,
    nome: 'Maio — Desejo & Ambivalência',
    portal: 'Portal do Desejo',
    voz_dominante: 'A Voz da Que Carrega o Fogo Antigo',
    voz_descricao: 'Retorna para ativar o eixo do desejo genuíno quando a ambivalência paralisa.',
    voz_conducao: 'Condução provocativa e acolhedora, explorando a tensão entre querer e temer.',
    voz_pergunta_chave: 'O que você deseja de verdade e tem medo de desejar?',
    foco_clinico: 'Navegação da ambivalência — eros como força vital e não como impulso.',
  },
  {
    mes: 6,
    nome: 'Junho — Queda & Dignidade',
    portal: 'Portal da Queda',
    voz_dominante: 'A Voz da Que Lembra os Caminhos Antigos',
    voz_descricao: 'Ancora a experiência da queda em um campo maior. Conecta o sofrimento pessoal à linhagem ancestral.',
    voz_conducao: 'Condução ritualística e ancestral, uso de referências mitológicas e culturais.',
    voz_pergunta_chave: 'Que mulheres antes de você também caíram — e se levantaram?',
    foco_clinico: 'Ressignificação da queda — dignidade no fracasso e no recomeço.',
  },
  {
    mes: 7,
    nome: 'Julho — Narrativa como Cura',
    portal: 'Portal da Narrativa',
    voz_dominante: 'A Voz da Que Sopra Histórias',
    voz_descricao: 'Retorna para aprofundar a cura pela narrativa. A história pessoal como dispositivo terapêutico.',
    voz_conducao: 'Condução pela escrita, relato oral, reconstrução narrativa do vivido.',
    voz_pergunta_chave: 'Qual história sobre você mesma está pronta para ser reescrita?',
    foco_clinico: 'Narroterapia aplicada — uso da ficção e da autobiografia como intervenção.',
  },
  {
    mes: 8,
    nome: 'Agosto — Casa Psíquica',
    portal: 'Portal do Espaço Interior',
    voz_dominante: 'A Voz da Que Tece o Invisível',
    voz_descricao: 'Trabalha com o que não é visto mas é sentido. Conecta os fios invisíveis da psique.',
    voz_conducao: 'Condução intuitiva, com atenção ao campo simbólico e às sincronicidades.',
    voz_pergunta_chave: 'Que cômodo da sua casa interior você tem evitado entrar?',
    foco_clinico: 'Topografia psíquica — mapeamento dos espaços internos e seus significados.',
  },
  {
    mes: 9,
    nome: 'Setembro — Atenção & Limite',
    portal: 'Portal da Atenção',
    voz_dominante: 'A Voz da Que Sonha para o Coletivo',
    voz_descricao: 'Expande a atenção para além do individual. Conecta a prática clínica ao campo coletivo.',
    voz_conducao: 'Condução contemplativa, trabalho com silêncio e observação, foco na qualidade da atenção.',
    voz_pergunta_chave: 'Onde sua atenção está sendo desperdiçada?',
    foco_clinico: 'Economia da atenção — limite como ato de cuidado e não de rigidez.',
  },
  {
    mes: 10,
    nome: 'Outubro — Responsabilidade',
    portal: 'Portal da Responsabilidade',
    voz_dominante: 'A Voz da Que Lembra os Caminhos Antigos',
    voz_descricao: 'Ancora a facilitadora na responsabilidade ética e ancestral de seu ofício.',
    voz_conducao: 'Condução ética, com reflexão sobre o peso e a beleza da responsabilidade clínica.',
    voz_pergunta_chave: 'Pelo que você é responsável — e pelo que não é?',
    foco_clinico: 'Ética clínica — responsabilidade sem onipotência, sustentação sem salvacionismo.',
  },
  {
    mes: 11,
    nome: 'Novembro — Escrita como Prática',
    portal: 'Portal da Escrita',
    voz_dominante: 'A Voz da Que Tece o Invisível',
    voz_descricao: 'Retorna para transformar a escrita em prática clínica e ferramenta de autoformação.',
    voz_conducao: 'Condução pela escrita reflexiva, diário clínico, registro da própria travessia.',
    voz_pergunta_chave: 'O que você ainda não escreveu e precisa ser registrado?',
    foco_clinico: 'Escrita como método — registro, reflexão e supervisão de si mesma.',
  },
  {
    mes: 12,
    nome: 'Dezembro — Linguagem Viva',
    portal: 'Portal da Integração',
    voz_dominante: 'A Voz da Que Escuta as Sombras',
    voz_descricao: 'Fecha o ciclo retornando à escuta do que permanece no escuro. Integração pelo que ainda não foi dito.',
    voz_conducao: 'Condução pelo silêncio, pela escuta e pela sustentação do mistério.',
    voz_pergunta_chave: 'O que este ano inteiro te ensinou — sem que você percebesse?',
    foco_clinico: 'Integração do ciclo — consolidação da identidade como facilitadora oracular.',
  },
];
