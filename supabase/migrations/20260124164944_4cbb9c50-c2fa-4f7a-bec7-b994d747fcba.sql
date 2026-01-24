-- Adicionar campo porta_psiquica à tabela contos_clinicos
ALTER TABLE contos_clinicos 
ADD COLUMN IF NOT EXISTS porta_psiquica TEXT;

COMMENT ON COLUMN contos_clinicos.porta_psiquica IS 'Porta Psíquica associada ao conto clínico';

-- Adicionar campo porta_psiquica à tabela audio_assets
ALTER TABLE audio_assets 
ADD COLUMN IF NOT EXISTS porta_psiquica TEXT;

COMMENT ON COLUMN audio_assets.porta_psiquica IS 'Porta Psíquica associada ao áudio';

-- Criar tabela para registros de reações simbólicas (Cartografia da Reação Simbólica™)
CREATE TABLE IF NOT EXISTS narroterapia_reacoes_simbolicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  conto_clinico_id UUID REFERENCES contos_clinicos(id) ON DELETE SET NULL,
  audio_id UUID REFERENCES audio_assets(id) ON DELETE SET NULL,
  tipo_uso TEXT CHECK (tipo_uso IN ('individual', 'grupo', 'ritualistico')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE narroterapia_reacoes_simbolicas ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own reactions
CREATE POLICY "Users can view own reactions"
  ON narroterapia_reacoes_simbolicas
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reactions"
  ON narroterapia_reacoes_simbolicas
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reactions"
  ON narroterapia_reacoes_simbolicas
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON narroterapia_reacoes_simbolicas
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar tabela para marcar áudios como estudados
CREATE TABLE IF NOT EXISTS narroterapia_estudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  audio_id UUID REFERENCES audio_assets(id) ON DELETE CASCADE NOT NULL,
  estudado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, audio_id)
);

-- Enable RLS
ALTER TABLE narroterapia_estudos ENABLE ROW LEVEL SECURITY;

-- Policies for estudos
CREATE POLICY "Users can view own studies"
  ON narroterapia_estudos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own studies"
  ON narroterapia_estudos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own studies"
  ON narroterapia_estudos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trigger para updated_at na tabela de reações
CREATE OR REPLACE FUNCTION update_narroterapia_reacoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_narroterapia_reacoes_timestamp
  BEFORE UPDATE ON narroterapia_reacoes_simbolicas
  FOR EACH ROW
  EXECUTE FUNCTION update_narroterapia_reacoes_updated_at();