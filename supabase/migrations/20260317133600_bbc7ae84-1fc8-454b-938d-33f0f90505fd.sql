-- Add missing columns to the existing tools table
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS categoria_metodo TEXT,
  ADD COLUMN IF NOT EXISTS funcao_principal TEXT,
  ADD COLUMN IF NOT EXISTS quando_usar TEXT,
  ADD COLUMN IF NOT EXISTS entrada TEXT,
  ADD COLUMN IF NOT EXISTS acao_central TEXT,
  ADD COLUMN IF NOT EXISTS saida TEXT,
  ADD COLUMN IF NOT EXISTS proximo_passo_id UUID REFERENCES public.tools(id),
  ADD COLUMN IF NOT EXISTS ferramenta_pai_id UUID REFERENCES public.tools(id),
  ADD COLUMN IF NOT EXISTS e_complementar BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ambiente TEXT NOT NULL DEFAULT 'maquinas',
  ADD COLUMN IF NOT EXISTS nivel TEXT NOT NULL DEFAULT 'essencial',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tools_slug ON public.tools(slug);
CREATE INDEX IF NOT EXISTS idx_tools_categoria ON public.tools(categoria_metodo);
CREATE INDEX IF NOT EXISTS idx_tools_ambiente ON public.tools(ambiente);
CREATE INDEX IF NOT EXISTS idx_tools_proximo_passo ON public.tools(proximo_passo_id);
CREATE INDEX IF NOT EXISTS idx_tools_ferramenta_pai ON public.tools(ferramenta_pai_id);