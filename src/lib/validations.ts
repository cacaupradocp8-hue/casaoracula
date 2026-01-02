import { z } from 'zod';

// ===== Auth Schemas =====
export const loginSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(128, 'Senha muito longa'),
});

export const signupSchema = z.object({
  name: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo (máx. 100 caracteres)'),
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa'),
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .trim()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(128, 'Senha muito longa'),
  confirmPassword: z.string()
    .min(1, 'Confirmação é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

// ===== Clinical Tools Schemas =====
export const big5Schema = z.object({
  abertura: z.number().int().min(0, 'Valor mínimo: 0').max(100, 'Valor máximo: 100'),
  conscienciosidade: z.number().int().min(0, 'Valor mínimo: 0').max(100, 'Valor máximo: 100'),
  extroversao: z.number().int().min(0, 'Valor mínimo: 0').max(100, 'Valor máximo: 100'),
  amabilidade: z.number().int().min(0, 'Valor mínimo: 0').max(100, 'Valor máximo: 100'),
  neuroticismo: z.number().int().min(0, 'Valor mínimo: 0').max(100, 'Valor máximo: 100'),
  notas: z.string().max(5000, 'Notas muito longas (máx. 5000 caracteres)').optional().nullable(),
  impacto_clinico: z.string().max(5000, 'Impacto clínico muito longo (máx. 5000 caracteres)').optional().nullable(),
});

export const eneagramaSchema = z.object({
  tipo_principal: z.number().int().min(1, 'Selecione o tipo principal').max(9, 'Tipo inválido'),
  asa: z.number().int().min(1).max(9).optional().nullable(),
  instinto: z.string().max(50, 'Instinto inválido').optional().nullable(),
  defesas: z.string().max(2000, 'Texto muito longo (máx. 2000 caracteres)').optional().nullable(),
  virtude: z.string().max(2000, 'Texto muito longo (máx. 2000 caracteres)').optional().nullable(),
  armadilhas: z.string().max(2000, 'Texto muito longo (máx. 2000 caracteres)').optional().nullable(),
  pratica_sugerida: z.string().max(2000, 'Texto muito longo (máx. 2000 caracteres)').optional().nullable(),
});

// ===== Agent Schemas =====
export const agenteSchema = z.object({
  nome: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo (máx. 100 caracteres)'),
  descricao: z.string()
    .trim()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição muito longa (máx. 500 caracteres)'),
  instrucoes_base: z.string()
    .max(10000, 'Instruções muito longas (máx. 10000 caracteres)')
    .optional()
    .default(''),
  status: z.enum(['ativo', 'inativo']),
  portal_minimo: z.enum(['visitante', 'pre_iniciada', 'iniciada', 'admin']),
});

export const mensagemSchema = z.object({
  content: z.string()
    .trim()
    .min(1, 'Mensagem não pode ser vazia')
    .max(10000, 'Mensagem muito longa (máx. 10000 caracteres)'),
});

// ===== Mentoria Schemas =====
export const supervisionSchema = z.object({
  titulo: z.string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo (máx. 200 caracteres)'),
  texto: z.string()
    .trim()
    .min(1, 'Descrição é obrigatória')
    .max(5000, 'Descrição muito longa (máx. 5000 caracteres)'),
});

export const postMentoriaSchema = z.object({
  tipo: z.enum(['aviso', 'evento', 'supervisao']),
  titulo: z.string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo (máx. 200 caracteres)'),
  texto: z.string()
    .trim()
    .min(1, 'Texto é obrigatório')
    .max(10000, 'Texto muito longo (máx. 10000 caracteres)'),
  status: z.enum(['rascunho', 'publicado', 'arquivado']),
  data_evento: z.string().optional().nullable(),
  link_evento: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
});

// ===== Admin Schemas =====
export const salaSchema = z.object({
  nome_exibicao: z.string()
    .trim()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome muito longo (máx. 100 caracteres)'),
  texto_entrada: z.string()
    .max(1000, 'Texto de entrada muito longo (máx. 1000 caracteres)')
    .optional()
    .default(''),
  texto_bloqueio: z.string()
    .max(500, 'Texto de bloqueio muito longo (máx. 500 caracteres)')
    .optional(),
  nivel_minimo: z.enum(['NIVEL_0', 'NIVEL_1', 'NIVEL_2', 'NIVEL_3']),
  ativa: z.boolean(),
  ordem: z.number().int().min(0),
});

export const travessiaSchema = z.object({
  titulo: z.string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo (máx. 200 caracteres)'),
  descricao: z.string()
    .max(2000, 'Descrição muito longa (máx. 2000 caracteres)')
    .optional()
    .default(''),
  ordem: z.number().int().min(0),
  portal_minimo: z.enum(['visitante', 'pre_iniciada', 'iniciada', 'admin']),
});

export const aulaSchema = z.object({
  titulo: z.string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo (máx. 200 caracteres)'),
  descricao_curta: z.string()
    .max(500, 'Descrição muito longa (máx. 500 caracteres)')
    .optional()
    .default(''),
  texto_aula: z.string()
    .max(50000, 'Texto muito longo (máx. 50000 caracteres)')
    .optional()
    .nullable(),
  video_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  audio_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  pdf_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  materiais_url: z.string().url('URL inválida').or(z.literal('')).optional().nullable(),
  ordem: z.number().int().min(0),
  portal_minimo: z.enum(['visitante', 'pre_iniciada', 'iniciada', 'admin']),
});

export const bibliotecaItemSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo (máx. 200 caracteres)'),
  type: z.string()
    .trim()
    .min(1, 'Tipo é obrigatório')
    .max(50, 'Tipo muito longo'),
  content: z.string()
    .trim()
    .min(1, 'Conteúdo é obrigatório')
    .max(50000, 'Conteúdo muito longo (máx. 50000 caracteres)'),
  tags: z.array(z.string().max(50)).max(20, 'Máximo 20 tags').optional().nullable(),
  portal_level_required: z.enum(['visitante', 'pre_iniciada', 'iniciada', 'admin']),
});

export const oraculoPerguntaSchema = z.object({
  pergunta: z.string()
    .trim()
    .min(1, 'Pergunta é obrigatória')
    .max(1000, 'Pergunta muito longa (máx. 1000 caracteres)'),
  tema: z.string()
    .trim()
    .min(1, 'Tema é obrigatório')
    .max(100, 'Tema muito longo (máx. 100 caracteres)'),
  nivel_intensidade: z.number().int().min(1).max(5).optional().nullable(),
  tags: z.array(z.string().max(50)).max(10, 'Máximo 10 tags').optional().nullable(),
  status: z.enum(['ativo', 'inativo']),
  portal_minimo: z.enum(['visitante', 'pre_iniciada', 'iniciada', 'admin']),
});

export const big5PerguntaSchema = z.object({
  texto_pergunta: z.string()
    .trim()
    .min(1, 'Texto da pergunta é obrigatório')
    .max(500, 'Texto muito longo (máx. 500 caracteres)'),
  dimensao: z.enum(['abertura', 'conscienciosidade', 'extroversao', 'amabilidade', 'neuroticismo']),
  tipo: z.enum(['escala_1_5', 'texto']),
  ativo: z.boolean(),
  ordem: z.number().int().min(0),
});

// ===== Leitura Oracular Schemas =====
export const leituraOracularSchema = z.object({
  contexto: z.string()
    .trim()
    .min(10, 'Contexto deve ter pelo menos 10 caracteres')
    .max(5000, 'Contexto muito longo (máx. 5000 caracteres)'),
  pergunta: z.string()
    .trim()
    .min(5, 'Pergunta deve ter pelo menos 5 caracteres')
    .max(1000, 'Pergunta muito longa (máx. 1000 caracteres)'),
  reflexao_inicial: z.string()
    .trim()
    .min(10, 'Reflexão deve ter pelo menos 10 caracteres')
    .max(3000, 'Reflexão muito longa (máx. 3000 caracteres)'),
  momento_vida: z.string()
    .trim()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(2000, 'Descrição muito longa (máx. 2000 caracteres)'),
});

// ===== Type Exports =====
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type Big5Input = z.infer<typeof big5Schema>;
export type EneagramaInput = z.infer<typeof eneagramaSchema>;
export type AgenteInput = z.infer<typeof agenteSchema>;
export type MensagemInput = z.infer<typeof mensagemSchema>;
export type SupervisionInput = z.infer<typeof supervisionSchema>;
export type PostMentoriaInput = z.infer<typeof postMentoriaSchema>;
export type SalaInput = z.infer<typeof salaSchema>;
export type TravessiaInput = z.infer<typeof travessiaSchema>;
export type AulaInput = z.infer<typeof aulaSchema>;
export type BibliotecaItemInput = z.infer<typeof bibliotecaItemSchema>;
export type OraculoPerguntaInput = z.infer<typeof oraculoPerguntaSchema>;
export type Big5PerguntaInput = z.infer<typeof big5PerguntaSchema>;
export type LeituraOracularInput = z.infer<typeof leituraOracularSchema>;

// ===== Validation Helper =====
export function getValidationError(result: z.SafeParseReturnType<any, any>): string | null {
  if (result.success) return null;
  return result.error.errors[0]?.message || 'Erro de validação';
}
