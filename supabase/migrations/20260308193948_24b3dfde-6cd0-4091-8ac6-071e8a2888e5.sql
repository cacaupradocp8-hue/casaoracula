
-- Community Posts
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo text NOT NULL,
  imagem_url text,
  video_url text,
  curtidas_count integer DEFAULT 0,
  comentarios_count integer DEFAULT 0,
  publicado boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read published posts" ON public.community_posts FOR SELECT TO authenticated USING (publicado = true);
CREATE POLICY "Users create own posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Users update own posts" ON public.community_posts FOR UPDATE TO authenticated USING (auth.uid() = autor_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE TO authenticated USING (auth.uid() = autor_id);
CREATE POLICY "Admin manage all posts" ON public.community_posts FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Community Likes
CREATE TABLE public.community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read likes" ON public.community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users manage own likes" ON public.community_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own likes" ON public.community_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Community Comments
CREATE TABLE public.community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  autor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read comments" ON public.community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own comments" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Users delete own comments" ON public.community_comments FOR DELETE TO authenticated USING (auth.uid() = autor_id);
CREATE POLICY "Admin manage comments" ON public.community_comments FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Forums
CREATE TABLE public.community_forums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  icone text DEFAULT '💬',
  ordem integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read forums" ON public.community_forums FOR SELECT TO authenticated USING (ativo = true);
CREATE POLICY "Admin manage forums" ON public.community_forums FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Forum Topics
CREATE TABLE public.community_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id uuid NOT NULL REFERENCES public.community_forums(id) ON DELETE CASCADE,
  autor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  conteudo text NOT NULL,
  fixado boolean DEFAULT false,
  respostas_count integer DEFAULT 0,
  ultima_atividade timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read topics" ON public.community_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create topics" ON public.community_topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Users update own topics" ON public.community_topics FOR UPDATE TO authenticated USING (auth.uid() = autor_id);
CREATE POLICY "Admin manage topics" ON public.community_topics FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Topic Replies
CREATE TABLE public.community_topic_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES public.community_topics(id) ON DELETE CASCADE,
  autor_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_topic_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read replies" ON public.community_topic_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create replies" ON public.community_topic_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Admin manage replies" ON public.community_topic_replies FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Update topic reply count trigger
CREATE OR REPLACE FUNCTION public.update_topic_reply_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_topics SET respostas_count = respostas_count + 1, ultima_atividade = now() WHERE id = NEW.topic_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_topics SET respostas_count = GREATEST(0, respostas_count - 1) WHERE id = OLD.topic_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;
CREATE TRIGGER trg_topic_reply_count AFTER INSERT OR DELETE ON public.community_topic_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_reply_count();

-- Update post comment count trigger
CREATE OR REPLACE FUNCTION public.update_post_comment_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comentarios_count = comentarios_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comentarios_count = GREATEST(0, comentarios_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;
CREATE TRIGGER trg_post_comment_count AFTER INSERT OR DELETE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comment_count();

-- Update post like count trigger
CREATE OR REPLACE FUNCTION public.update_post_like_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET curtidas_count = curtidas_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET curtidas_count = GREATEST(0, curtidas_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;
CREATE TRIGGER trg_post_like_count AFTER INSERT OR DELETE ON public.community_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_like_count();

-- Groups
CREATE TABLE public.community_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  criador_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  privado boolean DEFAULT false,
  membros_count integer DEFAULT 1,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read public groups" ON public.community_groups FOR SELECT TO authenticated USING (ativo = true);
CREATE POLICY "Users create groups" ON public.community_groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = criador_id);
CREATE POLICY "Creators update groups" ON public.community_groups FOR UPDATE TO authenticated USING (auth.uid() = criador_id);
CREATE POLICY "Admin manage groups" ON public.community_groups FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Group Members
CREATE TABLE public.community_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'membro',
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);
ALTER TABLE public.community_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read group members" ON public.community_group_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users join groups" ON public.community_group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave groups" ON public.community_group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin manage members" ON public.community_group_members FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Facilitadora Directory
CREATE TABLE public.facilitadora_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  perfil_publico boolean DEFAULT false,
  voz_conducao text,
  especializacoes text[] DEFAULT '{}',
  bio text,
  cidade text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.facilitadora_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read public profiles" ON public.facilitadora_profiles FOR SELECT TO authenticated USING (perfil_publico = true);
CREATE POLICY "Users manage own profile" ON public.facilitadora_profiles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin read all profiles" ON public.facilitadora_profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Community Events
CREATE TABLE public.community_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  data_evento timestamptz NOT NULL,
  link text,
  tipo text DEFAULT 'webinar',
  criador_id uuid REFERENCES auth.users(id),
  participantes_count integer DEFAULT 0,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read events" ON public.community_events FOR SELECT TO authenticated USING (ativo = true);
CREATE POLICY "Admin manage events" ON public.community_events FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Event Participation
CREATE TABLE public.community_event_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE public.community_event_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read participants" ON public.community_event_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users participate" ON public.community_event_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave" ON public.community_event_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
