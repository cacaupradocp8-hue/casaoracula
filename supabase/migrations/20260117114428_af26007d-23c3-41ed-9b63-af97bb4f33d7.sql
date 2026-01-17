-- Adicionar novos campos para o Caso-Espelho completo seguindo o Método ORÁCULA
-- Estrutura: Situação simbólica, Campo revelado, Erros comuns, Postura correta, Sombra somática, Encerramento

ALTER TABLE public.labirinto_portas 
ADD COLUMN IF NOT EXISTS caso_espelho_situacao TEXT,
ADD COLUMN IF NOT EXISTS caso_espelho_erros_facilitadora TEXT,
ADD COLUMN IF NOT EXISTS caso_espelho_postura_correta TEXT;

-- Renomear campos existentes para maior clareza
-- caso_espelho_titulo -> já existe, usado como título do caso
-- caso_espelho_erro_comum -> caso_espelho_erros_facilitadora (migrar dados se houver)
-- caso_espelho_como_sustentar -> caso_espelho_postura_correta (migrar dados se houver)

-- Migrar dados existentes dos campos antigos para os novos
UPDATE public.labirinto_portas
SET caso_espelho_erros_facilitadora = caso_espelho_erro_comum
WHERE caso_espelho_erro_comum IS NOT NULL AND caso_espelho_erros_facilitadora IS NULL;

UPDATE public.labirinto_portas
SET caso_espelho_postura_correta = caso_espelho_como_sustentar
WHERE caso_espelho_como_sustentar IS NOT NULL AND caso_espelho_postura_correta IS NULL;

-- Adicionar comentários para documentação
COMMENT ON COLUMN labirinto_portas.caso_espelho_situacao IS 'Situação simbólica: cena breve e recorrente relacionada à Porta';
COMMENT ON COLUMN labirinto_portas.caso_espelho_erros_facilitadora IS 'Erros comuns: o que a facilitadora tende a fazer errado neste campo';
COMMENT ON COLUMN labirinto_portas.caso_espelho_postura_correta IS 'Postura correta: modo de estar, não ação, para sustentar o campo';