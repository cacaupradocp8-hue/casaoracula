-- 06_seed_bibliotecas.sql (REVISADO)
-- Domínio: Bibliotecas

-- 1. Itens da Biblioteca (Preservando O Limiar da Casa)
INSERT INTO public.travessia_library_items (id, slug, titulo_ritual, subtitulo, categoria, quando_chamada, o_que_sustenta, como_atravessar, capa_url, portal_minimo, publicado, ordem, familia_id)
VALUES 
('e6f21faa-3e2c-47be-8e9d-0e3325431a1b', 'o-limiar-da-casa', 'O Limiar da Casa', 'Antes de entrar, é preciso parar.', 'Travessias da Ruptura & Desorganização', 'Nem toda travessia começa com movimento. Algumas começam com respeito.', 'A Travessia 00 não muda sua vida. Ela revela o ponto exato.', 'Individual', 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1769085588456-l5afvh.png', 'visitante', true, 2, '88b4d98f-677b-4229-a05d-75bd04583e32')
ON CONFLICT (id) DO UPDATE SET titulo_ritual = EXCLUDED.titulo_ritual;