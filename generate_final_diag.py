import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

def get_sql_part(start, size):
    chunk = fks[start:start+size]
    values = []
    for fk in chunk:
        name = fk['name'].replace("'", "''")
        src_table = fk['table'].replace("'", "''")
        src_cols = fk['columns'].replace("'", "''")
        tgt_table = fk['ref_table'].replace("'", "''")
        tgt_cols = fk['ref_columns'].replace("'", "''")
        values.append(f"('{name}', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}')")
    
    values_str = ",\n".join(values)
    
    return f"""
WITH fks(name, src_t, src_c, tgt_t, tgt_c) AS (
    VALUES 
{values_str}
),
table_exists AS (
    SELECT table_name, true as exists 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
),
column_exists AS (
    SELECT table_name, column_name, data_type, true as exists
    FROM information_schema.columns 
    WHERE table_schema = 'public'
),
constraint_exists AS (
    SELECT conname, true as exists 
    FROM pg_constraint
),
unique_cols AS (
    SELECT 
        idx.indrelid::regclass::text as table_name,
        att.attname as column_name,
        true as is_unique
    FROM pg_index idx
    JOIN pg_attribute att ON att.attrelid = idx.indrelid AND att.attnum = ANY(idx.indkey)
    WHERE idx.indisunique 
    AND array_length(idx.indkey, 1) = 1
)
SELECT 
    f.name,
    f.src_t as source_table,
    f.src_c as source_column,
    f.tgt_t as target_table,
    f.tgt_c as target_column,
    CASE 
        WHEN ce.exists THEN 'EXISTS'
        WHEN NOT te_src.exists THEN 'MISSING_SOURCE_TABLE'
        WHEN NOT co_src.exists THEN 'MISSING_SOURCE_COLUMN'
        WHEN NOT te_tgt.exists AND NOT (f.tgt_t = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
        WHEN NOT co_tgt.exists AND NOT (f.tgt_t = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_COLUMN'
        WHEN co_src.data_type <> co_tgt.data_type AND NOT (f.tgt_t = 'profiles') THEN 'TYPE_MISMATCH'
        WHEN NOT uc.is_unique AND NOT (f.tgt_t = 'profiles') THEN 'TARGET_NOT_UNIQUE'
        ELSE 'READY_TO_CREATE'
    END as status
FROM fks f
LEFT JOIN constraint_exists ce ON ce.conname = f.name
LEFT JOIN table_exists te_src ON te_src.table_name = f.src_t
LEFT JOIN column_exists co_src ON co_src.table_name = f.src_t AND co_src.column_name = f.src_c
LEFT JOIN table_exists te_tgt ON te_tgt.table_name = f.tgt_t
LEFT JOIN column_exists co_tgt ON co_tgt.table_name = f.tgt_t AND co_tgt.column_name = f.tgt_c
LEFT JOIN unique_cols uc ON (uc.table_name = 'public.' || f.tgt_t OR uc.table_name = f.tgt_t) AND uc.column_name = f.tgt_c;
"""

with open('final_diag_1.sql', 'w') as f:
    f.write(get_sql_part(0, 192))

with open('final_diag_2.sql', 'w') as f:
    f.write(get_sql_part(192, 192))
