import json
import os
import subprocess

def run_query(query):
    # This is a placeholder. I will actually use code--exec to run psql.
    # Since I cannot run python to call psql easily with proper quoting, 
    # I will write a SQL script that returns the data I need.
    pass

# Read the FKs
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Generate a diagnostic SQL that checks everything at once
# We need:
# 1. Existing constraints
# 2. Existing tables
# 3. Existing columns
# 4. Column types
# 5. Uniqueness of target columns

diagnostic_sql = """
WITH tables AS (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
),
columns AS (
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public'
),
constraints AS (
    SELECT conname 
    FROM pg_constraint
),
unique_cols AS (
    SELECT 
        idx.indrelid::regclass::text as table_name,
        att.attname as column_name
    FROM pg_index idx
    JOIN pg_attribute att ON att.attrelid = idx.indrelid AND att.attnum = ANY(idx.indkey)
    WHERE idx.indisunique 
    AND array_length(idx.indkey, 1) = 1
)
SELECT 
    t.table_name,
    c.column_name,
    u.table_name IS NOT NULL as is_unique
FROM columns c
LEFT JOIN unique_cols u ON u.table_name = 'public.' || c.table_name AND u.column_name = c.column_name
JOIN tables t ON t.table_name = c.table_name;
"""

# Actually, I'll just write a script that generates the 8 dry-run files' logic into one big diagnostic query
# but instead of inserting into a temp table, it just returns the results.

fks_json_path = 'fks_from_schema.json'

with open(fks_json_path, 'r') as f:
    fks = json.load(f)

print(f"Loaded {len(fks)} FKs")

# Let's create a SQL script that performs the checks and outputs as CSV or JSON
# I'll use the logic from the user's provided scripts but streamlined.

sql_parts = []
sql_parts.append("""
CREATE TEMP TABLE diagnostic_results (
    name TEXT,
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
""")

for fk in fks:
    name = fk['name']
    src_table = fk['table']
    src_cols = fk['columns']
    tgt_table = fk['ref_table']
    tgt_cols = fk['ref_columns']
    
    # Simple check for multipart columns (not supported well by the current simple logic)
    if ',' in src_cols or ',' in tgt_cols:
        # If it's composite, we might need more complex logic, but usually it's single
        # For now, let's treat them as single if possible or skip.
        pass

    sql_parts.append(f"""
    -- Analyzing {name}
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'EXISTS', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{src_table}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Table {src_table} not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Column {src_table}.{src_cols} not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{tgt_table}') 
          AND NOT ('{tgt_table}' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Table {tgt_table} not found');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}') THEN
             INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Column {tgt_table}.{tgt_cols} not found');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO diagnostic_results VALUES ('{name}', 'TYPE_MISMATCH', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.' || quote_ident('{tgt_table}'))::regclass
                    AND a.attname = '{tgt_cols}'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO diagnostic_results VALUES ('{name}', 'TARGET_NOT_UNIQUE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Target column is not unique');
                ELSE
                    INSERT INTO diagnostic_results VALUES ('{name}', 'READY_TO_CREATE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}', 'Ready to create');
                END IF;
            END IF;
        END IF;
    END IF;
""")

sql_parts.append("""
END $$;
SELECT * FROM diagnostic_results;
""")

with open('full_diagnostic.sql', 'w') as f:
    f.write("\n".join(sql_parts))
