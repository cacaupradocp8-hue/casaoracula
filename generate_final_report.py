import json
import re
import collections

# Load the list of missing tables from the shell command output
with open('missing_tables_raw.txt', 'r') as f:
    missing_tables = set([line.strip().replace('MISSING:', '').lower() for line in f.readlines() if line.startswith('MISSING:')])

# Load FK data
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Process FKs
missing_source_tables = set()
missing_target_tables = set()
all_missing_tables = missing_tables
dependencies = collections.defaultdict(list)
status_counts = collections.defaultdict(int)

for fk in fks:
    source_table = fk['table'].lower()
    target_table = fk['ref_table'].lower()
    
    source_missing = source_table in missing_tables
    target_missing = target_table in missing_tables
    
    status = 'READY_TO_CREATE'
    if source_missing and target_missing:
        status = 'MISSING_SOURCE_AND_TARGET'
    elif source_missing:
        status = 'MISSING_SOURCE_TABLE'
    elif target_missing:
        status = 'MISSING_TARGET_TABLE'
    else:
        # Check if it was already marked as EXISTS by the user
        # (We don't have the user's manual result list, so we'll assume it's READY_TO_CREATE if both exist)
        status = 'READY_TO_CREATE'
    
    if source_missing:
        missing_source_tables.add(source_table)
        dependencies[source_table].append(f"{fk['name']} ({source_table} -> {target_table})")
    
    if target_missing:
        missing_target_tables.add(target_table)
        dependencies[target_table].append(f"{fk['name']} ({source_table} -> {target_table})")

    status_counts[status] += 1

# 1. Generate Report
report_md = "# Consolidated Foreign Key Dry-Run Report\n\n"
report_md += "## Summary of Statuses\n\n"
for status, count in sorted(status_counts.items()):
    report_md += f"- **{status}**: {count}\n"

report_md += f"\n- **Total Analyzed**: {len(fks)}\n"

report_md += "\n## Missing Tables as SOURCE\n\n"
for table in sorted(missing_source_tables):
    report_md += f"- {table}\n"

report_md += "\n## Missing Tables as TARGET\n\n"
for table in sorted(missing_target_tables):
    report_md += f"- {table}\n"

report_md += "\n## Consolidated List of All Missing Tables\n\n"
for table in sorted(all_missing_tables):
    report_md += f"- {table}\n"

report_md += "\n## Dependencies (FKs blocked by missing tables)\n\n"
for table in sorted(all_missing_tables):
    report_md += f"### {table}\n"
    for dep in sorted(dependencies[table]):
        report_md += f"- {dep}\n"
    report_md += "\n"

with open('fk_dry_run_consolidated_report.md', 'w') as f:
    f.write(report_md)

# 2. Extract Definitions for Missing Tables
with open('schema_only_cleaned.sql', 'r') as f:
    schema_sql = f.read()

# Improved extractor
blocks = re.split(r'--\s+Name:', schema_sql)
table_definitions = {}

for block in blocks:
    match = re.search(r'CREATE TABLE\s+public\.([\w_]+)\s*\(.*?\);', block, re.DOTALL | re.IGNORECASE)
    if match:
        table_name = match.group(1).lower()
        stmt_match = re.search(r'(CREATE TABLE\s+public\.' + table_name + r'\s*\(.*?\);)', block, re.DOTALL | re.IGNORECASE)
        if stmt_match:
            table_definitions[table_name] = stmt_match.group(1)

# 3. Generate SQL Block
missing_tables_sql = "-- bloco_07c_create_missing_tables_from_fk_diagnostics.sql\n"
missing_tables_sql += "-- Only CREATE TABLE IF NOT EXISTS and PK/UK constraints\n\n"

tables_found = 0
for table in sorted(all_missing_tables):
    if table in table_definitions:
        stmt = table_definitions[table]
        # Clean stmt: ensure IF NOT EXISTS and no data/triggers/RLS inside
        stmt = re.sub(r'CREATE TABLE\s+public\.' + table + r'\s*\(', 'CREATE TABLE IF NOT EXISTS public.' + table + ' (', stmt, flags=re.IGNORECASE)
        missing_tables_sql += stmt + "\n\n"
        tables_found += 1

with open('bloco_07c_create_missing_tables_from_fk_diagnostics.sql', 'w') as f:
    f.write(missing_tables_sql)

print(f"Report and SQL block generated. {tables_found} tables included in SQL.")
