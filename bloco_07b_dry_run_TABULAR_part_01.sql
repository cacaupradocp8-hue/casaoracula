-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC TABULAR (PARTE 1 de 8)
-- Diagnóstico de FKs 1 a 48 (Total: 48)

-- 1. Criar tabela temporária de diagnóstico
CREATE TEMP TABLE diagnostic_results (
    constraint_name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT,
    reason TEXT
) ON COMMIT DROP;

-- 2. Lógica de análise e preenchimento da tabela
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing access_expiration_logs_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'access_expiration_logs_user_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'EXISTS', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'access_expiration_logs') THEN
        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_SOURCE_TABLE', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Table access_expiration_logs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id') THEN
        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Column access_expiration_logs.user_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_TARGET_TABLE', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'TYPE_MISMATCH', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'READY_TO_CREATE', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'TYPE_MISMATCH', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'TARGET_NOT_UNIQUE', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('access_expiration_logs_user_id_fkey', 'READY_TO_CREATE', 'access_expiration_logs', 'user_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing admin_action_history_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_user_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'EXISTS', 'admin_action_history', 'user_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_action_history') THEN
        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'MISSING_SOURCE_TABLE', 'admin_action_history', 'user_id', 'profiles', 'id', 'Table admin_action_history not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id') THEN
        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'admin_action_history', 'user_id', 'profiles', 'id', 'Column admin_action_history.user_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'MISSING_TARGET_TABLE', 'admin_action_history', 'user_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_action_history', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'TYPE_MISMATCH', 'admin_action_history', 'user_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'READY_TO_CREATE', 'admin_action_history', 'user_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_action_history', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'TYPE_MISMATCH', 'admin_action_history', 'user_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'TARGET_NOT_UNIQUE', 'admin_action_history', 'user_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('admin_action_history_user_id_fkey', 'READY_TO_CREATE', 'admin_action_history', 'user_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing admin_automation_audit_rule_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_rule_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'EXISTS', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_audit') THEN
        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_SOURCE_TABLE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Table admin_automation_audit not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id') THEN
        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_SOURCE_COLUMN', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Column admin_automation_audit.rule_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_rules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_TARGET_TABLE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Table admin_automation_rules not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'admin_automation_rules' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Column admin_automation_rules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'TYPE_MISMATCH', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'admin_automation_rules');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'READY_TO_CREATE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Column admin_automation_rules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'TYPE_MISMATCH', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.admin_automation_rules')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'TARGET_NOT_UNIQUE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('admin_automation_audit_rule_id_fkey', 'READY_TO_CREATE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing agente_conversas_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'EXISTS', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') THEN
        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Table agente_conversas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id') THEN
        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Column agente_conversas.agente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_TARGET_TABLE', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Table agentes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'agentes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'TYPE_MISMATCH', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'agentes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'READY_TO_CREATE', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'TYPE_MISMATCH', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.agentes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('agente_conversas_agente_id_fkey', 'READY_TO_CREATE', 'agente_conversas', 'agente_id', 'agentes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing agente_mensagens_conversa_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_conversa_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'EXISTS', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_mensagens') THEN
        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_SOURCE_TABLE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Table agente_mensagens not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id') THEN
        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_SOURCE_COLUMN', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Column agente_mensagens.conversa_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_TARGET_TABLE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Table agente_conversas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'agente_conversas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Column agente_conversas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'TYPE_MISMATCH', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'agente_conversas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'READY_TO_CREATE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Column agente_conversas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'TYPE_MISMATCH', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.agente_conversas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'TARGET_NOT_UNIQUE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('agente_mensagens_conversa_id_fkey', 'READY_TO_CREATE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_interaction_logs_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'EXISTS', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs') THEN
        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Table ai_interaction_logs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id') THEN
        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Column ai_interaction_logs.agente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_TARGET_TABLE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Table agentes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'agentes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'TYPE_MISMATCH', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'agentes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'READY_TO_CREATE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'TYPE_MISMATCH', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.agentes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ai_interaction_logs_agente_id_fkey', 'READY_TO_CREATE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'EXISTS', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Table ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Column ai_recommendations.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_distrito_sugerido_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'EXISTS', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Table ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Column ai_recommendations.distrito_sugerido_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Table city_districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'city_districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'city_districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.city_districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'EXISTS', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Table ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Column ai_recommendations.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_session_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_tool_sugerida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'EXISTS', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Table ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id') THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Column ai_recommendations.tool_sugerida_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetypal_profile_snapshots_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'EXISTS', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots') THEN
        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_SOURCE_TABLE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Table archetypal_profile_snapshots not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Column archetypal_profile_snapshots.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_TARGET_TABLE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_TARGET_COLUMN', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'TYPE_MISMATCH', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'READY_TO_CREATE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_TARGET_COLUMN', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'TYPE_MISMATCH', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'TARGET_NOT_UNIQUE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'READY_TO_CREATE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetype_tools_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'EXISTS', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Table archetype_tools not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Column archetype_tools.archetype_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'founding_archetypes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.founding_archetypes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('archetype_tools_archetype_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetype_tools_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'EXISTS', 'archetype_tools', 'tool_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'archetype_tools', 'tool_id', 'tools', 'id', 'Table archetype_tools not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetype_tools', 'tool_id', 'tools', 'id', 'Column archetype_tools.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_TARGET_TABLE', 'archetype_tools', 'tool_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'tool_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'tool_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'tool_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'archetype_tools', 'tool_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('archetype_tools_tool_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'tool_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing atelie_conteudos_template_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_template_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'EXISTS', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_conteudos') THEN
        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_SOURCE_TABLE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Table atelie_conteudos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id') THEN
        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_SOURCE_COLUMN', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Column atelie_conteudos.template_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_templates') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_TARGET_TABLE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Table atelie_templates not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'atelie_templates' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_TARGET_COLUMN', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Column atelie_templates.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'TYPE_MISMATCH', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'atelie_templates');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'READY_TO_CREATE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_TARGET_COLUMN', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Column atelie_templates.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'TYPE_MISMATCH', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.atelie_templates')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'TARGET_NOT_UNIQUE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('atelie_conteudos_template_id_fkey', 'READY_TO_CREATE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing atlas_arquetipos_registros_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'EXISTS', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros') THEN
        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_SOURCE_TABLE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Table atlas_arquetipos_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Column atlas_arquetipos_registros.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_TARGET_TABLE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_TARGET_COLUMN', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'TYPE_MISMATCH', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'READY_TO_CREATE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_TARGET_COLUMN', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'TYPE_MISMATCH', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'TARGET_NOT_UNIQUE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'READY_TO_CREATE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing aulas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'EXISTS', 'aulas', 'portal_id', 'portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') THEN
        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'aulas', 'portal_id', 'portais', 'id', 'Table aulas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'aulas', 'portal_id', 'portais', 'id', 'Column aulas.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'aulas', 'portal_id', 'portais', 'id', 'Table portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'aulas', 'portal_id', 'portais', 'id', 'Column portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'TYPE_MISMATCH', 'aulas', 'portal_id', 'portais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'portais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'READY_TO_CREATE', 'aulas', 'portal_id', 'portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'aulas', 'portal_id', 'portais', 'id', 'Column portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'TYPE_MISMATCH', 'aulas', 'portal_id', 'portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'aulas', 'portal_id', 'portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('aulas_portal_id_fkey', 'READY_TO_CREATE', 'aulas', 'portal_id', 'portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing biblioteca_casos_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'biblioteca_casos_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'EXISTS', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'biblioteca_casos') THEN
        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Table biblioteca_casos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Column biblioteca_casos.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_TARGET_TABLE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_portas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_portas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'TYPE_MISMATCH', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_portas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'READY_TO_CREATE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'TYPE_MISMATCH', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.labirinto_portas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('biblioteca_casos_porta_id_fkey', 'READY_TO_CREATE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_funcional_perguntas_dimensao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'EXISTS', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas') THEN
        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Table big5_funcional_perguntas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Column big5_funcional_perguntas.dimensao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_TARGET_TABLE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Table big5_funcional_dimensoes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'big5_funcional_dimensoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Column big5_funcional_dimensoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'TYPE_MISMATCH', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'big5_funcional_dimensoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'READY_TO_CREATE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Column big5_funcional_dimensoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'TYPE_MISMATCH', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.big5_funcional_dimensoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'READY_TO_CREATE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_oracular_perguntas_fator_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'EXISTS', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas') THEN
        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Table big5_oracular_perguntas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Column big5_oracular_perguntas.fator_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_TARGET_TABLE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Table big5_oracular_fatores not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'big5_oracular_fatores' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Column big5_oracular_fatores.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'TYPE_MISMATCH', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'big5_oracular_fatores');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'READY_TO_CREATE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Column big5_oracular_fatores.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'TYPE_MISMATCH', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.big5_oracular_fatores')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'READY_TO_CREATE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_porta_mapeamento_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'EXISTS', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento') THEN
        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Table big5_porta_mapeamento not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Column big5_porta_mapeamento.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Table rituais_simbolicos not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'rituais_simbolicos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Column rituais_simbolicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'rituais_simbolicos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'READY_TO_CREATE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Column rituais_simbolicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.rituais_simbolicos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'READY_TO_CREATE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_ritual_registros_big5_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_big5_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'EXISTS', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Table big5_ritual_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Column big5_ritual_registros.big5_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_TARGET_TABLE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Table big5_oracular_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'big5_oracular_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Column big5_oracular_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'big5_oracular_registros');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Column big5_oracular_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.big5_oracular_registros')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_ritual_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'EXISTS', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Table big5_ritual_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Column big5_ritual_registros.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Table rituais_simbolicos not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'rituais_simbolicos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Column rituais_simbolicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'rituais_simbolicos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Column rituais_simbolicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.rituais_simbolicos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_symbolic_afirmacoes_force_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'EXISTS', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Table big5_symbolic_afirmacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Column big5_symbolic_afirmacoes.force_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_TARGET_TABLE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Table big5_symbolic_forces not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'big5_symbolic_forces' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Column big5_symbolic_forces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'big5_symbolic_forces');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Column big5_symbolic_forces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.big5_symbolic_forces')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_symbolic_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'EXISTS', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Table big5_symbolic_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Column big5_symbolic_registros.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_links_from_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'EXISTS', 'book_links', 'from_book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_links', 'from_book_id', 'books', 'id', 'Table book_links not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_links', 'from_book_id', 'books', 'id', 'Column book_links.from_book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_links', 'from_book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'from_book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'from_book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'from_book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'from_book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'from_book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_links', 'from_book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('book_links_from_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'from_book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_links_to_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'EXISTS', 'book_links', 'to_book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_links', 'to_book_id', 'books', 'id', 'Table book_links not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id') THEN
        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_links', 'to_book_id', 'books', 'id', 'Column book_links.to_book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_links', 'to_book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'to_book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'to_book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'to_book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'to_book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'to_book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_links', 'to_book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('book_links_to_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'to_book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_media_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'EXISTS', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_media') THEN
        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'MISSING_SOURCE_TABLE', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Table book_media not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id') THEN
        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Column book_media.station_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'MISSING_TARGET_TABLE', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_estacoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'MISSING_TARGET_COLUMN', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'TYPE_MISMATCH', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'READY_TO_CREATE', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'MISSING_TARGET_COLUMN', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'TYPE_MISMATCH', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_estacoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'TARGET_NOT_UNIQUE', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('book_media_station_id_fkey', 'READY_TO_CREATE', 'book_media', 'station_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_tours_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'EXISTS', 'book_tours', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_tours') THEN
        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_tours', 'book_id', 'books', 'id', 'Table book_tours not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_tours', 'book_id', 'books', 'id', 'Column book_tours.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_tours', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_tours', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'TYPE_MISMATCH', 'book_tours', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'READY_TO_CREATE', 'book_tours', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_tours', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'TYPE_MISMATCH', 'book_tours', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_tours', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('book_tours_book_id_fkey', 'READY_TO_CREATE', 'book_tours', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing canteiro_reactions_entry_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'EXISTS', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'canteiro_reactions') THEN
        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_SOURCE_TABLE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Table canteiro_reactions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id') THEN
        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_SOURCE_COLUMN', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Column canteiro_reactions.entry_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_TARGET_TABLE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Table collective_bed_entries not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'collective_bed_entries' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_TARGET_COLUMN', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Column collective_bed_entries.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'TYPE_MISMATCH', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'collective_bed_entries');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'READY_TO_CREATE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_TARGET_COLUMN', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Column collective_bed_entries.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'TYPE_MISMATCH', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.collective_bed_entries')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'TARGET_NOT_UNIQUE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('canteiro_reactions_entry_id_fkey', 'READY_TO_CREATE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartografia_complexos_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'EXISTS', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_complexos') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Table cartografia_complexos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Column cartografia_complexos.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'READY_TO_CREATE', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartografia_complexos_client_id_fkey', 'READY_TO_CREATE', 'cartografia_complexos', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartografia_psiquica_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'EXISTS', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Table cartografia_psiquica not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Column cartografia_psiquica.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'READY_TO_CREATE', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartografia_psiquica_client_id_fkey', 'READY_TO_CREATE', 'cartografia_psiquica', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_engine_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'EXISTS', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Table cartographer_engine not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Column cartographer_engine.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_engine_client_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_engine_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'EXISTS', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Table cartographer_engine not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Column cartographer_engine.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_engine_session_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_engine_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'EXISTS', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Table cartographer_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Column cartographer_recommendations.engine_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Table cartographer_engine not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'cartographer_engine' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Column cartographer_engine.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'cartographer_engine');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Column cartographer_engine.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.cartographer_engine')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_engine_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_ferramenta_escolhida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'EXISTS', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Table cartographer_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Column cartographer_recommendations.ferramenta_escolhida_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_tool_complementar_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'EXISTS', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Table cartographer_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Column cartographer_recommendations.tool_complementar_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_tool_principal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'EXISTS', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Table cartographer_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Column cartographer_recommendations.tool_principal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographies_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'EXISTS', 'cartographies', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographies', 'client_id', 'clientes', 'id', 'Table cartographies not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographies', 'client_id', 'clientes', 'id', 'Column cartographies.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartographies', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'READY_TO_CREATE', 'cartographies', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographies', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographies_client_id_fkey', 'READY_TO_CREATE', 'cartographies', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographies_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'EXISTS', 'cartographies', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographies', 'session_id', 'sessions', 'id', 'Table cartographies not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographies', 'session_id', 'sessions', 'id', 'Column cartographies.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'MISSING_TARGET_TABLE', 'cartographies', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'READY_TO_CREATE', 'cartographies', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographies', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cartographies_session_id_fkey', 'READY_TO_CREATE', 'cartographies', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing casa_circulo_replies_thread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_thread_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'EXISTS', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies') THEN
        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_SOURCE_TABLE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Table casa_circulo_replies not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id') THEN
        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_SOURCE_COLUMN', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Column casa_circulo_replies.thread_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_TARGET_TABLE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Table casa_circulo_threads not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'casa_circulo_threads' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_TARGET_COLUMN', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Column casa_circulo_threads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'TYPE_MISMATCH', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'casa_circulo_threads');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'READY_TO_CREATE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_TARGET_COLUMN', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Column casa_circulo_threads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'TYPE_MISMATCH', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.casa_circulo_threads')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'TARGET_NOT_UNIQUE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('casa_circulo_replies_thread_id_fkey', 'READY_TO_CREATE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_cards_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'EXISTS', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Table cidadela_oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Column cidadela_oracle_cards.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_cards_suggested_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'EXISTS', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Table cidadela_oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Column cidadela_oracle_cards.suggested_tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_usage_card_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'EXISTS', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Table cidadela_oracle_usage not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Column cidadela_oracle_usage.card_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Table cidadela_oracle_cards not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'cidadela_oracle_cards' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Column cidadela_oracle_cards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'cidadela_oracle_cards');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Column cidadela_oracle_cards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.cidadela_oracle_cards')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_card_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_usage_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'EXISTS', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Table cidadela_oracle_usage not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Column cidadela_oracle_usage.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cidadela_oracle_usage_client_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_evolucao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_evolucao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Table client_archetype_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Column client_archetype_state.arquitipo_evolucao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'founding_archetypes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.founding_archetypes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_regente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Table client_archetype_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Column client_archetype_state.arquitipo_regente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'founding_archetypes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.founding_archetypes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_sombra_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Table client_archetype_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Column client_archetype_state.arquitipo_sombra_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'founding_archetypes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.founding_archetypes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'EXISTS', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Table client_archetype_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Column client_archetype_state.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_archetype_state_client_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

-- 3. Retornar resultados tabulares (obrigatório fora do DO)
SELECT *
FROM diagnostic_results
ORDER BY constraint_name;

SELECT status, COUNT(*) AS total
FROM diagnostic_results
GROUP BY status
ORDER BY status;
