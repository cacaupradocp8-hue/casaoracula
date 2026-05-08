import json
import re
import collections

# 1. Load data
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# 2. Extract existing tables from the manual copy of the query result
# (I'll extract them from the content of the file we viewed)
with open('existing_tables_raw.txt', 'r') as f:
    raw_content = f.read()

# Parse the [map[table_name:xxx] ...] format
existing_tables = set(re.findall(r'table_name:([\w_]+)\]', raw_content))

# 3. Process FKs to identify statuses
report = []
missing_source_tables = set()
missing_target_tables = set()
all_missing_tables = set()

# Map to store which FKs depend on which missing table
dependencies = collections.defaultdict(list)

# Counts
status_counts = collections.defaultdict(int)

for fk in fks:
    source_table = fk['table'].lower()
    target_table = fk['ref_table'].lower()
    
    status = 'READY_TO_CREATE'
    reason = ''
    
    source_exists = source_table in existing_tables
    target_exists = target_table in existing_tables
    
    if not source_exists:
        status = 'MISSING_SOURCE_TABLE'
        missing_source_tables.add(source_table)
        all_missing_tables.add(source_table)
        dependencies[source_table].append(f"{fk['name']} ({source_table} -> {target_table})")
    
    if not target_exists:
        if status == 'READY_TO_CREATE':
            status = 'MISSING_TARGET_TABLE'
        elif status == 'MISSING_SOURCE_TABLE':
            status = 'MISSING_SOURCE_AND_TARGET'
        
        missing_target_tables.add(target_table)
        all_missing_tables.add(target_table)
        dependencies[target_table].append(f"{fk['name']} ({source_table} -> {target_table})")

    # In a real dry run, we'd check if the constraint exists, 
    # but the user said EXISTS: 144, so we'll just report based on their finding if we could,
    # but since we're generating a NEW report based on the NEW state, we'll use our logic.
    
    status_counts[status] += 1
    report.append({
        'name': fk['name'],
        'source': source_table,
        'target': target_table,
        'status': status
    })

# 4. Generate the Consolidated Report
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
    for dep in dependencies[table]:
        report_md += f"- {dep}\n"
    report_md += "\n"

with open('fk_dry_run_consolidated_report.md', 'w') as f:
    f.write(report_md)

# 5. Extract CREATE TABLE definitions for missing tables from schema_only_cleaned.sql
with open('schema_only_cleaned.sql', 'r') as f:
    schema_sql = f.read()

# Improved regex to find CREATE TABLE blocks
# We want to catch the whole block from CREATE TABLE up to the final );
# Tables in this schema seem to follow a consistent pattern.
table_definitions = {}
matches = re.finditer(r'CREATE TABLE\s+(?:public\.)?(\w+)\s*\((.*?)\);', schema_sql, re.DOTALL | re.IGNORECASE)
for match in matches:
    table_name = match.group(1).lower()
    full_body = match.group(0)
    table_definitions[table_name] = full_body

# 6. Generate the missing tables SQL block
missing_tables_sql = "-- bloco_07c_create_missing_tables_from_fk_diagnostics.sql\n"
missing_tables_sql += "-- Only CREATE TABLE IF NOT EXISTS and PK/UK constraints\n\n"

tables_found = []
tables_not_found_in_schema = []

for table in sorted(all_missing_tables):
    if table in table_definitions:
        # Convert CREATE TABLE to CREATE TABLE IF NOT EXISTS
        stmt = table_definitions[table]
        if 'IF NOT EXISTS' not in stmt.upper():
            stmt = re.sub(r'CREATE TABLE', 'CREATE TABLE IF NOT EXISTS', stmt, count=1, flags=re.IGNORECASE)
        missing_tables_sql += stmt + "\n\n"
        tables_found.append(table)
    else:
        tables_not_found_in_schema.append(table)

with open('bloco_07c_create_missing_tables_from_fk_diagnostics.sql', 'w') as f:
    f.write(missing_tables_sql)

print(f"Report generated: fk_dry_run_consolidated_report.md")
print(f"SQL block generated: bloco_07c_create_missing_tables_from_fk_diagnostics.sql")
print(f"Tables found in schema: {len(tables_found)}")
print(f"Tables NOT found in schema: {len(tables_not_found_in_schema)}")
if tables_not_found_in_schema:
    print(f"Missing from schema: {tables_not_found_in_schema}")
