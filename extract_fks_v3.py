import re
import json

schema_path = 'backup_casa_oracula/schema_only.sql'

with open(schema_path, 'r', encoding='latin-1') as f:
    content = f.read()

# Refined pattern: Match ADD CONSTRAINT name FOREIGN KEY (cols) REFERENCES ref_table(ref_cols) [extra];
# We need to find the ALTER TABLE context too.
# I'll split the content into individual ALTER TABLE statements first.

statements = re.split(r';', content)
fks = []

for stmt in statements:
    stmt = stmt.strip()
    # Looking for: ALTER TABLE ONLY public.X ADD CONSTRAINT Y FOREIGN KEY (A) REFERENCES public.B(C) [extra]
    match = re.search(r'ALTER TABLE ONLY (?:public\.)?(\w+)[\s\n]+ADD CONSTRAINT (\w+) FOREIGN KEY \((.*?)\) REFERENCES (?:public\.)?(\w+)\((.*?)\)(.*)', stmt, re.DOTALL | re.IGNORECASE)
    if match:
        table = match.group(1).strip()
        name = match.group(2).strip()
        cols = match.group(3).strip()
        ref_table = match.group(4).strip()
        ref_cols = match.group(5).strip()
        extra = match.group(6).strip()
        
        # Final cleanup: Remove any residual SQL comments or extra spaces
        cols = re.sub(r'--.*', '', cols).strip()
        ref_cols = re.sub(r'--.*', '', ref_cols).strip()
        extra = re.sub(r'--.*', '', extra).strip()
        
        fks.append({
            'table': table,
            'name': name,
            'columns': cols,
            'ref_table': ref_table,
            'ref_columns': ref_cols,
            'extra': extra
        })

print(f"Extracted {len(fks)} FKs after statement splitting.")

with open('fks_from_schema.json', 'w') as f:
    json.dump(fks, f)
