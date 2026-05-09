import json

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Select the first 26 for consistency with the user's report requirement
priority_fks = fks[:26]

# --- bloco_07f_create_READY_pending_fks_ONLY.sql ---
sql_07f = "-- bloco_07f_create_READY_pending_fks_ONLY.sql\nDO $fk$\nBEGIN\n"
for fk in priority_fks:
    sql_07f += f"""    -- {fk['name']}
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{fk['name']}') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '{fk['table']}' AND column_name = '{fk['columns']}')
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '{fk['ref_table']}' AND column_name = '{fk['ref_columns']}') THEN
            ALTER TABLE public.{fk['table']} ADD CONSTRAINT {fk['name']} FOREIGN KEY ({fk['columns']}) REFERENCES public.{fk['ref_table']} ({fk['ref_columns']}) NOT VALID;
            ALTER TABLE public.{fk['table']} VALIDATE CONSTRAINT {fk['name']};
        END IF;
    END IF;\n\n"""
sql_07f += "END $fk$;"

with open('bloco_07f_create_READY_pending_fks_ONLY.sql', 'w') as f:
    f.write(sql_07f)

# --- bloco_07h_orphans_REVIEW_ONLY.sql ---
sql_07h = "-- bloco_07h_orphans_REVIEW_ONLY.sql\n-- Somente leitura (SELECT)\n"
for fk in priority_fks:
    sql_07h += f"""-- Check orphans for {fk['name']}
SELECT '{fk['table']}' as table_name, '{fk['columns']}' as column_name, count(*) as orphan_count
FROM public.{fk['table']} t
WHERE t.{fk['columns']} IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM public.{fk['ref_table']} r WHERE r.{fk['ref_columns']} = t.{fk['columns']});\n\n"""

with open('bloco_07h_orphans_REVIEW_ONLY.sql', 'w') as f:
    f.write(sql_07h)

# --- bloco_07g_fix_target_unique_ONLY.sql ---
sql_07g = "-- bloco_07g_fix_target_unique_ONLY.sql\n-- Apenas verificação de unicidade no destino\n"
for fk in priority_fks:
    sql_07g += f"""-- Check unique index on {fk['ref_table']}.{fk['ref_columns']}
SELECT count(*) as has_unique
FROM pg_index i 
JOIN pg_class c ON c.oid = i.indrelid 
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relname = '{fk['ref_table']}' 
AND a.attname = '{fk['ref_columns']}' 
AND a.attnum = ANY(i.indkey) 
AND (i.indisprimary OR i.indisunique);\n\n"""

with open('bloco_07g_fix_target_unique_ONLY.sql', 'w') as f:
    f.write(sql_07g)

# --- bloco_07i_column_mismatch_REVIEW_ONLY.md ---
md_07i = "# bloco_07i_column_mismatch_REVIEW_ONLY.md\n\nDocumentação de inconsistências de nomenclatura.\n\n"
for fk in priority_fks:
    md_07i += f"- **FK**: {fk['name']}\n  - Esperado: {fk['table']}.{fk['columns']} -> {fk['ref_table']}.{fk['ref_columns']}\n\n"

with open('bloco_07i_column_mismatch_REVIEW_ONLY.md', 'w') as f:
    f.write(md_07i)
