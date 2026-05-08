import re
import os

# 1. List of existing tables in DB (extracted from previous tool call output)
# I'll use the truncated list and assume the user's count of 213 is correct, 
# but I need the exact names to know what is MISSING.
# I'll read the full list from the DB in the script using a loop if needed, 
# but wait, I can just use the names I have and check the count.
# Actually, I'll use a better way to get ALL table names in the script.

def get_existing_tables():
    # Since I can't run supabase--read_query from inside the script, 
    # I'll pass the list as a variable or read it from a file.
    # I'll create a file with the table names.
    with open('existing_tables.txt', 'r') as f:
        return [line.strip() for line in f if line.strip()]

def parse_schema(schema_path):
    with open(schema_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Find all CREATE TABLE blocks
    # Pattern: CREATE TABLE public.<name> ( ... );
    # This can be multiline.
    tables = {}
    
    # Simple regex to find table names first
    table_names = re.findall(r'CREATE TABLE public\.(\w+)', content)
    
    # Now extract the full CREATE TABLE statement for each
    for table in table_names:
        # Match from CREATE TABLE public.table until the closing );
        # Handle potential nested parentheses if any (though usually not in standard pg_dump DDL)
        pattern = r'CREATE TABLE public\.' + table + r'\s*\((?:[^;]*?)\);'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            tables[table] = {
                'create': match.group(0),
                'constraints': []
            }

    # Find all ALTER TABLE ... ADD CONSTRAINT ... PRIMARY KEY/UNIQUE
    # Pattern: ALTER TABLE ONLY public.<name> ADD CONSTRAINT <cname> PRIMARY KEY (...)
    pk_uk_patterns = [
        r'ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT \w+ PRIMARY KEY',
        r'ALTER TABLE ONLY public\.(\w+)\s+ADD CONSTRAINT \w+ UNIQUE'
    ]
    
    for pattern in pk_uk_patterns:
        matches = re.finditer(pattern, content)
        for m in matches:
            tname = m.group(1)
            # Find the full statement until semicolon
            stmt_pattern = r'ALTER TABLE ONLY public\.' + tname + r'\s+ADD CONSTRAINT ' + re.escape(m.group(0).split('ADD CONSTRAINT ')[1].split()[0]) + r'[^;]*;'
            # Wait, that's complex. Let's just find the whole line.
            # Standard pg_dump has it on one line or a few lines.
            full_stmt_match = re.search(r'ALTER TABLE ONLY public\.' + tname + r'\s+ADD CONSTRAINT [^;]+;', content[m.start():m.start()+500])
            if full_stmt_match:
                if tname in tables:
                    tables[tname]['constraints'].append(full_stmt_match.group(0))

    return tables

def generate_fk_report(missing_tables, existing_tables, fk_sql_path):
    with open(fk_sql_path, 'r') as f:
        fk_content = f.read()
    
    # Each DO $fk$ block contains one FK.
    blocks = re.findall(r'DO \$fk\$.*?END \$fk\$;', fk_content, re.DOTALL)
    
    report = "# Foreign Keys Skipped Report\n\n"
    report += "| Source Table | Target Table | Constraint Name | Status | Reason |\n"
    report += "|--------------|--------------|-----------------|--------|--------|\n"
    
    all_tables = set(missing_tables) | set(existing_tables)
    
    skipped_count = 0
    created_count = 0
    
    for block in blocks:
        # Extract table names and constraint name
        # Source table: ALTER TABLE ONLY public.<name>
        source_match = re.search(r'ALTER TABLE ONLY public\.(\w+)', block)
        # Target table: REFERENCES public.<name>
        target_match = re.search(r'REFERENCES public\.(\w+)', block)
        # Constraint name: ADD CONSTRAINT (\w+)
        const_match = re.search(r'ADD CONSTRAINT (\w+)', block)
        
        if source_match and target_match and const_match:
            source = source_match.group(1)
            target = target_match.group(1)
            const = const_match.group(1)
            
            status = "Created"
            reason = "-"
            
            if source not in all_tables:
                status = "Skipped"
                reason = "Source table missing from schema"
                skipped_count += 1
            elif source in missing_tables:
                status = "Skipped"
                reason = f"Source table '{source}' not yet in DB"
                skipped_count += 1
            elif target not in all_tables:
                status = "Skipped"
                reason = "Target table missing from schema"
                skipped_count += 1
            elif target in missing_tables:
                status = "Skipped"
                reason = f"Target table '{target}' not yet in DB"
                skipped_count += 1
            else:
                created_count += 1
            
            # Only include skipped or interesting ones if list is too long, 
            # but user asked for report on skipped ones.
            if status == "Skipped":
                report += f"| {source} | {target} | {const} | {status} | {reason} |\n"
    
    report += f"\n**Summary:**\n"
    report += f"- Total FKs analyzed: {len(blocks)}\n"
    report += f"- Potentially Created: {created_count}\n"
    report += f"- Skipped: {skipped_count}\n"
    
    return report

def main():
    existing = get_existing_tables()
    all_tables_def = parse_schema('/mnt/documents/schema_only_cleaned.sql')
    
    missing_tables = [t for t in all_tables_def if t not in existing]
    
    # 1. Report
    with open('table_comparison_report.md', 'w') as f:
        f.write("# Table Comparison Report\n\n")
        f.write(f"- Expected tables in schema: {len(all_tables_def)}\n")
        f.write(f"- Existing tables in DB: {len(existing)}\n")
        f.write(f"- Missing tables: {len(missing_tables)}\n\n")
        f.write("## Missing Tables List\n")
        for t in sorted(missing_tables):
            f.write(f"- {t}\n")

    # 2. SQL Block
    with open('bloco_07_tables_restantes_reservadas.sql', 'w') as f:
        f.write("-- Bloco 07: Tabelas Restantes e Reservadas\n")
        f.write("-- Gerado automaticamente para completar o schema\n\n")
        f.write("SET statement_timeout = 0;\n")
        f.write("SET client_encoding = 'SQL_ASCII';\n")
        f.write("SET standard_conforming_strings = off;\n")
        f.write("SET check_function_bodies = false;\n")
        f.write("SET client_min_messages = warning;\n\n")
        
        for tname in sorted(missing_tables):
            f.write(f"-- Table: {tname}\n")
            # Replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
            create_stmt = all_tables_def[tname]['create']
            create_stmt = create_stmt.replace(f'CREATE TABLE public.{tname}', f'CREATE TABLE IF NOT EXISTS public.{tname}')
            f.write(create_stmt + "\n")
            
            # Add PK/UK constraints
            for const in all_tables_def[tname]['constraints']:
                # Wrap in DO block for idempotency
                # ALTER TABLE ONLY public.table ADD CONSTRAINT name ...
                const_name = re.search(r'ADD CONSTRAINT (\w+)', const).group(1)
                f.write(f"DO $pkuk$\nBEGIN\n    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{const_name}') THEN\n        {const}\n    END IF;\nEND\n$pkuk$;\n")
            f.write("\n")

    # 3. FK Report
    fk_report = generate_fk_report(missing_tables, existing, '/mnt/documents/bloco_07_foreign_keys_SAFE.sql')
    with open('foreign_keys_skipped_report.md', 'w') as f:
        f.write(fk_report)

if __name__ == "__main__":
    main()
