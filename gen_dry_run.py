import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

sql_header = """-- BLOCO 07B - FOREIGN KEYS DRY RUN
-- Este script realiza apenas diagnósticos, sem executar ALTER TABLE.

DO $$
DECLARE
    v_total_analyzed INTEGER := 0;
    v_total_exists INTEGER := 0;
    v_total_ready INTEGER := 0;
    v_total_missing_source_table INTEGER := 0;
    v_total_missing_source_column INTEGER := 0;
    v_total_missing_target_table INTEGER := 0;
    v_total_missing_target_column INTEGER := 0;
    v_total_type_mismatch INTEGER := 0;
    v_total_target_not_unique INTEGER := 0;
    v_total_other INTEGER := 0;
    
    v_source_schema TEXT;
    v_source_table TEXT;
    v_target_schema TEXT;
    v_target_table TEXT;
    
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
    RAISE NOTICE 'Iniciando diagnóstico de Foreign Keys...';
"""

sql_footer = """
    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO FINAL DO DIAGNÓSTICO:';
    RAISE NOTICE 'Total analisadas: %', v_total_analyzed;
    RAISE NOTICE 'Total já existentes (EXISTS): %', v_total_exists;
    RAISE NOTICE 'Total prontas para criar (READY_TO_CREATE): %', v_total_ready;
    RAISE NOTICE 'Bloqueadas - Tabela Origem Ausente: %', v_total_missing_source_table;
    RAISE NOTICE 'Bloqueadas - Coluna Origem Ausente: %', v_total_missing_source_column;
    RAISE NOTICE 'Bloqueadas - Tabela Referência Ausente: %', v_total_missing_target_table;
    RAISE NOTICE 'Bloqueadas - Coluna Referência Ausente: %', v_total_missing_target_column;
    RAISE NOTICE 'Bloqueadas - Incompatibilidade de Tipos: %', v_total_type_mismatch;
    RAISE NOTICE 'Bloqueadas - Referência não é Única/PK: %', v_total_target_not_unique;
    RAISE NOTICE 'Bloqueadas - Outros Motivos: %', v_total_other;
    RAISE NOTICE '--------------------------------------------------';
END $$;
"""

def generate_check(fk):
    # Parse table names
    source = fk['table']
    target = fk['ref_table']
    source_schema = 'public'
    if '.' in source:
        source_schema, source_table = source.split('.')
    else:
        source_table = source
        
    target_schema = 'public'
    if '.' in target:
        target_schema, target_table = target.split('.')
    else:
        target_table = target
        
    name = fk['name']
    source_col = fk['columns']
    target_col = fk['ref_columns']
    
    return f"""
    -- Analisando {name}
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN
        RAISE NOTICE 'FK: {name} | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '{source_schema}' AND table_name = '{source_table}') THEN
        RAISE NOTICE 'FK: {name} | Status: MISSING_SOURCE_TABLE | Table: {source}';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = '{source_schema}' AND table_name = '{source_table}' AND column_name = '{source_col}') THEN
        RAISE NOTICE 'FK: {name} | Status: MISSING_SOURCE_COLUMN | Column: {source}.{source_col}';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '{target_schema}' AND table_name = '{target_table}') 
          AND NOT ('{target_schema}' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: {name} | Status: MISSING_TARGET_TABLE | Table: {target}';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        -- Check target column existence (handle auth schema specially if needed, but information_schema usually covers it if accessible)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = '{target_schema}' AND table_name = '{target_table}' AND column_name = '{target_col}') THEN
             RAISE NOTICE 'FK: {name} | Status: MISSING_TARGET_COLUMN | Column: {target}.{target_col}';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            -- Type check
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = '{source_schema}' AND table_name = '{source_table}' AND column_name = '{source_col}';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = '{target_schema}' AND table_name = '{target_table}' AND column_name = '{target_col}';
            
            IF v_source_type <> v_target_type THEN
                -- Allow some common mismatches if needed, but strict for now
                RAISE NOTICE 'FK: {name} | Status: TYPE_MISMATCH | {source}.{source_col} (%) vs {target}.{target_col} (%)', v_source_type, v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                -- Check for uniqueness on target
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = '{target_schema}.{target_table}'::regclass
                    AND a.attname = '{target_col}'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: {name} | Status: TARGET_NOT_UNIQUE | Column: {target}.{target_col}';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: {name} | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;
"""

with open('bloco_07b_foreign_keys_DRY_RUN.sql', 'w') as f:
    f.write(sql_header)
    for fk in fks:
        f.write(generate_check(fk))
    f.write(sql_footer)

print("Generated bloco_07b_foreign_keys_DRY_RUN.sql")
