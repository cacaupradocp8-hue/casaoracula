-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 3 de 8)
-- Diagnóstico de FKs 101 a 150 (Total: 50)

DO $$
DECLARE
    v_total_analyzed INTEGER := 0;
    v_total_exists INTEGER := 0;
    v_total_ready INTEGER := 0;
    v_total_missing_source_table INTEGER := 0;
    v_total_missing_source_column INTEGER := 0;
    v_total_missing_target_table INTEGER := 0;
    v_total_missing_target_column INTEGER := 0;
    v_total_type_mismatch INTEGER := 0;
    v_total_target_not_unique INTEGER := 0;
    v_total_other INTEGER := 0;
    
    v_source_schema TEXT;
    v_source_table TEXT;
    v_target_schema TEXT;
    v_target_table TEXT;
    
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
    RAISE NOTICE 'Iniciando diagnóstico PARTE 3...';

    -- Analisando co_escutas_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') THEN
        RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_escutas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_escutas.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sessoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sessoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_escutas.sessao_id', v_source_type, 'co_sessoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sessoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sessoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_escutas_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_garden_flowers_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_garden_flowers';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_garden_flowers.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_garden_flowers.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_garden_flowers_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_garden_flowers_origem_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_garden_flowers';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id') THEN
        RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_garden_flowers.origem_registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_journey_records';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_journey_records.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_garden_flowers.origem_registro_id', v_source_type, 'co_journey_records.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_journey_records')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_journey_records.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_garden_flowers_origem_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_jardim_entries_jardim_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_jardim_id_fkey') THEN
        RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') THEN
        RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_jardim_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id') THEN
        RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_jardim_entries.jardim_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_jardins';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_jardins.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_jardim_entries.jardim_id', v_source_type, 'co_jardins.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_jardins')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_jardins.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_jardim_entries_jardim_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_journey_records_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_journey_records';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_journey_records.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_journey_records.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_journey_records_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_journey_records_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_journey_records';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_journey_records.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_journey_records.tool_id', v_source_type, 'sala_ferramentas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_journey_records_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_orientacao_sugestoes_ia_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_orientacao_sugestoes_ia';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_orientacao_sugestoes_ia.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_orientacao_sugestoes_ia.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_orientacao_sugestoes_ia_orientacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_orientacao_sugestoes_ia';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_orientacao_sugestoes_ia.orientacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_orientacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_orientacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_orientacao_sugestoes_ia.orientacao_id', v_source_type, 'co_orientacoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_orientacoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_orientacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_orientacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_orientacao_sugestoes_ia_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_orientacao_sugestoes_ia';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_orientacao_sugestoes_ia.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_orientacao_sugestoes_ia.session_id', v_source_type, 'sessions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_orientacao_sugestoes_ia_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_orientacoes_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_orientacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_orientacoes.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_orientacoes.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_orientacoes_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_orientacoes_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_orientacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_orientacoes.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_orientacoes.session_id', v_source_type, 'sessions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_orientacoes_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_passport_entries_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_passport_entries') THEN
        RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_passport_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_passport_entries.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_passport_entries.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_passport_entries_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_praticas_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') THEN
        RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_praticas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_praticas.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sessoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sessoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_praticas.sessao_id', v_source_type, 'co_sessoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sessoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sessoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_praticas_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_registros_simbolicos_jardim_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_jardim_id_fkey') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_registros_simbolicos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_registros_simbolicos.jardim_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_jardins';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_jardins.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_registros_simbolicos.jardim_id', v_source_type, 'co_jardins.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_jardins')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_jardins.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_registros_simbolicos_jardim_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_registros_simbolicos_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_registros_simbolicos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_registros_simbolicos.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sessoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sessoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_registros_simbolicos.sessao_id', v_source_type, 'co_sessoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sessoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sessoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_registros_simbolicos_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sessoes_jardim_ref_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_jardim_ref_id_fkey') THEN
        RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') THEN
        RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sessoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id') THEN
        RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sessoes.jardim_ref_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_jardins';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_jardins.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sessoes.jardim_ref_id', v_source_type, 'co_jardins.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_jardins')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_jardins.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sessoes_jardim_ref_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_options_proximo_step_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_proximo_step_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_options';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id') THEN
        RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_options.proximo_step_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_steps';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_steps.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_options.proximo_step_id', v_source_type, 'co_sim_steps.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_steps')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_steps.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_options_proximo_step_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_options_step_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_options';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id') THEN
        RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_options.step_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_steps';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_steps.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_options.step_id', v_source_type, 'co_sim_steps.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_steps')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_steps.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_options_step_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_progress_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_progress.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_progress.case_id', v_source_type, 'co_sim_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_progress_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_progress_escolha_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id') THEN
        RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_progress.escolha_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_options';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_options.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_progress.escolha_id', v_source_type, 'co_sim_options.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_options')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_options.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_progress_escolha_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_progress_step_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id') THEN
        RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_progress.step_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_steps';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_steps.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_progress.step_id', v_source_type, 'co_sim_steps.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_steps')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_steps.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_progress_step_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_sim_steps_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') THEN
        RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_sim_steps';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_sim_steps.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_sim_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_sim_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_sim_steps.case_id', v_source_type, 'co_sim_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_sim_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_sim_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_sim_steps_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_tool_flows_tool_destino_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_destino_id_fkey') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_tool_flows';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_tool_flows.tool_destino_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_tool_flows.tool_destino_id', v_source_type, 'tools.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_tool_flows_tool_destino_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_tool_flows_tool_origem_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_tool_flows';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id') THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_tool_flows.tool_origem_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_tool_flows.tool_origem_id', v_source_type, 'tools.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_tool_flows_tool_origem_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_tool_usage_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_usage') THEN
        RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_tool_usage';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_tool_usage.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_tool_usage.tool_id', v_source_type, 'sala_ferramentas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_tool_usage_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_training_attempts_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') THEN
        RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_training_attempts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_training_attempts.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_training_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_training_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_training_attempts.case_id', v_source_type, 'co_training_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_training_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_training_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_training_attempts_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_training_case_feedbacks_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks') THEN
        RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_training_case_feedbacks';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_training_case_feedbacks.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_training_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_training_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_training_case_feedbacks.case_id', v_source_type, 'co_training_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_training_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_training_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_training_case_feedbacks_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_training_case_possible_readings_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings') THEN
        RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_training_case_possible_readings';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_training_case_possible_readings.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_training_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_training_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_training_case_possible_readings.case_id', v_source_type, 'co_training_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_training_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_training_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_training_case_possible_readings_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_training_case_signals_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_signals') THEN
        RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_training_case_signals';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_training_case_signals.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_training_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_training_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_training_case_signals.case_id', v_source_type, 'co_training_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_training_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_training_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_training_case_signals_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_training_progress_ultimo_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') THEN
        RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_training_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id') THEN
        RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_training_progress.ultimo_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_training_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_training_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_training_progress.ultimo_case_id', v_source_type, 'co_training_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_training_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_training_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_training_progress_ultimo_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_travessia_encontros_travessia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_fkey') THEN
        RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') THEN
        RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_travessia_encontros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id') THEN
        RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_travessia_encontros.travessia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_travessia_encontros.travessia_id', v_source_type, 'co_travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_travessia_encontros_travessia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_travessia_respostas_encontro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_travessia_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_travessia_respostas.encontro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_travessia_encontros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_travessia_encontros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_travessia_respostas.encontro_id', v_source_type, 'co_travessia_encontros.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_travessia_encontros')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_travessia_encontros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_travessia_respostas_encontro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_travessia_respostas_travessia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_travessia_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id') THEN
        RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_travessia_respostas.travessia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_travessia_respostas.travessia_id', v_source_type, 'co_travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_travessia_respostas_travessia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_workspace_users_workspace_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_fkey') THEN
        RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspace_users') THEN
        RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_workspace_users';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id') THEN
        RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_workspace_users.workspace_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_workspaces';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_workspaces.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_workspace_users.workspace_id', v_source_type, 'co_workspaces.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_workspaces')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_workspaces.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_workspace_users_workspace_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando collective_bed_entries_bed_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_bed_id_fkey') THEN
        RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: MISSING_SOURCE_TABLE | Table: collective_bed_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id') THEN
        RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: collective_bed_entries.bed_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: MISSING_TARGET_TABLE | Table: collective_beds';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: MISSING_TARGET_COLUMN | Column: collective_beds.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'collective_bed_entries.bed_id', v_source_type, 'collective_beds.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.collective_beds')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: TARGET_NOT_UNIQUE | Column: collective_beds.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: collective_bed_entries_bed_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando collective_bed_entries_season_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: MISSING_SOURCE_TABLE | Table: collective_bed_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id') THEN
        RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: collective_bed_entries.season_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'collective_bed_entries.season_id', v_source_type, 'oracular_seasons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.oracular_seasons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: collective_bed_entries_season_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando collective_beds_season_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_beds_season_id_fkey') THEN
        RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') THEN
        RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: MISSING_SOURCE_TABLE | Table: collective_beds';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id') THEN
        RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: collective_beds.season_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'collective_beds.season_id', v_source_type, 'oracular_seasons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.oracular_seasons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: collective_beds_season_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_comments_post_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_post_id_fkey') THEN
        RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') THEN
        RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_comments';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id') THEN
        RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_comments.post_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_posts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_posts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_comments.post_id', v_source_type, 'community_posts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_posts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_posts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_comments_post_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_event_participants_event_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') THEN
        RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_event_participants';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id') THEN
        RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_event_participants.event_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_events') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_events';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_events.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_event_participants.event_id', v_source_type, 'community_events.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_events')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_events.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_event_participants_event_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_group_members_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_group_id_fkey') THEN
        RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_group_members') THEN
        RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_group_members';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_group_members.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_group_members.group_id', v_source_type, 'community_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_group_members_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_likes_post_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_post_id_fkey') THEN
        RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_likes') THEN
        RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_likes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id') THEN
        RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_likes.post_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_posts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_posts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_likes.post_id', v_source_type, 'community_posts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_posts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_posts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_likes_post_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_topic_replies_topic_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topic_replies_topic_id_fkey') THEN
        RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topic_replies') THEN
        RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_topic_replies';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id') THEN
        RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_topic_replies.topic_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_topics';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_topics.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_topic_replies.topic_id', v_source_type, 'community_topics.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_topics')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_topics.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_topic_replies_topic_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando community_topics_forum_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_forum_id_fkey') THEN
        RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') THEN
        RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: MISSING_SOURCE_TABLE | Table: community_topics';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id') THEN
        RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: community_topics.forum_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_forums') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: MISSING_TARGET_TABLE | Table: community_forums';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: MISSING_TARGET_COLUMN | Column: community_forums.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'community_topics.forum_id', v_source_type, 'community_forums.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.community_forums')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: TARGET_NOT_UNIQUE | Column: community_forums.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: community_topics_forum_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando conselho_partes_internas_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas') THEN
        RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: conselho_partes_internas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: conselho_partes_internas.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'conselho_partes_internas.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: conselho_partes_internas_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando content_blocks_agente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'content_blocks_agente_id_fkey') THEN
        RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_blocks') THEN
        RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: content_blocks';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id') THEN
        RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: content_blocks.agente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: MISSING_TARGET_TABLE | Table: agentes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: agentes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'content_blocks' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'content_blocks.agente_id', v_source_type, 'agentes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: agentes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: content_blocks_agente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando conteudo_aulas_travessia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_aulas_travessia_id_fkey') THEN
        RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') THEN
        RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: conteudo_aulas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id') THEN
        RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: conteudo_aulas.travessia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: MISSING_TARGET_TABLE | Table: conteudo_travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: conteudo_travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'conteudo_aulas.travessia_id', v_source_type, 'conteudo_travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.conteudo_travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: conteudo_travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: conteudo_aulas_travessia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando conteudo_travessias_sala_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conteudo_travessias_sala_id_fkey') THEN
        RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') THEN
        RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: MISSING_SOURCE_TABLE | Table: conteudo_travessias';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id') THEN
        RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: conteudo_travessias.sala_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: MISSING_TARGET_TABLE | Table: salas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: MISSING_TARGET_COLUMN | Column: salas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'conteudo_travessias.sala_id', v_source_type, 'salas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.salas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: TARGET_NOT_UNIQUE | Column: salas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: conteudo_travessias_sala_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando contos_clinicos_audio_padrao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contos_clinicos_audio_padrao_id_fkey') THEN
        RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') THEN
        RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: contos_clinicos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id') THEN
        RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: contos_clinicos.audio_padrao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: MISSING_TARGET_TABLE | Table: audio_assets';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: audio_assets.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'audio_padrao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'contos_clinicos.audio_padrao_id', v_source_type, 'audio_assets.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: audio_assets.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: contos_clinicos_audio_padrao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando corpo_inconsciente_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'corpo_inconsciente_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente') THEN
        RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: corpo_inconsciente';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: corpo_inconsciente.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'corpo_inconsciente' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'corpo_inconsciente.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: corpo_inconsciente_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando course_enrollments_course_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'course_enrollments_course_id_fkey') THEN
        RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'course_enrollments') THEN
        RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: MISSING_SOURCE_TABLE | Table: course_enrollments';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id') THEN
        RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: course_enrollments.course_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: MISSING_TARGET_TABLE | Table: courses';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: MISSING_TARGET_COLUMN | Column: courses.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'course_enrollments' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'course_enrollments.course_id', v_source_type, 'courses.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.courses')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: TARGET_NOT_UNIQUE | Column: courses.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: course_enrollments_course_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 3):';
    RAISE NOTICE 'Total analisadas nesta parte: %', v_total_analyzed;
    RAISE NOTICE 'Total já existentes (EXISTS): %', v_total_exists;
    RAISE NOTICE 'Total prontas para criar (READY_TO_CREATE): %', v_total_ready;
    RAISE NOTICE 'Bloqueadas - Tabela Origem Ausente: %', v_total_missing_source_table;
    RAISE NOTICE 'Bloqueadas - Coluna Origem Ausente: %', v_total_missing_source_column;
    RAISE NOTICE 'Bloqueadas - Tabela Referência Ausente: %', v_total_missing_target_table;
    RAISE NOTICE 'Bloqueadas - Coluna Referência Ausente: %', v_total_missing_target_column;
    RAISE NOTICE 'Bloqueadas - Incompatibilidade de Tipos: %', v_total_type_mismatch;
    RAISE NOTICE 'Bloqueadas - Referência não é Única/PK: %', v_total_target_not_unique;
    RAISE NOTICE '--------------------------------------------------';
END $$;
