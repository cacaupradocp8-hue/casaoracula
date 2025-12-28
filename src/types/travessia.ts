export interface Travessia {
  id: string;
  number: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  closingRitual: string;
}

export interface Lesson {
  id: string;
  travessiaId: string;
  order: number;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  question: string;
  type: 'reflection' | 'writing' | 'symbolic';
  response?: string;
}

export interface UserProgress {
  userId: string;
  travessiaId: string;
  completedLessons: string[];
  currentLessonId?: string;
  startedAt: Date;
  completedAt?: Date;
}

export const TRAVESSIAS_DATA: Omit<Travessia, 'lessons'>[] = [
  {
    id: 'travessia-1',
    number: 1,
    title: 'O Mundo sem Símbolos',
    subtitle: 'Despertar para a ausência',
    description: 'A mulher contemporânea vive num mundo que esvaziou os símbolos de sentido. Nesta primeira travessia, reconhecemos o vazio simbólico que marca nossa época.',
    closingRitual: 'Ritual do Primeiro Olhar: Reconhecer em si a sede de símbolos.',
  },
  {
    id: 'travessia-2',
    number: 2,
    title: 'A Mulher de Alma Antiga',
    subtitle: 'Recuperar o que nunca se perdeu',
    description: 'Toda mulher carrega uma alma que sabe mais do que a mente permite lembrar. Esta travessia reconecta a terapeuta com a sabedoria ancestral.',
    closingRitual: 'Ritual da Memória Profunda: Honrar as guardiãs que vieram antes.',
  },
  {
    id: 'travessia-3',
    number: 3,
    title: 'O Código das Narrativas',
    subtitle: 'Ler o que está escrito nas entrelinhas',
    description: 'Cada cliente traz uma história que não é literal. Aprender a decodificar as narrativas internas é a arte central do método ORÁCULA.',
    closingRitual: 'Ritual da Escuta Simbólica: Ouvir além das palavras.',
  },
  {
    id: 'travessia-4',
    number: 4,
    title: 'A Guardiã do Caminho',
    subtitle: 'Tornar-se aquela que conduz',
    description: 'A travessia final prepara a terapeuta para ser guardiã de travessias alheias. Não é sobre ter respostas, mas sobre saber fazer as perguntas certas.',
    closingRitual: 'Ritual da Iniciação: Assumir o manto de Guardiã ORÁCULA.',
  },
];
