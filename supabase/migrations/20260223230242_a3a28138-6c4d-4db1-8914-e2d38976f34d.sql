
-- Enum for album status
CREATE TYPE public.album_status AS ENUM ('draft', 'published');

-- Enum for track type
CREATE TYPE public.track_type AS ENUM ('audio', 'podcast');

-- Audio Albums table
CREATE TABLE public.clube_audio_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  capa_url TEXT,
  status album_status NOT NULL DEFAULT 'draft',
  ordem INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audio Tracks table
CREATE TABLE public.clube_audio_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.clube_audio_albums(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo track_type NOT NULL DEFAULT 'audio',
  audio_url TEXT NOT NULL,
  duracao_segundos INT,
  ordem INT NOT NULL DEFAULT 1,
  publicado BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Updated_at triggers
CREATE TRIGGER update_clube_audio_albums_updated_at
  BEFORE UPDATE ON public.clube_audio_albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_audio_tracks_updated_at
  BEFORE UPDATE ON public.clube_audio_tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.clube_audio_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_audio_tracks ENABLE ROW LEVEL SECURITY;

-- Albums: admin full access, authenticated read published
CREATE POLICY "admin_full_albums" ON public.clube_audio_albums
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "read_published_albums" ON public.clube_audio_albums
  FOR SELECT TO authenticated
  USING (status = 'published');

-- Tracks: admin full access, authenticated read published
CREATE POLICY "admin_full_tracks" ON public.clube_audio_tracks
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "read_published_tracks" ON public.clube_audio_tracks
  FOR SELECT TO authenticated
  USING (publicado = true);

-- Indexes
CREATE INDEX idx_albums_estacao ON public.clube_audio_albums(estacao_id);
CREATE INDEX idx_tracks_album ON public.clube_audio_tracks(album_id);
