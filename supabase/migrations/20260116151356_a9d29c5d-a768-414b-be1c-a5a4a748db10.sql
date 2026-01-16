-- PASSO 1: Criar Portal 6 - Radiestesia Oracular na Sala da Formação
INSERT INTO conteudo_travessias (
  titulo,
  subtitulo,
  descricao,
  ordem,
  portal_minimo,
  publicado,
  sala_id,
  texto_introducao,
  descricao_pedagogica
) VALUES (
  'PORTAL 6 — Radiestesia Oracular',
  'Campos Vibracionais & Práticas de Escuta',
  'Portal dedicado às práticas radiestésicas, leitura de campos e instrumentos de percepção sutil.',
  6,
  'pre_iniciada',
  true,
  'ebb6c62d-7de0-4787-9d46-6c6dbab285f7',
  'A radiestesia é uma arte de escuta sutil, não de medição absoluta. Neste portal, você encontrará instrumentos para ler campos, não pessoas. Aqui, o pêndulo não responde perguntas — ele revela tensões. A mesa radiônica não cura — ela mapeia. E os gráficos não preveem — eles narram.',
  'Leitura de campo vibracional com abordagem ética e profissional. Não se trata de adivinhação ou diagnóstico, mas de escuta simbólica e prática contemplativa.'
);

-- PASSO 2: Atualizar a ferramenta Radiestesia para vincular ao Portal 6
UPDATE sala_ferramentas
SET 
  portal_id = (SELECT id FROM conteudo_travessias WHERE titulo LIKE 'PORTAL 6%' LIMIT 1),
  sala_id = 'ebb6c62d-7de0-4787-9d46-6c6dbab285f7',
  rota = '/radiestesia'
WHERE ferramenta_chave = 'radiestesia';