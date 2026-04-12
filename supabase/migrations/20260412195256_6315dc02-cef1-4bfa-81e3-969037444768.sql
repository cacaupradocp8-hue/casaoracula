
-- Update Explorar: remove Big5 and Eneagrama from inclusoes
UPDATE ofertas 
SET inclusoes = ARRAY['Cartografia Psíquica', 'Leitura Simbólica', 'Jardim da Psique', 'Sala da Visitante'],
    updated_at = now()
WHERE id = '24ad946e-ffb1-473a-841c-674ec95e07d2';

-- Update Clube Mensal: correct price and link
UPDATE ofertas 
SET preco = 'R$ 97/mês',
    link_botao = 'https://pay.rockty.com/pjo9ceihykihwx1gixhspq?off=mayikrzz0kc58ijeqs9a',
    updated_at = now()
WHERE id = 'c19c0094-4c57-4d76-b23a-e2096836ae0a';

-- Update Clube Anual: correct price
UPDATE ofertas 
SET preco = 'R$ 897/ano',
    updated_at = now()
WHERE id = 'd7674737-d4fd-4cf2-9deb-7cea75f632c6';
