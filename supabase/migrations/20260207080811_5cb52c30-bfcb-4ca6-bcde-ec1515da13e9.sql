-- ============================================
-- ATELIÊ DE CONTEÚDO - Content Generation System
-- ============================================

-- Table for storing content templates
CREATE TABLE public.atelie_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  template_content TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for storing generated content
CREATE TABLE public.atelie_conteudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.atelie_templates(id),
  -- Input variables
  jornada TEXT NOT NULL,
  portal TEXT NOT NULL,
  objetivo TEXT NOT NULL,
  ideias_chave TEXT NOT NULL,
  tom TEXT NOT NULL,
  duracao TEXT,
  -- Generated content (stored as sections)
  conteudo_gerado JSONB,
  -- Status workflow
  status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'revisado', 'publicado')),
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.atelie_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atelie_conteudos ENABLE ROW LEVEL SECURITY;

-- RLS: Admin only for templates
CREATE POLICY "Admin can manage templates"
ON public.atelie_templates FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

-- RLS: Admin only for content
CREATE POLICY "Admin can manage content"
ON public.atelie_conteudos FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

-- Insert default template (Template Casa Orácula v1)
INSERT INTO public.atelie_templates (nome, descricao, template_content, is_default) VALUES (
  'Template Casa Orácula v1',
  'Template oficial para criação de Portais/Aulas da formação',
  '## REGRAS DE GERAÇÃO

- Não resumir livros.
- Não citar autores.
- Não usar linguagem diagnóstica ou determinista.
- Sustentar profundidade com clareza.
- Incluir prática possível, aplicação profissional e cuidado ético.

## FORMATO DE SAÍDA

### 1) SENTIDO DA JORNADA
[Contextualização do portal dentro da jornada maior - por que este tema agora?]

### 2) ESSÊNCIA 80/20
[O que é absolutamente essencial entender sobre este tema - o núcleo indispensável]

### 3) RAIZ PSÍQUICA
[De onde vem este conteúdo na psique? Qual território arquetípico habita?]

### 4) TRADUÇÃO PROFISSIONAL

#### AULA
[Como apresentar este conteúdo em formato de aula/ensino]

#### SESSÃO
[Como aplicar em contexto de sessão individual]

#### CÍRCULO/PALESTRA
[Como adaptar para grupos e apresentações]

### 5) APLICAÇÃO PESSOAL
[Como a profissional pode viver este conteúdo em si mesma]

### 6) PRÁTICA DE AUTOEFICÁCIA
[Exercício prático e aplicável que a aluna pode fazer imediatamente]

### 7) REGISTRO ÉTICO (Jardim da Psique / Jardim da Heroína)
[Orientação para registro reflexivo e cuidados éticos importantes]',
  true
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_atelie_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_atelie_templates_updated_at
  BEFORE UPDATE ON public.atelie_templates
  FOR EACH ROW EXECUTE FUNCTION update_atelie_updated_at();

CREATE TRIGGER update_atelie_conteudos_updated_at
  BEFORE UPDATE ON public.atelie_conteudos
  FOR EACH ROW EXECUTE FUNCTION update_atelie_updated_at();