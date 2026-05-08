
CREATE TEMP TABLE results (name TEXT, status TEXT, source_table TEXT, source_column TEXT, target_table TEXT, target_column TEXT);
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing access_expiration_logs_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'access_expiration_logs_user_id_fkey') THEN
        INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'EXISTS', 'access_expiration_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'access_expiration_logs') THEN
        INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_SOURCE_TABLE', 'access_expiration_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id') THEN
        INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'access_expiration_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_TARGET_TABLE', 'access_expiration_logs', 'user_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'access_expiration_logs', 'user_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'TYPE_MISMATCH', 'access_expiration_logs', 'user_id', 'profiles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'TARGET_NOT_UNIQUE', 'access_expiration_logs', 'user_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('access_expiration_logs_user_id_fkey', 'READY_TO_CREATE', 'access_expiration_logs', 'user_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing admin_action_history_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_user_id_fkey') THEN
        INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'EXISTS', 'admin_action_history', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_action_history') THEN
        INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'MISSING_SOURCE_TABLE', 'admin_action_history', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id') THEN
        INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'admin_action_history', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'MISSING_TARGET_TABLE', 'admin_action_history', 'user_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_action_history', 'user_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'TYPE_MISMATCH', 'admin_action_history', 'user_id', 'profiles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'TARGET_NOT_UNIQUE', 'admin_action_history', 'user_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('admin_action_history_user_id_fkey', 'READY_TO_CREATE', 'admin_action_history', 'user_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing admin_automation_audit_rule_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_rule_id_fkey') THEN
        INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'EXISTS', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_audit') THEN
        INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_SOURCE_TABLE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id') THEN
        INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_SOURCE_COLUMN', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_rules') 
          AND NOT ('admin_automation_rules' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_TARGET_TABLE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'TYPE_MISMATCH', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'admin_automation_rules' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('admin_automation_rules') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'TARGET_NOT_UNIQUE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
                ELSE
                    INSERT INTO results VALUES ('admin_automation_audit_rule_id_fkey', 'READY_TO_CREATE', 'admin_automation_audit', 'rule_id', 'admin_automation_rules', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing agente_conversas_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN
        INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'EXISTS', 'agente_conversas', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') THEN
        INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'agente_conversas', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id') THEN
        INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'agente_conversas', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_TARGET_TABLE', 'agente_conversas', 'agente_id', 'agentes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_conversas', 'agente_id', 'agentes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'TYPE_MISMATCH', 'agente_conversas', 'agente_id', 'agentes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'agentes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agentes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'agente_conversas', 'agente_id', 'agentes', 'id');
                ELSE
                    INSERT INTO results VALUES ('agente_conversas_agente_id_fkey', 'READY_TO_CREATE', 'agente_conversas', 'agente_id', 'agentes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing agente_mensagens_conversa_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_conversa_id_fkey') THEN
        INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'EXISTS', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_mensagens') THEN
        INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_SOURCE_TABLE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id') THEN
        INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_SOURCE_COLUMN', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
          AND NOT ('agente_conversas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_TARGET_TABLE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'MISSING_TARGET_COLUMN', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'TYPE_MISMATCH', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'agente_conversas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agente_conversas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'TARGET_NOT_UNIQUE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
                ELSE
                    INSERT INTO results VALUES ('agente_mensagens_conversa_id_fkey', 'READY_TO_CREATE', 'agente_mensagens', 'conversa_id', 'agente_conversas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_interaction_logs_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN
        INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'EXISTS', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs') THEN
        INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id') THEN
        INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_TARGET_TABLE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'TYPE_MISMATCH', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'agentes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agentes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
                ELSE
                    INSERT INTO results VALUES ('ai_interaction_logs_agente_id_fkey', 'READY_TO_CREATE', 'ai_interaction_logs', 'agente_id', 'agentes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN
        INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'EXISTS', 'ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_distrito_sugerido_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN
        INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'EXISTS', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id') THEN
        INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'city_districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('city_districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('ai_recommendations_distrito_sugerido_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'distrito_sugerido_id', 'city_districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN
        INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'EXISTS', 'ai_recommendations', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('ai_recommendations_session_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ai_recommendations_tool_sugerida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'EXISTS', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN
        INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_TABLE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id') THEN
        INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_COLUMN', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_TABLE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'TARGET_NOT_UNIQUE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'ai_recommendations', 'tool_sugerida_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetypal_profile_snapshots_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN
        INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'EXISTS', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots') THEN
        INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_SOURCE_TABLE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_TARGET_TABLE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'MISSING_TARGET_COLUMN', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'TYPE_MISMATCH', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'TARGET_NOT_UNIQUE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('archetypal_profile_snapshots_client_id_fkey', 'READY_TO_CREATE', 'archetypal_profile_snapshots', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetype_tools_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN
        INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'EXISTS', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN
        INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id') THEN
        INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('archetype_tools_archetype_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'archetype_id', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing archetype_tools_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN
        INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'EXISTS', 'archetype_tools', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN
        INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'archetype_tools', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'archetype_tools', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_TARGET_TABLE', 'archetype_tools', 'tool_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'archetype_tools', 'tool_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'TYPE_MISMATCH', 'archetype_tools', 'tool_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'archetype_tools', 'tool_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('archetype_tools_tool_id_fkey', 'READY_TO_CREATE', 'archetype_tools', 'tool_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing atelie_conteudos_template_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_template_id_fkey') THEN
        INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'EXISTS', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_conteudos') THEN
        INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_SOURCE_TABLE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id') THEN
        INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_SOURCE_COLUMN', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_templates') 
          AND NOT ('atelie_templates' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_TARGET_TABLE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'MISSING_TARGET_COLUMN', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'TYPE_MISMATCH', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'atelie_templates' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('atelie_templates') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'TARGET_NOT_UNIQUE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
                ELSE
                    INSERT INTO results VALUES ('atelie_conteudos_template_id_fkey', 'READY_TO_CREATE', 'atelie_conteudos', 'template_id', 'atelie_templates', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing atlas_arquetipos_registros_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN
        INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'EXISTS', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros') THEN
        INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_SOURCE_TABLE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_TARGET_TABLE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'MISSING_TARGET_COLUMN', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'TYPE_MISMATCH', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'TARGET_NOT_UNIQUE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('atlas_arquetipos_registros_client_id_fkey', 'READY_TO_CREATE', 'atlas_arquetipos_registros', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing aulas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_portal_id_fkey') THEN
        INSERT INTO results VALUES ('aulas_portal_id_fkey', 'EXISTS', 'aulas', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') THEN
        INSERT INTO results VALUES ('aulas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'aulas', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('aulas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'aulas', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
          AND NOT ('portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('aulas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'aulas', 'portal_id', 'portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('aulas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'aulas', 'portal_id', 'portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('aulas_portal_id_fkey', 'TYPE_MISMATCH', 'aulas', 'portal_id', 'portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('aulas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'aulas', 'portal_id', 'portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('aulas_portal_id_fkey', 'READY_TO_CREATE', 'aulas', 'portal_id', 'portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing biblioteca_casos_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'biblioteca_casos_porta_id_fkey') THEN
        INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'EXISTS', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'biblioteca_casos') THEN
        INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('labirinto_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_TARGET_TABLE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'TYPE_MISMATCH', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_portas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
                ELSE
                    INSERT INTO results VALUES ('biblioteca_casos_porta_id_fkey', 'READY_TO_CREATE', 'biblioteca_casos', 'porta_id', 'labirinto_portas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_funcional_perguntas_dimensao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN
        INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'EXISTS', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas') THEN
        INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id') THEN
        INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes') 
          AND NOT ('big5_funcional_dimensoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_TARGET_TABLE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'TYPE_MISMATCH', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'big5_funcional_dimensoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_funcional_dimensoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_funcional_perguntas_dimensao_id_fkey', 'READY_TO_CREATE', 'big5_funcional_perguntas', 'dimensao_id', 'big5_funcional_dimensoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_oracular_perguntas_fator_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN
        INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'EXISTS', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas') THEN
        INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id') THEN
        INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores') 
          AND NOT ('big5_oracular_fatores' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_TARGET_TABLE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'TYPE_MISMATCH', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'big5_oracular_fatores' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_oracular_fatores') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_oracular_perguntas_fator_id_fkey', 'READY_TO_CREATE', 'big5_oracular_perguntas', 'fator_id', 'big5_oracular_fatores', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_porta_mapeamento_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'EXISTS', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento') THEN
        INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
          AND NOT ('rituais_simbolicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'rituais_simbolicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('rituais_simbolicos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_porta_mapeamento_ritual_id_fkey', 'READY_TO_CREATE', 'big5_porta_mapeamento', 'ritual_id', 'rituais_simbolicos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_ritual_registros_big5_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_big5_registro_id_fkey') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'EXISTS', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros') 
          AND NOT ('big5_oracular_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_TARGET_TABLE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'big5_oracular_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_oracular_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_ritual_registros_big5_registro_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'big5_registro_id', 'big5_oracular_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_ritual_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'EXISTS', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
          AND NOT ('rituais_simbolicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'rituais_simbolicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('rituais_simbolicos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'big5_ritual_registros', 'ritual_id', 'rituais_simbolicos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_symbolic_afirmacoes_force_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN
        INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'EXISTS', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes') THEN
        INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id') THEN
        INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces') 
          AND NOT ('big5_symbolic_forces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_TARGET_TABLE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'big5_symbolic_forces' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_symbolic_forces') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_symbolic_afirmacoes_force_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_afirmacoes', 'force_id', 'big5_symbolic_forces', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing big5_symbolic_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'EXISTS', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') THEN
        INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('big5_symbolic_registros_session_case_id_fkey', 'READY_TO_CREATE', 'big5_symbolic_registros', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_links_from_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN
        INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'EXISTS', 'book_links', 'from_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN
        INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_links', 'from_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id') THEN
        INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_links', 'from_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_links', 'from_book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'from_book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'from_book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_links', 'from_book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('book_links_from_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'from_book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_links_to_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN
        INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'EXISTS', 'book_links', 'to_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN
        INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_links', 'to_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id') THEN
        INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_links', 'to_book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_links', 'to_book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_links', 'to_book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'TYPE_MISMATCH', 'book_links', 'to_book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_links', 'to_book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('book_links_to_book_id_fkey', 'READY_TO_CREATE', 'book_links', 'to_book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_media_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN
        INSERT INTO results VALUES ('book_media_station_id_fkey', 'EXISTS', 'book_media', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_media') THEN
        INSERT INTO results VALUES ('book_media_station_id_fkey', 'MISSING_SOURCE_TABLE', 'book_media', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id') THEN
        INSERT INTO results VALUES ('book_media_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_media', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('book_media_station_id_fkey', 'MISSING_TARGET_TABLE', 'book_media', 'station_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('book_media_station_id_fkey', 'MISSING_TARGET_COLUMN', 'book_media', 'station_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('book_media_station_id_fkey', 'TYPE_MISMATCH', 'book_media', 'station_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('book_media_station_id_fkey', 'TARGET_NOT_UNIQUE', 'book_media', 'station_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('book_media_station_id_fkey', 'READY_TO_CREATE', 'book_media', 'station_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing book_tours_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN
        INSERT INTO results VALUES ('book_tours_book_id_fkey', 'EXISTS', 'book_tours', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_tours') THEN
        INSERT INTO results VALUES ('book_tours_book_id_fkey', 'MISSING_SOURCE_TABLE', 'book_tours', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('book_tours_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'book_tours', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('book_tours_book_id_fkey', 'MISSING_TARGET_TABLE', 'book_tours', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('book_tours_book_id_fkey', 'MISSING_TARGET_COLUMN', 'book_tours', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('book_tours_book_id_fkey', 'TYPE_MISMATCH', 'book_tours', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('book_tours_book_id_fkey', 'TARGET_NOT_UNIQUE', 'book_tours', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('book_tours_book_id_fkey', 'READY_TO_CREATE', 'book_tours', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing canteiro_reactions_entry_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN
        INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'EXISTS', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'canteiro_reactions') THEN
        INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_SOURCE_TABLE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id') THEN
        INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_SOURCE_COLUMN', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
          AND NOT ('collective_bed_entries' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_TARGET_TABLE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'MISSING_TARGET_COLUMN', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'TYPE_MISMATCH', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'collective_bed_entries' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('collective_bed_entries') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'TARGET_NOT_UNIQUE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
                ELSE
                    INSERT INTO results VALUES ('canteiro_reactions_entry_id_fkey', 'READY_TO_CREATE', 'canteiro_reactions', 'entry_id', 'collective_bed_entries', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartografia_complexos_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN
        INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'EXISTS', 'cartografia_complexos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_complexos') THEN
        INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartografia_complexos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartografia_complexos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartografia_complexos', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_complexos', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_complexos', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartografia_complexos', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartografia_complexos_client_id_fkey', 'READY_TO_CREATE', 'cartografia_complexos', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartografia_psiquica_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN
        INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'EXISTS', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica') THEN
        INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'TYPE_MISMATCH', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartografia_psiquica_client_id_fkey', 'READY_TO_CREATE', 'cartografia_psiquica', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_engine_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'EXISTS', 'cartographer_engine', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN
        INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_engine', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_engine', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_engine', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_engine', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_engine_client_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_engine_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'EXISTS', 'cartographer_engine', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN
        INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_engine', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_engine', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_engine', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_engine', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'TYPE_MISMATCH', 'cartographer_engine', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_engine', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_engine_session_id_fkey', 'READY_TO_CREATE', 'cartographer_engine', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_engine_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'EXISTS', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
          AND NOT ('cartographer_engine' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'cartographer_engine' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cartographer_engine') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_recommendations_engine_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'engine_id', 'cartographer_engine', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_ferramenta_escolhida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'EXISTS', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_recommendations_ferramenta_escolhida_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'ferramenta_escolhida_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_tool_complementar_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'EXISTS', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_complementar_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographer_recommendations_tool_principal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'EXISTS', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id') THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_TARGET_TABLE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'TYPE_MISMATCH', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographer_recommendations_tool_principal_id_fkey', 'READY_TO_CREATE', 'cartographer_recommendations', 'tool_principal_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographies_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN
        INSERT INTO results VALUES ('cartographies_client_id_fkey', 'EXISTS', 'cartographies', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN
        INSERT INTO results VALUES ('cartographies_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographies', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('cartographies_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographies', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographies_client_id_fkey', 'MISSING_TARGET_TABLE', 'cartographies', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographies_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographies_client_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographies_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographies', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographies_client_id_fkey', 'READY_TO_CREATE', 'cartographies', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cartographies_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN
        INSERT INTO results VALUES ('cartographies_session_id_fkey', 'EXISTS', 'cartographies', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN
        INSERT INTO results VALUES ('cartographies_session_id_fkey', 'MISSING_SOURCE_TABLE', 'cartographies', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('cartographies_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'cartographies', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cartographies_session_id_fkey', 'MISSING_TARGET_TABLE', 'cartographies', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cartographies_session_id_fkey', 'MISSING_TARGET_COLUMN', 'cartographies', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cartographies_session_id_fkey', 'TYPE_MISMATCH', 'cartographies', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cartographies_session_id_fkey', 'TARGET_NOT_UNIQUE', 'cartographies', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('cartographies_session_id_fkey', 'READY_TO_CREATE', 'cartographies', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing casa_circulo_replies_thread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_thread_id_fkey') THEN
        INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'EXISTS', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies') THEN
        INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_SOURCE_TABLE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id') THEN
        INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_SOURCE_COLUMN', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads') 
          AND NOT ('casa_circulo_threads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_TARGET_TABLE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'MISSING_TARGET_COLUMN', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'TYPE_MISMATCH', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'casa_circulo_threads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('casa_circulo_threads') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'TARGET_NOT_UNIQUE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
                ELSE
                    INSERT INTO results VALUES ('casa_circulo_replies_thread_id_fkey', 'READY_TO_CREATE', 'casa_circulo_replies', 'thread_id', 'casa_circulo_threads', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_cards_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_district_id_fkey') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'EXISTS', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('cidadela_oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_cards_suggested_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'EXISTS', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id') THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('cidadela_oracle_cards_suggested_tool_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_cards', 'suggested_tool_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_usage_card_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'EXISTS', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
          AND NOT ('cidadela_oracle_cards' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'cidadela_oracle_cards' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cidadela_oracle_cards') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
                ELSE
                    INSERT INTO results VALUES ('cidadela_oracle_usage_card_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'card_id', 'cidadela_oracle_cards', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cidadela_oracle_usage_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'EXISTS', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_SOURCE_TABLE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_TARGET_TABLE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'MISSING_TARGET_COLUMN', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'TYPE_MISMATCH', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'TARGET_NOT_UNIQUE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('cidadela_oracle_usage_client_id_fkey', 'READY_TO_CREATE', 'cidadela_oracle_usage', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_evolucao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_evolucao_id_fkey') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_evolucao_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_evolucao_id', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_regente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_regente_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_regente_id', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_arquitipo_sombra_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'EXISTS', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id') THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_archetype_state_arquitipo_sombra_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'arquitipo_sombra_id', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_archetype_state_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'EXISTS', 'client_archetype_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN
        INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_archetype_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_archetype_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_archetype_state', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_archetype_state', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'TYPE_MISMATCH', 'client_archetype_state', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_archetype_state', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_archetype_state_client_id_fkey', 'READY_TO_CREATE', 'client_archetype_state', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_cidadela_map_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'EXISTS', 'client_cidadela_map', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_cidadela_map') THEN
        INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_cidadela_map', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_cidadela_map', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_cidadela_map', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_cidadela_map', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'TYPE_MISMATCH', 'client_cidadela_map', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_cidadela_map', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_cidadela_map_client_id_fkey', 'READY_TO_CREATE', 'client_cidadela_map', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_arquetipo_ativo_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN
        INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'EXISTS', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo') THEN
        INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'TYPE_MISMATCH', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_city_state_arquetipo_ativo_fkey', 'READY_TO_CREATE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'EXISTS', 'client_city_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_city_state_client_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_distrito_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'EXISTS', 'client_city_state', 'distrito_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'distrito_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id') THEN
        INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'distrito_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'distrito_id', 'city_districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'distrito_id', 'city_districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'distrito_id', 'city_districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'city_districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('city_districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'distrito_id', 'city_districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_city_state_distrito_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'distrito_id', 'city_districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_ultima_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'EXISTS', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_ultima_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'EXISTS', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id') THEN
        INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_city_state_ultima_sessao_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_labyrinths_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'EXISTS', 'client_labyrinths', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_labyrinths') THEN
        INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_labyrinths', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_labyrinths', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_labyrinths', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_labyrinths', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'TYPE_MISMATCH', 'client_labyrinths', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_labyrinths', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_labyrinths_client_id_fkey', 'READY_TO_CREATE', 'client_labyrinths', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_live_map_entries_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'EXISTS', 'client_live_map_entries', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_live_map_entries') THEN
        INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_SOURCE_TABLE', 'client_live_map_entries', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_live_map_entries', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_TARGET_TABLE', 'client_live_map_entries', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_TARGET_COLUMN', 'client_live_map_entries', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'TYPE_MISMATCH', 'client_live_map_entries', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'TARGET_NOT_UNIQUE', 'client_live_map_entries', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_live_map_entries_session_id_fkey', 'READY_TO_CREATE', 'client_live_map_entries', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_pattern_stats_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'EXISTS', 'client_pattern_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_pattern_stats') THEN
        INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_pattern_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_pattern_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_pattern_stats', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_pattern_stats', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'TYPE_MISMATCH', 'client_pattern_stats', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_pattern_stats', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_pattern_stats_client_id_fkey', 'READY_TO_CREATE', 'client_pattern_stats', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_seasons_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'EXISTS', 'client_seasons', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_seasons') THEN
        INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_seasons', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_seasons', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_seasons', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_seasons', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'TYPE_MISMATCH', 'client_seasons', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_seasons', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('client_seasons_client_id_fkey', 'READY_TO_CREATE', 'client_seasons', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_books_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_books_cycle_id_fkey') THEN
        INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'EXISTS', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_books') THEN
        INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id') THEN
        INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
                ELSE
                    INSERT INTO results VALUES ('club_books_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_knowledge_entries_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'EXISTS', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries') THEN
        INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('club_knowledge_entries_book_id_fkey', 'READY_TO_CREATE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_meetings_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'EXISTS', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings') THEN
        INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id') THEN
        INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
                ELSE
                    INSERT INTO results VALUES ('club_meetings_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_user_cycles_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'EXISTS', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles') THEN
        INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id') THEN
        INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
                ELSE
                    INSERT INTO results VALUES ('club_user_cycles_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_albums_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'EXISTS', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') THEN
        INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_audio_albums_estacao_id_fkey', 'READY_TO_CREATE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_progress_track_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'EXISTS', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_progress') THEN
        INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id') THEN
        INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
          AND NOT ('clube_audio_tracks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'TYPE_MISMATCH', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_audio_tracks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_audio_tracks') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_audio_progress_track_id_fkey', 'READY_TO_CREATE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_tracks_album_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'EXISTS', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') THEN
        INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id') THEN
        INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
          AND NOT ('clube_audio_albums' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'TYPE_MISMATCH', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_audio_albums' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_audio_albums') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_audio_tracks_album_id_fkey', 'READY_TO_CREATE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_carrossel_slides_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'EXISTS', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides') THEN
        INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracular_seasons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracular_seasons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'READY_TO_CREATE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_engajamento_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'EXISTS', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_engajamento') THEN
        INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_engajamento_estacao_id_fkey', 'READY_TO_CREATE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacao_registros_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'EXISTS', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros') THEN
        INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_estacao_registros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacoes_cartografia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'EXISTS', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id') THEN
        INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
          AND NOT ('cartographies' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'cartographies' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cartographies') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_estacoes_cartografia_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacoes_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'EXISTS', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id') THEN
        INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('quizzes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quizzes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quizzes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_estacoes_quiz_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_jornadas_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'EXISTS', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') THEN
        INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_jornadas_estacao_id_fkey', 'READY_TO_CREATE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_aulas_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'EXISTS', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas') THEN
        INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_portas') 
          AND NOT ('clube_livro_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_livro_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_livro_portas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_livro_aulas_porta_id_fkey', 'READY_TO_CREATE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_chat_interactions_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'EXISTS', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') THEN
        INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'TYPE_MISMATCH', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'READY_TO_CREATE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_encontros_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_encontros_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'EXISTS', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros') THEN
        INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_livro_encontros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_respostas_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'EXISTS', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas') THEN
        INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id') THEN
        INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas') 
          AND NOT ('clube_livro_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_livro_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_livro_perguntas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'READY_TO_CREATE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_obras_essencia_8020_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'EXISTS', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020') THEN
        INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_TARGET_TABLE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'TYPE_MISMATCH', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'READY_TO_CREATE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portais_jornada_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'EXISTS', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') THEN
        INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id') THEN
        INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('clube_jornadas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'TYPE_MISMATCH', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_jornadas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_jornadas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_portais_jornada_id_fkey', 'READY_TO_CREATE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_audios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'EXISTS', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_audios') THEN
        INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_insights_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'EXISTS', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_insights') THEN
        INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracular_seasons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracular_seasons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_portal_insights_estacao_id_fkey', 'READY_TO_CREATE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_materiais_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'EXISTS', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais') THEN
        INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_progresso_passos_passo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'EXISTS', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') THEN
        INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id') THEN
        INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('clube_rota_itens' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_TARGET_TABLE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'TYPE_MISMATCH', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_rota_itens' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_rota_itens') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_progresso_passos_passo_id_fkey', 'READY_TO_CREATE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_reflexoes_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_reflexoes_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'EXISTS', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_reflexoes') THEN
        INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_reflexoes_estacao_id_fkey', 'READY_TO_CREATE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_itens_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'EXISTS', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') THEN
        INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_rota_itens_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_progresso_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'EXISTS', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_rota_progresso_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_progresso_rota_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'EXISTS', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id') THEN
        INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('clube_rota_itens' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_rota_itens' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_rota_itens') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_station_audios_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_audios_station_id_fkey') THEN
        INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'EXISTS', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios') THEN
        INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id') THEN
        INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_v3_station_audios_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_station_content_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'EXISTS', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content') THEN
        INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id') THEN
        INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_v3_station_content_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_stations_route_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'EXISTS', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') THEN
        INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id') THEN
        INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_routes') 
          AND NOT ('clube_v3_routes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'TYPE_MISMATCH', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_v3_routes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_routes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_v3_stations_route_id_fkey', 'READY_TO_CREATE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_user_progress_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'EXISTS', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress') THEN
        INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id') THEN
        INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
                ELSE
                    INSERT INTO results VALUES ('clube_v3_user_progress_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'EXISTS', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_tool_complementar_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'EXISTS', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_tool_sugerida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'EXISTS', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id') THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_appointments_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'EXISTS', 'co_appointments', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_appointments', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_appointments', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_appointments', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_appointments', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_appointments_client_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_appointments_workspace_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_workspace_id_fkey') THEN
        INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'EXISTS', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_SOURCE_TABLE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id') THEN
        INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('co_workspaces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_TARGET_TABLE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_workspaces' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_workspaces') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'TARGET_NOT_UNIQUE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_appointments_workspace_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_camara_sussurro_casos_proximo_treino_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'EXISTS', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') THEN
        INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_SOURCE_TABLE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id') THEN
        INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
          AND NOT ('co_camara_sussurro_casos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_TARGET_TABLE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'TYPE_MISMATCH', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_camara_sussurro_casos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_camara_sussurro_casos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'TARGET_NOT_UNIQUE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'READY_TO_CREATE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_city_history_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'EXISTS', 'co_city_history', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_city_history', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_city_history', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_city_history', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_city_history', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_city_history_client_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_city_history_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'EXISTS', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_city_history_tool_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_client_profile_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'EXISTS', 'co_client_profile', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profile') THEN
        INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_client_profile', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_client_profile', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_client_profile', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profile', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profile', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_client_profile', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_client_profile_client_id_fkey', 'READY_TO_CREATE', 'co_client_profile', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_client_profiles_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'EXISTS', 'co_client_profiles', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profiles') THEN
        INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_client_profiles', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_client_profiles', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_client_profiles', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profiles', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profiles', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_client_profiles', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_client_profiles_client_id_fkey', 'READY_TO_CREATE', 'co_client_profiles', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_convites_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'EXISTS', 'co_convites', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_convites') THEN
        INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_convites', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_convites', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_convites', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_convites', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'TYPE_MISMATCH', 'co_convites', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_convites', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_convites_cliente_id_fkey', 'READY_TO_CREATE', 'co_convites', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

END $$;
SELECT * FROM results;
