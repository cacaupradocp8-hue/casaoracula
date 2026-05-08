import json

# Load the FKs
with open('fks_from_schema.json', 'r') as f:
    fks = json.load(f)

# Mocking the fetched data from previous tool outputs
# I'll just use the summaries the user gave to "tune" the results if needed, 
# but I'll try to be as accurate as possible with the logic.

# In a real scenario, I'd parse the tool-results. 
# Since I'm in a script, I'll use the logic to categorize them.

# Let's get the list of tables from the first query result
# I'll manually extract some and use the logic.
# However, I can also just use the user's provided numbers as a target.

# The user said:
# EXISTS: 165
# READY_TO_CREATE: 78
# TARGET_NOT_UNIQUE: 137
# MISSING_SOURCE_TABLE: 4
# MISSING_TARGET_TABLE: 0
# TYPE_MISMATCH: 0
# Total: 384

# Since I have the 384 FKs, I will run the logic to see which one falls where.
# I need to be careful with table names (some might be missing 'public.').

# I'll write a script that generates the report based on the logic described in the dry-run SQL.

def generate_files():
    # 1. Get existing constraints
    # (Based on the pg_constraint output)
    existing_constraints = {
        "sessoes_labirinto_porta_id_fkey", "profiles_id_fkey", "user_roles_user_id_fkey",
        "lessons_travessia_id_fkey", "agente_mensagens_conversa_id_fkey",
        "conteudo_aulas_travessia_id_fkey", "conteudo_travessias_sala_id_fkey",
        "exercises_lesson_id_fkey", "library_items_created_by_fkey",
        "user_progress_user_id_fkey", "user_progress_lesson_id_fkey",
        "user_favorites_user_id_fkey", "user_favorites_library_item_id_fkey",
        "exercise_responses_user_id_fkey", "exercise_responses_exercise_id_fkey",
        "posts_mentoria_created_by_fkey", "agente_conversas_agente_id_fkey",
        "agente_conversas_user_id_fkey",
        # ... and many more. I'll rely on the logic to find them if I had the full list.
    }
    
    # Actually, I'll just assume the user's counts are correct and I'll generate the report
    # by running the logic on the data I fetched.
    
    # Let's try to get a more complete list of existing constraints from the tool-results
    # I'll read the tool-results file directly if possible, or just use the logic.
    
    # I'll simulate the dry-run logic.
    
    results = []
    ready_to_create = []
    target_not_unique = []
    missing_source = []
    exists_list = []
    
    # Helper to check if table exists (from the information_schema.tables result)
    # I'll use the counts to guide the simulation if I can't be 100% sure.
    
    # BUT the user wants the ACTUAL list. 
    # I should try to parse the tool-results correctly.
    
    # I'll use a simplified approach: I'll re-run the diagnostic logic but in Python,
    # using the data I fetched.
    
    # Data from tool-results (partial):
    # I'll use the logic to identify the 78 READY_TO_CREATE ones.
    
    # Let's just generate the SQL and report based on the user's summary if I can't get the names.
    # Wait, I CAN get the names by running a small script that parses the tool-results.
    pass

# I'll actually just write the SQL that the user asked for.
# "bloco_07d_create_ready_foreign_keys_only.sql"
# It should contain ONLY the 78 FKs that are READY_TO_CREATE.

# I need to identify which 78 they are.
# I'll use the logic from the dry-run parts.

# Let's just run the dry-run logic for ALL 384 FKs and see which ones are READY_TO_CREATE.
# I'll do this by writing a SQL that returns the names and statuses.

with open('get_ready_fks.sql', 'w') as f:
    f.write("""
CREATE TEMP TABLE diagnostic_results (
    name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT
);

DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
""")
    for fk in fks:
        name = fk['name']
        src_table = fk['table']
        src_cols = fk['columns']
        tgt_table = fk['ref_table']
        tgt_cols = fk['ref_columns']
        
        f.write(f"""
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '{name}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'EXISTS', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{src_table}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}') THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_SOURCE_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '{tgt_table}') 
          AND NOT ('{tgt_table}' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_TABLE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}') THEN
             INSERT INTO diagnostic_results VALUES ('{name}', 'MISSING_TARGET_COLUMN', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{src_table}' AND column_name = '{src_cols}';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '{tgt_table}' AND column_name = '{tgt_cols}';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO diagnostic_results VALUES ('{name}', 'TYPE_MISMATCH', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN '{tgt_table}' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('{tgt_table}') END)::regclass
                    AND a.attname = '{tgt_cols}'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO diagnostic_results VALUES ('{name}', 'TARGET_NOT_UNIQUE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
                ELSE
                    INSERT INTO diagnostic_results VALUES ('{name}', 'READY_TO_CREATE', '{src_table}', '{src_cols}', '{tgt_table}', '{tgt_cols}');
                END IF;
            END IF;
        END IF;
    END IF;
""")
    f.write("""
END $$;
SELECT * FROM diagnostic_results;
""")
