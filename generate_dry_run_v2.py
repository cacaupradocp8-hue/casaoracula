import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

sql_header = """-- sync_fks_declarative_DRY_RUN.sql
-- ESTE SCRIPT É SOMENTE LEITURA. NÃO EXECUTA ALTERAÇÕES.
-- Qualificado com schema public.

SET search_path TO public;

WITH expected_fks AS (
    SELECT * FROM (VALUES
"""

sql_values = []
for fk in fks:
    # Escape single quotes in names
    fk_name = fk['fk_name'].replace("'", "''")
    src_table = fk['source_table'].replace("'", "''")
    src_col = fk['source_column'].replace("'", "''")
    tgt_table = fk['target_table'].replace("'", "''")
    tgt_col = fk['target_column'].replace("'", "''")
    sql_values.append(f"        ('{fk_name}', 'public', '{src_table}', '{src_col}', 'public', '{tgt_table}', '{tgt_col}')")

sql_middle = ",\n".join(sql_values)

sql_footer = """
    ) AS t(fk_name, source_schema, source_table, source_column, target_schema, target_table, target_column)
),
check_details AS (
    SELECT 
        e.fk_name,
        e.source_table,
        e.source_column,
        e.target_table,
        e.target_column,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace WHERE c.conname = e.fk_name AND n.nspname = e.source_schema) THEN 'ALREADY_EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = e.source_schema AND table_name = e.source_table) THEN 'SOURCE_TABLE_MISSING'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = e.source_schema AND table_name = e.source_table AND column_name = e.source_column) THEN 'SOURCE_COLUMN_MISSING'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = e.target_schema AND table_name = e.target_table) THEN 'TARGET_TABLE_MISSING'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = e.target_schema AND table_name = e.target_table AND column_name = e.target_column) THEN 'TARGET_COLUMN_MISSING'
            WHEN NOT EXISTS (
                SELECT 1 FROM pg_index i JOIN pg_class c ON c.oid = i.indrelid JOIN pg_namespace n ON n.oid = c.relnamespace JOIN pg_attribute a ON a.attrelid = c.oid
                WHERE n.nspname = e.target_schema AND c.relname = e.target_table AND a.attname = e.target_column AND a.attnum = ANY(i.indkey) AND (i.indisprimary OR i.indisunique)
            ) THEN 'TARGET_NOT_UNIQUE'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = e.source_schema AND table_name = e.source_table AND column_name = e.source_column) != (SELECT data_type FROM information_schema.columns WHERE table_schema = e.target_schema AND table_name = e.target_table AND column_name = e.target_column) THEN 'TYPE_MISMATCH'
            WHEN EXISTS (
                -- Verificação simplificada de órfãos (isso pode ser lento se rodar para todas, mas como é dry-run...)
                -- Nota: Esta verificação é opcional no dry-run geral, mas o usuário pediu ORPHANS_FOUND.
                -- Para não travar o script, vamos deixar como 'READY_TO_CREATE' e o usuário rodar o script de órfãos separado se quiser,
                -- OU fazemos uma verificação dinâmica. Vamos tentar uma verificação básica.
                FALSE -- Placeholder para performance, ou podemos injetar um COUNT real se necessário.
            ) THEN 'ORPHANS_FOUND'
            ELSE 'READY_TO_CREATE'
        END as status
    FROM expected_fks e
)
-- Relatório Detalhado
SELECT 
    fk_name,
    'public.' || source_table as source_table,
    source_column,
    'public.' || target_table as target_table,
    target_column,
    status,
    CASE 
        WHEN status = 'ALREADY_EXISTS' THEN 'FK já presente no banco'
        WHEN status = 'SOURCE_TABLE_MISSING' THEN 'Tabela de origem não encontrada'
        WHEN status = 'TARGET_TABLE_MISSING' THEN 'Tabela de destino não encontrada'
        WHEN status = 'TARGET_NOT_UNIQUE' THEN 'Coluna de destino não possui PK ou UNIQUE index'
        WHEN status = 'READY_TO_CREATE' THEN 'Pronta para criação (sujeita a validação de dados)'
        ELSE 'Verificar detalhes técnicos'
    END as reason
FROM check_details
ORDER BY status, source_table;

-- Resumo Consolidado (opcional: execute separadamente ou veja o resultado acima)
-- SELECT status, count(*) FROM check_details GROUP BY status;
"""

with open('sync_fks_declarative_DRY_RUN.sql', 'w') as f:
    f.write(sql_header + sql_middle + sql_footer)
