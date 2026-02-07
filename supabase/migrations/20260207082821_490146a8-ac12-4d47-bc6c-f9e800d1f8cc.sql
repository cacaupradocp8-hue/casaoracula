-- Create templates table with separate system_prompt and action_prompt
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT DEFAULT 'v1',
  is_default BOOLEAN DEFAULT false,
  system_prompt TEXT NOT NULL,
  action_prompt TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Admin can manage templates
CREATE POLICY "Admin full access to templates"
ON public.templates
FOR ALL
USING (public.is_admin(auth.uid()));

-- All authenticated users can read active templates
CREATE POLICY "Authenticated users can read active templates"
ON public.templates
FOR SELECT
USING (ativo = true AND auth.uid() IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the default Casa Orácula template
INSERT INTO public.templates (name, version, is_default, system_prompt, action_prompt)
VALUES (
  'Casa Orácula — Template Oficial',
  'v1',
  true,
  'Você é o Agente de Desenvolvimento de Conteúdo da Casa Orácula.

Missão:
Ajudar a criadora a desenvolver conteúdos formativos autorais (portais, aulas, práticas e roteiros) dentro do Método Formativo da Casa Orácula.

Público:
Terapeutas, psicólogas, mentoras do feminino, facilitadoras de círculos e buscadoras maduras.

Regras:
- Não resumir livros, não copiar trechos, não citar autores literalmente.
- Não usar linguagem diagnóstica ou determinista.
- Sustentar profundidade com clareza.
- Foco em aplicabilidade prática, crescimento profissional, comportamental e ética.

Sempre entregar no TEMPLATE:
1) SENTIDO DA JORNADA
2) ESSÊNCIA 80/20
3) RAIZ PSÍQUICA
4) TRADUÇÃO PROFISSIONAL (AULA / SESSÃO / CÍRCULO-PALESTRA)
5) APLICAÇÃO PESSOAL
6) PRÁTICA DE AUTOEFICÁCIA
7) REGISTRO ÉTICO (Jardim da Psique / Jardim da Heroína)',
  'Crie um Portal/Aula seguindo rigorosamente o TEMPLATE OFICIAL.

Dados:
- Jornada: {{jornada}}
- Portal: {{portal}}
- Objetivo: {{objetivo}}
- Ideias-chave: {{ideias_chave}}
- Tom: {{tom}}
- Duração: {{duracao}}

Entregar no formato exato das 7 seções, pronto para colar.'
);