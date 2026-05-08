import json

# Load the FKs
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

def get_fk_diagnostic_select(fk):
    name = fk['name']
    src_table = fk['table']
    src_cols = fk['columns']
    tgt_table = fk['ref_table']
    tgt_cols = fk['ref_columns']
    
    # We'll use a series of CASE statements to determine the status
    return f"""
    SELECT 
        '{name}' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{src_table}') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{tgt_table}') 
                 AND NOT ('{tgt_table}' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN '{tgt_table}' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('{tgt_table}') END)::regclass
                AND a.attname = '{tgt_cols}'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        '{src_table}' as source_table,
        '{src_cols}' as source_column,
        '{tgt_table}' as target_table,
        '{tgt_cols}' as target_column
    """

# Split into chunks of 50 to avoid too large query strings
for i in range(0, 384, 50):
    chunk = fks[i:i+50]
    selects = [get_fk_diagnostic_select(fk) for fk in chunk]
    with open(f'diag_select_part_{i//50 + 1}.sql', 'w') as f:
        f.write(" UNION ALL ".join(selects))
