import re
import os

schema_path = 'backup_casa_oracula/schema_only.sql'

fk_pattern = re.compile(r'ALTER TABLE ONLY (?:public\.)?(\w+)[\s\n]+ADD CONSTRAINT (\w+) FOREIGN KEY \((.*?)\) REFERENCES (?:public\.)?(\w+)\((.*?)\)(.*?);', re.DOTALL)

with open(schema_path, 'r', encoding='latin-1') as f:
    content = f.read()

fks = []
# Standard pg_dump format: ALTER TABLE ONLY public.table ADD CONSTRAINT name FOREIGN KEY (...) REFERENCES ...
# Sometimes it is split across lines.
matches = fk_pattern.finditer(content)
for m in matches:
    fks.append({
        'table': m.group(1),
        'name': m.group(2),
        'columns': m.group(3).strip(),
        'ref_table': m.group(4),
        'ref_columns': m.group(5).strip(),
        'extra': m.group(6).strip()
    })

print(f"Found {len(fks)} FKs in schema_only.sql")

with open('fks_from_schema.json', 'w') as f:
    import json
    json.dump(fks, f)
