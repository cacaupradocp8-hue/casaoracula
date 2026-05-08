import json
import math

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

TOTAL_FKS = len(fks)
CHUNKS = 8
PER_CHUNK = math.ceil(TOTAL_FKS / CHUNKS)

def generate_part(part_num, start_idx, end_idx):
    chunk_fks = fks[start_idx:end_idx]
    
    sql = f"""-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE {part_num} de {CHUNKS})
-- Diagnóstico de FKs {start_idx + 1} a {min(end_idx, TOTAL_FKS)} (Total: {len(chunk_fks)})

CREATE TEMP TABLE diagnostic_results (
    constraint_name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT,
    reason TEXT
);

DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
"""
    
    for fk in chunk_fks:
        name = fk['name']
        src_table = fk['table']
        src_col = fk['columns']
        tgt_table = fk['ref_table']
        tgt_col = fk['ref_columns']
        
        # Check if target is 'auth.users' or similar
        tgt_schema = 'public'
        clean_tgt_table = tgt_table
        if '.' in tgt_table:
            tgt_schema, clean_tgt_table = tgt_table.split('.', 1)

        sql += f"""
    -- Analyzing {name}
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'EXISTS', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{src_table}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_TABLE', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Table {src_table} not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_col}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_COLUMN', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Column {src_table}.{src_col} not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = '{tgt_schema}' AND table_name = '{clean_tgt_table}') 
          AND NOT ('{tgt_schema}' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_TABLE', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Table {tgt_table} not found');
    ELSE
        IF '{tgt_schema}' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = '{clean_tgt_table}' AND a.attname = '{tgt_col}'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_COLUMN', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Column {tgt_table}.{tgt_col} not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_col}';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('{name}', 'TYPE_MISMATCH', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('{name}', 'READY_TO_CREATE', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = '{tgt_schema}' AND table_name = '{clean_tgt_table}' AND column_name = '{tgt_col}') THEN
                 INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_COLUMN', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Column {tgt_table}.{tgt_col} not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_col}';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = '{tgt_schema}' AND table_name = '{clean_tgt_table}' AND column_name = '{tgt_col}';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('{name}', 'TYPE_MISMATCH', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('{tgt_schema}.{clean_tgt_table}')::regclass
                        AND a.attname = '{tgt_col}'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('{name}', 'TARGET_NOT_UNIQUE', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('{name}', 'READY_TO_CREATE', '{src_table}', '{src_col}', '{tgt_table}', '{tgt_col}', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;
"""
    
    sql += """
END $$;

SELECT * FROM diagnostic_results ORDER BY status, constraint_name;

-- Summary for this part
SELECT 
    status, 
    count(*) as total
FROM diagnostic_results
GROUP BY status
ORDER BY total DESC;

DROP TABLE diagnostic_results;
"""
    return sql

index_md = "# Index of Foreign Key Diagnostic Files (Tabular Version)\n\n"
index_md += "| File Name | FK Range | Count | Order |\n"
index_md += "|-----------|----------|-------|-------|\n"

for i in range(CHUNKS):
    start = i * PER_CHUNK
    end = min((i + 1) * PER_CHUNK, TOTAL_FKS)
    part_num = i + 1
    filename = f"bloco_07b_dry_run_part_{part_num:02d}.sql"
    
    with open(filename, 'w') as f:
        f.write(generate_part(part_num, start, end))
    
    index_md += f"| {filename} | {start + 1} - {end} | {end - start} | {part_num} |\n"

with open('bloco_07b_dry_run_INDEX.md', 'w') as f:
    f.write(index_md)

print(f"Generated {CHUNKS} parts and index.")
