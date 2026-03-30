
-- Update ofertas to match correct Clube Oracular plans with Rockty links
-- First, deactivate old plans
UPDATE ofertas SET ativo = false;

-- Update existing rows or insert correct ones
-- Plano Gratuito (explorar)
INSERT INTO ofertas (id, nome, subtitulo, tipo, preco, gratuito, texto_botao, link_botao, badge, inclusoes, simbolo, ordem, ativo, destaque)
VALUES (
  gen_random_uuid(),
  'Explorar',
  'Conheça o método e as ferramentas iniciais',
  'gratuito',
  NULL,
  true,
  'Começar Grátis',
  '/sala-da-visitante',
  NULL,
  ARRAY['Big5 Simbólico', 'Eneagrama Oracular', 'Jardim da Psique', 'Sala da Visitante'],
  '☽',
  1,
  true,
  false
);

-- Plano Mensal
INSERT INTO ofertas (id, nome, subtitulo, tipo, preco, gratuito, texto_botao, link_botao, badge, inclusoes, simbolo, ordem, ativo, destaque)
VALUES (
  gen_random_uuid(),
  'Clube Mensal',
  'Acesso completo ao Clube Oracular, mês a mês',
  'assinatura',
  'R$ 37,90/mês',
  false,
  'Entrar no Clube',
  'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=karv9y4bewbdjcwbmvtwq',
  NULL,
  ARRAY['CidaDELA Interior completa', 'Clube de Leitura Oracular', 'Laboratório 80/20', 'Jardim da Psique & do Ofício', 'Cancele quando quiser'],
  '🜂',
  2,
  true,
  false
);

-- Plano Anual
INSERT INTO ofertas (id, nome, subtitulo, tipo, preco, gratuito, texto_botao, link_botao, badge, inclusoes, simbolo, ordem, ativo, destaque)
VALUES (
  gen_random_uuid(),
  'Clube Anual',
  'O caminho mais escolhido — economia de 2 meses',
  'assinatura',
  'R$ 379,00/ano',
  false,
  'Entrar no Clube',
  'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=2tgmh6vsiki7fg0buxdfxq',
  'Mais escolhido',
  ARRAY['Tudo do plano mensal', 'Economia de 2 meses', 'Acesso garantido por 12 meses', 'Laboratório 80/20', 'Jardim da Psique & do Ofício'],
  '✦',
  3,
  true,
  true
);
