
import fs from 'fs';

const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));

function generateChunkQuery(start, end) {
  let values = fks.slice(start, end).map(fk => 
    `('${fk.name}', '${fk.table}', '${fk.ref_table}', '${fk.ref_columns}')`
  ).join(',\n    ');

  return `
SELECT
    fk.name,
    fk.table_name,
    fk.ref_table,
    fk.ref_columns,
    EXISTS (SELECT 1 FROM pg_constraint WHERE conname = fk.name) as exists,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.table_name) as source_table_exists,
    EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = fk.ref_table) as target_table_exists,
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
) as fk(name, table_name, ref_table, ref_columns);
  `;
}

fs.writeFileSync('diag_part1.sql', generateChunkQuery(0, 200));
fs.writeFileSync('diag_part2.sql', generateChunkQuery(200, 384));
