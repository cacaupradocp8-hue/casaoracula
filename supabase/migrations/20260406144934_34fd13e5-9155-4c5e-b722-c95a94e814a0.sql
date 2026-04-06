
-- =============================================
-- SPRINT 2: PART 1 — FIX MUTABLE search_path
-- =============================================

-- 1. co_validate_training_attempt_status
CREATE OR REPLACE FUNCTION public.co_validate_training_attempt_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.status NOT IN ('rascunho', 'concluido') THEN
    RAISE EXCEPTION 'status must be rascunho or concluido';
  END IF;
  RETURN NEW;
END;
$function$;

-- 2. co_validate_training_case_nivel
CREATE OR REPLACE FUNCTION public.co_validate_training_case_nivel()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.nivel NOT IN ('guiado', 'semi_guiado', 'livre') THEN
    RAISE EXCEPTION 'nivel must be guiado, semi_guiado or livre';
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. co_validate_training_feedback_tipo
CREATE OR REPLACE FUNCTION public.co_validate_training_feedback_tipo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.tipo NOT IN ('coerente', 'ajuste', 'erro') THEN
    RAISE EXCEPTION 'tipo must be coerente, ajuste or erro';
  END IF;
  RETURN NEW;
END;
$function$;

-- 4. co_validate_training_reading_tipo
CREATE OR REPLACE FUNCTION public.co_validate_training_reading_tipo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  IF NEW.tipo NOT IN ('esperada', 'aceitavel', 'erro_comum') THEN
    RAISE EXCEPTION 'tipo must be esperada, aceitavel or erro_comum';
  END IF;
  RETURN NEW;
END;
$function$;

-- 5. enqueue_email
CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$function$;

-- 6. read_email_batch
CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$function$;

-- 7. delete_email
CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$function$;

-- 8. move_to_dlq
CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$function$;

-- 9. update_atelie_updated_at
CREATE OR REPLACE FUNCTION public.update_atelie_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 10. update_narroterapia_reacoes_updated_at
CREATE OR REPLACE FUNCTION public.update_narroterapia_reacoes_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- =============================================
-- SPRINT 2: PART 2 — POLICIES FOR RLS-ENABLED TABLES WITHOUT POLICIES
-- =============================================

-- ---- co_client_invites ----
CREATE POLICY "Therapist manages own invites"
ON public.co_client_invites FOR ALL
TO authenticated
USING (auth.uid() = therapist_user_id)
WITH CHECK (auth.uid() = therapist_user_id);

CREATE POLICY "Admin reads all invites"
ON public.co_client_invites FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ---- co_escutas ----
CREATE POLICY "Therapist manages linked escutas"
ON public.co_escutas FOR ALL
TO authenticated
USING (auth.uid() = therapist_user_id)
WITH CHECK (auth.uid() = therapist_user_id AND auth.uid() = created_by);

CREATE POLICY "Client reads own escutas"
ON public.co_escutas FOR SELECT
TO authenticated
USING (auth.uid() = client_user_id);

CREATE POLICY "Admin reads all escutas"
ON public.co_escutas FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ---- co_praticas ----
CREATE POLICY "Therapist manages linked praticas"
ON public.co_praticas FOR ALL
TO authenticated
USING (auth.uid() = therapist_user_id)
WITH CHECK (auth.uid() = therapist_user_id AND auth.uid() = created_by);

CREATE POLICY "Client reads own praticas"
ON public.co_praticas FOR SELECT
TO authenticated
USING (auth.uid() = client_user_id);

CREATE POLICY "Admin reads all praticas"
ON public.co_praticas FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- ---- co_registros_simbolicos ----
CREATE POLICY "Therapist manages linked registros"
ON public.co_registros_simbolicos FOR ALL
TO authenticated
USING (auth.uid() = therapist_user_id)
WITH CHECK (auth.uid() = therapist_user_id AND auth.uid() = created_by);

CREATE POLICY "Client reads shared registros"
ON public.co_registros_simbolicos FOR SELECT
TO authenticated
USING (auth.uid() = client_user_id AND shared_with_client = true);

CREATE POLICY "Admin reads all registros simbolicos"
ON public.co_registros_simbolicos FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));
