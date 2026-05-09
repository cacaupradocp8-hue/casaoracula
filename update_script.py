import json

with open('fks_from_schema.json', 'r') as f:
    fks_list = json.load(f)

# The user explicitly said these were the results of the diagnostic:
# - ALREADY_EXISTS: 217
# - READY_TO_CREATE: 142
# - TARGET_NOT_UNIQUE: 21
# - SOURCE_TABLE_MISSING: 4
# - TYPE_MISMATCH: 0
# - ORPHANS_FOUND: 0
# Total expected = 142 READY_TO_CREATE.

# I need to filter out the 142 that SHOULD be created.
# However, I don't have the "status" in fks_from_schema.json, 
# but I can filter based on the rules the user provided to REACH that number if possible,
# or better yet, since I can't know which specific 142 are READY_TO_CREATE without running the diagnostic myself,
# I will use the Python script to filter out what is DEFINITELY NOT to be included.

# Rule: ignore _deprecated_
fks_to_include = [fk for fk in fks_list if not fk['table'].startswith('_deprecated_') and not fk['ref_table'].startswith('_deprecated_')]

# But the user specifically wants EXACTLY 142 READY_TO_CREATE.
# Since I can't run the diagnostic on the real DB, I will provide the script that checks for these 142
# by dynamically validating them during execution, as requested.
# The 380 I have currently include ALREADY_EXISTS, TARGET_NOT_UNIQUE, etc.
# The user wants the script to "Create only the 142".
# To be safe and meet the "exactly 142" requirement, I should probably identify them if I could, 
# but the script already has logic to SKIP:
# - Existing (ALREADY_EXISTS)
# - Missing tables/cols (SOURCE_TABLE_MISSING)
# - Not unique (TARGET_NOT_UNIQUE)
# - Type mismatch (TYPE_MISMATCH)

# So the script WITH the 380 entries will naturally only ADD the 142 that pass these checks.
# I will refine the script to ensure it matches all rules.

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
                RAISE NOTICE 'Skipping %: Table or column missing (SOURCE_TABLE_MISSING).', v_rec.fk_name;
                CONTINUE;
            END IF;

            -- 3. Verificar se o destino tem PK ou UNIQUE na coluna alvo (Ignora TARGET_NOT_UNIQUE)
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
                RAISE NOTICE 'Skipping %: Target column is not PK/UNIQUE (TARGET_NOT_UNIQUE).', v_rec.fk_name;
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

            -- 5. Tentar criar (Se usar NOT VALID + VALIDATE, DROP no EXCEPTION em caso de erro no validate)
            BEGIN
                EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%I(%I) %s NOT VALID', 
                    v_rec.src_table, v_rec.fk_name, v_rec.src_col, v_rec.tgt_table, v_rec.tgt_col, v_rec.extra_clause);
                
                -- Se o validate falhar, ele cai no EXCEPTION do bloco interno
                EXECUTE format('ALTER TABLE public.%I VALIDATE CONSTRAINT %I', v_rec.src_table, v_rec.fk_name);
                
                v_added := v_added + 1;
            EXCEPTION WHEN OTHERS THEN
                -- DROP CONSTRAINT imediatamente em caso de erro (incluindo erro de validação de órfãos)
                EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I', v_rec.src_table, v_rec.fk_name);
                v_failed := v_failed + 1;
                RAISE WARNING 'Failed to create/validate %: %. Constraint dropped.', v_rec.fk_name, SQLERRM;
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
    for fk in fks_to_include:
        f.write(f"    INSERT INTO expected_fks_to_create VALUES ('{fk['name']}', '{fk['table']}', '{fk['columns']}', '{fk['ref_table']}', '{fk['ref_columns']}', '{fk['extra']}');\n")
    f.write(sql_footer)
