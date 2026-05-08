-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 6 de 8)
-- Diagnóstico de FKs 241 a 288 (Total: 48)

CREATE TEMP TABLE diagnostic_results (
    constraint_name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT,
    reason TEXT
);

DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing labyrinth_records_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'EXISTS', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_SOURCE_TABLE', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Table labyrinth_records not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Column labyrinth_records.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_TARGET_TABLE', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'TARGET_NOT_UNIQUE', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labyrinth_records_client_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labyrinth_records_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'EXISTS', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_SOURCE_TABLE', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Table labyrinth_records not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Column labyrinth_records.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_TARGET_TABLE', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'TARGET_NOT_UNIQUE', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labyrinth_records_session_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lessons_album_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'EXISTS', 'lessons_album', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons_album') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'MISSING_SOURCE_TABLE', 'lessons_album', 'book_id', 'books', 'id', 'Table lessons_album not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'lessons_album', 'book_id', 'books', 'id', 'Column lessons_album.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'MISSING_TARGET_TABLE', 'lessons_album', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons_album', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'TYPE_MISMATCH', 'lessons_album', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'READY_TO_CREATE', 'lessons_album', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons_album', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'TYPE_MISMATCH', 'lessons_album', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'TARGET_NOT_UNIQUE', 'lessons_album', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('lessons_album_book_id_fkey', 'READY_TO_CREATE', 'lessons_album', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lessons_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'EXISTS', 'lessons', 'travessia_id', 'travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'lessons', 'travessia_id', 'travessias', 'id', 'Table lessons not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id') THEN
        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'lessons', 'travessia_id', 'travessias', 'id', 'Column lessons.travessia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'lessons', 'travessia_id', 'travessias', 'id', 'Table travessias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons', 'travessia_id', 'travessias', 'id', 'Column travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'TYPE_MISMATCH', 'lessons', 'travessia_id', 'travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'READY_TO_CREATE', 'lessons', 'travessia_id', 'travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons', 'travessia_id', 'travessias', 'id', 'Column travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'TYPE_MISMATCH', 'lessons', 'travessia_id', 'travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.travessias')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'lessons', 'travessia_id', 'travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('lessons_travessia_id_fkey', 'READY_TO_CREATE', 'lessons', 'travessia_id', 'travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_heroina_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_heroina_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'EXISTS', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_heroina') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Table mapa_heroina not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Column mapa_heroina.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Table labirinto_fases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_fases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'TYPE_MISMATCH', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'READY_TO_CREATE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'TYPE_MISMATCH', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.labirinto_fases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapa_heroina_porta_id_fkey', 'READY_TO_CREATE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_sombra_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'EXISTS', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_sombra') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Table mapa_sombra not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Column mapa_sombra.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'TYPE_MISMATCH', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'READY_TO_CREATE', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'TYPE_MISMATCH', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapa_sombra_cliente_id_fkey', 'READY_TO_CREATE', 'mapa_sombra', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_heroina_gesto_jardim_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'EXISTS', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Table mapa_vivo_heroina not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Column mapa_vivo_heroina.gesto_jardim_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Table jardim_heroina_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'jardim_heroina_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Column jardim_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Column jardim_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.jardim_heroina_registros')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_heroina_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'EXISTS', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Table mapa_vivo_heroina not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Column mapa_vivo_heroina.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_historico_mapa_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'EXISTS', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Table mapa_vivo_historico not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_historico.mapa_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Table mapa_vivo_heroina not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'mapa_vivo_heroina' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.mapa_vivo_heroina')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapeamento_complexos_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'EXISTS', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos') THEN
        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Table mapeamento_complexos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Column mapeamento_complexos.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'TYPE_MISMATCH', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'READY_TO_CREATE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'TYPE_MISMATCH', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mapeamento_complexos_cliente_id_fkey', 'READY_TO_CREATE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing message_logs_campaign_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_campaign_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'EXISTS', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'MISSING_SOURCE_TABLE', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Table message_logs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'MISSING_SOURCE_COLUMN', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Column message_logs.campaign_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_campaigns') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'MISSING_TARGET_TABLE', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Table message_campaigns not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'message_campaigns' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Column message_campaigns.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'READY_TO_CREATE', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Column message_campaigns.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.message_campaigns')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'TARGET_NOT_UNIQUE', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('message_logs_campaign_id_fkey', 'READY_TO_CREATE', 'message_logs', 'campaign_id', 'message_campaigns', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing message_logs_template_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'EXISTS', 'message_logs', 'template_id', 'message_templates', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'MISSING_SOURCE_TABLE', 'message_logs', 'template_id', 'message_templates', 'id', 'Table message_logs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id') THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'MISSING_SOURCE_COLUMN', 'message_logs', 'template_id', 'message_templates', 'id', 'Column message_logs.template_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_templates') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'MISSING_TARGET_TABLE', 'message_logs', 'template_id', 'message_templates', 'id', 'Table message_templates not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'message_templates' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'template_id', 'message_templates', 'id', 'Column message_templates.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'template_id', 'message_templates', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'READY_TO_CREATE', 'message_logs', 'template_id', 'message_templates', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'template_id', 'message_templates', 'id', 'Column message_templates.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'template_id', 'message_templates', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.message_templates')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'TARGET_NOT_UNIQUE', 'message_logs', 'template_id', 'message_templates', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('message_logs_template_id_fkey', 'READY_TO_CREATE', 'message_logs', 'template_id', 'message_templates', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_map_nodes_map_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_map_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'EXISTS', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Table mind_map_nodes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Column mind_map_nodes.map_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_TARGET_TABLE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Table mind_maps not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'mind_maps' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Column mind_maps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Column mind_maps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.mind_maps')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_map_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_map_nodes_parent_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'EXISTS', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Table mind_map_nodes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id') THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Column mind_map_nodes.parent_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_TARGET_TABLE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Table mind_map_nodes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'mind_map_nodes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Column mind_map_nodes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Column mind_map_nodes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.mind_map_nodes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mind_map_nodes_parent_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_maps_owner_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'EXISTS', 'mind_maps', 'owner_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') THEN
        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_maps', 'owner_id', 'profiles', 'id', 'Table mind_maps not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id') THEN
        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_maps', 'owner_id', 'profiles', 'id', 'Column mind_maps.owner_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'MISSING_TARGET_TABLE', 'mind_maps', 'owner_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_maps', 'owner_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'TYPE_MISMATCH', 'mind_maps', 'owner_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'READY_TO_CREATE', 'mind_maps', 'owner_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_maps', 'owner_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'TYPE_MISMATCH', 'mind_maps', 'owner_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_maps', 'owner_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('mind_maps_owner_id_fkey', 'READY_TO_CREATE', 'mind_maps', 'owner_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing missoes_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'EXISTS', 'missoes', 'aula_id', 'aulas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'missoes', 'aula_id', 'aulas', 'id', 'Table missoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'missoes', 'aula_id', 'aulas', 'id', 'Column missoes.aula_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'MISSING_TARGET_TABLE', 'missoes', 'aula_id', 'aulas', 'id', 'Table aulas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'aulas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'aula_id', 'aulas', 'id', 'Column aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'TYPE_MISMATCH', 'missoes', 'aula_id', 'aulas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'READY_TO_CREATE', 'missoes', 'aula_id', 'aulas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'aula_id', 'aulas', 'id', 'Column aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'TYPE_MISMATCH', 'missoes', 'aula_id', 'aulas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.aulas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'missoes', 'aula_id', 'aulas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('missoes_aula_id_fkey', 'READY_TO_CREATE', 'missoes', 'aula_id', 'aulas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing missoes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'EXISTS', 'missoes', 'portal_id', 'portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'missoes', 'portal_id', 'portais', 'id', 'Table missoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'missoes', 'portal_id', 'portais', 'id', 'Column missoes.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'missoes', 'portal_id', 'portais', 'id', 'Table portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'portal_id', 'portais', 'id', 'Column portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'TYPE_MISMATCH', 'missoes', 'portal_id', 'portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'READY_TO_CREATE', 'missoes', 'portal_id', 'portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'portal_id', 'portais', 'id', 'Column portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'TYPE_MISMATCH', 'missoes', 'portal_id', 'portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'missoes', 'portal_id', 'portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('missoes_portal_id_fkey', 'READY_TO_CREATE', 'missoes', 'portal_id', 'portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'EXISTS', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Table narrative_maps not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Column narrative_maps.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_case_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'EXISTS', 'narrative_maps', 'client_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'client_id', 'profiles', 'id', 'Table narrative_maps not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'client_id', 'profiles', 'id', 'Column narrative_maps.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'client_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'client_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'client_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'client_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'client_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_client_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'client_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'EXISTS', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Table narrative_maps not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id') THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Column narrative_maps.therapist_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narrative_maps_therapist_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'therapist_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_estudos_audio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'EXISTS', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Table narroterapia_estudos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Column narroterapia_estudos.audio_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Table audio_assets not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'audio_assets' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.audio_assets')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narroterapia_estudos_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_reacoes_simbolicas_audio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'EXISTS', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Table narroterapia_reacoes_simbolicas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Column narroterapia_reacoes_simbolicas.audio_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Table audio_assets not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'audio_assets' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.audio_assets')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_reacoes_simbolicas_conto_clinico_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'EXISTS', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Table narroterapia_reacoes_simbolicas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id') THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Column narroterapia_reacoes_simbolicas.conto_clinico_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Table contos_clinicos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'contos_clinicos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Column contos_clinicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Column contos_clinicos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.contos_clinicos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_archetype_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'EXISTS', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Table oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Column oracle_cards.archetype_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_archetype_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_deck_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'EXISTS', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Table oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Column oracle_cards.deck_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Table oracle_decks not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_decks' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_decks')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_deck_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'EXISTS', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Table oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Column oracle_cards.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Table city_districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'city_districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'district_id', 'city_districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'EXISTS', 'oracle_cards', 'tool_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'tool_id', 'tools', 'id', 'Table oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'tool_id', 'tools', 'id', 'Column oracle_cards.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'tool_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'tool_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'tool_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'tool_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'tool_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_cards_tool_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'tool_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_categories_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'EXISTS', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_categories') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_categories not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_categories.oracle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_decks not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_decks' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_decks')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_categories_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'EXISTS', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Table oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Column oracle_draws.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Table oracle_clients not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_clients' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Column oracle_clients.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Column oracle_clients.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_clients')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'client_id', 'oracle_clients', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'EXISTS', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_draws.oracle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_decks not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_decks' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_decks')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_spread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'EXISTS', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Table oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_draws.spread_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Table oracle_spreads not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_spreads' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_spreads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_spreads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_spreads')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_draws_spread_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_spread_positions_spread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spread_positions_spread_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'EXISTS', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Table oracle_spread_positions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_spread_positions.spread_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Table oracle_spreads not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_spreads' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_spreads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'READY_TO_CREATE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Column oracle_spreads.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_spreads')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_spread_positions_spread_id_fkey', 'READY_TO_CREATE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_spreads_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'EXISTS', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_spreads not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_spreads.oracle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Table oracle_decks not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracle_decks' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Column oracle_decks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracle_decks')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_spreads_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_usage_stats_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'EXISTS', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Table oracle_usage_stats not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Column oracle_usage_stats.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'TYPE_MISMATCH', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'READY_TO_CREATE', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'TYPE_MISMATCH', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oracle_usage_stats_client_id_fkey', 'READY_TO_CREATE', 'oracle_usage_stats', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_aplicacoes_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'EXISTS', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Table oraculo_aplicacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_aplicacoes.pergunta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Table oraculo_perguntas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_perguntas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_perguntas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_favoritos_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_pergunta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'EXISTS', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Table oraculo_favoritos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_favoritos.pergunta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Table oraculo_perguntas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_perguntas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Column oraculo_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_perguntas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_aplicacoes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_aplicacoes_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'EXISTS', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_aplicacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_aplicacoes.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_audios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'EXISTS', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_audios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_audios.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_essencia_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'EXISTS', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_essencia not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_essencia.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_ferramenta_campos_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'EXISTS', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Table oraculo_portal_ferramenta_campos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Column oraculo_portal_ferramenta_campos.ferramenta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Table oraculo_portal_ferramentas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portal_ferramentas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Column oraculo_portal_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Column oraculo_portal_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portal_ferramentas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_ferramentas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'EXISTS', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_ferramentas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_ferramentas.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forja_erros_forja_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'EXISTS', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Table oraculo_portal_forja_erros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forja_erros.forja_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Table oraculo_portal_forjas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portal_forjas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forjas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forjas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portal_forjas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forja_passos_forja_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'EXISTS', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Table oraculo_portal_forja_passos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forja_passos.forja_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Table oraculo_portal_forjas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portal_forjas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forjas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Column oraculo_portal_forjas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portal_forjas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forjas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'EXISTS', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_forjas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_forjas.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_jardins_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'EXISTS', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_jardins not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_jardins.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_laboratorio_passos_laboratorio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'EXISTS', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Table oraculo_portal_laboratorio_passos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Column oraculo_portal_laboratorio_passos.laboratorio_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Table oraculo_portal_laboratorios not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portal_laboratorios' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Column oraculo_portal_laboratorios.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Column oraculo_portal_laboratorios.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portal_laboratorios')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_laboratorios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'EXISTS', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_laboratorios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_laboratorios.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_materiais_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'EXISTS', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_materiais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_materiais.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

SELECT * FROM diagnostic_results ORDER BY status, constraint_name;

-- Summary for this part
SELECT 
    status, 
    count(*) as total
FROM diagnostic_results
GROUP BY status
ORDER BY total DESC;

DROP TABLE diagnostic_results;
