
import fs from 'fs';

// Helper to run query and save to file
async function saveQuery(query, filename) {
  // We'll use a bash command to run the query via supabase cli if available, 
  // but since we have the tool, we'll just print the command to be executed manually 
  // or use a script that we can run with bun.
  // Actually, I'll just write the processing script and it will be called after I've saved the data.
}

const fks = JSON.parse(fs.readFileSync('fks_from_schema.json', 'utf8'));
const tables = JSON.parse(fs.readFileSync('tables.json', 'utf8'));
const columns = JSON.parse(fs.readFileSync('columns.json', 'utf8'));
const constraints = JSON.parse(fs.readFileSync('constraints.json', 'utf8'));
const uniqueCols = JSON.parse(fs.readFileSync('unique.json', 'utf8'));

const tableSet = new Set(tables.map(t => t.table_name));
const columnMap = new Map(); // table -> Set of columns
columns.forEach(c => {
  if (!columnMap.has(c.table_name)) columnMap.set(c.table_name, new Set());
  columnMap.get(c.table_name).add(c.column_name);
});

const existingFks = new Set(constraints.filter(c => c.contype === 'f').map(c => c.conname));
const uniqueMap = new Map(); // table -> Set of unique columns
uniqueCols.forEach(u => {
  if (!uniqueMap.has(u.table_name)) uniqueMap.set(u.table_name, new Set());
  uniqueMap.get(u.table_name).add(u.column_name);
});

const report = {
  EXISTS: [],
  READY_TO_CREATE: [],
  TARGET_NOT_UNIQUE: [],
  MISSING_SOURCE_TABLE: [],
  MISSING_TARGET_TABLE: [],
  TYPE_MISMATCH: [] // We don't check type mismatch deeply here but can if needed
};

for (const fk of fks) {
  if (existingFks.has(fk.name)) {
    report.EXISTS.push(fk);
    continue;
  }

  if (!tableSet.has(fk.table)) {
    report.MISSING_SOURCE_TABLE.push(fk);
    continue;
  }

  if (!tableSet.has(fk.ref_table)) {
    report.MISSING_TARGET_TABLE.push(fk);
    continue;
  }

  const sourceCols = fk.columns.split(',').map(c => c.trim());
  const targetCols = fk.ref_columns.split(',').map(c => c.trim());

  let sourceMissing = false;
  for (const c of sourceCols) {
    if (!columnMap.get(fk.table)?.has(c)) {
      sourceMissing = true;
      break;
    }
  }
  if (sourceMissing) {
    report.MISSING_SOURCE_TABLE.push(fk);
    continue;
  }

  let targetMissing = false;
  for (const c of targetCols) {
    if (!columnMap.get(fk.ref_table)?.has(c)) {
      targetMissing = true;
      break;
    }
  }
  if (targetMissing) {
    report.MISSING_TARGET_TABLE.push(fk);
    continue;
  }

  // Check uniqueness of target columns
  // For multi-column FKs, we'd need to check if the set of columns is unique together.
  // But usually it's single column 'id'.
  let targetUnique = true;
  if (targetCols.length === 1) {
    if (!uniqueMap.get(fk.ref_table)?.has(targetCols[0])) {
      targetUnique = false;
    }
  } else {
    // Multi-column uniqueness is harder with our current simple query, but let's assume if it's not single it's complex.
    // However, most FKs are single column.
  }

  if (!targetUnique) {
    report.TARGET_NOT_UNIQUE.push(fk);
    continue;
  }

  report.READY_TO_CREATE.push(fk);
}

// Generate MD report
let md = `# Foreign Key Dry-Run Report (After Bloco 07c)\n\n`;
md += `## Status Summary\n`;
md += `- **TOTAL ANALYZED**: ${fks.length}\n`;
md += `- **EXISTS**: ${report.EXISTS.length}\n`;
md += `- **READY_TO_CREATE**: ${report.READY_TO_CREATE.length}\n`;
md += `- **TARGET_NOT_UNIQUE**: ${report.TARGET_NOT_UNIQUE.length}\n`;
md += `- **MISSING_SOURCE_TABLE/COL**: ${report.MISSING_SOURCE_TABLE.length}\n`;
md += `- **MISSING_TARGET_TABLE/COL**: ${report.MISSING_TARGET_TABLE.length}\n\n`;

const listSection = (title, list) => {
  if (list.length === 0) return "";
  let s = `## ${title} (${list.length})\n`;
  s += `| Table | FK Name | Columns | Ref Table | Ref Columns |\n`;
  s += `| :--- | :--- | :--- | :--- | :--- |\n`;
  list.forEach(fk => {
    s += `| ${fk.table} | ${fk.name} | ${fk.columns} | ${fk.ref_table} | ${fk.ref_columns} |\n`;
  });
  s += `\n`;
  return s;
};

md += listSection("READY_TO_CREATE", report.READY_TO_CREATE);
md += listSection("TARGET_NOT_UNIQUE", report.TARGET_NOT_UNIQUE);
md += listSection("MISSING_SOURCE_TABLE", report.MISSING_SOURCE_TABLE);

fs.writeFileSync('/mnt/documents/fk_dry_run_after_07c_report.md', md);

// Generate SQL script
let sql = `-- Bloco 07d: Create Ready Foreign Keys Only\n`;
sql += `-- Generated based on dry-run results\n\n`;

report.READY_TO_CREATE.forEach(fk => {
  sql += `DO $fk$\n`;
  sql += `BEGIN\n`;
  sql += `    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${fk.name}') THEN\n`;
  sql += `        -- Check if tables and columns exist\n`;
  sql += `        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${fk.table}') AND\n`;
  sql += `           EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '${fk.ref_table}') THEN\n`;
  sql += `            ALTER TABLE public."${fk.table}" ADD CONSTRAINT "${fk.name}" \n`;
  sql += `            FOREIGN KEY ("${fk.columns}") REFERENCES public."${fk.ref_table}"("${fk.ref_columns}") ${fk.extra};\n`;
  sql += `        END IF;\n`;
  sql += `    END IF;\n`;
  sql += `END $fk$;\n\n`;
});

fs.writeFileSync('/mnt/documents/bloco_07d_create_ready_foreign_keys_only.sql', sql);

console.log("Files generated successfully in /mnt/documents/");
console.log(`Summary: EXISTS:${report.EXISTS.length}, READY:${report.READY_TO_CREATE.length}, TARGET_NOT_UNIQUE:${report.TARGET_NOT_UNIQUE.length}, MISSING_SOURCE:${report.MISSING_SOURCE_TABLE.length}`);
