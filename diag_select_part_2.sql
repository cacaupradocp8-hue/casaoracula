
    SELECT 
        'client_city_state_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id') 
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
        'client_city_state' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_city_state_distrito_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
                 AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id') 
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
        'client_city_state' as source_table,
        'distrito_id' as source_column,
        'city_districts' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_city_state_ultima_ferramenta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
                 AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id') 
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
        'client_city_state' as source_table,
        'ultima_ferramenta_id' as source_column,
        'tools' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_city_state_ultima_sessao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id') 
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
        'client_city_state' as source_table,
        'ultima_sessao_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_labyrinths_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_labyrinths') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id') 
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
        'client_labyrinths' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_live_map_entries_session_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_live_map_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
                 AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id') 
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
        'client_live_map_entries' as source_table,
        'session_id' as source_column,
        'sessions' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_pattern_stats_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_pattern_stats') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id') 
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
        'client_pattern_stats' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'client_seasons_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_seasons') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id') 
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
        'client_seasons' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'club_books_cycle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_books_cycle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_books') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                 AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        '_deprecated_club_books' as source_table,
        'cycle_id' as source_column,
        '_deprecated_club_cycles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'club_knowledge_entries_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id') 
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
        '_deprecated_club_knowledge_entries' as source_table,
        'book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'club_meetings_cycle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                 AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        '_deprecated_club_meetings' as source_table,
        'cycle_id' as source_column,
        '_deprecated_club_cycles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'club_user_cycles_cycle_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
                 AND NOT ('_deprecated_club_cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN '_deprecated_club_cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('_deprecated_club_cycles') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        '_deprecated_club_user_cycles' as source_table,
        'cycle_id' as source_column,
        '_deprecated_club_cycles' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_audio_albums_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id') 
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
        'clube_audio_albums' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_audio_progress_track_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
                 AND NOT ('clube_audio_tracks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_audio_tracks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_audio_tracks') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_audio_progress' as source_table,
        'track_id' as source_column,
        'clube_audio_tracks' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_audio_tracks_album_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
                 AND NOT ('clube_audio_albums' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_audio_albums' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_audio_albums') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_audio_tracks' as source_table,
        'album_id' as source_column,
        'clube_audio_albums' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_carrossel_slides_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                 AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id') 
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
        'clube_carrossel_slides' as source_table,
        'estacao_id' as source_column,
        'oracular_seasons' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_engajamento_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_engajamento') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id') 
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
        'clube_engajamento' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_estacao_registros_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id') 
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
        'clube_estacao_registros' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_estacoes_cartografia_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
                 AND NOT ('cartographies' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'cartographies' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cartographies') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_estacoes' as source_table,
        'cartografia_id' as source_column,
        'cartographies' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_estacoes_quiz_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
                 AND NOT ('quizzes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'quizzes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quizzes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_estacoes' as source_table,
        'quiz_id' as source_column,
        'quizzes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_jornadas_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id') 
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
        'clube_jornadas' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_livro_aulas_porta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_portas') 
                 AND NOT ('clube_livro_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_livro_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_livro_portas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_livro_aulas' as source_table,
        'porta_id' as source_column,
        'clube_livro_portas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_livro_chat_interactions_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id') 
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
        'clube_livro_chat_interactions' as source_table,
        'book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_livro_encontros_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_encontros_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id') 
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
        'clube_livro_encontros' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_livro_respostas_pergunta_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas') 
                 AND NOT ('clube_livro_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_livro_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_livro_perguntas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_livro_respostas' as source_table,
        'pergunta_id' as source_column,
        'clube_livro_perguntas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_obras_essencia_8020_book_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
                 AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id') 
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
        'clube_obras_essencia_8020' as source_table,
        'book_id' as source_column,
        'books' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_portais_jornada_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
                 AND NOT ('clube_jornadas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_jornadas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_jornadas') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_portais' as source_table,
        'jornada_id' as source_column,
        'clube_jornadas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_portal_audios_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_audios') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                 AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id') 
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
        'clube_portal_audios' as source_table,
        'portal_id' as source_column,
        'clube_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_portal_insights_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_insights') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
                 AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id') 
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
        'clube_portal_insights' as source_table,
        'estacao_id' as source_column,
        'oracular_seasons' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_portal_materiais_portal_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
                 AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id') 
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
        'clube_portal_materiais' as source_table,
        'portal_id' as source_column,
        'clube_portais' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_progresso_passos_passo_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
                 AND NOT ('clube_rota_itens' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_rota_itens' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_rota_itens') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_progresso_passos' as source_table,
        'passo_id' as source_column,
        'clube_rota_itens' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_reflexoes_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_reflexoes_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_reflexoes') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id') 
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
        'clube_reflexoes' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_rota_itens_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id') 
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
        'clube_rota_itens' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_rota_progresso_estacao_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
                 AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id') 
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
        'clube_rota_progresso' as source_table,
        'estacao_id' as source_column,
        'clube_estacoes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_rota_progresso_rota_item_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
                 AND NOT ('clube_rota_itens' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_rota_itens' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_rota_itens') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_rota_progresso' as source_table,
        'rota_item_id' as source_column,
        'clube_rota_itens' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_v3_station_audios_station_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_audios_station_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                 AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_v3_station_audios' as source_table,
        'station_id' as source_column,
        'clube_v3_stations' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_v3_station_content_station_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                 AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_v3_station_content' as source_table,
        'station_id' as source_column,
        'clube_v3_stations' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_v3_stations_route_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_routes') 
                 AND NOT ('clube_v3_routes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_v3_routes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_routes') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_v3_stations' as source_table,
        'route_id' as source_column,
        'clube_v3_routes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'clube_v3_user_progress_station_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
                 AND NOT ('clube_v3_stations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'clube_v3_stations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_v3_stations') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'clube_v3_user_progress' as source_table,
        'station_id' as source_column,
        'clube_v3_stations' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_ai_recommendations_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id') 
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
        'co_ai_recommendations' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_ai_recommendations_tool_complementar_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                 AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id') 
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
        'co_ai_recommendations' as source_table,
        'tool_complementar_id' as source_column,
        'sala_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_ai_recommendations_tool_sugerida_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                 AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id') 
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
        'co_ai_recommendations' as source_table,
        'tool_sugerida_id' as source_column,
        'sala_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_appointments_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id') 
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
        'co_appointments' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_appointments_workspace_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_workspace_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
                 AND NOT ('co_workspaces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id') 
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
        'co_appointments' as source_table,
        'workspace_id' as source_column,
        'co_workspaces' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_camara_sussurro_casos_proximo_treino_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
                 AND NOT ('co_camara_sussurro_casos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id') 
                 <> (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id') THEN 'TYPE_MISMATCH'
            WHEN NOT EXISTS (
                SELECT 1 
                FROM pg_index i
                JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                WHERE i.indrelid = (CASE WHEN 'co_camara_sussurro_casos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_camara_sussurro_casos') END)::regclass
                AND a.attname = 'id'
                AND i.indisunique
                AND array_length(i.indkey, 1) = 1
            ) THEN 'TARGET_NOT_UNIQUE'
            ELSE 'READY_TO_CREATE'
        END as status,
        'co_camara_sussurro_casos' as source_table,
        'proximo_treino_id' as source_column,
        'co_camara_sussurro_casos' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_city_history_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id') 
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
        'co_city_history' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_city_history_tool_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
                 AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id') 
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
        'co_city_history' as source_table,
        'tool_id' as source_column,
        'sala_ferramentas' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_client_profile_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profile') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id') 
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
        'co_client_profile' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_client_profiles_client_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profiles') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id') 
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
        'co_client_profiles' as source_table,
        'client_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
     UNION ALL 
    SELECT 
        'co_convites_cliente_id_fkey' as name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN 'EXISTS'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_convites') THEN 'MISSING_SOURCE_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id') THEN 'MISSING_SOURCE_COLUMN'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
                 AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN 'MISSING_TARGET_TABLE'
            WHEN NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN 'MISSING_TARGET_COLUMN'
            WHEN (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id') 
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
        'co_convites' as source_table,
        'cliente_id' as source_column,
        'clientes' as target_table,
        'id' as target_column
    