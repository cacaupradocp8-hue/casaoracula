import { PortalType } from './portal';

export interface Travessia {
  id: string;
  number: 1 | 2 | 3 | 4;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  closingRitual: string;
  icone: string;
  corAcento: string;
  temas: string[];
  minPortal: PortalType;
  requiresProfessional: boolean;
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
    slug: 'mundo-sem-simbolos',
    title: 'O Mundo sem Símbolos',
    subtitle: 'A ética do caminho iniciático',
    description: 'Fundamentos éticos, limites profissionais, glossário simbólico e ritos simples de abertura.',
    closingRitual: 'Ritual do Primeiro Olhar: Reconhecer em si a sede de símbolos.',
    icone: 'Compass',
    corAcento: 'amber',
    temas: ['Ética', 'Limites', 'Glossário', 'Ritos Simples'],
    minPortal: 'visitante',
    requiresProfessional: false,
  },
  {
    id: 'travessia-2',
    number: 2,
    slug: 'mulher-alma-antiga',
    title: 'A Mulher de Alma Antiga',
    subtitle: 'A linguagem dos arquétipos',
    description: 'Arquétipos femininos, trabalho com a sombra (com contenção), biblioteca de contos em texto e áudio.',
    closingRitual: 'Ritual da Memória Profunda: Honrar as guardiãs que vieram antes.',
    icone: 'Moon',
    corAcento: 'purple',
    temas: ['Arquétipos', 'Sombra', 'Contos', 'Biblioteca'],
    minPortal: 'pre_iniciada',
    requiresProfessional: false,
  },
  {
    id: 'travessia-3',
    number: 3,
    slug: 'codigo-narrativas',
    title: 'O Código das Narrativas',
    subtitle: 'Núcleo da prática profissional',
    description: 'Sala de Sessão, Mapas integrados (Big5 + Eneagrama + Arquétipos), Agentes IA e ferramentas clínicas.',
    closingRitual: 'Ritual da Escuta Simbólica: Ouvir além das palavras.',
    icone: 'BookOpen',
    corAcento: 'gold',
    temas: ['Sala de Sessão', 'Mapas', 'IA', 'Prática'],
    minPortal: 'pre_iniciada',
    requiresProfessional: true,
  },
  {
    id: 'travessia-4',
    number: 4,
    slug: 'guardia-caminho',
    title: 'A Guardiã do Caminho',
    subtitle: 'Condução e supervisão',
    description: 'Condução de grupos, ética da iniciação simbólica, supervisão e limites da facilitação.',
    closingRitual: 'Ritual da Iniciação: Assumir o manto de Guardiã ORÁCULA.',
    icone: 'Shield',
    corAcento: 'emerald',
    temas: ['Condução', 'Supervisão', 'Ética Avançada', 'Grupos'],
    minPortal: 'iniciada',
    requiresProfessional: true,
  },
];

export const getTravessia = (slug: string): Omit<Travessia, 'lessons'> | undefined => {
  return TRAVESSIAS_DATA.find(t => t.slug === slug);
};

export const getTravessiaById = (id: string): Omit<Travessia, 'lessons'> | undefined => {
  return TRAVESSIAS_DATA.find(t => t.id === id);
};

export const getTravessiaByNumber = (num: number): Omit<Travessia, 'lessons'> | undefined => {
  return TRAVESSIAS_DATA.find(t => t.number === num);
};
