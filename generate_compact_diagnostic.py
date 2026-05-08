import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

sql_values = []
for fk in fks:
    # Escape single quotes in names
    name = fk['name'].replace("'", "''")
    src_table = fk['table'].replace("'", "''")
    src_cols = fk['columns'].replace("'", "''")
    tgt_table = fk['ref_table'].replace("'", "''")
    tgt_cols = fk['ref_columns'].replace("'", "''")
    sql_values.append(f"('{name}', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}')")

values_str = ",\n".join(sql_values)

sql = f"""
WITH fk_data(name, src_table, src_cols, tgt_table, tgt_cols) AS (
    VALUES 
{values_str}
),
diagnostic AS (
    SELECT 
        fd.name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = fd.name) THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = fd.src_table) THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = fd.src_table AND column_name = fd.src_cols) THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = fd.tgt_table) 
                 AND NOT (fd.tgt_table = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = fd.tgt_table AND column_name = fd.tgt_cols) THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = fd.src_table AND column_name = fd.src_cols) 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = fd.tgt_table AND column_name = fd.tgt_cols) THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN fd.tgt_table = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident(fd.tgt_table) END)::regclass
                AND a.attname = fd.tgt_cols
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status
    FROM fk_data fd
)
SELECT name, status FROM diagnostic;
"""

with open('compact_diagnostic.sql', 'w') as f:
    f.write(sql)
