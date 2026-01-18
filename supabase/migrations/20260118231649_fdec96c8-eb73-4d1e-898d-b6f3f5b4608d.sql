-- =============================================
-- CASA ORÁCULA - Data Model
-- =============================================

-- Enum for room types
CREATE TYPE casa_room AS ENUM ('sustentacao', 'leitura', 'circulo');

-- Enum for media types
CREATE TYPE casa_media_type AS ENUM ('audio', 'text', 'video', 'link', 'pdf');

-- =============================================
-- Table: casa_posts (content for Sustentação & Leitura)
-- =============================================
CREATE TABLE public.casa_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room casa_room NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  conteudo TEXT,
  media_url TEXT,
  media_type casa_media_type DEFAULT 'text',
  duracao_segundos INTEGER,
  tags TEXT[],
  publicado BOOLEAN DEFAULT false,
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  portal_minimo portal_type DEFAULT 'iniciada',
  autor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.casa_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for casa_posts
CREATE POLICY "Admins can manage all casa_posts"
  ON public.casa_posts FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can read published casa_posts with portal access"
  ON public.casa_posts FOR SELECT
  USING (
    publicado = true
    AND has_portal_access(auth.uid(), portal_minimo)
  );

-- Index for performance
CREATE INDEX idx_casa_posts_room ON public.casa_posts(room);
CREATE INDEX idx_casa_posts_publicado ON public.casa_posts(publicado) WHERE publicado = true;
CREATE INDEX idx_casa_posts_room_ordem ON public.casa_posts(room, ordem DESC, created_at DESC);

-- =============================================
-- Table: casa_circulo_threads (forum topics)
-- =============================================
CREATE TABLE public.casa_circulo_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'aberto' CHECK (status IN ('aberto', 'fechado', 'moderado')),
  fixado BOOLEAN DEFAULT false,
  respostas_count INTEGER DEFAULT 0,
  ultima_atividade TIMESTAMPTZ DEFAULT now(),
  portal_minimo portal_type DEFAULT 'iniciada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.casa_circulo_threads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for threads
CREATE POLICY "Admins can manage all threads"
  ON public.casa_circulo_threads FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can read threads with portal access"
  ON public.casa_circulo_threads FOR SELECT
  USING (has_portal_access(auth.uid(), portal_minimo));

CREATE POLICY "Users can create threads if portal access"
  ON public.casa_circulo_threads FOR INSERT
  WITH CHECK (
    has_portal_access(auth.uid(), 'iniciada')
    AND autor_id = auth.uid()
  );

CREATE POLICY "Users can update own threads"
  ON public.casa_circulo_threads FOR UPDATE
  USING (autor_id = auth.uid())
  WITH CHECK (autor_id = auth.uid());

-- Index
CREATE INDEX idx_casa_threads_status ON public.casa_circulo_threads(status);
CREATE INDEX idx_casa_threads_ultima_atividade ON public.casa_circulo_threads(ultima_atividade DESC);

-- =============================================
-- Table: casa_circulo_replies (forum replies)
-- =============================================
CREATE TABLE public.casa_circulo_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.casa_circulo_threads(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  autor_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.casa_circulo_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for replies
CREATE POLICY "Admins can manage all replies"
  ON public.casa_circulo_replies FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can read replies if thread access"
  ON public.casa_circulo_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.casa_circulo_threads t
      WHERE t.id = thread_id
      AND has_portal_access(auth.uid(), t.portal_minimo)
    )
  );

CREATE POLICY "Users can create replies"
  ON public.casa_circulo_replies FOR INSERT
  WITH CHECK (
    has_portal_access(auth.uid(), 'iniciada')
    AND autor_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.casa_circulo_threads t
      WHERE t.id = thread_id AND t.status = 'aberto'
    )
  );

CREATE POLICY "Users can update own replies"
  ON public.casa_circulo_replies FOR UPDATE
  USING (autor_id = auth.uid())
  WITH CHECK (autor_id = auth.uid());

-- Index
CREATE INDEX idx_casa_replies_thread ON public.casa_circulo_replies(thread_id, created_at ASC);

-- =============================================
-- Function to update reply count
-- =============================================
CREATE OR REPLACE FUNCTION public.update_thread_reply_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE casa_circulo_threads 
    SET respostas_count = respostas_count + 1,
        ultima_atividade = now()
    WHERE id = NEW.thread_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE casa_circulo_threads 
    SET respostas_count = GREATEST(0, respostas_count - 1)
    WHERE id = OLD.thread_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for reply count
CREATE TRIGGER trigger_update_thread_reply_count
AFTER INSERT OR DELETE ON public.casa_circulo_replies
FOR EACH ROW EXECUTE FUNCTION public.update_thread_reply_count();

-- Updated_at triggers
CREATE TRIGGER update_casa_posts_updated_at
  BEFORE UPDATE ON public.casa_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_casa_threads_updated_at
  BEFORE UPDATE ON public.casa_circulo_threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_casa_replies_updated_at
  BEFORE UPDATE ON public.casa_circulo_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();