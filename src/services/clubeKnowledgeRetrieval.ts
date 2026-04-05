// ============================================
// CLUBE KNOWLEDGE RETRIEVAL SERVICE
// Fetches and filters knowledge context for
// "Converse com o Livro" mode
// ============================================

import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeContext {
  bookSummary?: string;
  symbolicSummary?: string;
  centralTheme?: string;
  tensionAxis?: string;
  keyArchetypes?: string[];
  keySymbols?: string[];
  relevantNotes?: string[];
  guideQuestions?: string[];
  // From clube_livro_ciclos
  campoSimbolico?: string;
  orientacaoClinicaUso?: string;
  orientacaoClinicaEvitar?: string;
  // From clube_livro_fases
  leituraOrientada?: string;
  alertaClinico?: string;
  observacaoClinica?: string;
  // From book_tours
  jornada?: string;
  habilidadeSimbolica?: string;
  comoAtravessar?: string;
}

interface RetrievalParams {
  bookId?: string;
  bookTitle: string;
  bookAuthor?: string;
  cicloId?: string;
  stationName?: string;
  chapterTitle?: string;
}

/**
 * Retrieve minimal, filtered knowledge context for a book/cycle.
 * Returns only what's needed — never the full database.
 */
export async function retrieveBookKnowledge(params: RetrievalParams): Promise<KnowledgeContext> {
  const ctx: KnowledgeContext = {};

  // Resolve book ID if not provided
  let bookId = params.bookId;
  if (!bookId && params.bookTitle) {
    const { data } = await supabase
      .from('books')
      .select('id, description_short, summary_symbolic, central_theme, key_archetypes, key_symbols, tension_axis, why_here, how_to_read')
      .ilike('title', params.bookTitle)
      .limit(1)
      .maybeSingle();
    if (data) {
      bookId = data.id;
      ctx.bookSummary = (data as any).description_short || undefined;
      ctx.symbolicSummary = (data as any).summary_symbolic || undefined;
      ctx.centralTheme = (data as any).central_theme || undefined;
      ctx.tensionAxis = (data as any).tension_axis || undefined;
      ctx.keyArchetypes = (data as any).key_archetypes || undefined;
      ctx.keySymbols = (data as any).key_symbols || undefined;
    }
  } else if (bookId) {
    const { data } = await supabase
      .from('books')
      .select('description_short, summary_symbolic, central_theme, key_archetypes, key_symbols, tension_axis')
      .eq('id', bookId)
      .single();
    if (data) {
      ctx.bookSummary = (data as any).description_short || undefined;
      ctx.symbolicSummary = (data as any).summary_symbolic || undefined;
      ctx.centralTheme = (data as any).central_theme || undefined;
      ctx.tensionAxis = (data as any).tension_axis || undefined;
      ctx.keyArchetypes = (data as any).key_archetypes || undefined;
      ctx.keySymbols = (data as any).key_symbols || undefined;
    }
  }

  if (!bookId) return ctx;

  // Fetch cycle data (from clube_livro_ciclos)
  let cicloId = params.cicloId;
  const cicloQuery = (supabase as any)
    .from('clube_livro_ciclos')
    .select('id, tema_simbolico, campo_simbolico, orientacao_clinica_uso, orientacao_clinica_evitar, orientacao_clinica_riscos, por_que_este_livro, como_ler')
    .ilike('titulo', params.bookTitle)
    .eq('ativo', true)
    .limit(1)
    .maybeSingle();

  // Fetch book tour
  const tourQuery = (supabase as any)
    .from('book_tours')
    .select('jornada, habilidade_simbolica, como_atravessar, onde_entra_jornada')
    .eq('book_id', bookId)
    .eq('ativo', true)
    .maybeSingle();

  // Fetch knowledge entries for this book
  const knowledgeQuery = (supabase as any)
    .from('club_knowledge_entries')
    .select('source_type, content, chapter_title, tags, archetypes, symbols')
    .eq('book_id', bookId)
    .order('chapter_order', { ascending: true, nullsFirst: false })
    .limit(10);

  const [cicloRes, tourRes, knowledgeRes] = await Promise.all([
    cicloQuery,
    tourQuery,
    knowledgeQuery,
  ]);

  // Process cycle
  if (cicloRes.data) {
    const c = cicloRes.data;
    cicloId = c.id;
    ctx.campoSimbolico = c.campo_simbolico || undefined;
    ctx.orientacaoClinicaUso = c.orientacao_clinica_uso || undefined;
    ctx.orientacaoClinicaEvitar = c.orientacao_clinica_evitar || undefined;
    if (!ctx.centralTheme && c.tema_simbolico) ctx.centralTheme = c.tema_simbolico;
  }

  // Process tour
  if (tourRes.data) {
    const t = tourRes.data;
    ctx.jornada = t.jornada || undefined;
    ctx.habilidadeSimbolica = t.habilidade_simbolica || undefined;
    ctx.comoAtravessar = t.como_atravessar || undefined;
  }

  // Process knowledge entries
  if (knowledgeRes.data && knowledgeRes.data.length > 0) {
    const notes: string[] = [];
    const questions: string[] = [];

    for (const entry of knowledgeRes.data) {
      if (entry.source_type === 'guide_question') {
        questions.push(entry.content);
      } else {
        // Filter by chapter if specified
        if (params.chapterTitle && entry.chapter_title &&
            !entry.chapter_title.toLowerCase().includes(params.chapterTitle.toLowerCase())) {
          continue;
        }
        notes.push(entry.content);
      }
    }
    if (notes.length > 0) ctx.relevantNotes = notes.slice(0, 5); // Max 5
    if (questions.length > 0) ctx.guideQuestions = questions.slice(0, 3); // Max 3
  }

  // Fetch fase data if cicloId found
  if (cicloId) {
    const { data: fases } = await (supabase as any)
      .from('clube_livro_fases')
      .select('leitura_orientada, alerta_clinico, observacao_clinica, titulo, tipo_fase')
      .eq('ciclo_id', cicloId)
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .limit(4);

    if (fases && fases.length > 0) {
      // Pick the most relevant fase (first active one)
      const fase = fases[0];
      ctx.leituraOrientada = fase.leitura_orientada || undefined;
      ctx.alertaClinico = fase.alerta_clinico || undefined;
      ctx.observacaoClinica = fase.observacao_clinica || undefined;
    }
  }

  // Fetch lessons_album data
  const { data: lessons } = await supabase
    .from('lessons_album')
    .select('guided_reading, clinical_notes, questions')
    .eq('book_id', bookId)
    .order('week_number')
    .limit(4);

  if (lessons && lessons.length > 0) {
    // Merge guided readings into notes if not already present
    for (const lesson of lessons) {
      if (lesson.guided_reading && (!ctx.relevantNotes || ctx.relevantNotes.length < 5)) {
        ctx.relevantNotes = ctx.relevantNotes || [];
        ctx.relevantNotes.push(lesson.guided_reading);
      }
      // Merge questions
      if (lesson.questions && Array.isArray(lesson.questions)) {
        ctx.guideQuestions = ctx.guideQuestions || [];
        for (const q of lesson.questions as string[]) {
          if (ctx.guideQuestions.length < 5) ctx.guideQuestions.push(q);
        }
      }
    }
  }

  return ctx;
}

