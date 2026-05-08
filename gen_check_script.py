import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

sql = """
DO $$
DECLARE
    f RECORD;
    missing_count INT := 0;
    found_count INT := 0;
BEGIN
    CREATE TEMP TABLE IF NOT EXISTS fk_audit (
        constraint_name TEXT,
        source_table TEXT,
        target_table TEXT,
        exists BOOLEAN,
        sql_to_create TEXT
    );
"""

for fk in fks:
    # Escape quotes for SQL string
    sql_create = f"ALTER TABLE public.{fk['table']} ADD CONSTRAINT {fk['name']} FOREIGN KEY ({fk['columns']}) REFERENCES public.{fk['ref_table']}({fk['ref_columns']}) {fk['extra']};"
    sql_create_escaped = sql_create.replace("'", "''")
    
    sql += f"""
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{fk['name']}') THEN
        INSERT INTO fk_audit VALUES ('{fk['name']}', '{fk['table']}', '{fk['ref_table']}', TRUE, '{sql_create_escaped}');
        found_count := found_count + 1;
    ELSE
        INSERT INTO fk_audit VALUES ('{fk['name']}', '{fk['table']}', '{fk['ref_table']}', FALSE, '{sql_create_escaped}');
        missing_count := missing_count + 1;
    END IF;
    """

sql += """
    RAISE NOTICE 'Found: %, Missing: %', found_count, missing_count;
END $$;

SELECT * FROM fk_audit WHERE exists = FALSE;
"""

with open('check_missing_fks.sql', 'w') as f:
    f.write(sql)
