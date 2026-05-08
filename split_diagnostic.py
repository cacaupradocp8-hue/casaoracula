import json
import os

# Load the FKs
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Simulation based on the logic and user's summary
# Statuses: EXISTS, READY_TO_CREATE, TARGET_NOT_UNIQUE, MISSING_SOURCE_TABLE, MISSING_TARGET_TABLE, TYPE_MISMATCH

# I will use the tool outputs I've seen to determine the status of each FK.
# Since I can't parse all 4000 rows here easily, I'll use a script to help me.

# 1. Collect all tables and columns from previous tool results
# I'll manually mock the most important ones or use the logic.
# However, I can actually just write a SQL script that uses RAISE NOTICE to output the names
# and I can read the console logs.
# But the user specifically asked for a consolidated report.

# Let's try to run the diagnostic in smaller chunks using supabase--read_query
# and then I can build the final files.

def get_chunk(start, size):
    chunk = fks[start:start+size]
    sql = """
CREATE TEMP TABLE results (name TEXT, status TEXT, source_table TEXT, source_column TEXT, target_table TEXT, target_column TEXT);
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
"""
    for fk in chunk:
        name = fk['name']
        src_table = fk['table']
        src_cols = fk['columns']
        tgt_table = fk['ref_table']
        tgt_cols = fk['ref_columns']
        
        # Simple single column check
        if ',' in src_cols or ',' in tgt_cols:
             sql += f"INSERT INTO results VALUES ('{name}', 'COMPOSITE_SKIPPED', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');\n"
             continue

        sql += f"""
    -- Analyzing {name}
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN
        INSERT INTO results VALUES ('{name}', 'EXISTS', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{src_table}') THEN
        INSERT INTO results VALUES ('{name}', 'MISSING_SOURCE_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}') THEN
        INSERT INTO results VALUES ('{name}', 'MISSING_SOURCE_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{tgt_table}') 
          AND NOT ('{tgt_table}' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('{name}', 'MISSING_TARGET_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}') THEN
             INSERT INTO results VALUES ('{name}', 'MISSING_TARGET_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('{name}', 'TYPE_MISMATCH', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN '{tgt_table}' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('{tgt_table}') END)::regclass
                    AND a.attname = '{tgt_cols}'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('{name}', 'TARGET_NOT_UNIQUE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
                ELSE
                    INSERT INTO results VALUES ('{name}', 'READY_TO_CREATE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
                END IF;
            END IF;
        END IF;
    END IF;
"""
    sql += """
END $$;
SELECT * FROM results;
"""
    return sql

# I'll run this for all 384 FKs in 4 chunks of ~100
for i in range(0, 384, 100):
    with open(f'diag_part_{i//100 + 1}.sql', 'w') as f:
        f.write(get_chunk(i, 100))
