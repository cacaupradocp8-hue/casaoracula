import json

with open('fks_from_schema.json', 'r') as f:
    fks_list = json.load(f)

# Filter out deprecated tables
fks_list = [fk for fk in fks_list if not fk['table'].startswith('_deprecated_') and not fk['ref_table'].startswith('_deprecated_')]

sql_header = """-- sync_fks_READY_ONLY_PUBLIC_SAFE.sql
-- Este script cria apenas as FKs que foram validadas como READY_TO_CREATE.
-- Qualificado com schema public.tabela.

SET search_path TO public;

DO $main$
DECLARE
    v_added INTEGER := 0;
    v_skipped_existing INTEGER := 0;
    v_skipped_not_ready INTEGER := 0;
    v_failed INTEGER := 0;
    v_rec RECORD;
BEGIN
    -- Criando tabela temporária para os dados esperados
    CREATE TEMP TABLE expected_fks_to_create (
        fk_name TEXT,
        src_table TEXT,
        src_col TEXT,
        tgt_table TEXT,
        tgt_col TEXT,
        extra_clause TEXT
    ) ON COMMIT DROP;

"""

sql_footer = """
    -- Iterar sobre as FKs e tentar criar
    FOR v_rec IN SELECT * FROM expected_fks_to_create LOOP
        BEGIN
            -- 1. Verificar se a constraint já existe
            IF EXISTS (
                SELECT 1 FROM pg_constraint c 
                JOIN pg_namespace n ON n.oid = c.connamespace 
                WHERE c.conname = v_rec.fk_name AND n.nspname = 'public'
            ) THEN
                v_skipped_existing := v_skipped_existing + 1;
                CONTINUE;
            END IF;

            -- 2. Verificar existência de tabelas e colunas (src e tgt)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.src_table AND column_name = v_rec.src_col) OR
               NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.tgt_table AND column_name = v_rec.tgt_col) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Table or column missing.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 3. Verificar se o destino tem PK ou UNIQUE na coluna alvo
            IF NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                JOIN pg_class c ON c.oid = i.indrelid
                JOIN pg_namespace n ON n.oid = c.connamespace
                WHERE n.nspname = 'public' 
                AND c.relname = v_rec.tgt_table 
                AND a.attname = v_rec.tgt_col
                AND (i.indisprimary OR i.indisunique)
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Target column is not PK/UNIQUE.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 4. Verificar compatibilidade de tipos
            IF (
                SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.src_table AND column_name = v_rec.src_col
            ) != (
                SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = v_rec.tgt_table AND column_name = v_rec.tgt_col
            ) THEN
                v_skipped_not_ready := v_skipped_not_ready + 1;
                RAISE NOTICE 'Skipping %: Type mismatch.', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 5. Tentar criar (Se usar NOT VALID + VALIDATE, rollback no erro)
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) %s NOT VALID', 
                    v_rec.src_table, v_rec.fk_name, v_rec.src_col, v_rec.tgt_table, v_rec.tgt_col, v_rec.extra_clause);
                
                EXECUTE format('ALTER TABLE public.%I VALIDATE CONSTRAINT %I', v_rec.src_table, v_rec.fk_name);
                
                v_added := v_added + 1;
            EXCEPTION WHEN OTHERS THEN
                -- Se falhar o validate ou a criação, removemos a constraint para não deixar lixo
                EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', v_rec.src_table, v_rec.fk_name);
                v_failed := v_failed + 1;
                RAISE WARNING 'Failed to create %: %', v_rec.fk_name, SQLERRM;
            END;

        EXCEPTION WHEN OTHERS THEN
            v_failed := v_failed + 1;
            RAISE WARNING 'General error for %: %', v_rec.fk_name, SQLERRM;
        END;
    END LOOP;

    -- Resumo final
    RAISE NOTICE 'Summary: Added: %, Skipped Existing: %, Skipped Not Ready: %, Failed: %', v_added, v_skipped_existing, v_skipped_not_ready, v_failed;
    
    -- Exibir via SELECT para facilitar visualização no Supabase
    CREATE TEMP TABLE sync_summary AS 
    SELECT 'added' as status, v_added as count
    UNION ALL SELECT 'skipped_existing', v_skipped_existing
    UNION ALL SELECT 'skipped_not_ready', v_skipped_not_ready
    UNION ALL SELECT 'failed', v_failed;
END $main$;

SELECT * FROM sync_summary;
DROP TABLE IF EXISTS sync_summary;
"""

with open('sync_fks_READY_ONLY_PUBLIC_SAFE.sql', 'w') as f:
    f.write(sql_header)
    for fk in fks_list:
        f.write(f"    INSERT INTO expected_fks_to_create VALUES ('{fk['name']}', '{fk['table']}', '{fk['columns']}', '{fk['ref_table']}', '{fk['ref_columns']}', '{fk['extra']}');\n")
    f.write(sql_footer)