/**
 * Serialize knowledge context into a compact string for the AI payload.
 * Respects size limits to keep payload minimal.
 */
export function serializeKnowledgeContext(ctx: KnowledgeContext): string {
  const parts: string[] = [];

  if (ctx.bookSummary) parts.push(`📘 Sinopse: ${ctx.bookSummary}`);
  if (ctx.symbolicSummary) parts.push(`🔮 Leitura simbólica: ${ctx.symbolicSummary}`);
  if (ctx.centralTheme) parts.push(`🎯 Tema central: ${ctx.centralTheme}`);
  if (ctx.tensionAxis) parts.push(`⚡ Eixo de tensão: ${ctx.tensionAxis}`);
  if (ctx.campoSimbolico) parts.push(`🌀 Campo simbólico: ${ctx.campoSimbolico}`);
  if (ctx.jornada) parts.push(`🗺️ Jornada: ${ctx.jornada}`);
  if (ctx.habilidadeSimbolica) parts.push(`🔑 Habilidade simbólica: ${ctx.habilidadeSimbolica}`);
  if (ctx.comoAtravessar) parts.push(`🚶 Como atravessar: ${ctx.comoAtravessar}`);
  if (ctx.keyArchetypes?.length) parts.push(`👤 Arquétipos-chave: ${ctx.keyArchetypes.join(', ')}`);
  if (ctx.keySymbols?.length) parts.push(`✨ Símbolos-chave: ${ctx.keySymbols.join(', ')}`);
  if (ctx.leituraOrientada) parts.push(`📖 Leitura orientada: ${ctx.leituraOrientada}`);
  if (ctx.relevantNotes?.length) parts.push(`📝 Notas de estudo:\n${ctx.relevantNotes.map(n => `- ${n}`).join('\n')}`);
  if (ctx.guideQuestions?.length) parts.push(`❓ Perguntas-guia:\n${ctx.guideQuestions.map(q => `- ${q}`).join('\n')}`);
  if (ctx.orientacaoClinicaUso) parts.push(`🟢 Quando usar: ${ctx.orientacaoClinicaUso}`);
  if (ctx.orientacaoClinicaEvitar) parts.push(`🔴 Quando evitar: ${ctx.orientacaoClinicaEvitar}`);
  if (ctx.alertaClinico) parts.push(`⚠️ Alerta clínico: ${ctx.alertaClinico}`);

  const result = parts.join('\n\n');
  // Hard limit: 4000 chars to keep payload lean
  return result.length > 4000 ? result.slice(0, 4000) + '\n...[contexto truncado]' : result;
}
