-- Tabela para seções editáveis do Tour
CREATE TABLE public.tour_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secao_key TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT,
  imagem_url TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_tour_sections_updated_at
  BEFORE UPDATE ON public.tour_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.tour_sections ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ler seções ativas
CREATE POLICY "Anyone can read active tour sections"
  ON public.tour_sections FOR SELECT
  USING (ativo = true);

-- Admins podem gerenciar tudo
CREATE POLICY "Admins can manage tour sections"
  ON public.tour_sections FOR ALL
  USING (public.get_user_portal(auth.uid()) = 'admin');

-- Dados iniciais
INSERT INTO public.tour_sections (secao_key, titulo, subtitulo, descricao, ordem) VALUES
('hero', 'Conheça a Casa ORÁCULA', 'Um espaço de formação simbólica, clínica e ética', 'Explore os cômodos, ferramentas e recursos que esperam por você quando decidir atravessar o portal.', 1),
('salas', 'Os Cômodos da Casa', 'Cada sala é um portal de aprofundamento', 'A Casa ORÁCULA é organizada em espaços progressivos de formação. Cada cômodo oferece ferramentas e conteúdos específicos para sua jornada.', 2),
('ferramentas', 'Ferramentas Simbólicas', 'Instrumentos de leitura narrativa e autoconhecimento', 'Utilizamos mapas simbólicos, oráculos e ferramentas clínicas para facilitar processos de individuação e cura.', 3),
('recursos', 'Recursos Exclusivos', 'O que você encontra quando habita a Casa', 'Biblioteca, agentes de IA, sala de sessão profissional e muito mais aguardam sua entrada.', 4),
('cta', 'Pronta para entrar?', 'Sua jornada começa com um passo', 'Escolha seu caminho e comece sua travessia pela Casa ORÁCULA.', 5);