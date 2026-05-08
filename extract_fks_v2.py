import re
import json

schema_path = 'backup_casa_oracula/schema_only.sql'

with open(schema_path, 'r', encoding='latin-1') as f:
    content = f.read()

# Improved pattern to handle noise and multi-line definitions in pg_dump
# We look for ALTER TABLE ONLY ... ADD CONSTRAINT ... FOREIGN KEY ...
# We match everything until the semicolon.
fk_block_pattern = re.compile(r'ALTER TABLE ONLY (?:public\.)?(\w+)[\s\n]+ADD CONSTRAINT (\w+) FOREIGN KEY \((.*?)\) REFERENCES (?:public\.)?(\w+)\((.*?)\)(.*?);', re.DOTALL)

fks = []
matches = fk_block_pattern.finditer(content)
for m in matches:
    table = m.group(1).strip()
    name = m.group(2).strip()
    cols = m.group(3).strip()
    ref_table = m.group(4).strip()
    ref_cols = m.group(5).strip()
    extra = m.group(6).strip()
    
    # Clean up multi-line values and noise
    cols = re.sub(r'[\n\s]+', ' ', cols)
    ref_cols = re.sub(r'[\n\s]+', ' ', ref_cols)
    extra = re.sub(r'[\n\s]+', ' ', extra)
    
    fks.append({
        'table': table,
        'name': name,
        'columns': cols,
        'ref_table': ref_table,
        'ref_columns': ref_cols,
        'extra': extra
    })

print(f"Cleanly extracted {len(fks)} FKs")

with open('fks_from_schema.json', 'w') as f:
    json.dump(fks, f)
