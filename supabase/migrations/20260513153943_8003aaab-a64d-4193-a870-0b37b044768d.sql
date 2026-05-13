-- 1. Inserir/Atualizar Planos
INSERT INTO public.plans (id, nome, portal_resultante, ativo)
VALUES 
  ('clube_mensal', 'Clube Orácula - Mensal', 'aluna', true),
  ('clube_anual', 'Clube Orácula - Anual', 'aluna', true),
  ('formacao_oracula', 'Formação Orácula', 'aluna', true)
ON CONFLICT (id) DO UPDATE SET 
  nome = EXCLUDED.nome,
  portal_resultante = EXCLUDED.portal_resultante,
  ativo = EXCLUDED.ativo;

-- 2. Criar tabela rockty_offer_mapping
CREATE TABLE IF NOT EXISTS public.rockty_offer_mapping (
    rockty_offer_id TEXT PRIMARY KEY,
    plan_id TEXT REFERENCES public.plans(id),
    portal_destino portal_type NOT NULL,
    produto_nome TEXT,
    duracao_dias INTEGER,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Inserir mapeamentos das ofertas Rockty
INSERT INTO public.rockty_offer_mapping (rockty_offer_id, plan_id, portal_destino, produto_nome, duracao_dias)
VALUES 
  ('karv9y4bewbdjcwbmvtwq', 'clube_mensal', 'aluna', 'Clube Orácula - Mensal', 30),
  ('uivtq6x6v718hymvlyyvfw', 'clube_anual', 'aluna', 'Clube Orácula - Anual', 365),
  ('868p01mow95v31b8162', 'clube_anual', 'aluna', 'Clube Orácula - Anual', 365),
  ('qqqmfhyjku7ou9kc70gg', 'formacao_oracula', 'aluna', 'Formação Orácula', 365)
ON CONFLICT (rockty_offer_id) DO UPDATE SET
  plan_id = EXCLUDED.plan_id,
  portal_destino = EXCLUDED.portal_destino,
  produto_nome = EXCLUDED.produto_nome,
  duracao_dias = EXCLUDED.duracao_dias;