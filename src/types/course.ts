// Course Types for Members Area
import { Json } from '@/integrations/supabase/types';

export type PricingModel = 'free' | 'one_time' | 'subscription';
export type ContentType = 'text' | 'video' | 'audio' | 'file' | 'mixed' | 'ritual';

export interface Course {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descricao: string;
  descricao_publica: string | null;
  capa_url: string | null;
  video_preview_url: string | null;
  pricing_model: PricingModel;
  preco: number | null;
  preco_promocional: number | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  portal_minimo: 'visitante' | 'mentorada' | 'aluna_formacao' | 'assinante' | 'oracula' | 'admin';
  requer_matricula: boolean;
  publicado: boolean;
  destaque: boolean;
  ordem: number;
  duracao_estimada: string | null;
  nivel: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  sala_id: string | null;
}

export interface CourseModule {
  id: string;
  course_id: string;
  titulo: string;
  descricao: string | null;
  subtitulo?: string | null;
  ordem: number;
  publicado: boolean;
  disponivel_em: string | null;
  dias_apos_matricula: number | null;
  created_at: string;
  updated_at: string;
  // Pedagogical format fields
  formato_pedagogico?: boolean | null;
  video_principal_url?: string | null;
  video_principal_titulo?: string | null;
  video_principal_duracao?: number | null;
  cards_leitura?: Json | null;
  ferramenta_pratica?: Json | null;
  estudos_caso?: Json | null;
  check_maturidade?: Json | null;
}

export interface RitualSlide {
  image_url: string;
  titulo?: string;
  frase_simbolica?: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  titulo: string;
  descricao_curta: string;
  content_type: ContentType;
  texto_aula: string | null;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  duracao_minutos: number | null;
  ordem: number;
  publicado: boolean;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
  // Ritual lesson fields
  ritual_slides?: any[] | null;
  capa_url?: string | null;
  jornada?: string | null;
  portal?: string | null;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  ativo: boolean;
  payment_provider: string | null;
  payment_id: string | null;
  data_inicio: string;
  data_fim: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  progress_percent: number;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface CourseWithModules extends Course {
  modules: CourseModuleWithLessons[];
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons: CourseLesson[];
}

export interface CourseWithProgress extends Course {
  enrollment: CourseEnrollment | null;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}