
import fs from 'fs';

const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));

function generateDiagnosticSummaryQuery() {
  let values = fks.map(fk => 
    `('${fk.name}', '${fk.table}', '${fk.ref_table}', '${fk.ref_columns}')`
  ).join(',\n    ');

  return `
WITH diag AS (
    SELECT
        fk.name,
        fk.table_name,
        fk.ref_table,
        fk.ref_columns,
        EXISTS (SELECT 1 FROM pg_constraint WHERE conname = fk.name) as exists,
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.table_name) as source_exists,
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.ref_table) as target_exists,
        (SELECT EXISTS (
            SELECT 1 FROM pg_class t
            JOIN pg_attribute a ON a.attrelid = t.oid
            JOIN pg_index i ON i.indrelid = t.oid
            JOIN pg_namespace n ON n.oid = t.relnamespace
            WHERE t.relname = fk.ref_table AND a.attname = fk.ref_columns
            AND i.indisunique AND n.nspname = 'public'
        )) as target_unique
    FROM (
        VALUES 
        ${values}
    ) as fk(name, table_name, ref_table, ref_columns)
)
SELECT 
    name, table_name, ref_table, ref_columns,
    CASE 
        WHEN exists THEN 'EXISTS'
        WHEN NOT source_exists THEN 'MISSING_SOURCE_TABLE'
        WHEN NOT target_exists THEN 'MISSING_TARGET_TABLE'
        WHEN NOT target_unique THEN 'TARGET_NOT_UNIQUE'
        ELSE 'READY_TO_CREATE'
    END as status
FROM diag;
  `;
}

fs.writeFileSync('final_diag.sql', generateDiagnosticSummaryQuery());
