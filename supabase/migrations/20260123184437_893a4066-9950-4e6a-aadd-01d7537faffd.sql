-- Criar entrada em conteudo_travessias para a Travessia Zero
INSERT INTO conteudo_travessias (
  id,
  titulo,
  descricao,
  ordem,
  portal_minimo,
  publicado,
  subtitulo,
  texto_introducao
)
VALUES (
  '181fe90c-b556-4865-ba7c-686f283a7419', -- Usar mesmo ID da travessia
  'TRAVESSIA ZERO — O LIMIAR DA CASA',
  '7 dias para mapear seu ponto de partida antes de tentar mudar',
  0,
  'visitante',
  true,
  'Onde estou antes de tentar mudar?',
  'Esta travessia é um convite ao silêncio. Antes de buscar transformação, é preciso reconhecer onde você realmente está.'
)
ON CONFLICT (id) DO NOTHING;

-- Inserir os 7 dias da Travessia Zero na tabela conteudo_aulas
INSERT INTO conteudo_aulas (travessia_id, titulo, descricao_curta, ordem, publicado, portal_minimo)
VALUES
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 1 — O Silêncio', 'O que acontece quando paro de buscar resposta?', 1, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 2 — O Mapa', 'Onde realmente estou neste momento?', 2, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 3 — O Eco', 'O que repito sem perceber?', 3, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 4 — A Pausa', 'O que emerge quando não há pressa?', 4, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 5 — O Corpo', 'Onde meu corpo guarda tensão?', 5, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 6 — O Limiar', 'O que preciso soltar para atravessar?', 6, true, 'visitante'),
  ('181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 7 — A Decisão', 'Estou pronta para habitar?', 7, true, 'visitante')
ON CONFLICT DO NOTHING;