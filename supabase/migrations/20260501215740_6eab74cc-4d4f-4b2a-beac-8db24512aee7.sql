-- Criar tipo enum para status de áudio se não existir
DO $$ BEGIN
    CREATE TYPE public.clube_audio_status AS ENUM ('pendente', 'roteiro_pronto', 'audio_enviado', 'publicado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Adicionar colunas à tabela clube_portal_audios
ALTER TABLE public.clube_portal_audios 
ADD COLUMN IF NOT EXISTS status public.clube_audio_status DEFAULT 'pendente',
ADD COLUMN IF NOT EXISTS roteiro TEXT,
ADD COLUMN IF NOT EXISTS duracao_estimada TEXT;

-- Adicionar coluna de status à tabela clube_conteudo_semanal para o podcast principal
ALTER TABLE public.clube_conteudo_semanal
ADD COLUMN IF NOT EXISTS podcast_status public.clube_audio_status DEFAULT 'pendente';
