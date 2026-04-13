
-- Index on clientes.terapeuta_id for fast lookup by therapist
CREATE INDEX IF NOT EXISTS idx_clientes_terapeuta_id ON public.clientes USING btree (terapeuta_id);

-- Index on clientes status for filtering active clients
CREATE INDEX IF NOT EXISTS idx_clientes_status ON public.clientes USING btree (terapeuta_id, status);

-- Indexes on sessions for therapist and client lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_id ON public.sessions USING btree (client_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.sessions USING btree (date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user_client ON public.sessions USING btree (user_id, client_id);

-- Composite index on session_cases for filtered listing
CREATE INDEX IF NOT EXISTS idx_session_cases_therapist_status ON public.session_cases USING btree (therapist_id, status);
