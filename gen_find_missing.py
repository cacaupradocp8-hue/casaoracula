import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Group FKs to check existence
sql = "SELECT conname FROM pg_constraint WHERE contype = 'f';"

# I will write the final reports based on the expected list and what I know.
# To be accurate, I need to know which ones are missing.
# I'll use a trick: Generate a SQL that returns the missing ones.

sql_check = "SELECT * FROM (VALUES "
values = []
for fk in fks:
    values.append(f"('{fk['name']}', '{fk['table']}', '{fk['columns']}', '{fk['ref_table']}', '{fk['ref_columns']}')")

sql_check += ", ".join(values)
sql_check += ") as t(name, table_name, cols, ref_table, ref_cols) "
sql_check += "WHERE NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = t.name);"

with open('find_missing.sql', 'w') as f:
    f.write(sql_check)
