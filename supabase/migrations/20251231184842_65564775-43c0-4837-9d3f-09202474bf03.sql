
-- Add therapist_id to big5_registros (existing table serves as big5_resposta)
ALTER TABLE public.big5_registros 
ADD COLUMN IF NOT EXISTS therapist_id uuid REFERENCES auth.users(id);

-- Create enum for Big5 dimensions
DO $$ BEGIN
  CREATE TYPE big5_dimensao AS ENUM ('abertura', 'conscienciosidade', 'extroversao', 'amabilidade', 'neuroticismo');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create enum for question types
DO $$ BEGIN
  CREATE TYPE big5_tipo_pergunta AS ENUM ('escala_1_5', 'texto');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create big5_questionario table
CREATE TABLE IF NOT EXISTS public.big5_questionario (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dimensao big5_dimensao NOT NULL,
  texto_pergunta text NOT NULL,
  tipo big5_tipo_pergunta NOT NULL DEFAULT 'escala_1_5',
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on big5_questionario
ALTER TABLE public.big5_questionario ENABLE ROW LEVEL SECURITY;

-- RLS policies for big5_questionario
CREATE POLICY "Admins can manage big5 questionnaire"
  ON public.big5_questionario
  FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view active big5 questions"
  ON public.big5_questionario
  FOR SELECT
  USING (ativo = true);

-- Update RLS on big5_registros to allow therapist editing
DROP POLICY IF EXISTS "Users can manage own Big5 records" ON public.big5_registros;

CREATE POLICY "Users can manage own Big5 records"
  ON public.big5_registros
  FOR ALL
  USING (auth.uid() = user_id OR auth.uid() = therapist_id);

CREATE POLICY "Therapists can manage client Big5 records"
  ON public.big5_registros
  FOR ALL
  USING (auth.uid() = therapist_id);

-- Trigger for updated_at on big5_questionario
CREATE TRIGGER update_big5_questionario_updated_at
  BEFORE UPDATE ON public.big5_questionario
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample questions for each dimension
INSERT INTO public.big5_questionario (dimensao, texto_pergunta, tipo, ordem) VALUES
  ('abertura', 'Você gosta de experimentar coisas novas?', 'escala_1_5', 1),
  ('abertura', 'Você tem uma imaginação ativa?', 'escala_1_5', 2),
  ('conscienciosidade', 'Você costuma planejar suas atividades com antecedência?', 'escala_1_5', 1),
  ('conscienciosidade', 'Você é organizado(a) com seus pertences?', 'escala_1_5', 2),
  ('extroversao', 'Você se sente energizado(a) em situações sociais?', 'escala_1_5', 1),
  ('extroversao', 'Você gosta de ser o centro das atenções?', 'escala_1_5', 2),
  ('amabilidade', 'Você costuma ajudar os outros sem esperar nada em troca?', 'escala_1_5', 1),
  ('amabilidade', 'Você evita conflitos sempre que possível?', 'escala_1_5', 2),
  ('neuroticismo', 'Você se preocupa frequentemente com o futuro?', 'escala_1_5', 1),
  ('neuroticismo', 'Você se sente ansioso(a) com facilidade?', 'escala_1_5', 2);
