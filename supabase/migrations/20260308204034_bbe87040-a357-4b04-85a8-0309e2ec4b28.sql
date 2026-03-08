
-- Seed the Chave Onírica course
INSERT INTO public.courses (titulo, descricao, portal_minimo, publicado, destaque, ordem, tipo_curso, subtitulo, pricing_model)
VALUES (
  'A Chave Onírica: Interpretação de Sonhos pela Cabala',
  'Um curso formativo que ensina a ler sonhos através da tradição cabalística. Cada módulo aborda um símbolo corporal e sua correspondência nos mundos oníricos, conectando a prática clínica à linguagem simbólica dos sonhos.',
  'aluna_formacao',
  true,
  true,
  2,
  'formacao',
  'Decifrando a linguagem dos sonhos pela tradição cabalística',
  'free'
);

DO $$
DECLARE
  curso_id uuid;
BEGIN
  SELECT id INTO curso_id FROM public.courses WHERE titulo = 'A Chave Onírica: Interpretação de Sonhos pela Cabala' LIMIT 1;

  INSERT INTO public.course_modules (course_id, titulo, descricao, ordem, publicado, subtitulo) VALUES
    (curso_id, 'Introdução à Cabala Onírica', 'Os fundamentos da leitura onírica cabalística e a relação entre sonho, corpo e psique.', 1, true, 'Fundamentos da tradição onírica'),
    (curso_id, 'Símbolo: Pés', 'Os pés nos sonhos representam fundamento, direção e conexão com a terra. Na Cabala, relacionam-se a Malkut.', 2, true, 'Malkut — O Reino'),
    (curso_id, 'Símbolo: Joelhos', 'Os joelhos nos sonhos falam de humildade, rendição e flexibilidade psíquica.', 3, true, 'Netzach e Hod — Persistência e Rendição'),
    (curso_id, 'Símbolo: Mãos', 'As mãos nos sonhos representam ação, criação e capacidade de transformar a realidade.', 4, true, 'Chesed e Gevurah — Dar e Conter'),
    (curso_id, 'Símbolo: Boca e Dentes', 'Boca e dentes nos sonhos falam de expressão, agressividade contida e verdade não dita.', 5, true, 'Da''at — O Conhecimento Oculto'),
    (curso_id, 'Símbolo: Voos', 'Voar nos sonhos representa transcendência, dissociação ou desejo de liberdade espiritual.', 6, true, 'Tiferet — A Beleza Central'),
    (curso_id, 'Símbolo: Estradas', 'Estradas nos sonhos representam escolhas, caminhos de vida e a jornada da individuação.', 7, true, 'Os 22 Caminhos da Árvore'),
    (curso_id, 'Estudos de Caso Integrados', 'Análise completa de sonhos reais usando todos os símbolos estudados.', 8, true, 'Prática clínica supervisionada');

  INSERT INTO public.course_lessons (module_id, titulo, ordem, publicado, content_type, texto_aula, descricao_curta)
  SELECT m.id, 'Aula Principal — ' || m.titulo, 1, true, 'video',
    'Conteúdo da aula sobre ' || m.titulo || '. Transcrição completa será adicionada.',
    m.descricao
  FROM public.course_modules m WHERE m.course_id = curso_id;
END $$;
