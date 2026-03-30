
-- ============================================
-- NÚCLEO TERAPEUTA-CLIENTE — CASA ORÁCULA
-- ============================================
-- Prefixo co_ conforme convenção do projeto
-- RLS será implementada na próxima etapa

-- ============================================
-- 1. ALTER clientes: adicionar vínculo bidirecional
-- ============================================
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS client_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS invitation_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS notes_internal text;

-- Unique constraint: um terapeuta não pode vincular o mesmo user duas vezes
-- (client_user_id pode ser null para clientes ainda sem conta)
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_therapist_client_user
  ON public.clientes (terapeuta_id, client_user_id)
  WHERE client_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_clientes_client_user_id ON public.clientes(client_user_id);

-- ============================================
-- 2. co_client_invites
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_client_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_email text NOT NULL,
  token text NOT NULL DEFAULT gen_random_uuid()::text,
  status text NOT NULL DEFAULT 'pending',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_client_invites_status_check CHECK (status IN ('pending', 'accepted', 'expired', 'canceled'))
);

CREATE INDEX IF NOT EXISTS idx_co_client_invites_therapist ON public.co_client_invites(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_client_invites_email ON public.co_client_invites(client_email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_co_client_invites_token ON public.co_client_invites(token);

-- ============================================
-- 3. co_jardins
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_jardins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  visibility_scope text NOT NULL DEFAULT 'therapist_only',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_jardins_status_check CHECK (status IN ('active', 'archived')),
  CONSTRAINT co_jardins_visibility_check CHECK (visibility_scope IN ('therapist_only', 'shared', 'full'))
);

CREATE INDEX IF NOT EXISTS idx_co_jardins_client ON public.co_jardins(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_jardins_therapist ON public.co_jardins(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_jardins_status ON public.co_jardins(status);

-- ============================================
-- 4. co_jardim_entries
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_jardim_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jardim_id uuid NOT NULL REFERENCES public.co_jardins(id) ON DELETE CASCADE,
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  entry_type text NOT NULL DEFAULT 'anotacao',
  content text,
  visibility_to_client boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_jardim_entries_type_check CHECK (entry_type IN ('reflexao', 'pratica', 'devolutiva', 'leitura', 'anotacao', 'outro'))
);

CREATE INDEX IF NOT EXISTS idx_co_jardim_entries_jardim ON public.co_jardim_entries(jardim_id);
CREATE INDEX IF NOT EXISTS idx_co_jardim_entries_client ON public.co_jardim_entries(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_jardim_entries_therapist ON public.co_jardim_entries(therapist_user_id);

-- ============================================
-- 5. co_sessoes
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_sessoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'scheduled',
  session_date timestamptz,
  shared_with_client boolean NOT NULL DEFAULT false,
  summary_internal text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_sessoes_status_check CHECK (status IN ('scheduled', 'in_progress', 'completed', 'canceled', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_co_sessoes_client ON public.co_sessoes(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_sessoes_therapist ON public.co_sessoes(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_sessoes_status ON public.co_sessoes(status);
CREATE INDEX IF NOT EXISTS idx_co_sessoes_date ON public.co_sessoes(session_date);

-- ============================================
-- 6. co_registros_simbolicos
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_registros_simbolicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id uuid REFERENCES public.co_sessoes(id) ON DELETE SET NULL,
  jardim_id uuid REFERENCES public.co_jardins(id) ON DELETE SET NULL,
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo text NOT NULL DEFAULT 'outro',
  conteudo text,
  shared_with_client boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_registros_tipo_check CHECK (tipo IN ('leitura', 'porta', 'travessia', 'devolutiva', 'hipotese', 'sintese', 'outro'))
);

CREATE INDEX IF NOT EXISTS idx_co_registros_client ON public.co_registros_simbolicos(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_registros_therapist ON public.co_registros_simbolicos(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_registros_sessao ON public.co_registros_simbolicos(sessao_id);
CREATE INDEX IF NOT EXISTS idx_co_registros_jardim ON public.co_registros_simbolicos(jardim_id);
CREATE INDEX IF NOT EXISTS idx_co_registros_tipo ON public.co_registros_simbolicos(tipo);

-- ============================================
-- 7. co_praticas
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_praticas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sessao_id uuid REFERENCES public.co_sessoes(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  descricao text,
  status text NOT NULL DEFAULT 'proposta',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_praticas_status_check CHECK (status IN ('proposta', 'em_andamento', 'concluida', 'cancelada'))
);

CREATE INDEX IF NOT EXISTS idx_co_praticas_client ON public.co_praticas(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_praticas_therapist ON public.co_praticas(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_praticas_sessao ON public.co_praticas(sessao_id);
CREATE INDEX IF NOT EXISTS idx_co_praticas_status ON public.co_praticas(status);

-- ============================================
-- 8. co_escutas
-- ============================================
CREATE TABLE IF NOT EXISTS public.co_escutas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sessao_id uuid REFERENCES public.co_sessoes(id) ON DELETE SET NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo text NOT NULL DEFAULT 'escuta',
  conteudo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT co_escutas_tipo_check CHECK (tipo IN ('escuta', 'resposta', 'reflexao', 'devolutiva', 'outro'))
);

CREATE INDEX IF NOT EXISTS idx_co_escutas_client ON public.co_escutas(client_user_id);
CREATE INDEX IF NOT EXISTS idx_co_escutas_therapist ON public.co_escutas(therapist_user_id);
CREATE INDEX IF NOT EXISTS idx_co_escutas_sessao ON public.co_escutas(sessao_id);
CREATE INDEX IF NOT EXISTS idx_co_escutas_tipo ON public.co_escutas(tipo);

-- ============================================
-- TRIGGERS: updated_at automático
-- ============================================
CREATE TRIGGER co_client_invites_updated_at BEFORE UPDATE ON public.co_client_invites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_jardins_updated_at BEFORE UPDATE ON public.co_jardins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_jardim_entries_updated_at BEFORE UPDATE ON public.co_jardim_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_sessoes_updated_at BEFORE UPDATE ON public.co_sessoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_registros_simbolicos_updated_at BEFORE UPDATE ON public.co_registros_simbolicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_praticas_updated_at BEFORE UPDATE ON public.co_praticas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER co_escutas_updated_at BEFORE UPDATE ON public.co_escutas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE RLS (sem policies ainda — próxima etapa)
-- ============================================
ALTER TABLE public.co_client_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_jardins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_jardim_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_registros_simbolicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_praticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_escutas ENABLE ROW LEVEL SECURITY;
