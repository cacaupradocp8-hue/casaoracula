-- ============================================
-- INTEGRAÇÃO MAPA VIVO ↔ JARDIM DA HEROÍNA
-- ============================================
-- Adiciona campos de "Gesto de Integração" no Mapa Vivo
-- e campos de rastreio de origem no Jardim

-- 1. Adicionar campos de Gesto de Integração no Mapa Vivo
ALTER TABLE public.mapa_vivo_heroina
ADD COLUMN IF NOT EXISTS gesto_integracao TEXT,
ADD COLUMN IF NOT EXISTS gesto_sem_indicacao BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gesto_justificativa TEXT;

-- 2. Adicionar campos de origem e revisão no Jardim
ALTER TABLE public.jardim_heroina_registros
ADD COLUMN IF NOT EXISTS gesto_origem TEXT,
ADD COLUMN IF NOT EXISTS gesto_revisao_status TEXT CHECK (gesto_revisao_status IN ('sustentado', 'parcial', 'nao_sustentado', NULL)),
ADD COLUMN IF NOT EXISTS mapa_vivo_origem_id UUID REFERENCES public.mapa_vivo_heroina(id) ON DELETE SET NULL;

-- 3. Adicionar referência cruzada do Mapa para o Jardim (após criar o registro)
ALTER TABLE public.mapa_vivo_heroina
ADD COLUMN IF NOT EXISTS gesto_jardim_registro_id UUID REFERENCES public.jardim_heroina_registros(id) ON DELETE SET NULL;

-- 4. Índice para buscas por origem
CREATE INDEX IF NOT EXISTS idx_jardim_heroina_mapa_origem 
ON public.jardim_heroina_registros(mapa_vivo_origem_id) 
WHERE mapa_vivo_origem_id IS NOT NULL;