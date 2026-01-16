-- Create table for radiesthetic graphics catalog
CREATE TABLE public.radiestesia_graficos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  autor TEXT,
  origem TEXT DEFAULT 'tradicional', -- tradicional, autoral, alquimico
  categoria TEXT DEFAULT 'clinico', -- clinico, oracular, estudo
  tipo_leitura TEXT DEFAULT 'campo', -- campo, frequencia, narrativa, apoio
  para_que_serve TEXT,
  quando_nao_usar TEXT,
  observacoes_simbolicas TEXT,
  imagem_url TEXT,
  combinacoes TEXT[] DEFAULT '{}',
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radiestesia_graficos ENABLE ROW LEVEL SECURITY;

-- Public read for active graphics
CREATE POLICY "Graficos ativos sao visiveis" ON public.radiestesia_graficos
  FOR SELECT USING (ativo = true OR public.get_user_portal(auth.uid()) = 'admin');

-- Admin can manage all
CREATE POLICY "Admin gerencia graficos" ON public.radiestesia_graficos
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Create table for radiestesia settings (intro text, section toggles)
CREATE TABLE public.radiestesia_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor JSONB DEFAULT '{}',
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radiestesia_config ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Config visivel" ON public.radiestesia_config
  FOR SELECT USING (true);

-- Admin can manage
CREATE POLICY "Admin gerencia config" ON public.radiestesia_config
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Create table for crystals catalog
CREATE TABLE public.radiestesia_cristais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  explicacao_simbolica TEXT,
  quando_usar TEXT,
  quando_evitar TEXT,
  alerta_excesso TEXT,
  campos TEXT[] DEFAULT '{}',
  estados TEXT[] DEFAULT '{}',
  graficos_associados TEXT[] DEFAULT '{}',
  link_externo TEXT,
  imagem_url TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radiestesia_cristais ENABLE ROW LEVEL SECURITY;

-- Public read for active crystals
CREATE POLICY "Cristais ativos sao visiveis" ON public.radiestesia_cristais
  FOR SELECT USING (ativo = true OR public.get_user_portal(auth.uid()) = 'admin');

-- Admin can manage
CREATE POLICY "Admin gerencia cristais" ON public.radiestesia_cristais
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Insert default config
INSERT INTO public.radiestesia_config (chave, valor) VALUES
  ('intro_pedagogica', '{"titulo": "O que é Radiestesia Oracular", "texto": "A radiestesia é uma arte de escuta sutil, não de medição absoluta. Diferente do uso mecânico (sim/não), a Radiestesia Oracular trabalha com leitura de campos e tendências narrativas. O princípio ético central: leitura de campo, não adivinhação.", "ativo": true}'),
  ('secao_clinica', '{"titulo": "Radiestesia Clínica", "descricao": "Uso terapêutico, leitura de campo, apoio a processos.", "ativo": true}'),
  ('secao_oracular', '{"titulo": "Radiestesia Oracular", "descricao": "Leitura simbólica, orientação narrativa, ritos e travessias.", "ativo": true}'),
  ('secao_estudo', '{"titulo": "Estudo & Pesquisa", "descricao": "História, autores, fundamentos, comparação de métodos.", "ativo": true}'),
  ('amplificador_destaque', '{"titulo": "Amplificador de Sensibilidade Radiestésica", "descricao": "Instrumento para calibrar e ampliar a percepção sutil antes de uma prática.", "uso_recomendado": "Usar antes de leituras, para centrar o campo e aumentar a receptividade.", "contexto_simbolico": "Não é resultado mágico — é preparação consciente. Como um ritual de abertura.", "ativo": true}');

-- Update trigger for timestamps
CREATE TRIGGER update_radiestesia_graficos_updated_at
  BEFORE UPDATE ON public.radiestesia_graficos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radiestesia_cristais_updated_at
  BEFORE UPDATE ON public.radiestesia_cristais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_radiestesia_config_updated_at
  BEFORE UPDATE ON public.radiestesia_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();