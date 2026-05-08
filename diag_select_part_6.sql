
    SELECT 
        'message_logs_campaign_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_campaign_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_campaigns') 
                 AND NOT ('message_campaigns' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'message_campaigns' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('message_campaigns') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'message_logs' as source_table,
        'campaign_id' as source_column,
        'message_campaigns' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'message_logs_template_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_templates') 
                 AND NOT ('message_templates' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'message_templates' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('message_templates') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'message_logs' as source_table,
        'template_id' as source_column,
        'message_templates' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'mind_map_nodes_map_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_map_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
                 AND NOT ('mind_maps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'mind_maps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mind_maps') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'mind_map_nodes' as source_table,
        'map_id' as source_column,
        'mind_maps' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'mind_map_nodes_parent_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
                 AND NOT ('mind_map_nodes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'mind_map_nodes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mind_map_nodes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'mind_map_nodes' as source_table,
        'parent_id' as source_column,
        'mind_map_nodes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'mind_maps_owner_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                 AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id') 
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
        'mind_maps' as source_table,
        'owner_id' as source_column,
        'profiles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'missoes_aula_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
                 AND NOT ('aulas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'aulas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('aulas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'missoes' as source_table,
        'aula_id' as source_column,
        'aulas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'missoes_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
                 AND NOT ('portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id') 
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
        'missoes' as source_table,
        'portal_id' as source_column,
        'portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narrative_maps_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                 AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id') 
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
        'narrative_maps' as source_table,
        'case_id' as source_column,
        'session_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narrative_maps_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                 AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id') 
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
        'narrative_maps' as source_table,
        'client_id' as source_column,
        'profiles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narrative_maps_therapist_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
                 AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id') 
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
        'narrative_maps' as source_table,
        'therapist_id' as source_column,
        'profiles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narroterapia_estudos_audio_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                 AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'audio_assets' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('audio_assets') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'narroterapia_estudos' as source_table,
        'audio_id' as source_column,
        'audio_assets' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narroterapia_reacoes_simbolicas_audio_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                 AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'audio_assets' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('audio_assets') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'narroterapia_reacoes_simbolicas' as source_table,
        'audio_id' as source_column,
        'audio_assets' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
                 AND NOT ('contos_clinicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'contos_clinicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('contos_clinicos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'narroterapia_reacoes_simbolicas' as source_table,
        'conto_clinico_id' as source_column,
        'contos_clinicos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_cards_archetype_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_archetype_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
                 AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id') 
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
        'oracle_cards' as source_table,
        'archetype_id' as source_column,
        'founding_archetypes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_cards_deck_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                 AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_cards' as source_table,
        'deck_id' as source_column,
        'oracle_decks' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_cards_district_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                 AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id') 
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
        'oracle_cards' as source_table,
        'district_id' as source_column,
        'city_districts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_cards_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id') 
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
        'oracle_cards' as source_table,
        'tool_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_categories_oracle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_categories') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                 AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_categories' as source_table,
        'oracle_id' as source_column,
        'oracle_decks' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_draws_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
                 AND NOT ('oracle_clients' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_clients' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_clients') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_draws' as source_table,
        'client_id' as source_column,
        'oracle_clients' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_draws_oracle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                 AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_draws' as source_table,
        'oracle_id' as source_column,
        'oracle_decks' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_draws_spread_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
                 AND NOT ('oracle_spreads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_spreads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_spreads') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_draws' as source_table,
        'spread_id' as source_column,
        'oracle_spreads' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_spread_positions_spread_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spread_positions_spread_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
                 AND NOT ('oracle_spreads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_spreads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_spreads') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_spread_positions' as source_table,
        'spread_id' as source_column,
        'oracle_spreads' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_spreads_oracle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
                 AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oracle_spreads' as source_table,
        'oracle_id' as source_column,
        'oracle_decks' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oracle_usage_stats_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id') 
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
        'oracle_usage_stats' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_aplicacoes_pergunta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
                 AND NOT ('oraculo_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_perguntas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_aplicacoes' as source_table,
        'pergunta_id' as source_column,
        'oraculo_perguntas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_favoritos_pergunta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_pergunta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
                 AND NOT ('oraculo_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_perguntas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_favoritos' as source_table,
        'pergunta_id' as source_column,
        'oraculo_perguntas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_aplicacoes_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_aplicacoes_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_aplicacoes' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_audios_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_audios' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_essencia_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_essencia' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_ferramenta_campos_ferramenta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
                 AND NOT ('oraculo_portal_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portal_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_ferramentas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_ferramenta_campos' as source_table,
        'ferramenta_id' as source_column,
        'oraculo_portal_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_ferramentas_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_ferramentas' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_forja_erros_forja_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
                 AND NOT ('oraculo_portal_forjas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portal_forjas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_forjas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_forja_erros' as source_table,
        'forja_id' as source_column,
        'oraculo_portal_forjas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_forja_passos_forja_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
                 AND NOT ('oraculo_portal_forjas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portal_forjas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_forjas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_forja_passos' as source_table,
        'forja_id' as source_column,
        'oraculo_portal_forjas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_forjas_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_forjas' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_jardins_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_jardins' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_laboratorio_passos_laboratorio_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
                 AND NOT ('oraculo_portal_laboratorios' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portal_laboratorios' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_laboratorios') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_laboratorio_passos' as source_table,
        'laboratorio_id' as source_column,
        'oraculo_portal_laboratorios' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_laboratorios_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_laboratorios' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_materiais_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_materiais' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
                 AND NOT ('oraculo_portal_narroterapia' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portal_narroterapia' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_narroterapia') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_narroterapia_perguntas' as source_table,
        'narroterapia_id' as source_column,
        'oraculo_portal_narroterapia' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_narroterapia_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_narroterapia' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'oraculo_portal_riscos_eticos_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
                 AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'oraculo_portal_riscos_eticos' as source_table,
        'portal_id' as source_column,
        'oraculo_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portais_jornada_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_jornada_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornadas') 
                 AND NOT ('jornadas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'jornadas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('jornadas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portais' as source_table,
        'jornada_id' as source_column,
        'jornadas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portais_modulo_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modulos_formativos') 
                 AND NOT ('modulos_formativos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'modulos_formativos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('modulos_formativos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portais' as source_table,
        'modulo_id' as source_column,
        'modulos_formativos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_junguiano_modulos_config_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
                 AND NOT ('portal_junguiano_config' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'portal_junguiano_config' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_config') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_junguiano_modulos' as source_table,
        'config_id' as source_column,
        'portal_junguiano_config' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_junguiano_portais_modulo_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
                 AND NOT ('portal_junguiano_modulos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'portal_junguiano_modulos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_modulos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_junguiano_portais' as source_table,
        'modulo_id' as source_column,
        'portal_junguiano_modulos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_junguiano_progresso_config_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
                 AND NOT ('portal_junguiano_config' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'portal_junguiano_config' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_config') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_junguiano_progresso' as source_table,
        'config_id' as source_column,
        'portal_junguiano_config' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_junguiano_registros_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
                 AND NOT ('portal_junguiano_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'portal_junguiano_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_junguiano_registros' as source_table,
        'portal_id' as source_column,
        'portal_junguiano_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_progress_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                 AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_portais') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_progress' as source_table,
        'portal_id' as source_column,
        'clube_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'portal_salas_sala_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_salas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                 AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'salas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('salas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'portal_salas' as source_table,
        'sala_id' as source_column,
        'salas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'post_session_closures_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
                 AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id') 
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
        'post_session_closures' as source_table,
        'case_id' as source_column,
        'session_cases' as target_table,
        'id' as target_column
    