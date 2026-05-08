-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 6 de 8)
-- Diagnóstico de FKs 251 a 300 (Total: 50)

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
    RAISE NOTICE 'Iniciando diagnóstico PARTE 6...';

    -- Analisando message_logs_campaign_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_campaign_id_fkey') THEN
        RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: MISSING_SOURCE_TABLE | Table: message_logs';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id') THEN
        RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: message_logs.campaign_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_campaigns') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: MISSING_TARGET_TABLE | Table: message_campaigns';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: MISSING_TARGET_COLUMN | Column: message_campaigns.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'message_logs.campaign_id', v_source_type, 'message_campaigns.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: TARGET_NOT_UNIQUE | Column: message_campaigns.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: message_logs_campaign_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando message_logs_template_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: MISSING_SOURCE_TABLE | Table: message_logs';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id') THEN
        RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: message_logs.template_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_templates') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: MISSING_TARGET_TABLE | Table: message_templates';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: MISSING_TARGET_COLUMN | Column: message_templates.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'message_logs.template_id', v_source_type, 'message_templates.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: TARGET_NOT_UNIQUE | Column: message_templates.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: message_logs_template_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mind_map_nodes_map_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_map_id_fkey') THEN
        RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mind_map_nodes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id') THEN
        RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mind_map_nodes.map_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: MISSING_TARGET_TABLE | Table: mind_maps';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: MISSING_TARGET_COLUMN | Column: mind_maps.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mind_map_nodes.map_id', v_source_type, 'mind_maps.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: TARGET_NOT_UNIQUE | Column: mind_maps.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mind_map_nodes_map_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mind_map_nodes_parent_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mind_map_nodes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id') THEN
        RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mind_map_nodes.parent_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: MISSING_TARGET_TABLE | Table: mind_map_nodes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: MISSING_TARGET_COLUMN | Column: mind_map_nodes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mind_map_nodes.parent_id', v_source_type, 'mind_map_nodes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: TARGET_NOT_UNIQUE | Column: mind_map_nodes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mind_map_nodes_parent_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mind_maps_owner_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') THEN
        RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mind_maps';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id') THEN
        RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mind_maps.owner_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mind_maps.owner_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mind_maps_owner_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando missoes_aula_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: MISSING_SOURCE_TABLE | Table: missoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id') THEN
        RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: missoes.aula_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: MISSING_TARGET_TABLE | Table: aulas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: MISSING_TARGET_COLUMN | Column: aulas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'missoes.aula_id', v_source_type, 'aulas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: TARGET_NOT_UNIQUE | Column: aulas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: missoes_aula_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando missoes_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_portal_id_fkey') THEN
        RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: missoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: missoes.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'missoes.portal_id', v_source_type, 'portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: missoes_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narrative_maps_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narrative_maps';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narrative_maps.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narrative_maps.case_id', v_source_type, 'session_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narrative_maps_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narrative_maps_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narrative_maps';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narrative_maps.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narrative_maps.client_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narrative_maps_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narrative_maps_therapist_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narrative_maps';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id') THEN
        RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narrative_maps.therapist_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narrative_maps.therapist_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narrative_maps_therapist_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narroterapia_estudos_audio_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos') THEN
        RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narroterapia_estudos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id') THEN
        RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narroterapia_estudos.audio_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: MISSING_TARGET_TABLE | Table: audio_assets';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: MISSING_TARGET_COLUMN | Column: audio_assets.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narroterapia_estudos.audio_id', v_source_type, 'audio_assets.id', v_target_type;
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
                    RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: TARGET_NOT_UNIQUE | Column: audio_assets.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narroterapia_estudos_audio_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narroterapia_reacoes_simbolicas_audio_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narroterapia_reacoes_simbolicas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narroterapia_reacoes_simbolicas.audio_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: MISSING_TARGET_TABLE | Table: audio_assets';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: MISSING_TARGET_COLUMN | Column: audio_assets.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narroterapia_reacoes_simbolicas.audio_id', v_source_type, 'audio_assets.id', v_target_type;
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
                    RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: TARGET_NOT_UNIQUE | Column: audio_assets.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_audio_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando narroterapia_reacoes_simbolicas_conto_clinico_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: MISSING_SOURCE_TABLE | Table: narroterapia_reacoes_simbolicas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id') THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: narroterapia_reacoes_simbolicas.conto_clinico_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: MISSING_TARGET_TABLE | Table: contos_clinicos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: MISSING_TARGET_COLUMN | Column: contos_clinicos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'narroterapia_reacoes_simbolicas.conto_clinico_id', v_source_type, 'contos_clinicos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: TARGET_NOT_UNIQUE | Column: contos_clinicos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: narroterapia_reacoes_simbolicas_conto_clinico_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_cards_archetype_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_archetype_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_cards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id') THEN
        RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_cards.archetype_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: MISSING_TARGET_TABLE | Table: founding_archetypes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: MISSING_TARGET_COLUMN | Column: founding_archetypes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_cards.archetype_id', v_source_type, 'founding_archetypes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: TARGET_NOT_UNIQUE | Column: founding_archetypes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_cards_archetype_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_cards_deck_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_cards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id') THEN
        RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_cards.deck_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_decks';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_decks.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_cards.deck_id', v_source_type, 'oracle_decks.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_decks.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_cards_deck_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_cards_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_cards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_cards.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: city_districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: city_districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_cards.district_id', v_source_type, 'city_districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: city_districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_cards_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_cards_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_cards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_cards.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_cards.tool_id', v_source_type, 'tools.id', v_target_type;
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
                    RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_cards_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_categories_oracle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_categories') THEN
        RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_categories';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id') THEN
        RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_categories.oracle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_decks';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_decks.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_categories.oracle_id', v_source_type, 'oracle_decks.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_decks.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_categories_oracle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_draws_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_client_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_draws.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_clients';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_clients.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_draws.client_id', v_source_type, 'oracle_clients.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_clients.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_draws_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_draws_oracle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id') THEN
        RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_draws.oracle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_decks';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_decks.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_draws.oracle_id', v_source_type, 'oracle_decks.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_decks.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_draws_oracle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_draws_spread_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id') THEN
        RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_draws.spread_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_spreads';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_spreads.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_draws.spread_id', v_source_type, 'oracle_spreads.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_spreads.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_draws_spread_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_spread_positions_spread_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spread_positions_spread_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions') THEN
        RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_spread_positions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id') THEN
        RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_spread_positions.spread_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_spreads';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_spreads.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_spread_positions.spread_id', v_source_type, 'oracle_spreads.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_spreads.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_spread_positions_spread_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_spreads_oracle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') THEN
        RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_spreads';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id') THEN
        RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_spreads.oracle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracle_decks';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracle_decks.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_spreads.oracle_id', v_source_type, 'oracle_decks.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracle_decks.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_spreads_oracle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oracle_usage_stats_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats') THEN
        RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oracle_usage_stats';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oracle_usage_stats.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oracle_usage_stats.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oracle_usage_stats_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_aplicacoes_pergunta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') THEN
        RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_aplicacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id') THEN
        RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_aplicacoes.pergunta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_perguntas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_perguntas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_aplicacoes.pergunta_id', v_source_type, 'oraculo_perguntas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_perguntas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_aplicacoes_pergunta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_favoritos_pergunta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_pergunta_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos') THEN
        RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_favoritos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id') THEN
        RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_favoritos.pergunta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_perguntas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_perguntas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_favoritos.pergunta_id', v_source_type, 'oraculo_perguntas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_perguntas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_favoritos_pergunta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_aplicacoes_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_aplicacoes_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes') THEN
        RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_aplicacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_aplicacoes.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_aplicacoes.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_aplicacoes_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_audios_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios') THEN
        RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_audios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_audios.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_audios.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_audios_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_essencia_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia') THEN
        RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_essencia';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_essencia.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_essencia.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_essencia_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_ferramenta_campos_ferramenta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_ferramenta_campos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_ferramenta_campos.ferramenta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portal_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portal_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_ferramenta_campos.ferramenta_id', v_source_type, 'oraculo_portal_ferramentas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portal_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_ferramenta_campos_ferramenta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_ferramentas_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_ferramentas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_ferramentas.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_ferramentas.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_ferramentas_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_forja_erros_forja_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_forja_erros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_forja_erros.forja_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portal_forjas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portal_forjas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_forja_erros.forja_id', v_source_type, 'oraculo_portal_forjas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portal_forjas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_forja_erros_forja_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_forja_passos_forja_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_forja_passos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_forja_passos.forja_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portal_forjas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portal_forjas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_forja_passos.forja_id', v_source_type, 'oraculo_portal_forjas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portal_forjas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_forja_passos_forja_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_forjas_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') THEN
        RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_forjas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_forjas.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_forjas.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_forjas_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_jardins_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins') THEN
        RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_jardins';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_jardins.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_jardins.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_jardins_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_laboratorio_passos_laboratorio_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_laboratorio_passos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_laboratorio_passos.laboratorio_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portal_laboratorios';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portal_laboratorios.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_laboratorio_passos.laboratorio_id', v_source_type, 'oraculo_portal_laboratorios.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portal_laboratorios.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_laboratorio_passos_laboratorio_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_laboratorios_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_laboratorios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_laboratorios.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_laboratorios.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_laboratorios_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_materiais_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais') THEN
        RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_materiais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_materiais.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_materiais.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_materiais_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_narroterapia_perguntas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_narroterapia_perguntas.narroterapia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portal_narroterapia';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portal_narroterapia.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_narroterapia_perguntas.narroterapia_id', v_source_type, 'oraculo_portal_narroterapia.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.oraculo_portal_narroterapia')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portal_narroterapia.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_narroterapia_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_narroterapia';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_narroterapia.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_narroterapia.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_narroterapia_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando oraculo_portal_riscos_eticos_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos') THEN
        RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: oraculo_portal_riscos_eticos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: oraculo_portal_riscos_eticos.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: oraculo_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oraculo_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'oraculo_portal_riscos_eticos.portal_id', v_source_type, 'oraculo_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oraculo_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: oraculo_portal_riscos_eticos_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portais_jornada_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_jornada_id_fkey') THEN
        RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id') THEN
        RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portais.jornada_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: MISSING_TARGET_TABLE | Table: jornadas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: MISSING_TARGET_COLUMN | Column: jornadas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portais.jornada_id', v_source_type, 'jornadas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.jornadas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: TARGET_NOT_UNIQUE | Column: jornadas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portais_jornada_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portais_modulo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id') THEN
        RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portais.modulo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modulos_formativos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: MISSING_TARGET_TABLE | Table: modulos_formativos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: modulos_formativos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portais.modulo_id', v_source_type, 'modulos_formativos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.modulos_formativos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: modulos_formativos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portais_modulo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_junguiano_modulos_config_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') THEN
        RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_junguiano_modulos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id') THEN
        RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_junguiano_modulos.config_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: MISSING_TARGET_TABLE | Table: portal_junguiano_config';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: MISSING_TARGET_COLUMN | Column: portal_junguiano_config.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_junguiano_modulos.config_id', v_source_type, 'portal_junguiano_config.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.portal_junguiano_config')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: TARGET_NOT_UNIQUE | Column: portal_junguiano_config.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_junguiano_modulos_config_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_junguiano_portais_modulo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') THEN
        RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_junguiano_portais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id') THEN
        RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_junguiano_portais.modulo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: MISSING_TARGET_TABLE | Table: portal_junguiano_modulos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: portal_junguiano_modulos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_junguiano_portais.modulo_id', v_source_type, 'portal_junguiano_modulos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.portal_junguiano_modulos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: portal_junguiano_modulos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_junguiano_portais_modulo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_junguiano_progresso_config_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso') THEN
        RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_junguiano_progresso';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id') THEN
        RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_junguiano_progresso.config_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: MISSING_TARGET_TABLE | Table: portal_junguiano_config';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: MISSING_TARGET_COLUMN | Column: portal_junguiano_config.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_junguiano_progresso.config_id', v_source_type, 'portal_junguiano_config.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.portal_junguiano_config')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: TARGET_NOT_UNIQUE | Column: portal_junguiano_config.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_junguiano_progresso_config_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_junguiano_registros_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros') THEN
        RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_junguiano_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_junguiano_registros.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: portal_junguiano_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: portal_junguiano_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_junguiano_registros.portal_id', v_source_type, 'portal_junguiano_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.portal_junguiano_portais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: portal_junguiano_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_junguiano_registros_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_progress_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_progress') THEN
        RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_progress.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_progress.portal_id', v_source_type, 'clube_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_portais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_progress_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando portal_salas_sala_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_salas') THEN
        RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: MISSING_SOURCE_TABLE | Table: portal_salas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id') THEN
        RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: portal_salas.sala_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: MISSING_TARGET_TABLE | Table: salas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: MISSING_TARGET_COLUMN | Column: salas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'portal_salas.sala_id', v_source_type, 'salas.id', v_target_type;
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
                    RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: TARGET_NOT_UNIQUE | Column: salas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: portal_salas_sala_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando post_session_closures_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: post_session_closures';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: post_session_closures.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'post_session_closures.case_id', v_source_type, 'session_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
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
                    RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: post_session_closures_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 6):';
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
