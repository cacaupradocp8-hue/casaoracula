-- 02_seed_formacao.sql (REVISADO)
-- Domínio: Formação e Travessias Oficiais
-- Objetivo: Preservar a Travessia 00 e estrutura oficial.

-- 1. Travessias (Preservando Travessia 00)
INSERT INTO public.travessias (id, title, subtitle, description, ordem, portal_minimo, ativa, slug, temas, icone, cor_acento, closing_ritual)
VALUES 
('181fe90c-b556-4865-ba7c-686f283a7419', 'TRAVESSIA ZERO — O LIMIAR DA CASA', 'A Porta que Não Promete', 'Nada é exigido. Tudo é percebido.', 1, 'visitante', true, 'travessia-zero-o-limiar-da-casa', ARRAY['Pausa consciente', 'Reconhecimento', 'Posicionamento interno'], 'Compass', 'amber', '“Ao atravessar esta Porta, você não inicia um caminho. Você interrompe a pressa.”')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- 2. Conteúdo das Travessias (Mapeamento de Aulas)
INSERT INTO public.conteudo_travessias (id, titulo, subtitulo, descricao, ordem, portal_minimo, publicado, texto_introducao)
VALUES 
('181fe90c-b556-4865-ba7c-686f283a7419', 'TRAVESSIA ZERO — O LIMIAR DA CASA', 'Onde estou antes de tentar mudar?', '7 dias para mapear seu ponto de partida antes de tentar mudar', 0, 'visitante', true, 'Esta travessia é um convite ao silêncio. Antes de buscar transformação, é preciso reconhecer onde você realmente está.')
ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo;

-- 3. Aulas da Travessia 00 (Preservando UUIDs e Áudios)
INSERT INTO public.conteudo_aulas (id, travessia_id, titulo, descricao_curta, ordem, portal_minimo, publicado, audio_url, texto_aula)
VALUES 
('27cd2622-5b42-4175-a1d2-0fec81cab961', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 1 — O Silêncio', 'O que acontece quando paro de buscar resposta?', 1, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449123883-lhs825.ogg', NULL),
('f9d14cd2-6279-4e07-bdb7-8e2d14015f15', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 2 — O Mapa', 'Onde realmente estou neste momento?', 2, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449183058-u8sjxf.ogg', NULL),
('4c32d68c-88c7-4873-b5f1-544f9d25ba4f', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 3 — O Eco', 'O que repito sem perceber?', 3, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449202139-tj3zck.ogg', NULL),
('467aaa14-718e-4a68-ba50-18b6d447e572', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 4 — A Pausa', 'O que emerge quando não há pressa?', 4, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449225321-vkwvxr.ogg', NULL),
('1617b231-8604-40da-8e17-1720a4af5052', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 5 — O Corpo', 'Onde meu corpo guarda tensão?', 5, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449242040-wkyv.ogg', NULL),
('56d44c6a-0890-488d-a0aa-0bcfaca7dd0e', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 6 — O Limiar', 'O que preciso soltar para atravessar?', 6, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449258101-u17e6f.ogg', NULL),
('d3fc97db-2cb1-47ce-9a56-eeddcf755c49', '181fe90c-b556-4865-ba7c-686f283a7419', 'Dia 7 — A Decisão', 'Estou pronta para habitar?', 7, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449276228-426tfof.ogg', NULL),
('9fc4d42f-5bfc-45df-85a7-aa2f2beeac0e', '181fe90c-b556-4865-ba7c-686f283a7419', 'A CHEGADA', 'O QUE FALTA', 8, 'visitante', true, 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/uploads/1769449302095-0rqxhl.ogg', 'O ENCONTRO COM A LINGUGEM SIMBOLICA')
ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo;

-- 4. Cursos (Usando placeholder interno para cursos que ainda não possuem capa oficial)
INSERT INTO public.courses (id, titulo, subtitulo, capa_url, publicado, ordem, portal_minimo)
VALUES 
('d69b1378-8095-4429-9cd6-2deaa7978300', 'ORÁCULA — Especialização', 'Leitura Simbólica', 'https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/cursos/1769016564057-k2m4zd.png', true, 1, 'aluna')
ON CONFLICT (id) DO UPDATE SET titulo = EXCLUDED.titulo;