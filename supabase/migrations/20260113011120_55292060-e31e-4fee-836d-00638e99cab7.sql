-- =====================================================
-- CENTRO DE ORÁCULOS - DATABASE SCHEMA
-- =====================================================

-- Enum para status de conteúdo
CREATE TYPE public.oracle_content_status AS ENUM ('draft', 'published', 'archived');

-- Enum para tipo de layout de tiragem
CREATE TYPE public.oracle_spread_layout AS ENUM ('line', 'cross', 'circle', 'spiral', 'custom');

-- Enum para nível de dificuldade de carta
CREATE TYPE public.oracle_card_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- =====================================================
-- A) ORACLE DECKS (Baralhos/Oráculos)
-- =====================================================
CREATE TABLE public.oracle_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  cover_image_url TEXT,
  theme_json JSONB DEFAULT '{"primaryColor": "#8B5CF6", "backgroundColor": "#0F0D1A", "fontFamily": "serif", "cardBackImage": null, "cardFrameStyle": "classic"}'::jsonb,
  voice_settings_json JSONB DEFAULT '{"tone": "mystical", "openingText": null, "closingText": null, "revealPacing": 2}'::jsonb,
  onboarding_json JSONB DEFAULT '{"welcomeText": null, "howToUse": null, "safetyText": null}'::jsonb,
  disclaimer_text TEXT,
  is_sensitive_mode_available BOOLEAN DEFAULT false,
  enable_journal BOOLEAN DEFAULT true,
  enable_professional_mode BOOLEAN DEFAULT false,
  minimum_portal portal_type DEFAULT 'pre_iniciada',
  show_locked_teaser BOOLEAN DEFAULT true,
  lock_message_title TEXT DEFAULT 'Oráculo Bloqueado',
  lock_message_body TEXT DEFAULT 'Este oráculo está disponível apenas para membros. Faça sua inscrição para ter acesso.',
  upgrade_cta_text TEXT DEFAULT 'Quero me inscrever',
  upgrade_cta_route TEXT DEFAULT '/welcome',
  status oracle_content_status DEFAULT 'draft',
  ordem INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- B) ORACLE CATEGORIES (Categorias de Cartas)
-- =====================================================
CREATE TABLE public.oracle_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID NOT NULL REFERENCES public.oracle_decks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- C) ORACLE CARDS (Cartas do Oráculo)
-- =====================================================
CREATE TABLE public.oracle_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID NOT NULL REFERENCES public.oracle_decks(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.oracle_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  main_image_url TEXT,
  image_variants_json JSONB DEFAULT '[]'::jsonb,
  keywords_json JSONB DEFAULT '[]'::jsonb,
  polarity_light_text TEXT,
  polarity_shadow_text TEXT,
  short_message TEXT,
  deep_reading TEXT,
  reflection_questions_json JSONB DEFAULT '[]'::jsonb,
  ritual_text TEXT,
  care_notes TEXT,
  level oracle_card_level DEFAULT 'beginner',
  is_sensitive BOOLEAN DEFAULT false,
  status oracle_content_status DEFAULT 'draft',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- D) ORACLE SPREADS (Tiragens)
-- =====================================================
CREATE TABLE public.oracle_spreads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID NOT NULL REFERENCES public.oracle_decks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  number_of_cards INTEGER NOT NULL DEFAULT 1,
  layout_type oracle_spread_layout DEFAULT 'line',
  positions_json JSONB DEFAULT '[]'::jsonb,
  rules_json JSONB DEFAULT '{"allowRepetition": false, "requireShadowCard": false, "revealMode": "one_by_one", "imageFirstDefault": true}'::jsonb,
  opening_text TEXT,
  closing_text TEXT,
  status oracle_content_status DEFAULT 'draft',
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- E) ORACLE CLIENTS (Clientes para modo profissional)
-- =====================================================
CREATE TABLE public.oracle_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  notes_private TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- F) ORACLE DRAWS (Tiragens realizadas)
-- =====================================================
CREATE TABLE public.oracle_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oracle_id UUID NOT NULL REFERENCES public.oracle_decks(id) ON DELETE CASCADE,
  spread_id UUID NOT NULL REFERENCES public.oracle_spreads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drawn_cards_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  user_notes TEXT,
  is_professional_session BOOLEAN DEFAULT false,
  client_id UUID REFERENCES public.oracle_clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_oracle_decks_slug ON public.oracle_decks(slug);
