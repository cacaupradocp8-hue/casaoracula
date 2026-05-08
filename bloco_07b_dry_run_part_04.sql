-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 4 de 8)
-- Diagnóstico de FKs 145 a 192 (Total: 48)

-- Limpar tabela anterior se existir na sessão
DROP TABLE IF EXISTS diagnostic_results;

-- Criar tabela temporária de diagnóstico
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

    -- Analyzing content_blocks_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'EXISTS', 'content_blocks', 'agente_id', 'agentes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') THEN
        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'content_blocks', 'agente_id', 'agentes', 'id', 'Table content_blocks not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id') THEN
        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'content_blocks', 'agente_id', 'agentes', 'id', 'Column content_blocks.agente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'MISSING_TARGET_TABLE', 'content_blocks', 'agente_id', 'agentes', 'id', 'Table agentes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'agentes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'content_blocks', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'TYPE_MISMATCH', 'content_blocks', 'agente_id', 'agentes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'agentes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'READY_TO_CREATE', 'content_blocks', 'agente_id', 'agentes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'content_blocks', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'TYPE_MISMATCH', 'content_blocks', 'agente_id', 'agentes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.agentes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'content_blocks', 'agente_id', 'agentes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('content_blocks_agente_id_fkey', 'READY_TO_CREATE', 'content_blocks', 'agente_id', 'agentes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conteudo_aulas_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'EXISTS', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Table conteudo_aulas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Column conteudo_aulas.travessia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Table conteudo_travessias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'conteudo_travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'TYPE_MISMATCH', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'conteudo_travessias');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'READY_TO_CREATE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'TYPE_MISMATCH', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.conteudo_travessias')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('conteudo_aulas_travessia_id_fkey', 'READY_TO_CREATE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conteudo_travessias_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'EXISTS', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Table conteudo_travessias not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id') THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Column conteudo_travessias.sala_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_TARGET_TABLE', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Table salas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'salas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'TYPE_MISMATCH', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'salas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'READY_TO_CREATE', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'TYPE_MISMATCH', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.salas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('conteudo_travessias_sala_id_fkey', 'READY_TO_CREATE', 'conteudo_travessias', 'sala_id', 'salas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing contos_clinicos_audio_padrao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'EXISTS', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') THEN
        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_SOURCE_TABLE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Table contos_clinicos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id') THEN
        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_SOURCE_COLUMN', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Column contos_clinicos.audio_padrao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_TARGET_TABLE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Table audio_assets not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'audio_assets' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_TARGET_COLUMN', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'TYPE_MISMATCH', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'audio_assets');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'READY_TO_CREATE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_TARGET_COLUMN', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Column audio_assets.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'TYPE_MISMATCH', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.audio_assets')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'TARGET_NOT_UNIQUE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'READY_TO_CREATE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing corpo_inconsciente_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'EXISTS', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente') THEN
        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Table corpo_inconsciente not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Column corpo_inconsciente.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'TYPE_MISMATCH', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'READY_TO_CREATE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'TYPE_MISMATCH', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('corpo_inconsciente_cliente_id_fkey', 'READY_TO_CREATE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_enrollments_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'EXISTS', 'course_enrollments', 'course_id', 'courses', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_enrollments') THEN
        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_enrollments', 'course_id', 'courses', 'id', 'Table course_enrollments not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_enrollments', 'course_id', 'courses', 'id', 'Column course_enrollments.course_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_enrollments', 'course_id', 'courses', 'id', 'Table courses not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'courses' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_enrollments', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'TYPE_MISMATCH', 'course_enrollments', 'course_id', 'courses', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'courses');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'READY_TO_CREATE', 'course_enrollments', 'course_id', 'courses', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_enrollments', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'TYPE_MISMATCH', 'course_enrollments', 'course_id', 'courses', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.courses')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_enrollments', 'course_id', 'courses', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_enrollments_course_id_fkey', 'READY_TO_CREATE', 'course_enrollments', 'course_id', 'courses', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_exercise_responses_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'EXISTS', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_exercise_responses') THEN
        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Table course_exercise_responses not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Column course_exercise_responses.lesson_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Table course_lessons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'course_lessons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Column course_lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'TYPE_MISMATCH', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'course_lessons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'READY_TO_CREATE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Column course_lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'TYPE_MISMATCH', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.course_lessons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_exercise_responses_lesson_id_fkey', 'READY_TO_CREATE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_lesson_progress_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'EXISTS', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lesson_progress') THEN
        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Table course_lesson_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Column course_lesson_progress.lesson_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Table course_lessons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'course_lessons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Column course_lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'course_lessons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'READY_TO_CREATE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Column course_lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.course_lessons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_lesson_progress_lesson_id_fkey', 'READY_TO_CREATE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_lessons_module_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'EXISTS', 'course_lessons', 'module_id', 'course_modules', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') THEN
        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'MISSING_SOURCE_TABLE', 'course_lessons', 'module_id', 'course_modules', 'id', 'Table course_lessons not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_lessons', 'module_id', 'course_modules', 'id', 'Column course_lessons.module_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'MISSING_TARGET_TABLE', 'course_lessons', 'module_id', 'course_modules', 'id', 'Table course_modules not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'course_modules' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lessons', 'module_id', 'course_modules', 'id', 'Column course_modules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'TYPE_MISMATCH', 'course_lessons', 'module_id', 'course_modules', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'course_modules');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'READY_TO_CREATE', 'course_lessons', 'module_id', 'course_modules', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lessons', 'module_id', 'course_modules', 'id', 'Column course_modules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'TYPE_MISMATCH', 'course_lessons', 'module_id', 'course_modules', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.course_modules')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'TARGET_NOT_UNIQUE', 'course_lessons', 'module_id', 'course_modules', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_lessons_module_id_fkey', 'READY_TO_CREATE', 'course_lessons', 'module_id', 'course_modules', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_module_forum_posts_module_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'EXISTS', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_SOURCE_TABLE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Table course_module_forum_posts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Column course_module_forum_posts.module_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_TARGET_TABLE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Table course_modules not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'course_modules' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Column course_modules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'course_modules');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Column course_modules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.course_modules')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'TARGET_NOT_UNIQUE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_module_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_module_forum_posts_parent_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'EXISTS', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_SOURCE_TABLE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Table course_module_forum_posts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Column course_module_forum_posts.parent_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_TARGET_TABLE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Table course_module_forum_posts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'course_module_forum_posts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Column course_module_forum_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'course_module_forum_posts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Column course_module_forum_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.course_module_forum_posts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'TARGET_NOT_UNIQUE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_module_forum_posts_parent_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_modules_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_modules_course_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'EXISTS', 'course_modules', 'course_id', 'courses', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') THEN
        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_modules', 'course_id', 'courses', 'id', 'Table course_modules not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_modules', 'course_id', 'courses', 'id', 'Column course_modules.course_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_modules', 'course_id', 'courses', 'id', 'Table courses not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'courses' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_modules', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'TYPE_MISMATCH', 'course_modules', 'course_id', 'courses', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'courses');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'READY_TO_CREATE', 'course_modules', 'course_id', 'courses', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_modules', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'TYPE_MISMATCH', 'course_modules', 'course_id', 'courses', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.courses')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_modules', 'course_id', 'courses', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_modules_course_id_fkey', 'READY_TO_CREATE', 'course_modules', 'course_id', 'courses', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_work_submissions_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'EXISTS', 'course_work_submissions', 'course_id', 'courses', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_work_submissions') THEN
        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_work_submissions', 'course_id', 'courses', 'id', 'Table course_work_submissions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id') THEN
        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_work_submissions', 'course_id', 'courses', 'id', 'Column course_work_submissions.course_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_work_submissions', 'course_id', 'courses', 'id', 'Table courses not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'courses' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_work_submissions', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'TYPE_MISMATCH', 'course_work_submissions', 'course_id', 'courses', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'courses');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'READY_TO_CREATE', 'course_work_submissions', 'course_id', 'courses', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_work_submissions', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'TYPE_MISMATCH', 'course_work_submissions', 'course_id', 'courses', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.courses')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_work_submissions', 'course_id', 'courses', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('course_work_submissions_course_id_fkey', 'READY_TO_CREATE', 'course_work_submissions', 'course_id', 'courses', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing courses_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_sala_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'EXISTS', 'courses', 'sala_id', 'salas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'courses', 'sala_id', 'salas', 'id', 'Table courses not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id') THEN
        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'courses', 'sala_id', 'salas', 'id', 'Column courses.sala_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'MISSING_TARGET_TABLE', 'courses', 'sala_id', 'salas', 'id', 'Table salas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'salas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'courses', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'TYPE_MISMATCH', 'courses', 'sala_id', 'salas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'salas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'READY_TO_CREATE', 'courses', 'sala_id', 'salas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'courses', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'TYPE_MISMATCH', 'courses', 'sala_id', 'salas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.salas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'courses', 'sala_id', 'salas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('courses_sala_id_fkey', 'READY_TO_CREATE', 'courses', 'sala_id', 'salas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing custom_oracle_cards_custom_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'EXISTS', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards') THEN
        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Table custom_oracle_cards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id') THEN
        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Column custom_oracle_cards.custom_oracle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Table custom_oracles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'custom_oracles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Column custom_oracles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'TYPE_MISMATCH', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'custom_oracles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'READY_TO_CREATE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Column custom_oracles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'TYPE_MISMATCH', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.custom_oracles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'READY_TO_CREATE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cycle_books_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'EXISTS', 'cycle_books', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'MISSING_SOURCE_TABLE', 'cycle_books', 'book_id', 'books', 'id', 'Table cycle_books not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'cycle_books', 'book_id', 'books', 'id', 'Column cycle_books.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'MISSING_TARGET_TABLE', 'cycle_books', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'TARGET_NOT_UNIQUE', 'cycle_books', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cycle_books_book_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cycle_books_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'EXISTS', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_SOURCE_TABLE', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Table cycle_books not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id') THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Column cycle_books.cycle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_TARGET_TABLE', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Table cycles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'cycles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Column cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'cycles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Column cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.cycles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'TARGET_NOT_UNIQUE', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('cycle_books_cycle_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'cycle_id', 'cycles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing decodificacao_onirica_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'EXISTS', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Table decodificacao_onirica not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Column decodificacao_onirica.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_cliente_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing decodificacao_onirica_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'EXISTS', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Table decodificacao_onirica not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Column decodificacao_onirica.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('decodificacao_onirica_session_case_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing diagnostico_ego_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diagnostico_ego_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'EXISTS', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'diagnostico_ego') THEN
        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Table diagnostico_ego not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Column diagnostico_ego.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'TYPE_MISMATCH', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'READY_TO_CREATE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'TYPE_MISMATCH', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('diagnostico_ego_cliente_id_fkey', 'READY_TO_CREATE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing district_state_changes_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'EXISTS', 'district_state_changes', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'MISSING_SOURCE_TABLE', 'district_state_changes', 'client_id', 'clientes', 'id', 'Table district_state_changes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'district_state_changes', 'client_id', 'clientes', 'id', 'Column district_state_changes.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'MISSING_TARGET_TABLE', 'district_state_changes', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'TARGET_NOT_UNIQUE', 'district_state_changes', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('district_state_changes_client_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing district_state_changes_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'EXISTS', 'district_state_changes', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'MISSING_SOURCE_TABLE', 'district_state_changes', 'district_id', 'districts', 'id', 'Table district_state_changes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'district_state_changes', 'district_id', 'districts', 'id', 'Column district_state_changes.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'MISSING_TARGET_TABLE', 'district_state_changes', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'TARGET_NOT_UNIQUE', 'district_state_changes', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('district_state_changes_district_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing dreams_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'EXISTS', 'dreams', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'MISSING_SOURCE_TABLE', 'dreams', 'client_id', 'clientes', 'id', 'Table dreams not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'dreams', 'client_id', 'clientes', 'id', 'Column dreams.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'MISSING_TARGET_TABLE', 'dreams', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'TYPE_MISMATCH', 'dreams', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'READY_TO_CREATE', 'dreams', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'TYPE_MISMATCH', 'dreams', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'TARGET_NOT_UNIQUE', 'dreams', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('dreams_client_id_fkey', 'READY_TO_CREATE', 'dreams', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing dreams_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'EXISTS', 'dreams', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'MISSING_SOURCE_TABLE', 'dreams', 'session_id', 'sessions', 'id', 'Table dreams not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'dreams', 'session_id', 'sessions', 'id', 'Column dreams.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'MISSING_TARGET_TABLE', 'dreams', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'TYPE_MISMATCH', 'dreams', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'READY_TO_CREATE', 'dreams', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'TYPE_MISMATCH', 'dreams', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'TARGET_NOT_UNIQUE', 'dreams', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('dreams_session_id_fkey', 'READY_TO_CREATE', 'dreams', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing email_logs_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'EXISTS', 'email_logs', 'user_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs') THEN
        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'MISSING_SOURCE_TABLE', 'email_logs', 'user_id', 'profiles', 'id', 'Table email_logs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id') THEN
        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'email_logs', 'user_id', 'profiles', 'id', 'Column email_logs.user_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'MISSING_TARGET_TABLE', 'email_logs', 'user_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'email_logs', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'TYPE_MISMATCH', 'email_logs', 'user_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'READY_TO_CREATE', 'email_logs', 'user_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'email_logs', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'TYPE_MISMATCH', 'email_logs', 'user_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'TARGET_NOT_UNIQUE', 'email_logs', 'user_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('email_logs_user_id_fkey', 'READY_TO_CREATE', 'email_logs', 'user_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_afirmacoes_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'EXISTS', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Table eneagrama_feminino_afirmacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_afirmacoes.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Table eneagrama_feminino_arquetipos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'eneagrama_feminino_arquetipos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'eneagrama_feminino_arquetipos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.eneagrama_feminino_arquetipos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_orientacoes_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'EXISTS', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Table eneagrama_feminino_orientacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_orientacoes.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Table eneagrama_feminino_arquetipos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'eneagrama_feminino_arquetipos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'eneagrama_feminino_arquetipos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Column eneagrama_feminino_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.eneagrama_feminino_arquetipos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'EXISTS', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Table eneagrama_feminino_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Column eneagrama_feminino_registros.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing escrita_nao_censurada_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escrita_nao_censurada_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'EXISTS', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada') THEN
        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Table escrita_nao_censurada not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Column escrita_nao_censurada.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'TYPE_MISMATCH', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'READY_TO_CREATE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'TYPE_MISMATCH', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'READY_TO_CREATE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing estudio_projetos_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'EXISTS', 'estudio_projetos', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudio_projetos') THEN
        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_SOURCE_TABLE', 'estudio_projetos', 'book_id', 'books', 'id', 'Table estudio_projetos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'estudio_projetos', 'book_id', 'books', 'id', 'Column estudio_projetos.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_TARGET_TABLE', 'estudio_projetos', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_TARGET_COLUMN', 'estudio_projetos', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'TYPE_MISMATCH', 'estudio_projetos', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'READY_TO_CREATE', 'estudio_projetos', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_TARGET_COLUMN', 'estudio_projetos', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'TYPE_MISMATCH', 'estudio_projetos', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'TARGET_NOT_UNIQUE', 'estudio_projetos', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('estudio_projetos_book_id_fkey', 'READY_TO_CREATE', 'estudio_projetos', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing estudos_caso_respostas_estudo_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'EXISTS', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Table estudos_caso_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id') THEN
        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Column estudos_caso_respostas.estudo_caso_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_TARGET_TABLE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Table estudos_caso not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'estudos_caso' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Column estudos_caso.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'TYPE_MISMATCH', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'estudos_caso');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'READY_TO_CREATE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Column estudos_caso.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'TYPE_MISMATCH', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.estudos_caso')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'READY_TO_CREATE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing exercise_responses_exercise_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_exercise_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'EXISTS', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_responses') THEN
        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_SOURCE_TABLE', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Table exercise_responses not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id') THEN
        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_SOURCE_COLUMN', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Column exercise_responses.exercise_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_TARGET_TABLE', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Table exercises not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'exercises' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_TARGET_COLUMN', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Column exercises.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'TYPE_MISMATCH', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'exercises');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'READY_TO_CREATE', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_TARGET_COLUMN', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Column exercises.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'TYPE_MISMATCH', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.exercises')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'TARGET_NOT_UNIQUE', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('exercise_responses_exercise_id_fkey', 'READY_TO_CREATE', 'exercise_responses', 'exercise_id', 'exercises', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing exercises_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercises_lesson_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'EXISTS', 'exercises', 'lesson_id', 'lessons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') THEN
        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'exercises', 'lesson_id', 'lessons', 'id', 'Table exercises not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id') THEN
        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'exercises', 'lesson_id', 'lessons', 'id', 'Column exercises.lesson_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'exercises', 'lesson_id', 'lessons', 'id', 'Table lessons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'lessons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'exercises', 'lesson_id', 'lessons', 'id', 'Column lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'TYPE_MISMATCH', 'exercises', 'lesson_id', 'lessons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'lessons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'READY_TO_CREATE', 'exercises', 'lesson_id', 'lessons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'exercises', 'lesson_id', 'lessons', 'id', 'Column lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'TYPE_MISMATCH', 'exercises', 'lesson_id', 'lessons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.lessons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'exercises', 'lesson_id', 'lessons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('exercises_lesson_id_fkey', 'READY_TO_CREATE', 'exercises', 'lesson_id', 'lessons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ferramenta_registros_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'EXISTS', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Table ferramenta_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Column ferramenta_registros.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_cliente_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ferramenta_registros_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'EXISTS', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Table ferramenta_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id') THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Column ferramenta_registros.ferramenta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sala_ferramentas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sala_ferramentas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing fk_big5_caso
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'EXISTS', 'big5_registros', 'caso_id', 'casos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_registros') THEN
        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'MISSING_SOURCE_TABLE', 'big5_registros', 'caso_id', 'casos', 'id', 'Table big5_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id') THEN
        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'MISSING_SOURCE_COLUMN', 'big5_registros', 'caso_id', 'casos', 'id', 'Column big5_registros.caso_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'MISSING_TARGET_TABLE', 'big5_registros', 'caso_id', 'casos', 'id', 'Table casos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'casos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'MISSING_TARGET_COLUMN', 'big5_registros', 'caso_id', 'casos', 'id', 'Column casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'TYPE_MISMATCH', 'big5_registros', 'caso_id', 'casos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'casos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'READY_TO_CREATE', 'big5_registros', 'caso_id', 'casos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'MISSING_TARGET_COLUMN', 'big5_registros', 'caso_id', 'casos', 'id', 'Column casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'TYPE_MISMATCH', 'big5_registros', 'caso_id', 'casos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.casos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'TARGET_NOT_UNIQUE', 'big5_registros', 'caso_id', 'casos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('fk_big5_caso', 'READY_TO_CREATE', 'big5_registros', 'caso_id', 'casos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing fk_eneagrama_caso
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'EXISTS', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_registros') THEN
        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'MISSING_SOURCE_TABLE', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Table eneagrama_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id') THEN
        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'MISSING_SOURCE_COLUMN', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Column eneagrama_registros.caso_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'MISSING_TARGET_TABLE', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Table casos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'casos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'MISSING_TARGET_COLUMN', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Column casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'TYPE_MISMATCH', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'casos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'READY_TO_CREATE', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'MISSING_TARGET_COLUMN', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Column casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'TYPE_MISMATCH', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.casos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'TARGET_NOT_UNIQUE', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('fk_eneagrama_caso', 'READY_TO_CREATE', 'eneagrama_registros', 'caso_id', 'casos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing formacao_modulos_formacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'EXISTS', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') THEN
        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_SOURCE_TABLE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Table formacao_modulos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Column formacao_modulos.formacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_TARGET_TABLE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Table formacoes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'formacoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Column formacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'TYPE_MISMATCH', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'formacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'READY_TO_CREATE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Column formacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'TYPE_MISMATCH', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.formacoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'TARGET_NOT_UNIQUE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('formacao_modulos_formacao_id_fkey', 'READY_TO_CREATE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing founding_archetypes_distrito_principal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'founding_archetypes_distrito_principal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'EXISTS', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') THEN
        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_SOURCE_TABLE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Table founding_archetypes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id') THEN
        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_SOURCE_COLUMN', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Column founding_archetypes.distrito_principal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_TARGET_TABLE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Table city_districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'city_districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'TYPE_MISMATCH', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'city_districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'READY_TO_CREATE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'TYPE_MISMATCH', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.city_districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'TARGET_NOT_UNIQUE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'READY_TO_CREATE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing gestos_integracao_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'EXISTS', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Table gestos_integracao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Column gestos_integracao.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('gestos_integracao_cliente_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing gestos_integracao_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'EXISTS', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Table gestos_integracao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column gestos_integracao.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Table sessoes_casa_maquinas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessoes_casa_maquinas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column sessoes_casa_maquinas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessoes_casa_maquinas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column sessoes_casa_maquinas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessoes_casa_maquinas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('gestos_integracao_sessao_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_encounters_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'EXISTS', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_encounters') THEN
        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Table group_encounters not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Column group_encounters.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Table therapy_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapy_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Column therapy_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'TYPE_MISMATCH', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapy_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'READY_TO_CREATE', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Column therapy_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'TYPE_MISMATCH', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.therapy_groups')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_encounters_group_id_fkey', 'READY_TO_CREATE', 'group_encounters', 'group_id', 'therapy_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_field_snapshots_circulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'EXISTS', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_SOURCE_TABLE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Table group_field_snapshots not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Column group_field_snapshots.circulo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'circulos_sagrados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_TARGET_TABLE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Table circulos_sagrados not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'circulos_sagrados' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Column circulos_sagrados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'circulos_sagrados');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Column circulos_sagrados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.circulos_sagrados')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'TARGET_NOT_UNIQUE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_circulo_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_field_snapshots_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'EXISTS', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Table group_field_snapshots not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Column group_field_snapshots.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Table therapeutic_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapeutic_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapeutic_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_field_snapshots_group_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_members_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'EXISTS', 'group_members', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'MISSING_SOURCE_TABLE', 'group_members', 'client_id', 'clientes', 'id', 'Table group_members not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_members', 'client_id', 'clientes', 'id', 'Column group_members.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'MISSING_TARGET_TABLE', 'group_members', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'TYPE_MISMATCH', 'group_members', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'READY_TO_CREATE', 'group_members', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'TYPE_MISMATCH', 'group_members', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'TARGET_NOT_UNIQUE', 'group_members', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_members_client_id_fkey', 'READY_TO_CREATE', 'group_members', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_members_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'EXISTS', 'group_members', 'group_id', 'therapy_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_members', 'group_id', 'therapy_groups', 'id', 'Table group_members not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_members', 'group_id', 'therapy_groups', 'id', 'Column group_members.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_members', 'group_id', 'therapy_groups', 'id', 'Table therapy_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapy_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'group_id', 'therapy_groups', 'id', 'Column therapy_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'TYPE_MISMATCH', 'group_members', 'group_id', 'therapy_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapy_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'READY_TO_CREATE', 'group_members', 'group_id', 'therapy_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'group_id', 'therapy_groups', 'id', 'Column therapy_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'TYPE_MISMATCH', 'group_members', 'group_id', 'therapy_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.therapy_groups')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_members', 'group_id', 'therapy_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_members_group_id_fkey', 'READY_TO_CREATE', 'group_members', 'group_id', 'therapy_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_participants_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'EXISTS', 'group_participants', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'group_participants', 'cliente_id', 'clientes', 'id', 'Table group_participants not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_participants', 'cliente_id', 'clientes', 'id', 'Column group_participants.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'group_participants', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'READY_TO_CREATE', 'group_participants', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'group_participants', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_participants_cliente_id_fkey', 'READY_TO_CREATE', 'group_participants', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_participants_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'EXISTS', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Table group_participants not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Column group_participants.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Table therapeutic_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapeutic_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapeutic_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'READY_TO_CREATE', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_participants_group_id_fkey', 'READY_TO_CREATE', 'group_participants', 'group_id', 'therapeutic_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

-- Retornar resultados tabulares
SELECT * FROM diagnostic_results ORDER BY constraint_name;

-- Retornar resumo por status
SELECT status, COUNT(*) AS total
FROM diagnostic_results
GROUP BY status
ORDER BY status;
