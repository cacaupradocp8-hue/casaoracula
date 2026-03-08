
-- Exercise responses table for courses
CREATE TABLE public.course_exercise_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  resposta text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.course_exercise_responses ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_exercise_responses_user ON public.course_exercise_responses(user_id);
CREATE INDEX idx_exercise_responses_lesson ON public.course_exercise_responses(lesson_id);
CREATE UNIQUE INDEX idx_exercise_responses_unique ON public.course_exercise_responses(user_id, lesson_id);

CREATE POLICY "user_manage_own_responses" ON public.course_exercise_responses
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_exercise_responses_updated_at
  BEFORE UPDATE ON public.course_exercise_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the course
INSERT INTO public.courses (titulo, descricao, portal_minimo, publicado, destaque, ordem, tipo_curso, subtitulo, capa_url, pricing_model)
VALUES (
  'Despertando as Deusas: Arquétipos Femininos na CidaDELA',
  'Um mergulho profundo nos arquétipos femininos e como eles habitam os territórios da CidaDELA Interior. Cada módulo ativa uma deusa e o distrito que ela governa.',
  'aluna_formacao',
  true,
  true,
  1,
  'formacao',
  'Como os arquétipos femininos habitam sua cidade interior',
  null,
  'free'
);

-- Seed modules
DO $$
DECLARE
  curso_id uuid;
BEGIN
  SELECT id INTO curso_id FROM public.courses WHERE titulo = 'Despertando as Deusas: Arquétipos Femininos na CidaDELA' LIMIT 1;

  INSERT INTO public.course_modules (course_id, titulo, descricao, ordem, publicado, subtitulo) VALUES
    (curso_id, 'Introdução aos Arquétipos', 'O que são arquétipos femininos e como reconhecê-los na psique.', 1, true, 'Fundamentos da leitura arquetípica'),
    (curso_id, 'Ártemis: A Caçadora', 'A deusa da autonomia, da natureza selvagem e da independência.', 2, true, 'Território: Torres'),
    (curso_id, 'Atena: A Estrategista', 'A deusa da sabedoria, da estratégia e do discernimento.', 3, true, 'Território: Conselho Interior'),
    (curso_id, 'Afrodite: A Alquimista do Desejo', 'A deusa do amor, da criatividade e da transformação relacional.', 4, true, 'Território: Forja'),
    (curso_id, 'Deméter: A Grande Mãe', 'A deusa do cuidado, da nutrição e dos ciclos naturais.', 5, true, 'Território: Jardim dos Arquétipos'),
    (curso_id, 'Perséfone: A Guardiã do Submundo', 'A deusa da transição, do inconsciente e da transformação profunda.', 6, true, 'Território: Labirinto'),
    (curso_id, 'Héstia: O Fogo Interior', 'A deusa do centramento, do silêncio sagrado e da presença.', 7, true, 'Território: Praça da Integração'),
    (curso_id, 'Integração: A Dança das Deusas', 'Como as deusas coexistem, se complementam e se tensionam.', 8, true, 'A constelação arquetípica completa');

  -- Seed one lesson per module
  INSERT INTO public.course_lessons (module_id, titulo, ordem, publicado, content_type, texto_aula, descricao_curta)
  SELECT m.id, 'Aula Principal — ' || m.titulo, 1, true, 'video', 
    'Conteúdo da aula sobre ' || m.titulo || '. Este espaço será preenchido com a transcrição completa da aula.',
    m.descricao
  FROM public.course_modules m WHERE m.course_id = curso_id;
END $$;
