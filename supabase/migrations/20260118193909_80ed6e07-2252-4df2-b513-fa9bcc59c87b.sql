-- ============================================
-- CLINICAL PROTOCOL ENHANCEMENT - PHASE 1
-- Add clinical fields to Big5 Symbolic Forces
-- ============================================

-- Add clinical fields to big5_symbolic_forces
ALTER TABLE big5_symbolic_forces
ADD COLUMN IF NOT EXISTS padrao_emocional TEXT,
ADD COLUMN IF NOT EXISTS conflito_recorrente TEXT,
ADD COLUMN IF NOT EXISTS repeticao_comportamental TEXT,
ADD COLUMN IF NOT EXISTS risco_clinico TEXT,
ADD COLUMN IF NOT EXISTS potencial_inexplorado TEXT;

-- Add session case linkage and AI-generated narrative to registros
ALTER TABLE big5_symbolic_registros
ADD COLUMN IF NOT EXISTS session_case_id UUID REFERENCES session_cases(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS narrativa_localizacao TEXT,
ADD COLUMN IF NOT EXISTS narrativa_editada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS notas_terapeuta TEXT,
ADD COLUMN IF NOT EXISTS territorio_predominante TEXT;

-- Create index for session case lookup
CREATE INDEX IF NOT EXISTS idx_big5_symbolic_registros_session_case 
ON big5_symbolic_registros(session_case_id);

-- ============================================
-- CLINICAL PROTOCOL ENHANCEMENT - PHASE 2
-- Add clinical fields to Eneagrama Feminino
-- ============================================

-- Add dynamic interpretation fields to arquetipos
ALTER TABLE eneagrama_feminino_arquetipos
ADD COLUMN IF NOT EXISTS dinamica_relacional TEXT,
ADD COLUMN IF NOT EXISTS trabalho_sombra TEXT,
ADD COLUMN IF NOT EXISTS sugestoes_reenquadramento TEXT[];

-- Add clinical fields to registros
ALTER TABLE eneagrama_feminino_registros
ADD COLUMN IF NOT EXISTS session_case_id UUID REFERENCES session_cases(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS arquetipo_exilado INTEGER,
ADD COLUMN IF NOT EXISTS narrativa_interpretacao TEXT,
ADD COLUMN IF NOT EXISTS narrativa_editada BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS campo_reflexao_cliente TEXT;

-- Create index for session case lookup
CREATE INDEX IF NOT EXISTS idx_eneagrama_feminino_registros_session_case 
ON eneagrama_feminino_registros(session_case_id);

-- ============================================
-- CLINICAL PROTOCOL ENHANCEMENT - PHASE 3
-- Add integration fields to Jornada da Heroina
-- ============================================

-- Add clinical protocol fields to phases
ALTER TABLE jornada_heroina_fases
ADD COLUMN IF NOT EXISTS foco_terapeutico TEXT,
ADD COLUMN IF NOT EXISTS risco_especifico TEXT,
ADD COLUMN IF NOT EXISTS tarefa_simbolica TEXT,
ADD COLUMN IF NOT EXISTS sinal_integracao TEXT;

-- Add session case linkage and progress tracking to registros
ALTER TABLE jornada_heroina_registros
ADD COLUMN IF NOT EXISTS session_case_id UUID REFERENCES session_cases(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notas_progresso JSONB DEFAULT '[]'::jsonb;

-- Create index for session case lookup
CREATE INDEX IF NOT EXISTS idx_jornada_heroina_registros_session_case 
ON jornada_heroina_registros(session_case_id);

-- ============================================
-- PROTOCOL ORCHESTRATION TABLE
-- Links all three tools for a complete protocol
-- ============================================

CREATE TABLE IF NOT EXISTS protocolo_oracula (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_case_id UUID NOT NULL REFERENCES session_cases(id) ON DELETE CASCADE,
  terapeuta_id UUID NOT NULL,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  
  -- Protocol Status
  status TEXT NOT NULL DEFAULT 'iniciado' CHECK (status IN ('iniciado', 'em_andamento', 'concluido', 'pausado')),
  
  -- Links to each tool's registro
  mapa_registro_id UUID REFERENCES big5_symbolic_registros(id) ON DELETE SET NULL,
  oraculo_registro_id UUID REFERENCES eneagrama_feminino_registros(id) ON DELETE SET NULL,
  caminho_registro_id UUID REFERENCES jornada_heroina_registros(id) ON DELETE SET NULL,
  
  -- Protocol-level notes
  objetivo_terapeutico TEXT,
  sintese_narrativa TEXT,
  proximos_passos TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on protocolo_oracula
ALTER TABLE protocolo_oracula ENABLE ROW LEVEL SECURITY;

-- RLS Policies for protocolo_oracula
CREATE POLICY "Therapists can view their protocols"
ON protocolo_oracula
FOR SELECT
USING (auth.uid() = terapeuta_id OR get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Therapists can create their protocols"
ON protocolo_oracula
FOR INSERT
WITH CHECK (auth.uid() = terapeuta_id);

CREATE POLICY "Therapists can update their protocols"
ON protocolo_oracula
FOR UPDATE
USING (auth.uid() = terapeuta_id OR get_user_portal(auth.uid()) = 'admin'::portal_type);

CREATE POLICY "Therapists can delete their protocols"
ON protocolo_oracula
FOR DELETE
USING (auth.uid() = terapeuta_id OR get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_protocolo_oracula_session_case ON protocolo_oracula(session_case_id);
CREATE INDEX IF NOT EXISTS idx_protocolo_oracula_terapeuta ON protocolo_oracula(terapeuta_id);
CREATE INDEX IF NOT EXISTS idx_protocolo_oracula_cliente ON protocolo_oracula(cliente_id);

-- Trigger for updated_at
CREATE TRIGGER update_protocolo_oracula_updated_at
BEFORE UPDATE ON protocolo_oracula
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE protocolo_oracula IS 'Orchestrates the 3-tool clinical protocol: MAPA → ORÁCULO → CAMINHO';
COMMENT ON COLUMN protocolo_oracula.mapa_registro_id IS 'Link to Big5 Symbolic reading (psychic localization)';
COMMENT ON COLUMN protocolo_oracula.oraculo_registro_id IS 'Link to Eneagrama Feminino reading (symbolic interpretation)';
COMMENT ON COLUMN protocolo_oracula.caminho_registro_id IS 'Link to Jornada da Heroína (integration process)';