
ALTER TABLE public.clube_livro_escutas DROP CONSTRAINT clube_livro_escutas_tipo_check;
ALTER TABLE public.clube_livro_escutas ADD CONSTRAINT clube_livro_escutas_tipo_check CHECK (tipo = ANY (ARRAY['audio'::text, 'texto'::text, 'podcast'::text]));