CREATE INDEX idx_oracle_decks_status ON public.oracle_decks(status);
CREATE INDEX idx_oracle_decks_minimum_portal ON public.oracle_decks(minimum_portal);
CREATE INDEX idx_oracle_cards_oracle_id ON public.oracle_cards(oracle_id);
CREATE INDEX idx_oracle_cards_category_id ON public.oracle_cards(category_id);
CREATE INDEX idx_oracle_spreads_oracle_id ON public.oracle_spreads(oracle_id);
CREATE INDEX idx_oracle_draws_user_id ON public.oracle_draws(user_id);
CREATE INDEX idx_oracle_draws_oracle_id ON public.oracle_draws(oracle_id);
CREATE INDEX idx_oracle_clients_therapist ON public.oracle_clients(therapist_user_id);

-- =====================================================
-- TRIGGERS - Updated at
-- =====================================================
CREATE TRIGGER update_oracle_decks_updated_at
  BEFORE UPDATE ON public.oracle_decks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oracle_categories_updated_at
  BEFORE UPDATE ON public.oracle_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oracle_cards_updated_at
  BEFORE UPDATE ON public.oracle_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oracle_spreads_updated_at
  BEFORE UPDATE ON public.oracle_spreads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oracle_clients_updated_at
  BEFORE UPDATE ON public.oracle_clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oracle_draws_updated_at
  BEFORE UPDATE ON public.oracle_draws
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- ORACLE DECKS
ALTER TABLE public.oracle_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all oracle decks"
  ON public.oracle_decks FOR ALL
  USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view published oracles with proper access"
  ON public.oracle_decks FOR SELECT
  USING (
    status = 'published' 
    AND (
      public.has_portal_access(auth.uid(), minimum_portal)
      OR show_locked_teaser = true
    )
  );

-- ORACLE CATEGORIES
ALTER TABLE public.oracle_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage oracle categories"
  ON public.oracle_categories FOR ALL
  USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view categories of accessible oracles"
  ON public.oracle_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.oracle_decks d
      WHERE d.id = oracle_id
        AND d.status = 'published'
        AND public.has_portal_access(auth.uid(), d.minimum_portal)
    )
  );

-- ORACLE CARDS
ALTER TABLE public.oracle_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage oracle cards"
  ON public.oracle_cards FOR ALL
  USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view published cards of accessible oracles"
  ON public.oracle_cards FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.oracle_decks d
      WHERE d.id = oracle_id
        AND d.status = 'published'
        AND public.has_portal_access(auth.uid(), d.minimum_portal)
    )
  );

-- ORACLE SPREADS
ALTER TABLE public.oracle_spreads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage oracle spreads"
  ON public.oracle_spreads FOR ALL
  USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view published spreads of accessible oracles"
  ON public.oracle_spreads FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.oracle_decks d
      WHERE d.id = oracle_id
        AND d.status = 'published'
        AND public.has_portal_access(auth.uid(), d.minimum_portal)
    )
  );

-- ORACLE CLIENTS
ALTER TABLE public.oracle_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their own clients"
  ON public.oracle_clients FOR ALL
  USING (therapist_user_id = auth.uid());

CREATE POLICY "Admins can view all oracle clients"
  ON public.oracle_clients FOR SELECT
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- ORACLE DRAWS
ALTER TABLE public.oracle_draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own draws"
  ON public.oracle_draws FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Therapists can view client draws"
  ON public.oracle_draws FOR SELECT
  USING (
    is_professional_session = true
    AND client_id IN (
      SELECT id FROM public.oracle_clients WHERE therapist_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all draws"
  ON public.oracle_draws FOR SELECT
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- =====================================================
-- HELPER FUNCTION: Check oracle access
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_oracle_access(_user_id uuid, _oracle_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    get_user_portal(_user_id) = 'admin'
    OR EXISTS (
      SELECT 1 FROM public.oracle_decks d
      WHERE d.id = _oracle_id
        AND d.status = 'published'
        AND has_portal_access(_user_id, d.minimum_portal)
    )
$$;

-- =====================================================
-- STORAGE BUCKET FOR ORACLE IMAGES
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'oracle-images',
  'oracle-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies
CREATE POLICY "Anyone can view oracle images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'oracle-images');

CREATE POLICY "Admins can upload oracle images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'oracle-images'
    AND public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update oracle images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'oracle-images'
    AND public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can delete oracle images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'oracle-images'
    AND public.get_user_portal(auth.uid()) = 'admin'
  );