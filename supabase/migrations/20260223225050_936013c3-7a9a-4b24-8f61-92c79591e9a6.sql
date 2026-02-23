
-- Tipo de jornada
CREATE TYPE public.clube_jornada_tipo AS ENUM ('heroina', 'sombra', 'expressao_mundo');

-- Adicionar tipo à jornadas
ALTER TABLE public.clube_jornadas ADD COLUMN IF NOT EXISTS tipo public.clube_jornada_tipo NOT NULL DEFAULT 'heroina';

-- Log de auditoria do clube
CREATE TABLE public.clube_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela TEXT NOT NULL,
  registro_id UUID NOT NULL,
  acao TEXT NOT NULL, -- 'create', 'update', 'delete'
  campo_alterado TEXT,
  valor_anterior TEXT,
  valor_novo TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clube_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin acessa logs" ON public.clube_audit_log
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE INDEX idx_clube_audit_registro ON public.clube_audit_log(tabela, registro_id);
