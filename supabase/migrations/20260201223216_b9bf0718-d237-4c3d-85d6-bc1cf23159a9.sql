-- Tabela de ofertas para a página de planos
CREATE TABLE public.ofertas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  subtitulo TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('gratuito', 'formacao', 'assinatura')),
  preco TEXT, -- pode ser "R$ 1.997" ou null para gratuito
  gratuito BOOLEAN DEFAULT false,
  texto_botao TEXT NOT NULL DEFAULT 'Começar',
  link_botao TEXT NOT NULL DEFAULT '/',
  badge TEXT, -- ex: "Recomendado", "Novo"
  inclusoes TEXT[] DEFAULT '{}', -- lista de itens inclusos
  simbolo TEXT DEFAULT '🜂', -- símbolo alquímico
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false, -- card destacado (featured)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ofertas ENABLE ROW LEVEL SECURITY;

-- Políticas: todos podem ler ofertas ativas, admin pode tudo
CREATE POLICY "Ofertas ativas são visíveis para todos"
ON public.ofertas
FOR SELECT
USING (ativo = true OR public.is_admin(auth.uid()));

CREATE POLICY "Admin pode inserir ofertas"
ON public.ofertas
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin pode atualizar ofertas"
ON public.ofertas
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin pode deletar ofertas"
ON public.ofertas
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_ofertas_updated_at
BEFORE UPDATE ON public.ofertas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir as 3 ofertas padrão
INSERT INTO public.ofertas (nome, subtitulo, tipo, gratuito, preco, texto_botao, link_botao, simbolo, inclusoes, ordem, ativo, destaque) VALUES
(
  'Visitante',
  'Para quem está chegando e quer conhecer a Casa',
  'gratuito',
  true,
  NULL,
  'Começar Gratuitamente',
  '/sala-da-visitante',
  '🜁',
  ARRAY['Acesso ao Quiz Oracular', 'Voz da Sibila', 'Travessia Zero completa', 'Entrada no Círculo (fórum)'],
  1,
  true,
  false
),
(
  'Formação Orácula',
  'Formação completa com certificação como Terapeuta Oracular',
  'formacao',
  false,
  'R$ 1.997',
  'Iniciar Formação',
  '/oracula',
  '🜃',
  ARRAY['Todas as Travessias de Formação', 'Certificação como Orácula', 'Biblioteca de Casos Clínicos', 'Supervisão no Círculo', 'Acesso vitalício ao conteúdo'],
  2,
  true,
  true
),
(
  'Assinatura Orácula',
  'Acesso contínuo às ferramentas e atendimentos',
  'assinatura',
  false,
  'R$ 97/mês',
  'Assinar Agora',
  '/planos',
  '🜄',
  ARRAY['Sala de Sessão com clientes', 'Ferramentas Big Five e Eneagrama', 'Oráculos e ferramentas contínuas', 'Mentorias ao vivo (2x/mês)', 'Suporte prioritário'],
  3,
  true,
  false
);