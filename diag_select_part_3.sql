
    SELECT 
        'co_escutas_sessao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_sessao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                 AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_escutas' as source_table,
        'sessao_id' as source_column,
        'co_sessoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_garden_flowers_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id') 
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
        'co_garden_flowers' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_garden_flowers_origem_registro_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
                 AND NOT ('co_journey_records' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_journey_records' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_journey_records') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_garden_flowers' as source_table,
        'origem_registro_id' as source_column,
        'co_journey_records' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_jardim_entries_jardim_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_jardim_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                 AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_jardim_entries' as source_table,
        'jardim_id' as source_column,
        'co_jardins' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_journey_records_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id') 
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
        'co_journey_records' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_journey_records_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                 AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_journey_records' as source_table,
        'tool_id' as source_column,
        'sala_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_orientacao_sugestoes_ia_cliente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_cliente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id') 
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
        'co_orientacao_sugestoes_ia' as source_table,
        'cliente_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_orientacao_sugestoes_ia_orientacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
                 AND NOT ('co_orientacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_orientacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_orientacoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_orientacao_sugestoes_ia' as source_table,
        'orientacao_id' as source_column,
        'co_orientacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_orientacao_sugestoes_ia_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id') 
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
        'co_orientacao_sugestoes_ia' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_orientacoes_cliente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id') 
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
        'co_orientacoes' as source_table,
        'cliente_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_orientacoes_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id') 
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
        'co_orientacoes' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_passport_entries_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_passport_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id') 
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
        'co_passport_entries' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_praticas_sessao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_sessao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                 AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_praticas' as source_table,
        'sessao_id' as source_column,
        'co_sessoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_registros_simbolicos_jardim_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_jardim_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                 AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_registros_simbolicos' as source_table,
        'jardim_id' as source_column,
        'co_jardins' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_registros_simbolicos_sessao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
                 AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_registros_simbolicos' as source_table,
        'sessao_id' as source_column,
        'co_sessoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sessoes_jardim_ref_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_jardim_ref_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
                 AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sessoes' as source_table,
        'jardim_ref_id' as source_column,
        'co_jardins' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_options_proximo_step_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_proximo_step_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                 AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_options' as source_table,
        'proximo_step_id' as source_column,
        'co_sim_steps' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_options_step_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                 AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_options' as source_table,
        'step_id' as source_column,
        'co_sim_steps' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_progress_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
                 AND NOT ('co_sim_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_progress' as source_table,
        'case_id' as source_column,
        'co_sim_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_progress_escolha_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
                 AND NOT ('co_sim_options' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_options' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_options') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_progress' as source_table,
        'escolha_id' as source_column,
        'co_sim_options' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_progress_step_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
                 AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_progress' as source_table,
        'step_id' as source_column,
        'co_sim_steps' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_sim_steps_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
                 AND NOT ('co_sim_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_sim_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_sim_steps' as source_table,
        'case_id' as source_column,
        'co_sim_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_tool_flows_tool_destino_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_destino_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id') 
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
        'co_tool_flows' as source_table,
        'tool_destino_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_tool_flows_tool_origem_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id') 
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
        'co_tool_flows' as source_table,
        'tool_origem_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_tool_usage_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_usage') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                 AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_tool_usage' as source_table,
        'tool_id' as source_column,
        'sala_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_training_attempts_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                 AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_training_attempts' as source_table,
        'case_id' as source_column,
        'co_training_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_training_case_feedbacks_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                 AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_training_case_feedbacks' as source_table,
        'case_id' as source_column,
        'co_training_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_training_case_possible_readings_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                 AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_training_case_possible_readings' as source_table,
        'case_id' as source_column,
        'co_training_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_training_case_signals_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_signals') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                 AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_training_case_signals' as source_table,
        'case_id' as source_column,
        'co_training_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_training_progress_ultimo_case_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
                 AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_training_progress' as source_table,
        'ultimo_case_id' as source_column,
        'co_training_cases' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_travessia_encontros_travessia_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
                 AND NOT ('co_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessias') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_travessia_encontros' as source_table,
        'travessia_id' as source_column,
        'co_travessias' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_travessia_respostas_encontro_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') 
                 AND NOT ('co_travessia_encontros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_travessia_encontros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessia_encontros') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_travessia_respostas' as source_table,
        'encontro_id' as source_column,
        'co_travessia_encontros' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_travessia_respostas_travessia_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
                 AND NOT ('co_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessias') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_travessia_respostas' as source_table,
        'travessia_id' as source_column,
        'co_travessias' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_workspace_users_workspace_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspace_users') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
                 AND NOT ('co_workspaces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_workspaces' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_workspaces') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_workspace_users' as source_table,
        'workspace_id' as source_column,
        'co_workspaces' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'collective_bed_entries_bed_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_bed_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') 
                 AND NOT ('collective_beds' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'collective_beds' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('collective_beds') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'collective_bed_entries' as source_table,
        'bed_id' as source_column,
        'collective_beds' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'collective_bed_entries_season_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                 AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracular_seasons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracular_seasons') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'collective_bed_entries' as source_table,
        'season_id' as source_column,
        'oracular_seasons' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'collective_beds_season_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_beds_season_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                 AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'oracular_seasons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracular_seasons') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'collective_beds' as source_table,
        'season_id' as source_column,
        'oracular_seasons' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_comments_post_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_post_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
                 AND NOT ('community_posts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_posts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_posts') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_comments' as source_table,
        'post_id' as source_column,
        'community_posts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_event_participants_event_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_events') 
                 AND NOT ('community_events' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_events' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_events') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_event_participants' as source_table,
        'event_id' as source_column,
        'community_events' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_group_members_group_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_group_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_group_members') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_groups') 
                 AND NOT ('community_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_groups') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_group_members' as source_table,
        'group_id' as source_column,
        'community_groups' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_likes_post_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_post_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_likes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
                 AND NOT ('community_posts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_posts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_posts') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_likes' as source_table,
        'post_id' as source_column,
        'community_posts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_topic_replies_topic_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topic_replies_topic_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topic_replies') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
                 AND NOT ('community_topics' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_topics' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_topics') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_topic_replies' as source_table,
        'topic_id' as source_column,
        'community_topics' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'community_topics_forum_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_forum_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_forums') 
                 AND NOT ('community_forums' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'community_forums' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_forums') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'community_topics' as source_table,
        'forum_id' as source_column,
        'community_forums' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'conselho_partes_internas_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id') 
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
        'conselho_partes_internas' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'content_blocks_agente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
                 AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id') 
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
        'content_blocks' as source_table,
        'agente_id' as source_column,
        'agentes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'conteudo_aulas_travessia_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
                 AND NOT ('conteudo_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'conteudo_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_travessias') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'conteudo_aulas' as source_table,
        'travessia_id' as source_column,
        'conteudo_travessias' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'conteudo_travessias_sala_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
                 AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id') 
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
        'conteudo_travessias' as source_table,
        'sala_id' as source_column,
        'salas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'contos_clinicos_audio_padrao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
                 AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id') 
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
        'contos_clinicos' as source_table,
        'audio_padrao_id' as source_column,
        'audio_assets' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'corpo_inconsciente_cliente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id') 
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
        'corpo_inconsciente' as source_table,
        'cliente_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'course_enrollments_course_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_enrollments') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
                 AND NOT ('courses' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'courses' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('courses') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'course_enrollments' as source_table,
        'course_id' as source_column,
        'courses' as target_table,
        'id' as target_column
    