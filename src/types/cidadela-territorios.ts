export interface CidadelaTerritorio {
  id: string;
  nome: string;
  descricao_curta: string;
  funcao_simbolica: string;
  funcao_formativa: string;
  competencias: string[];
  ferramentas_associadas: string[];
  rotas_associadas: string[];
  criterio_evolucao: string;
  microcopy: string;
  modos_disponiveis: ('travessia' | 'oficio')[];
}

export const CIDADELA_TERRITORIOS: CidadelaTerritorio[] = [
  {
    id: 'coracao_cidadela',
    nome: 'Coração da CidadELA',
    descricao_curta: 'O centro radiante onde todas as direções se encontram.',
    funcao_simbolica: 'Integração do ser, o Self, o ponto de repouso e poder.',
    funcao_formativa: 'Capacidade de síntese e centramento profissional.',
    competencias: ['Presença Radical', 'Síntese Simbólica'],
    ferramentas_associadas: ['Mandala Pessoal', 'Oração da Manhã'],
    rotas_associadas: ['Clareira do Chamado', 'Território da Loba'],
    criterio_evolucao: 'Conclusão de ciclos maiores e integração de tensões.',
    microcopy: 'Onde você descansa para poder agir.',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'portao_chegada',
    nome: 'Portão da Chegada',
    descricao_curta: 'O limiar entre o mundo comum e o espaço oracular.',
    funcao_simbolica: 'Iniciação, autorização interna e o primeiro passo.',
    funcao_formativa: 'Abertura de campo e ética da entrada.',
    competencias: ['Escuta Atenta', 'Ética Iniciática'],
    ferramentas_associadas: ['Áudio de Abertura', 'O Contrato'],
    rotas_associadas: ['Clareira do Chamado'],
    criterio_evolucao: 'Realização da primeira cartografia.',
    microcopy: 'Atravesse com consciência.',
    modos_disponiveis: ['travessia']
  },
  {
    id: 'torres',
    nome: 'Torres',
    descricao_curta: 'Estruturas de vigília, proteção e visão ampliada.',
    funcao_simbolica: 'Discernimento, limites e a capacidade de observar de cima.',
    funcao_formativa: 'Fundamentos teóricos e contenção clínica.',
    competencias: ['Observação Clínica', 'Estabelecimento de Limites'],
    ferramentas_associadas: ['Big Five Simbólico', 'Regras de Ouro'],
    rotas_associadas: ['Casa da Boa Menina'],
    criterio_evolucao: 'Mapeamento de traços de personalidade.',
    microcopy: 'Vigie as fronteiras da sua alma.',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'forja',
    nome: 'A Forja',
    descricao_curta: 'Lugar de calor, pressão e transformação da matéria bruta.',
    funcao_simbolica: 'Alquimia interna, transformação da dor em sentido.',
    funcao_formativa: 'Prática intensa, supervisão e técnica aplicada.',
    competencias: ['Condução de Processos', 'Resiliência Simbólica'],
    ferramentas_associadas: ['Exercícios de Escrita', 'Ritos de Passagem'],
    rotas_associadas: [],
    criterio_evolucao: 'Enfrentamento de desafios práticos.',
    microcopy: 'O fogo que refina, não consome.',
    modos_disponiveis: ['oficio']
  },
  {
    id: 'portas',
    nome: 'Portas',
    descricao_curta: 'Pontos de passagem para diferentes dimensões da psique.',
    funcao_simbolica: 'Escolha, transição e o mistério do que está oculto.',
    funcao_formativa: 'Manejo de defesas e abertura de novos caminhos.',
    competencias: ['Identificação de Defesas', 'Intervenção Narrativa'],
    ferramentas_associadas: ['Cartas Oraculares', 'Portal de Entrada'],
    rotas_associadas: [],
    criterio_evolucao: 'Abertura de novos módulos e insights.',
    microcopy: 'Qual porta você escolhe abrir hoje?',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'espelho_vinculos',
    nome: 'Espelho dos Vínculos',
    descricao_curta: 'Reflexo das relações e das projeções interpessoais.',
    funcao_simbolica: 'Alteridade, reconhecimento do outro como espelho.',
    funcao_formativa: 'Manejo de transferência e contratransferência.',
    competencias: ['Escuta Relacional', 'Gestão de Projeções'],
    ferramentas_associadas: ['Mapa de Vínculos', 'Dinâmicas de Grupo'],
    rotas_associadas: ['Casa da Boa Menina', 'Margem dos Ossos'],
    criterio_evolucao: 'Análise de casos relacionais.',
    microcopy: 'Quem você vê quando olha para o outro?',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'casa_sonhos',
    nome: 'Casa dos Sonhos',
    descricao_curta: 'Onde as imagens do inconsciente ganham forma.',
    funcao_simbolica: 'Conexão com o mundo onírico e simbólico profundo.',
    funcao_formativa: 'Interpretação de imagens e linguagem metafórica.',
    competencias: ['Leitura de Imagens', 'Trabalho com Sonhos'],
    ferramentas_associadas: ['Diário de Sonhos', 'Incubação de Imagens'],
    rotas_associadas: [],
    criterio_evolucao: 'Registro e análise de sonhos recorrentes.',
    microcopy: 'A noite tem olhos que veem o invisível.',
    modos_disponiveis: ['travessia']
  },
  {
    id: 'jardim_heroina',
    nome: 'Jardim da Heroína',
    descricao_curta: 'O percurso individual de crescimento e florescimento.',
    funcao_simbolica: 'O mito pessoal, a jornada individual de cura.',
    funcao_formativa: 'Autodesenvolvimento e autenticidade autoral.',
    competencias: ['Autoria de Vida', 'Identidade Profissional'],
    ferramentas_associadas: ['Jornada da Heroína', 'Sementes de Intenção'],
    rotas_associadas: [],
    criterio_evolucao: 'Conclusão de etapas do mito pessoal.',
    microcopy: 'Cultive sua própria natureza.',
    modos_disponiveis: ['travessia']
  },
  {
    id: 'bosque_arquetipos',
    nome: 'Bosque dos Arquétipos',
    descricao_curta: 'Território das forças ancestrais e padrões universais.',
    funcao_simbolica: 'Imagens arquetípicas, deusas e mitos coletivos.',
    funcao_formativa: 'Uso de arquétipos na orientação e diagnóstico.',
    competencias: ['Mapeamento Arquetípico', 'Sensibilidade Mítica'],
    ferramentas_associadas: ['Cartas de Deusas', 'Mitos de Referência'],
    rotas_associadas: ['Casa da Boneca Interior'],
    criterio_evolucao: 'Identificação de arquétipos dominantes.',
    microcopy: 'As antigas vozes ainda falam em nós.',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'conselho_interior',
    nome: 'Conselho Interior',
    descricao_curta: 'O diálogo entre as múltiplas vozes que nos habitam.',
    funcao_simbolica: 'Multiplicidade da psique, negociação interna.',
    funcao_formativa: 'Manejo de conflitos internos e subpersonalidades.',
    competencias: ['Facilitação Interna', 'Integração de Partes'],
    ferramentas_associadas: ['Diálogo com Partes', 'Conselho de Anciãs'],
    rotas_associadas: ['Casa da Boneca Interior'],
    criterio_evolucao: 'Resolução de tensões internas.',
    microcopy: 'Ouça todas as vozes antes de decidir.',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'praca_abismo',
    nome: 'Praça do Abismo',
    descricao_curta: 'O ponto de encontro com o que foi perdido ou negado.',
    funcao_simbolica: 'Sombra, luto, desconstrução e vazio fértil.',
    funcao_formativa: 'Acompanhamento em crises e processos de perda.',
    competencias: ['Sustentação do Vazio', 'Trabalho com a Sombra'],
    ferramentas_associadas: ['Ritos de Despedida', 'Mergulho Profundo'],
    rotas_associadas: ['Porta Proibida', 'Margem dos Ossos'],
    criterio_evolucao: 'Integração de conteúdos sombrios.',
    microcopy: 'No escuro, a visão se aguça.',
    modos_disponiveis: ['travessia', 'oficio']
  },
  {
    id: 'labirinto',
    nome: 'Labirinto',
    descricao_curta: 'O caminho tortuoso que leva ao próprio centro.',
    funcao_simbolica: 'Processo de busca, erro e correção de rumo.',
    funcao_formativa: 'Navegação em processos complexos e confusos.',
    competencias: ['Navegação em Crise', 'Persistência Simbólica'],
    ferramentas_associadas: ['Caminhada Meditativa', 'Fio de Ariadne'],
    rotas_associadas: ['Porta Proibida'],
    criterio_evolucao: 'Atravessamento de fases de confusão.',
    microcopy: 'Não há atalhos para o centro.',
    modos_disponiveis: ['travessia']
  },
  {
    id: 'portal_renascimento',
    nome: 'Portal de Renascimento',
    descricao_curta: 'A saída do processo com uma nova forma.',
    funcao_simbolica: 'Transformação final, nova identidade, retorno ao mundo.',
    funcao_formativa: 'Finalização de processos e celebração de conquistas.',
    competencias: ['Fechamento de Ciclos', 'Emergência do Novo'],
    ferramentas_associadas: ['Rito de Saída', 'O Novo Nome'],
    rotas_associadas: ['Território da Loba'],
    criterio_evolucao: 'Conclusão de uma grande travessia.',
    microcopy: 'Você não é mais quem entrou.',
    modos_disponiveis: ['travessia']
  }
];
