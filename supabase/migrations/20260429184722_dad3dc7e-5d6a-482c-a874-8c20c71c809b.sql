-- Unified Security for Clube Livro Legacy Tables

-- 1. clube_livro_ciclos
DROP POLICY IF EXISTS "Admin gerencia ciclos" ON public.clube_livro_ciclos;
DROP POLICY IF EXISTS "Ciclos publicados visíveis para autenticados" ON public.clube_livro_ciclos;

CREATE POLICY "Admin CRUD clube_livro_ciclos" ON public.clube_livro_ciclos FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read published clube_livro_ciclos" ON public.clube_livro_ciclos FOR SELECT USING (((publicado = true) AND (ativo = true)) OR is_admin(auth.uid()));

-- 2. clube_livro_fases
DROP POLICY IF EXISTS "Admin gerencia fases" ON public.clube_livro_fases;
DROP POLICY IF EXISTS "Fases visíveis para autenticados" ON public.clube_livro_fases;

CREATE POLICY "Admin CRUD clube_livro_fases" ON public.clube_livro_fases FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read active clube_livro_fases" ON public.clube_livro_fases FOR SELECT USING ((ativo = true) OR is_admin(auth.uid()));

-- 3. clube_livro_escutas
DROP POLICY IF EXISTS "Admin gerencia escutas" ON public.clube_livro_escutas;
DROP POLICY IF EXISTS "Escutas visíveis para autenticados" ON public.clube_livro_escutas;

CREATE POLICY "Admin CRUD clube_livro_escutas" ON public.clube_livro_escutas FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read active clube_livro_escutas" ON public.clube_livro_escutas FOR SELECT USING ((ativo = true) OR is_admin(auth.uid()));

-- 4. clube_livro_perguntas
DROP POLICY IF EXISTS "Admin gerencia perguntas" ON public.clube_livro_perguntas;
DROP POLICY IF EXISTS "Perguntas visíveis para autenticados" ON public.clube_livro_perguntas;

CREATE POLICY "Admin CRUD clube_livro_perguntas" ON public.clube_livro_perguntas FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read active clube_livro_perguntas" ON public.clube_livro_perguntas FOR SELECT USING ((ativo = true) OR is_admin(auth.uid()));

-- 5. clube_livro_aulas
DROP POLICY IF EXISTS "Admins can manage clube_livro_aulas" ON public.clube_livro_aulas;
DROP POLICY IF EXISTS "Authenticated users can read active published aulas" ON public.clube_livro_aulas;

CREATE POLICY "Admin CRUD clube_livro_aulas" ON public.clube_livro_aulas FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read published clube_livro_aulas" ON public.clube_livro_aulas FOR SELECT USING (((publicado = true) AND (ativo = true)) OR is_admin(auth.uid()));

-- 6. clube_conteudo_semanal
DROP POLICY IF EXISTS "Admin gerencia conteúdo semanal" ON public.clube_conteudo_semanal;
DROP POLICY IF EXISTS "Conteúdo semanal visível para autenticados" ON public.clube_conteudo_semanal;

CREATE POLICY "Admin CRUD clube_conteudo_semanal" ON public.clube_conteudo_semanal FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read active clube_conteudo_semanal" ON public.clube_conteudo_semanal FOR SELECT USING ((ativo = true) OR is_admin(auth.uid()));

-- 7. club_cycles (Legacy)
DROP POLICY IF EXISTS "Admins can manage club_cycles" ON public.club_cycles;
DROP POLICY IF EXISTS "Club cycles are viewable by authenticated users" ON public.club_cycles;

ALTER TABLE public.club_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD club_cycles" ON public.club_cycles FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read authenticated club_cycles" ON public.club_cycles FOR SELECT USING (auth.role() = 'authenticated');

-- 8. club_books (Legacy)
DROP POLICY IF EXISTS "Admins can manage club_books" ON public.club_books;
DROP POLICY IF EXISTS "Club books are viewable by authenticated users" ON public.club_books;

ALTER TABLE public.club_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD club_books" ON public.club_books FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read authenticated club_books" ON public.club_books FOR SELECT USING (auth.role() = 'authenticated');

-- 9. club_meetings (Legacy)
DROP POLICY IF EXISTS "Admins can manage club_meetings" ON public.club_meetings;
DROP POLICY IF EXISTS "Club meetings are viewable by authenticated users" ON public.club_meetings;

ALTER TABLE public.club_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD club_meetings" ON public.club_meetings FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read authenticated club_meetings" ON public.club_meetings FOR SELECT USING (auth.role() = 'authenticated');

-- 10. club_tools (Legacy)
ALTER TABLE public.club_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin CRUD club_tools" ON public.club_tools FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Student Read authenticated club_tools" ON public.club_tools FOR SELECT USING (auth.role() = 'authenticated');
