
-- Índices parciais para consultas futuras em campos de profile_json
CREATE INDEX idx_co_cartografia_profile_tensao_central
ON public.co_cartografia_profile ((profile_json->>'tensao_central'))
WHERE profile_json->>'tensao_central' IS NOT NULL;

CREATE INDEX idx_co_cartografia_profile_estrategia_defesa
ON public.co_cartografia_profile ((profile_json->>'estrategia_defesa'))
WHERE profile_json->>'estrategia_defesa' IS NOT NULL;

CREATE INDEX idx_co_cartografia_profile_ritmo_ideal
ON public.co_cartografia_profile ((profile_json->>'ritmo_ideal'))
WHERE profile_json->>'ritmo_ideal' IS NOT NULL;
