-- Add new block type for Plasticity Map
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'plasticity_map';

-- Create the Psychic Plasticity Map tool in Sala da Pré-Iniciada (Portal 2 - Ego)
INSERT INTO sala_ferramentas (
  sala_id, 
  ferramenta_chave,
  ferramenta_nome, 
  ferramenta_descricao, 
  icone, 
  slug,
  rota,
  ordem, 
  ativa, 
  tipo, 
  portal_minimo, 
  has_blocks
)
VALUES (
  'ebb6c62d-7de0-4787-9d46-6c6dbab285f7',
  'plasticidade_psiquica',
  'Mapa de Plasticidade Psíquica',
  'Ferramenta de transformação consciente para compreender padrões infantis, desenvolver competências do ego e treinar novas respostas neuroplásticas.',
  'Brain',
  'plasticidade-psiquica',
  '/ferramentas/plasticidade-psiquica',
  10,
  true,
  'custom',
  'pre_iniciada',
  true
);