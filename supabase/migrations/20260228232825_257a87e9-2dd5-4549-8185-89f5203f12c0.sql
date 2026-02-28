
-- Add tipo_episodio and ciclo_id to studio_episodes
ALTER TABLE public.studio_episodes 
ADD COLUMN IF NOT EXISTS tipo_episodio text NOT NULL DEFAULT 'podcast',
ADD COLUMN IF NOT EXISTS ciclo_id uuid REFERENCES public.clube_livro_ciclos(id) ON DELETE SET NULL;

-- Create trigger function to auto-publish to clube_livro_escutas
CREATE OR REPLACE FUNCTION public.auto_publish_episode_to_circulo()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only trigger when status changes to 'published'
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    -- Only for clube_livro type with a linked ciclo
    IF NEW.tipo_episodio = 'clube_livro' AND NEW.ciclo_id IS NOT NULL THEN
      -- Insert into clube_livro_escutas (travessia content)
      INSERT INTO public.clube_livro_escutas (
        ciclo_id, titulo, descricao, tipo, audio_url, 
        texto_conteudo, duracao_segundos, ativo, ordem
      ) VALUES (
        NEW.ciclo_id,
        COALESCE(NEW.titulo, NEW.livro),
        NEW.descricao,
        'audio',
        COALESCE(NEW.audio_final_url, NEW.audio_full_url),
        NEW.roteiro_completo,
        NEW.duracao_segundos,
        true,
        COALESCE(
          (SELECT MAX(ordem) + 1 FROM public.clube_livro_escutas WHERE ciclo_id = NEW.ciclo_id),
          1
        )
      );

      -- Notify admin/students via notifications table
      INSERT INTO public.notifications (user_id, type, title, body)
      SELECT 
        p.id,
        'info',
        '🎧 Nova escuta disponível',
        COALESCE(NEW.titulo, NEW.livro) || ' foi publicada na Travessia.'
      FROM public.profiles p
      JOIN public.user_roles ur ON ur.user_id = p.id
      WHERE ur.portal NOT IN ('visitante');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trg_auto_publish_episode ON public.studio_episodes;
CREATE TRIGGER trg_auto_publish_episode
  AFTER UPDATE ON public.studio_episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_publish_episode_to_circulo();

-- Also handle INSERT with status = published directly
DROP TRIGGER IF EXISTS trg_auto_publish_episode_insert ON public.studio_episodes;
CREATE TRIGGER trg_auto_publish_episode_insert
  AFTER INSERT ON public.studio_episodes
  FOR EACH ROW
  WHEN (NEW.status = 'published' AND NEW.tipo_episodio = 'clube_livro' AND NEW.ciclo_id IS NOT NULL)
  EXECUTE FUNCTION public.auto_publish_episode_to_circulo();
