-- ============================================
-- FASE 1: UNIFIED CONTENT ENGINE - DATABASE MIGRATION
-- ============================================

-- 1.1 Extend sala_ferramentas table for dynamic tools
ALTER TABLE sala_ferramentas ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'custom';
ALTER TABLE sala_ferramentas ADD COLUMN IF NOT EXISTS portal_minimo portal_type DEFAULT 'pre_iniciada';
ALTER TABLE sala_ferramentas ADD COLUMN IF NOT EXISTS has_blocks BOOLEAN DEFAULT false;
ALTER TABLE sala_ferramentas ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_ferramentas_slug ON sala_ferramentas(slug) WHERE slug IS NOT NULL;

-- 1.2 Create ferramenta_registros table for user interaction data
CREATE TABLE IF NOT EXISTS ferramenta_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  ferramenta_id UUID NOT NULL REFERENCES sala_ferramentas(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
  dados JSONB NOT NULL DEFAULT '{}'::jsonb,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for ferramenta_registros
CREATE INDEX IF NOT EXISTS idx_ferramenta_registros_user ON ferramenta_registros(user_id);
CREATE INDEX IF NOT EXISTS idx_ferramenta_registros_ferramenta ON ferramenta_registros(ferramenta_id);
CREATE INDEX IF NOT EXISTS idx_ferramenta_registros_cliente ON ferramenta_registros(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ferramenta_registros_data ON ferramenta_registros(data_registro);

-- Enable RLS on ferramenta_registros
ALTER TABLE ferramenta_registros ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ferramenta_registros
CREATE POLICY "Admins can manage all ferramenta_registros"
ON ferramenta_registros FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Users can create own ferramenta_registros"
ON ferramenta_registros FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own ferramenta_registros"
ON ferramenta_registros FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own ferramenta_registros"
ON ferramenta_registros FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ferramenta_registros"
ON ferramenta_registros FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Terapeutas can view linked client ferramenta_registros"
ON ferramenta_registros FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM terapeuta_clientes tc
    WHERE tc.terapeuta_id = auth.uid()
    AND tc.cliente_id = ferramenta_registros.cliente_id
    AND tc.ativo = true
  )
);

-- Trigger for updated_at on ferramenta_registros
CREATE TRIGGER update_ferramenta_registros_updated_at
BEFORE UPDATE ON ferramenta_registros
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 1.3 Add new interactive block types to the enum
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'chakra_wheel';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'energy_slider';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'pattern_diary';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'lunar_calendar';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'pendulum_map';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'ego_layers';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'archetype_card';
ALTER TYPE content_block_type ADD VALUE IF NOT EXISTS 'reflection_prompt';

-- 1.4 Add 'tool' to block_context_type if not exists
ALTER TYPE block_context_type ADD VALUE IF NOT EXISTS 'tool';