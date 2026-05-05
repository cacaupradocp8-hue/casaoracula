-- 1. Remover tabelas depreciadas v2
DROP TABLE IF EXISTS public._deprecated_clube_v2_conteudos CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_ciclos CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_encontros CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_ferramentas CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_obras CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_portais CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_registros_usuario CASCADE;
DROP TABLE IF EXISTS public._deprecated_clube_v2_portas CASCADE;

-- 2. Remover tabelas da Máquina Editorial e Geradores Automáticos
DROP TABLE IF EXISTS public.clube_conteudo_semanal CASCADE;
DROP TABLE IF EXISTS public.clube_daily_interaction_limits CASCADE;

-- 3. Remover tabelas de versões intermediárias para evitar confusão com V3
-- Mantendo apenas o que é essencial para o funcionamento atual ou migração
DROP TABLE IF EXISTS public.clube_livro_escutas CASCADE;
DROP TABLE IF EXISTS public.clube_livro_ciclos CASCADE;
DROP TABLE IF EXISTS public.clube_livro_fases CASCADE;
DROP TABLE IF EXISTS public.clube_livro_semana CASCADE;

-- 4. Garantir que as tabelas de progresso e conteúdo V3 existam e estejam limpas
-- (Nota: Estas tabelas já devem existir conforme auditoria, mas garantimos a estrutura)
ALTER TABLE IF EXISTS public.clube_v3_stations 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE IF EXISTS public.clube_v3_station_audios
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
