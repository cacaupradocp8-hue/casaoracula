
CREATE TEMP TABLE results (name TEXT, status TEXT, source_table TEXT, source_column TEXT, target_table TEXT, target_column TEXT);
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing co_escutas_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'EXISTS', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') THEN
        INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_escutas_sessao_id_fkey', 'READY_TO_CREATE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_garden_flowers_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'EXISTS', 'co_garden_flowers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_garden_flowers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_garden_flowers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_garden_flowers', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_garden_flowers', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_garden_flowers_client_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_garden_flowers_origem_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'EXISTS', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id') THEN
        INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
          AND NOT ('co_journey_records' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_TARGET_TABLE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_journey_records' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_journey_records') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_jardim_entries_jardim_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_jardim_id_fkey') THEN
        INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'EXISTS', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') THEN
        INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_SOURCE_TABLE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id') THEN
        INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_TARGET_TABLE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'TYPE_MISMATCH', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'TARGET_NOT_UNIQUE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_jardim_entries_jardim_id_fkey', 'READY_TO_CREATE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_journey_records_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'EXISTS', 'co_journey_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_journey_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_journey_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_journey_records', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_journey_records', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_journey_records_client_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_journey_records_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'EXISTS', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
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
                    INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_journey_records_tool_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_orientacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
          AND NOT ('co_orientacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_orientacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_orientacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacoes_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'EXISTS', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_orientacoes_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacoes_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'EXISTS', 'co_orientacoes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacoes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacoes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacoes', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacoes', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_orientacoes_session_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_passport_entries_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'EXISTS', 'co_passport_entries', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_passport_entries') THEN
        INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_passport_entries', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_passport_entries', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_passport_entries', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_passport_entries', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'TYPE_MISMATCH', 'co_passport_entries', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_passport_entries', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_passport_entries_client_id_fkey', 'READY_TO_CREATE', 'co_passport_entries', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_praticas_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'EXISTS', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') THEN
        INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_praticas_sessao_id_fkey', 'READY_TO_CREATE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_registros_simbolicos_jardim_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_jardim_id_fkey') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'EXISTS', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_SOURCE_TABLE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_TARGET_TABLE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'TARGET_NOT_UNIQUE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_registros_simbolicos_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'EXISTS', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('co_sessoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sessoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sessoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sessoes_jardim_ref_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_jardim_ref_id_fkey') THEN
        INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'EXISTS', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') THEN
        INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id') THEN
        INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('co_jardins' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_TARGET_TABLE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'TYPE_MISMATCH', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_jardins' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_jardins') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sessoes_jardim_ref_id_fkey', 'READY_TO_CREATE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_options_proximo_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_proximo_step_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'EXISTS', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id') THEN
        INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_options_proximo_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_options_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'EXISTS', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id') THEN
        INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_options_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'EXISTS', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('co_sim_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_progress_case_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_escolha_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'EXISTS', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id') THEN
        INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
          AND NOT ('co_sim_options' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_options' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_options') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_progress_escolha_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'EXISTS', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id') THEN
        INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('co_sim_steps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_steps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_steps') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_progress_step_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_steps_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'EXISTS', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') THEN
        INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('co_sim_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_sim_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_sim_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_sim_steps_case_id_fkey', 'READY_TO_CREATE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_flows_tool_destino_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_destino_id_fkey') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'EXISTS', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_tool_flows_tool_destino_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_flows_tool_origem_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'EXISTS', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id') THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_tool_flows_tool_origem_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_usage_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'EXISTS', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_usage') THEN
        INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'TYPE_MISMATCH', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
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
                    INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_tool_usage_tool_id_fkey', 'READY_TO_CREATE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_attempts_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'EXISTS', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') THEN
        INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'TYPE_MISMATCH', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_training_attempts_case_id_fkey', 'READY_TO_CREATE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_feedbacks_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'EXISTS', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks') THEN
        INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_training_case_feedbacks_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_possible_readings_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'EXISTS', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings') THEN
        INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_training_case_possible_readings_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_signals_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'EXISTS', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_signals') THEN
        INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_training_case_signals_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_progress_ultimo_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'EXISTS', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') THEN
        INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id') THEN
        INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('co_training_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'TYPE_MISMATCH', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_training_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_training_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_training_progress_ultimo_case_id_fkey', 'READY_TO_CREATE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_encontros_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_fkey') THEN
        INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'EXISTS', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') THEN
        INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id') THEN
        INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('co_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_travessia_encontros_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_respostas_encontro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'EXISTS', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') 
          AND NOT ('co_travessia_encontros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_travessia_encontros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessia_encontros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_travessia_respostas_encontro_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_respostas_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'EXISTS', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id') THEN
        INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('co_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'co_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('co_travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_travessia_respostas_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_workspace_users_workspace_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_fkey') THEN
        INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'EXISTS', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspace_users') THEN
        INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_SOURCE_TABLE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id') THEN
        INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('co_workspaces' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_TARGET_TABLE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'TYPE_MISMATCH', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
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
                    INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'TARGET_NOT_UNIQUE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
                ELSE
                    INSERT INTO results VALUES ('co_workspace_users_workspace_id_fkey', 'READY_TO_CREATE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_bed_entries_bed_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_bed_id_fkey') THEN
        INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'EXISTS', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id') THEN
        INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') 
          AND NOT ('collective_beds' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_TARGET_TABLE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'collective_beds' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('collective_beds') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
                ELSE
                    INSERT INTO results VALUES ('collective_bed_entries_bed_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_bed_entries_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'EXISTS', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id') THEN
        INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_TARGET_TABLE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
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
                    INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('collective_bed_entries_season_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_beds_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_beds_season_id_fkey') THEN
        INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'EXISTS', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') THEN
        INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id') THEN
        INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'MISSING_TARGET_TABLE', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'TYPE_MISMATCH', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
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
                    INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('collective_beds_season_id_fkey', 'READY_TO_CREATE', 'collective_beds', 'season_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_comments_post_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_post_id_fkey') THEN
        INSERT INTO results VALUES ('community_comments_post_id_fkey', 'EXISTS', 'community_comments', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') THEN
        INSERT INTO results VALUES ('community_comments_post_id_fkey', 'MISSING_SOURCE_TABLE', 'community_comments', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id') THEN
        INSERT INTO results VALUES ('community_comments_post_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_comments', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('community_posts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_comments_post_id_fkey', 'MISSING_TARGET_TABLE', 'community_comments', 'post_id', 'community_posts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_comments_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_comments', 'post_id', 'community_posts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_comments_post_id_fkey', 'TYPE_MISMATCH', 'community_comments', 'post_id', 'community_posts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_posts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_posts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_comments_post_id_fkey', 'TARGET_NOT_UNIQUE', 'community_comments', 'post_id', 'community_posts', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_comments_post_id_fkey', 'READY_TO_CREATE', 'community_comments', 'post_id', 'community_posts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_event_participants_event_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'EXISTS', 'community_event_participants', 'event_id', 'community_events', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') THEN
        INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'MISSING_SOURCE_TABLE', 'community_event_participants', 'event_id', 'community_events', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id') THEN
        INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_event_participants', 'event_id', 'community_events', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_events') 
          AND NOT ('community_events' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'MISSING_TARGET_TABLE', 'community_event_participants', 'event_id', 'community_events', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'MISSING_TARGET_COLUMN', 'community_event_participants', 'event_id', 'community_events', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'TYPE_MISMATCH', 'community_event_participants', 'event_id', 'community_events', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_events' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_events') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'TARGET_NOT_UNIQUE', 'community_event_participants', 'event_id', 'community_events', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_event_participants_event_id_fkey', 'READY_TO_CREATE', 'community_event_participants', 'event_id', 'community_events', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_group_members_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_group_id_fkey') THEN
        INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'EXISTS', 'community_group_members', 'group_id', 'community_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_group_members') THEN
        INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'MISSING_SOURCE_TABLE', 'community_group_members', 'group_id', 'community_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_group_members', 'group_id', 'community_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_groups') 
          AND NOT ('community_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'MISSING_TARGET_TABLE', 'community_group_members', 'group_id', 'community_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'community_group_members', 'group_id', 'community_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'TYPE_MISMATCH', 'community_group_members', 'group_id', 'community_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'TARGET_NOT_UNIQUE', 'community_group_members', 'group_id', 'community_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_group_members_group_id_fkey', 'READY_TO_CREATE', 'community_group_members', 'group_id', 'community_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_likes_post_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_post_id_fkey') THEN
        INSERT INTO results VALUES ('community_likes_post_id_fkey', 'EXISTS', 'community_likes', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_likes') THEN
        INSERT INTO results VALUES ('community_likes_post_id_fkey', 'MISSING_SOURCE_TABLE', 'community_likes', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id') THEN
        INSERT INTO results VALUES ('community_likes_post_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_likes', 'post_id', 'community_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('community_posts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_likes_post_id_fkey', 'MISSING_TARGET_TABLE', 'community_likes', 'post_id', 'community_posts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_likes_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_likes', 'post_id', 'community_posts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_likes_post_id_fkey', 'TYPE_MISMATCH', 'community_likes', 'post_id', 'community_posts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_posts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_posts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_likes_post_id_fkey', 'TARGET_NOT_UNIQUE', 'community_likes', 'post_id', 'community_posts', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_likes_post_id_fkey', 'READY_TO_CREATE', 'community_likes', 'post_id', 'community_posts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_topic_replies_topic_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topic_replies_topic_id_fkey') THEN
        INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'EXISTS', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topic_replies') THEN
        INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_SOURCE_TABLE', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id') THEN
        INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
          AND NOT ('community_topics' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_TARGET_TABLE', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'TYPE_MISMATCH', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_topics' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_topics') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'TARGET_NOT_UNIQUE', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_topic_replies_topic_id_fkey', 'READY_TO_CREATE', 'community_topic_replies', 'topic_id', 'community_topics', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_topics_forum_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_forum_id_fkey') THEN
        INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'EXISTS', 'community_topics', 'forum_id', 'community_forums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') THEN
        INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'MISSING_SOURCE_TABLE', 'community_topics', 'forum_id', 'community_forums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id') THEN
        INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_topics', 'forum_id', 'community_forums', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_forums') 
          AND NOT ('community_forums' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'MISSING_TARGET_TABLE', 'community_topics', 'forum_id', 'community_forums', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topics', 'forum_id', 'community_forums', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'TYPE_MISMATCH', 'community_topics', 'forum_id', 'community_forums', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'community_forums' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('community_forums') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'TARGET_NOT_UNIQUE', 'community_topics', 'forum_id', 'community_forums', 'id');
                ELSE
                    INSERT INTO results VALUES ('community_topics_forum_id_fkey', 'READY_TO_CREATE', 'community_topics', 'forum_id', 'community_forums', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conselho_partes_internas_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'EXISTS', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas') THEN
        INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_SOURCE_TABLE', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_TARGET_TABLE', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'TYPE_MISMATCH', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'TARGET_NOT_UNIQUE', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('conselho_partes_internas_client_id_fkey', 'READY_TO_CREATE', 'conselho_partes_internas', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing content_blocks_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'EXISTS', 'content_blocks', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') THEN
        INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'content_blocks', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id') THEN
        INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'content_blocks', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'MISSING_TARGET_TABLE', 'content_blocks', 'agente_id', 'agentes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'content_blocks', 'agente_id', 'agentes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'TYPE_MISMATCH', 'content_blocks', 'agente_id', 'agentes', 'id');
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
                    INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'content_blocks', 'agente_id', 'agentes', 'id');
                ELSE
                    INSERT INTO results VALUES ('content_blocks_agente_id_fkey', 'READY_TO_CREATE', 'content_blocks', 'agente_id', 'agentes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conteudo_aulas_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'EXISTS', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') THEN
        INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id') THEN
        INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('conteudo_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'TYPE_MISMATCH', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'conteudo_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('conteudo_aulas_travessia_id_fkey', 'READY_TO_CREATE', 'conteudo_aulas', 'travessia_id', 'conteudo_travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conteudo_travessias_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'EXISTS', 'conteudo_travessias', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') THEN
        INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'conteudo_travessias', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id') THEN
        INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'conteudo_travessias', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_TARGET_TABLE', 'conteudo_travessias', 'sala_id', 'salas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'conteudo_travessias', 'sala_id', 'salas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'TYPE_MISMATCH', 'conteudo_travessias', 'sala_id', 'salas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'salas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('salas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'conteudo_travessias', 'sala_id', 'salas', 'id');
                ELSE
                    INSERT INTO results VALUES ('conteudo_travessias_sala_id_fkey', 'READY_TO_CREATE', 'conteudo_travessias', 'sala_id', 'salas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing contos_clinicos_audio_padrao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'EXISTS', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') THEN
        INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_SOURCE_TABLE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id') THEN
        INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_SOURCE_COLUMN', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_TARGET_TABLE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'MISSING_TARGET_COLUMN', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'TYPE_MISMATCH', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'audio_assets' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('audio_assets') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'TARGET_NOT_UNIQUE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
                ELSE
                    INSERT INTO results VALUES ('contos_clinicos_audio_padrao_id_fkey', 'READY_TO_CREATE', 'contos_clinicos', 'audio_padrao_id', 'audio_assets', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing corpo_inconsciente_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'EXISTS', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente') THEN
        INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'TYPE_MISMATCH', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('corpo_inconsciente_cliente_id_fkey', 'READY_TO_CREATE', 'corpo_inconsciente', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_enrollments_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'EXISTS', 'course_enrollments', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_enrollments') THEN
        INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_enrollments', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id') THEN
        INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_enrollments', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('courses' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_enrollments', 'course_id', 'courses', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_enrollments', 'course_id', 'courses', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'TYPE_MISMATCH', 'course_enrollments', 'course_id', 'courses', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'courses' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('courses') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_enrollments', 'course_id', 'courses', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_enrollments_course_id_fkey', 'READY_TO_CREATE', 'course_enrollments', 'course_id', 'courses', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_exercise_responses_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_exercise_responses_lesson_id_fkey') THEN
        INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'EXISTS', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_exercise_responses') THEN
        INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id') THEN
        INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('course_lessons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_exercise_responses' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'TYPE_MISMATCH', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'course_lessons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('course_lessons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_exercise_responses_lesson_id_fkey', 'READY_TO_CREATE', 'course_exercise_responses', 'lesson_id', 'course_lessons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_lesson_progress_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lesson_progress_lesson_id_fkey') THEN
        INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'EXISTS', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lesson_progress') THEN
        INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id') THEN
        INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') 
          AND NOT ('course_lessons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lesson_progress' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'course_lessons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('course_lessons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_lesson_progress_lesson_id_fkey', 'READY_TO_CREATE', 'course_lesson_progress', 'lesson_id', 'course_lessons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_lessons_module_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_lessons_module_id_fkey') THEN
        INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'EXISTS', 'course_lessons', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_lessons') THEN
        INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'MISSING_SOURCE_TABLE', 'course_lessons', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id') THEN
        INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_lessons', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('course_modules' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'MISSING_TARGET_TABLE', 'course_lessons', 'module_id', 'course_modules', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_lessons', 'module_id', 'course_modules', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_lessons' AND column_name = 'module_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'TYPE_MISMATCH', 'course_lessons', 'module_id', 'course_modules', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'course_modules' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('course_modules') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'TARGET_NOT_UNIQUE', 'course_lessons', 'module_id', 'course_modules', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_lessons_module_id_fkey', 'READY_TO_CREATE', 'course_lessons', 'module_id', 'course_modules', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_module_forum_posts_module_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_module_id_fkey') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'EXISTS', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_SOURCE_TABLE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') 
          AND NOT ('course_modules' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_TARGET_TABLE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'module_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'course_modules' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('course_modules') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'TARGET_NOT_UNIQUE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_module_forum_posts_module_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'module_id', 'course_modules', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_module_forum_posts_parent_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_module_forum_posts_parent_id_fkey') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'EXISTS', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_SOURCE_TABLE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id') THEN
        INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts') 
          AND NOT ('course_module_forum_posts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_TARGET_TABLE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'parent_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_module_forum_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'TYPE_MISMATCH', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'course_module_forum_posts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('course_module_forum_posts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'TARGET_NOT_UNIQUE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_module_forum_posts_parent_id_fkey', 'READY_TO_CREATE', 'course_module_forum_posts', 'parent_id', 'course_module_forum_posts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_modules_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_modules_course_id_fkey') THEN
        INSERT INTO results VALUES ('course_modules_course_id_fkey', 'EXISTS', 'course_modules', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_modules') THEN
        INSERT INTO results VALUES ('course_modules_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_modules', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id') THEN
        INSERT INTO results VALUES ('course_modules_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_modules', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('courses' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_modules_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_modules', 'course_id', 'courses', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_modules_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_modules', 'course_id', 'courses', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_modules' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_modules_course_id_fkey', 'TYPE_MISMATCH', 'course_modules', 'course_id', 'courses', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'courses' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('courses') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_modules_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_modules', 'course_id', 'courses', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_modules_course_id_fkey', 'READY_TO_CREATE', 'course_modules', 'course_id', 'courses', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing course_work_submissions_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_work_submissions_course_id_fkey') THEN
        INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'EXISTS', 'course_work_submissions', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_work_submissions') THEN
        INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_SOURCE_TABLE', 'course_work_submissions', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id') THEN
        INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'course_work_submissions', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('courses' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_TARGET_TABLE', 'course_work_submissions', 'course_id', 'courses', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'MISSING_TARGET_COLUMN', 'course_work_submissions', 'course_id', 'courses', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_work_submissions' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'TYPE_MISMATCH', 'course_work_submissions', 'course_id', 'courses', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'courses' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('courses') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'TARGET_NOT_UNIQUE', 'course_work_submissions', 'course_id', 'courses', 'id');
                ELSE
                    INSERT INTO results VALUES ('course_work_submissions_course_id_fkey', 'READY_TO_CREATE', 'course_work_submissions', 'course_id', 'courses', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing courses_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'courses_sala_id_fkey') THEN
        INSERT INTO results VALUES ('courses_sala_id_fkey', 'EXISTS', 'courses', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        INSERT INTO results VALUES ('courses_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'courses', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id') THEN
        INSERT INTO results VALUES ('courses_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'courses', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('courses_sala_id_fkey', 'MISSING_TARGET_TABLE', 'courses', 'sala_id', 'salas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('courses_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'courses', 'sala_id', 'salas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('courses_sala_id_fkey', 'TYPE_MISMATCH', 'courses', 'sala_id', 'salas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'salas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('salas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('courses_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'courses', 'sala_id', 'salas', 'id');
                ELSE
                    INSERT INTO results VALUES ('courses_sala_id_fkey', 'READY_TO_CREATE', 'courses', 'sala_id', 'salas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing custom_oracle_cards_custom_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'custom_oracle_cards_custom_oracle_id_fkey') THEN
        INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'EXISTS', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards') THEN
        INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id') THEN
        INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'custom_oracles') 
          AND NOT ('custom_oracles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracle_cards' AND column_name = 'custom_oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'custom_oracles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'TYPE_MISMATCH', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'custom_oracles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('custom_oracles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
                ELSE
                    INSERT INTO results VALUES ('custom_oracle_cards_custom_oracle_id_fkey', 'READY_TO_CREATE', 'custom_oracle_cards', 'custom_oracle_id', 'custom_oracles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cycle_books_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_book_id_fkey') THEN
        INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'EXISTS', 'cycle_books', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'MISSING_SOURCE_TABLE', 'cycle_books', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'cycle_books', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'MISSING_TARGET_TABLE', 'cycle_books', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'book_id', 'books', 'id');
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
                    INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'TARGET_NOT_UNIQUE', 'cycle_books', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('cycle_books_book_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing cycle_books_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cycle_books_cycle_id_fkey') THEN
        INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'EXISTS', 'cycle_books', 'cycle_id', 'cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycle_books') THEN
        INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_SOURCE_TABLE', 'cycle_books', 'cycle_id', 'cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id') THEN
        INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', 'cycle_books', 'cycle_id', 'cycles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cycles') 
          AND NOT ('cycles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_TARGET_TABLE', 'cycle_books', 'cycle_id', 'cycles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', 'cycle_books', 'cycle_id', 'cycles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycle_books' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'TYPE_MISMATCH', 'cycle_books', 'cycle_id', 'cycles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'cycles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cycles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'TARGET_NOT_UNIQUE', 'cycle_books', 'cycle_id', 'cycles', 'id');
                ELSE
                    INSERT INTO results VALUES ('cycle_books_cycle_id_fkey', 'READY_TO_CREATE', 'cycle_books', 'cycle_id', 'cycles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing decodificacao_onirica_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'EXISTS', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('decodificacao_onirica_cliente_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing decodificacao_onirica_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'decodificacao_onirica_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'EXISTS', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'decodificacao_onirica' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'TYPE_MISMATCH', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('decodificacao_onirica_session_case_id_fkey', 'READY_TO_CREATE', 'decodificacao_onirica', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing diagnostico_ego_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diagnostico_ego_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'EXISTS', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'diagnostico_ego') THEN
        INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'diagnostico_ego' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'TYPE_MISMATCH', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('diagnostico_ego_cliente_id_fkey', 'READY_TO_CREATE', 'diagnostico_ego', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing district_state_changes_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_client_id_fkey') THEN
        INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'EXISTS', 'district_state_changes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'MISSING_SOURCE_TABLE', 'district_state_changes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'district_state_changes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'MISSING_TARGET_TABLE', 'district_state_changes', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'TARGET_NOT_UNIQUE', 'district_state_changes', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('district_state_changes_client_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing district_state_changes_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'district_state_changes_district_id_fkey') THEN
        INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'EXISTS', 'district_state_changes', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'district_state_changes') THEN
        INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'MISSING_SOURCE_TABLE', 'district_state_changes', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'district_state_changes', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'MISSING_TARGET_TABLE', 'district_state_changes', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'MISSING_TARGET_COLUMN', 'district_state_changes', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'district_state_changes' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'TYPE_MISMATCH', 'district_state_changes', 'district_id', 'districts', 'id');
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
                    INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'TARGET_NOT_UNIQUE', 'district_state_changes', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('district_state_changes_district_id_fkey', 'READY_TO_CREATE', 'district_state_changes', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing dreams_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_client_id_fkey') THEN
        INSERT INTO results VALUES ('dreams_client_id_fkey', 'EXISTS', 'dreams', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        INSERT INTO results VALUES ('dreams_client_id_fkey', 'MISSING_SOURCE_TABLE', 'dreams', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('dreams_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'dreams', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('dreams_client_id_fkey', 'MISSING_TARGET_TABLE', 'dreams', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('dreams_client_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('dreams_client_id_fkey', 'TYPE_MISMATCH', 'dreams', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('dreams_client_id_fkey', 'TARGET_NOT_UNIQUE', 'dreams', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('dreams_client_id_fkey', 'READY_TO_CREATE', 'dreams', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing dreams_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dreams_session_id_fkey') THEN
        INSERT INTO results VALUES ('dreams_session_id_fkey', 'EXISTS', 'dreams', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dreams') THEN
        INSERT INTO results VALUES ('dreams_session_id_fkey', 'MISSING_SOURCE_TABLE', 'dreams', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('dreams_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'dreams', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('dreams_session_id_fkey', 'MISSING_TARGET_TABLE', 'dreams', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('dreams_session_id_fkey', 'MISSING_TARGET_COLUMN', 'dreams', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'dreams' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('dreams_session_id_fkey', 'TYPE_MISMATCH', 'dreams', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('dreams_session_id_fkey', 'TARGET_NOT_UNIQUE', 'dreams', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('dreams_session_id_fkey', 'READY_TO_CREATE', 'dreams', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing email_logs_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'email_logs_user_id_fkey') THEN
        INSERT INTO results VALUES ('email_logs_user_id_fkey', 'EXISTS', 'email_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'email_logs') THEN
        INSERT INTO results VALUES ('email_logs_user_id_fkey', 'MISSING_SOURCE_TABLE', 'email_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id') THEN
        INSERT INTO results VALUES ('email_logs_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'email_logs', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('email_logs_user_id_fkey', 'MISSING_TARGET_TABLE', 'email_logs', 'user_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('email_logs_user_id_fkey', 'MISSING_TARGET_COLUMN', 'email_logs', 'user_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'email_logs' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('email_logs_user_id_fkey', 'TYPE_MISMATCH', 'email_logs', 'user_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('email_logs_user_id_fkey', 'TARGET_NOT_UNIQUE', 'email_logs', 'user_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('email_logs_user_id_fkey', 'READY_TO_CREATE', 'email_logs', 'user_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_afirmacoes_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_afirmacoes_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'EXISTS', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('eneagrama_feminino_arquetipos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_afirmacoes' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'eneagrama_feminino_arquetipos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('eneagrama_feminino_arquetipos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
                ELSE
                    INSERT INTO results VALUES ('eneagrama_feminino_afirmacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_afirmacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_orientacoes_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_orientacoes_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'EXISTS', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos') 
          AND NOT ('eneagrama_feminino_arquetipos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_orientacoes' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'eneagrama_feminino_arquetipos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('eneagrama_feminino_arquetipos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
                ELSE
                    INSERT INTO results VALUES ('eneagrama_feminino_orientacoes_arquetipo_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_orientacoes', 'arquetipo_id', 'eneagrama_feminino_arquetipos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing eneagrama_feminino_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eneagrama_feminino_registros_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'EXISTS', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('eneagrama_feminino_registros_session_case_id_fkey', 'READY_TO_CREATE', 'eneagrama_feminino_registros', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing escrita_nao_censurada_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'escrita_nao_censurada_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'EXISTS', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada') THEN
        INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'escrita_nao_censurada' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'TYPE_MISMATCH', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('escrita_nao_censurada_cliente_id_fkey', 'READY_TO_CREATE', 'escrita_nao_censurada', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing estudio_projetos_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudio_projetos_book_id_fkey') THEN
        INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'EXISTS', 'estudio_projetos', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudio_projetos') THEN
        INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_SOURCE_TABLE', 'estudio_projetos', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'estudio_projetos', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_TARGET_TABLE', 'estudio_projetos', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'MISSING_TARGET_COLUMN', 'estudio_projetos', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudio_projetos' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'TYPE_MISMATCH', 'estudio_projetos', 'book_id', 'books', 'id');
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
                    INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'TARGET_NOT_UNIQUE', 'estudio_projetos', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('estudio_projetos_book_id_fkey', 'READY_TO_CREATE', 'estudio_projetos', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing estudos_caso_respostas_estudo_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'estudos_caso_respostas_estudo_caso_id_fkey') THEN
        INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'EXISTS', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas') THEN
        INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id') THEN
        INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'estudos_caso') 
          AND NOT ('estudos_caso' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_TARGET_TABLE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso_respostas' AND column_name = 'estudo_caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'estudos_caso' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'TYPE_MISMATCH', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'estudos_caso' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('estudos_caso') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
                ELSE
                    INSERT INTO results VALUES ('estudos_caso_respostas_estudo_caso_id_fkey', 'READY_TO_CREATE', 'estudos_caso_respostas', 'estudo_caso_id', 'estudos_caso', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing exercise_responses_exercise_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercise_responses_exercise_id_fkey') THEN
        INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'EXISTS', 'exercise_responses', 'exercise_id', 'exercises', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercise_responses') THEN
        INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_SOURCE_TABLE', 'exercise_responses', 'exercise_id', 'exercises', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id') THEN
        INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_SOURCE_COLUMN', 'exercise_responses', 'exercise_id', 'exercises', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') 
          AND NOT ('exercises' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_TARGET_TABLE', 'exercise_responses', 'exercise_id', 'exercises', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'MISSING_TARGET_COLUMN', 'exercise_responses', 'exercise_id', 'exercises', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercise_responses' AND column_name = 'exercise_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'TYPE_MISMATCH', 'exercise_responses', 'exercise_id', 'exercises', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'exercises' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('exercises') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'TARGET_NOT_UNIQUE', 'exercise_responses', 'exercise_id', 'exercises', 'id');
                ELSE
                    INSERT INTO results VALUES ('exercise_responses_exercise_id_fkey', 'READY_TO_CREATE', 'exercise_responses', 'exercise_id', 'exercises', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing exercises_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'exercises_lesson_id_fkey') THEN
        INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'EXISTS', 'exercises', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') THEN
        INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'exercises', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id') THEN
        INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'exercises', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('lessons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'exercises', 'lesson_id', 'lessons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'exercises', 'lesson_id', 'lessons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'exercises' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'TYPE_MISMATCH', 'exercises', 'lesson_id', 'lessons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'lessons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('lessons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'exercises', 'lesson_id', 'lessons', 'id');
                ELSE
                    INSERT INTO results VALUES ('exercises_lesson_id_fkey', 'READY_TO_CREATE', 'exercises', 'lesson_id', 'lessons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ferramenta_registros_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'EXISTS', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('ferramenta_registros_cliente_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ferramenta_registros_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ferramenta_registros_ferramenta_id_fkey') THEN
        INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'EXISTS', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ferramenta_registros') THEN
        INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id') THEN
        INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ferramenta_registros' AND column_name = 'ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'TYPE_MISMATCH', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
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
                    INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('ferramenta_registros_ferramenta_id_fkey', 'READY_TO_CREATE', 'ferramenta_registros', 'ferramenta_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing fk_big5_caso
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_big5_caso') THEN
        INSERT INTO results VALUES ('fk_big5_caso', 'EXISTS', 'big5_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_registros') THEN
        INSERT INTO results VALUES ('fk_big5_caso', 'MISSING_SOURCE_TABLE', 'big5_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id') THEN
        INSERT INTO results VALUES ('fk_big5_caso', 'MISSING_SOURCE_COLUMN', 'big5_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('casos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('fk_big5_caso', 'MISSING_TARGET_TABLE', 'big5_registros', 'caso_id', 'casos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('fk_big5_caso', 'MISSING_TARGET_COLUMN', 'big5_registros', 'caso_id', 'casos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_registros' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('fk_big5_caso', 'TYPE_MISMATCH', 'big5_registros', 'caso_id', 'casos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'casos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('casos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('fk_big5_caso', 'TARGET_NOT_UNIQUE', 'big5_registros', 'caso_id', 'casos', 'id');
                ELSE
                    INSERT INTO results VALUES ('fk_big5_caso', 'READY_TO_CREATE', 'big5_registros', 'caso_id', 'casos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing fk_eneagrama_caso
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eneagrama_caso') THEN
        INSERT INTO results VALUES ('fk_eneagrama_caso', 'EXISTS', 'eneagrama_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_registros') THEN
        INSERT INTO results VALUES ('fk_eneagrama_caso', 'MISSING_SOURCE_TABLE', 'eneagrama_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id') THEN
        INSERT INTO results VALUES ('fk_eneagrama_caso', 'MISSING_SOURCE_COLUMN', 'eneagrama_registros', 'caso_id', 'casos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'casos') 
          AND NOT ('casos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('fk_eneagrama_caso', 'MISSING_TARGET_TABLE', 'eneagrama_registros', 'caso_id', 'casos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('fk_eneagrama_caso', 'MISSING_TARGET_COLUMN', 'eneagrama_registros', 'caso_id', 'casos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_registros' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('fk_eneagrama_caso', 'TYPE_MISMATCH', 'eneagrama_registros', 'caso_id', 'casos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'casos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('casos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('fk_eneagrama_caso', 'TARGET_NOT_UNIQUE', 'eneagrama_registros', 'caso_id', 'casos', 'id');
                ELSE
                    INSERT INTO results VALUES ('fk_eneagrama_caso', 'READY_TO_CREATE', 'eneagrama_registros', 'caso_id', 'casos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing formacao_modulos_formacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'formacao_modulos_formacao_id_fkey') THEN
        INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'EXISTS', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') THEN
        INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_SOURCE_TABLE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id') THEN
        INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('formacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_TARGET_TABLE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'formacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'TYPE_MISMATCH', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'formacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('formacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'TARGET_NOT_UNIQUE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('formacao_modulos_formacao_id_fkey', 'READY_TO_CREATE', 'formacao_modulos', 'formacao_id', 'formacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing founding_archetypes_distrito_principal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'founding_archetypes_distrito_principal_id_fkey') THEN
        INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'EXISTS', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') THEN
        INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_SOURCE_TABLE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id') THEN
        INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_SOURCE_COLUMN', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_TARGET_TABLE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'MISSING_TARGET_COLUMN', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'distrito_principal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'TYPE_MISMATCH', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
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
                    INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'TARGET_NOT_UNIQUE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('founding_archetypes_distrito_principal_id_fkey', 'READY_TO_CREATE', 'founding_archetypes', 'distrito_principal_id', 'city_districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing gestos_integracao_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'EXISTS', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('gestos_integracao_cliente_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing gestos_integracao_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'gestos_integracao_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'EXISTS', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'gestos_integracao') THEN
        INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('sessoes_casa_maquinas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'gestos_integracao' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'TYPE_MISMATCH', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessoes_casa_maquinas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessoes_casa_maquinas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
                ELSE
                    INSERT INTO results VALUES ('gestos_integracao_sessao_id_fkey', 'READY_TO_CREATE', 'gestos_integracao', 'sessao_id', 'sessoes_casa_maquinas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_encounters_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_encounters_group_id_fkey') THEN
        INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'EXISTS', 'group_encounters', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_encounters') THEN
        INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_encounters', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_encounters', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('therapy_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_encounters', 'group_id', 'therapy_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_encounters', 'group_id', 'therapy_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_encounters' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'TYPE_MISMATCH', 'group_encounters', 'group_id', 'therapy_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapy_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapy_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_encounters', 'group_id', 'therapy_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_encounters_group_id_fkey', 'READY_TO_CREATE', 'group_encounters', 'group_id', 'therapy_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_field_snapshots_circulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_circulo_id_fkey') THEN
        INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'EXISTS', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_SOURCE_TABLE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id') THEN
        INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'circulos_sagrados') 
          AND NOT ('circulos_sagrados' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_TARGET_TABLE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'circulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'circulos_sagrados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'circulos_sagrados' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('circulos_sagrados') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'TARGET_NOT_UNIQUE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_field_snapshots_circulo_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'circulo_id', 'circulos_sagrados', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_field_snapshots_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_field_snapshots_group_id_fkey') THEN
        INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'EXISTS', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_field_snapshots') THEN
        INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('therapeutic_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_field_snapshots' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'TYPE_MISMATCH', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapeutic_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapeutic_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_field_snapshots_group_id_fkey', 'READY_TO_CREATE', 'group_field_snapshots', 'group_id', 'therapeutic_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_members_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_client_id_fkey') THEN
        INSERT INTO results VALUES ('group_members_client_id_fkey', 'EXISTS', 'group_members', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        INSERT INTO results VALUES ('group_members_client_id_fkey', 'MISSING_SOURCE_TABLE', 'group_members', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('group_members_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_members', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_members_client_id_fkey', 'MISSING_TARGET_TABLE', 'group_members', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_members_client_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_members_client_id_fkey', 'TYPE_MISMATCH', 'group_members', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('group_members_client_id_fkey', 'TARGET_NOT_UNIQUE', 'group_members', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_members_client_id_fkey', 'READY_TO_CREATE', 'group_members', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_members_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_members_group_id_fkey') THEN
        INSERT INTO results VALUES ('group_members_group_id_fkey', 'EXISTS', 'group_members', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_members') THEN
        INSERT INTO results VALUES ('group_members_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_members', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('group_members_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_members', 'group_id', 'therapy_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapy_groups') 
          AND NOT ('therapy_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_members_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_members', 'group_id', 'therapy_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_members', 'group_id', 'therapy_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_members' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapy_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_members_group_id_fkey', 'TYPE_MISMATCH', 'group_members', 'group_id', 'therapy_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapy_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapy_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_members_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_members', 'group_id', 'therapy_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_members_group_id_fkey', 'READY_TO_CREATE', 'group_members', 'group_id', 'therapy_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_participants_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'EXISTS', 'group_participants', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'group_participants', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_participants', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'group_participants', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'group_participants', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_participants_cliente_id_fkey', 'READY_TO_CREATE', 'group_participants', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_participants_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_participants_group_id_fkey') THEN
        INSERT INTO results VALUES ('group_participants_group_id_fkey', 'EXISTS', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_participants') THEN
        INSERT INTO results VALUES ('group_participants_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('group_participants_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('therapeutic_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_participants_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_participants_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_participants' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_participants_group_id_fkey', 'TYPE_MISMATCH', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapeutic_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapeutic_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_participants_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_participants_group_id_fkey', 'READY_TO_CREATE', 'group_participants', 'group_id', 'therapeutic_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing group_sessions_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'EXISTS', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') THEN
        INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('therapeutic_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'TYPE_MISMATCH', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapeutic_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapeutic_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('group_sessions_group_id_fkey', 'READY_TO_CREATE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_arquetipo_registros_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'EXISTS', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros') THEN
        INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('labirinto_arquetipos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_arquetipos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_arquetipos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                ELSE
                    INSERT INTO results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_cenario_registros_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_metafora_id_fkey') THEN
        INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'EXISTS', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros') THEN
        INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id') THEN
        INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('labirinto_metaforas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_metaforas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_metaforas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
                ELSE
                    INSERT INTO results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'READY_TO_CREATE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_fase_ativa_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_fase_id_fkey') THEN
        INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'EXISTS', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa') THEN
        INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id') THEN
        INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('labirinto_fases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'TYPE_MISMATCH', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_fases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_fases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
                ELSE
                    INSERT INTO results VALUES ('heroina_fase_ativa_fase_id_fkey', 'READY_TO_CREATE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_ritual_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_ritual_registros_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'EXISTS', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros') THEN
        INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('labirinto_rituais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_rituais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_rituais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
                ELSE
                    INSERT INTO results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing imaginacao_ativa_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'EXISTS', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa') THEN
        INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'TYPE_MISMATCH', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('imaginacao_ativa_cliente_id_fkey', 'READY_TO_CREATE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing intervention_favorites_intervention_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'EXISTS', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intervention_favorites') THEN
        INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_SOURCE_TABLE', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id') THEN
        INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_SOURCE_COLUMN', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('interventions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_TARGET_TABLE', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'TYPE_MISMATCH', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'interventions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('interventions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'TARGET_NOT_UNIQUE', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
                ELSE
                    INSERT INTO results VALUES ('intervention_favorites_intervention_id_fkey', 'READY_TO_CREATE', 'intervention_favorites', 'intervention_id', 'interventions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing interventions_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interventions_district_id_fkey') THEN
        INSERT INTO results VALUES ('interventions_district_id_fkey', 'EXISTS', 'interventions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') THEN
        INSERT INTO results VALUES ('interventions_district_id_fkey', 'MISSING_SOURCE_TABLE', 'interventions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('interventions_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'interventions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('interventions_district_id_fkey', 'MISSING_TARGET_TABLE', 'interventions', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('interventions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'interventions', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('interventions_district_id_fkey', 'TYPE_MISMATCH', 'interventions', 'district_id', 'districts', 'id');
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
                    INSERT INTO results VALUES ('interventions_district_id_fkey', 'TARGET_NOT_UNIQUE', 'interventions', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('interventions_district_id_fkey', 'READY_TO_CREATE', 'interventions', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

END $$;
SELECT * FROM results;
