
-- ============================================
-- MIGRATION: Jardim + Sessões — Schema + RLS + Triggers
-- ============================================

-- 1. SCHEMA CHANGES
ALTER TABLE public.co_jardim_entries
  ADD COLUMN IF NOT EXISTS shared_with_therapist boolean NOT NULL DEFAULT false;

ALTER TABLE public.co_sessoes
  ADD COLUMN IF NOT EXISTS jardim_ref_id uuid REFERENCES public.co_jardins(id);

ALTER TABLE public.co_jardins
  ALTER COLUMN visibility_scope SET DEFAULT 'client_owned';

-- 2. HELPER FUNCTION (uses client_user_id, status = 'ativo')
CREATE OR REPLACE FUNCTION public.co_is_linked_therapist(_client_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clientes
    WHERE client_user_id = _client_user_id
      AND terapeuta_id = auth.uid()
      AND status = 'ativo'
  )
$$;

-- 3. OWNERSHIP TRIGGER — co_jardim_entries
CREATE OR REPLACE FUNCTION public.co_protect_entry_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id THEN
    RAISE EXCEPTION 'Cannot change client_user_id';
  END IF;
  IF NEW.therapist_user_id IS DISTINCT FROM OLD.therapist_user_id THEN
    RAISE EXCEPTION 'Cannot change therapist_user_id';
  END IF;
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'Cannot change created_by';
  END IF;
  IF OLD.shared_with_therapist IS DISTINCT FROM NEW.shared_with_therapist
     AND auth.uid() = OLD.therapist_user_id THEN
    RAISE EXCEPTION 'Therapist cannot toggle shared_with_therapist';
  END IF;
  IF OLD.visibility_to_client IS DISTINCT FROM NEW.visibility_to_client
     AND auth.uid() = OLD.client_user_id THEN
    RAISE EXCEPTION 'Client cannot toggle visibility_to_client';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_co_protect_entry_ownership ON public.co_jardim_entries;
CREATE TRIGGER trg_co_protect_entry_ownership
  BEFORE UPDATE ON public.co_jardim_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.co_protect_entry_ownership();

-- OWNERSHIP TRIGGER — co_sessoes
CREATE OR REPLACE FUNCTION public.co_protect_sessao_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id THEN
    RAISE EXCEPTION 'Cannot change client_user_id';
  END IF;
  IF NEW.therapist_user_id IS DISTINCT FROM OLD.therapist_user_id THEN
    RAISE EXCEPTION 'Cannot change therapist_user_id';
  END IF;
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'Cannot change created_by';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_co_protect_sessao_ownership ON public.co_sessoes;
CREATE TRIGGER trg_co_protect_sessao_ownership
  BEFORE UPDATE ON public.co_sessoes
  FOR EACH ROW
  EXECUTE FUNCTION public.co_protect_sessao_ownership();

-- OWNERSHIP TRIGGER — co_jardins
CREATE OR REPLACE FUNCTION public.co_protect_jardim_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_user_id IS DISTINCT FROM OLD.client_user_id THEN
    RAISE EXCEPTION 'Cannot change client_user_id';
  END IF;
  IF NEW.therapist_user_id IS DISTINCT FROM OLD.therapist_user_id THEN
    RAISE EXCEPTION 'Cannot change therapist_user_id';
  END IF;
  IF NEW.created_by IS DISTINCT FROM OLD.created_by THEN
    RAISE EXCEPTION 'Cannot change created_by';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_co_protect_jardim_ownership ON public.co_jardins;
CREATE TRIGGER trg_co_protect_jardim_ownership
  BEFORE UPDATE ON public.co_jardins
  FOR EACH ROW
  EXECUTE FUNCTION public.co_protect_jardim_ownership();

-- 4. RLS — co_jardins
CREATE POLICY "Admin select co_jardins"
  ON public.co_jardins FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Therapist select co_jardins"
  ON public.co_jardins FOR SELECT TO authenticated
  USING (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Client select co_jardins"
  ON public.co_jardins FOR SELECT TO authenticated
  USING (client_user_id = auth.uid());

CREATE POLICY "Therapist insert co_jardins"
  ON public.co_jardins FOR INSERT TO authenticated
  WITH CHECK (therapist_user_id = auth.uid() AND created_by = auth.uid() AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Therapist update co_jardins"
  ON public.co_jardins FOR UPDATE TO authenticated
  USING (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id))
  WITH CHECK (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id));

-- 5. RLS — co_jardim_entries
CREATE POLICY "Admin select co_jardim_entries"
  ON public.co_jardim_entries FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Therapist select co_jardim_entries"
  ON public.co_jardim_entries FOR SELECT TO authenticated
  USING (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id) AND (created_by = auth.uid() OR shared_with_therapist = true));

CREATE POLICY "Client select co_jardim_entries"
  ON public.co_jardim_entries FOR SELECT TO authenticated
  USING (client_user_id = auth.uid() AND (created_by = auth.uid() OR visibility_to_client = true));

CREATE POLICY "Therapist insert co_jardim_entries"
  ON public.co_jardim_entries FOR INSERT TO authenticated
  WITH CHECK (therapist_user_id = auth.uid() AND created_by = auth.uid() AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Client insert co_jardim_entries"
  ON public.co_jardim_entries FOR INSERT TO authenticated
  WITH CHECK (client_user_id = auth.uid() AND created_by = auth.uid());

CREATE POLICY "Therapist update co_jardim_entries"
  ON public.co_jardim_entries FOR UPDATE TO authenticated
  USING (created_by = auth.uid() AND therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id))
  WITH CHECK (created_by = auth.uid() AND therapist_user_id = auth.uid());

CREATE POLICY "Client update co_jardim_entries"
  ON public.co_jardim_entries FOR UPDATE TO authenticated
  USING (created_by = auth.uid() AND client_user_id = auth.uid())
  WITH CHECK (created_by = auth.uid() AND client_user_id = auth.uid());

-- 6. RLS — co_sessoes
CREATE POLICY "Admin select co_sessoes"
  ON public.co_sessoes FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Therapist select co_sessoes"
  ON public.co_sessoes FOR SELECT TO authenticated
  USING (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Client select co_sessoes"
  ON public.co_sessoes FOR SELECT TO authenticated
  USING (client_user_id = auth.uid() AND shared_with_client = true);

CREATE POLICY "Therapist insert co_sessoes"
  ON public.co_sessoes FOR INSERT TO authenticated
  WITH CHECK (therapist_user_id = auth.uid() AND created_by = auth.uid() AND public.co_is_linked_therapist(client_user_id));

CREATE POLICY "Therapist update co_sessoes"
  ON public.co_sessoes FOR UPDATE TO authenticated
  USING (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id))
  WITH CHECK (therapist_user_id = auth.uid() AND public.co_is_linked_therapist(client_user_id));

-- 7. VIEW admin segura para clientes
CREATE OR REPLACE VIEW public.clientes_admin_safe
WITH (security_invoker = true)
AS
SELECT
  id, client_user_id, terapeuta_id, nome, status,
  codigo_interno, data_inicio, created_at, updated_at
FROM public.clientes;

GRANT SELECT ON public.clientes_admin_safe TO authenticated;
