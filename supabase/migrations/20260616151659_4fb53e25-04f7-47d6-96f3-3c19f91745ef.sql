
-- 1) Config table per estação
CREATE TABLE public.clube_colheita_rastros_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estacao_id uuid NOT NULL UNIQUE REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  rota_id uuid,
  titulo text NOT NULL DEFAULT 'Colheita dos Rastros',
  texto_abertura text NOT NULL DEFAULT 'Antes de encerrar esta travessia, a Casa convida você a recolher os rastros que ficaram pelo caminho.

Não há respostas certas.

Apenas aquilo que pediu escuta.',
  perguntas jsonb NOT NULL DEFAULT '[
    {"id":"p1","ordem":1,"obrigatoria":false,"texto":"Qual imagem, frase ou símbolo continua com você após esta estação?"},
    {"id":"p2","ordem":2,"obrigatoria":false,"texto":"O que esta travessia ajudou você a perceber que antes estava menos visível?"},
    {"id":"p3","ordem":3,"obrigatoria":false,"texto":"Que pergunta continua ecoando dentro de você?"},
    {"id":"p4","ordem":4,"obrigatoria":false,"texto":"O que desta estação você conseguiria utilizar na sua prática, trabalho ou forma de acompanhar pessoas?"},
    {"id":"p5","ordem":5,"obrigatoria":false,"texto":"Se a Casa permanecesse mais tempo neste território, o que você gostaria de aprofundar?"},
    {"id":"p6","ordem":6,"obrigatoria":false,"texto":"Se precisasse nomear esta experiência em uma palavra ou expressão, qual seria?"}
  ]'::jsonb,
  ativo boolean NOT NULL DEFAULT true,
  salvar_jardim_oficio boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clube_colheita_rastros_config TO authenticated;
GRANT ALL ON public.clube_colheita_rastros_config TO service_role;
ALTER TABLE public.clube_colheita_rastros_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read colheita config" ON public.clube_colheita_rastros_config
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage colheita config" ON public.clube_colheita_rastros_config
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_colheita_config_updated BEFORE UPDATE ON public.clube_colheita_rastros_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed: one config per existing estação
INSERT INTO public.clube_colheita_rastros_config (estacao_id, rota_id)
SELECT id, rota_id FROM public.clube_estacoes
ON CONFLICT (estacao_id) DO NOTHING;

-- 2) Registros (respostas)
CREATE TABLE public.clube_colheita_rastros_registros (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rota_id uuid,
  estacao_id uuid NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  respostas jsonb NOT NULL DEFAULT '{}'::jsonb,
  concluido boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_colheita_reg_user ON public.clube_colheita_rastros_registros(user_id, estacao_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clube_colheita_rastros_registros TO authenticated;
GRANT ALL ON public.clube_colheita_rastros_registros TO service_role;
ALTER TABLE public.clube_colheita_rastros_registros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user own colheita reg" ON public.clube_colheita_rastros_registros
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin all colheita reg" ON public.clube_colheita_rastros_registros
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- 3) Convite Fundadoras config
CREATE TABLE public.clube_fundadoras_convite_config (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  estacao_id uuid NOT NULL UNIQUE REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  rota_id uuid,
  ativo boolean NOT NULL DEFAULT false,
  titulo text NOT NULL DEFAULT '🌙 Conselho Vivo das Fundadoras',
  texto text NOT NULL DEFAULT 'Você concluiu esta estação.

Agora a Casa convida você para o encontro vivo com as outras fundadoras.

No grupo fechado, você receberá:

orientações para a aula de fechamento

bastidores da construção da Casa

espaço para compartilhar percepções

convite para a roda ao vivo das fundadoras',
  link_whatsapp text,
  texto_botao text NOT NULL DEFAULT 'Entrar no Grupo das Fundadoras',
  data_aula_ao_vivo timestamptz,
  descricao_aula text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.clube_fundadoras_convite_config TO authenticated;
GRANT ALL ON public.clube_fundadoras_convite_config TO service_role;
ALTER TABLE public.clube_fundadoras_convite_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read fundadora convite" ON public.clube_fundadoras_convite_config
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin manage fundadora convite" ON public.clube_fundadoras_convite_config
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER trg_fundadora_convite_updated BEFORE UPDATE ON public.clube_fundadoras_convite_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4) Clicks
CREATE TABLE public.clube_fundadoras_convite_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rota_id uuid,
  estacao_id uuid NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  clicou_grupo_whatsapp boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.clube_fundadoras_convite_clicks TO authenticated;
GRANT ALL ON public.clube_fundadoras_convite_clicks TO service_role;
ALTER TABLE public.clube_fundadoras_convite_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user insert own click" ON public.clube_fundadoras_convite_clicks
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user read own click" ON public.clube_fundadoras_convite_clicks
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 5) Helper: is_fundadora
CREATE OR REPLACE FUNCTION public.is_fundadora(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.acessos_fundadora
    WHERE user_id = _user_id
      AND status = 'ativo'
      AND (data_expiracao IS NULL OR data_expiracao > now())
  )
$$;
