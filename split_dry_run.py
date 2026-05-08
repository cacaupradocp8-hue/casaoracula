import json
import math
import os

# 1. Load Expected FKs
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

total_fks = len(fks)
chunk_size = 50
total_parts = math.ceil(total_fks / chunk_size)

sql_header_template = """-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE {part_num} de {total_parts})
-- Diagnóstico de FKs {start_idx} a {end_idx} (Total: {count})

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
    RAISE NOTICE 'Iniciando diagnóstico PARTE {part_num}...';
"""

sql_footer_template = """
    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE {part_num}):';
    RAISE NOTICE 'Total analisadas nesta parte: %', v_total_analyzed;
    RAISE NOTICE 'Total já existentes (EXISTS): %', v_total_exists;
    RAISE NOTICE 'Total prontas para criar (READY_TO_CREATE): %', v_total_ready;
    RAISE NOTICE 'Bloqueadas - Tabela Origem Ausente: %', v_total_missing_source_table;
    RAISE NOTICE 'Bloqueadas - Coluna Origem Ausente: %', v_total_missing_source_column;
    RAISE NOTICE 'Bloqueadas - Tabela Referência Ausente: %', v_total_missing_target_table;
    RAISE NOTICE 'Bloqueadas - Coluna Referência Ausente: %', v_total_missing_target_column;
    RAISE NOTICE 'Bloqueadas - Incompatibilidade de Tipos: %', v_total_type_mismatch;
    RAISE NOTICE 'Bloqueadas - Referência não é Única/PK: %', v_total_target_not_unique;
    RAISE NOTICE '--------------------------------------------------';
END $$;
"""

def generate_check(fk):
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
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = '{target_schema}' AND table_name = '{target_table}' AND column_name = '{target_col}') THEN
             RAISE NOTICE 'FK: {name} | Status: MISSING_TARGET_COLUMN | Column: {target}.{target_col}';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = '{source_schema}' AND table_name = '{source_table}' AND column_name = '{source_col}';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = '{target_schema}' AND table_name = '{target_table}' AND column_name = '{target_col}';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: {name} | Status: TYPE_MISMATCH | % (%) vs % (%)', '{source}.{source_col}', v_source_type, '{target}.{target_col}', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('{target_schema}.{target_table}')::regclass
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

index_content = f"# Índice: Diagnóstico de Foreign Keys (Dry Run)\n\n"
index_content += f"Total de Foreign Keys mapeadas: {total_fks}\n\n"
index_content += "| Arquivo | Intervalo | Qtd | Ordem |\n"
index_content += "| :--- | :--- | :--- | :--- |\n"

for i in range(total_parts):
    start = i * chunk_size
    end = min((i + 1) * chunk_size, total_fks)
    chunk = fks[start:end]
    part_num = i + 1
    filename = f"bloco_07b_dry_run_part_{part_num:02d}.sql"
    
    header = sql_header_template.format(
        part_num=part_num,
        total_parts=total_parts,
        start_idx=start + 1,
        end_idx=end,
        count=len(chunk)
    )
    
    footer = sql_footer_template.format(part_num=part_num)
    
    with open(filename, 'w') as f:
        f.write(header)
        for fk in chunk:
            f.write(generate_check(fk))
        f.write(footer)
    
    # Copy to /mnt/documents
    os.system(f"cp {filename} /mnt/documents/{filename}")
    
    index_content += f"| `{filename}` | {start + 1} - {end} | {len(chunk)} | {part_num} |\n"

with open('bloco_07b_dry_run_INDEX.md', 'w') as f:
    f.write(index_content)

os.system("cp bloco_07b_dry_run_INDEX.md /mnt/documents/bloco_07b_dry_run_INDEX.md")

print(f"Dividido em {total_parts} arquivos.")
