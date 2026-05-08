
import fs from 'fs';

const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));

function generateChunkQuery(chunk) {
  let values = chunk.map(fk => 
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
        WHERE t.relname = fk.ref_table AND a.attname = fk.ref_columns -- Simplification for single column
        AND i.indisunique AND n.nspname = 'public'
    )) as target_unique
FROM (
    VALUES 
    ${values}
) as fk(name, table_name, ref_table, ref_columns);
  `;
}

// Split into chunks of 50
const chunkSize = 50;
for (let i = 0; i < fks.length; i += chunkSize) {
  const chunk = fks.slice(i, i + chunkSize);
  fs.writeFileSync(`query_chunk_${i/chunkSize}.sql`, generateChunkQuery(chunk));
}

console.log(`Generated ${Math.ceil(fks.length/chunkSize)} query chunks.`);
