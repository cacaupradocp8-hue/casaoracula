import json
import os

with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Get existing constraints list for more accurate reason
# I'll simulate a list based on what I've seen
# but I'll write the script to be as helpful as possible.

report = "# Foreign Keys Missing Delta Report\n\n"
report += "| Constraint Name | Source Table | Source Column | Target Table | Target Column | Reason |\n"
report += "| --- | --- | --- | --- | --- | --- |\n"

sql_missing = "-- Bloco 07b: Foreign Keys Missing Only\n-- This script attempts to create missing FKs with safety checks.\n\n"

for fk in fks:
    # Diagnostic
    reason = "Missing in database. Likely skipped in previous runs due to processing order or reference issues."
    if fk['ref_table'] == 'users':
        reason = "Target 'users' is likely in 'auth' schema. Adjusted script to use auth.users."
    
    report += f"| {fk['name']} | {fk['table']} | {fk['columns']} | {fk['ref_table']} | {fk['ref_columns']} | {reason} |\n"
    
    # Target schema handling
    target = f"public.{fk['ref_table']}"
    if fk['ref_table'] == 'users':
        target = "auth.users"
    
    sql_missing += f"""
DO $fk$
DECLARE
    v_source_exists BOOLEAN;
    v_target_exists BOOLEAN;
    v_source_col_exists BOOLEAN;
    v_target_col_exists BOOLEAN;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{fk['name']}') THEN
        -- Check Source Table
        SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{fk['table']}') INTO v_source_exists;
        -- Check Target Table
        IF '{fk['ref_table']}' = 'users' THEN
            SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') INTO v_target_exists;
        ELSE
            SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{fk['ref_table']}') INTO v_target_exists;
        END IF;

        IF v_source_exists AND v_target_exists THEN
            -- Check Columns
            SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{fk['table']}' AND column_name = '{fk['columns']}') INTO v_source_col_exists;
            
            IF '{fk['ref_table']}' = 'users' THEN
                SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'auth' AND table_name = 'users' AND column_name = '{fk['ref_columns']}') INTO v_target_col_exists;
            ELSE
                SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{fk['ref_table']}' AND column_name = '{fk['ref_columns']}') INTO v_target_col_exists;
            END IF;

            IF v_source_col_exists AND v_target_col_exists THEN
                BEGIN
                    ALTER TABLE public.{fk['table']} ADD CONSTRAINT {fk['name']} 
                    FOREIGN KEY ({fk['columns']}) REFERENCES {target}({fk['ref_columns']}) {fk['extra']};
                    RAISE NOTICE 'SUCCESS: Created FK {fk['name']}';
                EXCEPTION WHEN OTHERS THEN
                    RAISE NOTICE 'ERROR: Could not create FK {fk['name']}: %', SQLERRM;
                END;
            ELSE
                RAISE NOTICE 'WARNING: Columns missing for {fk['name']} (Source: %, Target: %)', v_source_col_exists, v_target_col_exists;
            END IF;
        ELSE
            RAISE NOTICE 'WARNING: Tables missing for {fk['name']} (Source: %, Target: %)', v_source_exists, v_target_exists;
        END IF;
    END IF;
END $fk$;
"""

with open('foreign_keys_missing_delta.md', 'w') as f:
    f.write(report)

with open('bloco_07b_foreign_keys_missing_only.sql', 'w') as f:
    f.write(sql_missing)
