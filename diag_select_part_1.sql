
    SELECT 
        'access_expiration_logs_user_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'access_expiration_logs_user_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'access_expiration_logs') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                 AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'access_expiration_logs' AND column_name = 'user_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'access_expiration_logs' as source_table,
        'user_id' as source_column,
        'profiles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'admin_action_history_user_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_action_history_user_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_action_history') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                 AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_action_history' AND column_name = 'user_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'admin_action_history' as source_table,
        'user_id' as source_column,
        'profiles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'admin_automation_audit_rule_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_automation_audit_rule_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_audit') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_automation_rules') 
                 AND NOT ('admin_automation_rules' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_audit' AND column_name = 'rule_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'admin_automation_rules' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'admin_automation_rules' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('admin_automation_rules') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'admin_automation_audit' as source_table,
        'rule_id' as source_column,
        'admin_automation_rules' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'agente_conversas_agente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_agente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                 AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'agente_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'agentes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agentes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'agente_conversas' as source_table,
        'agente_id' as source_column,
        'agentes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'agente_mensagens_conversa_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_conversa_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_mensagens') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agente_conversas') 
                 AND NOT ('agente_conversas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_mensagens' AND column_name = 'conversa_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agente_conversas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'agente_conversas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agente_conversas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'agente_mensagens' as source_table,
        'conversa_id' as source_column,
        'agente_conversas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'ai_interaction_logs_agente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_agente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                 AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_interaction_logs' AND column_name = 'agente_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'agentes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agentes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'ai_interaction_logs' as source_table,
        'agente_id' as source_column,
        'agentes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'ai_recommendations_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'ai_recommendations' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'ai_recommendations_distrito_sugerido_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_distrito_sugerido_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                 AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'distrito_sugerido_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'city_districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('city_districts') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'ai_recommendations' as source_table,
        'distrito_sugerido_id' as source_column,
        'city_districts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'ai_recommendations_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'session_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'ai_recommendations' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'ai_recommendations_tool_sugerida_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_tool_sugerida_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'tool_sugerida_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'ai_recommendations' as source_table,
        'tool_sugerida_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'archetypal_profile_snapshots_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetypal_profile_snapshots_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetypal_profile_snapshots' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'archetypal_profile_snapshots' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'archetype_tools_archetype_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_archetype_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'archetype_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'archetype_tools' as source_table,
        'archetype_id' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'archetype_tools_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'archetype_tools_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'archetype_tools') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'archetype_tools' AND column_name = 'tool_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'archetype_tools' as source_table,
        'tool_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'atelie_conteudos_template_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atelie_conteudos_template_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_conteudos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atelie_templates') 
                 AND NOT ('atelie_templates' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_conteudos' AND column_name = 'template_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atelie_templates' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'atelie_templates' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('atelie_templates') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'atelie_conteudos' as source_table,
        'template_id' as source_column,
        'atelie_templates' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'atlas_arquetipos_registros_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atlas_arquetipos_registros_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_registros' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'atlas_arquetipos_registros' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'aulas_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aulas_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
                 AND NOT ('portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'aulas' as source_table,
        'portal_id' as source_column,
        'portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'biblioteca_casos_porta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'biblioteca_casos_porta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'biblioteca_casos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
                 AND NOT ('labirinto_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'biblioteca_casos' AND column_name = 'porta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'labirinto_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_portas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'biblioteca_casos' as source_table,
        'porta_id' as source_column,
        'labirinto_portas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_funcional_perguntas_dimensao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_funcional_perguntas_dimensao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes') 
                 AND NOT ('big5_funcional_dimensoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_perguntas' AND column_name = 'dimensao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_funcional_dimensoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'big5_funcional_dimensoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_funcional_dimensoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_funcional_perguntas' as source_table,
        'dimensao_id' as source_column,
        'big5_funcional_dimensoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_oracular_perguntas_fator_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_oracular_perguntas_fator_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores') 
                 AND NOT ('big5_oracular_fatores' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_perguntas' AND column_name = 'fator_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_fatores' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'big5_oracular_fatores' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_oracular_fatores') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_oracular_perguntas' as source_table,
        'fator_id' as source_column,
        'big5_oracular_fatores' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_porta_mapeamento_ritual_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_porta_mapeamento_ritual_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
                 AND NOT ('rituais_simbolicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_porta_mapeamento' AND column_name = 'ritual_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'rituais_simbolicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('rituais_simbolicos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_porta_mapeamento' as source_table,
        'ritual_id' as source_column,
        'rituais_simbolicos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_ritual_registros_big5_registro_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_big5_registro_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros') 
                 AND NOT ('big5_oracular_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'big5_registro_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_oracular_registros' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'big5_oracular_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_oracular_registros') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_ritual_registros' as source_table,
        'big5_registro_id' as source_column,
        'big5_oracular_registros' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_ritual_registros_ritual_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_ritual_registros_ritual_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos') 
                 AND NOT ('rituais_simbolicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_ritual_registros' AND column_name = 'ritual_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_simbolicos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'rituais_simbolicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('rituais_simbolicos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_ritual_registros' as source_table,
        'ritual_id' as source_column,
        'rituais_simbolicos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_symbolic_afirmacoes_force_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_afirmacoes_force_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces') 
                 AND NOT ('big5_symbolic_forces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_afirmacoes' AND column_name = 'force_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_forces' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'big5_symbolic_forces' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_symbolic_forces') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_symbolic_afirmacoes' as source_table,
        'force_id' as source_column,
        'big5_symbolic_forces' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'big5_symbolic_registros_session_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'big5_symbolic_registros_session_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                 AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'session_case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'big5_symbolic_registros' as source_table,
        'session_case_id' as source_column,
        'session_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'book_links_from_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_from_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'from_book_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'book_links' as source_table,
        'from_book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'book_links_to_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_links_to_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_links') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_links' AND column_name = 'to_book_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'book_links' as source_table,
        'to_book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'book_media_station_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_media_station_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_media') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_media' AND column_name = 'station_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'book_media' as source_table,
        'station_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'book_tours_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'book_tours_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'book_tours') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'book_tours' AND column_name = 'book_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'book_tours' as source_table,
        'book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'canteiro_reactions_entry_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'canteiro_reactions_entry_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'canteiro_reactions') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') 
                 AND NOT ('collective_bed_entries' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'canteiro_reactions' AND column_name = 'entry_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'collective_bed_entries' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('collective_bed_entries') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'canteiro_reactions' as source_table,
        'entry_id' as source_column,
        'collective_bed_entries' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartografia_complexos_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_complexos_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_complexos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_complexos' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartografia_complexos' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartografia_psiquica_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartografia_psiquica_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartografia_psiquica' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartografia_psiquica' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_engine_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_engine' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_engine_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_engine_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'session_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_engine' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_recommendations_engine_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_engine_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_engine') 
                 AND NOT ('cartographer_engine' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'engine_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_engine' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'cartographer_engine' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cartographer_engine') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_recommendations' as source_table,
        'engine_id' as source_column,
        'cartographer_engine' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_recommendations_ferramenta_escolhida_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_ferramenta_escolhida_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'ferramenta_escolhida_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_recommendations' as source_table,
        'ferramenta_escolhida_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_recommendations_tool_complementar_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_complementar_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_complementar_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_recommendations' as source_table,
        'tool_complementar_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographer_recommendations_tool_principal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographer_recommendations_tool_principal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographer_recommendations' AND column_name = 'tool_principal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographer_recommendations' as source_table,
        'tool_principal_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographies_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographies' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cartographies_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cartographies_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'session_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cartographies' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'casa_circulo_replies_thread_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'casa_circulo_replies_thread_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads') 
                 AND NOT ('casa_circulo_threads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_replies' AND column_name = 'thread_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casa_circulo_threads' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'casa_circulo_threads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('casa_circulo_threads') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'casa_circulo_replies' as source_table,
        'thread_id' as source_column,
        'casa_circulo_threads' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cidadela_oracle_cards_district_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_district_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
                 AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'district_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('districts') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cidadela_oracle_cards' as source_table,
        'district_id' as source_column,
        'districts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cidadela_oracle_cards_suggested_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_suggested_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'suggested_tool_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cidadela_oracle_cards' as source_table,
        'suggested_tool_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cidadela_oracle_usage_card_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_card_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
                 AND NOT ('cidadela_oracle_cards' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'card_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'cidadela_oracle_cards' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cidadela_oracle_cards') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cidadela_oracle_usage' as source_table,
        'card_id' as source_column,
        'cidadela_oracle_cards' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'cidadela_oracle_usage_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_usage' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'cidadela_oracle_usage' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_archetype_state_arquitipo_evolucao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_evolucao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_evolucao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_archetype_state' as source_table,
        'arquitipo_evolucao_id' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_archetype_state_arquitipo_regente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_regente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_regente_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_archetype_state' as source_table,
        'arquitipo_regente_id' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_archetype_state_arquitipo_sombra_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_arquitipo_sombra_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'arquitipo_sombra_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_archetype_state' as source_table,
        'arquitipo_sombra_id' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_archetype_state_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_archetype_state_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_archetype_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_archetype_state' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_archetype_state' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_cidadela_map_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_cidadela_map') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_cidadela_map' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_city_state_arquetipo_ativo_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'client_city_state' as source_table,
        'arquetipo_ativo' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
    