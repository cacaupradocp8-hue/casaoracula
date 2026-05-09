import { readFileSync, writeFileSync } from 'fs';

const fks = JSON.parse(readFileSync('fks_from_schema.json', 'utf8'));

let sql = `-- IDEMPOTENT SYNC SCRIPT: CONFORM DATABASE TO fks_from_schema.json
-- This script will attempt to create all 384 expected FKs.
-- It skips existing ones and reports errors (orphans, missing columns) as NOTICES.
-- Run this in your Supabase SQL Editor.

DO $$
DECLARE
    v_count_added INT := 0;
    v_count_skipped INT := 0;
    v_count_error INT := 0;
BEGIN
`;

fks.forEach((fk, index) => {
    // Escape identifiers
    const table = fk.table.includes('"') ? fk.table : `"${fk.table}"`;
    const name = fk.name.includes('"') ? fk.name : `"${fk.name}"`;
    const columns = fk.columns.includes('"') ? fk.columns : `"${fk.columns}"`;
    const ref_table = fk.ref_table.includes('"') ? fk.ref_table : `"${fk.ref_table}"`;
    const ref_columns = fk.ref_columns.includes('"') ? fk.ref_columns : `"${fk.ref_columns}"`;
    const extra = fk.extra || '';

    sql += `
    -- [${index + 1}/384] ${fk.name}
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${fk.name}') THEN
        BEGIN
            -- Check if source table and column exist
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${fk.table}' AND column_name = '${fk.columns}'
            ) AND EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = '${fk.ref_table}' AND column_name = '${fk.ref_columns}'
            ) THEN
                EXECUTE 'ALTER TABLE ${table} ADD CONSTRAINT ${name} FOREIGN KEY (${columns}) REFERENCES ${ref_table} (${ref_columns}) ${extra} NOT VALID';
                EXECUTE 'ALTER TABLE ${table} VALIDATE CONSTRAINT ${name}';
                v_count_added := v_count_added + 1;
            ELSE
                RAISE NOTICE 'Skipped ${fk.name}: Table or column missing';
                v_count_error := v_count_error + 1;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to create ${fk.name}: %', SQLERRM;
            v_count_error := v_count_error + 1;
        END;
    ELSE
        v_count_skipped := v_count_skipped + 1;
    END IF;
`;
});

sql += `
    RAISE NOTICE '--- SYNC SUMMARY ---';
    RAISE NOTICE 'Added: %', v_count_added;
    RAISE NOTICE 'Skipped (already exists): %', v_count_skipped;
    RAISE NOTICE 'Errors/Missing: %', v_count_error;
END $$;
`;

writeFileSync('sync_fks_declarative.sql', sql);
console.log('Generated sync_fks_declarative.sql');
