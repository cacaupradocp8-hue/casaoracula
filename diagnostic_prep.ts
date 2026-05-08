
import fs from 'fs';

async function main() {
  const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));
  
  // We will generate the queries to fetch current state
  const queryTables = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`;
  const queryColumns = `SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public';`;
  const queryConstraints = `SELECT conname, conrelid::regclass::text as table_name, contype FROM pg_constraint WHERE connamespace = 'public'::regnamespace;`;
  const queryUnique = `
    SELECT
        t.relname AS table_name,
        a.attname AS column_name
    FROM
        pg_class t
        JOIN pg_attribute a ON a.attrelid = t.relid
        JOIN pg_index i ON i.indrelid = t.relid
        JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE
        a.attnum = ANY(i.indkey)
        AND i.indisunique
        AND n.nspname = 'public';
  `;

  console.log("---BEGIN QUERIES---");
  console.log(JSON.stringify({ queryTables, queryColumns, queryConstraints, queryUnique }));
  console.log("---END QUERIES---");
}

main();
